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
  ApiV1MarketplaceFlatRequestsRenewPostRequest,
} from '../models/index';
import {
    ApiV1MarketplaceFlatRequestsRenewPostRequestFromJSON,
    ApiV1MarketplaceFlatRequestsRenewPostRequestToJSON,
} from '../models/index';

export interface ApiV1MarketplaceFlatRequestsIdCancelPostRequest {
    id: number;
}

export interface ApiV1MarketplaceFlatRequestsRenewPostOperationRequest {
    apiV1MarketplaceFlatRequestsRenewPostRequest: ApiV1MarketplaceFlatRequestsRenewPostRequest;
}

export interface ApiV1MarketplaceGetRequest {
    adtype?: number;
    format?: number;
    adzoneType?: number;
    mainCategory?: number;
    countries?: Array<string>;
    deviceType?: number;
    search?: string;
    includeAdShop?: ApiV1MarketplaceGetIncludeAdShopEnum;
    perPage?: number;
}

export interface ApiV1MarketplaceIdGetRequest {
    id: number;
    adtype?: number;
    format?: number;
    adzoneType?: number;
    countries?: Array<string>;
    deviceType?: number;
    os?: Array<number>;
    browser?: Array<number>;
    includeAdShop?: ApiV1MarketplaceIdGetIncludeAdShopEnum;
}

/**
 * 
 */
