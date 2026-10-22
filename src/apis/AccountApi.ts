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
  ApiV1AccountGet200Response,
  ApiV1AccountPreferencesKeyPutRequest,
  ApiV1AccountUiLayoutsScopePutRequest,
  ApiV1TrackerTrackingLinksIdZoneCostsGet200Response,
  ApiV1WebhooksIdDelete200Response,
} from '../models/index';
import {
    ApiV1AccountGet200ResponseFromJSON,
    ApiV1AccountGet200ResponseToJSON,
    ApiV1AccountPreferencesKeyPutRequestFromJSON,
    ApiV1AccountPreferencesKeyPutRequestToJSON,
    ApiV1AccountUiLayoutsScopePutRequestFromJSON,
    ApiV1AccountUiLayoutsScopePutRequestToJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseToJSON,
    ApiV1WebhooksIdDelete200ResponseFromJSON,
    ApiV1WebhooksIdDelete200ResponseToJSON,
} from '../models/index';

export interface ApiV1AccountPreferencesKeyPutOperationRequest {
    key: string;
    apiV1AccountPreferencesKeyPutRequest: ApiV1AccountPreferencesKeyPutRequest;
}

export interface ApiV1AccountUiLayoutsScopeDeleteRequest {
    scope: string;
}

export interface ApiV1AccountUiLayoutsScopePutOperationRequest {
    scope: string;
    apiV1AccountUiLayoutsScopePutRequest: ApiV1AccountUiLayoutsScopePutRequest;
}

export interface ApiV1AccountUsageGetRequest {
    datestart?: Date;
    dateend?: Date;
    dateGroup?: ApiV1AccountUsageGetDateGroupEnum;
}

/**
 * 
 */
