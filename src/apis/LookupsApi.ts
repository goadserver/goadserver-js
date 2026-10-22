/* tslint:disable */
/* eslint-disable */
/**
 * GoAdServer Public API
 * Public REST API for advertisers and publishers on the GoAdServer platform.  **Authentication.** All endpoints (except `/api/public/_*`) require an API key passed as `Authorization: Bearer gas_live_…`. Create and manage keys in your account settings — each key has its own scopes, optional resource pinning, optional IP allowlist, and per-key rate limit.  **Apps (OAuth 2.0).** A tool other people connect uses an app token instead: authorization code + PKCE at `/oauth/authorize`, tokens from `/api/public/oauth/token`, passed as `Authorization: Bearer oat_…` on the same endpoints with the same scopes. See the [Build an integration](/api/docs/integrations) guide.  **System rules apply over API rules.** The public API never lets a key bypass restrictions the same user faces in the panel:  - **Source names** (`stats_source_names` right). When the user lacks   this right, advertiser stats responses return `{id, name}` with   `name` equal to the id — no human label leaks through. - **SubID encoding** (`modules.global.subid_encoding`). When enabled   for the system, the user only ever sees encoded SubIDs in the panel.   The API mirrors this both ways: `subid_excl`/`subid_incl` filter   endpoints accept the encoded form on write (decoded server-side   before storage) and emit the encoded form on read. A plain SubID   sent on write is stored as sent — a value is decoded only when it is   a genuine encoded token. - **Module gating.** Endpoints whose module is disabled for the   tenant don\'t appear in the spec or routes.txt at all.  **Rate limits.** Every response to an API key or app token carries the caller\'s budget for the current one-minute window:  | Header | Meaning | |---|---| | `X-RateLimit-Limit` | Requests per minute for this key (its `rate_limit_rpm`, default 60; an app\'s per-installation limit for app tokens). | | `X-RateLimit-Remaining` | Calls left in the current window. | | `X-RateLimit-Reset` | Unix seconds at which the window resets. | | `Retry-After` | On `429 rate_limited` only: seconds until a retry can succeed. |  Windows are fixed and start with the first call, so `Reset` is exact. The MCP endpoint (`POST /api/v1/mcp`) is charged per `tools/call` against its own bucket (default 240/min), and its response headers report that bucket; an exhausted MCP bucket answers the tool call with an error result rather than an HTTP 429, and the HTTP response then carries `Retry-After`.  **Idempotent writes.** Send `Idempotency-Key: <1–255 printable ASCII characters>` (a UUID is ideal) on a `POST` or `PATCH` to make a retry safe. For 24 hours per key (per app installation for app tokens):  - the first request runs and its response — status, body, `Content-Type`,   `Location`, `ETag` — is stored; - the same key with the same method, path, query and body replays that   response without running anything, adding `Idempotent-Replayed: true`; - the same key with a different request is `422 idempotency_key_reused`; - the same key while the first request is still running is   `409 idempotency_key_in_progress` (with `Retry-After: 1`).  `5xx` results are not stored — the key is released and a retry runs again. Bodies over 32 MB cannot carry the header (`413`). An invalid key is `400 invalid_idempotency_key`.  **Concurrency control (ETag / If-Match).** Every JSON `GET` response (up to 1 MB) carries a weak `ETag`, a hash of the body. Send it back:  - `If-None-Match: <etag>` on a `GET` — `304 Not Modified` when unchanged; - `If-Match: <etag>` on a `PATCH`, `PUT` or `DELETE` — the server reads the   resource\'s current representation (the `GET` of the same path, or of the   nearest parent path that has a `GET`: `PATCH …/campaigns/ron/7/active` is   checked against `GET …/campaigns/ron/7`) and answers   `412 precondition_failed` when it no longer matches, with the current tag in   `ETag` and `current_etag`. `If-Match: *` only requires the resource to   exist. A resource with no readable representation is also `412`.  The check is optimistic, not a lock: it closes the read-modify-write window two agents (or an agent and a person in the panel) would otherwise race in. Fields that change on their own (live spend counters) change the tag too — re-read and retry. A write response carries no new ETag; `GET` again.  **Strict fields.** Unknown body fields are a client error, not something to ignore: a request that sends a field the endpoint does not accept gets `422 unknown_fields` naming it. This is the default for keys created from 2026-10-12 (the key\'s `strict_fields` setting, shown on the key screen); older keys keep ignoring unknown fields (except on the few endpoints that have always refused them — the budget and on/off toggles). Override per request with `?strict=1` (reject) or `?strict=0` (ignore, everywhere). App tokens default to ignoring unknown fields; `?strict=1` opts in.  **Errors.** Every non-2xx response has the same shape:  ```json { \"error\": \"validation_error\", \"message\": \"Name is required.\", \"errors\": { \"name\": [\"Name is required.\"] } } ```  `error` is a stable machine-readable code — branch on it, never on `message`. `errors` (field → messages) appears on field-level validation failures; some codes add their own members (`scope`, `accepted_scopes`, `unknown_fields`, `current_etag`). Codes:  | Status | Codes | |---|---| | 400 | `bad_request`, `invalid_idempotency_key`, `invalid_body` | | 401 | `unauthenticated`, `invalid_api_key`, `revoked_api_key`, `expired_api_key`, `invalid_token`, `revoked_token`, `expired_token`, `user_not_found`, `account_deleted`, `account_disabled`, `admin_key_on_user_api`, `user_key_on_admin_api` | | 403 | `forbidden`, `missing_scope`, `forbidden_resource`, `ip_not_allowed`, `api_disabled`, `systemid_mismatch`, `endpoint_not_api_accessible`, `oauth_token_wrong_surface`, `mcp_not_enabled_for_app` | | 404 | `not_found` (also a disabled module or missing right — see ModuleDisabled) | | 405 | `method_not_allowed` — the `Allow` header (and the message) lists the methods the path does accept | | 409 | `conflict`, `idempotency_key_in_progress`, and resource-specific conflicts (e.g. `email_exists`) | | 412 | `precondition_failed` | | 413 | `payload_too_large` | | 422 | `validation_error`, `unknown_fields`, `idempotency_key_reused` | | 429 | `rate_limited` | | 5xx | `server_error`, `service_unavailable`, `bad_gateway`, `gateway_timeout` |  Endpoint-specific codes are listed on the endpoint. A response that would otherwise lack a code gets the generic one for its status from this table.  **Client SDKs.** Each SDK is generated from this spec and published as a public GitHub repository under the `goadserver` organization. The same tarball is also embedded in the API server and downloadable from `/api/public/sdk/<lang>.tgz` — useful when GitHub is unreachable.  > **Per-network host.** The default `https://up.go-adserver.com` > baked into the published SDKs is a reference host. Every white-label > tenant runs on its own panel domain — override the host on first use > (`setHost()` / `Configuration.host` / `basePath` etc.). Or, fetch the > spec from your own tenant (`/api/public/openapi.yaml` returns it with > *your* hostname as the default) and regenerate the SDK locally — the > regenerated client has your URL baked in.  - **PHP** — `github.com/goadserver/goadserver-php`   (namespace `GoAdServer\\Api`, composer name `goadserver/sdk`).    ```bash   composer config repositories.goadserver vcs https://github.com/goadserver/goadserver-php   composer require goadserver/sdk:dev-main   ```    ```php   $cfg = GoAdServer\\Api\\Configuration::getDefaultConfiguration()           ->setHost(\'https://up.go-adserver.com\')           ->setAccessToken(\'gas_live_…\');   $api = new GoAdServer\\Api\\Api\\AccountAPIApi(null, $cfg);   $me  = $api->apiV1AccountGet();   ```  - **Go** — `github.com/goadserver/goadserver-go`.    ```bash   go get github.com/goadserver/goadserver-go@latest   ```    ```go   import gas \"github.com/goadserver/goadserver-go\"    cfg := gas.NewConfiguration()   cfg.Servers = gas.ServerConfigurations{{URL: \"https://up.go-adserver.com\"}}   cli := gas.NewAPIClient(cfg)   ctx := context.WithValue(context.Background(),       gas.ContextAccessToken, \"gas_live_…\")   me, _, err := cli.AccountAPI.ApiV1AccountGet(ctx).Execute()   ```  - **Python** — `github.com/goadserver/goadserver-python` (package   `goadserver`). Pulls `pydantic` + `urllib3` automatically.    ```bash   pip install git+https://github.com/goadserver/goadserver-python.git   ```    ```python   from goadserver import ApiClient, Configuration   from goadserver.api import AccountApi, CampaignsApi    cfg = Configuration(host=\"https://up.go-adserver.com\")   cfg.access_token = \"gas_live_…\"   client = ApiClient(cfg)    me = AccountApi(client).api_v1_account_get()   camps = CampaignsApi(client).api_v1_campaigns_get(per_page=10)   ```  - **JavaScript / TypeScript** — `github.com/goadserver/goadserver-js`   (npm name `goadserver-sdk`, generator `typescript-fetch`).    ```bash   npm install github:goadserver/goadserver-js   ```    ```ts   import { Configuration, AccountApi, CampaignsApi }     from \"goadserver-sdk\";    const cfg = new Configuration({     basePath: \"https://up.go-adserver.com\",     accessToken: \"gas_live_…\",   });    const me   = await new AccountApi(cfg).apiV1AccountGet();   const list = await new CampaignsApi(cfg).apiV1CampaignsGet({ perPage: 10 });   ```    The CJS build is broadly compatible (Node + bundlers); the ESM   build is missing trailing `.js` extensions in its imports, a known   `typescript-fetch` quirk — most consumers use CJS.  **Offline / firewalled install.** If the customer\'s network can\'t reach GitHub, every SDK\'s source is also served as a tarball from the API host:  ```bash curl -O https://up.go-adserver.com/api/public/sdk/python.tgz tar xzf python.tgz && pip install ./python ```  Round-trip smoke tests for all four SDKs live at `clients/_smoke/` in the platform repo. 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ApiV1LookupsAdspaceTypesGet200Response,
  ApiV1LookupsBannerSizesGet200Response,
  ApiV1LookupsBrowsersGet200Response,
  ApiV1LookupsCarriersGet200Response,
  ApiV1LookupsCategoriesGet200Response,
  ApiV1LookupsDeviceTypesGet200Response,
  ApiV1LookupsRegionsGet200Response,
  ApiV1LookupsWebsiteLanguagesGet200Response,
} from '../models/index';
import {
    ApiV1LookupsAdspaceTypesGet200ResponseFromJSON,
    ApiV1LookupsAdspaceTypesGet200ResponseToJSON,
    ApiV1LookupsBannerSizesGet200ResponseFromJSON,
    ApiV1LookupsBannerSizesGet200ResponseToJSON,
    ApiV1LookupsBrowsersGet200ResponseFromJSON,
    ApiV1LookupsBrowsersGet200ResponseToJSON,
    ApiV1LookupsCarriersGet200ResponseFromJSON,
    ApiV1LookupsCarriersGet200ResponseToJSON,
    ApiV1LookupsCategoriesGet200ResponseFromJSON,
    ApiV1LookupsCategoriesGet200ResponseToJSON,
    ApiV1LookupsDeviceTypesGet200ResponseFromJSON,
    ApiV1LookupsDeviceTypesGet200ResponseToJSON,
    ApiV1LookupsRegionsGet200ResponseFromJSON,
    ApiV1LookupsRegionsGet200ResponseToJSON,
    ApiV1LookupsWebsiteLanguagesGet200ResponseFromJSON,
    ApiV1LookupsWebsiteLanguagesGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1LookupsAdzonesGetRequest {
    term?: string;
    bulk?: string;
}

export interface ApiV1LookupsBrowsersGetRequest {
    deviceTypeIds?: string;
}

export interface ApiV1LookupsCategoriesGetRequest {
    mainCatid?: number;
}

export interface ApiV1LookupsDomainsGetRequest {
    bulk: string;
}

export interface ApiV1LookupsIspsGetRequest {
    term?: string;
    bulk?: string;
}

export interface ApiV1LookupsOperatingSystemsGetRequest {
    deviceTypeIds?: string;
}

export interface ApiV1LookupsPublishersGetRequest {
    term?: string;
    bulk?: string;
}

export interface ApiV1LookupsRegionsGetRequest {
    parentId?: number;
    ids?: string;
}

/**
 * 
 */
