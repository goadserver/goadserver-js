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
  Adspace,
  AdspaceCreate,
  AdspaceSchema,
  ApiV1AdspacesAddMultiplePostRequest,
  ApiV1AdspacesExportCodesGet200ResponseInner,
  ApiV1AdspacesGet200Response,
  ApiV1AdspacesIdClonePostRequest,
  ApiV1AdspacesIdCodeGet200Response,
  ApiV1AdspacesIdNetworkBindingPutRequest,
  ApiV1AdspacesIdOwnAdsMassActionPostRequest,
  ApiV1AdspacesIdPatch200Response,
  ApiV1AdspacesIdPricesTypePostRequest,
  ApiV1AdspacesIdWlCampaignsPutRequest,
  ApiV1AdspacesMassDeletePostRequest,
  ApiV1AdspacesMassRecoverPostRequest,
  ApiV1AdspacesTemplatesGet200ResponseInner,
  ApiV1AdspacesTemplatesIdPutRequest,
  ApiV1AdspacesTemplatesPostRequest,
  OwnAdWrite,
} from '../models/index';
import {
    AdspaceFromJSON,
    AdspaceToJSON,
    AdspaceCreateFromJSON,
    AdspaceCreateToJSON,
    AdspaceSchemaFromJSON,
    AdspaceSchemaToJSON,
    ApiV1AdspacesAddMultiplePostRequestFromJSON,
    ApiV1AdspacesAddMultiplePostRequestToJSON,
    ApiV1AdspacesExportCodesGet200ResponseInnerFromJSON,
    ApiV1AdspacesExportCodesGet200ResponseInnerToJSON,
    ApiV1AdspacesGet200ResponseFromJSON,
    ApiV1AdspacesGet200ResponseToJSON,
    ApiV1AdspacesIdClonePostRequestFromJSON,
    ApiV1AdspacesIdClonePostRequestToJSON,
    ApiV1AdspacesIdCodeGet200ResponseFromJSON,
    ApiV1AdspacesIdCodeGet200ResponseToJSON,
    ApiV1AdspacesIdNetworkBindingPutRequestFromJSON,
    ApiV1AdspacesIdNetworkBindingPutRequestToJSON,
    ApiV1AdspacesIdOwnAdsMassActionPostRequestFromJSON,
    ApiV1AdspacesIdOwnAdsMassActionPostRequestToJSON,
    ApiV1AdspacesIdPatch200ResponseFromJSON,
    ApiV1AdspacesIdPatch200ResponseToJSON,
    ApiV1AdspacesIdPricesTypePostRequestFromJSON,
    ApiV1AdspacesIdPricesTypePostRequestToJSON,
    ApiV1AdspacesIdWlCampaignsPutRequestFromJSON,
    ApiV1AdspacesIdWlCampaignsPutRequestToJSON,
    ApiV1AdspacesMassDeletePostRequestFromJSON,
    ApiV1AdspacesMassDeletePostRequestToJSON,
    ApiV1AdspacesMassRecoverPostRequestFromJSON,
    ApiV1AdspacesMassRecoverPostRequestToJSON,
    ApiV1AdspacesTemplatesGet200ResponseInnerFromJSON,
    ApiV1AdspacesTemplatesGet200ResponseInnerToJSON,
    ApiV1AdspacesTemplatesIdPutRequestFromJSON,
    ApiV1AdspacesTemplatesIdPutRequestToJSON,
    ApiV1AdspacesTemplatesPostRequestFromJSON,
    ApiV1AdspacesTemplatesPostRequestToJSON,
    OwnAdWriteFromJSON,
    OwnAdWriteToJSON,
} from '../models/index';

export interface ApiV1AdspacesAddMultiplePostOperationRequest {
    apiV1AdspacesAddMultiplePostRequest: ApiV1AdspacesAddMultiplePostRequest;
}

export interface ApiV1AdspacesExportCodesGetRequest {
    siteid?: number;
    all?: ApiV1AdspacesExportCodesGetAllEnum;
    sids?: string;
}

