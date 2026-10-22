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
  ApiV1TrackerSourceAccountsGet200Response,
  ApiV1TrackerSourceAccountsIdGet200Response,
  ApiV1TrackerSourceAccountsIdPutRequest,
  ApiV1TrackerSourceAccountsPostRequest,
  ApiV1TrackerSourcesGet200Response,
  ApiV1TrackerSourcesIdPutRequest,
  ApiV1TrackerSourcesPostRequest,
  ApiV1TrackerTrackingLinksIdZoneCostsGet200Response,
} from '../models/index';
import {
    ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseToJSON,
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1TrackerSourceAccountsGet200ResponseFromJSON,
    ApiV1TrackerSourceAccountsGet200ResponseToJSON,
    ApiV1TrackerSourceAccountsIdGet200ResponseFromJSON,
    ApiV1TrackerSourceAccountsIdGet200ResponseToJSON,
    ApiV1TrackerSourceAccountsIdPutRequestFromJSON,
    ApiV1TrackerSourceAccountsIdPutRequestToJSON,
    ApiV1TrackerSourceAccountsPostRequestFromJSON,
    ApiV1TrackerSourceAccountsPostRequestToJSON,
    ApiV1TrackerSourcesGet200ResponseFromJSON,
    ApiV1TrackerSourcesGet200ResponseToJSON,
    ApiV1TrackerSourcesIdPutRequestFromJSON,
    ApiV1TrackerSourcesIdPutRequestToJSON,
    ApiV1TrackerSourcesPostRequestFromJSON,
    ApiV1TrackerSourcesPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1TrackerSourceAccountsIdCampaignsGetRequest {
    id: number;
}

export interface ApiV1TrackerSourceAccountsIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerSourceAccountsIdGetRequest {
    id: number;
}

export interface ApiV1TrackerSourceAccountsIdPutOperationRequest {
    id: number;
    apiV1TrackerSourceAccountsIdPutRequest: ApiV1TrackerSourceAccountsIdPutRequest;
}

export interface ApiV1TrackerSourceAccountsIdSyncPostRequest {
    id: number;
}

export interface ApiV1TrackerSourceAccountsPostOperationRequest {
    apiV1TrackerSourceAccountsPostRequest: ApiV1TrackerSourceAccountsPostRequest;
}

export interface ApiV1TrackerSourcesIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerSourcesIdPutOperationRequest {
    id: number;
    apiV1TrackerSourcesIdPutRequest: ApiV1TrackerSourcesIdPutRequest;
}

export interface ApiV1TrackerSourcesPostOperationRequest {
    apiV1TrackerSourcesPostRequest: ApiV1TrackerSourcesPostRequest;
}

export interface ApiV1TrackerSourcesSiteidCampaignsGetRequest {
    siteid: number;
}

/**
 * 
 */
export class TrackerSourcesApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackerCostDriversGet without sending the request
     */
    async apiV1TrackerCostDriversGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/cost-drivers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The traffic-source APIs this build can pull spend from, and which are actually implemented — the valid values for `driver` above. 
     * List available cost drivers.
     */
    async apiV1TrackerCostDriversGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerCostDriversGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The traffic-source APIs this build can pull spend from, and which are actually implemented — the valid values for `driver` above. 
     * List available cost drivers.
     */
    async apiV1TrackerCostDriversGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerCostDriversGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsGet without sending the request
     */
    async apiV1TrackerSourceAccountsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/source-accounts`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The credentialed ad accounts a scheduler pulls spend from, each with the outcome of its last sync. Credentials are never returned. 
     * List connected ad accounts.
     */
    async apiV1TrackerSourceAccountsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerSourceAccountsGet200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerSourceAccountsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The credentialed ad accounts a scheduler pulls spend from, each with the outcome of its last sync. Credentials are never returned. 
     * List connected ad accounts.
     */
    async apiV1TrackerSourceAccountsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerSourceAccountsGet200Response> {
        const response = await this.apiV1TrackerSourceAccountsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsIdCampaignsGet without sending the request
     */
    async apiV1TrackerSourceAccountsIdCampaignsGetRequestOpts(requestParameters: ApiV1TrackerSourceAccountsIdCampaignsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourceAccountsIdCampaignsGet().'
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

        let urlPath = `/api/v1/tracker/source-accounts/{id}/campaigns`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Used to bind a tracking link to a campaign on the buying side. 
     * Campaigns visible in a connected ad account.
     */
    async apiV1TrackerSourceAccountsIdCampaignsGetRaw(requestParameters: ApiV1TrackerSourceAccountsIdCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsIdCampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Used to bind a tracking link to a campaign on the buying side. 
     * Campaigns visible in a connected ad account.
     */
    async apiV1TrackerSourceAccountsIdCampaignsGet(requestParameters: ApiV1TrackerSourceAccountsIdCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerSourceAccountsIdCampaignsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsIdDelete without sending the request
     */
    async apiV1TrackerSourceAccountsIdDeleteRequestOpts(requestParameters: ApiV1TrackerSourceAccountsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourceAccountsIdDelete().'
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

        let urlPath = `/api/v1/tracker/source-accounts/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Stops the spend pull. Already-imported cost stays. 
     * Disconnect an ad account.
     */
    async apiV1TrackerSourceAccountsIdDeleteRaw(requestParameters: ApiV1TrackerSourceAccountsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Stops the spend pull. Already-imported cost stays. 
     * Disconnect an ad account.
     */
    async apiV1TrackerSourceAccountsIdDelete(requestParameters: ApiV1TrackerSourceAccountsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerSourceAccountsIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsIdGet without sending the request
     */
    async apiV1TrackerSourceAccountsIdGetRequestOpts(requestParameters: ApiV1TrackerSourceAccountsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourceAccountsIdGet().'
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

        let urlPath = `/api/v1/tracker/source-accounts/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Credentials are omitted. 
     * Get one connected ad account.
     */
    async apiV1TrackerSourceAccountsIdGetRaw(requestParameters: ApiV1TrackerSourceAccountsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerSourceAccountsIdGet200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerSourceAccountsIdGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Credentials are omitted. 
     * Get one connected ad account.
     */
    async apiV1TrackerSourceAccountsIdGet(requestParameters: ApiV1TrackerSourceAccountsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerSourceAccountsIdGet200Response> {
        const response = await this.apiV1TrackerSourceAccountsIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsIdPut without sending the request
     */
    async apiV1TrackerSourceAccountsIdPutRequestOpts(requestParameters: ApiV1TrackerSourceAccountsIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourceAccountsIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerSourceAccountsIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerSourceAccountsIdPutRequest',
                'Required parameter "apiV1TrackerSourceAccountsIdPutRequest" was null or undefined when calling apiV1TrackerSourceAccountsIdPut().'
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

        let urlPath = `/api/v1/tracker/source-accounts/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerSourceAccountsIdPutRequestToJSON(requestParameters['apiV1TrackerSourceAccountsIdPutRequest']),
        };
    }

    /**
     * Omit `credentials` to leave the stored secrets untouched. 
     * Update a connected ad account.
     */
    async apiV1TrackerSourceAccountsIdPutRaw(requestParameters: ApiV1TrackerSourceAccountsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Omit `credentials` to leave the stored secrets untouched. 
     * Update a connected ad account.
     */
    async apiV1TrackerSourceAccountsIdPut(requestParameters: ApiV1TrackerSourceAccountsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerSourceAccountsIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsIdSyncPost without sending the request
     */
    async apiV1TrackerSourceAccountsIdSyncPostRequestOpts(requestParameters: ApiV1TrackerSourceAccountsIdSyncPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourceAccountsIdSyncPost().'
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

        let urlPath = `/api/v1/tracker/source-accounts/{id}/sync`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Runs the driver immediately instead of waiting for the daily schedule. Returns what the run imported, or the driver\'s error. 
     * Pull spend from a connected ad account now.
     */
    async apiV1TrackerSourceAccountsIdSyncPostRaw(requestParameters: ApiV1TrackerSourceAccountsIdSyncPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsIdSyncPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Runs the driver immediately instead of waiting for the daily schedule. Returns what the run imported, or the driver\'s error. 
     * Pull spend from a connected ad account now.
     */
    async apiV1TrackerSourceAccountsIdSyncPost(requestParameters: ApiV1TrackerSourceAccountsIdSyncPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerSourceAccountsIdSyncPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourceAccountsPost without sending the request
     */
    async apiV1TrackerSourceAccountsPostRequestOpts(requestParameters: ApiV1TrackerSourceAccountsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerSourceAccountsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerSourceAccountsPostRequest',
                'Required parameter "apiV1TrackerSourceAccountsPostRequest" was null or undefined when calling apiV1TrackerSourceAccountsPost().'
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

        let urlPath = `/api/v1/tracker/source-accounts`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerSourceAccountsPostRequestToJSON(requestParameters['apiV1TrackerSourceAccountsPostRequest']),
        };
    }

    /**
     * `driver` names the traffic source\'s API (see /cost-drivers). `credentials` is encrypted at rest and never read back. 
     * Connect an ad account.
     */
    async apiV1TrackerSourceAccountsPostRaw(requestParameters: ApiV1TrackerSourceAccountsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerSourceAccountsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `driver` names the traffic source\'s API (see /cost-drivers). `credentials` is encrypted at rest and never read back. 
     * Connect an ad account.
     */
    async apiV1TrackerSourceAccountsPost(requestParameters: ApiV1TrackerSourceAccountsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerSourceAccountsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourcesGet without sending the request
     */
    async apiV1TrackerSourcesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/sources`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One row per traffic origin (an ad account, a network). A source carries the macro template its click URLs are built from and its own outbound postback configuration, and is the unit member access is delegated by. 
     * List traffic sources.
     */
    async apiV1TrackerSourcesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerSourcesGet200Response>> {
        const requestOptions = await this.apiV1TrackerSourcesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerSourcesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * One row per traffic origin (an ad account, a network). A source carries the macro template its click URLs are built from and its own outbound postback configuration, and is the unit member access is delegated by. 
     * List traffic sources.
     */
    async apiV1TrackerSourcesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerSourcesGet200Response> {
        const response = await this.apiV1TrackerSourcesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourcesIdDelete without sending the request
     */
    async apiV1TrackerSourcesIdDeleteRequestOpts(requestParameters: ApiV1TrackerSourcesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourcesIdDelete().'
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

        let urlPath = `/api/v1/tracker/sources/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Refused while live tracking links still hang off the source — they would orphan. Delete or move the links first. 
     * Delete a traffic source.
     */
    async apiV1TrackerSourcesIdDeleteRaw(requestParameters: ApiV1TrackerSourcesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerSourcesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Refused while live tracking links still hang off the source — they would orphan. Delete or move the links first. 
     * Delete a traffic source.
     */
    async apiV1TrackerSourcesIdDelete(requestParameters: ApiV1TrackerSourcesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerSourcesIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourcesIdPut without sending the request
     */
    async apiV1TrackerSourcesIdPutRequestOpts(requestParameters: ApiV1TrackerSourcesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerSourcesIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerSourcesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerSourcesIdPutRequest',
                'Required parameter "apiV1TrackerSourcesIdPutRequest" was null or undefined when calling apiV1TrackerSourcesIdPut().'
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

        let urlPath = `/api/v1/tracker/sources/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerSourcesIdPutRequestToJSON(requestParameters['apiV1TrackerSourcesIdPutRequest']),
        };
    }

    /**
     * Partial update. 
     * Update a traffic source.
     */
    async apiV1TrackerSourcesIdPutRaw(requestParameters: ApiV1TrackerSourcesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerSourcesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update. 
     * Update a traffic source.
     */
    async apiV1TrackerSourcesIdPut(requestParameters: ApiV1TrackerSourcesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerSourcesIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourcesPost without sending the request
     */
    async apiV1TrackerSourcesPostRequestOpts(requestParameters: ApiV1TrackerSourcesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerSourcesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerSourcesPostRequest',
                'Required parameter "apiV1TrackerSourcesPostRequest" was null or undefined when calling apiV1TrackerSourcesPost().'
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

        let urlPath = `/api/v1/tracker/sources`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerSourcesPostRequestToJSON(requestParameters['apiV1TrackerSourcesPostRequest']),
        };
    }

    /**
     * `template_slug` picks the macro set (see /source-templates); it decides which placeholders the generated click URLs carry. 
     * Create a traffic source.
     */
    async apiV1TrackerSourcesPostRaw(requestParameters: ApiV1TrackerSourcesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerSourcesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `template_slug` picks the macro set (see /source-templates); it decides which placeholders the generated click URLs carry. 
     * Create a traffic source.
     */
    async apiV1TrackerSourcesPost(requestParameters: ApiV1TrackerSourcesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerSourcesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerSourcesSiteidCampaignsGet without sending the request
     */
    async apiV1TrackerSourcesSiteidCampaignsGetRequestOpts(requestParameters: ApiV1TrackerSourcesSiteidCampaignsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['siteid'] == null) {
            throw new runtime.RequiredError(
                'siteid',
                'Required parameter "siteid" was null or undefined when calling apiV1TrackerSourcesSiteidCampaignsGet().'
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

        let urlPath = `/api/v1/tracker/sources/{siteid}/campaigns`;
        urlPath = urlPath.replace(`{${"siteid"}}`, encodeURIComponent(String(requestParameters['siteid'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the buying side calls its campaigns, for binding tracking links to. 
     * Campaigns reported by a source\'s connected ad account.
     */
    async apiV1TrackerSourcesSiteidCampaignsGetRaw(requestParameters: ApiV1TrackerSourcesSiteidCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerSourcesSiteidCampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * What the buying side calls its campaigns, for binding tracking links to. 
     * Campaigns reported by a source\'s connected ad account.
     */
    async apiV1TrackerSourcesSiteidCampaignsGet(requestParameters: ApiV1TrackerSourcesSiteidCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerSourcesSiteidCampaignsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
