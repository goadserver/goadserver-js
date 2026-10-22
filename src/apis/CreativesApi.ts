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
  ApiV1CreativeFoldersIdPutRequest,
  ApiV1CreativeFoldersPostRequest,
  ApiV1CreativesBulkMovePostRequest,
  ApiV1CreativesGet200Response,
  ApiV1CreativesGetPerPageParameter,
  ApiV1CreativesIdNamePutRequest,
  ApiV1CreativesIdPutRequest,
  ApiV1CreativesIdTagsPutRequest,
} from '../models/index';
import {
    ApiV1CreativeFoldersIdPutRequestFromJSON,
    ApiV1CreativeFoldersIdPutRequestToJSON,
    ApiV1CreativeFoldersPostRequestFromJSON,
    ApiV1CreativeFoldersPostRequestToJSON,
    ApiV1CreativesBulkMovePostRequestFromJSON,
    ApiV1CreativesBulkMovePostRequestToJSON,
    ApiV1CreativesGet200ResponseFromJSON,
    ApiV1CreativesGet200ResponseToJSON,
    ApiV1CreativesGetPerPageParameterFromJSON,
    ApiV1CreativesGetPerPageParameterToJSON,
    ApiV1CreativesIdNamePutRequestFromJSON,
    ApiV1CreativesIdNamePutRequestToJSON,
    ApiV1CreativesIdPutRequestFromJSON,
    ApiV1CreativesIdPutRequestToJSON,
    ApiV1CreativesIdTagsPutRequestFromJSON,
    ApiV1CreativesIdTagsPutRequestToJSON,
} from '../models/index';

export interface ApiV1CreativeFoldersGetRequest {
    withCounts?: ApiV1CreativeFoldersGetWithCountsEnum;
    creativeType?: string;
}

export interface ApiV1CreativeFoldersIdDeleteRequest {
    id: number;
    moveTo?: number;
}

export interface ApiV1CreativeFoldersIdPutOperationRequest {
    id: number;
    apiV1CreativeFoldersIdPutRequest: ApiV1CreativeFoldersIdPutRequest;
}

export interface ApiV1CreativeFoldersPostOperationRequest {
    apiV1CreativeFoldersPostRequest: ApiV1CreativeFoldersPostRequest;
}

export interface ApiV1CreativesBulkMovePostOperationRequest {
    apiV1CreativesBulkMovePostRequest: ApiV1CreativesBulkMovePostRequest;
}

export interface ApiV1CreativesGetRequest {
    creativeType?: string;
    sizeid?: number;
    orientation?: ApiV1CreativesGetOrientationEnum;
    deleted?: ApiV1CreativesGetDeletedEnum;
    all?: ApiV1CreativesGetAllEnum;
    filterName?: string;
    search?: string;
    sortBy?: ApiV1CreativesGetSortByEnum;
    sortDir?: ApiV1CreativesGetSortDirEnum;
    folderId?: number;
    includeSubfolders?: ApiV1CreativesGetIncludeSubfoldersEnum;
    page?: number;
    perPage?: ApiV1CreativesGetPerPageParameter;
    limit?: number;
    offset?: number;
    filterId?: number;
    filterType?: ApiV1CreativesGetFilterTypeEnum;
    filterSizeid?: number;
}

export interface ApiV1CreativesIdDeleteRequest {
    id: number;
}

export interface ApiV1CreativesIdGetRequest {
    id: number;
}

export interface ApiV1CreativesIdNamePutOperationRequest {
    id: number;
    apiV1CreativesIdNamePutRequest: ApiV1CreativesIdNamePutRequest;
}

export interface ApiV1CreativesIdPutOperationRequest {
    id: number;
    apiV1CreativesIdPutRequest: ApiV1CreativesIdPutRequest;
}

export interface ApiV1CreativesIdTagsPutOperationRequest {
    id: number;
    apiV1CreativesIdTagsPutRequest: ApiV1CreativesIdTagsPutRequest;
}

export interface ApiV1CreativesIdUsedInGetRequest {
    id: number;
}

