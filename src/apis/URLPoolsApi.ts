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
  ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response,
  ApiV1CreativePoolsIdItemsItemIdPut409Response,
  ApiV1CreativesGet200Response,
  ApiV1UrlPoolsIdPutRequest,
  ApiV1UrlPoolsIdUrlsPostRequest,
  ApiV1UrlPoolsIdUrlsUrlIdPutRequest,
  ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest,
  ApiV1UrlPoolsPostRequest,
  ApiV1UrlPoolsReplaceUrlPutRequest,
} from '../models/index';
import {
    ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseToJSON,
    ApiV1CreativePoolsIdItemsItemIdPut409ResponseFromJSON,
    ApiV1CreativePoolsIdItemsItemIdPut409ResponseToJSON,
    ApiV1CreativesGet200ResponseFromJSON,
    ApiV1CreativesGet200ResponseToJSON,
    ApiV1UrlPoolsIdPutRequestFromJSON,
    ApiV1UrlPoolsIdPutRequestToJSON,
    ApiV1UrlPoolsIdUrlsPostRequestFromJSON,
    ApiV1UrlPoolsIdUrlsPostRequestToJSON,
    ApiV1UrlPoolsIdUrlsUrlIdPutRequestFromJSON,
    ApiV1UrlPoolsIdUrlsUrlIdPutRequestToJSON,
    ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequestFromJSON,
    ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequestToJSON,
    ApiV1UrlPoolsPostRequestFromJSON,
    ApiV1UrlPoolsPostRequestToJSON,
    ApiV1UrlPoolsReplaceUrlPutRequestFromJSON,
    ApiV1UrlPoolsReplaceUrlPutRequestToJSON,
} from '../models/index';

export interface ApiV1UrlPoolsGetRequest {
    selectStats?: ApiV1UrlPoolsGetSelectStatsEnum;
    from?: Date;
    to?: Date;
    page?: number;
    perPage?: number;
    filterId?: number;
    filterTitle?: string;
    filterName?: string;
    state?: ApiV1UrlPoolsGetStateEnum;
    search?: string;
    sortBy?: ApiV1UrlPoolsGetSortByEnum;
    sortDir?: ApiV1UrlPoolsGetSortDirEnum;
}

export interface ApiV1UrlPoolsIdClonePostRequest {
    id: number;
}

export interface ApiV1UrlPoolsIdDeleteRequest {
    id: number;
}

export interface ApiV1UrlPoolsIdGetRequest {
    id: number;
}

export interface ApiV1UrlPoolsIdPutOperationRequest {
    id: number;
    apiV1UrlPoolsIdPutRequest: ApiV1UrlPoolsIdPutRequest;
}

export interface ApiV1UrlPoolsIdRecoverPostRequest {
    id: number;
}

export interface ApiV1UrlPoolsIdUrlsGetRequest {
    id: number;
    filterUrl?: string;
    filterIsactive?: ApiV1UrlPoolsIdUrlsGetFilterIsactiveEnum;
    search?: string;
    sortBy?: ApiV1UrlPoolsIdUrlsGetSortByEnum;
    sortDir?: ApiV1UrlPoolsIdUrlsGetSortDirEnum;
    page?: number;
    perPage?: number;
    selectStats?: ApiV1UrlPoolsIdUrlsGetSelectStatsEnum;
    from?: Date;
    to?: Date;
}

export interface ApiV1UrlPoolsIdUrlsPostOperationRequest {
    id: number;
    apiV1UrlPoolsIdUrlsPostRequest: ApiV1UrlPoolsIdUrlsPostRequest;
}

export interface ApiV1UrlPoolsIdUrlsUrlIdClonePostRequest {
    id: number;
    urlId: number;
}

export interface ApiV1UrlPoolsIdUrlsUrlIdDeleteRequest {
    id: number;
    urlId: number;
}

export interface ApiV1UrlPoolsIdUrlsUrlIdGetRequest {
    id: number;
    urlId: number;
}

