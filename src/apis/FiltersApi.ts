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
  ApiV1CampaignsTypeIdActivePatchRequest,
  ApiV1FiltersGet200Response,
  ApiV1FiltersMassActionPostRequest,
  ApiV1FiltersPostRequest,
  ApiV1FiltersTypeIdActivePatch200Response,
  ApiV1FiltersTypeIdItemsItemDelete200Response,
  ApiV1FiltersTypeIdItemsPost200Response,
  ApiV1FiltersTypeIdItemsPostRequest,
  ApiV1FiltersTypeIdPutRequest,
  FilterDetail,
  FilterType,
} from '../models/index';
import {
    ApiV1CampaignsTypeIdActivePatchRequestFromJSON,
    ApiV1CampaignsTypeIdActivePatchRequestToJSON,
    ApiV1FiltersGet200ResponseFromJSON,
    ApiV1FiltersGet200ResponseToJSON,
    ApiV1FiltersMassActionPostRequestFromJSON,
    ApiV1FiltersMassActionPostRequestToJSON,
    ApiV1FiltersPostRequestFromJSON,
    ApiV1FiltersPostRequestToJSON,
    ApiV1FiltersTypeIdActivePatch200ResponseFromJSON,
    ApiV1FiltersTypeIdActivePatch200ResponseToJSON,
    ApiV1FiltersTypeIdItemsItemDelete200ResponseFromJSON,
    ApiV1FiltersTypeIdItemsItemDelete200ResponseToJSON,
    ApiV1FiltersTypeIdItemsPost200ResponseFromJSON,
    ApiV1FiltersTypeIdItemsPost200ResponseToJSON,
    ApiV1FiltersTypeIdItemsPostRequestFromJSON,
    ApiV1FiltersTypeIdItemsPostRequestToJSON,
    ApiV1FiltersTypeIdPutRequestFromJSON,
    ApiV1FiltersTypeIdPutRequestToJSON,
    FilterDetailFromJSON,
    FilterDetailToJSON,
    FilterTypeFromJSON,
    FilterTypeToJSON,
} from '../models/index';

export interface ApiV1FiltersGetRequest {
    type?: FilterType;
    search?: string;
}

export interface ApiV1FiltersIpIdRangesRangeIdDeleteRequest {
    id: number;
    rangeId: number;
}

export interface ApiV1FiltersIpIdRangesRangeIdTogglePutRequest {
    id: number;
    rangeId: number;
}

export interface ApiV1FiltersMassActionPostOperationRequest {
    apiV1FiltersMassActionPostRequest: ApiV1FiltersMassActionPostRequest;
}

export interface ApiV1FiltersPostOperationRequest {
    apiV1FiltersPostRequest: ApiV1FiltersPostRequest;
}

export interface ApiV1FiltersTypeIdActivePatchRequest {
    type: FilterType;
    id: number;
    apiV1CampaignsTypeIdActivePatchRequest: ApiV1CampaignsTypeIdActivePatchRequest;
}

export interface ApiV1FiltersTypeIdDeleteRequest {
    type: FilterType;
    id: number;
}

export interface ApiV1FiltersTypeIdGetRequest {
    type: FilterType;
    id: number;
}

export interface ApiV1FiltersTypeIdItemsItemDeleteRequest {
    type: FilterType;
    id: number;
    item: string;
}

export interface ApiV1FiltersTypeIdItemsPostOperationRequest {
    type: FilterType;
    id: number;
    apiV1FiltersTypeIdItemsPostRequest: ApiV1FiltersTypeIdItemsPostRequest;
}

export interface ApiV1FiltersTypeIdPutOperationRequest {
    type: FilterType;
    id: number;
    apiV1FiltersTypeIdPutRequest: ApiV1FiltersTypeIdPutRequest;
}

/**
 * 
 */