export interface ApiV1AdspacesGetRequest {
    siteId?: number;
    state?: ApiV1AdspacesGetStateEnum;
    type?: string;
    parentId?: number;
    search?: string;
    sort?: ApiV1AdspacesGetSortEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1AdspacesIdBlockedAdvertisersGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdChildrenGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdClonePostOperationRequest {
    id: number;
    apiV1AdspacesIdClonePostRequest: ApiV1AdspacesIdClonePostRequest;
}

export interface ApiV1AdspacesIdCodeGetRequest {
    id: number;
    layout?: ApiV1AdspacesIdCodeGetLayoutEnum;
}

export interface ApiV1AdspacesIdDeleteRequest {
    id: number;
    confirmSmartZones?: ApiV1AdspacesIdDeleteConfirmSmartZonesEnum;
}

export interface ApiV1AdspacesIdGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdNetworkBindingDeleteRequest {
    id: number;
}

export interface ApiV1AdspacesIdNetworkBindingPutOperationRequest {
    id: number;
    apiV1AdspacesIdNetworkBindingPutRequest: ApiV1AdspacesIdNetworkBindingPutRequest;
}

export interface ApiV1AdspacesIdOwnAdsAdIdDeleteRequest {
    id: number;
    adId: number;
}

export interface ApiV1AdspacesIdOwnAdsAdIdGetRequest {
    id: number;
    adId: number;
}

export interface ApiV1AdspacesIdOwnAdsAdIdPutRequest {
    id: number;
    adId: number;
    ownAdWrite: OwnAdWrite;
}

export interface ApiV1AdspacesIdOwnAdsAdIdTogglePutRequest {
    id: number;
    adId: number;
}

export interface ApiV1AdspacesIdOwnAdsGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdOwnAdsMassActionPostOperationRequest {
    id: number;
    apiV1AdspacesIdOwnAdsMassActionPostRequest: ApiV1AdspacesIdOwnAdsMassActionPostRequest;
}

export interface ApiV1AdspacesIdOwnAdsPostRequest {
    id: number;
    ownAdWrite: OwnAdWrite;
}

export interface ApiV1AdspacesIdPatchRequest {
    id: number;
    requestBody: { [key: string]: any; };
}

export interface ApiV1AdspacesIdPricesTypeGetRequest {
    id: number;
    type: ApiV1AdspacesIdPricesTypeGetTypeEnum;
    deviceTypeid?: number;
}

export interface ApiV1AdspacesIdPricesTypePostOperationRequest {
    id: number;
    type: ApiV1AdspacesIdPricesTypePostOperationTypeEnum;
    apiV1AdspacesIdPricesTypePostRequest: ApiV1AdspacesIdPricesTypePostRequest;
}

export interface ApiV1AdspacesIdRecoverPostRequest {
    id: number;
}

export interface ApiV1AdspacesIdWlCampaignsGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdWlCampaignsPutOperationRequest {
    id: number;
    apiV1AdspacesIdWlCampaignsPutRequest: ApiV1AdspacesIdWlCampaignsPutRequest;
}

export interface ApiV1AdspacesMassDeletePostOperationRequest {
    apiV1AdspacesMassDeletePostRequest: ApiV1AdspacesMassDeletePostRequest;
}

export interface ApiV1AdspacesMassRecoverPostOperationRequest {
    apiV1AdspacesMassRecoverPostRequest: ApiV1AdspacesMassRecoverPostRequest;
}

export interface ApiV1AdspacesTemplatesIdDeleteRequest {
    id: number;
}

export interface ApiV1AdspacesTemplatesIdPutOperationRequest {
    id: number;
    apiV1AdspacesTemplatesIdPutRequest: ApiV1AdspacesTemplatesIdPutRequest;
}

export interface ApiV1AdspacesTemplatesPostOperationRequest {
    apiV1AdspacesTemplatesPostRequest: ApiV1AdspacesTemplatesPostRequest;
}

export interface ApiV1AdspacesTypePostRequest {
    type: ApiV1AdspacesTypePostTypeEnum;
    adspaceCreate: AdspaceCreate;
}

export interface ApiV1AdspacesTypeSchemaGetRequest {
    type: ApiV1AdspacesTypeSchemaGetTypeEnum;
}

/**
 * 
 */
export class AdspacesApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1AdspacesAddMultiplePost without sending the request
     */
    async apiV1AdspacesAddMultiplePostRequestOpts(requestParameters: ApiV1AdspacesAddMultiplePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdspacesAddMultiplePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesAddMultiplePostRequest',
                'Required parameter "apiV1AdspacesAddMultiplePostRequest" was null or undefined when calling apiV1AdspacesAddMultiplePost().'
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

        let urlPath = `/api/v1/adspaces/add-multiple`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesAddMultiplePostRequestToJSON(requestParameters['apiV1AdspacesAddMultiplePostRequest']),
        };
    }

    /**
     * The panel\'s \"Add multiple\". Each item is created exactly as `POST /api/v1/adspaces/{type}` would create it (same validation, same defaults), with the type\'s default settings block and, for banner types, `sizeid` as the banner size. Up to 100 items.  Items are created in order. The first refusal stops the run: the response is that item\'s error (e.g. 422 `validation_error` for a duplicate name) plus `failed_item` (index into `items`) and `created_ids` (what was created before it). Items with an empty name are skipped.  The type must be active, its module on and its right held; for an API key it must also be exposed to the API (`in_api`) — same gate and errors as `POST /api/v1/adspaces/{type}` (404 `unknown_adspace_type`, 403 `module_disabled` / `missing_right`). Keys pinned to `adzone_ids` / `site_ids` are refused. 
     * Create several ad zones of one type on one site.
     */
    async apiV1AdspacesAddMultiplePostRaw(requestParameters: ApiV1AdspacesAddMultiplePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<number>>> {
        const requestOptions = await this.apiV1AdspacesAddMultiplePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * The panel\'s \"Add multiple\". Each item is created exactly as `POST /api/v1/adspaces/{type}` would create it (same validation, same defaults), with the type\'s default settings block and, for banner types, `sizeid` as the banner size. Up to 100 items.  Items are created in order. The first refusal stops the run: the response is that item\'s error (e.g. 422 `validation_error` for a duplicate name) plus `failed_item` (index into `items`) and `created_ids` (what was created before it). Items with an empty name are skipped.  The type must be active, its module on and its right held; for an API key it must also be exposed to the API (`in_api`) — same gate and errors as `POST /api/v1/adspaces/{type}` (404 `unknown_adspace_type`, 403 `module_disabled` / `missing_right`). Keys pinned to `adzone_ids` / `site_ids` are refused. 
     * Create several ad zones of one type on one site.
     */
    async apiV1AdspacesAddMultiplePost(requestParameters: ApiV1AdspacesAddMultiplePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<number>> {
        const response = await this.apiV1AdspacesAddMultiplePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesExportCodesGet without sending the request
     */
    async apiV1AdspacesExportCodesGetRequestOpts(requestParameters: ApiV1AdspacesExportCodesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['siteid'] != null) {
            queryParameters['siteid'] = requestParameters['siteid'];
        }

        if (requestParameters['all'] != null) {
            queryParameters['all'] = requestParameters['all'];
        }

        if (requestParameters['sids'] != null) {
            queryParameters['sids'] = requestParameters['sids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/export-codes`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s bulk \"Export codes\". Returns one entry per site with the site\'s controller tag (`ctrl_js`, paste once per page) and the per-zone snippets. Without `sids` (or with `all=1`) every live zone of the account is included; narrow with `siteid` or a `sids` list. For one zone use `GET /api/v1/adspaces/{id}/code`.  Keys pinned to `adzone_ids` / `site_ids` are refused (`403 forbidden_resource`) — the export spans the whole account. 
     * Embed codes for many ad zones at once, grouped by site.
     */
    async apiV1AdspacesExportCodesGetRaw(requestParameters: ApiV1AdspacesExportCodesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ApiV1AdspacesExportCodesGet200ResponseInner>>> {
        const requestOptions = await this.apiV1AdspacesExportCodesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ApiV1AdspacesExportCodesGet200ResponseInnerFromJSON));
    }

    /**
     * The panel\'s bulk \"Export codes\". Returns one entry per site with the site\'s controller tag (`ctrl_js`, paste once per page) and the per-zone snippets. Without `sids` (or with `all=1`) every live zone of the account is included; narrow with `siteid` or a `sids` list. For one zone use `GET /api/v1/adspaces/{id}/code`.  Keys pinned to `adzone_ids` / `site_ids` are refused (`403 forbidden_resource`) — the export spans the whole account. 
     * Embed codes for many ad zones at once, grouped by site.
     */
    async apiV1AdspacesExportCodesGet(requestParameters: ApiV1AdspacesExportCodesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ApiV1AdspacesExportCodesGet200ResponseInner>> {
        const response = await this.apiV1AdspacesExportCodesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesGet without sending the request
     */
    async apiV1AdspacesGetRequestOpts(requestParameters: ApiV1AdspacesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['siteId'] != null) {
            queryParameters['site_id'] = requestParameters['siteId'];
        }

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state'];
        }

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
        }

        if (requestParameters['parentId'] != null) {
            queryParameters['parent_id'] = requestParameters['parentId'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
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

        let urlPath = `/api/v1/adspaces`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * List ad zones owned by the caller.
     */
    async apiV1AdspacesGetRaw(requestParameters: ApiV1AdspacesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1AdspacesGet200Response>> {
        const requestOptions = await this.apiV1AdspacesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1AdspacesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * List ad zones owned by the caller.
     */
    async apiV1AdspacesGet(requestParameters: ApiV1AdspacesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1AdspacesGet200Response> {
        const response = await this.apiV1AdspacesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesIdBlockedAdvertisersGet without sending the request
     */
    async apiV1AdspacesIdBlockedAdvertisersGetRequestOpts(requestParameters: ApiV1AdspacesIdBlockedAdvertisersGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdBlockedAdvertisersGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/blocked-advertisers`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Read-only. The advertiser-side block lists (not hidden ones) that name this zone. `campaignids` is the comma-separated campaigns the filter applies to. 
     * Advertiser block filters that exclude this ad zone.
     */
    async apiV1AdspacesIdBlockedAdvertisersGetRaw(requestParameters: ApiV1AdspacesIdBlockedAdvertisersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdBlockedAdvertisersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Read-only. The advertiser-side block lists (not hidden ones) that name this zone. `campaignids` is the comma-separated campaigns the filter applies to. 
     * Advertiser block filters that exclude this ad zone.
     */
    async apiV1AdspacesIdBlockedAdvertisersGet(requestParameters: ApiV1AdspacesIdBlockedAdvertisersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdBlockedAdvertisersGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdChildrenGet without sending the request
     */
    async apiV1AdspacesIdChildrenGetRequestOpts(requestParameters: ApiV1AdspacesIdChildrenGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdChildrenGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/children`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Live zones whose `parentid` is this zone — the in-video sub-zones under a player zone. Rows are the stored zone records (all `publisher_adzones` columns) plus `website_name`. Same data as `GET /api/v1/adspaces?parent_id={id}` in the list shape. 
     * List an ad zone\'s child zones.
     */
    async apiV1AdspacesIdChildrenGetRaw(requestParameters: ApiV1AdspacesIdChildrenGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdChildrenGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Live zones whose `parentid` is this zone — the in-video sub-zones under a player zone. Rows are the stored zone records (all `publisher_adzones` columns) plus `website_name`. Same data as `GET /api/v1/adspaces?parent_id={id}` in the list shape. 
     * List an ad zone\'s child zones.
     */
    async apiV1AdspacesIdChildrenGet(requestParameters: ApiV1AdspacesIdChildrenGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdChildrenGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdClonePost without sending the request
     */
    async apiV1AdspacesIdClonePostRequestOpts(requestParameters: ApiV1AdspacesIdClonePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdClonePost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdClonePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdClonePostRequest',
                'Required parameter "apiV1AdspacesIdClonePostRequest" was null or undefined when calling apiV1AdspacesIdClonePost().'
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

        let urlPath = `/api/v1/adspaces/{id}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdClonePostRequestToJSON(requestParameters['apiV1AdspacesIdClonePostRequest']),
        };
    }

    /**
     * Copies the zone (type, site, settings) under a new name. Options choose what comes along. `copy_campaigns` copies the whitelisted campaigns only where the account may manage them (see `PUT /api/v1/adspaces/{id}/wl-campaigns`); otherwise the zone is still duplicated and `campaigns_skipped` is true. 
     * Duplicate an ad zone.
     */
    async apiV1AdspacesIdClonePostRaw(requestParameters: ApiV1AdspacesIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Copies the zone (type, site, settings) under a new name. Options choose what comes along. `copy_campaigns` copies the whitelisted campaigns only where the account may manage them (see `PUT /api/v1/adspaces/{id}/wl-campaigns`); otherwise the zone is still duplicated and `campaigns_skipped` is true. 
     * Duplicate an ad zone.
     */
    async apiV1AdspacesIdClonePost(requestParameters: ApiV1AdspacesIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdClonePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdCodeGet without sending the request
     */
    async apiV1AdspacesIdCodeGetRequestOpts(requestParameters: ApiV1AdspacesIdCodeGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdCodeGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['layout'] != null) {
            queryParameters['layout'] = requestParameters['layout'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/code`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the JS embed snippets a publisher pastes into their site — the natural last step of the create flow.  Three pieces, all server-rendered with the tenant\'s ad domain, the publisher\'s user id, EaCtrl name, banner dimensions, and per-type plugin call resolved:  - `site.ctrl_js` — controller `<script>` tag. Paste it once per   page, before the per-zone snippets (typically in `<head>`). - `site.ctrl_js_failover` — an alternative to `ctrl_js`, pasted   instead of it: an inline loader that tries several ad domains in   turn (the zone\'s own, the publisher\'s own, then the network\'s   that are not on a block list) and uses the first one an ad   blocker lets through; it queues the zones\' `add()` calls until   the controller is there. Empty when fewer than two usable ad   domains are available. - `js_code` — per-zone JavaScript call (wrap in `<script>` tags).   This is what goes at each ad slot. - `ad_tag` — `<iframe src=\"…\">` alternative for callers that   can\'t run JS. - `alternative` — no-JS fallback `<a><img></a>` snippet.  Native zones (nativeads, type 3) take `?layout=<key>`: a ready-made design, so a publisher does not have to write the templates. The response then carries the layout\'s `tpl_body` / `tpl_row` / `tpl_item` in `js_code` and a `<style>` block scoped to the zone (`#id_<adspace_id>`) in front of the placement in `ad_tag`. Keys: `default` (the stock template), `cards`, `list` (sidebar list), `tiles` (image tiles), `feed`, `links` (text-only sponsored links); the response of a native zone lists them in `layouts`. The same layouts are the picker in the panel\'s Code tab. Creator widget zones (creator_widget, type 34) take their own keys: `default` (the example template), `caption` (avatar and text under the clip), `overlay` (text on the clip), `card`, `clip` (clip only); the template is `tpl_item` (the plugin has no body/row templates) and the `<style>` block is scoped the same way. An unknown key for the zone\'s type is refused with 422 (`layout`); other zone types ignore the parameter.  Banner, native, reel and creator widget zones (types 2, 3, 31, 34) also carry `amp`: the code for AMP pages and Web Stories, which cannot run the controller. AMP fetches the ad itself through `amp-list` + `amp-mustache` from goadserver\'s `/ampad.go?spaceid=<id>` (JSON, AMP CORS; AMP removed `amp-ad type=\"custom\"` in 2025). The story code is a sponsored `<amp-story-page>` to paste between the story\'s own pages (image ads; a video ad shows its poster). Image and video ads only — HTML / iframe creatives are skipped. Impressions are counted by a 1×1 pixel the template loads when the ad renders.  Resource-pinned keys (`resource_filter.adzone_ids` / `resource_filter.site_ids`) reject reads outside the allow-list with `403 forbidden_resource`. 
     * Embed-code snippets for an adspace.
     */
    async apiV1AdspacesIdCodeGetRaw(requestParameters: ApiV1AdspacesIdCodeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1AdspacesIdCodeGet200Response>> {
        const requestOptions = await this.apiV1AdspacesIdCodeGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1AdspacesIdCodeGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the JS embed snippets a publisher pastes into their site — the natural last step of the create flow.  Three pieces, all server-rendered with the tenant\'s ad domain, the publisher\'s user id, EaCtrl name, banner dimensions, and per-type plugin call resolved:  - `site.ctrl_js` — controller `<script>` tag. Paste it once per   page, before the per-zone snippets (typically in `<head>`). - `site.ctrl_js_failover` — an alternative to `ctrl_js`, pasted   instead of it: an inline loader that tries several ad domains in   turn (the zone\'s own, the publisher\'s own, then the network\'s   that are not on a block list) and uses the first one an ad   blocker lets through; it queues the zones\' `add()` calls until   the controller is there. Empty when fewer than two usable ad   domains are available. - `js_code` — per-zone JavaScript call (wrap in `<script>` tags).   This is what goes at each ad slot. - `ad_tag` — `<iframe src=\"…\">` alternative for callers that   can\'t run JS. - `alternative` — no-JS fallback `<a><img></a>` snippet.  Native zones (nativeads, type 3) take `?layout=<key>`: a ready-made design, so a publisher does not have to write the templates. The response then carries the layout\'s `tpl_body` / `tpl_row` / `tpl_item` in `js_code` and a `<style>` block scoped to the zone (`#id_<adspace_id>`) in front of the placement in `ad_tag`. Keys: `default` (the stock template), `cards`, `list` (sidebar list), `tiles` (image tiles), `feed`, `links` (text-only sponsored links); the response of a native zone lists them in `layouts`. The same layouts are the picker in the panel\'s Code tab. Creator widget zones (creator_widget, type 34) take their own keys: `default` (the example template), `caption` (avatar and text under the clip), `overlay` (text on the clip), `card`, `clip` (clip only); the template is `tpl_item` (the plugin has no body/row templates) and the `<style>` block is scoped the same way. An unknown key for the zone\'s type is refused with 422 (`layout`); other zone types ignore the parameter.  Banner, native, reel and creator widget zones (types 2, 3, 31, 34) also carry `amp`: the code for AMP pages and Web Stories, which cannot run the controller. AMP fetches the ad itself through `amp-list` + `amp-mustache` from goadserver\'s `/ampad.go?spaceid=<id>` (JSON, AMP CORS; AMP removed `amp-ad type=\"custom\"` in 2025). The story code is a sponsored `<amp-story-page>` to paste between the story\'s own pages (image ads; a video ad shows its poster). Image and video ads only — HTML / iframe creatives are skipped. Impressions are counted by a 1×1 pixel the template loads when the ad renders.  Resource-pinned keys (`resource_filter.adzone_ids` / `resource_filter.site_ids`) reject reads outside the allow-list with `403 forbidden_resource`. 
     * Embed-code snippets for an adspace.
     */
    async apiV1AdspacesIdCodeGet(requestParameters: ApiV1AdspacesIdCodeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1AdspacesIdCodeGet200Response> {
        const response = await this.apiV1AdspacesIdCodeGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesIdDelete without sending the request
     */
    async apiV1AdspacesIdDeleteRequestOpts(requestParameters: ApiV1AdspacesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdDelete().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['confirmSmartZones'] != null) {
            queryParameters['confirm_smart_zones'] = requestParameters['confirmSmartZones'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sets `is_deleted = 1` — the row is hidden from listings but kept for reporting joins. Undo with `POST /api/v1/adspaces/{id}/recover`.  Refused with **409 `has_flatrate_campaigns`** while a running or pending flat-rate deal is booked on the zone. A zone with smart zones attached answers **409 `has_smart_zones`** (with their count) until you repeat the call with `?confirm_smart_zones=1`; those smart zones are then closed with the zone and come back on recover. 
     * Soft-delete an adspace.
     */
    async apiV1AdspacesIdDeleteRaw(requestParameters: ApiV1AdspacesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets `is_deleted = 1` — the row is hidden from listings but kept for reporting joins. Undo with `POST /api/v1/adspaces/{id}/recover`.  Refused with **409 `has_flatrate_campaigns`** while a running or pending flat-rate deal is booked on the zone. A zone with smart zones attached answers **409 `has_smart_zones`** (with their count) until you repeat the call with `?confirm_smart_zones=1`; those smart zones are then closed with the zone and come back on recover. 
     * Soft-delete an adspace.
     */
    async apiV1AdspacesIdDelete(requestParameters: ApiV1AdspacesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdGet without sending the request
     */
    async apiV1AdspacesIdGetRequestOpts(requestParameters: ApiV1AdspacesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdGet().'
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

        let urlPath = `/api/v1/adspaces/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the full adspace record. Body shape matches what `POST /api/v1/adspaces/{type}` accepts, so a create-then-fetch loop or an update round-trip works without translation:  - Common top-level fields (`name`, `siteid`, `autoapprove`,   `isvisible`, …) — matching the create body - `adspace_type` — the type config key (e.g. `bannerads`) - `adzone_typeid` / `adtype_id` / `adsizeid` — numeric ids - The type-specific settings block hoisted to top level   (e.g. `banner_settings`, `pop_settings`, `native_settings`) - `json_settings` — the raw assembled blob for inspection - The Campaigns-tab switches (`only_wl_campaigns`,   `only_tagged_campaigns`, `force_wl_targeting`,   `skip_rtb_when_wl`), `useflatbuys`, `parentid`, `new_zoneid`,   and the Source tab\'s `network_binding`  Keys pinned to `adzone_ids`, or to `site_ids` (checked against the zone\'s site), get `403 forbidden_resource` for other zones. 
     * Get a single adspace.
     */
    async apiV1AdspacesIdGetRaw(requestParameters: ApiV1AdspacesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Adspace>> {
        const requestOptions = await this.apiV1AdspacesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AdspaceFromJSON(jsonValue));
    }

    /**
     * Returns the full adspace record. Body shape matches what `POST /api/v1/adspaces/{type}` accepts, so a create-then-fetch loop or an update round-trip works without translation:  - Common top-level fields (`name`, `siteid`, `autoapprove`,   `isvisible`, …) — matching the create body - `adspace_type` — the type config key (e.g. `bannerads`) - `adzone_typeid` / `adtype_id` / `adsizeid` — numeric ids - The type-specific settings block hoisted to top level   (e.g. `banner_settings`, `pop_settings`, `native_settings`) - `json_settings` — the raw assembled blob for inspection - The Campaigns-tab switches (`only_wl_campaigns`,   `only_tagged_campaigns`, `force_wl_targeting`,   `skip_rtb_when_wl`), `useflatbuys`, `parentid`, `new_zoneid`,   and the Source tab\'s `network_binding`  Keys pinned to `adzone_ids`, or to `site_ids` (checked against the zone\'s site), get `403 forbidden_resource` for other zones. 
     * Get a single adspace.
     */
    async apiV1AdspacesIdGet(requestParameters: ApiV1AdspacesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Adspace> {
        const response = await this.apiV1AdspacesIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesIdNetworkBindingDelete without sending the request
     */
    async apiV1AdspacesIdNetworkBindingDeleteRequestOpts(requestParameters: ApiV1AdspacesIdNetworkBindingDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdNetworkBindingDelete().'
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

        let urlPath = `/api/v1/adspaces/{id}/network-binding`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Remove the zone\'s network binding.
     */
    async apiV1AdspacesIdNetworkBindingDeleteRaw(requestParameters: ApiV1AdspacesIdNetworkBindingDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdNetworkBindingDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove the zone\'s network binding.
     */
    async apiV1AdspacesIdNetworkBindingDelete(requestParameters: ApiV1AdspacesIdNetworkBindingDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdNetworkBindingDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdNetworkBindingPut without sending the request
     */
    async apiV1AdspacesIdNetworkBindingPutRequestOpts(requestParameters: ApiV1AdspacesIdNetworkBindingPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdNetworkBindingPut().'
            );
        }

        if (requestParameters['apiV1AdspacesIdNetworkBindingPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdNetworkBindingPutRequest',
                'Required parameter "apiV1AdspacesIdNetworkBindingPutRequest" was null or undefined when calling apiV1AdspacesIdNetworkBindingPut().'
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

        let urlPath = `/api/v1/adspaces/{id}/network-binding`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdNetworkBindingPutRequestToJSON(requestParameters['apiV1AdspacesIdNetworkBindingPutRequest']),
        };
    }

    /**
     * Records that this zone\'s traffic is bought from a campaign on one of your ad networks (`GET /api/v1/tracker/ad-networks`). The network\'s cost import then attributes cost to the zone and, with `auto_api`, the campaign is paused/activated through the network\'s API. The current binding is `network_binding` on `GET /api/v1/adspaces/{id}`. 
     * Bind the zone to a campaign on an external ad network (the Source tab).
     */
    async apiV1AdspacesIdNetworkBindingPutRaw(requestParameters: ApiV1AdspacesIdNetworkBindingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdNetworkBindingPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Records that this zone\'s traffic is bought from a campaign on one of your ad networks (`GET /api/v1/tracker/ad-networks`). The network\'s cost import then attributes cost to the zone and, with `auto_api`, the campaign is paused/activated through the network\'s API. The current binding is `network_binding` on `GET /api/v1/adspaces/{id}`. 
     * Bind the zone to a campaign on an external ad network (the Source tab).
     */
    async apiV1AdspacesIdNetworkBindingPut(requestParameters: ApiV1AdspacesIdNetworkBindingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdNetworkBindingPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsAdIdDelete without sending the request
     */
    async apiV1AdspacesIdOwnAdsAdIdDeleteRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsAdIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdDelete().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdDelete().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads/{adId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete an own ad.
     */
    async apiV1AdspacesIdOwnAdsAdIdDeleteRaw(requestParameters: ApiV1AdspacesIdOwnAdsAdIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsAdIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an own ad.
     */
    async apiV1AdspacesIdOwnAdsAdIdDelete(requestParameters: ApiV1AdspacesIdOwnAdsAdIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsAdIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsAdIdGet without sending the request
     */
    async apiV1AdspacesIdOwnAdsAdIdGetRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsAdIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdGet().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads/{adId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get one own ad.
     */
    async apiV1AdspacesIdOwnAdsAdIdGetRaw(requestParameters: ApiV1AdspacesIdOwnAdsAdIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsAdIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get one own ad.
     */
    async apiV1AdspacesIdOwnAdsAdIdGet(requestParameters: ApiV1AdspacesIdOwnAdsAdIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsAdIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsAdIdPut without sending the request
     */
    async apiV1AdspacesIdOwnAdsAdIdPutRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsAdIdPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdPut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdPut().'
            );
        }

        if (requestParameters['ownAdWrite'] == null) {
            throw new runtime.RequiredError(
                'ownAdWrite',
                'Required parameter "ownAdWrite" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdPut().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads/{adId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: OwnAdWriteToJSON(requestParameters['ownAdWrite']),
        };
    }

    /**
     * Same fields as create; send the ones to change.
     * Update an own ad.
     */
    async apiV1AdspacesIdOwnAdsAdIdPutRaw(requestParameters: ApiV1AdspacesIdOwnAdsAdIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsAdIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Same fields as create; send the ones to change.
     * Update an own ad.
     */
    async apiV1AdspacesIdOwnAdsAdIdPut(requestParameters: ApiV1AdspacesIdOwnAdsAdIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsAdIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsAdIdTogglePut without sending the request
     */
    async apiV1AdspacesIdOwnAdsAdIdTogglePutRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsAdIdTogglePutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdTogglePut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1AdspacesIdOwnAdsAdIdTogglePut().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads/{adId}/toggle`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Flips `isactive`. No body.
     * Switch an own ad on/off.
     */
    async apiV1AdspacesIdOwnAdsAdIdTogglePutRaw(requestParameters: ApiV1AdspacesIdOwnAdsAdIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsAdIdTogglePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Flips `isactive`. No body.
     * Switch an own ad on/off.
     */
    async apiV1AdspacesIdOwnAdsAdIdTogglePut(requestParameters: ApiV1AdspacesIdOwnAdsAdIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsAdIdTogglePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsGet without sending the request
     */
    async apiV1AdspacesIdOwnAdsGetRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Ads the publisher runs on the zone itself (the panel\'s Own ads tab), served when `useownbanners` is on. Rows are the stored records. 
     * List the zone\'s own (house / fallback) ads.
     */
    async apiV1AdspacesIdOwnAdsGetRaw(requestParameters: ApiV1AdspacesIdOwnAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Ads the publisher runs on the zone itself (the panel\'s Own ads tab), served when `useownbanners` is on. Rows are the stored records. 
     * List the zone\'s own (house / fallback) ads.
     */
    async apiV1AdspacesIdOwnAdsGet(requestParameters: ApiV1AdspacesIdOwnAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsMassActionPost without sending the request
     */
    async apiV1AdspacesIdOwnAdsMassActionPostRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsMassActionPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsMassActionPost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdOwnAdsMassActionPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdOwnAdsMassActionPostRequest',
                'Required parameter "apiV1AdspacesIdOwnAdsMassActionPostRequest" was null or undefined when calling apiV1AdspacesIdOwnAdsMassActionPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads/mass-action`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdOwnAdsMassActionPostRequestToJSON(requestParameters['apiV1AdspacesIdOwnAdsMassActionPostRequest']),
        };
    }

    /**
     * Activate, deactivate or delete several own ads.
     */
    async apiV1AdspacesIdOwnAdsMassActionPostRaw(requestParameters: ApiV1AdspacesIdOwnAdsMassActionPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsMassActionPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Activate, deactivate or delete several own ads.
     */
    async apiV1AdspacesIdOwnAdsMassActionPost(requestParameters: ApiV1AdspacesIdOwnAdsMassActionPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsMassActionPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdOwnAdsPost without sending the request
     */
    async apiV1AdspacesIdOwnAdsPostRequestOpts(requestParameters: ApiV1AdspacesIdOwnAdsPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdOwnAdsPost().'
            );
        }

        if (requestParameters['ownAdWrite'] == null) {
            throw new runtime.RequiredError(
                'ownAdWrite',
                'Required parameter "ownAdWrite" was null or undefined when calling apiV1AdspacesIdOwnAdsPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/own-ads`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: OwnAdWriteToJSON(requestParameters['ownAdWrite']),
        };
    }

    /**
     * JSON body, or `multipart/form-data` with the same fields plus an image file (max 32 MB form). Unknown-field checking applies to JSON bodies only. 
     * Add an own ad.
     */
    async apiV1AdspacesIdOwnAdsPostRaw(requestParameters: ApiV1AdspacesIdOwnAdsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdOwnAdsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * JSON body, or `multipart/form-data` with the same fields plus an image file (max 32 MB form). Unknown-field checking applies to JSON bodies only. 
     * Add an own ad.
     */
    async apiV1AdspacesIdOwnAdsPost(requestParameters: ApiV1AdspacesIdOwnAdsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdOwnAdsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdPatch without sending the request
     */
    async apiV1AdspacesIdPatchRequestOpts(requestParameters: ApiV1AdspacesIdPatchRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdPatch().'
            );
        }

        if (requestParameters['requestBody'] == null) {
            throw new runtime.RequiredError(
                'requestBody',
                'Required parameter "requestBody" was null or undefined when calling apiV1AdspacesIdPatch().'
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

        let urlPath = `/api/v1/adspaces/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['requestBody'],
        };
    }

    /**
     * Update fields on an existing adspace. Send only the keys you want to change — omitted fields keep their current value. The `adzone_typeid` is immutable; once an adspace is created its type cannot be switched.  Use `GET /api/v1/adspaces/{type}/_schema` to enumerate the legal field set for the type. The same body shape that creates an adspace works for update.  **Settings blocks merge.** A `*_settings` block is merged into the stored one: other blocks are kept, and keys of the block you do not send are kept (one level deep — nested objects such as `closepop` or `css` are replaced whole). Send a block as `null` to remove it. So `{\"banner_settings\": {\"sizeid\": 7}}` changes only the size.  `parentid` must be another live zone of yours (0 detaches); `siteid` moves the zone to another of your sites (historical stats stay on the old site; a site-pinned key may only move it within its pin). Whitelisted campaigns are set with `PUT /api/v1/adspaces/{id}/wl-campaigns`, floor prices with `POST /api/v1/adspaces/{id}/prices/{type}`. 
     * Update an existing adspace.
     */
    async apiV1AdspacesIdPatchRaw(requestParameters: ApiV1AdspacesIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1AdspacesIdPatch200Response>> {
        const requestOptions = await this.apiV1AdspacesIdPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1AdspacesIdPatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Update fields on an existing adspace. Send only the keys you want to change — omitted fields keep their current value. The `adzone_typeid` is immutable; once an adspace is created its type cannot be switched.  Use `GET /api/v1/adspaces/{type}/_schema` to enumerate the legal field set for the type. The same body shape that creates an adspace works for update.  **Settings blocks merge.** A `*_settings` block is merged into the stored one: other blocks are kept, and keys of the block you do not send are kept (one level deep — nested objects such as `closepop` or `css` are replaced whole). Send a block as `null` to remove it. So `{\"banner_settings\": {\"sizeid\": 7}}` changes only the size.  `parentid` must be another live zone of yours (0 detaches); `siteid` moves the zone to another of your sites (historical stats stay on the old site; a site-pinned key may only move it within its pin). Whitelisted campaigns are set with `PUT /api/v1/adspaces/{id}/wl-campaigns`, floor prices with `POST /api/v1/adspaces/{id}/prices/{type}`. 
     * Update an existing adspace.
     */
    async apiV1AdspacesIdPatch(requestParameters: ApiV1AdspacesIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1AdspacesIdPatch200Response> {
        const response = await this.apiV1AdspacesIdPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesIdPricesTypeGet without sending the request
     */
    async apiV1AdspacesIdPricesTypeGetRequestOpts(requestParameters: ApiV1AdspacesIdPricesTypeGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdPricesTypeGet().'
            );
        }

        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1AdspacesIdPricesTypeGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['deviceTypeid'] != null) {
            queryParameters['device_typeid'] = requestParameters['deviceTypeid'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/prices/{type}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s Prices tab. `{type}` = `cpm` (CPM buys) or `flatrate` (flat-rate bookings). Prices are **currency units** (the account\'s currency) per 1000 impressions; country `\"0\"` = all countries.  Shapes differ by type, as in the panel: `cpm` returns an array of `{country, cpm}`, `flatrate` an object `{country: price}`. 
     * Minimum (floor) prices per country for one device type.
     */
    async apiV1AdspacesIdPricesTypeGetRaw(requestParameters: ApiV1AdspacesIdPricesTypeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdPricesTypeGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s Prices tab. `{type}` = `cpm` (CPM buys) or `flatrate` (flat-rate bookings). Prices are **currency units** (the account\'s currency) per 1000 impressions; country `\"0\"` = all countries.  Shapes differ by type, as in the panel: `cpm` returns an array of `{country, cpm}`, `flatrate` an object `{country: price}`. 
     * Minimum (floor) prices per country for one device type.
     */
    async apiV1AdspacesIdPricesTypeGet(requestParameters: ApiV1AdspacesIdPricesTypeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdPricesTypeGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdPricesTypePost without sending the request
     */
    async apiV1AdspacesIdPricesTypePostRequestOpts(requestParameters: ApiV1AdspacesIdPricesTypePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdPricesTypePost().'
            );
        }

        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1AdspacesIdPricesTypePost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdPricesTypePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdPricesTypePostRequest',
                'Required parameter "apiV1AdspacesIdPricesTypePostRequest" was null or undefined when calling apiV1AdspacesIdPricesTypePost().'
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

        let urlPath = `/api/v1/adspaces/{id}/prices/{type}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdPricesTypePostRequestToJSON(requestParameters['apiV1AdspacesIdPricesTypePostRequest']),
        };
    }

    /**
     * Replaces every price of this zone + `{type}` + `device_typeid` with `cpm_price` (send `[]` to clear). Prices in **currency units** per 1000 impressions (flat-rate prices are stored in cents internally; the API takes and returns currency units). Country `\"\"` or `\"0\"` = all countries. 
     * Replace the floor prices for one device type.
     */
    async apiV1AdspacesIdPricesTypePostRaw(requestParameters: ApiV1AdspacesIdPricesTypePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdPricesTypePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Replaces every price of this zone + `{type}` + `device_typeid` with `cpm_price` (send `[]` to clear). Prices in **currency units** per 1000 impressions (flat-rate prices are stored in cents internally; the API takes and returns currency units). Country `\"\"` or `\"0\"` = all countries. 
     * Replace the floor prices for one device type.
     */
    async apiV1AdspacesIdPricesTypePost(requestParameters: ApiV1AdspacesIdPricesTypePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdPricesTypePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdRecoverPost without sending the request
     */
    async apiV1AdspacesIdRecoverPostRequestOpts(requestParameters: ApiV1AdspacesIdRecoverPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdRecoverPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/recover`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sets `is_deleted = 0` so the adspace appears in listings again, and restores the smart zones that were closed with it. Returns 404 if the adspace doesn\'t exist or isn\'t currently deleted. Find deleted zones with `GET /api/v1/adspaces?state=deleted`. 
     * Reverse a soft-delete on an adspace.
     */
    async apiV1AdspacesIdRecoverPostRaw(requestParameters: ApiV1AdspacesIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdRecoverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets `is_deleted = 0` so the adspace appears in listings again, and restores the smart zones that were closed with it. Returns 404 if the adspace doesn\'t exist or isn\'t currently deleted. Find deleted zones with `GET /api/v1/adspaces?state=deleted`. 
     * Reverse a soft-delete on an adspace.
     */
    async apiV1AdspacesIdRecoverPost(requestParameters: ApiV1AdspacesIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdRecoverPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdWlCampaignsGet without sending the request
     */
    async apiV1AdspacesIdWlCampaignsGetRequestOpts(requestParameters: ApiV1AdspacesIdWlCampaignsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdWlCampaignsGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/wl-campaigns`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s Campaigns tab. `data` lists the RON campaigns of this zone\'s ad type (`connected` true for the whitelisted ones, with their `weight`); `connected` is the stored whitelist `{campaign_id: weight}`. `force_wl_targeting` and `skip_rtb_when_wl` are on `GET /api/v1/adspaces/{id}`. 
     * Campaigns that can be whitelisted on this zone, and the current whitelist.
     */
    async apiV1AdspacesIdWlCampaignsGetRaw(requestParameters: ApiV1AdspacesIdWlCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdWlCampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s Campaigns tab. `data` lists the RON campaigns of this zone\'s ad type (`connected` true for the whitelisted ones, with their `weight`); `connected` is the stored whitelist `{campaign_id: weight}`. `force_wl_targeting` and `skip_rtb_when_wl` are on `GET /api/v1/adspaces/{id}`. 
     * Campaigns that can be whitelisted on this zone, and the current whitelist.
     */
    async apiV1AdspacesIdWlCampaignsGet(requestParameters: ApiV1AdspacesIdWlCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdWlCampaignsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdWlCampaignsPut without sending the request
     */
    async apiV1AdspacesIdWlCampaignsPutRequestOpts(requestParameters: ApiV1AdspacesIdWlCampaignsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdWlCampaignsPut().'
            );
        }

        if (requestParameters['apiV1AdspacesIdWlCampaignsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdWlCampaignsPutRequest',
                'Required parameter "apiV1AdspacesIdWlCampaignsPutRequest" was null or undefined when calling apiV1AdspacesIdWlCampaignsPut().'
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

        let urlPath = `/api/v1/adspaces/{id}/wl-campaigns`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdWlCampaignsPutRequestToJSON(requestParameters['apiV1AdspacesIdWlCampaignsPutRequest']),
        };
    }

    /**
     * Replaces the whitelist with `campaigns` (send `[]` to clear it) and sets the two related switches. Weights are clamped to 0-100. Campaign ids outside your network are dropped. `force_wl_targeting` is only stored when at least one campaign remains.  Gated like the panel: the tenant\'s `connect_campaigns` module must be on (else **403 `feature_disabled`**), and on a non-Ad-Manager tenant only an administrator may manage it (**403 `forbidden`**). 
     * Replace the zone\'s whitelisted campaigns.
     */
    async apiV1AdspacesIdWlCampaignsPutRaw(requestParameters: ApiV1AdspacesIdWlCampaignsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdWlCampaignsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Replaces the whitelist with `campaigns` (send `[]` to clear it) and sets the two related switches. Weights are clamped to 0-100. Campaign ids outside your network are dropped. `force_wl_targeting` is only stored when at least one campaign remains.  Gated like the panel: the tenant\'s `connect_campaigns` module must be on (else **403 `feature_disabled`**), and on a non-Ad-Manager tenant only an administrator may manage it (**403 `forbidden`**). 
     * Replace the zone\'s whitelisted campaigns.
     */
    async apiV1AdspacesIdWlCampaignsPut(requestParameters: ApiV1AdspacesIdWlCampaignsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdWlCampaignsPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesMassDeletePost without sending the request
     */
    async apiV1AdspacesMassDeletePostRequestOpts(requestParameters: ApiV1AdspacesMassDeletePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdspacesMassDeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesMassDeletePostRequest',
                'Required parameter "apiV1AdspacesMassDeletePostRequest" was null or undefined when calling apiV1AdspacesMassDeletePost().'
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

        let urlPath = `/api/v1/adspaces/mass-delete`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesMassDeletePostRequestToJSON(requestParameters['apiV1AdspacesMassDeletePostRequest']),
        };
    }

    /**
     * Soft-deletes every listed zone you own (`is_deleted = 1`); ids that are not yours or already deleted are ignored.  Refused with **409 `has_flatrate_campaigns`** when any of them carries a running or pending flat-rate deal. Zones with smart zones attached answer **409 `has_smart_zones`** (with the count) until you repeat the call with `confirm_smart_zones: true` — the smart zones are then closed with their zone and come back on recover. Recover with `POST /api/v1/adspaces/mass-recover` (list deleted zones with `GET /api/v1/adspaces?state=deleted`).  Keys pinned to `adzone_ids` / `site_ids` are refused. 
     * Soft-delete several ad zones.
     */
    async apiV1AdspacesMassDeletePostRaw(requestParameters: ApiV1AdspacesMassDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesMassDeletePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft-deletes every listed zone you own (`is_deleted = 1`); ids that are not yours or already deleted are ignored.  Refused with **409 `has_flatrate_campaigns`** when any of them carries a running or pending flat-rate deal. Zones with smart zones attached answer **409 `has_smart_zones`** (with the count) until you repeat the call with `confirm_smart_zones: true` — the smart zones are then closed with their zone and come back on recover. Recover with `POST /api/v1/adspaces/mass-recover` (list deleted zones with `GET /api/v1/adspaces?state=deleted`).  Keys pinned to `adzone_ids` / `site_ids` are refused. 
     * Soft-delete several ad zones.
     */
    async apiV1AdspacesMassDeletePost(requestParameters: ApiV1AdspacesMassDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesMassDeletePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesMassRecoverPost without sending the request
     */
    async apiV1AdspacesMassRecoverPostRequestOpts(requestParameters: ApiV1AdspacesMassRecoverPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdspacesMassRecoverPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesMassRecoverPostRequest',
                'Required parameter "apiV1AdspacesMassRecoverPostRequest" was null or undefined when calling apiV1AdspacesMassRecoverPost().'
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

        let urlPath = `/api/v1/adspaces/mass-recover`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesMassRecoverPostRequestToJSON(requestParameters['apiV1AdspacesMassRecoverPostRequest']),
        };
    }

    /**
     * Reverses `mass-delete` / `DELETE /api/v1/adspaces/{id}` for every listed zone you own; the smart zones closed with them come back too. Keys pinned to `adzone_ids` / `site_ids` are refused. 
     * Recover several soft-deleted ad zones.
     */
    async apiV1AdspacesMassRecoverPostRaw(requestParameters: ApiV1AdspacesMassRecoverPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesMassRecoverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Reverses `mass-delete` / `DELETE /api/v1/adspaces/{id}` for every listed zone you own; the smart zones closed with them come back too. Keys pinned to `adzone_ids` / `site_ids` are refused. 
     * Recover several soft-deleted ad zones.
     */
    async apiV1AdspacesMassRecoverPost(requestParameters: ApiV1AdspacesMassRecoverPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesMassRecoverPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesTemplatesGet without sending the request
     */
    async apiV1AdspacesTemplatesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/templates`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Templates are the panel\'s saved \"Add multiple\" presets: a name plus an opaque `data` object the panel stores and replays. The server does not interpret `data`. 
     * List your saved ad zone templates.
     */
    async apiV1AdspacesTemplatesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ApiV1AdspacesTemplatesGet200ResponseInner>>> {
        const requestOptions = await this.apiV1AdspacesTemplatesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ApiV1AdspacesTemplatesGet200ResponseInnerFromJSON));
    }

    /**
     * Templates are the panel\'s saved \"Add multiple\" presets: a name plus an opaque `data` object the panel stores and replays. The server does not interpret `data`. 
     * List your saved ad zone templates.
     */
    async apiV1AdspacesTemplatesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ApiV1AdspacesTemplatesGet200ResponseInner>> {
        const response = await this.apiV1AdspacesTemplatesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesTemplatesIdDelete without sending the request
     */
    async apiV1AdspacesTemplatesIdDeleteRequestOpts(requestParameters: ApiV1AdspacesTemplatesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesTemplatesIdDelete().'
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

        let urlPath = `/api/v1/adspaces/templates/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a template.
     */
    async apiV1AdspacesTemplatesIdDeleteRaw(requestParameters: ApiV1AdspacesTemplatesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesTemplatesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a template.
     */
    async apiV1AdspacesTemplatesIdDelete(requestParameters: ApiV1AdspacesTemplatesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesTemplatesIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesTemplatesIdPut without sending the request
     */
    async apiV1AdspacesTemplatesIdPutRequestOpts(requestParameters: ApiV1AdspacesTemplatesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesTemplatesIdPut().'
            );
        }

        if (requestParameters['apiV1AdspacesTemplatesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesTemplatesIdPutRequest',
                'Required parameter "apiV1AdspacesTemplatesIdPutRequest" was null or undefined when calling apiV1AdspacesTemplatesIdPut().'
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

        let urlPath = `/api/v1/adspaces/templates/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesTemplatesIdPutRequestToJSON(requestParameters['apiV1AdspacesTemplatesIdPutRequest']),
        };
    }

    /**
     * Replace a template\'s data.
     */
    async apiV1AdspacesTemplatesIdPutRaw(requestParameters: ApiV1AdspacesTemplatesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesTemplatesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Replace a template\'s data.
     */
    async apiV1AdspacesTemplatesIdPut(requestParameters: ApiV1AdspacesTemplatesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesTemplatesIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesTemplatesPost without sending the request
     */
    async apiV1AdspacesTemplatesPostRequestOpts(requestParameters: ApiV1AdspacesTemplatesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdspacesTemplatesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesTemplatesPostRequest',
                'Required parameter "apiV1AdspacesTemplatesPostRequest" was null or undefined when calling apiV1AdspacesTemplatesPost().'
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

        let urlPath = `/api/v1/adspaces/templates`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesTemplatesPostRequestToJSON(requestParameters['apiV1AdspacesTemplatesPostRequest']),
        };
    }

    /**
     * Save an ad zone template.
     */
    async apiV1AdspacesTemplatesPostRaw(requestParameters: ApiV1AdspacesTemplatesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesTemplatesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Save an ad zone template.
     */
    async apiV1AdspacesTemplatesPost(requestParameters: ApiV1AdspacesTemplatesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesTemplatesPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesTypePost without sending the request
     */
    async apiV1AdspacesTypePostRequestOpts(requestParameters: ApiV1AdspacesTypePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1AdspacesTypePost().'
            );
        }

        if (requestParameters['adspaceCreate'] == null) {
            throw new runtime.RequiredError(
                'adspaceCreate',
                'Required parameter "adspaceCreate" was null or undefined when calling apiV1AdspacesTypePost().'
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

        let urlPath = `/api/v1/adspaces/{type}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdspaceCreateToJSON(requestParameters['adspaceCreate']),
        };
    }

    /**
     * Create an adspace of the given `{type}`. Required: `name` + `siteid` (and `adsizeid` or `banner_settings.sizeid` for banner-flavored types). Everything else has a sensible default.  **Type identity comes from the path, not the body.** The server resolves the `{type}` path param to its `adzone_typeid` and `adtype_id` and injects them server-side — you do **not** need to pass `adzone_typeid` or `adtype_id` in the body. Any value sent for those keys is overwritten.  The full per-type field list is at `GET /api/v1/adspaces/{type}/_schema` — pass that schema\'s body shape here. The type-specific settings go under the body key named in `settings_block.name` (e.g. `banner_settings`, `pop_settings`, `native_settings`).  Discovery flow: 1. `GET /api/v1/lookups/adspace-types` — find the `{type}` keys    the tenant exposes and their per-type `options` flags. 2. `GET /api/v1/sites` — pick a `siteid`. 3. `GET /api/v1/lookups/banner-sizes` — pick a banner size when    creating banner-flavored zones. 4. `GET /api/v1/adspaces/{type}/_schema` — enumerate all fields. 5. `POST /api/v1/adspaces/{type}` with the body.  Resource-pinned keys (`resource_filter.site_ids`) reject creates outside the allow-list with `403 forbidden_resource`. 
     * Create a new adspace.
     */
    async apiV1AdspacesTypePostRaw(requestParameters: ApiV1AdspacesTypePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1AdspacesIdPatch200Response>> {
        const requestOptions = await this.apiV1AdspacesTypePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1AdspacesIdPatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Create an adspace of the given `{type}`. Required: `name` + `siteid` (and `adsizeid` or `banner_settings.sizeid` for banner-flavored types). Everything else has a sensible default.  **Type identity comes from the path, not the body.** The server resolves the `{type}` path param to its `adzone_typeid` and `adtype_id` and injects them server-side — you do **not** need to pass `adzone_typeid` or `adtype_id` in the body. Any value sent for those keys is overwritten.  The full per-type field list is at `GET /api/v1/adspaces/{type}/_schema` — pass that schema\'s body shape here. The type-specific settings go under the body key named in `settings_block.name` (e.g. `banner_settings`, `pop_settings`, `native_settings`).  Discovery flow: 1. `GET /api/v1/lookups/adspace-types` — find the `{type}` keys    the tenant exposes and their per-type `options` flags. 2. `GET /api/v1/sites` — pick a `siteid`. 3. `GET /api/v1/lookups/banner-sizes` — pick a banner size when    creating banner-flavored zones. 4. `GET /api/v1/adspaces/{type}/_schema` — enumerate all fields. 5. `POST /api/v1/adspaces/{type}` with the body.  Resource-pinned keys (`resource_filter.site_ids`) reject creates outside the allow-list with `403 forbidden_resource`. 
     * Create a new adspace.
     */
    async apiV1AdspacesTypePost(requestParameters: ApiV1AdspacesTypePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1AdspacesIdPatch200Response> {
        const response = await this.apiV1AdspacesTypePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AdspacesTypeSchemaGet without sending the request
     */
    async apiV1AdspacesTypeSchemaGetRequestOpts(requestParameters: ApiV1AdspacesTypeSchemaGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1AdspacesTypeSchemaGet().'
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

        let urlPath = `/api/v1/adspaces/{type}/_schema`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Discovery endpoint mirroring `GET /api/v1/campaigns/{type}/_schema`. Returns the canonical list of public field names a `POST /api/v1/adspaces/{type}` accepts, with type, required-flag, default value, an example, and a one-line description.  Adspaces are polymorphic — each type carries its own type-specific block (e.g. `banner_settings` for `bannerads`, `pop_settings` for `popads`, `native_settings` for `nativeads`). The `settings_block` field of the response describes that block; send it under the body key `settings_block.name`.  Use `GET /api/v1/lookups/adspace-types` to discover which `{type}` values are exposable on the calling tenant. 
     * Field metadata for create/update of one adspace type.
     */
    async apiV1AdspacesTypeSchemaGetRaw(requestParameters: ApiV1AdspacesTypeSchemaGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AdspaceSchema>> {
        const requestOptions = await this.apiV1AdspacesTypeSchemaGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AdspaceSchemaFromJSON(jsonValue));
    }

    /**
     * Discovery endpoint mirroring `GET /api/v1/campaigns/{type}/_schema`. Returns the canonical list of public field names a `POST /api/v1/adspaces/{type}` accepts, with type, required-flag, default value, an example, and a one-line description.  Adspaces are polymorphic — each type carries its own type-specific block (e.g. `banner_settings` for `bannerads`, `pop_settings` for `popads`, `native_settings` for `nativeads`). The `settings_block` field of the response describes that block; send it under the body key `settings_block.name`.  Use `GET /api/v1/lookups/adspace-types` to discover which `{type}` values are exposable on the calling tenant. 
     * Field metadata for create/update of one adspace type.
     */
    async apiV1AdspacesTypeSchemaGet(requestParameters: ApiV1AdspacesTypeSchemaGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AdspaceSchema> {
        const response = await this.apiV1AdspacesTypeSchemaGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1AdspacesExportCodesGetAllEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1AdspacesExportCodesGetAllEnum = typeof ApiV1AdspacesExportCodesGetAllEnum[keyof typeof ApiV1AdspacesExportCodesGetAllEnum];
/**
 * @export
 */
export const ApiV1AdspacesGetStateEnum = {
    Live: 'live',
    Deleted: 'deleted',
    All: 'all'
} as const;
export type ApiV1AdspacesGetStateEnum = typeof ApiV1AdspacesGetStateEnum[keyof typeof ApiV1AdspacesGetStateEnum];
/**
 * @export
 */
export const ApiV1AdspacesGetSortEnum = {
    Id: 'id',
    Id2: '-id',
    Name: 'name',
    Name2: '-name',
    DateAdded: 'date_added',
    DateAdded2: '-date_added',
    TimeChanged: 'time_changed',
    TimeChanged2: '-time_changed'
} as const;
export type ApiV1AdspacesGetSortEnum = typeof ApiV1AdspacesGetSortEnum[keyof typeof ApiV1AdspacesGetSortEnum];
/**
 * @export
 */
export const ApiV1AdspacesIdCodeGetLayoutEnum = {
    Default: 'default',
    Cards: 'cards',
    List: 'list',
    Tiles: 'tiles',
    Feed: 'feed',
    Links: 'links',
    Caption: 'caption',
    Overlay: 'overlay',
    Card: 'card',
    Clip: 'clip'
} as const;
export type ApiV1AdspacesIdCodeGetLayoutEnum = typeof ApiV1AdspacesIdCodeGetLayoutEnum[keyof typeof ApiV1AdspacesIdCodeGetLayoutEnum];
/**
 * @export
 */
export const ApiV1AdspacesIdDeleteConfirmSmartZonesEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1AdspacesIdDeleteConfirmSmartZonesEnum = typeof ApiV1AdspacesIdDeleteConfirmSmartZonesEnum[keyof typeof ApiV1AdspacesIdDeleteConfirmSmartZonesEnum];
/**
 * @export
 */
export const ApiV1AdspacesIdPricesTypeGetTypeEnum = {
    Cpm: 'cpm',
    Flatrate: 'flatrate'
} as const;
export type ApiV1AdspacesIdPricesTypeGetTypeEnum = typeof ApiV1AdspacesIdPricesTypeGetTypeEnum[keyof typeof ApiV1AdspacesIdPricesTypeGetTypeEnum];
/**
 * @export
 */
export const ApiV1AdspacesIdPricesTypePostOperationTypeEnum = {
    Cpm: 'cpm',
    Flatrate: 'flatrate'
} as const;
export type ApiV1AdspacesIdPricesTypePostOperationTypeEnum = typeof ApiV1AdspacesIdPricesTypePostOperationTypeEnum[keyof typeof ApiV1AdspacesIdPricesTypePostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1AdspacesTypePostTypeEnum = {
    Bannerads: 'bannerads',
    BotAds: 'bot_ads',
    CreatorWidget: 'creator_widget',
    DynIframes: 'dyn_iframes',
    EmailDisplay: 'email_display',
    FiximBanner: 'fixim_banner',
    FooterCodes: 'footer_codes',
    Fullpageads: 'fullpageads',
    Hardlinks1: 'hardlinks1',
    Hardlinks2: 'hardlinks2',
    Hardlinks3: 'hardlinks3',
    Hardlinks4: 'hardlinks4',
    Hardlinks5: 'hardlinks5',
    Impopup: 'impopup',
    InpageVideo: 'inpage_video',
    InterstitialBanner: 'interstitial_banner',
    InterstitialNative: 'interstitial_native',
    InterstitialVideo: 'interstitial_video',
    Interstitialads: 'interstitialads',
    InvideoBanner: 'invideo_banner',
    InvideoPlugin: 'invideo_plugin',
    Mailclicks: 'mailclicks',
    NativeBar: 'native_bar',
    NativeClicks: 'native_clicks',
    NativeWebpush: 'native_webpush',
    Nativeads: 'nativeads',
    Popads: 'popads',
    PushClicks: 'push_clicks',
    Pushads: 'pushads',
    Redirects: 'redirects',
    Reels: 'reels',
    Screens: 'screens',
    SearchAds: 'search_ads',
    Skinads: 'skinads',
    SmartLinks: 'smart_links',
    Tabs: 'tabs',
    Textads: 'textads',
    VideoCarousel: 'video_carousel',
    Videoads: 'videoads',
    Videoslider: 'videoslider',
    WebPush: 'web_push'
} as const;
export type ApiV1AdspacesTypePostTypeEnum = typeof ApiV1AdspacesTypePostTypeEnum[keyof typeof ApiV1AdspacesTypePostTypeEnum];
/**
 * @export
 */
export const ApiV1AdspacesTypeSchemaGetTypeEnum = {
    Bannerads: 'bannerads',
    BotAds: 'bot_ads',
    CreatorWidget: 'creator_widget',
    DynIframes: 'dyn_iframes',
    EmailDisplay: 'email_display',
    FiximBanner: 'fixim_banner',
    FooterCodes: 'footer_codes',
    Fullpageads: 'fullpageads',
    Hardlinks1: 'hardlinks1',
    Hardlinks2: 'hardlinks2',
    Hardlinks3: 'hardlinks3',
    Hardlinks4: 'hardlinks4',
    Hardlinks5: 'hardlinks5',
    Impopup: 'impopup',
    InpageVideo: 'inpage_video',
    InterstitialBanner: 'interstitial_banner',
    InterstitialNative: 'interstitial_native',
    InterstitialVideo: 'interstitial_video',
    Interstitialads: 'interstitialads',
    InvideoBanner: 'invideo_banner',
    InvideoPlugin: 'invideo_plugin',
    Mailclicks: 'mailclicks',
    NativeBar: 'native_bar',
    NativeClicks: 'native_clicks',
    NativeWebpush: 'native_webpush',
    Nativeads: 'nativeads',
    Popads: 'popads',
    PushClicks: 'push_clicks',
    Pushads: 'pushads',
    Redirects: 'redirects',
    Reels: 'reels',
    Screens: 'screens',
    SearchAds: 'search_ads',
    Skinads: 'skinads',
    SmartLinks: 'smart_links',
    Tabs: 'tabs',
    Textads: 'textads',
    VideoCarousel: 'video_carousel',
    Videoads: 'videoads',
    Videoslider: 'videoslider',
    WebPush: 'web_push'
} as const;
export type ApiV1AdspacesTypeSchemaGetTypeEnum = typeof ApiV1AdspacesTypeSchemaGetTypeEnum[keyof typeof ApiV1AdspacesTypeSchemaGetTypeEnum];
