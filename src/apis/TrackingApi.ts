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
  ApiV1TrackingConversionTypesGet200Response,
  ApiV1TrackingConversionTypesPut200Response,
  ApiV1TrackingConversionTypesPutRequest,
  ApiV1TrackingPixelsGet200Response,
  ApiV1TrackingPixelsIdPutRequest,
  ApiV1TrackingPixelsPostRequest,
  TrackingPixel,
} from '../models/index';
import {
    ApiV1TrackingConversionTypesGet200ResponseFromJSON,
    ApiV1TrackingConversionTypesGet200ResponseToJSON,
    ApiV1TrackingConversionTypesPut200ResponseFromJSON,
    ApiV1TrackingConversionTypesPut200ResponseToJSON,
    ApiV1TrackingConversionTypesPutRequestFromJSON,
    ApiV1TrackingConversionTypesPutRequestToJSON,
    ApiV1TrackingPixelsGet200ResponseFromJSON,
    ApiV1TrackingPixelsGet200ResponseToJSON,
    ApiV1TrackingPixelsIdPutRequestFromJSON,
    ApiV1TrackingPixelsIdPutRequestToJSON,
    ApiV1TrackingPixelsPostRequestFromJSON,
    ApiV1TrackingPixelsPostRequestToJSON,
    TrackingPixelFromJSON,
    TrackingPixelToJSON,
} from '../models/index';

export interface ApiV1TrackingConversionTypesPutOperationRequest {
    apiV1TrackingConversionTypesPutRequest: ApiV1TrackingConversionTypesPutRequest;
}

export interface ApiV1TrackingPixelsGetRequest {
    conversionTypeId?: number;
    name?: string;
    page?: number;
    perPage?: number;
}

export interface ApiV1TrackingPixelsIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackingPixelsIdGetRequest {
    id: number;
}

export interface ApiV1TrackingPixelsIdPutOperationRequest {
    id: number;
    apiV1TrackingPixelsIdPutRequest: ApiV1TrackingPixelsIdPutRequest;
}

export interface ApiV1TrackingPixelsPostOperationRequest {
    apiV1TrackingPixelsPostRequest: ApiV1TrackingPixelsPostRequest;
}

/**
 * 
 */
