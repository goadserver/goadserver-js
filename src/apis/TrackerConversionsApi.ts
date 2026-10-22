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
  ApiV1PublisherPushCampaignsPost200Response,
  ApiV1TrackerConversionLoggingPutRequest,
  ApiV1TrackerConversionTypesPutRequest,
  ApiV1TrackerConversionsGet200Response,
  ApiV1TrackerConversionsIdStatePutRequest,
  ApiV1TrackerTrackingLinksIdZoneCostsGet200Response,
} from '../models/index';
import {
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1TrackerConversionLoggingPutRequestFromJSON,
    ApiV1TrackerConversionLoggingPutRequestToJSON,
    ApiV1TrackerConversionTypesPutRequestFromJSON,
    ApiV1TrackerConversionTypesPutRequestToJSON,
    ApiV1TrackerConversionsGet200ResponseFromJSON,
    ApiV1TrackerConversionsGet200ResponseToJSON,
    ApiV1TrackerConversionsIdStatePutRequestFromJSON,
    ApiV1TrackerConversionsIdStatePutRequestToJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1TrackerConversionLoggingPutOperationRequest {
    apiV1TrackerConversionLoggingPutRequest: ApiV1TrackerConversionLoggingPutRequest;
}

export interface ApiV1TrackerConversionTypesPutOperationRequest {
    apiV1TrackerConversionTypesPutRequest: ApiV1TrackerConversionTypesPutRequest;
}

export interface ApiV1TrackerConversionsClickidPostbacksGetRequest {
    clickid: string;
    convType?: string;
}

export interface ApiV1TrackerConversionsGetRequest {
    startDate?: string;
    endDate?: string;
    state?: number;
    reasonId?: number;
    search?: string;
    sortBy?: string;
    sortDir?: ApiV1TrackerConversionsGetSortDirEnum;
    limit?: number;
}

export interface ApiV1TrackerConversionsIdStatePutOperationRequest {
    id: number;
    apiV1TrackerConversionsIdStatePutRequest: ApiV1TrackerConversionsIdStatePutRequest;
}

/**
 * 
 */
export class TrackerConversionsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackerConversionLoggingGet without sending the request
     */
    async apiV1TrackerConversionLoggingGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/conversion-logging`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Whether incoming conversions are logged, and whether they land pending review rather than settled. 
     * Get conversion-logging settings.
     */
    async apiV1TrackerConversionLoggingGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionLoggingGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Whether incoming conversions are logged, and whether they land pending review rather than settled. 
     * Get conversion-logging settings.
     */
    async apiV1TrackerConversionLoggingGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerConversionLoggingGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionLoggingPut without sending the request
     */
    async apiV1TrackerConversionLoggingPutRequestOpts(requestParameters: ApiV1TrackerConversionLoggingPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerConversionLoggingPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerConversionLoggingPutRequest',
                'Required parameter "apiV1TrackerConversionLoggingPutRequest" was null or undefined when calling apiV1TrackerConversionLoggingPut().'
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

        let urlPath = `/api/v1/tracker/conversion-logging`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerConversionLoggingPutRequestToJSON(requestParameters['apiV1TrackerConversionLoggingPutRequest']),
        };
    }

    /**
     * Turning `pend_conversions` on routes new conversions to the pending queue instead of settling them on arrival. 
     * Change conversion-logging settings.
     */
    async apiV1TrackerConversionLoggingPutRaw(requestParameters: ApiV1TrackerConversionLoggingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionLoggingPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Turning `pend_conversions` on routes new conversions to the pending queue instead of settling them on arrival. 
     * Change conversion-logging settings.
     */
    async apiV1TrackerConversionLoggingPut(requestParameters: ApiV1TrackerConversionLoggingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerConversionLoggingPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionTypesGet without sending the request
     */
    async apiV1TrackerConversionTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/conversion-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The caller\'s A–Z map — which event each conversion-type letter means. 
     * Get the conversion-type labels.
     */
    async apiV1TrackerConversionTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The caller\'s A–Z map — which event each conversion-type letter means. 
     * Get the conversion-type labels.
     */
    async apiV1TrackerConversionTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerConversionTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionTypesPut without sending the request
     */
    async apiV1TrackerConversionTypesPutRequestOpts(requestParameters: ApiV1TrackerConversionTypesPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerConversionTypesPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerConversionTypesPutRequest',
                'Required parameter "apiV1TrackerConversionTypesPutRequest" was null or undefined when calling apiV1TrackerConversionTypesPut().'
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

        let urlPath = `/api/v1/tracker/conversion-types`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerConversionTypesPutRequestToJSON(requestParameters['apiV1TrackerConversionTypesPutRequest']),
        };
    }

    /**
     * Bulk replace of the letter → label map. 
     * Rename the conversion types.
     */
    async apiV1TrackerConversionTypesPutRaw(requestParameters: ApiV1TrackerConversionTypesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionTypesPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Bulk replace of the letter → label map. 
     * Rename the conversion types.
     */
    async apiV1TrackerConversionTypesPut(requestParameters: ApiV1TrackerConversionTypesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerConversionTypesPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionsClickidPostbacksGet without sending the request
     */
    async apiV1TrackerConversionsClickidPostbacksGetRequestOpts(requestParameters: ApiV1TrackerConversionsClickidPostbacksGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['clickid'] == null) {
            throw new runtime.RequiredError(
                'clickid',
                'Required parameter "clickid" was null or undefined when calling apiV1TrackerConversionsClickidPostbacksGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['convType'] != null) {
            queryParameters['conv_type'] = requestParameters['convType'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/conversions/{clickid}/postbacks`;
        urlPath = urlPath.replace(`{${"clickid"}}`, encodeURIComponent(String(requestParameters['clickid'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Joined by clickid — what was forwarded upstream, when, and how it answered. 
     * Outbound postbacks fired for one conversion.
     */
    async apiV1TrackerConversionsClickidPostbacksGetRaw(requestParameters: ApiV1TrackerConversionsClickidPostbacksGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionsClickidPostbacksGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Joined by clickid — what was forwarded upstream, when, and how it answered. 
     * Outbound postbacks fired for one conversion.
     */
    async apiV1TrackerConversionsClickidPostbacksGet(requestParameters: ApiV1TrackerConversionsClickidPostbacksGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerConversionsClickidPostbacksGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionsGet without sending the request
     */
    async apiV1TrackerConversionsGetRequestOpts(requestParameters: ApiV1TrackerConversionsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['start_date'] = requestParameters['startDate'];
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['end_date'] = requestParameters['endDate'];
        }

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state'];
        }

        if (requestParameters['reasonId'] != null) {
            queryParameters['reason_id'] = requestParameters['reasonId'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sort_by'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sort_dir'] = requestParameters['sortDir'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/conversions`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Conversions logged against the caller\'s offers, with the summary counts (clean / on hold / approved / rejected) the settlement view sums. Requires conversion logging to be on — see /conversion-logging. 
     * List incoming conversions.
     */
    async apiV1TrackerConversionsGetRaw(requestParameters: ApiV1TrackerConversionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerConversionsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerConversionsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Conversions logged against the caller\'s offers, with the summary counts (clean / on hold / approved / rejected) the settlement view sums. Requires conversion logging to be on — see /conversion-logging. 
     * List incoming conversions.
     */
    async apiV1TrackerConversionsGet(requestParameters: ApiV1TrackerConversionsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerConversionsGet200Response> {
        const response = await this.apiV1TrackerConversionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionsIdStatePut without sending the request
     */
    async apiV1TrackerConversionsIdStatePutRequestOpts(requestParameters: ApiV1TrackerConversionsIdStatePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerConversionsIdStatePut().'
            );
        }

        if (requestParameters['apiV1TrackerConversionsIdStatePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerConversionsIdStatePutRequest',
                'Required parameter "apiV1TrackerConversionsIdStatePutRequest" was null or undefined when calling apiV1TrackerConversionsIdStatePut().'
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

        let urlPath = `/api/v1/tracker/conversions/{id}/state`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerConversionsIdStatePutRequestToJSON(requestParameters['apiV1TrackerConversionsIdStatePutRequest']),
        };
    }

    /**
     * Settles a pending conversion. This is the one tracker write that moves money-bearing state, which is why it carries its own scope rather than riding on tracker.write. 
     * Approve or reject one conversion.
     */
    async apiV1TrackerConversionsIdStatePutRaw(requestParameters: ApiV1TrackerConversionsIdStatePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerConversionsIdStatePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Settles a pending conversion. This is the one tracker write that moves money-bearing state, which is why it carries its own scope rather than riding on tracker.write. 
     * Approve or reject one conversion.
     */
    async apiV1TrackerConversionsIdStatePut(requestParameters: ApiV1TrackerConversionsIdStatePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerConversionsIdStatePutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerConversionsRejectedGet without sending the request
     */
    async apiV1TrackerConversionsRejectedGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/conversions/rejected`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The other half of the inbound stream: postbacks that never became a conversion, with the reason each was refused. The first place to look when a partner insists they fired one. 
     * List refused inbound postbacks.
     */
    async apiV1TrackerConversionsRejectedGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerConversionsRejectedGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The other half of the inbound stream: postbacks that never became a conversion, with the reason each was refused. The first place to look when a partner insists they fired one. 
     * List refused inbound postbacks.
     */
    async apiV1TrackerConversionsRejectedGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerConversionsRejectedGetRaw(initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1TrackerConversionsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1TrackerConversionsGetSortDirEnum = typeof ApiV1TrackerConversionsGetSortDirEnum[keyof typeof ApiV1TrackerConversionsGetSortDirEnum];