export interface ApiV1UrlPoolsIdUrlsUrlIdPutOperationRequest {
    id: number;
    urlId: number;
    apiV1UrlPoolsIdUrlsUrlIdPutRequest: ApiV1UrlPoolsIdUrlsUrlIdPutRequest;
}

export interface ApiV1UrlPoolsIdUrlsUrlIdTogglePutRequest {
    id: number;
    urlId: number;
}

export interface ApiV1UrlPoolsIdUrlsUrlIdWeightPutOperationRequest {
    id: number;
    urlId: number;
    apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest: ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest;
}

export interface ApiV1UrlPoolsIdUsedInGetRequest {
    id: number;
}

export interface ApiV1UrlPoolsPostOperationRequest {
    apiV1UrlPoolsPostRequest: ApiV1UrlPoolsPostRequest;
}

export interface ApiV1UrlPoolsReplaceUrlPutOperationRequest {
    apiV1UrlPoolsReplaceUrlPutRequest: ApiV1UrlPoolsReplaceUrlPutRequest;
}

/**
 * 
 */
export class URLPoolsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1UrlPoolsGet without sending the request
     */
    async apiV1UrlPoolsGetRequestOpts(requestParameters: ApiV1UrlPoolsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['selectStats'] != null) {
            queryParameters['select_stats'] = requestParameters['selectStats'];
        }

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterTitle'] != null) {
            queryParameters['filter_title'] = requestParameters['filterTitle'];
        }

        if (requestParameters['filterName'] != null) {
            queryParameters['filter_name'] = requestParameters['filterName'];
        }

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state'];
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

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/url-pools`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * List URL pools.
     */
    async apiV1UrlPoolsGetRaw(requestParameters: ApiV1UrlPoolsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativesGet200Response>> {
        const requestOptions = await this.apiV1UrlPoolsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * List URL pools.
     */
    async apiV1UrlPoolsGet(requestParameters: ApiV1UrlPoolsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativesGet200Response> {
        const response = await this.apiV1UrlPoolsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1UrlPoolsIdClonePost without sending the request
     */
    async apiV1UrlPoolsIdClonePostRequestOpts(requestParameters: ApiV1UrlPoolsIdClonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdClonePost().'
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

        let urlPath = `/api/v1/url-pools/{id}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Duplicates the pool row and every URL in it (`isdeleted=0`). New pool title is suffixed with \" (Copy)\". 
     * Clone a URL pool with all its URLs.
     */
    async apiV1UrlPoolsIdClonePostRaw(requestParameters: ApiV1UrlPoolsIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response>> {
        const requestOptions = await this.apiV1UrlPoolsIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Duplicates the pool row and every URL in it (`isdeleted=0`). New pool title is suffixed with \" (Copy)\". 
     * Clone a URL pool with all its URLs.
     */
    async apiV1UrlPoolsIdClonePost(requestParameters: ApiV1UrlPoolsIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response> {
        const response = await this.apiV1UrlPoolsIdClonePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1UrlPoolsIdDelete without sending the request
     */
    async apiV1UrlPoolsIdDeleteRequestOpts(requestParameters: ApiV1UrlPoolsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdDelete().'
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

        let urlPath = `/api/v1/url-pools/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft-delete a URL pool.
     */
    async apiV1UrlPoolsIdDeleteRaw(requestParameters: ApiV1UrlPoolsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft-delete a URL pool.
     */
    async apiV1UrlPoolsIdDelete(requestParameters: ApiV1UrlPoolsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdGet without sending the request
     */
    async apiV1UrlPoolsIdGetRequestOpts(requestParameters: ApiV1UrlPoolsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdGet().'
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

        let urlPath = `/api/v1/url-pools/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Show one URL pool.
     */
    async apiV1UrlPoolsIdGetRaw(requestParameters: ApiV1UrlPoolsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Show one URL pool.
     */
    async apiV1UrlPoolsIdGet(requestParameters: ApiV1UrlPoolsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdPut without sending the request
     */
    async apiV1UrlPoolsIdPutRequestOpts(requestParameters: ApiV1UrlPoolsIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdPut().'
            );
        }

        if (requestParameters['apiV1UrlPoolsIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1UrlPoolsIdPutRequest',
                'Required parameter "apiV1UrlPoolsIdPutRequest" was null or undefined when calling apiV1UrlPoolsIdPut().'
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

        let urlPath = `/api/v1/url-pools/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1UrlPoolsIdPutRequestToJSON(requestParameters['apiV1UrlPoolsIdPutRequest']),
        };
    }

    /**
     * Update URL pool meta.
     */
    async apiV1UrlPoolsIdPutRaw(requestParameters: ApiV1UrlPoolsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update URL pool meta.
     */
    async apiV1UrlPoolsIdPut(requestParameters: ApiV1UrlPoolsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdRecoverPost without sending the request
     */
    async apiV1UrlPoolsIdRecoverPostRequestOpts(requestParameters: ApiV1UrlPoolsIdRecoverPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdRecoverPost().'
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

        let urlPath = `/api/v1/url-pools/{id}/recover`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Reverses the soft delete of DELETE /url-pools/{id} (and of Cleanup\'s Archive): the pool is listed and usable again. Its URLs were never removed, so they are all there. 404 when the pool does not exist, is not archived, or was purged. 
     * Restore an archived url pool.
     */
    async apiV1UrlPoolsIdRecoverPostRaw(requestParameters: ApiV1UrlPoolsIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdRecoverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Reverses the soft delete of DELETE /url-pools/{id} (and of Cleanup\'s Archive): the pool is listed and usable again. Its URLs were never removed, so they are all there. 404 when the pool does not exist, is not archived, or was purged. 
     * Restore an archived url pool.
     */
    async apiV1UrlPoolsIdRecoverPost(requestParameters: ApiV1UrlPoolsIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdRecoverPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsGet without sending the request
     */
    async apiV1UrlPoolsIdUrlsGetRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['filterUrl'] != null) {
            queryParameters['filter_url'] = requestParameters['filterUrl'];
        }

        if (requestParameters['filterIsactive'] != null) {
            queryParameters['filter_isactive'] = requestParameters['filterIsactive'];
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

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['selectStats'] != null) {
            queryParameters['select_stats'] = requestParameters['selectStats'];
        }

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/url-pools/{id}/urls`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * List URLs in a pool.
     */
    async apiV1UrlPoolsIdUrlsGetRaw(requestParameters: ApiV1UrlPoolsIdUrlsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * List URLs in a pool.
     */
    async apiV1UrlPoolsIdUrlsGet(requestParameters: ApiV1UrlPoolsIdUrlsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUrlsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsPost without sending the request
     */
    async apiV1UrlPoolsIdUrlsPostRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsPost().'
            );
        }

        if (requestParameters['apiV1UrlPoolsIdUrlsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1UrlPoolsIdUrlsPostRequest',
                'Required parameter "apiV1UrlPoolsIdUrlsPostRequest" was null or undefined when calling apiV1UrlPoolsIdUrlsPost().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1UrlPoolsIdUrlsPostRequestToJSON(requestParameters['apiV1UrlPoolsIdUrlsPostRequest']),
        };
    }

    /**
     * Add a URL to a pool.
     */
    async apiV1UrlPoolsIdUrlsPostRaw(requestParameters: ApiV1UrlPoolsIdUrlsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Add a URL to a pool.
     */
    async apiV1UrlPoolsIdUrlsPost(requestParameters: ApiV1UrlPoolsIdUrlsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response> {
        const response = await this.apiV1UrlPoolsIdUrlsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsUrlIdClonePost without sending the request
     */
    async apiV1UrlPoolsIdUrlsUrlIdClonePostRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdClonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdClonePost().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdClonePost().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls/{urlId}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Clone a single URL within the same pool.
     */
    async apiV1UrlPoolsIdUrlsUrlIdClonePostRaw(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsUrlIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Clone a single URL within the same pool.
     */
    async apiV1UrlPoolsIdUrlsUrlIdClonePost(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response> {
        const response = await this.apiV1UrlPoolsIdUrlsUrlIdClonePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsUrlIdDelete without sending the request
     */
    async apiV1UrlPoolsIdUrlsUrlIdDeleteRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdDelete().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdDelete().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls/{urlId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft-delete a single URL.
     */
    async apiV1UrlPoolsIdUrlsUrlIdDeleteRaw(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsUrlIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft-delete a single URL.
     */
    async apiV1UrlPoolsIdUrlsUrlIdDelete(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUrlsUrlIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsUrlIdGet without sending the request
     */
    async apiV1UrlPoolsIdUrlsUrlIdGetRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdGet().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdGet().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls/{urlId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Show a single URL.
     */
    async apiV1UrlPoolsIdUrlsUrlIdGetRaw(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsUrlIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Show a single URL.
     */
    async apiV1UrlPoolsIdUrlsUrlIdGet(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUrlsUrlIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsUrlIdPut without sending the request
     */
    async apiV1UrlPoolsIdUrlsUrlIdPutRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdPut().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdPut().'
            );
        }

        if (requestParameters['apiV1UrlPoolsIdUrlsUrlIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1UrlPoolsIdUrlsUrlIdPutRequest',
                'Required parameter "apiV1UrlPoolsIdUrlsUrlIdPutRequest" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdPut().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls/{urlId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1UrlPoolsIdUrlsUrlIdPutRequestToJSON(requestParameters['apiV1UrlPoolsIdUrlsUrlIdPutRequest']),
        };
    }

    /**
     * Editable fields — `url`, `title`, `weight`, `properties`, `keywords`, `is_fallback`, `start_at`, `end_at`.  **Scheduling.** `start_at` / `end_at` make the URL serve only inside `[start_at, end_at)`. Send unix seconds or an RFC 3339 time with its offset (`2026-10-20T09:00:00-04:00` = 9:00 AM New York); `null`, `0` or `\"\"` clears that side. The ad servers pick up an edit within a minute and then switch on the exact second.  **Backup** (`is_fallback: true`): the URL is used only while no other URL of the pool is live — mark the regular lander as backup and schedule the promo lander; the regular one steps aside while the promo runs and returns when it ends. Keyword targeting then applies within whichever set is live. Not to be confused with a keyword *fallback* URL (one without keywords).  A change that would leave a pool still used by campaign ads with no URL to serve at some moment is refused with 409 `SCHEDULE_LEAVES_POOL_EMPTY` (`gap_at` = first uncovered unix second). Pausing or deleting a URL runs the same check over the other URLs\' schedules. 
     * Update a single URL.
     */
    async apiV1UrlPoolsIdUrlsUrlIdPutRaw(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsUrlIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Editable fields — `url`, `title`, `weight`, `properties`, `keywords`, `is_fallback`, `start_at`, `end_at`.  **Scheduling.** `start_at` / `end_at` make the URL serve only inside `[start_at, end_at)`. Send unix seconds or an RFC 3339 time with its offset (`2026-10-20T09:00:00-04:00` = 9:00 AM New York); `null`, `0` or `\"\"` clears that side. The ad servers pick up an edit within a minute and then switch on the exact second.  **Backup** (`is_fallback: true`): the URL is used only while no other URL of the pool is live — mark the regular lander as backup and schedule the promo lander; the regular one steps aside while the promo runs and returns when it ends. Keyword targeting then applies within whichever set is live. Not to be confused with a keyword *fallback* URL (one without keywords).  A change that would leave a pool still used by campaign ads with no URL to serve at some moment is refused with 409 `SCHEDULE_LEAVES_POOL_EMPTY` (`gap_at` = first uncovered unix second). Pausing or deleting a URL runs the same check over the other URLs\' schedules. 
     * Update a single URL.
     */
    async apiV1UrlPoolsIdUrlsUrlIdPut(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUrlsUrlIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsUrlIdTogglePut without sending the request
     */
    async apiV1UrlPoolsIdUrlsUrlIdTogglePutRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdTogglePutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdTogglePut().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdTogglePut().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls/{urlId}/toggle`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Toggle a URL on / off.
     */
    async apiV1UrlPoolsIdUrlsUrlIdTogglePutRaw(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsUrlIdTogglePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Toggle a URL on / off.
     */
    async apiV1UrlPoolsIdUrlsUrlIdTogglePut(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUrlsUrlIdTogglePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUrlsUrlIdWeightPut without sending the request
     */
    async apiV1UrlPoolsIdUrlsUrlIdWeightPutRequestOpts(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdWeightPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdWeightPut().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdWeightPut().'
            );
        }

        if (requestParameters['apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest',
                'Required parameter "apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest" was null or undefined when calling apiV1UrlPoolsIdUrlsUrlIdWeightPut().'
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

        let urlPath = `/api/v1/url-pools/{id}/urls/{urlId}/weight`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequestToJSON(requestParameters['apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest']),
        };
    }

    /**
     * Higher weight = more traffic share when `sort_type=wr`. Has no effect for `rnd`, `ctr` and `cr` sort modes. 
     * Set a URL\'s rotation weight.
     */
    async apiV1UrlPoolsIdUrlsUrlIdWeightPutRaw(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdWeightPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUrlsUrlIdWeightPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Higher weight = more traffic share when `sort_type=wr`. Has no effect for `rnd`, `ctr` and `cr` sort modes. 
     * Set a URL\'s rotation weight.
     */
    async apiV1UrlPoolsIdUrlsUrlIdWeightPut(requestParameters: ApiV1UrlPoolsIdUrlsUrlIdWeightPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUrlsUrlIdWeightPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsIdUsedInGet without sending the request
     */
    async apiV1UrlPoolsIdUsedInGetRequestOpts(requestParameters: ApiV1UrlPoolsIdUsedInGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1UrlPoolsIdUsedInGet().'
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

        let urlPath = `/api/v1/url-pools/{id}/used-in`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * List campaigns / ads that reference this URL pool.
     */
    async apiV1UrlPoolsIdUsedInGetRaw(requestParameters: ApiV1UrlPoolsIdUsedInGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsIdUsedInGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * List campaigns / ads that reference this URL pool.
     */
    async apiV1UrlPoolsIdUsedInGet(requestParameters: ApiV1UrlPoolsIdUsedInGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsIdUsedInGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1UrlPoolsPost without sending the request
     */
    async apiV1UrlPoolsPostRequestOpts(requestParameters: ApiV1UrlPoolsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1UrlPoolsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1UrlPoolsPostRequest',
                'Required parameter "apiV1UrlPoolsPostRequest" was null or undefined when calling apiV1UrlPoolsPost().'
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

        let urlPath = `/api/v1/url-pools`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1UrlPoolsPostRequestToJSON(requestParameters['apiV1UrlPoolsPostRequest']),
        };
    }

    /**
     * Create a URL pool.
     */
    async apiV1UrlPoolsPostRaw(requestParameters: ApiV1UrlPoolsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response>> {
        const requestOptions = await this.apiV1UrlPoolsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Create a URL pool.
     */
    async apiV1UrlPoolsPost(requestParameters: ApiV1UrlPoolsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response> {
        const response = await this.apiV1UrlPoolsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1UrlPoolsReplaceUrlPut without sending the request
     */
    async apiV1UrlPoolsReplaceUrlPutRequestOpts(requestParameters: ApiV1UrlPoolsReplaceUrlPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1UrlPoolsReplaceUrlPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1UrlPoolsReplaceUrlPutRequest',
                'Required parameter "apiV1UrlPoolsReplaceUrlPutRequest" was null or undefined when calling apiV1UrlPoolsReplaceUrlPut().'
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

        let urlPath = `/api/v1/url-pools/replace-url`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1UrlPoolsReplaceUrlPutRequestToJSON(requestParameters['apiV1UrlPoolsReplaceUrlPutRequest']),
        };
    }

    /**
     * Replaces the first occurrence of `search` with `replace` in every matching URL of your URL pools — e.g. swap a tracker domain or an offer id. Narrow with `poolids` and/or `urlids`; both empty = every URL of every pool you own. `dry_run: true` returns the matches (old → new) without writing — recommended first. Logged to the account\'s action log. A key pinned to campaigns is refused (URL pools feed ads of any campaign). Same handler as the panel. 
     * Search & replace text across your URL-pool URLs.
     */
    async apiV1UrlPoolsReplaceUrlPutRaw(requestParameters: ApiV1UrlPoolsReplaceUrlPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1UrlPoolsReplaceUrlPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Replaces the first occurrence of `search` with `replace` in every matching URL of your URL pools — e.g. swap a tracker domain or an offer id. Narrow with `poolids` and/or `urlids`; both empty = every URL of every pool you own. `dry_run: true` returns the matches (old → new) without writing — recommended first. Logged to the account\'s action log. A key pinned to campaigns is refused (URL pools feed ads of any campaign). Same handler as the panel. 
     * Search & replace text across your URL-pool URLs.
     */
    async apiV1UrlPoolsReplaceUrlPut(requestParameters: ApiV1UrlPoolsReplaceUrlPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1UrlPoolsReplaceUrlPutRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1UrlPoolsGetSelectStatsEnum = {
    _1: '1'
} as const;
export type ApiV1UrlPoolsGetSelectStatsEnum = typeof ApiV1UrlPoolsGetSelectStatsEnum[keyof typeof ApiV1UrlPoolsGetSelectStatsEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsGetStateEnum = {
    Live: 'live',
    Deleted: 'deleted'
} as const;
export type ApiV1UrlPoolsGetStateEnum = typeof ApiV1UrlPoolsGetStateEnum[keyof typeof ApiV1UrlPoolsGetStateEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsGetSortByEnum = {
    Id: 'id',
    Title: 'title',
    SortType: 'sort_type'
} as const;
export type ApiV1UrlPoolsGetSortByEnum = typeof ApiV1UrlPoolsGetSortByEnum[keyof typeof ApiV1UrlPoolsGetSortByEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1UrlPoolsGetSortDirEnum = typeof ApiV1UrlPoolsGetSortDirEnum[keyof typeof ApiV1UrlPoolsGetSortDirEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsIdUrlsGetFilterIsactiveEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1UrlPoolsIdUrlsGetFilterIsactiveEnum = typeof ApiV1UrlPoolsIdUrlsGetFilterIsactiveEnum[keyof typeof ApiV1UrlPoolsIdUrlsGetFilterIsactiveEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsIdUrlsGetSortByEnum = {
    Id: 'id',
    Url: 'url',
    Title: 'title',
    Weight: 'weight',
    Isactive: 'isactive'
} as const;
export type ApiV1UrlPoolsIdUrlsGetSortByEnum = typeof ApiV1UrlPoolsIdUrlsGetSortByEnum[keyof typeof ApiV1UrlPoolsIdUrlsGetSortByEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsIdUrlsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1UrlPoolsIdUrlsGetSortDirEnum = typeof ApiV1UrlPoolsIdUrlsGetSortDirEnum[keyof typeof ApiV1UrlPoolsIdUrlsGetSortDirEnum];
/**
 * @export
 */
export const ApiV1UrlPoolsIdUrlsGetSelectStatsEnum = {
    _1: '1'
} as const;
export type ApiV1UrlPoolsIdUrlsGetSelectStatsEnum = typeof ApiV1UrlPoolsIdUrlsGetSelectStatsEnum[keyof typeof ApiV1UrlPoolsIdUrlsGetSelectStatsEnum];