export class LookupsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1LookupsAdspaceTypesGet without sending the request
     */
    async apiV1LookupsAdspaceTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/adspace-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the adspace types exposable via the public API for the current tenant + caller. Filters applied (same as the panel adspace-create page):  - `is_active = true` — tenant has enabled the type - `in_api = true` — type is exposable via the public API - `mod_enabled` chain enabled for the user - `need_rights` gate satisfied (when set)  Each entry carries the metadata needed to drive a create form:  - `id` / `key` / `name` / `adtype_id` - `settings_key` — the body key for the type-specific block   on `POST /api/v1/adspaces/{type}` (e.g. `banner_settings`,   `pop_settings`, `native_settings`). Empty string means the   type takes no nested settings block. - `selling_types` — `[\"ron\"]`, `[\"ron\",\"cpm\"]`, etc. - `use_min_price` / `use_smartzone` / `has_own_ads` / `has_preview` - `options` — config-driven flag bag (boolean toggles, banner-size   selects, country exclude lists, …) that map to top-level body   fields on create. The same `options` shape is mirrored on   `GET /api/v1/adspaces/{type}/_schema`.  Use the `key` value as the `{type}` path parameter on `GET /api/v1/adspaces/{type}/_schema` and `POST /api/v1/adspaces/{type}`. 
     * Adspace types the caller can publish on this tenant.
     */
    async apiV1LookupsAdspaceTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsAdspaceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsAdspaceTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsAdspaceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the adspace types exposable via the public API for the current tenant + caller. Filters applied (same as the panel adspace-create page):  - `is_active = true` — tenant has enabled the type - `in_api = true` — type is exposable via the public API - `mod_enabled` chain enabled for the user - `need_rights` gate satisfied (when set)  Each entry carries the metadata needed to drive a create form:  - `id` / `key` / `name` / `adtype_id` - `settings_key` — the body key for the type-specific block   on `POST /api/v1/adspaces/{type}` (e.g. `banner_settings`,   `pop_settings`, `native_settings`). Empty string means the   type takes no nested settings block. - `selling_types` — `[\"ron\"]`, `[\"ron\",\"cpm\"]`, etc. - `use_min_price` / `use_smartzone` / `has_own_ads` / `has_preview` - `options` — config-driven flag bag (boolean toggles, banner-size   selects, country exclude lists, …) that map to top-level body   fields on create. The same `options` shape is mirrored on   `GET /api/v1/adspaces/{type}/_schema`.  Use the `key` value as the `{type}` path parameter on `GET /api/v1/adspaces/{type}/_schema` and `POST /api/v1/adspaces/{type}`. 
     * Adspace types the caller can publish on this tenant.
     */
    async apiV1LookupsAdspaceTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsAdspaceTypesGet200Response> {
        const response = await this.apiV1LookupsAdspaceTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsAdzoneLocationsGet without sending the request
     */
    async apiV1LookupsAdzoneLocationsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/adzone-locations`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the configured adzone locations for the tenant. Use `id` to fill `locationid` on adspace create, and in `location_ids` on a banner campaign (ad type 2) — required on campaign create when this list is non-empty (a campaign may not target every placement at the floor price). Only meaningful when `modules.global.adzone_locations` is enabled — empty list otherwise. 
     * Adzone locations for the tenant.
     */
    async apiV1LookupsAdzoneLocationsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsAdzoneLocationsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the configured adzone locations for the tenant. Use `id` to fill `locationid` on adspace create, and in `location_ids` on a banner campaign (ad type 2) — required on campaign create when this list is non-empty (a campaign may not target every placement at the floor price). Only meaningful when `modules.global.adzone_locations` is enabled — empty list otherwise. 
     * Adzone locations for the tenant.
     */
    async apiV1LookupsAdzoneLocationsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsAdzoneLocationsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsAdzonesGet without sending the request
     */
    async apiV1LookupsAdzonesGetRequestOpts(requestParameters: ApiV1LookupsAdzonesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['term'] != null) {
            queryParameters['term'] = requestParameters['term'];
        }

        if (requestParameters['bulk'] != null) {
            queryParameters['bulk'] = requestParameters['bulk'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/adzones`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s adzone picker. Two modes:  * `term` (≥ 2 characters) — up to 50 zones whose name or site URL   contains it, or whose id equals it. Answer: a bare array   `[{id, label}]` (label = `zone name (site url)`). * `bulk` — newline-separated adzone ids; answer   `{data: [{id, label}], not_found: [...]}`.  Labels follow the panel\'s source-name rule: an account without the \"see source names\" right gets the id as the label, and `term` then matches exact ids only. 
     * Find adzone ids (for adzone filters).
     */
    async apiV1LookupsAdzonesGetRaw(requestParameters: ApiV1LookupsAdzonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1LookupsAdzonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s adzone picker. Two modes:  * `term` (≥ 2 characters) — up to 50 zones whose name or site URL   contains it, or whose id equals it. Answer: a bare array   `[{id, label}]` (label = `zone name (site url)`). * `bulk` — newline-separated adzone ids; answer   `{data: [{id, label}], not_found: [...]}`.  Labels follow the panel\'s source-name rule: an account without the \"see source names\" right gets the id as the label, and `term` then matches exact ids only. 
     * Find adzone ids (for adzone filters).
     */
    async apiV1LookupsAdzonesGet(requestParameters: ApiV1LookupsAdzonesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1LookupsAdzonesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1LookupsBannerSizesGet without sending the request
     */
    async apiV1LookupsBannerSizesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/banner-sizes`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the active banner sizes for the tenant. Use the `id` value as `adsizeid` (or `banner_settings.sizeid`) when creating a banner-flavored adspace (`bannerads`, `fixim_banner`, `impopup`, `interstitialads`, `interstitial_banner`, `invideo_banner`).  Sizes are sorted with common IAB formats first (300x250 → 728x90 → 160x600 → …). 
     * Banner sizes for banner-flavored adspaces.
     */
    async apiV1LookupsBannerSizesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsBannerSizesGet200Response>> {
        const requestOptions = await this.apiV1LookupsBannerSizesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsBannerSizesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the active banner sizes for the tenant. Use the `id` value as `adsizeid` (or `banner_settings.sizeid`) when creating a banner-flavored adspace (`bannerads`, `fixim_banner`, `impopup`, `interstitialads`, `interstitial_banner`, `invideo_banner`).  Sizes are sorted with common IAB formats first (300x250 → 728x90 → 160x600 → …). 
     * Banner sizes for banner-flavored adspaces.
     */
    async apiV1LookupsBannerSizesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsBannerSizesGet200Response> {
        const response = await this.apiV1LookupsBannerSizesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsBrowsersGet without sending the request
     */
    async apiV1LookupsBrowsersGetRequestOpts(requestParameters: ApiV1LookupsBrowsersGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['deviceTypeIds'] != null) {
            queryParameters['device_type_ids'] = requestParameters['deviceTypeIds'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/browsers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns `{id, name}` pairs for browsers known to the platform. Browsers are stored **per device type**, so callers that already know which devices their campaign targets should pass `?device_type_ids=<csv>` to scope the listing — e.g. `?device_type_ids=1,2` for desktop + mobile.  Without the filter, returns the tenant-active set across all device types (some entries may not actually serve on every device). 
     * Browser ids (optionally scoped by device type).
     */
    async apiV1LookupsBrowsersGetRaw(requestParameters: ApiV1LookupsBrowsersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsBrowsersGet200Response>> {
        const requestOptions = await this.apiV1LookupsBrowsersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsBrowsersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns `{id, name}` pairs for browsers known to the platform. Browsers are stored **per device type**, so callers that already know which devices their campaign targets should pass `?device_type_ids=<csv>` to scope the listing — e.g. `?device_type_ids=1,2` for desktop + mobile.  Without the filter, returns the tenant-active set across all device types (some entries may not actually serve on every device). 
     * Browser ids (optionally scoped by device type).
     */
    async apiV1LookupsBrowsersGet(requestParameters: ApiV1LookupsBrowsersGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsBrowsersGet200Response> {
        const response = await this.apiV1LookupsBrowsersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsCarriersGet without sending the request
     */
    async apiV1LookupsCarriersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/carriers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every mobile carrier the ad server can target, with its country. Use `id` for campaign carrier targeting (`carrier_id`) and for `carrier_id` conditions in bid rulesets. Same cached list as the panel\'s carrier dropdown (~1,150 rows, refreshed every 5 minutes). 
     * Mobile carriers (ids for carrier targeting).
     */
    async apiV1LookupsCarriersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsCarriersGet200Response>> {
        const requestOptions = await this.apiV1LookupsCarriersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsCarriersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Every mobile carrier the ad server can target, with its country. Use `id` for campaign carrier targeting (`carrier_id`) and for `carrier_id` conditions in bid rulesets. Same cached list as the panel\'s carrier dropdown (~1,150 rows, refreshed every 5 minutes). 
     * Mobile carriers (ids for carrier targeting).
     */
    async apiV1LookupsCarriersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsCarriersGet200Response> {
        const response = await this.apiV1LookupsCarriersGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsCategoriesGet without sending the request
     */
    async apiV1LookupsCategoriesGetRequestOpts(requestParameters: ApiV1LookupsCategoriesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['mainCatid'] != null) {
            queryParameters['main_catid'] = requestParameters['mainCatid'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/categories`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns active categories. Pass `?main_catid=N` to limit the result to categories belonging to that main category — the legacy `main_categories` column on each row is a CSV of main-id memberships, so a category can belong to several mains.  Use `id` to fill `catid` on adspace create or populate the `categories` array on site create.  **Cross-resource lookup** — accessible to keys with any of `sites.read`, `adspaces.read`, `tracking.read`, or `campaigns.read`. (Any scope that legitimately needs category ids opens it.) 
     * Active sub-categories (optionally scoped to a main).
     */
    async apiV1LookupsCategoriesGetRaw(requestParameters: ApiV1LookupsCategoriesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsCategoriesGet200Response>> {
        const requestOptions = await this.apiV1LookupsCategoriesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsCategoriesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns active categories. Pass `?main_catid=N` to limit the result to categories belonging to that main category — the legacy `main_categories` column on each row is a CSV of main-id memberships, so a category can belong to several mains.  Use `id` to fill `catid` on adspace create or populate the `categories` array on site create.  **Cross-resource lookup** — accessible to keys with any of `sites.read`, `adspaces.read`, `tracking.read`, or `campaigns.read`. (Any scope that legitimately needs category ids opens it.) 
     * Active sub-categories (optionally scoped to a main).
     */
    async apiV1LookupsCategoriesGet(requestParameters: ApiV1LookupsCategoriesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsCategoriesGet200Response> {
        const response = await this.apiV1LookupsCategoriesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsDeviceTypesGet without sending the request
     */
    async apiV1LookupsDeviceTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/device-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns `{id, name}` pairs for the device types active on this tenant (typically Desktop, Mobile, Tablet, …). Use these ids:   - in the `device_type_ids` field on campaign create / update,   - and as the `device_type_ids` query filter for     `/api/v1/lookups/browsers` and     `/api/v1/lookups/operating-systems` (browsers + OSes are     stored per device type). 
     * Active device types for this tenant.
     */
    async apiV1LookupsDeviceTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsDeviceTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns `{id, name}` pairs for the device types active on this tenant (typically Desktop, Mobile, Tablet, …). Use these ids:   - in the `device_type_ids` field on campaign create / update,   - and as the `device_type_ids` query filter for     `/api/v1/lookups/browsers` and     `/api/v1/lookups/operating-systems` (browsers + OSes are     stored per device type). 
     * Active device types for this tenant.
     */
    async apiV1LookupsDeviceTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsDeviceTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsDomainsGet without sending the request
     */
    async apiV1LookupsDomainsGetRequestOpts(requestParameters: ApiV1LookupsDomainsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['bulk'] == null) {
            throw new runtime.RequiredError(
                'bulk',
                'Required parameter "bulk" was null or undefined when calling apiV1LookupsDomainsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['bulk'] != null) {
            queryParameters['bulk'] = requestParameters['bulk'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/domains`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s bulk domain picker. `bulk` is a newline-separated list of domains, URLs (protocol, path and `www.` are stripped) or domain ids; each known one comes back as `{id, label}` and the rest are listed in `not_found`. Domain filters accept hostnames directly too (`items` on POST /api/v1/filters), so this is mostly for showing what an id means. Without `bulk` the answer is an empty array `[]`. 
     * Resolve domains to the ids domain filters store.
     */
    async apiV1LookupsDomainsGetRaw(requestParameters: ApiV1LookupsDomainsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1LookupsDomainsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s bulk domain picker. `bulk` is a newline-separated list of domains, URLs (protocol, path and `www.` are stripped) or domain ids; each known one comes back as `{id, label}` and the rest are listed in `not_found`. Domain filters accept hostnames directly too (`items` on POST /api/v1/filters), so this is mostly for showing what an id means. Without `bulk` the answer is an empty array `[]`. 
     * Resolve domains to the ids domain filters store.
     */
    async apiV1LookupsDomainsGet(requestParameters: ApiV1LookupsDomainsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1LookupsDomainsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1LookupsIspsGet without sending the request
     */
    async apiV1LookupsIspsGetRequestOpts(requestParameters: ApiV1LookupsIspsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['term'] != null) {
            queryParameters['term'] = requestParameters['term'];
        }

        if (requestParameters['bulk'] != null) {
            queryParameters['bulk'] = requestParameters['bulk'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/isps`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s ISP picker. `term` (≥ 2 characters) returns up to 50 ISPs whose name contains it as a bare array `[{id, label}]` (label = `name (country) (connection type)`). `bulk` takes newline-separated name fragments and returns every matching ISP (one organisation can span many ASNs) as `{data, not_found, truncated, limit}` — capped at `limit` (1000) rows, with `truncated: true` when the cap clipped it (then `not_found` is not computed). 
     * Find ISP ids (for ISP filters).
     */
    async apiV1LookupsIspsGetRaw(requestParameters: ApiV1LookupsIspsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1LookupsIspsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s ISP picker. `term` (≥ 2 characters) returns up to 50 ISPs whose name contains it as a bare array `[{id, label}]` (label = `name (country) (connection type)`). `bulk` takes newline-separated name fragments and returns every matching ISP (one organisation can span many ASNs) as `{data, not_found, truncated, limit}` — capped at `limit` (1000) rows, with `truncated: true` when the cap clipped it (then `not_found` is not computed). 
     * Find ISP ids (for ISP filters).
     */
    async apiV1LookupsIspsGet(requestParameters: ApiV1LookupsIspsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1LookupsIspsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1LookupsLinkTypesGet without sending the request
     */
    async apiV1LookupsLinkTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/link-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The tenant\'s link types. Use `id` in `location_ids` on a link campaign (ad type 6); required on create when this list is non-empty. Empty unless `modules.global.link_types` is active. 
     * Active link types for the tenant.
     */
    async apiV1LookupsLinkTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsLinkTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The tenant\'s link types. Use `id` in `location_ids` on a link campaign (ad type 6); required on create when this list is non-empty. Empty unless `modules.global.link_types` is active. 
     * Active link types for the tenant.
     */
    async apiV1LookupsLinkTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsLinkTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsMainCategoriesGet without sending the request
     */
    async apiV1LookupsMainCategoriesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/main-categories`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns active main categories. Use `id` to fill `main_catid` on site create or adspace create, or as an input to `/api/v1/lookups/categories?main_catid=N` for the sub-categories.  **Cross-resource lookup** — accessible to keys with any of `sites.read`, `adspaces.read`, `tracking.read`, or `campaigns.read`. (Any scope that legitimately needs category ids opens it.) 
     * Active main categories for the tenant.
     */
    async apiV1LookupsMainCategoriesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsMainCategoriesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns active main categories. Use `id` to fill `main_catid` on site create or adspace create, or as an input to `/api/v1/lookups/categories?main_catid=N` for the sub-categories.  **Cross-resource lookup** — accessible to keys with any of `sites.read`, `adspaces.read`, `tracking.read`, or `campaigns.read`. (Any scope that legitimately needs category ids opens it.) 
     * Active main categories for the tenant.
     */
    async apiV1LookupsMainCategoriesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsMainCategoriesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsOperatingSystemsGet without sending the request
     */
    async apiV1LookupsOperatingSystemsGetRequestOpts(requestParameters: ApiV1LookupsOperatingSystemsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['deviceTypeIds'] != null) {
            queryParameters['device_type_ids'] = requestParameters['deviceTypeIds'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/operating-systems`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns `{id, name}` pairs for operating systems active on this tenant. OS visibility is **per device type** — pass `?device_type_ids=<csv>` to scope the listing to OSes valid on those devices (e.g. iOS / Android only show under mobile).  Without the filter, returns the tenant-active union across all device types (Mobile OSes will appear even when you\'re targeting Desktop, etc.). 
     * Operating-system ids (optionally scoped by device type).
     */
    async apiV1LookupsOperatingSystemsGetRaw(requestParameters: ApiV1LookupsOperatingSystemsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsBrowsersGet200Response>> {
        const requestOptions = await this.apiV1LookupsOperatingSystemsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsBrowsersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns `{id, name}` pairs for operating systems active on this tenant. OS visibility is **per device type** — pass `?device_type_ids=<csv>` to scope the listing to OSes valid on those devices (e.g. iOS / Android only show under mobile).  Without the filter, returns the tenant-active union across all device types (Mobile OSes will appear even when you\'re targeting Desktop, etc.). 
     * Operating-system ids (optionally scoped by device type).
     */
    async apiV1LookupsOperatingSystemsGet(requestParameters: ApiV1LookupsOperatingSystemsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsBrowsersGet200Response> {
        const response = await this.apiV1LookupsOperatingSystemsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsPublishersGet without sending the request
     */
    async apiV1LookupsPublishersGetRequestOpts(requestParameters: ApiV1LookupsPublishersGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['term'] != null) {
            queryParameters['term'] = requestParameters['term'];
        }

        if (requestParameters['bulk'] != null) {
            queryParameters['bulk'] = requestParameters['bulk'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/publishers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s publisher picker for the `publisher_excl` filter — only publishers on your own network. `term` is either a publisher id (exact match, `#` prefix allowed) or a name fragment (≥ 2 characters, company or contact name, up to 50 hits), answered as a bare array `[{id, label}]` with label = company or contact name. `bulk` takes newline-separated ids and returns `{data, not_found}`. Where the network hides traffic-source names from advertisers, the label is the bare id and only exact-id lookups match. 
     * Find publisher ids (for publisher_excl filters).
     */
    async apiV1LookupsPublishersGetRaw(requestParameters: ApiV1LookupsPublishersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1LookupsPublishersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s publisher picker for the `publisher_excl` filter — only publishers on your own network. `term` is either a publisher id (exact match, `#` prefix allowed) or a name fragment (≥ 2 characters, company or contact name, up to 50 hits), answered as a bare array `[{id, label}]` with label = company or contact name. `bulk` takes newline-separated ids and returns `{data, not_found}`. Where the network hides traffic-source names from advertisers, the label is the bare id and only exact-id lookups match. 
     * Find publisher ids (for publisher_excl filters).
     */
    async apiV1LookupsPublishersGet(requestParameters: ApiV1LookupsPublishersGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1LookupsPublishersGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1LookupsRatingsGet without sending the request
     */
    async apiV1LookupsRatingsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/ratings`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns active content ratings. Use `id` to fill `ratingid` on adspace create. Only enforced when `modules.global.rating` is active — empty list otherwise. 
     * Active content ratings for the tenant.
     */
    async apiV1LookupsRatingsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsRatingsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns active content ratings. Use `id` to fill `ratingid` on adspace create. Only enforced when `modules.global.rating` is active — empty list otherwise. 
     * Active content ratings for the tenant.
     */
    async apiV1LookupsRatingsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsRatingsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsReelTypesGet without sending the request
     */
    async apiV1LookupsReelTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/reel-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The tenant\'s reel types. Use `id` in `location_ids` on a reel campaign (ad type 20); required on create when this list is non-empty. Empty unless `modules.global.reel_types` is active. 
     * Active reel types for the tenant.
     */
    async apiV1LookupsReelTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsReelTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The tenant\'s reel types. Use `id` in `location_ids` on a reel campaign (ad type 20); required on create when this list is non-empty. Empty unless `modules.global.reel_types` is active. 
     * Active reel types for the tenant.
     */
    async apiV1LookupsReelTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsReelTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsRegionsGet without sending the request
     */
    async apiV1LookupsRegionsGetRequestOpts(requestParameters: ApiV1LookupsRegionsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['parentId'] != null) {
            queryParameters['parent_id'] = requestParameters['parentId'];
        }

        if (requestParameters['ids'] != null) {
            queryParameters['ids'] = requestParameters['ids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/regions`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Hierarchical drill-down browser for geo region targeting. Returns only the direct children of `parent_id` per call so callers walk the tree top-down, one level at a time:  ``` parent_id absent / 0  → continents (level 0) parent_id = <continent id>  → countries on that continent (level 1) parent_id = <country id>    → states / provinces in that country (level 2) parent_id = <state id>      → cities / sub-regions (level 3, if any) parent_id = <city id>       → leaf items (level 4, if any) ```  Each item carries `level` so the caller can stop drilling once they\'ve hit the granularity they want. Campaigns most commonly target countries (level 1) or states / provinces (level 2), but deeper levels are valid too.  **The id you collect from this endpoint is what you send back to `regions` on a campaign create / update.** Always send the most specific (leaf) id you actually want — see the `regions` field notes on `POST /api/v1/campaigns/{type}` and `PATCH /api/v1/campaigns/{type}/{id}` for why.  **Performance:** the geo tree is preloaded into memory at server startup (~158k rows), so every call is a map lookup, not a DB query. A response is capped at 2000 children per call (no single legitimate parent has more than that). 
     * Walk the geo region tree (one level per call).
     */
    async apiV1LookupsRegionsGetRaw(requestParameters: ApiV1LookupsRegionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsRegionsGet200Response>> {
        const requestOptions = await this.apiV1LookupsRegionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsRegionsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Hierarchical drill-down browser for geo region targeting. Returns only the direct children of `parent_id` per call so callers walk the tree top-down, one level at a time:  ``` parent_id absent / 0  → continents (level 0) parent_id = <continent id>  → countries on that continent (level 1) parent_id = <country id>    → states / provinces in that country (level 2) parent_id = <state id>      → cities / sub-regions (level 3, if any) parent_id = <city id>       → leaf items (level 4, if any) ```  Each item carries `level` so the caller can stop drilling once they\'ve hit the granularity they want. Campaigns most commonly target countries (level 1) or states / provinces (level 2), but deeper levels are valid too.  **The id you collect from this endpoint is what you send back to `regions` on a campaign create / update.** Always send the most specific (leaf) id you actually want — see the `regions` field notes on `POST /api/v1/campaigns/{type}` and `PATCH /api/v1/campaigns/{type}/{id}` for why.  **Performance:** the geo tree is preloaded into memory at server startup (~158k rows), so every call is a map lookup, not a DB query. A response is capped at 2000 children per call (no single legitimate parent has more than that). 
     * Walk the geo region tree (one level per call).
     */
    async apiV1LookupsRegionsGet(requestParameters: ApiV1LookupsRegionsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsRegionsGet200Response> {
        const response = await this.apiV1LookupsRegionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsWebsiteLanguagesGet without sending the request
     */
    async apiV1LookupsWebsiteLanguagesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/website-languages`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the supported website languages from the `adlanguages` table. Pass the `code` values in the `sitelanguages` array on site create. Required when `modules.global.website_languages` is active. Non-trusted publishers may select only one. 
     * Supported website languages (ISO codes).
     */
    async apiV1LookupsWebsiteLanguagesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsWebsiteLanguagesGet200Response>> {
        const requestOptions = await this.apiV1LookupsWebsiteLanguagesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsWebsiteLanguagesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the supported website languages from the `adlanguages` table. Pass the `code` values in the `sitelanguages` array on site create. Required when `modules.global.website_languages` is active. Non-trusted publishers may select only one. 
     * Supported website languages (ISO codes).
     */
    async apiV1LookupsWebsiteLanguagesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsWebsiteLanguagesGet200Response> {
        const response = await this.apiV1LookupsWebsiteLanguagesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1LookupsWebsiteTypesGet without sending the request
     */
    async apiV1LookupsWebsiteTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/lookups/website-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the configured website types. Use `id` to fill `typeid` on site create. Only meaningful when `modules.global.website_types` is enabled — empty list otherwise. 
     * Active website types for the tenant.
     */
    async apiV1LookupsWebsiteTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1LookupsDeviceTypesGet200Response>> {
        const requestOptions = await this.apiV1LookupsWebsiteTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1LookupsDeviceTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the configured website types. Use `id` to fill `typeid` on site create. Only meaningful when `modules.global.website_types` is enabled — empty list otherwise. 
     * Active website types for the tenant.
     */
    async apiV1LookupsWebsiteTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1LookupsDeviceTypesGet200Response> {
        const response = await this.apiV1LookupsWebsiteTypesGetRaw(initOverrides);
        return await response.value();
    }

}