export class AccountApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1AccountFeaturesGet without sending the request
     */
    async apiV1AccountFeaturesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/features`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Which optional features the account has switched on. Read-only: turning one on changes what the account is billed for, so activation stays in the panel. 
     * Self-service features and their state.
     */
    async apiV1AccountFeaturesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountFeaturesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Which optional features the account has switched on. Read-only: turning one on changes what the account is billed for, so activation stays in the panel. 
     * Self-service features and their state.
     */
    async apiV1AccountFeaturesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountFeaturesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountGet without sending the request
     */
    async apiV1AccountGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Minimal identity payload. Use this to verify a key is alive, discover which user it belongs to, and inspect what scopes the key was granted. No PII beyond name/email/company.  Key management (create/list/revoke) is **not** exposed via the public API — it requires a browser session. Visit MyAccount → API access in the panel. 
     * Identity check — returns the authenticated user + scopes of the calling key.
     */
    async apiV1AccountGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1AccountGet200Response>> {
        const requestOptions = await this.apiV1AccountGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1AccountGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Minimal identity payload. Use this to verify a key is alive, discover which user it belongs to, and inspect what scopes the key was granted. No PII beyond name/email/company.  Key management (create/list/revoke) is **not** exposed via the public API — it requires a browser session. Visit MyAccount → API access in the panel. 
     * Identity check — returns the authenticated user + scopes of the calling key.
     */
    async apiV1AccountGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1AccountGet200Response> {
        const response = await this.apiV1AccountGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountMembershipsGet without sending the request
     */
    async apiV1AccountMembershipsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/memberships`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every account the authenticated user is an owner or member of, which of them is active, and the scopes the membership grants. An API key is pinned to one account, so this reports rather than switches — the panel\'s account switch is not on the public API. 
     * Accounts this login can act on.
     */
    async apiV1AccountMembershipsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountMembershipsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Every account the authenticated user is an owner or member of, which of them is active, and the scopes the membership grants. An API key is pinned to one account, so this reports rather than switches — the panel\'s account switch is not on the public API. 
     * Accounts this login can act on.
     */
    async apiV1AccountMembershipsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountMembershipsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountNoticesGet without sending the request
     */
    async apiV1AccountNoticesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/notices`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Standing notices about the account — verification still outstanding, a field awaiting review, a credential that needs attention. 
     * Account notices.
     */
    async apiV1AccountNoticesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountNoticesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Standing notices about the account — verification still outstanding, a field awaiting review, a credential that needs attention. 
     * Account notices.
     */
    async apiV1AccountNoticesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountNoticesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountPendingChangesGet without sending the request
     */
    async apiV1AccountPendingChangesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/pending-changes`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Changes submitted in the panel that are waiting on an emailed code. Read-only, and account-admin only — the same gate the panel applies. Cancelling or completing one is part of the verification flow and is not exposed here. 
     * Profile changes awaiting verification.
     */
    async apiV1AccountPendingChangesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountPendingChangesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Changes submitted in the panel that are waiting on an emailed code. Read-only, and account-admin only — the same gate the panel applies. Cancelling or completing one is part of the verification flow and is not exposed here. 
     * Profile changes awaiting verification.
     */
    async apiV1AccountPendingChangesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountPendingChangesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountPreferencesGet without sending the request
     */
    async apiV1AccountPreferencesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/preferences`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The key-value preferences this membership has set — the default dashboard and similar per-person choices. Scoped to the member, not the account. 
     * Per-member preferences.
     */
    async apiV1AccountPreferencesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountPreferencesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The key-value preferences this membership has set — the default dashboard and similar per-person choices. Scoped to the member, not the account. 
     * Per-member preferences.
     */
    async apiV1AccountPreferencesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountPreferencesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountPreferencesKeyPut without sending the request
     */
    async apiV1AccountPreferencesKeyPutRequestOpts(requestParameters: ApiV1AccountPreferencesKeyPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['key'] == null) {
            throw new runtime.RequiredError(
                'key',
                'Required parameter "key" was null or undefined when calling apiV1AccountPreferencesKeyPut().'
            );
        }

        if (requestParameters['apiV1AccountPreferencesKeyPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AccountPreferencesKeyPutRequest',
                'Required parameter "apiV1AccountPreferencesKeyPutRequest" was null or undefined when calling apiV1AccountPreferencesKeyPut().'
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

        let urlPath = `/api/v1/account/preferences/{key}`;
        urlPath = urlPath.replace(`{${"key"}}`, encodeURIComponent(String(requestParameters['key'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AccountPreferencesKeyPutRequestToJSON(requestParameters['apiV1AccountPreferencesKeyPutRequest']),
        };
    }

    /**
     * Upserts a single key. Values are opaque to the API. 
     * Set one preference.
     */
    async apiV1AccountPreferencesKeyPutRaw(requestParameters: ApiV1AccountPreferencesKeyPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdDelete200Response>> {
        const requestOptions = await this.apiV1AccountPreferencesKeyPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Upserts a single key. Values are opaque to the API. 
     * Set one preference.
     */
    async apiV1AccountPreferencesKeyPut(requestParameters: ApiV1AccountPreferencesKeyPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdDelete200Response> {
        const response = await this.apiV1AccountPreferencesKeyPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountProfileGet without sending the request
     */
    async apiV1AccountProfileGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/profile`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Name, company, address, language and contact fields. Read-only here — changing them goes through the panel\'s verification flow, which the public API deliberately does not expose. 
     * The account\'s contact and company details.
     */
    async apiV1AccountProfileGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountProfileGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Name, company, address, language and contact fields. Read-only here — changing them goes through the panel\'s verification flow, which the public API deliberately does not expose. 
     * The account\'s contact and company details.
     */
    async apiV1AccountProfileGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountProfileGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountSalesReferralsGet without sending the request
     */
    async apiV1AccountSalesReferralsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/sales-referrals`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * For an account the network marked as a sales man (sales-referral module). `data.is_active: false` when it is not. Otherwise `data` carries `pct` (your commission %), `referral_url` (your signup link: an account registered through it is assigned to you automatically), `clients[]` (`userid`, `name`, `company`, `assigned_at`, `deposits`, `commission`, `currency`), `commissions[]` (one per paid deposit: `deposit_id`, `client_id`, `name`, `company`, `paid_date`, `deposit`, `pct`, `commission`, `currency`) and `totals[]` per currency (`commission`, `commission_month`, `deposits`). Read-only; the network pays commission out itself. Same handler as the panel\'s Referrals tab. 
     * Your sales referrals — clients assigned to you, their deposits and your commission.
     */
    async apiV1AccountSalesReferralsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AccountSalesReferralsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * For an account the network marked as a sales man (sales-referral module). `data.is_active: false` when it is not. Otherwise `data` carries `pct` (your commission %), `referral_url` (your signup link: an account registered through it is assigned to you automatically), `clients[]` (`userid`, `name`, `company`, `assigned_at`, `deposits`, `commission`, `currency`), `commissions[]` (one per paid deposit: `deposit_id`, `client_id`, `name`, `company`, `paid_date`, `deposit`, `pct`, `commission`, `currency`) and `totals[]` per currency (`commission`, `commission_month`, `deposits`). Read-only; the network pays commission out itself. Same handler as the panel\'s Referrals tab. 
     * Your sales referrals — clients assigned to you, their deposits and your commission.
     */
    async apiV1AccountSalesReferralsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AccountSalesReferralsGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1AccountSettingsGet without sending the request
     */
    async apiV1AccountSettingsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/settings`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Currency, payout preferences, email opt-ins and the account\'s default tracking parameters. 
     * Account settings.
     */
    async apiV1AccountSettingsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountSettingsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Currency, payout preferences, email opt-ins and the account\'s default tracking parameters. 
     * Account settings.
     */
    async apiV1AccountSettingsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountSettingsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountUiLayoutsGet without sending the request
     */
    async apiV1AccountUiLayoutsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/ui-layouts`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the tenant\'s layout, this member\'s own overrides, and whether the caller may edit the tenant-wide one. See docs/UI_LAYOUT.md. 
     * Saved menu layouts.
     */
    async apiV1AccountUiLayoutsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountUiLayoutsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the tenant\'s layout, this member\'s own overrides, and whether the caller may edit the tenant-wide one. See docs/UI_LAYOUT.md. 
     * Saved menu layouts.
     */
    async apiV1AccountUiLayoutsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountUiLayoutsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountUiLayoutsScopeDelete without sending the request
     */
    async apiV1AccountUiLayoutsScopeDeleteRequestOpts(requestParameters: ApiV1AccountUiLayoutsScopeDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['scope'] == null) {
            throw new runtime.RequiredError(
                'scope',
                'Required parameter "scope" was null or undefined when calling apiV1AccountUiLayoutsScopeDelete().'
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

        let urlPath = `/api/v1/account/ui-layouts/{scope}`;
        urlPath = urlPath.replace(`{${"scope"}}`, encodeURIComponent(String(requestParameters['scope'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Drops the override so the scope falls back to the tenant default. 
     * Reset a menu layout.
     */
    async apiV1AccountUiLayoutsScopeDeleteRaw(requestParameters: ApiV1AccountUiLayoutsScopeDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdDelete200Response>> {
        const requestOptions = await this.apiV1AccountUiLayoutsScopeDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Drops the override so the scope falls back to the tenant default. 
     * Reset a menu layout.
     */
    async apiV1AccountUiLayoutsScopeDelete(requestParameters: ApiV1AccountUiLayoutsScopeDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdDelete200Response> {
        const response = await this.apiV1AccountUiLayoutsScopeDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountUiLayoutsScopePut without sending the request
     */
    async apiV1AccountUiLayoutsScopePutRequestOpts(requestParameters: ApiV1AccountUiLayoutsScopePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['scope'] == null) {
            throw new runtime.RequiredError(
                'scope',
                'Required parameter "scope" was null or undefined when calling apiV1AccountUiLayoutsScopePut().'
            );
        }

        if (requestParameters['apiV1AccountUiLayoutsScopePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AccountUiLayoutsScopePutRequest',
                'Required parameter "apiV1AccountUiLayoutsScopePutRequest" was null or undefined when calling apiV1AccountUiLayoutsScopePut().'
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

        let urlPath = `/api/v1/account/ui-layouts/{scope}`;
        urlPath = urlPath.replace(`{${"scope"}}`, encodeURIComponent(String(requestParameters['scope'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AccountUiLayoutsScopePutRequestToJSON(requestParameters['apiV1AccountUiLayoutsScopePutRequest']),
        };
    }

    /**
     * Writes the layout for one scope. Saving the tenant-wide layout needs the right the panel checks — `can_edit_tenant` in the read tells you whether this call will be accepted.  `scope` is a registry value, not free text: `nav.user` is the only one this API accepts. `nav.admin` exists in the same table but belongs to the admin panel, and the account API refuses it (400 `invalid_scope`) so a member cannot reach into the admin menu. 
     * Save a menu layout.
     */
    async apiV1AccountUiLayoutsScopePutRaw(requestParameters: ApiV1AccountUiLayoutsScopePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdDelete200Response>> {
        const requestOptions = await this.apiV1AccountUiLayoutsScopePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Writes the layout for one scope. Saving the tenant-wide layout needs the right the panel checks — `can_edit_tenant` in the read tells you whether this call will be accepted.  `scope` is a registry value, not free text: `nav.user` is the only one this API accepts. `nav.admin` exists in the same table but belongs to the admin panel, and the account API refuses it (400 `invalid_scope`) so a member cannot reach into the admin menu. 
     * Save a menu layout.
     */
    async apiV1AccountUiLayoutsScopePut(requestParameters: ApiV1AccountUiLayoutsScopePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdDelete200Response> {
        const response = await this.apiV1AccountUiLayoutsScopePutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountUsageGet without sending the request
     */
    async apiV1AccountUsageGetRequestOpts(requestParameters: ApiV1AccountUsageGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['datestart'] != null) {
            queryParameters['datestart'] = (requestParameters['datestart'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['dateend'] != null) {
            queryParameters['dateend'] = (requestParameters['dateend'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['dateGroup'] != null) {
            queryParameters['date_group'] = requestParameters['dateGroup'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/usage`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the account has consumed of the metered features it is billed for. 
     * Metered usage for a period.
     */
    async apiV1AccountUsageGetRaw(requestParameters: ApiV1AccountUsageGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountUsageGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * What the account has consumed of the metered features it is billed for. 
     * Metered usage for a period.
     */
    async apiV1AccountUsageGet(requestParameters: ApiV1AccountUsageGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountUsageGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1AccountUsageSummaryGet without sending the request
     */
    async apiV1AccountUsageSummaryGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/account/usage-summary`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Campaign, website and ad-zone counts plus which roles the account holds — the cheapest way to size an account before pulling its listings. 
     * Inventory counts at a glance.
     */
    async apiV1AccountUsageSummaryGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1AccountUsageSummaryGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Campaign, website and ad-zone counts plus which roles the account holds — the cheapest way to size an account before pulling its listings. 
     * Inventory counts at a glance.
     */
    async apiV1AccountUsageSummaryGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1AccountUsageSummaryGetRaw(initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1AccountUsageGetDateGroupEnum = {
    Day: 'day',
    Month: 'month',
    Year: 'year',
    Sum: 'sum'
} as const;
export type ApiV1AccountUsageGetDateGroupEnum = typeof ApiV1AccountUsageGetDateGroupEnum[keyof typeof ApiV1AccountUsageGetDateGroupEnum];