export class TrackingApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackingConversionTypesGet without sending the request
     */
    async apiV1TrackingConversionTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracking/conversion-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The account\'s named conversion-type slots (0–25, sorted A–Z by name; unnamed slots are omitted), the slots opted out of click-id deduplication, the network\'s ad-domain and the configured tracking variable name (needed to construct the postback URL). `id` is the slot a postback\'s conversion type refers to. An account that has never saved its conversion types gets the defaults (0 = Sign ups, 1 = Conversions, 25 = Refunds) — the same names the first PUT seeds; an account that switched every slot off gets `[]`. Same handler as the panel. Requires the tenant\'s tracking module (`modules.advertiser.tracking`). 
     * Available conversion types for the caller\'s account.
     */
    async apiV1TrackingConversionTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackingConversionTypesGet200Response>> {
        const requestOptions = await this.apiV1TrackingConversionTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackingConversionTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The account\'s named conversion-type slots (0–25, sorted A–Z by name; unnamed slots are omitted), the slots opted out of click-id deduplication, the network\'s ad-domain and the configured tracking variable name (needed to construct the postback URL). `id` is the slot a postback\'s conversion type refers to. An account that has never saved its conversion types gets the defaults (0 = Sign ups, 1 = Conversions, 25 = Refunds) — the same names the first PUT seeds; an account that switched every slot off gets `[]`. Same handler as the panel. Requires the tenant\'s tracking module (`modules.advertiser.tracking`). 
     * Available conversion types for the caller\'s account.
     */
    async apiV1TrackingConversionTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackingConversionTypesGet200Response> {
        const response = await this.apiV1TrackingConversionTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackingConversionTypesPut without sending the request
     */
    async apiV1TrackingConversionTypesPutRequestOpts(requestParameters: ApiV1TrackingConversionTypesPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackingConversionTypesPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackingConversionTypesPutRequest',
                'Required parameter "apiV1TrackingConversionTypesPutRequest" was null or undefined when calling apiV1TrackingConversionTypesPut().'
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

        let urlPath = `/api/v1/tracking/conversion-types`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackingConversionTypesPutRequestToJSON(requestParameters['apiV1TrackingConversionTypesPutRequest']),
        };
    }

    /**
     * Same handler as the panel\'s Tracking page. Send either `types: [{id, name}]` or `conv_type_0`..`conv_type_25` keys to name slots (an empty name clears the slot; HTML tags are stripped), and/or `skip_dedup: [slot ids]` to replace the set of slots excluded from click-id deduplication (an empty array clears it). Slots outside 0–25 are ignored. Fields you don\'t send are left alone. Unknown keys are a 422 for API callers. The first save creates the account\'s row with the defaults Sign ups (0), Conversions (1), Refunds (25). 
     * Name conversion-type slots and set the click-id dedup opt-outs.
     */
    async apiV1TrackingConversionTypesPutRaw(requestParameters: ApiV1TrackingConversionTypesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackingConversionTypesPut200Response>> {
        const requestOptions = await this.apiV1TrackingConversionTypesPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackingConversionTypesPut200ResponseFromJSON(jsonValue));
    }

    /**
     * Same handler as the panel\'s Tracking page. Send either `types: [{id, name}]` or `conv_type_0`..`conv_type_25` keys to name slots (an empty name clears the slot; HTML tags are stripped), and/or `skip_dedup: [slot ids]` to replace the set of slots excluded from click-id deduplication (an empty array clears it). Slots outside 0–25 are ignored. Fields you don\'t send are left alone. Unknown keys are a 422 for API callers. The first save creates the account\'s row with the defaults Sign ups (0), Conversions (1), Refunds (25). 
     * Name conversion-type slots and set the click-id dedup opt-outs.
     */
    async apiV1TrackingConversionTypesPut(requestParameters: ApiV1TrackingConversionTypesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackingConversionTypesPut200Response> {
        const response = await this.apiV1TrackingConversionTypesPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackingPixelsGet without sending the request
     * @deprecated
     */
    async apiV1TrackingPixelsGetRequestOpts(requestParameters: ApiV1TrackingPixelsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['conversionTypeId'] != null) {
            queryParameters['conversion_type_id'] = requestParameters['conversionTypeId'];
        }

        if (requestParameters['name'] != null) {
            queryParameters['name'] = requestParameters['name'];
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

        let urlPath = `/api/v1/tracking/pixels`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deprecated: List the caller\'s conversion-tracking pixels.
     * @deprecated
     */
    async apiV1TrackingPixelsGetRaw(requestParameters: ApiV1TrackingPixelsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackingPixelsGet200Response>> {
        const requestOptions = await this.apiV1TrackingPixelsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackingPixelsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Deprecated: List the caller\'s conversion-tracking pixels.
     * @deprecated
     */
    async apiV1TrackingPixelsGet(requestParameters: ApiV1TrackingPixelsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackingPixelsGet200Response> {
        const response = await this.apiV1TrackingPixelsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackingPixelsIdDelete without sending the request
     * @deprecated
     */
    async apiV1TrackingPixelsIdDeleteRequestOpts(requestParameters: ApiV1TrackingPixelsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackingPixelsIdDelete().'
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

        let urlPath = `/api/v1/tracking/pixels/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deprecated: Delete a pixel.
     * @deprecated
     */
    async apiV1TrackingPixelsIdDeleteRaw(requestParameters: ApiV1TrackingPixelsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackingPixelsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deprecated: Delete a pixel.
     * @deprecated
     */
    async apiV1TrackingPixelsIdDelete(requestParameters: ApiV1TrackingPixelsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackingPixelsIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackingPixelsIdGet without sending the request
     * @deprecated
     */
    async apiV1TrackingPixelsIdGetRequestOpts(requestParameters: ApiV1TrackingPixelsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackingPixelsIdGet().'
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

        let urlPath = `/api/v1/tracking/pixels/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deprecated: Get one pixel.
     * @deprecated
     */
    async apiV1TrackingPixelsIdGetRaw(requestParameters: ApiV1TrackingPixelsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TrackingPixel>> {
        const requestOptions = await this.apiV1TrackingPixelsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TrackingPixelFromJSON(jsonValue));
    }

    /**
     * Deprecated: Get one pixel.
     * @deprecated
     */
    async apiV1TrackingPixelsIdGet(requestParameters: ApiV1TrackingPixelsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TrackingPixel> {
        const response = await this.apiV1TrackingPixelsIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackingPixelsIdPut without sending the request
     * @deprecated
     */
    async apiV1TrackingPixelsIdPutRequestOpts(requestParameters: ApiV1TrackingPixelsIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackingPixelsIdPut().'
            );
        }

        if (requestParameters['apiV1TrackingPixelsIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackingPixelsIdPutRequest',
                'Required parameter "apiV1TrackingPixelsIdPutRequest" was null or undefined when calling apiV1TrackingPixelsIdPut().'
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

        let urlPath = `/api/v1/tracking/pixels/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackingPixelsIdPutRequestToJSON(requestParameters['apiV1TrackingPixelsIdPutRequest']),
        };
    }

    /**
     * Deprecated: Update a pixel\'s name or conversion type.
     * @deprecated
     */
    async apiV1TrackingPixelsIdPutRaw(requestParameters: ApiV1TrackingPixelsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TrackingPixel>> {
        const requestOptions = await this.apiV1TrackingPixelsIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TrackingPixelFromJSON(jsonValue));
    }

    /**
     * Deprecated: Update a pixel\'s name or conversion type.
     * @deprecated
     */
    async apiV1TrackingPixelsIdPut(requestParameters: ApiV1TrackingPixelsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TrackingPixel> {
        const response = await this.apiV1TrackingPixelsIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackingPixelsPost without sending the request
     * @deprecated
     */
    async apiV1TrackingPixelsPostRequestOpts(requestParameters: ApiV1TrackingPixelsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackingPixelsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackingPixelsPostRequest',
                'Required parameter "apiV1TrackingPixelsPostRequest" was null or undefined when calling apiV1TrackingPixelsPost().'
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

        let urlPath = `/api/v1/tracking/pixels`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackingPixelsPostRequestToJSON(requestParameters['apiV1TrackingPixelsPostRequest']),
        };
    }

    /**
     * Deprecated — the row is stored but nothing reads it. `pixel_code` is generated server-side (32 random hex chars) and returned in the response; putting it in a conversion URL has no effect. To track conversions, name a slot with PUT /api/v1/tracking/conversion-types and send postbacks with the click id and that slot. 
     * Deprecated: Create a new tracking pixel.
     * @deprecated
     */
    async apiV1TrackingPixelsPostRaw(requestParameters: ApiV1TrackingPixelsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TrackingPixel>> {
        const requestOptions = await this.apiV1TrackingPixelsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TrackingPixelFromJSON(jsonValue));
    }

    /**
     * Deprecated — the row is stored but nothing reads it. `pixel_code` is generated server-side (32 random hex chars) and returned in the response; putting it in a conversion URL has no effect. To track conversions, name a slot with PUT /api/v1/tracking/conversion-types and send postbacks with the click id and that slot. 
     * Deprecated: Create a new tracking pixel.
     * @deprecated
     */
    async apiV1TrackingPixelsPost(requestParameters: ApiV1TrackingPixelsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TrackingPixel> {
        const response = await this.apiV1TrackingPixelsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
