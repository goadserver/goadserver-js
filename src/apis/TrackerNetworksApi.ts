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
  ApiV1PublisherPushCampaignsIdDelete200Response,
  ApiV1PublisherPushCampaignsPost200Response,
  ApiV1TrackerAdNetworksDeleteReportsPutRequest,
  ApiV1TrackerAdNetworksIdPutRequest,
  ApiV1TrackerAdNetworksPostRequest,
  ApiV1TrackerAffiliateNetworksGet200Response,
  ApiV1TrackerAffiliateNetworksIdPutRequest,
  ApiV1TrackerAffiliateNetworksPostRequest,
  ApiV1TrackerTrackingLinksIdZoneCostsGet200Response,
} from '../models/index';
import {
    ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseToJSON,
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1TrackerAdNetworksDeleteReportsPutRequestFromJSON,
    ApiV1TrackerAdNetworksDeleteReportsPutRequestToJSON,
    ApiV1TrackerAdNetworksIdPutRequestFromJSON,
    ApiV1TrackerAdNetworksIdPutRequestToJSON,
    ApiV1TrackerAdNetworksPostRequestFromJSON,
    ApiV1TrackerAdNetworksPostRequestToJSON,
    ApiV1TrackerAffiliateNetworksGet200ResponseFromJSON,
    ApiV1TrackerAffiliateNetworksGet200ResponseToJSON,
    ApiV1TrackerAffiliateNetworksIdPutRequestFromJSON,
    ApiV1TrackerAffiliateNetworksIdPutRequestToJSON,
    ApiV1TrackerAffiliateNetworksPostRequestFromJSON,
    ApiV1TrackerAffiliateNetworksPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1TrackerAdNetworksDeleteReportsPutOperationRequest {
    apiV1TrackerAdNetworksDeleteReportsPutRequest: ApiV1TrackerAdNetworksDeleteReportsPutRequest;
}

export interface ApiV1TrackerAdNetworksGetRequest {
    status?: ApiV1TrackerAdNetworksGetStatusEnum;
    filterId?: number;
    filterName?: string;
    sortBy?: ApiV1TrackerAdNetworksGetSortByEnum;
    sortDir?: ApiV1TrackerAdNetworksGetSortDirEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1TrackerAdNetworksIdCampaignsGetRequest {
    id: number;
}

export interface ApiV1TrackerAdNetworksIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerAdNetworksIdGetRequest {
    id: number;
}

export interface ApiV1TrackerAdNetworksIdPutOperationRequest {
    id: number;
    apiV1TrackerAdNetworksIdPutRequest: ApiV1TrackerAdNetworksIdPutRequest;
}

export interface ApiV1TrackerAdNetworksPostOperationRequest {
    apiV1TrackerAdNetworksPostRequest: ApiV1TrackerAdNetworksPostRequest;
}

export interface ApiV1TrackerAdNetworksReportsGetRequest {
    filterId?: number;
    filterAdNetworkid?: number;
    filterState?: number;
    sortBy?: ApiV1TrackerAdNetworksReportsGetSortByEnum;
    sortDir?: ApiV1TrackerAdNetworksReportsGetSortDirEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1TrackerAffiliateNetworksIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerAffiliateNetworksIdPutOperationRequest {
    id: number;
    apiV1TrackerAffiliateNetworksIdPutRequest: ApiV1TrackerAffiliateNetworksIdPutRequest;
}

export interface ApiV1TrackerAffiliateNetworksPostOperationRequest {
    apiV1TrackerAffiliateNetworksPostRequest: ApiV1TrackerAffiliateNetworksPostRequest;
}

/**
 * 
 */
export class TrackerNetworksApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackerAdNetworksDeleteReportsPut without sending the request
     */
    async apiV1TrackerAdNetworksDeleteReportsPutRequestOpts(requestParameters: ApiV1TrackerAdNetworksDeleteReportsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerAdNetworksDeleteReportsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerAdNetworksDeleteReportsPutRequest',
                'Required parameter "apiV1TrackerAdNetworksDeleteReportsPutRequest" was null or undefined when calling apiV1TrackerAdNetworksDeleteReportsPut().'
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

        let urlPath = `/api/v1/tracker/ad-networks/delete-reports`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerAdNetworksDeleteReportsPutRequestToJSON(requestParameters['apiV1TrackerAdNetworksDeleteReportsPutRequest']),
        };
    }

    /**
     * Clears imported spend rows so a re-pull can replace them — the fix for a driver that imported a bad day. 
     * Delete pulled spend reports.
     */
    async apiV1TrackerAdNetworksDeleteReportsPutRaw(requestParameters: ApiV1TrackerAdNetworksDeleteReportsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksDeleteReportsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Clears imported spend rows so a re-pull can replace them — the fix for a driver that imported a bad day. 
     * Delete pulled spend reports.
     */
    async apiV1TrackerAdNetworksDeleteReportsPut(requestParameters: ApiV1TrackerAdNetworksDeleteReportsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerAdNetworksDeleteReportsPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksGet without sending the request
     */
    async apiV1TrackerAdNetworksGetRequestOpts(requestParameters: ApiV1TrackerAdNetworksGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterName'] != null) {
            queryParameters['filter_name'] = requestParameters['filterName'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sort_by'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sort_dir'] = requestParameters['sortDir'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
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

        let urlPath = `/api/v1/tracker/ad-networks`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The buying side — traffic sources spend is pulled from and campaigns are bound to. 
     * List ad networks.
     */
    async apiV1TrackerAdNetworksGetRaw(requestParameters: ApiV1TrackerAdNetworksGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The buying side — traffic sources spend is pulled from and campaigns are bound to. 
     * List ad networks.
     */
    async apiV1TrackerAdNetworksGet(requestParameters: ApiV1TrackerAdNetworksGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerAdNetworksGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksIdCampaignsGet without sending the request
     */
    async apiV1TrackerAdNetworksIdCampaignsGetRequestOpts(requestParameters: ApiV1TrackerAdNetworksIdCampaignsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerAdNetworksIdCampaignsGet().'
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

        let urlPath = `/api/v1/tracker/ad-networks/{id}/campaigns`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The bindable campaigns for tracking links on this network. 
     * Campaigns known on one ad network.
     */
    async apiV1TrackerAdNetworksIdCampaignsGetRaw(requestParameters: ApiV1TrackerAdNetworksIdCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksIdCampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The bindable campaigns for tracking links on this network. 
     * Campaigns known on one ad network.
     */
    async apiV1TrackerAdNetworksIdCampaignsGet(requestParameters: ApiV1TrackerAdNetworksIdCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerAdNetworksIdCampaignsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksIdDelete without sending the request
     */
    async apiV1TrackerAdNetworksIdDeleteRequestOpts(requestParameters: ApiV1TrackerAdNetworksIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerAdNetworksIdDelete().'
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

        let urlPath = `/api/v1/tracker/ad-networks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete an ad network.
     */
    async apiV1TrackerAdNetworksIdDeleteRaw(requestParameters: ApiV1TrackerAdNetworksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Delete an ad network.
     */
    async apiV1TrackerAdNetworksIdDelete(requestParameters: ApiV1TrackerAdNetworksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerAdNetworksIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksIdGet without sending the request
     */
    async apiV1TrackerAdNetworksIdGetRequestOpts(requestParameters: ApiV1TrackerAdNetworksIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerAdNetworksIdGet().'
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

        let urlPath = `/api/v1/tracker/ad-networks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get one ad network.
     */
    async apiV1TrackerAdNetworksIdGetRaw(requestParameters: ApiV1TrackerAdNetworksIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Get one ad network.
     */
    async apiV1TrackerAdNetworksIdGet(requestParameters: ApiV1TrackerAdNetworksIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerAdNetworksIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksIdPut without sending the request
     */
    async apiV1TrackerAdNetworksIdPutRequestOpts(requestParameters: ApiV1TrackerAdNetworksIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerAdNetworksIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerAdNetworksIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerAdNetworksIdPutRequest',
                'Required parameter "apiV1TrackerAdNetworksIdPutRequest" was null or undefined when calling apiV1TrackerAdNetworksIdPut().'
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

        let urlPath = `/api/v1/tracker/ad-networks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerAdNetworksIdPutRequestToJSON(requestParameters['apiV1TrackerAdNetworksIdPutRequest']),
        };
    }

    /**
     * Update an ad network.
     */
    async apiV1TrackerAdNetworksIdPutRaw(requestParameters: ApiV1TrackerAdNetworksIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Update an ad network.
     */
    async apiV1TrackerAdNetworksIdPut(requestParameters: ApiV1TrackerAdNetworksIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerAdNetworksIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksPost without sending the request
     */
    async apiV1TrackerAdNetworksPostRequestOpts(requestParameters: ApiV1TrackerAdNetworksPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerAdNetworksPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerAdNetworksPostRequest',
                'Required parameter "apiV1TrackerAdNetworksPostRequest" was null or undefined when calling apiV1TrackerAdNetworksPost().'
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

        let urlPath = `/api/v1/tracker/ad-networks`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerAdNetworksPostRequestToJSON(requestParameters['apiV1TrackerAdNetworksPostRequest']),
        };
    }

    /**
     * Create an ad network.
     */
    async apiV1TrackerAdNetworksPostRaw(requestParameters: ApiV1TrackerAdNetworksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Create an ad network.
     */
    async apiV1TrackerAdNetworksPost(requestParameters: ApiV1TrackerAdNetworksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerAdNetworksPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAdNetworksReportsGet without sending the request
     */
    async apiV1TrackerAdNetworksReportsGetRequestOpts(requestParameters: ApiV1TrackerAdNetworksReportsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterAdNetworkid'] != null) {
            queryParameters['filter_ad_networkid'] = requestParameters['filterAdNetworkid'];
        }

        if (requestParameters['filterState'] != null) {
            queryParameters['filter_state'] = requestParameters['filterState'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sort_by'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sort_dir'] = requestParameters['sortDir'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
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

        let urlPath = `/api/v1/tracker/ad-networks/reports`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the cost pull has imported per network, the raw material behind /cost-summary. 
     * Spend reports pulled from the ad networks.
     */
    async apiV1TrackerAdNetworksReportsGetRaw(requestParameters: ApiV1TrackerAdNetworksReportsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerAdNetworksReportsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * What the cost pull has imported per network, the raw material behind /cost-summary. 
     * Spend reports pulled from the ad networks.
     */
    async apiV1TrackerAdNetworksReportsGet(requestParameters: ApiV1TrackerAdNetworksReportsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerAdNetworksReportsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAffiliateNetworkTemplatesGet without sending the request
     */
    async apiV1TrackerAffiliateNetworkTemplatesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/affiliate-network-templates`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Known networks with their postback token mapping preset. 
     * List affiliate-network templates.
     */
    async apiV1TrackerAffiliateNetworkTemplatesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerAffiliateNetworkTemplatesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Known networks with their postback token mapping preset. 
     * List affiliate-network templates.
     */
    async apiV1TrackerAffiliateNetworkTemplatesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerAffiliateNetworkTemplatesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAffiliateNetworksGet without sending the request
     */
    async apiV1TrackerAffiliateNetworksGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/affiliate-networks`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Where offers come from, with their postback token mapping. 
     * List affiliate networks.
     */
    async apiV1TrackerAffiliateNetworksGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerAffiliateNetworksGet200Response>> {
        const requestOptions = await this.apiV1TrackerAffiliateNetworksGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerAffiliateNetworksGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Where offers come from, with their postback token mapping. 
     * List affiliate networks.
     */
    async apiV1TrackerAffiliateNetworksGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerAffiliateNetworksGet200Response> {
        const response = await this.apiV1TrackerAffiliateNetworksGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAffiliateNetworksIdDelete without sending the request
     */
    async apiV1TrackerAffiliateNetworksIdDeleteRequestOpts(requestParameters: ApiV1TrackerAffiliateNetworksIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerAffiliateNetworksIdDelete().'
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

        let urlPath = `/api/v1/tracker/affiliate-networks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Hard delete — the table carries no soft-delete flag. Offers pointing at it keep their `affiliate_network_id` and simply resolve to no name. 
     * Delete an affiliate network.
     */
    async apiV1TrackerAffiliateNetworksIdDeleteRaw(requestParameters: ApiV1TrackerAffiliateNetworksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerAffiliateNetworksIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Hard delete — the table carries no soft-delete flag. Offers pointing at it keep their `affiliate_network_id` and simply resolve to no name. 
     * Delete an affiliate network.
     */
    async apiV1TrackerAffiliateNetworksIdDelete(requestParameters: ApiV1TrackerAffiliateNetworksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerAffiliateNetworksIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAffiliateNetworksIdPut without sending the request
     */
    async apiV1TrackerAffiliateNetworksIdPutRequestOpts(requestParameters: ApiV1TrackerAffiliateNetworksIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerAffiliateNetworksIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerAffiliateNetworksIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerAffiliateNetworksIdPutRequest',
                'Required parameter "apiV1TrackerAffiliateNetworksIdPutRequest" was null or undefined when calling apiV1TrackerAffiliateNetworksIdPut().'
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

        let urlPath = `/api/v1/tracker/affiliate-networks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerAffiliateNetworksIdPutRequestToJSON(requestParameters['apiV1TrackerAffiliateNetworksIdPutRequest']),
        };
    }

    /**
     * Partial update. 
     * Update an affiliate network.
     */
    async apiV1TrackerAffiliateNetworksIdPutRaw(requestParameters: ApiV1TrackerAffiliateNetworksIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerAffiliateNetworksIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update. 
     * Update an affiliate network.
     */
    async apiV1TrackerAffiliateNetworksIdPut(requestParameters: ApiV1TrackerAffiliateNetworksIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerAffiliateNetworksIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerAffiliateNetworksPost without sending the request
     */
    async apiV1TrackerAffiliateNetworksPostRequestOpts(requestParameters: ApiV1TrackerAffiliateNetworksPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerAffiliateNetworksPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerAffiliateNetworksPostRequest',
                'Required parameter "apiV1TrackerAffiliateNetworksPostRequest" was null or undefined when calling apiV1TrackerAffiliateNetworksPost().'
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

        let urlPath = `/api/v1/tracker/affiliate-networks`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerAffiliateNetworksPostRequestToJSON(requestParameters['apiV1TrackerAffiliateNetworksPostRequest']),
        };
    }

    /**
     * `template_slug` preloads a known network\'s token mapping — see /affiliate-network-templates. 
     * Create an affiliate network.
     */
    async apiV1TrackerAffiliateNetworksPostRaw(requestParameters: ApiV1TrackerAffiliateNetworksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerAffiliateNetworksPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `template_slug` preloads a known network\'s token mapping — see /affiliate-network-templates. 
     * Create an affiliate network.
     */
    async apiV1TrackerAffiliateNetworksPost(requestParameters: ApiV1TrackerAffiliateNetworksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerAffiliateNetworksPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1TrackerAdNetworksGetStatusEnum = {
    Active: 'active',
    Inactive: 'inactive'
} as const;
export type ApiV1TrackerAdNetworksGetStatusEnum = typeof ApiV1TrackerAdNetworksGetStatusEnum[keyof typeof ApiV1TrackerAdNetworksGetStatusEnum];
/**
 * @export
 */
export const ApiV1TrackerAdNetworksGetSortByEnum = {
    Id: 'id',
    Name: 'name',
    Networkid: 'networkid',
    Currency: 'currency',
    IsActive: 'is_active'
} as const;
export type ApiV1TrackerAdNetworksGetSortByEnum = typeof ApiV1TrackerAdNetworksGetSortByEnum[keyof typeof ApiV1TrackerAdNetworksGetSortByEnum];
/**
 * @export
 */
export const ApiV1TrackerAdNetworksGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1TrackerAdNetworksGetSortDirEnum = typeof ApiV1TrackerAdNetworksGetSortDirEnum[keyof typeof ApiV1TrackerAdNetworksGetSortDirEnum];
/**
 * @export
 */
export const ApiV1TrackerAdNetworksReportsGetSortByEnum = {
    RId: 'r.id',
    RTimeadded: 'r.timeadded',
    RState: 'r.state',
    RAdNetworkid: 'r.ad_networkid'
} as const;
export type ApiV1TrackerAdNetworksReportsGetSortByEnum = typeof ApiV1TrackerAdNetworksReportsGetSortByEnum[keyof typeof ApiV1TrackerAdNetworksReportsGetSortByEnum];
/**
 * @export
 */
export const ApiV1TrackerAdNetworksReportsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1TrackerAdNetworksReportsGetSortDirEnum = typeof ApiV1TrackerAdNetworksReportsGetSortDirEnum[keyof typeof ApiV1TrackerAdNetworksReportsGetSortDirEnum];