export class FiltersApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1FiltersGet without sending the request
     */
    async apiV1FiltersGetRequestOpts(requestParameters: ApiV1FiltersGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/filters`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Each filter has a **type** and may apply globally or to specific campaigns. Types:  | type          | meaning                          | toggleable | |---------------|----------------------------------|:----------:| | `domain_excl` | Block these domains              | yes | | `domain_incl` | Only allow these domains         | no | | `adzone_excl` | Block these ad zones             | yes | | `adzone_incl` | Only allow these ad zones        | no | | `isp_excl`    | Block these ISPs                 | yes | | `subid_excl`  | Block these SubIDs               | yes | | `subid_incl`  | Only allow these SubIDs          | no | | `publisher_excl` | Block every ad zone of these publishers, including zones they add later | yes | | `ip`          | IP-pool blocking                 | no |  Unpaginated: `{data, total_rows}`. 
     * List all filters across types.
     */
    async apiV1FiltersGetRaw(requestParameters: ApiV1FiltersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FiltersGet200Response>> {
        const requestOptions = await this.apiV1FiltersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FiltersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Each filter has a **type** and may apply globally or to specific campaigns. Types:  | type          | meaning                          | toggleable | |---------------|----------------------------------|:----------:| | `domain_excl` | Block these domains              | yes | | `domain_incl` | Only allow these domains         | no | | `adzone_excl` | Block these ad zones             | yes | | `adzone_incl` | Only allow these ad zones        | no | | `isp_excl`    | Block these ISPs                 | yes | | `subid_excl`  | Block these SubIDs               | yes | | `subid_incl`  | Only allow these SubIDs          | no | | `publisher_excl` | Block every ad zone of these publishers, including zones they add later | yes | | `ip`          | IP-pool blocking                 | no |  Unpaginated: `{data, total_rows}`. 
     * List all filters across types.
     */
    async apiV1FiltersGet(requestParameters: ApiV1FiltersGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FiltersGet200Response> {
        const response = await this.apiV1FiltersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FiltersIpIdRangesRangeIdDelete without sending the request
     */
    async apiV1FiltersIpIdRangesRangeIdDeleteRequestOpts(requestParameters: ApiV1FiltersIpIdRangesRangeIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersIpIdRangesRangeIdDelete().'
            );
        }

        if (requestParameters['rangeId'] == null) {
            throw new runtime.RequiredError(
                'rangeId',
                'Required parameter "rangeId" was null or undefined when calling apiV1FiltersIpIdRangesRangeIdDelete().'
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

        let urlPath = `/api/v1/filters/ip/{id}/ranges/{rangeId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"rangeId"}}`, encodeURIComponent(String(requestParameters['rangeId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Same as `DELETE /api/v1/filters/ip/{id}/items/{rangeId}`; the panel\'s own route.
     * Delete one range from an IP pool.
     */
    async apiV1FiltersIpIdRangesRangeIdDeleteRaw(requestParameters: ApiV1FiltersIpIdRangesRangeIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1FiltersIpIdRangesRangeIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Same as `DELETE /api/v1/filters/ip/{id}/items/{rangeId}`; the panel\'s own route.
     * Delete one range from an IP pool.
     */
    async apiV1FiltersIpIdRangesRangeIdDelete(requestParameters: ApiV1FiltersIpIdRangesRangeIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1FiltersIpIdRangesRangeIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1FiltersIpIdRangesRangeIdTogglePut without sending the request
     */
    async apiV1FiltersIpIdRangesRangeIdTogglePutRequestOpts(requestParameters: ApiV1FiltersIpIdRangesRangeIdTogglePutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersIpIdRangesRangeIdTogglePut().'
            );
        }

        if (requestParameters['rangeId'] == null) {
            throw new runtime.RequiredError(
                'rangeId',
                'Required parameter "rangeId" was null or undefined when calling apiV1FiltersIpIdRangesRangeIdTogglePut().'
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

        let urlPath = `/api/v1/filters/ip/{id}/ranges/{rangeId}/toggle`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"rangeId"}}`, encodeURIComponent(String(requestParameters['rangeId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Flips one range\'s active state (an inactive range stops matching). `rangeId` is `ranges[].id` from GET /api/v1/filters/ip/{id}. Same handler as the panel; logged on the pool\'s history.
     * Pause / resume one range of an IP pool.
     */
    async apiV1FiltersIpIdRangesRangeIdTogglePutRaw(requestParameters: ApiV1FiltersIpIdRangesRangeIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1FiltersIpIdRangesRangeIdTogglePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Flips one range\'s active state (an inactive range stops matching). `rangeId` is `ranges[].id` from GET /api/v1/filters/ip/{id}. Same handler as the panel; logged on the pool\'s history.
     * Pause / resume one range of an IP pool.
     */
    async apiV1FiltersIpIdRangesRangeIdTogglePut(requestParameters: ApiV1FiltersIpIdRangesRangeIdTogglePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1FiltersIpIdRangesRangeIdTogglePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1FiltersMassActionPost without sending the request
     */
    async apiV1FiltersMassActionPostRequestOpts(requestParameters: ApiV1FiltersMassActionPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1FiltersMassActionPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FiltersMassActionPostRequest',
                'Required parameter "apiV1FiltersMassActionPostRequest" was null or undefined when calling apiV1FiltersMassActionPost().'
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

        let urlPath = `/api/v1/filters/mass-action`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FiltersMassActionPostRequestToJSON(requestParameters['apiV1FiltersMassActionPostRequest']),
        };
    }

    /**
     * Each entry names a filter by `type` + `id` (as in `GET /filters`). `delete` runs the single-delete path for each (audit snapshot, IP list cascade, and campaigns linked to an allow-list / IP pool are unlinked). Activate / deactivate only applies to the types that have an on/off state; others are skipped. Filters that are not yours are skipped. `affected` counts what changed. 
     * Activate, deactivate or delete many filters.
     */
    async apiV1FiltersMassActionPostRaw(requestParameters: ApiV1FiltersMassActionPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1FiltersMassActionPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Each entry names a filter by `type` + `id` (as in `GET /filters`). `delete` runs the single-delete path for each (audit snapshot, IP list cascade, and campaigns linked to an allow-list / IP pool are unlinked). Activate / deactivate only applies to the types that have an on/off state; others are skipped. Filters that are not yours are skipped. `affected` counts what changed. 
     * Activate, deactivate or delete many filters.
     */
    async apiV1FiltersMassActionPost(requestParameters: ApiV1FiltersMassActionPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1FiltersMassActionPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1FiltersPost without sending the request
     */
    async apiV1FiltersPostRequestOpts(requestParameters: ApiV1FiltersPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1FiltersPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FiltersPostRequest',
                'Required parameter "apiV1FiltersPostRequest" was null or undefined when calling apiV1FiltersPost().'
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

        let urlPath = `/api/v1/filters`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FiltersPostRequestToJSON(requestParameters['apiV1FiltersPostRequest']),
        };
    }

    /**
     * Saved through the panel\'s own create path (same rows, campaign links and Action Log entries as the Filters page).  For `domain_excl` / `domain_incl`: items can be domain URLs (`\"https://evil.com/x\"`) — automatically resolved to internal domain IDs — or numeric domain IDs as strings. For `adzone_excl` / `adzone_incl` / `isp_excl`: items must be numeric IDs (find them with /api/v1/lookups/adzones and /api/v1/lookups/isps). For `publisher_excl`: publisher user ids (find them with /api/v1/lookups/publishers). Ids that are not a publisher on your network are dropped. For `subid_excl` / `subid_incl`: SubID strings (the encoded form when the account has SubID encoding on — stored decoded). For `ip`: ranges in `ip_list` (one per line: an IP, `a - b` or a CIDR) and/or `items`; `campaign_ids` is not accepted (link a pool from the campaign side).  **Campaign scope** (`campaign_ids`): * Block lists (`*_excl`) — `ad_type` 0 blocks across every campaign,   so campaign_ids needs `ad_type > 0` (422 otherwise). Each id must   be one of your live campaigns of that ad type and of   `campaign_type` (`ron` default; `rtb` for DSP campaigns; omitted   with `ad_type` 14 means rtb). Empty = every campaign of that ad   type. * Allow-lists (`*_incl`) — each id must be one of your live RON   campaigns; the filter becomes that campaign\'s allow-list   (replacing the one it had). Ids outside the key\'s campaign pin are a 403. 
     * Create a filter and populate it with items.
     */
    async apiV1FiltersPostRaw(requestParameters: ApiV1FiltersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FilterDetail>> {
        const requestOptions = await this.apiV1FiltersPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FilterDetailFromJSON(jsonValue));
    }

    /**
     * Saved through the panel\'s own create path (same rows, campaign links and Action Log entries as the Filters page).  For `domain_excl` / `domain_incl`: items can be domain URLs (`\"https://evil.com/x\"`) — automatically resolved to internal domain IDs — or numeric domain IDs as strings. For `adzone_excl` / `adzone_incl` / `isp_excl`: items must be numeric IDs (find them with /api/v1/lookups/adzones and /api/v1/lookups/isps). For `publisher_excl`: publisher user ids (find them with /api/v1/lookups/publishers). Ids that are not a publisher on your network are dropped. For `subid_excl` / `subid_incl`: SubID strings (the encoded form when the account has SubID encoding on — stored decoded). For `ip`: ranges in `ip_list` (one per line: an IP, `a - b` or a CIDR) and/or `items`; `campaign_ids` is not accepted (link a pool from the campaign side).  **Campaign scope** (`campaign_ids`): * Block lists (`*_excl`) — `ad_type` 0 blocks across every campaign,   so campaign_ids needs `ad_type > 0` (422 otherwise). Each id must   be one of your live campaigns of that ad type and of   `campaign_type` (`ron` default; `rtb` for DSP campaigns; omitted   with `ad_type` 14 means rtb). Empty = every campaign of that ad   type. * Allow-lists (`*_incl`) — each id must be one of your live RON   campaigns; the filter becomes that campaign\'s allow-list   (replacing the one it had). Ids outside the key\'s campaign pin are a 403. 
     * Create a filter and populate it with items.
     */
    async apiV1FiltersPost(requestParameters: ApiV1FiltersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FilterDetail> {
        const response = await this.apiV1FiltersPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FiltersTypeIdActivePatch without sending the request
     */
    async apiV1FiltersTypeIdActivePatchRequestOpts(requestParameters: ApiV1FiltersTypeIdActivePatchRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FiltersTypeIdActivePatch().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersTypeIdActivePatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdActivePatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdActivePatchRequest',
                'Required parameter "apiV1CampaignsTypeIdActivePatchRequest" was null or undefined when calling apiV1FiltersTypeIdActivePatch().'
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

        let urlPath = `/api/v1/filters/{type}/{id}/active`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdActivePatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdActivePatchRequest']),
        };
    }

    /**
     * Only `*_excl` filters have an active/inactive state. Inclusion filters and IP pools always apply when a campaign references them — disable by removing the reference instead. 
     * Activate or deactivate a filter (exclusion types only).
     */
    async apiV1FiltersTypeIdActivePatchRaw(requestParameters: ApiV1FiltersTypeIdActivePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FiltersTypeIdActivePatch200Response>> {
        const requestOptions = await this.apiV1FiltersTypeIdActivePatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FiltersTypeIdActivePatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Only `*_excl` filters have an active/inactive state. Inclusion filters and IP pools always apply when a campaign references them — disable by removing the reference instead. 
     * Activate or deactivate a filter (exclusion types only).
     */
    async apiV1FiltersTypeIdActivePatch(requestParameters: ApiV1FiltersTypeIdActivePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FiltersTypeIdActivePatch200Response> {
        const response = await this.apiV1FiltersTypeIdActivePatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FiltersTypeIdDelete without sending the request
     */
    async apiV1FiltersTypeIdDeleteRequestOpts(requestParameters: ApiV1FiltersTypeIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FiltersTypeIdDelete().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersTypeIdDelete().'
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

        let urlPath = `/api/v1/filters/{type}/{id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Campaigns that use the filter as their allow-list or IP pool are unlinked (set back to none), the same as deleting it in the panel. 
     * Delete a filter (and its items, for IP pools).
     */
    async apiV1FiltersTypeIdDeleteRaw(requestParameters: ApiV1FiltersTypeIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1FiltersTypeIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Campaigns that use the filter as their allow-list or IP pool are unlinked (set back to none), the same as deleting it in the panel. 
     * Delete a filter (and its items, for IP pools).
     */
    async apiV1FiltersTypeIdDelete(requestParameters: ApiV1FiltersTypeIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1FiltersTypeIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1FiltersTypeIdGet without sending the request
     */
    async apiV1FiltersTypeIdGetRequestOpts(requestParameters: ApiV1FiltersTypeIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FiltersTypeIdGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersTypeIdGet().'
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

        let urlPath = `/api/v1/filters/{type}/{id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get a single filter with its items.
     */
    async apiV1FiltersTypeIdGetRaw(requestParameters: ApiV1FiltersTypeIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FilterDetail>> {
        const requestOptions = await this.apiV1FiltersTypeIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FilterDetailFromJSON(jsonValue));
    }

    /**
     * Get a single filter with its items.
     */
    async apiV1FiltersTypeIdGet(requestParameters: ApiV1FiltersTypeIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FilterDetail> {
        const response = await this.apiV1FiltersTypeIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FiltersTypeIdItemsItemDelete without sending the request
     */
    async apiV1FiltersTypeIdItemsItemDeleteRequestOpts(requestParameters: ApiV1FiltersTypeIdItemsItemDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FiltersTypeIdItemsItemDelete().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersTypeIdItemsItemDelete().'
            );
        }

        if (requestParameters['item'] == null) {
            throw new runtime.RequiredError(
                'item',
                'Required parameter "item" was null or undefined when calling apiV1FiltersTypeIdItemsItemDelete().'
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

        let urlPath = `/api/v1/filters/{type}/{id}/items/{item}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"item"}}`, encodeURIComponent(String(requestParameters['item'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * `{item}` is the stored value — domain ID (or the hostname it was added with), adzone ID, ISP ID, or SubID string (encoded form when SubID encoding is on). For `ip` it is the range id (`ranges[].id`). URL-encode special characters.
     * Remove a single item from a filter.
     */
    async apiV1FiltersTypeIdItemsItemDeleteRaw(requestParameters: ApiV1FiltersTypeIdItemsItemDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FiltersTypeIdItemsItemDelete200Response>> {
        const requestOptions = await this.apiV1FiltersTypeIdItemsItemDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FiltersTypeIdItemsItemDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * `{item}` is the stored value — domain ID (or the hostname it was added with), adzone ID, ISP ID, or SubID string (encoded form when SubID encoding is on). For `ip` it is the range id (`ranges[].id`). URL-encode special characters.
     * Remove a single item from a filter.
     */
    async apiV1FiltersTypeIdItemsItemDelete(requestParameters: ApiV1FiltersTypeIdItemsItemDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FiltersTypeIdItemsItemDelete200Response> {
        const response = await this.apiV1FiltersTypeIdItemsItemDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FiltersTypeIdItemsPost without sending the request
     */
    async apiV1FiltersTypeIdItemsPostRequestOpts(requestParameters: ApiV1FiltersTypeIdItemsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FiltersTypeIdItemsPost().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersTypeIdItemsPost().'
            );
        }

        if (requestParameters['apiV1FiltersTypeIdItemsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FiltersTypeIdItemsPostRequest',
                'Required parameter "apiV1FiltersTypeIdItemsPostRequest" was null or undefined when calling apiV1FiltersTypeIdItemsPost().'
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

        let urlPath = `/api/v1/filters/{type}/{id}/items`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FiltersTypeIdItemsPostRequestToJSON(requestParameters['apiV1FiltersTypeIdItemsPostRequest']),
        };
    }

    /**
     * Same input format as creating a filter — domain URLs are auto-resolved to IDs for domain filters, numeric IDs required for adzone/ISP filters, SubID strings for SubID filters. Already-present items are deduplicated silently. For `ip` each item is one range line (IP, `a - b` or CIDR) and the answer is the pool\'s FilterDetail with `imported`. 
     * Add items to an existing filter.
     */
    async apiV1FiltersTypeIdItemsPostRaw(requestParameters: ApiV1FiltersTypeIdItemsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FiltersTypeIdItemsPost200Response>> {
        const requestOptions = await this.apiV1FiltersTypeIdItemsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FiltersTypeIdItemsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Same input format as creating a filter — domain URLs are auto-resolved to IDs for domain filters, numeric IDs required for adzone/ISP filters, SubID strings for SubID filters. Already-present items are deduplicated silently. For `ip` each item is one range line (IP, `a - b` or CIDR) and the answer is the pool\'s FilterDetail with `imported`. 
     * Add items to an existing filter.
     */
    async apiV1FiltersTypeIdItemsPost(requestParameters: ApiV1FiltersTypeIdItemsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FiltersTypeIdItemsPost200Response> {
        const response = await this.apiV1FiltersTypeIdItemsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FiltersTypeIdPut without sending the request
     */
    async apiV1FiltersTypeIdPutRequestOpts(requestParameters: ApiV1FiltersTypeIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FiltersTypeIdPut().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FiltersTypeIdPut().'
            );
        }

        if (requestParameters['apiV1FiltersTypeIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FiltersTypeIdPutRequest',
                'Required parameter "apiV1FiltersTypeIdPutRequest" was null or undefined when calling apiV1FiltersTypeIdPut().'
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

        let urlPath = `/api/v1/filters/{type}/{id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FiltersTypeIdPutRequestToJSON(requestParameters['apiV1FiltersTypeIdPutRequest']),
        };
    }

    /**
     * Partial edit: every field you leave out keeps its current value, then the filter is saved through the panel\'s own edit path (same rows, campaign links and Action Log entries as the Filters page).  * `items` **replaces** the whole item list (same input format as   create). To add or remove single items use the `/items` routes. * `campaign_ids` replaces the campaign scope and is validated like   on create (needs `ad_type > 0` on block lists; campaigns must be   yours, of that ad type, and of `campaign_type`). Sending `[]`   makes a block list cover every campaign of its ad type, and   unlinks every campaign from an allow-list. * `ad_type` / `campaign_type` re-validate the kept campaign list. * `type=ip`: `name`, `ip_list` (ranges to import, one per line) and   `replace_ip_ranges` (true = drop the existing ranges first) only. 
     * Edit a filter (rename, replace items, change scope).
     */
    async apiV1FiltersTypeIdPutRaw(requestParameters: ApiV1FiltersTypeIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FilterDetail>> {
        const requestOptions = await this.apiV1FiltersTypeIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FilterDetailFromJSON(jsonValue));
    }

    /**
     * Partial edit: every field you leave out keeps its current value, then the filter is saved through the panel\'s own edit path (same rows, campaign links and Action Log entries as the Filters page).  * `items` **replaces** the whole item list (same input format as   create). To add or remove single items use the `/items` routes. * `campaign_ids` replaces the campaign scope and is validated like   on create (needs `ad_type > 0` on block lists; campaigns must be   yours, of that ad type, and of `campaign_type`). Sending `[]`   makes a block list cover every campaign of its ad type, and   unlinks every campaign from an allow-list. * `ad_type` / `campaign_type` re-validate the kept campaign list. * `type=ip`: `name`, `ip_list` (ranges to import, one per line) and   `replace_ip_ranges` (true = drop the existing ranges first) only. 
     * Edit a filter (rename, replace items, change scope).
     */
    async apiV1FiltersTypeIdPut(requestParameters: ApiV1FiltersTypeIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FilterDetail> {
        const response = await this.apiV1FiltersTypeIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
