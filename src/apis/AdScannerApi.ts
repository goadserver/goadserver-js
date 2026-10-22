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
  ApiV1AdScannerIdIgnoreDomainPutRequest,
  ApiV1AdScannerIdManualItemsItemIdStatePutRequest,
  ApiV1AdScannerIdManualItemsPostRequest,
  ApiV1AdScannerIdPutRequest,
  ApiV1AdScannerIdToggleActivePutRequest,
  ApiV1AdScannerPostRequest,
} from '../models/index';
import {
    ApiV1AdScannerIdIgnoreDomainPutRequestFromJSON,
    ApiV1AdScannerIdIgnoreDomainPutRequestToJSON,
    ApiV1AdScannerIdManualItemsItemIdStatePutRequestFromJSON,
    ApiV1AdScannerIdManualItemsItemIdStatePutRequestToJSON,
    ApiV1AdScannerIdManualItemsPostRequestFromJSON,
    ApiV1AdScannerIdManualItemsPostRequestToJSON,
    ApiV1AdScannerIdPutRequestFromJSON,
    ApiV1AdScannerIdPutRequestToJSON,
    ApiV1AdScannerIdToggleActivePutRequestFromJSON,
    ApiV1AdScannerIdToggleActivePutRequestToJSON,
    ApiV1AdScannerPostRequestFromJSON,
    ApiV1AdScannerPostRequestToJSON,
} from '../models/index';

export interface ApiV1AdScannerIdDeleteRequest {
    id: number;
}

export interface ApiV1AdScannerIdIgnoreDomainPutOperationRequest {
    id: number;
    apiV1AdScannerIdIgnoreDomainPutRequest: ApiV1AdScannerIdIgnoreDomainPutRequest;
}

export interface ApiV1AdScannerIdManualItemsGetRequest {
    id: number;
}

export interface ApiV1AdScannerIdManualItemsItemIdStatePutOperationRequest {
    id: number;
    itemId: number;
    apiV1AdScannerIdManualItemsItemIdStatePutRequest: ApiV1AdScannerIdManualItemsItemIdStatePutRequest;
}

export interface ApiV1AdScannerIdManualItemsPostOperationRequest {
    id: number;
    apiV1AdScannerIdManualItemsPostRequest: ApiV1AdScannerIdManualItemsPostRequest;
}

export interface ApiV1AdScannerIdPutOperationRequest {
    id: number;
    apiV1AdScannerIdPutRequest: ApiV1AdScannerIdPutRequest;
}

export interface ApiV1AdScannerIdToggleActivePutOperationRequest {
    id: number;
    apiV1AdScannerIdToggleActivePutRequest?: ApiV1AdScannerIdToggleActivePutRequest;
}

export interface ApiV1AdScannerPostOperationRequest {
    apiV1AdScannerPostRequest: ApiV1AdScannerPostRequest;
}

export interface ApiV1AdScannerReportHashGetRequest {
    hash: string;
}

export interface ApiV1AdScannerReportsGetRequest {
    datestart?: Date;
    dateend?: Date;
    scanType?: ApiV1AdScannerReportsGetScanTypeEnum;
    scanTarget?: ApiV1AdScannerReportsGetScanTargetEnum;
    scanState?: ApiV1AdScannerReportsGetScanStateEnum;
    page?: number;
}

export interface ApiV1AdScannerStatsGetRequest {
    datestart?: Date;
    dateend?: Date;
    statsSelcols?: string;
    configId?: number;
    country?: string;
    proxyUsed?: ApiV1AdScannerStatsGetProxyUsedEnum;
}

/**
 * 
 */