export interface ApiV1CreativesUploadPostRequest {
    files: Array<Blob>;
    type?: ApiV1CreativesUploadPostTypeEnum;
    bannerSize?: number;
    tags?: string;
    folderId?: number;
    folderName?: string;
    uploadZip?: ApiV1CreativesUploadPostUploadZipEnum;
    folderFromZip?: ApiV1CreativesUploadPostFolderFromZipEnum;
    folderFromZipPaths?: ApiV1CreativesUploadPostFolderFromZipPathsEnum;
    zipfile?: Blob;
    icontags?: string;
    properties?: string;
    skiperrors?: ApiV1CreativesUploadPostSkiperrorsEnum;
    useOverlays?: ApiV1CreativesUploadPostUseOverlaysEnum;
    clonePerOverlay?: ApiV1CreativesUploadPostClonePerOverlayEnum;
    overlay?: Array<Blob>;
    overlaysZip?: Array<Blob>;
}

/**
 * 
 */
export class CreativesApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1CreativeFoldersGet without sending the request
     */
    async apiV1CreativeFoldersGetRequestOpts(requestParameters: ApiV1CreativeFoldersGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['withCounts'] != null) {
            queryParameters['with_counts'] = requestParameters['withCounts'];
        }

        if (requestParameters['creativeType'] != null) {
            queryParameters['creative_type'] = requestParameters['creativeType'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/creative-folders`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The account\'s folder tree: `{id, name, pid, level}` rows, `pid` 0 for a root, nested at most 3 tiers deep. Folders are the media bank\'s exclusive axis — one folder per creative — and are separate from the multi-valued groups on `creatives.tags`. 
     * List media-bank folders.
     */
    async apiV1CreativeFoldersGetRaw(requestParameters: ApiV1CreativeFoldersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativeFoldersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The account\'s folder tree: `{id, name, pid, level}` rows, `pid` 0 for a root, nested at most 3 tiers deep. Folders are the media bank\'s exclusive axis — one folder per creative — and are separate from the multi-valued groups on `creatives.tags`. 
     * List media-bank folders.
     */
    async apiV1CreativeFoldersGet(requestParameters: ApiV1CreativeFoldersGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativeFoldersGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativeFoldersIdDelete without sending the request
     */
    async apiV1CreativeFoldersIdDeleteRequestOpts(requestParameters: ApiV1CreativeFoldersIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativeFoldersIdDelete().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['moveTo'] != null) {
            queryParameters['move_to'] = requestParameters['moveTo'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/creative-folders/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Never deletes creatives. The folder\'s creatives become unfiled — or move to `move_to` — and its subfolders are reparented to the deleted folder\'s own parent. 
     * Delete a folder.
     */
    async apiV1CreativeFoldersIdDeleteRaw(requestParameters: ApiV1CreativeFoldersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativeFoldersIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Never deletes creatives. The folder\'s creatives become unfiled — or move to `move_to` — and its subfolders are reparented to the deleted folder\'s own parent. 
     * Delete a folder.
     */
    async apiV1CreativeFoldersIdDelete(requestParameters: ApiV1CreativeFoldersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativeFoldersIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativeFoldersIdPut without sending the request
     */
    async apiV1CreativeFoldersIdPutRequestOpts(requestParameters: ApiV1CreativeFoldersIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativeFoldersIdPut().'
            );
        }

        if (requestParameters['apiV1CreativeFoldersIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativeFoldersIdPutRequest',
                'Required parameter "apiV1CreativeFoldersIdPutRequest" was null or undefined when calling apiV1CreativeFoldersIdPut().'
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

        let urlPath = `/api/v1/creative-folders/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativeFoldersIdPutRequestToJSON(requestParameters['apiV1CreativeFoldersIdPutRequest']),
        };
    }

    /**
     * `name` is required. `pid` is optional — omitting it leaves the folder where it is; sending it reparents the folder and its whole subtree, which is refused if that would exceed the depth cap or form a cycle. 
     * Rename or move a folder.
     */
    async apiV1CreativeFoldersIdPutRaw(requestParameters: ApiV1CreativeFoldersIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativeFoldersIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `name` is required. `pid` is optional — omitting it leaves the folder where it is; sending it reparents the folder and its whole subtree, which is refused if that would exceed the depth cap or form a cycle. 
     * Rename or move a folder.
     */
    async apiV1CreativeFoldersIdPut(requestParameters: ApiV1CreativeFoldersIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativeFoldersIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativeFoldersPost without sending the request
     */
    async apiV1CreativeFoldersPostRequestOpts(requestParameters: ApiV1CreativeFoldersPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CreativeFoldersPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativeFoldersPostRequest',
                'Required parameter "apiV1CreativeFoldersPostRequest" was null or undefined when calling apiV1CreativeFoldersPost().'
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

        let urlPath = `/api/v1/creative-folders`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativeFoldersPostRequestToJSON(requestParameters['apiV1CreativeFoldersPostRequest']),
        };
    }

    /**
     * A folder whose name already exists under the same parent is returned as-is with `existing: true` rather than duplicated, so this is safe to call as create-or-reuse. 
     * Create a folder.
     */
    async apiV1CreativeFoldersPostRaw(requestParameters: ApiV1CreativeFoldersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativeFoldersPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A folder whose name already exists under the same parent is returned as-is with `existing: true` rather than duplicated, so this is safe to call as create-or-reuse. 
     * Create a folder.
     */
    async apiV1CreativeFoldersPost(requestParameters: ApiV1CreativeFoldersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativeFoldersPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesBulkMovePost without sending the request
     */
    async apiV1CreativesBulkMovePostRequestOpts(requestParameters: ApiV1CreativesBulkMovePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CreativesBulkMovePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativesBulkMovePostRequest',
                'Required parameter "apiV1CreativesBulkMovePostRequest" was null or undefined when calling apiV1CreativesBulkMovePost().'
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

        let urlPath = `/api/v1/creatives/bulk-move`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativesBulkMovePostRequestToJSON(requestParameters['apiV1CreativesBulkMovePostRequest']),
        };
    }

    /**
     * Moves creatives into one media-bank folder. A creative sits in exactly one folder, so this is an assignment: rows already filed elsewhere are moved, and `folder_id: 0` unfiles them.  Two mutually exclusive selections:    * `ids` — an explicit list (max 20000, applied in chunks).   * `filter` — every creative matching a listing filter, given as the     same query params `GET /api/v1/creatives` accepts     (`creative_type`, `sizeid`, `orientation`, `folder_id`,     `include_subfolders`, `deleted`/`all`). Use this to file a whole     library; it is applied in batches server-side.  Nothing outside the key\'s own account can be reached by either form. 
     * File creatives into a folder.
     */
    async apiV1CreativesBulkMovePostRaw(requestParameters: ApiV1CreativesBulkMovePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesBulkMovePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Moves creatives into one media-bank folder. A creative sits in exactly one folder, so this is an assignment: rows already filed elsewhere are moved, and `folder_id: 0` unfiles them.  Two mutually exclusive selections:    * `ids` — an explicit list (max 20000, applied in chunks).   * `filter` — every creative matching a listing filter, given as the     same query params `GET /api/v1/creatives` accepts     (`creative_type`, `sizeid`, `orientation`, `folder_id`,     `include_subfolders`, `deleted`/`all`). Use this to file a whole     library; it is applied in batches server-side.  Nothing outside the key\'s own account can be reached by either form. 
     * File creatives into a folder.
     */
    async apiV1CreativesBulkMovePost(requestParameters: ApiV1CreativesBulkMovePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesBulkMovePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesGet without sending the request
     */
    async apiV1CreativesGetRequestOpts(requestParameters: ApiV1CreativesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['creativeType'] != null) {
            queryParameters['creative_type'] = requestParameters['creativeType'];
        }

        if (requestParameters['sizeid'] != null) {
            queryParameters['sizeid'] = requestParameters['sizeid'];
        }

        if (requestParameters['orientation'] != null) {
            queryParameters['orientation'] = requestParameters['orientation'];
        }

        if (requestParameters['deleted'] != null) {
            queryParameters['deleted'] = requestParameters['deleted'];
        }

        if (requestParameters['all'] != null) {
            queryParameters['all'] = requestParameters['all'];
        }

        if (requestParameters['filterName'] != null) {
            queryParameters['filter_name'] = requestParameters['filterName'];
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

        if (requestParameters['folderId'] != null) {
            queryParameters['folder_id'] = requestParameters['folderId'];
        }

        if (requestParameters['includeSubfolders'] != null) {
            queryParameters['include_subfolders'] = requestParameters['includeSubfolders'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['offset'] != null) {
            queryParameters['offset'] = requestParameters['offset'];
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterType'] != null) {
            queryParameters['filter_type'] = requestParameters['filterType'];
        }

        if (requestParameters['filterSizeid'] != null) {
            queryParameters['filter_sizeid'] = requestParameters['filterSizeid'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/creatives`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Uploaded creatives (banner / icon / native / video / reel) owned by the key.
     * List the creative library.
     */
    async apiV1CreativesGetRaw(requestParameters: ApiV1CreativesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CreativesGet200Response>> {
        const requestOptions = await this.apiV1CreativesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CreativesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Uploaded creatives (banner / icon / native / video / reel) owned by the key.
     * List the creative library.
     */
    async apiV1CreativesGet(requestParameters: ApiV1CreativesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CreativesGet200Response> {
        const response = await this.apiV1CreativesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CreativesIdDelete without sending the request
     */
    async apiV1CreativesIdDeleteRequestOpts(requestParameters: ApiV1CreativesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdDelete().'
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

        let urlPath = `/api/v1/creatives/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a creative.
     */
    async apiV1CreativesIdDeleteRaw(requestParameters: ApiV1CreativesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a creative.
     */
    async apiV1CreativesIdDelete(requestParameters: ApiV1CreativesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesIdGet without sending the request
     */
    async apiV1CreativesIdGetRequestOpts(requestParameters: ApiV1CreativesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdGet().'
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

        let urlPath = `/api/v1/creatives/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Show one creative.
     */
    async apiV1CreativesIdGetRaw(requestParameters: ApiV1CreativesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Show one creative.
     */
    async apiV1CreativesIdGet(requestParameters: ApiV1CreativesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesIdNamePut without sending the request
     */
    async apiV1CreativesIdNamePutRequestOpts(requestParameters: ApiV1CreativesIdNamePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdNamePut().'
            );
        }

        if (requestParameters['apiV1CreativesIdNamePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativesIdNamePutRequest',
                'Required parameter "apiV1CreativesIdNamePutRequest" was null or undefined when calling apiV1CreativesIdNamePut().'
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

        let urlPath = `/api/v1/creatives/{id}/name`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativesIdNamePutRequestToJSON(requestParameters['apiV1CreativesIdNamePutRequest']),
        };
    }

    /**
     * The panel\'s own rename call. Also retitles the pool items built from this creative. Prefer `PUT /api/v1/creatives/{id}` for new code. 
     * Rename a creative (panel inline edit).
     */
    async apiV1CreativesIdNamePutRaw(requestParameters: ApiV1CreativesIdNamePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdNamePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s own rename call. Also retitles the pool items built from this creative. Prefer `PUT /api/v1/creatives/{id}` for new code. 
     * Rename a creative (panel inline edit).
     */
    async apiV1CreativesIdNamePut(requestParameters: ApiV1CreativesIdNamePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdNamePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesIdPut without sending the request
     */
    async apiV1CreativesIdPutRequestOpts(requestParameters: ApiV1CreativesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdPut().'
            );
        }

        if (requestParameters['apiV1CreativesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativesIdPutRequest',
                'Required parameter "apiV1CreativesIdPutRequest" was null or undefined when calling apiV1CreativesIdPut().'
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

        let urlPath = `/api/v1/creatives/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativesIdPutRequestToJSON(requestParameters['apiV1CreativesIdPutRequest']),
        };
    }

    /**
     * The panel\'s two inline creative edits in one strict call: `name` (also retitles every pool item built from this creative, like the panel rename) and `tags`. Send either or both; unknown fields are a 422. The creative\'s file / content cannot be changed — upload a new creative instead. Same ownership and member-scope checks as the panel (an own-scoped team member can only edit creatives they made). 
     * Rename and/or re-tag a creative.
     */
    async apiV1CreativesIdPutRaw(requestParameters: ApiV1CreativesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s two inline creative edits in one strict call: `name` (also retitles every pool item built from this creative, like the panel rename) and `tags`. Send either or both; unknown fields are a 422. The creative\'s file / content cannot be changed — upload a new creative instead. Same ownership and member-scope checks as the panel (an own-scoped team member can only edit creatives they made). 
     * Rename and/or re-tag a creative.
     */
    async apiV1CreativesIdPut(requestParameters: ApiV1CreativesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesIdTagsPut without sending the request
     */
    async apiV1CreativesIdTagsPutRequestOpts(requestParameters: ApiV1CreativesIdTagsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdTagsPut().'
            );
        }

        if (requestParameters['apiV1CreativesIdTagsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CreativesIdTagsPutRequest',
                'Required parameter "apiV1CreativesIdTagsPutRequest" was null or undefined when calling apiV1CreativesIdTagsPut().'
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

        let urlPath = `/api/v1/creatives/{id}/tags`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CreativesIdTagsPutRequestToJSON(requestParameters['apiV1CreativesIdTagsPutRequest']),
        };
    }

    /**
     * The panel\'s own tag edit. `tags` is an array of tenant tag ids; non-numeric entries are dropped and [] clears the tags.
     * Replace a creative\'s tags (panel inline edit).
     */
    async apiV1CreativesIdTagsPutRaw(requestParameters: ApiV1CreativesIdTagsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdTagsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s own tag edit. `tags` is an array of tenant tag ids; non-numeric entries are dropped and [] clears the tags.
     * Replace a creative\'s tags (panel inline edit).
     */
    async apiV1CreativesIdTagsPut(requestParameters: ApiV1CreativesIdTagsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdTagsPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesIdUsedInGet without sending the request
     */
    async apiV1CreativesIdUsedInGetRequestOpts(requestParameters: ApiV1CreativesIdUsedInGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CreativesIdUsedInGet().'
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

        let urlPath = `/api/v1/creatives/{id}/used-in`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * List ads / pools referencing this creative.
     */
    async apiV1CreativesIdUsedInGetRaw(requestParameters: ApiV1CreativesIdUsedInGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesIdUsedInGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * List ads / pools referencing this creative.
     */
    async apiV1CreativesIdUsedInGet(requestParameters: ApiV1CreativesIdUsedInGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesIdUsedInGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CreativesUploadPost without sending the request
     */
    async apiV1CreativesUploadPostRequestOpts(requestParameters: ApiV1CreativesUploadPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['files'] == null) {
            throw new runtime.RequiredError(
                'files',
                'Required parameter "files" was null or undefined when calling apiV1CreativesUploadPost().'
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
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['type'] != null) {
            formParams.append('type', requestParameters['type'] as any);
        }

        if (requestParameters['files'] != null) {
            requestParameters['files'].forEach((element) => {
                formParams.append('files', element as any);
            })
        }

        if (requestParameters['bannerSize'] != null) {
            formParams.append('banner_size', requestParameters['bannerSize'] as any);
        }

        if (requestParameters['tags'] != null) {
            formParams.append('tags', requestParameters['tags'] as any);
        }

        if (requestParameters['folderId'] != null) {
            formParams.append('folder_id', requestParameters['folderId'] as any);
        }

        if (requestParameters['folderName'] != null) {
            formParams.append('folder_name', requestParameters['folderName'] as any);
        }

        if (requestParameters['uploadZip'] != null) {
            formParams.append('upload_zip', requestParameters['uploadZip'] as any);
        }

        if (requestParameters['folderFromZip'] != null) {
            formParams.append('folder_from_zip', requestParameters['folderFromZip'] as any);
        }

        if (requestParameters['folderFromZipPaths'] != null) {
            formParams.append('folder_from_zip_paths', requestParameters['folderFromZipPaths'] as any);
        }

        if (requestParameters['zipfile'] != null) {
            formParams.append('zipfile', requestParameters['zipfile'] as any);
        }

        if (requestParameters['icontags'] != null) {
            formParams.append('icontags', requestParameters['icontags'] as any);
        }

        if (requestParameters['properties'] != null) {
            formParams.append('properties', requestParameters['properties'] as any);
        }

        if (requestParameters['skiperrors'] != null) {
            formParams.append('skiperrors', requestParameters['skiperrors'] as any);
        }

        if (requestParameters['useOverlays'] != null) {
            formParams.append('use_overlays', requestParameters['useOverlays'] as any);
        }

        if (requestParameters['clonePerOverlay'] != null) {
            formParams.append('clone_per_overlay', requestParameters['clonePerOverlay'] as any);
        }

        if (requestParameters['overlay'] != null) {
            requestParameters['overlay'].forEach((element) => {
                formParams.append('overlay', element as any);
            })
        }

        if (requestParameters['overlaysZip'] != null) {
            requestParameters['overlaysZip'].forEach((element) => {
                formParams.append('overlays_zip', element as any);
            })
        }


        let urlPath = `/api/v1/creatives/upload`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * `multipart/form-data` upload of one or more real creative files. The server stores each file, creates a `creatives` row and returns the new ids — reference them later via `creative_id` on ad-create or pool-item-add. Field `files` (repeatable) carries the uploads (`files[]`, `files[0]`…, `image`, `image[]`, `image[0]`… and a singular `file` / `file[]` are accepted too); `type` selects the creative kind. `creator` takes a poster image paired with a hover video; `skin` a site-skin image; `html5` takes HTML5 rich-media banners — each file is one .zip with an index.html at the top (or inside one top folder), max 5 MB zipped / 20 MB unpacked / 300 files, only web file types (html, css, js, json, images, fonts, mp4/webm/mp3). The size is `banner_size` or the bundle\'s `<meta name=\"ad.size\" content=\"width=300,height=250\">`. It is created as a banner creative (content_type `html5`) and served as an iframe with the IAB `clickTag` query parameter (also `clickTAG`, `clicktag`) set to its click URL — open it from the creative\'s click handler (`window.open(clickTag)`) so the click is counted. `upload_zip=1` is refused for html5 (each zip is one banner). 
     * Upload creative files.
     */
    async apiV1CreativesUploadPostRaw(requestParameters: ApiV1CreativesUploadPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CreativesUploadPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `multipart/form-data` upload of one or more real creative files. The server stores each file, creates a `creatives` row and returns the new ids — reference them later via `creative_id` on ad-create or pool-item-add. Field `files` (repeatable) carries the uploads (`files[]`, `files[0]`…, `image`, `image[]`, `image[0]`… and a singular `file` / `file[]` are accepted too); `type` selects the creative kind. `creator` takes a poster image paired with a hover video; `skin` a site-skin image; `html5` takes HTML5 rich-media banners — each file is one .zip with an index.html at the top (or inside one top folder), max 5 MB zipped / 20 MB unpacked / 300 files, only web file types (html, css, js, json, images, fonts, mp4/webm/mp3). The size is `banner_size` or the bundle\'s `<meta name=\"ad.size\" content=\"width=300,height=250\">`. It is created as a banner creative (content_type `html5`) and served as an iframe with the IAB `clickTag` query parameter (also `clickTAG`, `clicktag`) set to its click URL — open it from the creative\'s click handler (`window.open(clickTag)`) so the click is counted. `upload_zip=1` is refused for html5 (each zip is one banner). 
     * Upload creative files.
     */
    async apiV1CreativesUploadPost(requestParameters: ApiV1CreativesUploadPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CreativesUploadPostRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1CreativeFoldersGetWithCountsEnum = {
    _1: '1'
} as const;
export type ApiV1CreativeFoldersGetWithCountsEnum = typeof ApiV1CreativeFoldersGetWithCountsEnum[keyof typeof ApiV1CreativeFoldersGetWithCountsEnum];
/**
 * @export
 */
export const ApiV1CreativesGetOrientationEnum = {
    Landscape: 'landscape',
    Portrait: 'portrait',
    Square: 'square'
} as const;
export type ApiV1CreativesGetOrientationEnum = typeof ApiV1CreativesGetOrientationEnum[keyof typeof ApiV1CreativesGetOrientationEnum];
/**
 * @export
 */
export const ApiV1CreativesGetDeletedEnum = {
    _1: '1'
} as const;
export type ApiV1CreativesGetDeletedEnum = typeof ApiV1CreativesGetDeletedEnum[keyof typeof ApiV1CreativesGetDeletedEnum];
/**
 * @export
 */
export const ApiV1CreativesGetAllEnum = {
    _1: '1'
} as const;
export type ApiV1CreativesGetAllEnum = typeof ApiV1CreativesGetAllEnum[keyof typeof ApiV1CreativesGetAllEnum];
/**
 * @export
 */
export const ApiV1CreativesGetSortByEnum = {
    Id: 'id',
    Name: 'name',
    Type: 'type'
} as const;
export type ApiV1CreativesGetSortByEnum = typeof ApiV1CreativesGetSortByEnum[keyof typeof ApiV1CreativesGetSortByEnum];
/**
 * @export
 */
export const ApiV1CreativesGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1CreativesGetSortDirEnum = typeof ApiV1CreativesGetSortDirEnum[keyof typeof ApiV1CreativesGetSortDirEnum];
/**
 * @export
 */
export const ApiV1CreativesGetIncludeSubfoldersEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CreativesGetIncludeSubfoldersEnum = typeof ApiV1CreativesGetIncludeSubfoldersEnum[keyof typeof ApiV1CreativesGetIncludeSubfoldersEnum];
/**
 * @export
 */
export const ApiV1CreativesGetFilterTypeEnum = {
    Banner: 'banner',
    Icon: 'icon',
    Native: 'native',
    Push: 'push',
    Video: 'video',
    Reel: 'reel',
    Image: 'image',
    Creator: 'creator',
    Audio: 'audio'
} as const;
export type ApiV1CreativesGetFilterTypeEnum = typeof ApiV1CreativesGetFilterTypeEnum[keyof typeof ApiV1CreativesGetFilterTypeEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostTypeEnum = {
    Banner: 'banner',
    Icon: 'icon',
    Native: 'native',
    Push: 'push',
    Video: 'video',
    Reel: 'reel',
    Skin: 'skin',
    Creator: 'creator',
    Html5: 'html5',
    Audio: 'audio'
} as const;
export type ApiV1CreativesUploadPostTypeEnum = typeof ApiV1CreativesUploadPostTypeEnum[keyof typeof ApiV1CreativesUploadPostTypeEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostUploadZipEnum = {
    _1: '1'
} as const;
export type ApiV1CreativesUploadPostUploadZipEnum = typeof ApiV1CreativesUploadPostUploadZipEnum[keyof typeof ApiV1CreativesUploadPostUploadZipEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostFolderFromZipEnum = {
    _1: '1'
} as const;
export type ApiV1CreativesUploadPostFolderFromZipEnum = typeof ApiV1CreativesUploadPostFolderFromZipEnum[keyof typeof ApiV1CreativesUploadPostFolderFromZipEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostFolderFromZipPathsEnum = {
    _1: '1'
} as const;
export type ApiV1CreativesUploadPostFolderFromZipPathsEnum = typeof ApiV1CreativesUploadPostFolderFromZipPathsEnum[keyof typeof ApiV1CreativesUploadPostFolderFromZipPathsEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostSkiperrorsEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CreativesUploadPostSkiperrorsEnum = typeof ApiV1CreativesUploadPostSkiperrorsEnum[keyof typeof ApiV1CreativesUploadPostSkiperrorsEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostUseOverlaysEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CreativesUploadPostUseOverlaysEnum = typeof ApiV1CreativesUploadPostUseOverlaysEnum[keyof typeof ApiV1CreativesUploadPostUseOverlaysEnum];
/**
 * @export
 */
export const ApiV1CreativesUploadPostClonePerOverlayEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CreativesUploadPostClonePerOverlayEnum = typeof ApiV1CreativesUploadPostClonePerOverlayEnum[keyof typeof ApiV1CreativesUploadPostClonePerOverlayEnum];
