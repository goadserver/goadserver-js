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
  CpaOptimizerBody,
  CpmOptimizerBody,
} from '../models/index';
import {
    CpaOptimizerBodyFromJSON,
    CpaOptimizerBodyToJSON,
    CpmOptimizerBodyFromJSON,
    CpmOptimizerBodyToJSON,
} from '../models/index';

export interface ApiV1CpaOptimizersIdDeleteRequest {
    id: number;
}

export interface ApiV1CpaOptimizersIdGetRequest {
    id: number;
}

export interface ApiV1CpaOptimizersIdPutRequest {
    id: number;
    cpaOptimizerBody: Omit<CpaOptimizerBody, 'id'|'type'>;
}

export interface ApiV1CpaOptimizersPostRequest {
    cpaOptimizerBody: Omit<CpaOptimizerBody, 'id'|'type'>;
}

export interface ApiV1CpmOptimizersIdDeleteRequest {
    id: number;
}

export interface ApiV1CpmOptimizersIdGetRequest {
    id: number;
}

export interface ApiV1CpmOptimizersIdPutRequest {
    id: number;
    cpmOptimizerBody: Omit<CpmOptimizerBody, 'id'|'type'|'userid'>;
}

export interface ApiV1CpmOptimizersPostRequest {
    cpmOptimizerBody: Omit<CpmOptimizerBody, 'id'|'type'|'userid'>;
}

/**
 * 
 */
