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
  ApiV1CreativePoolsGet200Response,
  ApiV1CreativePoolsGetPerPageParameter,
  ApiV1CreativePoolsIdAddCreativesPostRequest,
  ApiV1CreativePoolsIdAddUrlsPostRequest,
  ApiV1CreativePoolsIdClonePost201Response,
  ApiV1CreativePoolsIdDelete200Response,
  ApiV1CreativePoolsIdDelete409Response,
  ApiV1CreativePoolsIdGet200Response,
  ApiV1CreativePoolsIdItemsItemIdPut409Response,
  ApiV1CreativePoolsIdItemsItemIdPutRequest,
  ApiV1CreativePoolsIdItemsMassActionPutRequest,
  ApiV1CreativePoolsIdItemsPostRequest,
  ApiV1CreativePoolsIdItemsRecoverPostRequest,
  ApiV1CreativePoolsIdPutRequest,
  ApiV1CreativePoolsIdUsedInGet200Response,
  ApiV1CreativePoolsPostRequest,
  ApiV1CreativesBulkDeletePostRequest,
  ApiV1CreativesBulkUndeletePostRequest,
  ApiV1CreativesGet200Response,
} from '../models/index';
import {
    ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseToJSON,
    ApiV1CreativePoolsGet200ResponseFromJSON,
    ApiV1CreativePoolsGet200ResponseToJSON,
    ApiV1CreativePoolsGetPerPageParameterFromJSON,
    ApiV1CreativePoolsGetPerPageParameterToJSON,
    ApiV1CreativePoolsIdAddCreativesPostRequestFromJSON,
    ApiV1CreativePoolsIdAddCreativesPostRequestToJSON,
    ApiV1CreativePoolsIdAddUrlsPostRequestFromJSON,
    ApiV1CreativePoolsIdAddUrlsPostRequestToJSON,
    ApiV1CreativePoolsIdClonePost201ResponseFromJSON,
    ApiV1CreativePoolsIdClonePost201ResponseToJSON,
    ApiV1CreativePoolsIdDelete200ResponseFromJSON,
    ApiV1CreativePoolsIdDelete200ResponseToJSON,
    ApiV1CreativePoolsIdDelete409ResponseFromJSON,
    ApiV1CreativePoolsIdDelete409ResponseToJSON,
    ApiV1CreativePoolsIdGet200ResponseFromJSON,
    ApiV1CreativePoolsIdGet200ResponseToJSON,
    ApiV1CreativePoolsIdItemsItemIdPut409ResponseFromJSON,
    ApiV1CreativePoolsIdItemsItemIdPut409ResponseToJSON,
    ApiV1CreativePoolsIdItemsItemIdPutRequestFromJSON,
    ApiV1CreativePoolsIdItemsItemIdPutRequestToJSON,
    ApiV1CreativePoolsIdItemsMassActionPutRequestFromJSON,
    ApiV1CreativePoolsIdItemsMassActionPutRequestToJSON,
    ApiV1CreativePoolsIdItemsPostRequestFromJSON,
    ApiV1CreativePoolsIdItemsPostRequestToJSON,
    ApiV1CreativePoolsIdItemsRecoverPostRequestFromJSON,
    ApiV1CreativePoolsIdItemsRecoverPostRequestToJSON,
    ApiV1CreativePoolsIdPutRequestFromJSON,
    ApiV1CreativePoolsIdPutRequestToJSON,
    ApiV1CreativePoolsIdUsedInGet200ResponseFromJSON,
    ApiV1CreativePoolsIdUsedInGet200ResponseToJSON,
    ApiV1CreativePoolsPostRequestFromJSON,
    ApiV1CreativePoolsPostRequestToJSON,
    ApiV1CreativesBulkDeletePostRequestFromJSON,
    ApiV1CreativesBulkDeletePostRequestToJSON,
    ApiV1CreativesBulkUndeletePostRequestFromJSON,
    ApiV1CreativesBulkUndeletePostRequestToJSON,
    ApiV1CreativesGet200ResponseFromJSON,
    ApiV1CreativesGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1CreativePoolsGetRequest {
    filterType?: ApiV1CreativePoolsGetFilterTypeEnum;
    filterTypes?: string;
    filterTitle?: string;
    filterId?: number;
    filterName?: string;
    filterOrientation?: ApiV1CreativePoolsGetFilterOrientationEnum;
    state?: ApiV1CreativePoolsGetStateEnum;
    search?: string;
    fitOrientation?: ApiV1CreativePoolsGetFitOrientationEnum;
    selectStats?: ApiV1CreativePoolsGetSelectStatsEnum;
    from?: Date;
    to?: Date;
    page?: number;
    perPage?: ApiV1CreativePoolsGetPerPageParameter;
    sortBy?: ApiV1CreativePoolsGetSortByEnum;
    sortDir?: ApiV1CreativePoolsGetSortDirEnum;
}

export interface ApiV1CreativePoolsIdAddCreativesPostOperationRequest {
    id: number;
    apiV1CreativePoolsIdAddCreativesPostRequest: ApiV1CreativePoolsIdAddCreativesPostRequest;
}

export interface ApiV1CreativePoolsIdAddUrlsPostOperationRequest {
    id: number;
    apiV1CreativePoolsIdAddUrlsPostRequest: ApiV1CreativePoolsIdAddUrlsPostRequest;
}

export interface ApiV1CreativePoolsIdClonePostRequest {
    id: number;
}

export interface ApiV1CreativePoolsIdDeleteRequest {
    id: number;
}

export interface ApiV1CreativePoolsIdGetRequest {
    id: number;
}

export interface ApiV1CreativePoolsIdItemsExportGetRequest {
    id: number;
    ids: string;
}

export interface ApiV1CreativePoolsIdItemsGetRequest {
    id: number;
    includeSizes?: ApiV1CreativePoolsIdItemsGetIncludeSizesEnum;
    selectStats?: ApiV1CreativePoolsIdItemsGetSelectStatsEnum;
    from?: Date;
    to?: Date;
    page?: number;
    perPage?: number;
    filterBansizeid?: number;
    filterIsactive?: ApiV1CreativePoolsIdItemsGetFilterIsactiveEnum;
    sortBy?: ApiV1CreativePoolsIdItemsGetSortByEnum;
    sortDir?: ApiV1CreativePoolsIdItemsGetSortDirEnum;
}

export interface ApiV1CreativePoolsIdItemsItemIdDeleteRequest {
    id: number;
    itemId: number;
}

export interface ApiV1CreativePoolsIdItemsItemIdPutOperationRequest {
    id: number;
    itemId: number;
    apiV1CreativePoolsIdItemsItemIdPutRequest: ApiV1CreativePoolsIdItemsItemIdPutRequest;
}

export interface ApiV1CreativePoolsIdItemsItemIdTogglePutRequest {
    id: number;
    itemId: number;
}

export interface ApiV1CreativePoolsIdItemsMassActionPutOperationRequest {
    id: number;
    apiV1CreativePoolsIdItemsMassActionPutRequest: ApiV1CreativePoolsIdItemsMassActionPutRequest;
}

export interface ApiV1CreativePoolsIdItemsPostOperationRequest {
    id: number;
    apiV1CreativePoolsIdItemsPostRequest: ApiV1CreativePoolsIdItemsPostRequest;
}

export interface ApiV1CreativePoolsIdItemsRecoverPostOperationRequest {
    id: number;
    apiV1CreativePoolsIdItemsRecoverPostRequest: ApiV1CreativePoolsIdItemsRecoverPostRequest;
}

export interface ApiV1CreativePoolsIdPutOperationRequest {
    id: number;
    apiV1CreativePoolsIdPutRequest: ApiV1CreativePoolsIdPutRequest;
}

export interface ApiV1CreativePoolsIdRecoverPostRequest {
    id: number;
}

export interface ApiV1CreativePoolsIdUsedInGetRequest {
    id: number;
}

export interface ApiV1CreativePoolsPostOperationRequest {
    apiV1CreativePoolsPostRequest: ApiV1CreativePoolsPostRequest;
}

export interface ApiV1CreativesBulkDeletePostOperationRequest {
    apiV1CreativesBulkDeletePostRequest: ApiV1CreativesBulkDeletePostRequest;
}

export interface ApiV1CreativesBulkUndeletePostOperationRequest {
    apiV1CreativesBulkUndeletePostRequest: ApiV1CreativesBulkUndeletePostRequest;
}

export interface ApiV1CreativesIdUndeletePutRequest {
    id: number;
}

/**
 * 
 */
export class CreativePoolsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1CreativePoolsGet without sending the request
     */
    async apiV1CreativePoolsGetRequestOpts(requestParameters: ApiV1CreativePoolsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['filterType'] != null) {
            queryParameters['filter_type'] = requestParameters['filterType'];
        }

        if (requestParameters['filterTypes'] != null) {
            queryParameters['filter_types'] = requestParameters['filterTypes'];
        }

        if (requestParameters['filterTitle'] != null) {
            queryParameters['filter_title'] = requestParameters['filterTitle'];
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterName'] != null) {
            queryParameters['filter_name'] = requestParameters['filterName'];
        }

        if (requestParameters['filterOrientation'] != null) {
            queryParameters['filter_orientation'] = requestParameters['filterOrientation'];
        }

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['fitOrientation'] != null) {
            queryParameters['fit_orientation'] = requestParameters['fitOrientation'];
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

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/creative-pools`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns every creative pool owned by the caller. Each row carries `items_count` (live items, `is_deleted=0`) and `total_sizes` (count of distinct banner sizes). Tags are returned both as the raw CSV string (`tags`) and as an array (`tagids`).  Filters use the `filter_` prefix (`filter_type`, `filter_title`, `filter_id`, `filter_orientation`); `search` matches the title. Sort with `sort_by` / `sort_dir`. 
     * List creative pools.
     */
    async apiV1CreativePoolsGetRaw(requestParameters: ApiV1CreativePoolsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativePoolsGet200Response>> {
        const requestOptions = await this.apiV1CreativePoolsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativePoolsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every creative pool owned by the caller. Each row carries `items_count` (live items, `is_deleted=0`) and `total_sizes` (count of distinct banner sizes). Tags are returned both as the raw CSV string (`tags`) and as an array (`tagids`).  Filters use the `filter_` prefix (`filter_type`, `filter_title`, `filter_id`, `filter_orientation`); `search` matches the title. Sort with `sort_by` / `sort_dir`. 
     * List creative pools.
     */
    async apiV1CreativePoolsGet(requestParameters: ApiV1CreativePoolsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativePoolsGet200Response> {
        const response = await this.apiV1CreativePoolsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsIdAddCreativesPost without sending the request
     */
    async apiV1CreativePoolsIdAddCreativesPostRequestOpts(requestParameters: ApiV1CreativePoolsIdAddCreativesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdAddCreativesPost().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdAddCreativesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdAddCreativesPostRequest',
                'Required parameter "apiV1CreativePoolsIdAddCreativesPostRequest" was null or undefined when calling apiV1CreativePoolsIdAddCreativesPost().'
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

        let urlPath = `/api/v1/creative-pools/{id}/add-creatives`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdAddCreativesPostRequestToJSON(requestParameters['apiV1CreativePoolsIdAddCreativesPostRequest']),
        };
    }

    /**
     * Adds existing creatives (from `GET /api/v1/creatives` or `POST /api/v1/creatives/upload`) to the pool by id — the panel\'s \"Add from library\". Only creatives of the pool\'s own type are added; ids that are not yours, not that type, or already in the pool are skipped silently (`total` counts what was added). New items need moderation unless the account auto-validates. A key pinned to `creative_ids` may only add creatives on its pin (403 otherwise). 
     * Add media-bank creatives to a pool.
     */
    async apiV1CreativePoolsIdAddCreativesPostRaw(requestParameters: ApiV1CreativePoolsIdAddCreativesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdAddCreativesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Adds existing creatives (from `GET /api/v1/creatives` or `POST /api/v1/creatives/upload`) to the pool by id — the panel\'s \"Add from library\". Only creatives of the pool\'s own type are added; ids that are not yours, not that type, or already in the pool are skipped silently (`total` counts what was added). New items need moderation unless the account auto-validates. A key pinned to `creative_ids` may only add creatives on its pin (403 otherwise). 
     * Add media-bank creatives to a pool.
     */
    async apiV1CreativePoolsIdAddCreativesPost(requestParameters: ApiV1CreativePoolsIdAddCreativesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdAddCreativesPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdAddUrlsPost without sending the request
     */
    async apiV1CreativePoolsIdAddUrlsPostRequestOpts(requestParameters: ApiV1CreativePoolsIdAddUrlsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdAddUrlsPost().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdAddUrlsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdAddUrlsPostRequest',
                'Required parameter "apiV1CreativePoolsIdAddUrlsPostRequest" was null or undefined when calling apiV1CreativePoolsIdAddUrlsPost().'
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

        let urlPath = `/api/v1/creative-pools/{id}/add-urls`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdAddUrlsPostRequestToJSON(requestParameters['apiV1CreativePoolsIdAddUrlsPostRequest']),
        };
    }

    /**
     * Bulk import of hotlinked creatives — the panel\'s \"Add URLs\". One URL per line in `urls`; each becomes a media-bank creative plus a pool item. The protocol is normalised to https. The file extension decides the kind: jpg/jpeg/png/bmp/webp image, gif animated image, mp4 video; anything else (or an image into a video pool) is reported back in `err_data`. `type: html_url` hotlinks the URL as an iframe banner instead. Creator pools refuse URLs (422). Keys pinned to `creative_ids` cannot use this (it creates creatives). 
     * Add hotlinked image / video / HTML URLs to a pool.
     */
    async apiV1CreativePoolsIdAddUrlsPostRaw(requestParameters: ApiV1CreativePoolsIdAddUrlsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdAddUrlsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Bulk import of hotlinked creatives — the panel\'s \"Add URLs\". One URL per line in `urls`; each becomes a media-bank creative plus a pool item. The protocol is normalised to https. The file extension decides the kind: jpg/jpeg/png/bmp/webp image, gif animated image, mp4 video; anything else (or an image into a video pool) is reported back in `err_data`. `type: html_url` hotlinks the URL as an iframe banner instead. Creator pools refuse URLs (422). Keys pinned to `creative_ids` cannot use this (it creates creatives). 
     * Add hotlinked image / video / HTML URLs to a pool.
     */
    async apiV1CreativePoolsIdAddUrlsPost(requestParameters: ApiV1CreativePoolsIdAddUrlsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdAddUrlsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdClonePost without sending the request
     */
    async apiV1CreativePoolsIdClonePostRequestOpts(requestParameters: ApiV1CreativePoolsIdClonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdClonePost().'
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

        let urlPath = `/api/v1/creative-pools/{id}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Duplicates the pool row and every live item (`is_deleted=0`). Cloned items share the same underlying `creative_id`, so the binary creative file is not re-uploaded — both pools reference the same row in the `creatives` table. The new pool\'s title is suffixed with \" (Copy)\". 
     * Clone a creative pool with all its items.
     */
    async apiV1CreativePoolsIdClonePostRaw(requestParameters: ApiV1CreativePoolsIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativePoolsIdClonePost201Response>> {
        const requestOptions = await this.apiV1CreativePoolsIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativePoolsIdClonePost201ResponseFromJSON(jsonValue));
    }

    /**
     * Duplicates the pool row and every live item (`is_deleted=0`). Cloned items share the same underlying `creative_id`, so the binary creative file is not re-uploaded — both pools reference the same row in the `creatives` table. The new pool\'s title is suffixed with \" (Copy)\". 
     * Clone a creative pool with all its items.
     */
    async apiV1CreativePoolsIdClonePost(requestParameters: ApiV1CreativePoolsIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativePoolsIdClonePost201Response> {
        const response = await this.apiV1CreativePoolsIdClonePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsIdDelete without sending the request
     */
    async apiV1CreativePoolsIdDeleteRequestOpts(requestParameters: ApiV1CreativePoolsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdDelete().'
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

        let urlPath = `/api/v1/creative-pools/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deletes the pool **and** its items. Inactive items always go; an active item is kept only when it is the last active item of its banner size / rating that campaign ads still use. If any item had to be kept the call returns 409 (`total_items`, `deleted`) and the pool itself stays — the deletable items ARE already gone. Note the 200 body spells the count `totalitems`, the 409 body `total_items`. 
     * Soft-delete a creative pool.
     */
    async apiV1CreativePoolsIdDeleteRaw(requestParameters: ApiV1CreativePoolsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativePoolsIdDelete200Response>> {
        const requestOptions = await this.apiV1CreativePoolsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativePoolsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Deletes the pool **and** its items. Inactive items always go; an active item is kept only when it is the last active item of its banner size / rating that campaign ads still use. If any item had to be kept the call returns 409 (`total_items`, `deleted`) and the pool itself stays — the deletable items ARE already gone. Note the 200 body spells the count `totalitems`, the 409 body `total_items`. 
     * Soft-delete a creative pool.
     */
    async apiV1CreativePoolsIdDelete(requestParameters: ApiV1CreativePoolsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativePoolsIdDelete200Response> {
        const response = await this.apiV1CreativePoolsIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsIdGet without sending the request
     */
    async apiV1CreativePoolsIdGetRequestOpts(requestParameters: ApiV1CreativePoolsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdGet().'
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

        let urlPath = `/api/v1/creative-pools/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Show a single creative pool.
     */
    async apiV1CreativePoolsIdGetRaw(requestParameters: ApiV1CreativePoolsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativePoolsIdGet200Response>> {
        const requestOptions = await this.apiV1CreativePoolsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativePoolsIdGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Show a single creative pool.
     */
    async apiV1CreativePoolsIdGet(requestParameters: ApiV1CreativePoolsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativePoolsIdGet200Response> {
        const response = await this.apiV1CreativePoolsIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsExportGet without sending the request
     */
    async apiV1CreativePoolsIdItemsExportGetRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsExportGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsExportGet().'
            );
        }

        if (requestParameters['ids'] == null) {
            throw new runtime.RequiredError(
                'ids',
                'Required parameter "ids" was null or undefined when calling apiV1CreativePoolsIdItemsExportGet().'
            );
        }

        const queryParameters: any = {};

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

        let urlPath = `/api/v1/creative-pools/{id}/items/export`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns `application/zip` (`Content-Disposition: attachment; filename=\"pool-{id}-export.zip\"`) with one file per item plus a `_manifest.txt` listing which items were exported, skipped (no exportable source) or failed. Hotlinked items are fetched server-side (public addresses only). Max 500 items. 
     * Download pool items\' creative files as a ZIP.
     */
    async apiV1CreativePoolsIdItemsExportGetRaw(requestParameters: ApiV1CreativePoolsIdItemsExportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsExportGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Returns `application/zip` (`Content-Disposition: attachment; filename=\"pool-{id}-export.zip\"`) with one file per item plus a `_manifest.txt` listing which items were exported, skipped (no exportable source) or failed. Hotlinked items are fetched server-side (public addresses only). Max 500 items. 
     * Download pool items\' creative files as a ZIP.
     */
    async apiV1CreativePoolsIdItemsExportGet(requestParameters: ApiV1CreativePoolsIdItemsExportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.apiV1CreativePoolsIdItemsExportGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsGet without sending the request
     */
    async apiV1CreativePoolsIdItemsGetRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['includeSizes'] != null) {
            queryParameters['include_sizes'] = requestParameters['includeSizes'];
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

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['filterBansizeid'] != null) {
            queryParameters['filter_bansizeid'] = requestParameters['filterBansizeid'];
        }

        if (requestParameters['filterIsactive'] != null) {
            queryParameters['filter_isactive'] = requestParameters['filterIsactive'];
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

        let urlPath = `/api/v1/creative-pools/{id}/items`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns every banner / video / native item in the pool with size, creative metadata and lifetime stats (views, clicks, ctr, conv), plus its schedule: `start_at` / `end_at` (unix seconds, 0 = no limit) and `is_fallback` (0/1) — see the item update endpoint. 
     * List items in a creative pool.
     */
    async apiV1CreativePoolsIdItemsGetRaw(requestParameters: ApiV1CreativePoolsIdItemsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativesGet200Response>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every banner / video / native item in the pool with size, creative metadata and lifetime stats (views, clicks, ctr, conv), plus its schedule: `start_at` / `end_at` (unix seconds, 0 = no limit) and `is_fallback` (0/1) — see the item update endpoint. 
     * List items in a creative pool.
     */
    async apiV1CreativePoolsIdItemsGet(requestParameters: ApiV1CreativePoolsIdItemsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativesGet200Response> {
        const response = await this.apiV1CreativePoolsIdItemsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsItemIdDelete without sending the request
     */
    async apiV1CreativePoolsIdItemsItemIdDeleteRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsItemIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdDelete().'
            );
        }

        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdDelete().'
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

        let urlPath = `/api/v1/creative-pools/{id}/items/{itemId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"itemId"}}`, encodeURIComponent(String(requestParameters['itemId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Refuses if the item is still referenced by a live ad — unhook the ad first. 
     * Soft-delete a single pool item.
     */
    async apiV1CreativePoolsIdItemsItemIdDeleteRaw(requestParameters: ApiV1CreativePoolsIdItemsItemIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsItemIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Refuses if the item is still referenced by a live ad — unhook the ad first. 
     * Soft-delete a single pool item.
     */
    async apiV1CreativePoolsIdItemsItemIdDelete(requestParameters: ApiV1CreativePoolsIdItemsItemIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdItemsItemIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsItemIdPut without sending the request
     */
    async apiV1CreativePoolsIdItemsItemIdPutRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsItemIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdPut().'
            );
        }

        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdPut().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdItemsItemIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdItemsItemIdPutRequest',
                'Required parameter "apiV1CreativePoolsIdItemsItemIdPutRequest" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdPut().'
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

        let urlPath = `/api/v1/creative-pools/{id}/items/{itemId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"itemId"}}`, encodeURIComponent(String(requestParameters['itemId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdItemsItemIdPutRequestToJSON(requestParameters['apiV1CreativePoolsIdItemsItemIdPutRequest']),
        };
    }

    /**
     * Editable fields: `title`, `lang`, `properties`, `ratingid`, `url_prefix`, `weight` (whole number 0–1000000; drives `sort_type: wr` rotation — 400 `invalid_weight` otherwise), `is_fallback`, `start_at`, `end_at`. Active state is toggled via the `/toggle` endpoint below.  **Scheduling.** `start_at` / `end_at` make the item serve only inside `[start_at, end_at)`. Send unix seconds or an RFC 3339 time with its offset (`2026-10-20T09:00:00-04:00` = 9:00 AM New York); `null`, `0` or `\"\"` clears that side. The list endpoint returns both as unix seconds (0 = no limit). The ad servers pick up an edit within 5 minutes and then switch on the exact second, so save a schedule a few minutes ahead of its start.  **Fallback.** `is_fallback: true` makes the item serve only while no other item of the same pool and size is live. Typical promo swap: mark the regular creative as fallback and give the promo a `start_at` (and `end_at`); the regular one steps aside while the promo runs and returns when it ends.  A change that would leave a size still used by campaign ads with nothing to serve at some moment is refused with 409 `SCHEDULE_LEAVES_POOL_EMPTY`; `gap_at` is the first uncovered unix second. Pausing or deleting an item runs the same check over the other items\' schedules. 
     * Update a single pool item.
     */
    async apiV1CreativePoolsIdItemsItemIdPutRaw(requestParameters: ApiV1CreativePoolsIdItemsItemIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsItemIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Editable fields: `title`, `lang`, `properties`, `ratingid`, `url_prefix`, `weight` (whole number 0–1000000; drives `sort_type: wr` rotation — 400 `invalid_weight` otherwise), `is_fallback`, `start_at`, `end_at`. Active state is toggled via the `/toggle` endpoint below.  **Scheduling.** `start_at` / `end_at` make the item serve only inside `[start_at, end_at)`. Send unix seconds or an RFC 3339 time with its offset (`2026-10-20T09:00:00-04:00` = 9:00 AM New York); `null`, `0` or `\"\"` clears that side. The list endpoint returns both as unix seconds (0 = no limit). The ad servers pick up an edit within 5 minutes and then switch on the exact second, so save a schedule a few minutes ahead of its start.  **Fallback.** `is_fallback: true` makes the item serve only while no other item of the same pool and size is live. Typical promo swap: mark the regular creative as fallback and give the promo a `start_at` (and `end_at`); the regular one steps aside while the promo runs and returns when it ends.  A change that would leave a size still used by campaign ads with nothing to serve at some moment is refused with 409 `SCHEDULE_LEAVES_POOL_EMPTY`; `gap_at` is the first uncovered unix second. Pausing or deleting an item runs the same check over the other items\' schedules. 
     * Update a single pool item.
     */
    async apiV1CreativePoolsIdItemsItemIdPut(requestParameters: ApiV1CreativePoolsIdItemsItemIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdItemsItemIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsItemIdTogglePut without sending the request
     */
    async apiV1CreativePoolsIdItemsItemIdTogglePutRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsItemIdTogglePutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdTogglePut().'
            );
        }

        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling apiV1CreativePoolsIdItemsItemIdTogglePut().'
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

        let urlPath = `/api/v1/creative-pools/{id}/items/{itemId}/toggle`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"itemId"}}`, encodeURIComponent(String(requestParameters['itemId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Flips `isactive` between 0 and 1. Inactive items are skipped by the ad-server when picking a creative from the pool. Pausing the last active item of a format that campaign ads still use is refused (409). 
     * Toggle a pool item on / off.
     */
    async apiV1CreativePoolsIdItemsItemIdTogglePutRaw(requestParameters: ApiV1CreativePoolsIdItemsItemIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsItemIdTogglePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Flips `isactive` between 0 and 1. Inactive items are skipped by the ad-server when picking a creative from the pool. Pausing the last active item of a format that campaign ads still use is refused (409). 
     * Toggle a pool item on / off.
     */
    async apiV1CreativePoolsIdItemsItemIdTogglePut(requestParameters: ApiV1CreativePoolsIdItemsItemIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdItemsItemIdTogglePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsMassActionPut without sending the request
     */
    async apiV1CreativePoolsIdItemsMassActionPutRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsMassActionPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsMassActionPut().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdItemsMassActionPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdItemsMassActionPutRequest',
                'Required parameter "apiV1CreativePoolsIdItemsMassActionPutRequest" was null or undefined when calling apiV1CreativePoolsIdItemsMassActionPut().'
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

        let urlPath = `/api/v1/creative-pools/{id}/items/mass-action`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdItemsMassActionPutRequestToJSON(requestParameters['apiV1CreativePoolsIdItemsMassActionPutRequest']),
        };
    }

    /**
     * `action`:  - `activate` / `deactivate` — set `isactive`. - `delete` — soft-delete the items. - `url_prefix` — set each item\'s `url_prefix` to `url_prefix`. - `language` — set each item\'s `lang` to `lang`.  Deactivate and delete refuse (409, nothing written) when an item is the last active one of its size / rating still used by a campaign ad — `blocked_ids` lists them, the same rule as the single-item toggle / delete. Same handler as the panel. 
     * Bulk-change items of a creative pool.
     */
    async apiV1CreativePoolsIdItemsMassActionPutRaw(requestParameters: ApiV1CreativePoolsIdItemsMassActionPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsMassActionPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `action`:  - `activate` / `deactivate` — set `isactive`. - `delete` — soft-delete the items. - `url_prefix` — set each item\'s `url_prefix` to `url_prefix`. - `language` — set each item\'s `lang` to `lang`.  Deactivate and delete refuse (409, nothing written) when an item is the last active one of its size / rating still used by a campaign ad — `blocked_ids` lists them, the same rule as the single-item toggle / delete. Same handler as the panel. 
     * Bulk-change items of a creative pool.
     */
    async apiV1CreativePoolsIdItemsMassActionPut(requestParameters: ApiV1CreativePoolsIdItemsMassActionPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdItemsMassActionPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsPost without sending the request
     */
    async apiV1CreativePoolsIdItemsPostRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsPost().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdItemsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdItemsPostRequest',
                'Required parameter "apiV1CreativePoolsIdItemsPostRequest" was null or undefined when calling apiV1CreativePoolsIdItemsPost().'
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

        let urlPath = `/api/v1/creative-pools/{id}/items`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdItemsPostRequestToJSON(requestParameters['apiV1CreativePoolsIdItemsPostRequest']),
        };
    }

    /**
     * Adds one creative to the pool. Reference an uploaded creative by `creative_id` (from `POST /api/v1/creatives/upload`; must be yours, and on the key\'s creative pin if it has one) or supply a hotlink `banner_url`. The pool\'s `type` decides the creative slot (banner / video / image). To add many library creatives at once use `POST …/{id}/add-creatives`. 
     * Add an item to a creative pool.
     */
    async apiV1CreativePoolsIdItemsPostRaw(requestParameters: ApiV1CreativePoolsIdItemsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Adds one creative to the pool. Reference an uploaded creative by `creative_id` (from `POST /api/v1/creatives/upload`; must be yours, and on the key\'s creative pin if it has one) or supply a hotlink `banner_url`. The pool\'s `type` decides the creative slot (banner / video / image). To add many library creatives at once use `POST …/{id}/add-creatives`. 
     * Add an item to a creative pool.
     */
    async apiV1CreativePoolsIdItemsPost(requestParameters: ApiV1CreativePoolsIdItemsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdItemsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdItemsRecoverPost without sending the request
     */
    async apiV1CreativePoolsIdItemsRecoverPostRequestOpts(requestParameters: ApiV1CreativePoolsIdItemsRecoverPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdItemsRecoverPost().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdItemsRecoverPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdItemsRecoverPostRequest',
                'Required parameter "apiV1CreativePoolsIdItemsRecoverPostRequest" was null or undefined when calling apiV1CreativePoolsIdItemsRecoverPost().'
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

        let urlPath = `/api/v1/creative-pools/{id}/items/recover`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdItemsRecoverPostRequestToJSON(requestParameters['apiV1CreativePoolsIdItemsRecoverPostRequest']),
        };
    }

    /**
     * The undo of DELETE /creative-pools/{id}/items/{itemId} (removing an item also switches it off). `active_ids` are switched back on. 
     * Put removed items back into a creative pool.
     */
    async apiV1CreativePoolsIdItemsRecoverPostRaw(requestParameters: ApiV1CreativePoolsIdItemsRecoverPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdItemsRecoverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The undo of DELETE /creative-pools/{id}/items/{itemId} (removing an item also switches it off). `active_ids` are switched back on. 
     * Put removed items back into a creative pool.
     */
    async apiV1CreativePoolsIdItemsRecoverPost(requestParameters: ApiV1CreativePoolsIdItemsRecoverPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdItemsRecoverPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdPut without sending the request
     */
    async apiV1CreativePoolsIdPutRequestOpts(requestParameters: ApiV1CreativePoolsIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdPut().'
            );
        }

        if (requestParameters['apiV1CreativePoolsIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsIdPutRequest',
                'Required parameter "apiV1CreativePoolsIdPutRequest" was null or undefined when calling apiV1CreativePoolsIdPut().'
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

        let urlPath = `/api/v1/creative-pools/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsIdPutRequestToJSON(requestParameters['apiV1CreativePoolsIdPutRequest']),
        };
    }

    /**
     * Updates any of `title` (alias `name`), `sort_type`, `conv_type`, `tags`, `type`, `orientation`. `sort_type: wr` (weighted rotation on item `weight`) needs the tenant\'s weighted-rotation option — 400 `weighted_rotation_disabled` otherwise. 
     * Update creative pool meta.
     */
    async apiV1CreativePoolsIdPutRaw(requestParameters: ApiV1CreativePoolsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Updates any of `title` (alias `name`), `sort_type`, `conv_type`, `tags`, `type`, `orientation`. `sort_type: wr` (weighted rotation on item `weight`) needs the tenant\'s weighted-rotation option — 400 `weighted_rotation_disabled` otherwise. 
     * Update creative pool meta.
     */
    async apiV1CreativePoolsIdPut(requestParameters: ApiV1CreativePoolsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdRecoverPost without sending the request
     */
    async apiV1CreativePoolsIdRecoverPostRequestOpts(requestParameters: ApiV1CreativePoolsIdRecoverPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdRecoverPost().'
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

        let urlPath = `/api/v1/creative-pools/{id}/recover`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Reverses the soft delete of DELETE /creative-pools/{id} (and of Cleanup\'s Archive): the pool is listed and usable again. The items the delete took down come back as they were; for a pool deleted before 2026-10-16 every deleted item comes back paused (`items_paused: true`). 404 when the pool does not exist, is not archived, or was purged. 
     * Restore an archived creative pool.
     */
    async apiV1CreativePoolsIdRecoverPostRaw(requestParameters: ApiV1CreativePoolsIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativePoolsIdRecoverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Reverses the soft delete of DELETE /creative-pools/{id} (and of Cleanup\'s Archive): the pool is listed and usable again. The items the delete took down come back as they were; for a pool deleted before 2026-10-16 every deleted item comes back paused (`items_paused: true`). 404 when the pool does not exist, is not archived, or was purged. 
     * Restore an archived creative pool.
     */
    async apiV1CreativePoolsIdRecoverPost(requestParameters: ApiV1CreativePoolsIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativePoolsIdRecoverPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativePoolsIdUsedInGet without sending the request
     */
    async apiV1CreativePoolsIdUsedInGetRequestOpts(requestParameters: ApiV1CreativePoolsIdUsedInGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativePoolsIdUsedInGet().'
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

        let urlPath = `/api/v1/creative-pools/{id}/used-in`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * List campaigns / ads that reference this pool.
     */
    async apiV1CreativePoolsIdUsedInGetRaw(requestParameters: ApiV1CreativePoolsIdUsedInGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativePoolsIdUsedInGet200Response>> {
        const requestOptions = await this.apiV1CreativePoolsIdUsedInGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativePoolsIdUsedInGet200ResponseFromJSON(jsonValue));
    }

    /**
     * List campaigns / ads that reference this pool.
     */
    async apiV1CreativePoolsIdUsedInGet(requestParameters: ApiV1CreativePoolsIdUsedInGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativePoolsIdUsedInGet200Response> {
        const response = await this.apiV1CreativePoolsIdUsedInGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativePoolsPost without sending the request
     */
    async apiV1CreativePoolsPostRequestOpts(requestParameters: ApiV1CreativePoolsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CreativePoolsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativePoolsPostRequest',
                'Required parameter "apiV1CreativePoolsPostRequest" was null or undefined when calling apiV1CreativePoolsPost().'
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

        let urlPath = `/api/v1/creative-pools`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativePoolsPostRequestToJSON(requestParameters['apiV1CreativePoolsPostRequest']),
        };
    }

    /**
     * Creates an empty pool. Fill it with `POST …/{id}/add-creatives` (media-bank ids), `POST …/{id}/add-urls` (hotlinks) or `POST …/{id}/items` (one creative). Title collisions are auto-suffixed with `_<unix>`. An unknown `type` is a 400 `invalid_type` (it used to fall back to banner). 
     * Create a creative pool.
     */
    async apiV1CreativePoolsPostRaw(requestParameters: ApiV1CreativePoolsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response>> {
        const requestOptions = await this.apiV1CreativePoolsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates an empty pool. Fill it with `POST …/{id}/add-creatives` (media-bank ids), `POST …/{id}/add-urls` (hotlinks) or `POST …/{id}/items` (one creative). Title collisions are auto-suffixed with `_<unix>`. An unknown `type` is a 400 `invalid_type` (it used to fall back to banner). 
     * Create a creative pool.
     */
    async apiV1CreativePoolsPost(requestParameters: ApiV1CreativePoolsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response> {
        const response = await this.apiV1CreativePoolsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativesBulkDeletePost without sending the request
     */
    async apiV1CreativesBulkDeletePostRequestOpts(requestParameters: ApiV1CreativesBulkDeletePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CreativesBulkDeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativesBulkDeletePostRequest',
                'Required parameter "apiV1CreativesBulkDeletePostRequest" was null or undefined when calling apiV1CreativesBulkDeletePost().'
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

        let urlPath = `/api/v1/creatives/bulk-delete`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativesBulkDeletePostRequestToJSON(requestParameters['apiV1CreativesBulkDeletePostRequest']),
        };
    }

    /**
     * Sets `isdeleted = 1` on up to 500 of your creatives. Ads and pool items already pointing at them keep working; deleted creatives just leave the library. Restore with `POST /creatives/bulk-undelete` or `PUT /creatives/{id}/undelete`. A key pinned to `creative_ids` may only name pinned ids (403 `forbidden_resource`). Account members with own-scoped creative rights only affect creatives they manage. Same handler as the panel. 
     * Soft-delete many media-bank creatives.
     */
    async apiV1CreativesBulkDeletePostRaw(requestParameters: ApiV1CreativesBulkDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesBulkDeletePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets `isdeleted = 1` on up to 500 of your creatives. Ads and pool items already pointing at them keep working; deleted creatives just leave the library. Restore with `POST /creatives/bulk-undelete` or `PUT /creatives/{id}/undelete`. A key pinned to `creative_ids` may only name pinned ids (403 `forbidden_resource`). Account members with own-scoped creative rights only affect creatives they manage. Same handler as the panel. 
     * Soft-delete many media-bank creatives.
     */
    async apiV1CreativesBulkDeletePost(requestParameters: ApiV1CreativesBulkDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesBulkDeletePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesBulkUndeletePost without sending the request
     */
    async apiV1CreativesBulkUndeletePostRequestOpts(requestParameters: ApiV1CreativesBulkUndeletePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CreativesBulkUndeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativesBulkUndeletePostRequest',
                'Required parameter "apiV1CreativesBulkUndeletePostRequest" was null or undefined when calling apiV1CreativesBulkUndeletePost().'
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

        let urlPath = `/api/v1/creatives/bulk-undelete`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativesBulkUndeletePostRequestToJSON(requestParameters['apiV1CreativesBulkUndeletePostRequest']),
        };
    }

    /**
     * Inverse of `POST /creatives/bulk-delete` — same limits, pin and member rules.
     * Restore many deleted creatives.
     */
    async apiV1CreativesBulkUndeletePostRaw(requestParameters: ApiV1CreativesBulkUndeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesBulkUndeletePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Inverse of `POST /creatives/bulk-delete` — same limits, pin and member rules.
     * Restore many deleted creatives.
     */
    async apiV1CreativesBulkUndeletePost(requestParameters: ApiV1CreativesBulkUndeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesBulkUndeletePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesIdUndeletePut without sending the request
     */
    async apiV1CreativesIdUndeletePutRequestOpts(requestParameters: ApiV1CreativesIdUndeletePutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdUndeletePut().'
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

        let urlPath = `/api/v1/creatives/{id}/undelete`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Undoes `DELETE /creatives/{id}`. Same handler as the panel. No body.
     * Restore one deleted creative.
     */
    async apiV1CreativesIdUndeletePutRaw(requestParameters: ApiV1CreativesIdUndeletePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdUndeletePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Undoes `DELETE /creatives/{id}`. Same handler as the panel. No body.
     * Restore one deleted creative.
     */
    async apiV1CreativesIdUndeletePut(requestParameters: ApiV1CreativesIdUndeletePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdUndeletePutRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1CreativePoolsGetFilterTypeEnum = {
    Banner: 'banner',
    Video: 'video',
    Reel: 'reel',
    Native: 'native',
    Image: 'image',
    Creator: 'creator'
} as const;
export type ApiV1CreativePoolsGetFilterTypeEnum = typeof ApiV1CreativePoolsGetFilterTypeEnum[keyof typeof ApiV1CreativePoolsGetFilterTypeEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsGetFilterOrientationEnum = {
    Landscape: 'landscape',
    Portrait: 'portrait',
    Square: 'square'
} as const;
export type ApiV1CreativePoolsGetFilterOrientationEnum = typeof ApiV1CreativePoolsGetFilterOrientationEnum[keyof typeof ApiV1CreativePoolsGetFilterOrientationEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsGetStateEnum = {
    Live: 'live',
    Deleted: 'deleted'
} as const;
export type ApiV1CreativePoolsGetStateEnum = typeof ApiV1CreativePoolsGetStateEnum[keyof typeof ApiV1CreativePoolsGetStateEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsGetFitOrientationEnum = {
    Landscape: 'landscape',
    Portrait: 'portrait',
    Square: 'square'
} as const;
export type ApiV1CreativePoolsGetFitOrientationEnum = typeof ApiV1CreativePoolsGetFitOrientationEnum[keyof typeof ApiV1CreativePoolsGetFitOrientationEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsGetSelectStatsEnum = {
    _1: '1'
} as const;
export type ApiV1CreativePoolsGetSelectStatsEnum = typeof ApiV1CreativePoolsGetSelectStatsEnum[keyof typeof ApiV1CreativePoolsGetSelectStatsEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsGetSortByEnum = {
    Id: 'id',
    Title: 'title',
    Type: 'type',
    SortType: 'sort_type'
} as const;
export type ApiV1CreativePoolsGetSortByEnum = typeof ApiV1CreativePoolsGetSortByEnum[keyof typeof ApiV1CreativePoolsGetSortByEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1CreativePoolsGetSortDirEnum = typeof ApiV1CreativePoolsGetSortDirEnum[keyof typeof ApiV1CreativePoolsGetSortDirEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsIdItemsGetIncludeSizesEnum = {
    _1: '1'
} as const;
export type ApiV1CreativePoolsIdItemsGetIncludeSizesEnum = typeof ApiV1CreativePoolsIdItemsGetIncludeSizesEnum[keyof typeof ApiV1CreativePoolsIdItemsGetIncludeSizesEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsIdItemsGetSelectStatsEnum = {
    _1: '1'
} as const;
export type ApiV1CreativePoolsIdItemsGetSelectStatsEnum = typeof ApiV1CreativePoolsIdItemsGetSelectStatsEnum[keyof typeof ApiV1CreativePoolsIdItemsGetSelectStatsEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsIdItemsGetFilterIsactiveEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1CreativePoolsIdItemsGetFilterIsactiveEnum = typeof ApiV1CreativePoolsIdItemsGetFilterIsactiveEnum[keyof typeof ApiV1CreativePoolsIdItemsGetFilterIsactiveEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsIdItemsGetSortByEnum = {
    Id: 'id',
    Title: 'title',
    Bansizeid: 'bansizeid',
    Isactive: 'isactive',
    Ctr: 'ctr',
    Weight: 'weight'
} as const;
export type ApiV1CreativePoolsIdItemsGetSortByEnum = typeof ApiV1CreativePoolsIdItemsGetSortByEnum[keyof typeof ApiV1CreativePoolsIdItemsGetSortByEnum];
/**
 * @export
 */
export const ApiV1CreativePoolsIdItemsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1CreativePoolsIdItemsGetSortDirEnum = typeof ApiV1CreativePoolsIdItemsGetSortDirEnum[keyof typeof ApiV1CreativePoolsIdItemsGetSortDirEnum];
