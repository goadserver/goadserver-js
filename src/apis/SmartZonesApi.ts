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
  ApiV1PublisherSmartzonesIdPutRequest,
  ApiV1PublisherSmartzonesImportPostRequest,
  ApiV1PublisherSmartzonesNetworksPostRequest,
  ApiV1PublisherSmartzonesPostRequest,
} from '../models/index';
import {
    ApiV1PublisherSmartzonesIdPutRequestFromJSON,
    ApiV1PublisherSmartzonesIdPutRequestToJSON,
    ApiV1PublisherSmartzonesImportPostRequestFromJSON,
    ApiV1PublisherSmartzonesImportPostRequestToJSON,
    ApiV1PublisherSmartzonesNetworksPostRequestFromJSON,
    ApiV1PublisherSmartzonesNetworksPostRequestToJSON,
    ApiV1PublisherSmartzonesPostRequestFromJSON,
    ApiV1PublisherSmartzonesPostRequestToJSON,
} from '../models/index';

export interface ApiV1PublisherSmartzonesDistributionAdspacesIdGetRequest {
    id: number;
    from?: Date;
    to?: Date;
    basis?: ApiV1PublisherSmartzonesDistributionAdspacesIdGetBasisEnum;
}

export interface ApiV1PublisherSmartzonesDistributionPerSiteGetRequest {
    siteid: number;
    from?: Date;
    to?: Date;
    basis?: ApiV1PublisherSmartzonesDistributionPerSiteGetBasisEnum;
}

export interface ApiV1PublisherSmartzonesGetRequest {
    page?: number;
    perPage?: number;
    sortBy?: ApiV1PublisherSmartzonesGetSortByEnum;
    sortDir?: ApiV1PublisherSmartzonesGetSortDirEnum;
    networkId?: number;
    siteid?: number;
    spaceid?: number;
    selectType?: ApiV1PublisherSmartzonesGetSelectTypeEnum;
    adzoneTypeid?: number;
    status?: ApiV1PublisherSmartzonesGetStatusEnum;
    filterId?: number;
    filterName?: string;
    filterAdzoneName?: string;
}

export interface ApiV1PublisherSmartzonesIdDeleteRequest {
    id: number;
}

export interface ApiV1PublisherSmartzonesIdGetRequest {
    id: number;
}

export interface ApiV1PublisherSmartzonesIdPutOperationRequest {
    id: number;
    apiV1PublisherSmartzonesIdPutRequest: ApiV1PublisherSmartzonesIdPutRequest;
}

export interface ApiV1PublisherSmartzonesImportPostOperationRequest {
    apiV1PublisherSmartzonesImportPostRequest: ApiV1PublisherSmartzonesImportPostRequest;
}

export interface ApiV1PublisherSmartzonesNetworksIdDeleteRequest {
    id: number;
}

export interface ApiV1PublisherSmartzonesNetworksPostOperationRequest {
    apiV1PublisherSmartzonesNetworksPostRequest: ApiV1PublisherSmartzonesNetworksPostRequest;
}

export interface ApiV1PublisherSmartzonesPostOperationRequest {
    apiV1PublisherSmartzonesPostRequest: ApiV1PublisherSmartzonesPostRequest;
}

export interface ApiV1PublisherSmartzonesSspCampaignsGetRequest {
    networkid: number;
    adtypeid?: number;
}

/**
 * 
 */