export class SourceOptimizersApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1CpaOptimizersGet without sending the request
     */
    async apiV1CpaOptimizersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cpa-optimizers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A bare array. Money (`max_cpa`, the `target_cpa` values) is in the account currency — stored ×100 as cents and divided back here. `target_cpa` / `min_margin` are keyed by conversion-type id (see GET /api/v1/tracking/conversion-types); `min_margin` is a percent. 
     * List CPA optimizers.
     */
    async apiV1CpaOptimizersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpaOptimizersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A bare array. Money (`max_cpa`, the `target_cpa` values) is in the account currency — stored ×100 as cents and divided back here. `target_cpa` / `min_margin` are keyed by conversion-type id (see GET /api/v1/tracking/conversion-types); `min_margin` is a percent. 
     * List CPA optimizers.
     */
    async apiV1CpaOptimizersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpaOptimizersGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CpaOptimizersIdDelete without sending the request
     */
    async apiV1CpaOptimizersIdDeleteRequestOpts(requestParameters: ApiV1CpaOptimizersIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CpaOptimizersIdDelete().'
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

        let urlPath = `/api/v1/cpa-optimizers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete. Returns 202 with `true` when a row was deleted, `false` when none matched. Refused for a campaign-pinned key.
     * Delete a CPA optimizer.
     */
    async apiV1CpaOptimizersIdDeleteRaw(requestParameters: ApiV1CpaOptimizersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpaOptimizersIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft delete. Returns 202 with `true` when a row was deleted, `false` when none matched. Refused for a campaign-pinned key.
     * Delete a CPA optimizer.
     */
    async apiV1CpaOptimizersIdDelete(requestParameters: ApiV1CpaOptimizersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpaOptimizersIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpaOptimizersIdGet without sending the request
     */
    async apiV1CpaOptimizersIdGetRequestOpts(requestParameters: ApiV1CpaOptimizersIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CpaOptimizersIdGet().'
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

        let urlPath = `/api/v1/cpa-optimizers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * `targets` is a one-element array (empty when the id is not the caller\'s — no 404); `conversion_types` are the account\'s conversion-type slots the `target_cpa` keys refer to. 
     * Show a CPA optimizer.
     */
    async apiV1CpaOptimizersIdGetRaw(requestParameters: ApiV1CpaOptimizersIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpaOptimizersIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `targets` is a one-element array (empty when the id is not the caller\'s — no 404); `conversion_types` are the account\'s conversion-type slots the `target_cpa` keys refer to. 
     * Show a CPA optimizer.
     */
    async apiV1CpaOptimizersIdGet(requestParameters: ApiV1CpaOptimizersIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpaOptimizersIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpaOptimizersIdPut without sending the request
     */
    async apiV1CpaOptimizersIdPutRequestOpts(requestParameters: ApiV1CpaOptimizersIdPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CpaOptimizersIdPut().'
            );
        }

        if (requestParameters['cpaOptimizerBody'] == null) {
            throw new runtime.RequiredError(
                'cpaOptimizerBody',
                'Required parameter "cpaOptimizerBody" was null or undefined when calling apiV1CpaOptimizersIdPut().'
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

        let urlPath = `/api/v1/cpa-optimizers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: CpaOptimizerBodyToJSON(requestParameters['cpaOptimizerBody']),
        };
    }

    /**
     * Full replace with the create validation; fields left out reset to their zero value (`start_date` left out keeps the stored date). Refused for a campaign-pinned key. Returns the id. 
     * Replace a CPA optimizer.
     */
    async apiV1CpaOptimizersIdPutRaw(requestParameters: ApiV1CpaOptimizersIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpaOptimizersIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Full replace with the create validation; fields left out reset to their zero value (`start_date` left out keeps the stored date). Refused for a campaign-pinned key. Returns the id. 
     * Replace a CPA optimizer.
     */
    async apiV1CpaOptimizersIdPut(requestParameters: ApiV1CpaOptimizersIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpaOptimizersIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpaOptimizersPost without sending the request
     */
    async apiV1CpaOptimizersPostRequestOpts(requestParameters: ApiV1CpaOptimizersPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['cpaOptimizerBody'] == null) {
            throw new runtime.RequiredError(
                'cpaOptimizerBody',
                'Required parameter "cpaOptimizerBody" was null or undefined when calling apiV1CpaOptimizersPost().'
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

        let urlPath = `/api/v1/cpa-optimizers`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CpaOptimizerBodyToJSON(requestParameters['cpaOptimizerBody']),
        };
    }

    /**
     * `title` (non-alphanumerics become `_`) and a non-zero `max_cpa` are required (422 `NO_TITLE` / `NO_PRICE_GIVEN`); a malformed `start_date` → 422 `NO_VALID_DATE`. Money in account currency (stored as cents). `bounce_max_perc` outside 0–100 and a `min_margin` outside 0–100 are stored as 0. Returns the new id as a bare number. `id` / `type` are accepted and ignored; any other unknown key → 422 `unknown_fields`. 
     * Create a CPA optimizer.
     */
    async apiV1CpaOptimizersPostRaw(requestParameters: ApiV1CpaOptimizersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpaOptimizersPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `title` (non-alphanumerics become `_`) and a non-zero `max_cpa` are required (422 `NO_TITLE` / `NO_PRICE_GIVEN`); a malformed `start_date` → 422 `NO_VALID_DATE`. Money in account currency (stored as cents). `bounce_max_perc` outside 0–100 and a `min_margin` outside 0–100 are stored as 0. Returns the new id as a bare number. `id` / `type` are accepted and ignored; any other unknown key → 422 `unknown_fields`. 
     * Create a CPA optimizer.
     */
    async apiV1CpaOptimizersPost(requestParameters: ApiV1CpaOptimizersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpaOptimizersPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpmOptimizersActiveGet without sending the request
     */
    async apiV1CpmOptimizersActiveGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cpm-optimizers/active`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Does the account have any CPM optimizer?
     */
    async apiV1CpmOptimizersActiveGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpmOptimizersActiveGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Does the account have any CPM optimizer?
     */
    async apiV1CpmOptimizersActiveGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpmOptimizersActiveGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CpmOptimizersGet without sending the request
     */
    async apiV1CpmOptimizersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cpm-optimizers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A bare array (no envelope), ordered by title. Each item is the stored settings merged with `id`, `userid`, `title` and `type: \"cpm\"`. Money fields (`min_spendings`, `max_cpa`) are in the account currency, as entered. 
     * List CPM optimizers.
     */
    async apiV1CpmOptimizersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpmOptimizersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A bare array (no envelope), ordered by title. Each item is the stored settings merged with `id`, `userid`, `title` and `type: \"cpm\"`. Money fields (`min_spendings`, `max_cpa`) are in the account currency, as entered. 
     * List CPM optimizers.
     */
    async apiV1CpmOptimizersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpmOptimizersGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CpmOptimizersIdDelete without sending the request
     */
    async apiV1CpmOptimizersIdDeleteRequestOpts(requestParameters: ApiV1CpmOptimizersIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CpmOptimizersIdDelete().'
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

        let urlPath = `/api/v1/cpm-optimizers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete. Refused for a campaign-pinned key.
     * Delete a CPM optimizer.
     */
    async apiV1CpmOptimizersIdDeleteRaw(requestParameters: ApiV1CpmOptimizersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpmOptimizersIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft delete. Refused for a campaign-pinned key.
     * Delete a CPM optimizer.
     */
    async apiV1CpmOptimizersIdDelete(requestParameters: ApiV1CpmOptimizersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpmOptimizersIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpmOptimizersIdGet without sending the request
     */
    async apiV1CpmOptimizersIdGetRequestOpts(requestParameters: ApiV1CpmOptimizersIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CpmOptimizersIdGet().'
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

        let urlPath = `/api/v1/cpm-optimizers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns a one-element array (panel shape).
     * Show a CPM optimizer.
     */
    async apiV1CpmOptimizersIdGetRaw(requestParameters: ApiV1CpmOptimizersIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpmOptimizersIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Returns a one-element array (panel shape).
     * Show a CPM optimizer.
     */
    async apiV1CpmOptimizersIdGet(requestParameters: ApiV1CpmOptimizersIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpmOptimizersIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpmOptimizersIdPut without sending the request
     */
    async apiV1CpmOptimizersIdPutRequestOpts(requestParameters: ApiV1CpmOptimizersIdPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CpmOptimizersIdPut().'
            );
        }

        if (requestParameters['cpmOptimizerBody'] == null) {
            throw new runtime.RequiredError(
                'cpmOptimizerBody',
                'Required parameter "cpmOptimizerBody" was null or undefined when calling apiV1CpmOptimizersIdPut().'
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

        let urlPath = `/api/v1/cpm-optimizers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: CpmOptimizerBodyToJSON(requestParameters['cpmOptimizerBody']),
        };
    }

    /**
     * Full replace — the settings become exactly the body (fields left out are cleared). Same validation as create. Every campaign using the optimizer follows the change, so a campaign-pinned key gets 403 `forbidden_resource`. Returns the id. 
     * Replace a CPM optimizer.
     */
    async apiV1CpmOptimizersIdPutRaw(requestParameters: ApiV1CpmOptimizersIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpmOptimizersIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Full replace — the settings become exactly the body (fields left out are cleared). Same validation as create. Every campaign using the optimizer follows the change, so a campaign-pinned key gets 403 `forbidden_resource`. Returns the id. 
     * Replace a CPM optimizer.
     */
    async apiV1CpmOptimizersIdPut(requestParameters: ApiV1CpmOptimizersIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpmOptimizersIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CpmOptimizersPost without sending the request
     */
    async apiV1CpmOptimizersPostRequestOpts(requestParameters: ApiV1CpmOptimizersPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['cpmOptimizerBody'] == null) {
            throw new runtime.RequiredError(
                'cpmOptimizerBody',
                'Required parameter "cpmOptimizerBody" was null or undefined when calling apiV1CpmOptimizersPost().'
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

        let urlPath = `/api/v1/cpm-optimizers`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CpmOptimizerBodyToJSON(requestParameters['cpmOptimizerBody']),
        };
    }

    /**
     * `title` and a non-zero `min_spendings` are required (422 `NO_TITLE_GIVEN` / `NO_PRICE_GIVEN`). Every other listed field is stored as sent. `id`, `type` and `userid` are accepted (and ignored) so a fetched optimizer can be sent back; any other key → 422 `unknown_fields`. Returns the new id as a bare number. 
     * Create a CPM optimizer.
     */
    async apiV1CpmOptimizersPostRaw(requestParameters: ApiV1CpmOptimizersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CpmOptimizersPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `title` and a non-zero `min_spendings` are required (422 `NO_TITLE_GIVEN` / `NO_PRICE_GIVEN`). Every other listed field is stored as sent. `id`, `type` and `userid` are accepted (and ignored) so a fetched optimizer can be sent back; any other key → 422 `unknown_fields`. Returns the new id as a bare number. 
     * Create a CPM optimizer.
     */
    async apiV1CpmOptimizersPost(requestParameters: ApiV1CpmOptimizersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CpmOptimizersPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SourceOptimizerConfigGet without sending the request
     */
    async apiV1SourceOptimizerConfigGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/source-optimizer/config`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The values `filter_type`, `cpa_action` and `bounce_check_type` accept.
     * Option values for the optimizer forms.
     */
    async apiV1SourceOptimizerConfigGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SourceOptimizerConfigGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The values `filter_type`, `cpa_action` and `bounce_check_type` accept.
     * Option values for the optimizer forms.
     */
    async apiV1SourceOptimizerConfigGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SourceOptimizerConfigGetRaw(initOverrides);
    }

}