export class MarketplaceApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1MarketplaceFiltersGet without sending the request
     */
    async apiV1MarketplaceFiltersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/marketplace/filters`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Ad types, ad zone types, countries, banner sizes, device types, operating systems, browsers and main categories the marketplace filters accept, plus `flat_request_min_total` (the tenant minimum for a flat-deal amount, in currency units). Same handler as the panel. 
     * Filter vocabulary for the marketplace.
     */
    async apiV1MarketplaceFiltersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MarketplaceFiltersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Ad types, ad zone types, countries, banner sizes, device types, operating systems, browsers and main categories the marketplace filters accept, plus `flat_request_min_total` (the tenant minimum for a flat-deal amount, in currency units). Same handler as the panel. 
     * Filter vocabulary for the marketplace.
     */
    async apiV1MarketplaceFiltersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MarketplaceFiltersGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1MarketplaceFlatRequestsGet without sending the request
     */
    async apiV1MarketplaceFlatRequestsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/marketplace/flat-requests`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The account\'s flat-deal requests, newest first (max 200). A request is created by booking a flat deal in the panel\'s campaign wizard from a marketplace zone — that create path (`flat_request: 1`) is not exposed on `POST /api/v1/campaigns` yet. `accepted_campaignid` is the flat campaign the request created (set from the start, not only after acceptance). `status`: pending, accepted, rejected, cancelled. Account-wide: refused (403) for campaign-pinned keys. 
     * List my flat-deal requests.
     */
    async apiV1MarketplaceFlatRequestsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MarketplaceFlatRequestsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The account\'s flat-deal requests, newest first (max 200). A request is created by booking a flat deal in the panel\'s campaign wizard from a marketplace zone — that create path (`flat_request: 1`) is not exposed on `POST /api/v1/campaigns` yet. `accepted_campaignid` is the flat campaign the request created (set from the start, not only after acceptance). `status`: pending, accepted, rejected, cancelled. Account-wide: refused (403) for campaign-pinned keys. 
     * List my flat-deal requests.
     */
    async apiV1MarketplaceFlatRequestsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MarketplaceFlatRequestsGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1MarketplaceFlatRequestsIdCancelPost without sending the request
     */
    async apiV1MarketplaceFlatRequestsIdCancelPostRequestOpts(requestParameters: ApiV1MarketplaceFlatRequestsIdCancelPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1MarketplaceFlatRequestsIdCancelPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/marketplace/flat-requests/{id}/cancel`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Only a `pending` request of your own. Also soft-deletes the (never-served) flat campaign the request created, and tells the network admins the request is withdrawn. Pinned keys / own-scoped members are checked against that campaign. Same handler as the panel. No body. 
     * Withdraw a pending flat-deal request.
     */
    async apiV1MarketplaceFlatRequestsIdCancelPostRaw(requestParameters: ApiV1MarketplaceFlatRequestsIdCancelPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MarketplaceFlatRequestsIdCancelPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Only a `pending` request of your own. Also soft-deletes the (never-served) flat campaign the request created, and tells the network admins the request is withdrawn. Pinned keys / own-scoped members are checked against that campaign. Same handler as the panel. No body. 
     * Withdraw a pending flat-deal request.
     */
    async apiV1MarketplaceFlatRequestsIdCancelPost(requestParameters: ApiV1MarketplaceFlatRequestsIdCancelPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MarketplaceFlatRequestsIdCancelPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1MarketplaceFlatRequestsRenewPost without sending the request
     */
    async apiV1MarketplaceFlatRequestsRenewPostRequestOpts(requestParameters: ApiV1MarketplaceFlatRequestsRenewPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1MarketplaceFlatRequestsRenewPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1MarketplaceFlatRequestsRenewPostRequest',
                'Required parameter "apiV1MarketplaceFlatRequestsRenewPostRequest" was null or undefined when calling apiV1MarketplaceFlatRequestsRenewPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/marketplace/flat-requests/renew`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1MarketplaceFlatRequestsRenewPostRequestToJSON(requestParameters['apiV1MarketplaceFlatRequestsRenewPostRequest']),
        };
    }

    /**
     * Appends a deal (new date window + price) to a flat campaign (`paytype` 5) that already has an accepted deal, and files it in the admin\'s Accept / Reject queue (`deal_state` 0 = pending). Only one renewal may be pending at a time and the window must start after the last deal\'s end and not in the past. `total_costs` is the deal amount in **currency units** and must be ≥ the tenant\'s `flat_request_min_total` (GET /api/v1/marketplace/filters). Same handler as the panel; campaign pin and member own-scope apply. 
     * Propose one more flat deal on a live flat campaign.
     */
    async apiV1MarketplaceFlatRequestsRenewPostRaw(requestParameters: ApiV1MarketplaceFlatRequestsRenewPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MarketplaceFlatRequestsRenewPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Appends a deal (new date window + price) to a flat campaign (`paytype` 5) that already has an accepted deal, and files it in the admin\'s Accept / Reject queue (`deal_state` 0 = pending). Only one renewal may be pending at a time and the window must start after the last deal\'s end and not in the past. `total_costs` is the deal amount in **currency units** and must be ≥ the tenant\'s `flat_request_min_total` (GET /api/v1/marketplace/filters). Same handler as the panel; campaign pin and member own-scope apply. 
     * Propose one more flat deal on a live flat campaign.
     */
    async apiV1MarketplaceFlatRequestsRenewPost(requestParameters: ApiV1MarketplaceFlatRequestsRenewPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MarketplaceFlatRequestsRenewPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1MarketplaceGet without sending the request
     */
    async apiV1MarketplaceGetRequestOpts(requestParameters: ApiV1MarketplaceGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['adtype'] != null) {
            queryParameters['adtype'] = requestParameters['adtype'];
        }

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        if (requestParameters['adzoneType'] != null) {
            queryParameters['adzone_type'] = requestParameters['adzoneType'];
        }

        if (requestParameters['mainCategory'] != null) {
            queryParameters['main_category'] = requestParameters['mainCategory'];
        }

        if (requestParameters['countries'] != null) {
            queryParameters['countries[]'] = requestParameters['countries'];
        }

        if (requestParameters['deviceType'] != null) {
            queryParameters['device_type'] = requestParameters['deviceType'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['includeAdShop'] != null) {
            queryParameters['include_ad_shop'] = requestParameters['includeAdShop'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/marketplace`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Publisher sites the network admin put in the marketplace (`marketplace_websites`), each with its matching zone count and last-period views / clicks. Offer zones (ad type 21) never appear. Same handler as the panel. All matching sites are returned in one page (`last_page` is always 1). 
     * List marketplace sites.
     */
    async apiV1MarketplaceGetRaw(requestParameters: ApiV1MarketplaceGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MarketplaceGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Publisher sites the network admin put in the marketplace (`marketplace_websites`), each with its matching zone count and last-period views / clicks. Offer zones (ad type 21) never appear. Same handler as the panel. All matching sites are returned in one page (`last_page` is always 1). 
     * List marketplace sites.
     */
    async apiV1MarketplaceGet(requestParameters: ApiV1MarketplaceGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MarketplaceGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1MarketplaceIdGet without sending the request
     */
    async apiV1MarketplaceIdGetRequestOpts(requestParameters: ApiV1MarketplaceIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1MarketplaceIdGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['adtype'] != null) {
            queryParameters['adtype'] = requestParameters['adtype'];
        }

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        if (requestParameters['adzoneType'] != null) {
            queryParameters['adzone_type'] = requestParameters['adzoneType'];
        }

        if (requestParameters['countries'] != null) {
            queryParameters['countries[]'] = requestParameters['countries'];
        }

        if (requestParameters['deviceType'] != null) {
            queryParameters['device_type'] = requestParameters['deviceType'];
        }

        if (requestParameters['os'] != null) {
            queryParameters['os[]'] = requestParameters['os'];
        }

        if (requestParameters['browser'] != null) {
            queryParameters['browser[]'] = requestParameters['browser'];
        }

        if (requestParameters['includeAdShop'] != null) {
            queryParameters['include_ad_shop'] = requestParameters['includeAdShop'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/marketplace/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The zones the admin exposed on the site, filtered by ad type / format, each with its traffic (`stats`: clicks for click ad types, views otherwise — see `stat_type`) and a starting price `min_price`. `min_price` is in **cents** (the panel shows `min_price / 100` in the account currency); for CPM zones it is per 1000 views. It comes from recent market rates, else the zone\'s own per-country floor (when `countries[]` matches), else the network floor, else a built-in default. Same handler as the panel. 
     * Ad zones of one marketplace site, with starting prices.
     */
    async apiV1MarketplaceIdGetRaw(requestParameters: ApiV1MarketplaceIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MarketplaceIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The zones the admin exposed on the site, filtered by ad type / format, each with its traffic (`stats`: clicks for click ad types, views otherwise — see `stat_type`) and a starting price `min_price`. `min_price` is in **cents** (the panel shows `min_price / 100` in the account currency); for CPM zones it is per 1000 views. It comes from recent market rates, else the zone\'s own per-country floor (when `countries[]` matches), else the network floor, else a built-in default. Same handler as the panel. 
     * Ad zones of one marketplace site, with starting prices.
     */
    async apiV1MarketplaceIdGet(requestParameters: ApiV1MarketplaceIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MarketplaceIdGetRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1MarketplaceGetIncludeAdShopEnum = {
    _1: '1'
} as const;
export type ApiV1MarketplaceGetIncludeAdShopEnum = typeof ApiV1MarketplaceGetIncludeAdShopEnum[keyof typeof ApiV1MarketplaceGetIncludeAdShopEnum];
/**
 * @export
 */
export const ApiV1MarketplaceIdGetIncludeAdShopEnum = {
    _1: '1'
} as const;
export type ApiV1MarketplaceIdGetIncludeAdShopEnum = typeof ApiV1MarketplaceIdGetIncludeAdShopEnum[keyof typeof ApiV1MarketplaceIdGetIncludeAdShopEnum];