export class AdScannerApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1AdScannerGet without sending the request
     */
    async apiV1AdScannerGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-scanner`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A bare array; `config` decoded, `tags` split into an array.  `coverage` — what the task\'s next run would scan, `{count, reason}` (`null` for `campaigns` targets). When `count` is 0 the task produces no reports, and `reason` says why: `no_smart_zones`, `scanning_off` (no smart zone the task covers has Scanning on), `no_matching_zones` (no zone of an ad type this scan type covers, or none in the chosen networks), `no_recent_traffic` (no matching zone served in the last 5 days), `no_items` (manual task without active items) or `no_matching_items` (manual items of the wrong type for this scan type). `reason` is empty when `count` > 0. 
     * List scan tasks.
     */
    async apiV1AdScannerGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A bare array; `config` decoded, `tags` split into an array.  `coverage` — what the task\'s next run would scan, `{count, reason}` (`null` for `campaigns` targets). When `count` is 0 the task produces no reports, and `reason` says why: `no_smart_zones`, `scanning_off` (no smart zone the task covers has Scanning on), `no_matching_zones` (no zone of an ad type this scan type covers, or none in the chosen networks), `no_recent_traffic` (no matching zone served in the last 5 days), `no_items` (manual task without active items) or `no_matching_items` (manual items of the wrong type for this scan type). `reason` is empty when `count` > 0. 
     * List scan tasks.
     */
    async apiV1AdScannerGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdDelete without sending the request
     */
    async apiV1AdScannerIdDeleteRequestOpts(requestParameters: ApiV1AdScannerIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdDelete().'
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

        let urlPath = `/api/v1/ad-scanner/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete; the task stops scanning.
     * Delete a scan task.
     */
    async apiV1AdScannerIdDeleteRaw(requestParameters: ApiV1AdScannerIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft delete; the task stops scanning.
     * Delete a scan task.
     */
    async apiV1AdScannerIdDelete(requestParameters: ApiV1AdScannerIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdIgnoreDomainPut without sending the request
     */
    async apiV1AdScannerIdIgnoreDomainPutRequestOpts(requestParameters: ApiV1AdScannerIdIgnoreDomainPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdIgnoreDomainPut().'
            );
        }

        if (requestParameters['apiV1AdScannerIdIgnoreDomainPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdScannerIdIgnoreDomainPutRequest',
                'Required parameter "apiV1AdScannerIdIgnoreDomainPutRequest" was null or undefined when calling apiV1AdScannerIdIgnoreDomainPut().'
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

        let urlPath = `/api/v1/ad-scanner/{id}/ignore-domain`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdScannerIdIgnoreDomainPutRequestToJSON(requestParameters['apiV1AdScannerIdIgnoreDomainPutRequest']),
        };
    }

    /**
     * Toggles `value` in the task\'s `config.detection.domains.ignored` list: added when absent, removed when present. `type` must be `detection.domains.ignore`. Answers 200 `{success: false}` when the type / value is wrong or the task is not the caller\'s. 
     * Ignore (or un-ignore) a flagged domain on a task.
     */
    async apiV1AdScannerIdIgnoreDomainPutRaw(requestParameters: ApiV1AdScannerIdIgnoreDomainPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdIgnoreDomainPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Toggles `value` in the task\'s `config.detection.domains.ignored` list: added when absent, removed when present. `type` must be `detection.domains.ignore`. Answers 200 `{success: false}` when the type / value is wrong or the task is not the caller\'s. 
     * Ignore (or un-ignore) a flagged domain on a task.
     */
    async apiV1AdScannerIdIgnoreDomainPut(requestParameters: ApiV1AdScannerIdIgnoreDomainPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdIgnoreDomainPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdManualItemsGet without sending the request
     */
    async apiV1AdScannerIdManualItemsGetRequestOpts(requestParameters: ApiV1AdScannerIdManualItemsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdManualItemsGet().'
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

        let urlPath = `/api/v1/ad-scanner/{id}/manual-items`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The URLs / tags a `target: manual` task scans. Bare array (empty for an unknown task).
     * List a manual task\'s items.
     */
    async apiV1AdScannerIdManualItemsGetRaw(requestParameters: ApiV1AdScannerIdManualItemsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdManualItemsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The URLs / tags a `target: manual` task scans. Bare array (empty for an unknown task).
     * List a manual task\'s items.
     */
    async apiV1AdScannerIdManualItemsGet(requestParameters: ApiV1AdScannerIdManualItemsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdManualItemsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdManualItemsItemIdStatePut without sending the request
     */
    async apiV1AdScannerIdManualItemsItemIdStatePutRequestOpts(requestParameters: ApiV1AdScannerIdManualItemsItemIdStatePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdManualItemsItemIdStatePut().'
            );
        }

        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling apiV1AdScannerIdManualItemsItemIdStatePut().'
            );
        }

        if (requestParameters['apiV1AdScannerIdManualItemsItemIdStatePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdScannerIdManualItemsItemIdStatePutRequest',
                'Required parameter "apiV1AdScannerIdManualItemsItemIdStatePutRequest" was null or undefined when calling apiV1AdScannerIdManualItemsItemIdStatePut().'
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

        let urlPath = `/api/v1/ad-scanner/{id}/manual-items/{itemId}/state`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"itemId"}}`, encodeURIComponent(String(requestParameters['itemId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdScannerIdManualItemsItemIdStatePutRequestToJSON(requestParameters['apiV1AdScannerIdManualItemsItemIdStatePutRequest']),
        };
    }

    /**
     * `fld` = `isactive` (default) or `isdeleted`; `value` 0 / 1. Deleting also deactivates. 200 `{success: false}` when the item is not the caller\'s. 
     * Pause, resume or delete a manual item.
     */
    async apiV1AdScannerIdManualItemsItemIdStatePutRaw(requestParameters: ApiV1AdScannerIdManualItemsItemIdStatePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdManualItemsItemIdStatePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `fld` = `isactive` (default) or `isdeleted`; `value` 0 / 1. Deleting also deactivates. 200 `{success: false}` when the item is not the caller\'s. 
     * Pause, resume or delete a manual item.
     */
    async apiV1AdScannerIdManualItemsItemIdStatePut(requestParameters: ApiV1AdScannerIdManualItemsItemIdStatePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdManualItemsItemIdStatePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdManualItemsPost without sending the request
     */
    async apiV1AdScannerIdManualItemsPostRequestOpts(requestParameters: ApiV1AdScannerIdManualItemsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdManualItemsPost().'
            );
        }

        if (requestParameters['apiV1AdScannerIdManualItemsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdScannerIdManualItemsPostRequest',
                'Required parameter "apiV1AdScannerIdManualItemsPostRequest" was null or undefined when calling apiV1AdScannerIdManualItemsPost().'
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

        let urlPath = `/api/v1/ad-scanner/{id}/manual-items`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdScannerIdManualItemsPostRequestToJSON(requestParameters['apiV1AdScannerIdManualItemsPostRequest']),
        };
    }

    /**
     * Without `id` adds an item; with `id` edits that item. `type` = url (default), html, iframe or vast_url; `value` is required. Failures (no value, task not the caller\'s) answer 200 `{success: false}`. 
     * Add or edit a manual item.
     */
    async apiV1AdScannerIdManualItemsPostRaw(requestParameters: ApiV1AdScannerIdManualItemsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdManualItemsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Without `id` adds an item; with `id` edits that item. `type` = url (default), html, iframe or vast_url; `value` is required. Failures (no value, task not the caller\'s) answer 200 `{success: false}`. 
     * Add or edit a manual item.
     */
    async apiV1AdScannerIdManualItemsPost(requestParameters: ApiV1AdScannerIdManualItemsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdManualItemsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdPut without sending the request
     */
    async apiV1AdScannerIdPutRequestOpts(requestParameters: ApiV1AdScannerIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdPut().'
            );
        }

        if (requestParameters['apiV1AdScannerIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdScannerIdPutRequest',
                'Required parameter "apiV1AdScannerIdPutRequest" was null or undefined when calling apiV1AdScannerIdPut().'
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

        let urlPath = `/api/v1/ad-scanner/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdScannerIdPutRequestToJSON(requestParameters['apiV1AdScannerIdPutRequest']),
        };
    }

    /**
     * Full replace of these three: a `config` or `tags` left out is cleared, so send the whole task. `target` / `scan_type` / `adtypeid` are fixed at create. 
     * Replace a task\'s name, tags and config.
     */
    async apiV1AdScannerIdPutRaw(requestParameters: ApiV1AdScannerIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Full replace of these three: a `config` or `tags` left out is cleared, so send the whole task. `target` / `scan_type` / `adtypeid` are fixed at create. 
     * Replace a task\'s name, tags and config.
     */
    async apiV1AdScannerIdPut(requestParameters: ApiV1AdScannerIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerIdToggleActivePut without sending the request
     */
    async apiV1AdScannerIdToggleActivePutRequestOpts(requestParameters: ApiV1AdScannerIdToggleActivePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdScannerIdToggleActivePut().'
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

        let urlPath = `/api/v1/ad-scanner/{id}/toggle-active`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdScannerIdToggleActivePutRequestToJSON(requestParameters['apiV1AdScannerIdToggleActivePutRequest']),
        };
    }

    /**
     * `is_active` > 0 starts it; 0 or no body stops it.
     * Start or stop a scan task.
     */
    async apiV1AdScannerIdToggleActivePutRaw(requestParameters: ApiV1AdScannerIdToggleActivePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerIdToggleActivePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `is_active` > 0 starts it; 0 or no body stops it.
     * Start or stop a scan task.
     */
    async apiV1AdScannerIdToggleActivePut(requestParameters: ApiV1AdScannerIdToggleActivePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerIdToggleActivePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerPost without sending the request
     */
    async apiV1AdScannerPostRequestOpts(requestParameters: ApiV1AdScannerPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdScannerPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdScannerPostRequest',
                'Required parameter "apiV1AdScannerPostRequest" was null or undefined when calling apiV1AdScannerPost().'
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

        let urlPath = `/api/v1/ad-scanner`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdScannerPostRequestToJSON(requestParameters['apiV1AdScannerPostRequest']),
        };
    }

    /**
     * - `target` — `campaigns` (your own campaigns\' ads), `smartzones`   (default) or `manual` (items you add under   …/{id}/manual-items). Unknown values become `smartzones`. - `scan_type` — `ad_scan` (default), `url_scan` or `vast_scan`. - `config` — only these keys are kept: `smartzone_networks`,   `device_types`, `browsers` `{items, random}`, `interval`   `{type: minutely|hourly|daily, amount}`, `detection` (push,   alerts, popups, cookies, crypto_miners, `domains` `{on, malicious,   suspicious, ignored[], ignore_dates}`, `suspicious_dom`,   `fingerprinting`, `obfuscated_js`, `permission`,   `scan_landing_ads`, `max_landing_ad_scans`), `proxy` `{on,   locations[]}`, `notify` `{enabled, level: all|serious, dest}`. - `tags` — a CSV string or an array of strings.  `target`, `scan_type` and `adtypeid` cannot change later. The task starts active. Proxy scans use metered bandwidth. 
     * Create a scan task.
     */
    async apiV1AdScannerPostRaw(requestParameters: ApiV1AdScannerPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * - `target` — `campaigns` (your own campaigns\' ads), `smartzones`   (default) or `manual` (items you add under   …/{id}/manual-items). Unknown values become `smartzones`. - `scan_type` — `ad_scan` (default), `url_scan` or `vast_scan`. - `config` — only these keys are kept: `smartzone_networks`,   `device_types`, `browsers` `{items, random}`, `interval`   `{type: minutely|hourly|daily, amount}`, `detection` (push,   alerts, popups, cookies, crypto_miners, `domains` `{on, malicious,   suspicious, ignored[], ignore_dates}`, `suspicious_dom`,   `fingerprinting`, `obfuscated_js`, `permission`,   `scan_landing_ads`, `max_landing_ad_scans`), `proxy` `{on,   locations[]}`, `notify` `{enabled, level: all|serious, dest}`. - `tags` — a CSV string or an array of strings.  `target`, `scan_type` and `adtypeid` cannot change later. The task starts active. Proxy scans use metered bandwidth. 
     * Create a scan task.
     */
    async apiV1AdScannerPost(requestParameters: ApiV1AdScannerPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerReportHashGet without sending the request
     */
    async apiV1AdScannerReportHashGetRequestOpts(requestParameters: ApiV1AdScannerReportHashGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['hash'] == null) {
            throw new runtime.RequiredError(
                'hash',
                'Required parameter "hash" was null or undefined when calling apiV1AdScannerReportHashGet().'
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

        let urlPath = `/api/v1/ad-scanner/report/{hash}`;
        urlPath = urlPath.replace(`{${"hash"}}`, encodeURIComponent(String(requestParameters['hash'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The browser report of a single scan (`uid` from the results list): events, redirects, requests, findings, plus the task config. Only the caller\'s own scans — another account\'s uid is 404. 
     * One scan\'s full report.
     */
    async apiV1AdScannerReportHashGetRaw(requestParameters: ApiV1AdScannerReportHashGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerReportHashGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The browser report of a single scan (`uid` from the results list): events, redirects, requests, findings, plus the task config. Only the caller\'s own scans — another account\'s uid is 404. 
     * One scan\'s full report.
     */
    async apiV1AdScannerReportHashGet(requestParameters: ApiV1AdScannerReportHashGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerReportHashGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerReportsGet without sending the request
     */
    async apiV1AdScannerReportsGetRequestOpts(requestParameters: ApiV1AdScannerReportsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['datestart'] != null) {
            queryParameters['datestart'] = (requestParameters['datestart'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['dateend'] != null) {
            queryParameters['dateend'] = (requestParameters['dateend'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['scanType'] != null) {
            queryParameters['scan_type'] = requestParameters['scanType'];
        }

        if (requestParameters['scanTarget'] != null) {
            queryParameters['scan_target'] = requestParameters['scanTarget'];
        }

        if (requestParameters['scanState'] != null) {
            queryParameters['scan_state'] = requestParameters['scanState'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-scanner/reports`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One row per scan, 2500 per page (`page`). Defaults to today. `scan_state` 1 = scans that found something, 0 = clean. Rows carry `uid` (open the full report with GET …/report/{uid}), `task_name` and `scanned_item`. 
     * List scan results.
     */
    async apiV1AdScannerReportsGetRaw(requestParameters: ApiV1AdScannerReportsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerReportsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * One row per scan, 2500 per page (`page`). Defaults to today. `scan_state` 1 = scans that found something, 0 = clean. Rows carry `uid` (open the full report with GET …/report/{uid}), `task_name` and `scanned_item`. 
     * List scan results.
     */
    async apiV1AdScannerReportsGet(requestParameters: ApiV1AdScannerReportsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerReportsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerStatsGet without sending the request
     */
    async apiV1AdScannerStatsGetRequestOpts(requestParameters: ApiV1AdScannerStatsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['datestart'] != null) {
            queryParameters['datestart'] = (requestParameters['datestart'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['dateend'] != null) {
            queryParameters['dateend'] = (requestParameters['dateend'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['statsSelcols'] != null) {
            queryParameters['stats_selcols'] = requestParameters['statsSelcols'];
        }

        if (requestParameters['configId'] != null) {
            queryParameters['config_id'] = requestParameters['configId'];
        }

        if (requestParameters['country'] != null) {
            queryParameters['country'] = requestParameters['country'];
        }

        if (requestParameters['proxyUsed'] != null) {
            queryParameters['proxy_used'] = requestParameters['proxyUsed'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-scanner/stats`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Totals grouped by `stats_selcols` (CSV of scandate, config_id, country; default scandate). `bandwidth` is proxy bytes used. 
     * Scan volume and proxy bandwidth.
     */
    async apiV1AdScannerStatsGetRaw(requestParameters: ApiV1AdScannerStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerStatsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Totals grouped by `stats_selcols` (CSV of scandate, config_id, country; default scandate). `bandwidth` is proxy bytes used. 
     * Scan volume and proxy bandwidth.
     */
    async apiV1AdScannerStatsGet(requestParameters: ApiV1AdScannerStatsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerStatsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdScannerTagsGet without sending the request
     */
    async apiV1AdScannerTagsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-scanner/tags`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Tags used on the account\'s scan tasks.
     */
    async apiV1AdScannerTagsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdScannerTagsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Tags used on the account\'s scan tasks.
     */
    async apiV1AdScannerTagsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdScannerTagsGetRaw(initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1AdScannerReportsGetScanTypeEnum = {
    AdScan: 'ad_scan',
    UrlScan: 'url_scan',
    VastScan: 'vast_scan'
} as const;
export type ApiV1AdScannerReportsGetScanTypeEnum = typeof ApiV1AdScannerReportsGetScanTypeEnum[keyof typeof ApiV1AdScannerReportsGetScanTypeEnum];
/**
 * @export
 */
export const ApiV1AdScannerReportsGetScanTargetEnum = {
    Smartzones: 'smartzones',
    Campaigns: 'campaigns',
    Manual: 'manual'
} as const;
export type ApiV1AdScannerReportsGetScanTargetEnum = typeof ApiV1AdScannerReportsGetScanTargetEnum[keyof typeof ApiV1AdScannerReportsGetScanTargetEnum];
/**
 * @export
 */
export const ApiV1AdScannerReportsGetScanStateEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1AdScannerReportsGetScanStateEnum = typeof ApiV1AdScannerReportsGetScanStateEnum[keyof typeof ApiV1AdScannerReportsGetScanStateEnum];
/**
 * @export
 */
export const ApiV1AdScannerStatsGetProxyUsedEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1AdScannerStatsGetProxyUsedEnum = typeof ApiV1AdScannerStatsGetProxyUsedEnum[keyof typeof ApiV1AdScannerStatsGetProxyUsedEnum];