export class SmartZonesApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1PublisherSmartzonesDistributionAdspacesIdGet without sending the request
     */
    async apiV1PublisherSmartzonesDistributionAdspacesIdGetRequestOpts(requestParameters: ApiV1PublisherSmartzonesDistributionAdspacesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSmartzonesDistributionAdspacesIdGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['basis'] != null) {
            queryParameters['basis'] = requestParameters['basis'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones/distribution/adspaces/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Per-day share, eCPM and volume of each smart zone under one of your ad zones, which zone led each day, a country heat map and a summary. **Money is in currency units (not cents).** 
     * Network split for one ad zone.
     */
    async apiV1PublisherSmartzonesDistributionAdspacesIdGetRaw(requestParameters: ApiV1PublisherSmartzonesDistributionAdspacesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesDistributionAdspacesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Per-day share, eCPM and volume of each smart zone under one of your ad zones, which zone led each day, a country heat map and a summary. **Money is in currency units (not cents).** 
     * Network split for one ad zone.
     */
    async apiV1PublisherSmartzonesDistributionAdspacesIdGet(requestParameters: ApiV1PublisherSmartzonesDistributionAdspacesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesDistributionAdspacesIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesDistributionPerSiteGet without sending the request
     */
    async apiV1PublisherSmartzonesDistributionPerSiteGetRequestOpts(requestParameters: ApiV1PublisherSmartzonesDistributionPerSiteGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['siteid'] == null) {
            throw new runtime.RequiredError(
                'siteid',
                'Required parameter "siteid" was null or undefined when calling apiV1PublisherSmartzonesDistributionPerSiteGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['siteid'] != null) {
            queryParameters['siteid'] = requestParameters['siteid'];
        }

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['basis'] != null) {
            queryParameters['basis'] = requestParameters['basis'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones/distribution/per-site`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * How one site\'s smart-zone traffic and earnings are spread over the networks: daily series (revenue, impressions, clicks, share, eCPM with the prior window), KPIs against the prior window of the same length, and a per-ad-zone breakdown with a health hint. **Money is in currency units (not cents)**: `earned*`, `avg_ecpm`, `ecpm_*` and the revenue/eCPM series. Impressions count views + clicks (click-only ad types log as clicks). 
     * Traffic and earnings split across networks for one site.
     */
    async apiV1PublisherSmartzonesDistributionPerSiteGetRaw(requestParameters: ApiV1PublisherSmartzonesDistributionPerSiteGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesDistributionPerSiteGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * How one site\'s smart-zone traffic and earnings are spread over the networks: daily series (revenue, impressions, clicks, share, eCPM with the prior window), KPIs against the prior window of the same length, and a per-ad-zone breakdown with a health hint. **Money is in currency units (not cents)**: `earned*`, `avg_ecpm`, `ecpm_*` and the revenue/eCPM series. Impressions count views + clicks (click-only ad types log as clicks). 
     * Traffic and earnings split across networks for one site.
     */
    async apiV1PublisherSmartzonesDistributionPerSiteGet(requestParameters: ApiV1PublisherSmartzonesDistributionPerSiteGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesDistributionPerSiteGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesDistributionSitesGet without sending the request
     */
    async apiV1PublisherSmartzonesDistributionSitesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones/distribution/sites`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Your sites with at least one live smart zone on a network, with ad zone and zone counts — the picker for the per-site distribution view.
     * Sites that carry smart zones.
     */
    async apiV1PublisherSmartzonesDistributionSitesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesDistributionSitesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Your sites with at least one live smart zone on a network, with ad zone and zone counts — the picker for the per-site distribution view.
     * Sites that carry smart zones.
     */
    async apiV1PublisherSmartzonesDistributionSitesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesDistributionSitesGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesGet without sending the request
     */
    async apiV1PublisherSmartzonesGetRequestOpts(requestParameters: ApiV1PublisherSmartzonesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sort_by'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sort_dir'] = requestParameters['sortDir'];
        }

        if (requestParameters['networkId'] != null) {
            queryParameters['network_id'] = requestParameters['networkId'];
        }

        if (requestParameters['siteid'] != null) {
            queryParameters['siteid'] = requestParameters['siteid'];
        }

        if (requestParameters['spaceid'] != null) {
            queryParameters['spaceid'] = requestParameters['spaceid'];
        }

        if (requestParameters['selectType'] != null) {
            queryParameters['select_type'] = requestParameters['selectType'];
        }

        if (requestParameters['adzoneTypeid'] != null) {
            queryParameters['adzone_typeid'] = requestParameters['adzoneTypeid'];
        }

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterName'] != null) {
            queryParameters['filter_name'] = requestParameters['filterName'];
        }

        if (requestParameters['filterAdzoneName'] != null) {
            queryParameters['filter_adzone_name'] = requestParameters['filterAdzoneName'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Smart zones hang under one of your ad zones and send part of its traffic to an outside ad network (or, with `smart_networkid = 0`, split your own inventory). The same list the panel\'s Smart Zones page shows. Paginated with `page` / `per_page` (max 2000).  Keys pinned to `adzone_ids` or `site_ids` are refused with `403 forbidden_resource` on every smart-zone route: a smart zone, its network accounts and the import span zones the pin cannot follow. 
     * List smart zones.
     */
    async apiV1PublisherSmartzonesGetRaw(requestParameters: ApiV1PublisherSmartzonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Smart zones hang under one of your ad zones and send part of its traffic to an outside ad network (or, with `smart_networkid = 0`, split your own inventory). The same list the panel\'s Smart Zones page shows. Paginated with `page` / `per_page` (max 2000).  Keys pinned to `adzone_ids` or `site_ids` are refused with `403 forbidden_resource` on every smart-zone route: a smart zone, its network accounts and the import span zones the pin cannot follow. 
     * List smart zones.
     */
    async apiV1PublisherSmartzonesGet(requestParameters: ApiV1PublisherSmartzonesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesIdDelete without sending the request
     */
    async apiV1PublisherSmartzonesIdDeleteRequestOpts(requestParameters: ApiV1PublisherSmartzonesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSmartzonesIdDelete().'
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

        let urlPath = `/api/v1/publisher/smartzones/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete (`isdeleted = 1`). There is no recover route; recreate the zone instead.
     * Delete a smart zone.
     */
    async apiV1PublisherSmartzonesIdDeleteRaw(requestParameters: ApiV1PublisherSmartzonesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft delete (`isdeleted = 1`). There is no recover route; recreate the zone instead.
     * Delete a smart zone.
     */
    async apiV1PublisherSmartzonesIdDelete(requestParameters: ApiV1PublisherSmartzonesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesIdGet without sending the request
     */
    async apiV1PublisherSmartzonesIdGetRequestOpts(requestParameters: ApiV1PublisherSmartzonesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSmartzonesIdGet().'
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

        let urlPath = `/api/v1/publisher/smartzones/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get one smart zone.
     */
    async apiV1PublisherSmartzonesIdGetRaw(requestParameters: ApiV1PublisherSmartzonesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get one smart zone.
     */
    async apiV1PublisherSmartzonesIdGet(requestParameters: ApiV1PublisherSmartzonesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesIdPut without sending the request
     */
    async apiV1PublisherSmartzonesIdPutRequestOpts(requestParameters: ApiV1PublisherSmartzonesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSmartzonesIdPut().'
            );
        }

        if (requestParameters['apiV1PublisherSmartzonesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSmartzonesIdPutRequest',
                'Required parameter "apiV1PublisherSmartzonesIdPutRequest" was null or undefined when calling apiV1PublisherSmartzonesIdPut().'
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

        let urlPath = `/api/v1/publisher/smartzones/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSmartzonesIdPutRequestToJSON(requestParameters['apiV1PublisherSmartzonesIdPutRequest']),
        };
    }

    /**
     * Partial update: only the keys you send are written. Moving the zone to another ad zone (`spaceid`) is allowed; the new ad zone must be one of your live ones and `siteid` follows it (a bare `siteid` is ignored). Changing `smart_networkid` re-derives the catalogue `networkid`; both it and `ssp_campaignid` must be your own. Booleans may be sent as `true`/`false` or `1`/`0`.  Unknown body fields are refused with `422 unknown_fields`. 
     * Update a smart zone.
     */
    async apiV1PublisherSmartzonesIdPutRaw(requestParameters: ApiV1PublisherSmartzonesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Partial update: only the keys you send are written. Moving the zone to another ad zone (`spaceid`) is allowed; the new ad zone must be one of your live ones and `siteid` follows it (a bare `siteid` is ignored). Changing `smart_networkid` re-derives the catalogue `networkid`; both it and `ssp_campaignid` must be your own. Booleans may be sent as `true`/`false` or `1`/`0`.  Unknown body fields are refused with `422 unknown_fields`. 
     * Update a smart zone.
     */
    async apiV1PublisherSmartzonesIdPut(requestParameters: ApiV1PublisherSmartzonesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesImportPost without sending the request
     */
    async apiV1PublisherSmartzonesImportPostRequestOpts(requestParameters: ApiV1PublisherSmartzonesImportPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherSmartzonesImportPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSmartzonesImportPostRequest',
                'Required parameter "apiV1PublisherSmartzonesImportPostRequest" was null or undefined when calling apiV1PublisherSmartzonesImportPost().'
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

        let urlPath = `/api/v1/publisher/smartzones/import`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSmartzonesImportPostRequestToJSON(requestParameters['apiV1PublisherSmartzonesImportPostRequest']),
        };
    }

    /**
     * Creates (or, when a zone with the same name already exists under the same ad zone, overwrites) one smart zone per `zones[]` entry, all on one network account. Entries without a `spaceid` or `url`, or whose ad zone is not one of your live ones, are skipped; `imported` counts the rows written. Each zone\'s site is its ad zone\'s site (the top-level `siteid` is ignored). Imported zones are active.  Unknown top-level body fields are refused with `422 unknown_fields`. 
     * Bulk import smart zones.
     */
    async apiV1PublisherSmartzonesImportPostRaw(requestParameters: ApiV1PublisherSmartzonesImportPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesImportPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates (or, when a zone with the same name already exists under the same ad zone, overwrites) one smart zone per `zones[]` entry, all on one network account. Entries without a `spaceid` or `url`, or whose ad zone is not one of your live ones, are skipped; `imported` counts the rows written. Each zone\'s site is its ad zone\'s site (the top-level `siteid` is ignored). Imported zones are active.  Unknown top-level body fields are refused with `422 unknown_fields`. 
     * Bulk import smart zones.
     */
    async apiV1PublisherSmartzonesImportPost(requestParameters: ApiV1PublisherSmartzonesImportPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesImportPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesNetworksGet without sending the request
     */
    async apiV1PublisherSmartzonesNetworksGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones/networks`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Your accounts on outside ad networks (the \"Networks\" tab). `available_networks` lists the catalogue networks you can add, with the credential flags each needs.  **Credentials are masked on the API:** `apikey` and every string in `api_data` come back as `****` + their last 4 characters (`has_apikey` says whether a key is stored). Writing a masked value back through `POST .../networks` keeps the stored secret, so a read-modify-write round trip is safe; send the real value to change it. 
     * List your smart network accounts.
     */
    async apiV1PublisherSmartzonesNetworksGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesNetworksGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Your accounts on outside ad networks (the \"Networks\" tab). `available_networks` lists the catalogue networks you can add, with the credential flags each needs.  **Credentials are masked on the API:** `apikey` and every string in `api_data` come back as `****` + their last 4 characters (`has_apikey` says whether a key is stored). Writing a masked value back through `POST .../networks` keeps the stored secret, so a read-modify-write round trip is safe; send the real value to change it. 
     * List your smart network accounts.
     */
    async apiV1PublisherSmartzonesNetworksGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesNetworksGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesNetworksIdDelete without sending the request
     */
    async apiV1PublisherSmartzonesNetworksIdDeleteRequestOpts(requestParameters: ApiV1PublisherSmartzonesNetworksIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSmartzonesNetworksIdDelete().'
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

        let urlPath = `/api/v1/publisher/smartzones/networks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Hard delete. Refused while any live smart zone still uses the account.
     * Remove a smart network account.
     */
    async apiV1PublisherSmartzonesNetworksIdDeleteRaw(requestParameters: ApiV1PublisherSmartzonesNetworksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesNetworksIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Hard delete. Refused while any live smart zone still uses the account.
     * Remove a smart network account.
     */
    async apiV1PublisherSmartzonesNetworksIdDelete(requestParameters: ApiV1PublisherSmartzonesNetworksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesNetworksIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesNetworksPost without sending the request
     */
    async apiV1PublisherSmartzonesNetworksPostRequestOpts(requestParameters: ApiV1PublisherSmartzonesNetworksPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherSmartzonesNetworksPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSmartzonesNetworksPostRequest',
                'Required parameter "apiV1PublisherSmartzonesNetworksPostRequest" was null or undefined when calling apiV1PublisherSmartzonesNetworksPost().'
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

        let urlPath = `/api/v1/publisher/smartzones/networks`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSmartzonesNetworksPostRequestToJSON(requestParameters['apiV1PublisherSmartzonesNetworksPostRequest']),
        };
    }

    /**
     * Without `id` (or `id: 0`) creates an account; with the `id` of one of yours updates it (every field is rewritten — send the full object). `name` + `prepend_name` must be unique among your accounts. Empty credential pairs are dropped from `api_data`, and a set `apikey` removes `username`/`userpass`.  Unknown body fields are refused with `422 unknown_fields`. 
     * Add or update a smart network account.
     */
    async apiV1PublisherSmartzonesNetworksPostRaw(requestParameters: ApiV1PublisherSmartzonesNetworksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesNetworksPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Without `id` (or `id: 0`) creates an account; with the `id` of one of yours updates it (every field is rewritten — send the full object). `name` + `prepend_name` must be unique among your accounts. Empty credential pairs are dropped from `api_data`, and a set `apikey` removes `username`/`userpass`.  Unknown body fields are refused with `422 unknown_fields`. 
     * Add or update a smart network account.
     */
    async apiV1PublisherSmartzonesNetworksPost(requestParameters: ApiV1PublisherSmartzonesNetworksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesNetworksPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesPost without sending the request
     */
    async apiV1PublisherSmartzonesPostRequestOpts(requestParameters: ApiV1PublisherSmartzonesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherSmartzonesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSmartzonesPostRequest',
                'Required parameter "apiV1PublisherSmartzonesPostRequest" was null or undefined when calling apiV1PublisherSmartzonesPost().'
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

        let urlPath = `/api/v1/publisher/smartzones`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSmartzonesPostRequestToJSON(requestParameters['apiV1PublisherSmartzonesPostRequest']),
        };
    }

    /**
     * Creates a smart zone under one of your live ad zones. The zone\'s `siteid` is always taken from the ad zone (a `siteid` in the body is ignored). With no network (`smart_networkid` 0 or omitted) the selection type is forced to percentage, because eCPM and RTB need an upstream network to rank against.  Unknown body fields are refused with `422 unknown_fields`. 
     * Create a smart zone.
     */
    async apiV1PublisherSmartzonesPostRaw(requestParameters: ApiV1PublisherSmartzonesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a smart zone under one of your live ad zones. The zone\'s `siteid` is always taken from the ad zone (a `siteid` in the body is ignored). With no network (`smart_networkid` 0 or omitted) the selection type is forced to percentage, because eCPM and RTB need an upstream network to rank against.  Unknown body fields are refused with `422 unknown_fields`. 
     * Create a smart zone.
     */
    async apiV1PublisherSmartzonesPost(requestParameters: ApiV1PublisherSmartzonesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesSetupDataGet without sending the request
     */
    async apiV1PublisherSmartzonesSetupDataGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones/setup-data`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Everything the create/update body refers to: countries, device types (empty when device targeting is off for the tenant), your websites and live ad zones, the ad zone types you use, and the network catalogue (`smartzone_networks`) with the per-network flags that say which credentials and ids that network needs. 
     * Lookups for the smart-zone form.
     */
    async apiV1PublisherSmartzonesSetupDataGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesSetupDataGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Everything the create/update body refers to: countries, device types (empty when device targeting is off for the tenant), your websites and live ad zones, the ad zone types you use, and the network catalogue (`smartzone_networks`) with the per-network flags that say which credentials and ids that network needs. 
     * Lookups for the smart-zone form.
     */
    async apiV1PublisherSmartzonesSetupDataGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesSetupDataGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSmartzonesSspCampaignsGet without sending the request
     */
    async apiV1PublisherSmartzonesSspCampaignsGetRequestOpts(requestParameters: ApiV1PublisherSmartzonesSspCampaignsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['networkid'] == null) {
            throw new runtime.RequiredError(
                'networkid',
                'Required parameter "networkid" was null or undefined when calling apiV1PublisherSmartzonesSspCampaignsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['networkid'] != null) {
            queryParameters['networkid'] = requestParameters['networkid'];
        }

        if (requestParameters['adtypeid'] != null) {
            queryParameters['adtypeid'] = requestParameters['adtypeid'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/smartzones/ssp-campaigns`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Your active RTB-feed SSP campaigns (`ssptype = ssp`, `use_type = 2`) on the RTB network that matches the catalogue network `networkid`, optionally narrowed to one ad type. Empty when the network has no RTB twin. 
     * SSP campaigns usable as a smart zone\'s RTB feed.
     */
    async apiV1PublisherSmartzonesSspCampaignsGetRaw(requestParameters: ApiV1PublisherSmartzonesSspCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSmartzonesSspCampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Your active RTB-feed SSP campaigns (`ssptype = ssp`, `use_type = 2`) on the RTB network that matches the catalogue network `networkid`, optionally narrowed to one ad type. Empty when the network has no RTB twin. 
     * SSP campaigns usable as a smart zone\'s RTB feed.
     */
    async apiV1PublisherSmartzonesSspCampaignsGet(requestParameters: ApiV1PublisherSmartzonesSspCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSmartzonesSspCampaignsGetRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1PublisherSmartzonesDistributionAdspacesIdGetBasisEnum = {
    Imp: 'imp',
    Earn: 'earn'
} as const;
export type ApiV1PublisherSmartzonesDistributionAdspacesIdGetBasisEnum = typeof ApiV1PublisherSmartzonesDistributionAdspacesIdGetBasisEnum[keyof typeof ApiV1PublisherSmartzonesDistributionAdspacesIdGetBasisEnum];
/**
 * @export
 */
export const ApiV1PublisherSmartzonesDistributionPerSiteGetBasisEnum = {
    Imp: 'imp',
    Earn: 'earn'
} as const;
export type ApiV1PublisherSmartzonesDistributionPerSiteGetBasisEnum = typeof ApiV1PublisherSmartzonesDistributionPerSiteGetBasisEnum[keyof typeof ApiV1PublisherSmartzonesDistributionPerSiteGetBasisEnum];
/**
 * @export
 */
export const ApiV1PublisherSmartzonesGetSortByEnum = {
    Id: 'id',
    Name: 'name',
    IsActive: 'is_active',
    SmartNetworkid: 'smart_networkid',
    Siteid: 'siteid',
    LastActiveDate: 'last_active_date'
} as const;
export type ApiV1PublisherSmartzonesGetSortByEnum = typeof ApiV1PublisherSmartzonesGetSortByEnum[keyof typeof ApiV1PublisherSmartzonesGetSortByEnum];
/**
 * @export
 */
export const ApiV1PublisherSmartzonesGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1PublisherSmartzonesGetSortDirEnum = typeof ApiV1PublisherSmartzonesGetSortDirEnum[keyof typeof ApiV1PublisherSmartzonesGetSortDirEnum];
/**
 * @export
 */
export const ApiV1PublisherSmartzonesGetSelectTypeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3
} as const;
export type ApiV1PublisherSmartzonesGetSelectTypeEnum = typeof ApiV1PublisherSmartzonesGetSelectTypeEnum[keyof typeof ApiV1PublisherSmartzonesGetSelectTypeEnum];
/**
 * @export
 */
export const ApiV1PublisherSmartzonesGetStatusEnum = {
    Active: 'active',
    Inactive: 'inactive'
} as const;
export type ApiV1PublisherSmartzonesGetStatusEnum = typeof ApiV1PublisherSmartzonesGetStatusEnum[keyof typeof ApiV1PublisherSmartzonesGetStatusEnum];
