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
  ApiPublicIntegrationsHooksTokenPost200Response,
  ApiPublicOauthIntrospectPost200Response,
  ApiPublicOauthTokenPost200Response,
} from '../models/index';
import {
    ApiPublicIntegrationsHooksTokenPost200ResponseFromJSON,
    ApiPublicIntegrationsHooksTokenPost200ResponseToJSON,
    ApiPublicOauthIntrospectPost200ResponseFromJSON,
    ApiPublicOauthIntrospectPost200ResponseToJSON,
    ApiPublicOauthTokenPost200ResponseFromJSON,
    ApiPublicOauthTokenPost200ResponseToJSON,
} from '../models/index';

export interface ApiPublicIntegrationsHooksTokenPostRequest {
    token: string;
    requestBody: { [key: string]: any; };
}

export interface ApiPublicOauthIntrospectPostRequest {
    token: string;
    clientId?: string;
    clientSecret?: string;
}

export interface ApiPublicOauthRevokePostRequest {
    token: string;
    clientId?: string;
    clientSecret?: string;
}

export interface ApiPublicOauthTokenPostRequest {
    grantType: ApiPublicOauthTokenPostGrantTypeEnum;
    code?: string;
    redirectUri?: string;
    codeVerifier?: string;
    refreshToken?: string;
    scope?: string;
    clientId?: string;
    clientSecret?: string;
}

/**
 * 
 */
export class OAuthApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiPublicIntegrationsHooksTokenPost without sending the request
     */
    async apiPublicIntegrationsHooksTokenPostRequestOpts(requestParameters: ApiPublicIntegrationsHooksTokenPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['token'] == null) {
            throw new runtime.RequiredError(
                'token',
                'Required parameter "token" was null or undefined when calling apiPublicIntegrationsHooksTokenPost().'
            );
        }

        if (requestParameters['requestBody'] == null) {
            throw new runtime.RequiredError(
                'requestBody',
                'Required parameter "requestBody" was null or undefined when calling apiPublicIntegrationsHooksTokenPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';


        let urlPath = `/api/public/integrations/hooks/{token}`;
        urlPath = urlPath.replace(`{${"token"}}`, encodeURIComponent(String(requestParameters['token'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['requestBody'],
        };
    }

    /**
     * The URL of an *Incoming webhook* connector (Admin → Integrations). The path token is the credential; a connector can additionally require `X-Integration-Signature: t=<unix>,v1=<hex HMAC-SHA256(secret, \"<t>.<body>\")>`. What the body becomes is the connector\'s field mapping. Max 64 KB. 
     * Incoming webhook — create a lead, contact or task from JSON.
     */
    async apiPublicIntegrationsHooksTokenPostRaw(requestParameters: ApiPublicIntegrationsHooksTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiPublicIntegrationsHooksTokenPost200Response>> {
        const requestOptions = await this.apiPublicIntegrationsHooksTokenPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiPublicIntegrationsHooksTokenPost200ResponseFromJSON(jsonValue));
    }

    /**
     * The URL of an *Incoming webhook* connector (Admin → Integrations). The path token is the credential; a connector can additionally require `X-Integration-Signature: t=<unix>,v1=<hex HMAC-SHA256(secret, \"<t>.<body>\")>`. What the body becomes is the connector\'s field mapping. Max 64 KB. 
     * Incoming webhook — create a lead, contact or task from JSON.
     */
    async apiPublicIntegrationsHooksTokenPost(requestParameters: ApiPublicIntegrationsHooksTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiPublicIntegrationsHooksTokenPost200Response> {
        const response = await this.apiPublicIntegrationsHooksTokenPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiPublicOauthIntrospectPost without sending the request
     */
    async apiPublicOauthIntrospectPostRequestOpts(requestParameters: ApiPublicOauthIntrospectPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['token'] == null) {
            throw new runtime.RequiredError(
                'token',
                'Required parameter "token" was null or undefined when calling apiPublicOauthIntrospectPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['token'] != null) {
            formParams.append('token', requestParameters['token'] as any);
        }

        if (requestParameters['clientId'] != null) {
            formParams.append('client_id', requestParameters['clientId'] as any);
        }

        if (requestParameters['clientSecret'] != null) {
            formParams.append('client_secret', requestParameters['clientSecret'] as any);
        }


        let urlPath = `/api/public/oauth/introspect`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * Introspect one of the calling app\'s tokens (RFC 7662).
     */
    async apiPublicOauthIntrospectPostRaw(requestParameters: ApiPublicOauthIntrospectPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiPublicOauthIntrospectPost200Response>> {
        const requestOptions = await this.apiPublicOauthIntrospectPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiPublicOauthIntrospectPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Introspect one of the calling app\'s tokens (RFC 7662).
     */
    async apiPublicOauthIntrospectPost(requestParameters: ApiPublicOauthIntrospectPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiPublicOauthIntrospectPost200Response> {
        const response = await this.apiPublicOauthIntrospectPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiPublicOauthMetadataGet without sending the request
     */
    async apiPublicOauthMetadataGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};


        let urlPath = `/api/public/oauth/metadata`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Authorization server metadata (RFC 8414) for this host.
     */
    async apiPublicOauthMetadataGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: any; }>> {
        const requestOptions = await this.apiPublicOauthMetadataGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Authorization server metadata (RFC 8414) for this host.
     */
    async apiPublicOauthMetadataGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: any; }> {
        const response = await this.apiPublicOauthMetadataGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiPublicOauthRevokePost without sending the request
     */
    async apiPublicOauthRevokePostRequestOpts(requestParameters: ApiPublicOauthRevokePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['token'] == null) {
            throw new runtime.RequiredError(
                'token',
                'Required parameter "token" was null or undefined when calling apiPublicOauthRevokePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['token'] != null) {
            formParams.append('token', requestParameters['token'] as any);
        }

        if (requestParameters['clientId'] != null) {
            formParams.append('client_id', requestParameters['clientId'] as any);
        }

        if (requestParameters['clientSecret'] != null) {
            formParams.append('client_secret', requestParameters['clientSecret'] as any);
        }


        let urlPath = `/api/public/oauth/revoke`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * Revoking a refresh token revokes every token of its authorization. Always 200 for an authenticated client.
     * Revoke an access or refresh token (RFC 7009).
     */
    async apiPublicOauthRevokePostRaw(requestParameters: ApiPublicOauthRevokePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiPublicOauthRevokePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Revoking a refresh token revokes every token of its authorization. Always 200 for an authenticated client.
     * Revoke an access or refresh token (RFC 7009).
     */
    async apiPublicOauthRevokePost(requestParameters: ApiPublicOauthRevokePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiPublicOauthRevokePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiPublicOauthTokenPost without sending the request
     */
    async apiPublicOauthTokenPostRequestOpts(requestParameters: ApiPublicOauthTokenPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['grantType'] == null) {
            throw new runtime.RequiredError(
                'grantType',
                'Required parameter "grantType" was null or undefined when calling apiPublicOauthTokenPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['grantType'] != null) {
            formParams.append('grant_type', requestParameters['grantType'] as any);
        }

        if (requestParameters['code'] != null) {
            formParams.append('code', requestParameters['code'] as any);
        }

        if (requestParameters['redirectUri'] != null) {
            formParams.append('redirect_uri', requestParameters['redirectUri'] as any);
        }

        if (requestParameters['codeVerifier'] != null) {
            formParams.append('code_verifier', requestParameters['codeVerifier'] as any);
        }

        if (requestParameters['refreshToken'] != null) {
            formParams.append('refresh_token', requestParameters['refreshToken'] as any);
        }

        if (requestParameters['scope'] != null) {
            formParams.append('scope', requestParameters['scope'] as any);
        }

        if (requestParameters['clientId'] != null) {
            formParams.append('client_id', requestParameters['clientId'] as any);
        }

        if (requestParameters['clientSecret'] != null) {
            formParams.append('client_secret', requestParameters['clientSecret'] as any);
        }


        let urlPath = `/api/public/oauth/token`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * `grant_type=authorization_code` needs `code`, `redirect_uri` (exactly as sent to `/oauth/authorize`) and `code_verifier`. `grant_type=refresh_token` needs `refresh_token` and may narrow with `scope`; the presented refresh token is spent and a new one returned — presenting a spent one again revokes every token of that authorization. Confidential apps authenticate with HTTP Basic (`client_id:client_secret`) or `client_id` + `client_secret` in the body; public apps send `client_id` only. 
     * Exchange an authorization code, or rotate a refresh token.
     */
    async apiPublicOauthTokenPostRaw(requestParameters: ApiPublicOauthTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiPublicOauthTokenPost200Response>> {
        const requestOptions = await this.apiPublicOauthTokenPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiPublicOauthTokenPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `grant_type=authorization_code` needs `code`, `redirect_uri` (exactly as sent to `/oauth/authorize`) and `code_verifier`. `grant_type=refresh_token` needs `refresh_token` and may narrow with `scope`; the presented refresh token is spent and a new one returned — presenting a spent one again revokes every token of that authorization. Confidential apps authenticate with HTTP Basic (`client_id:client_secret`) or `client_id` + `client_secret` in the body; public apps send `client_id` only. 
     * Exchange an authorization code, or rotate a refresh token.
     */
    async apiPublicOauthTokenPost(requestParameters: ApiPublicOauthTokenPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiPublicOauthTokenPost200Response> {
        const response = await this.apiPublicOauthTokenPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiPublicOauthTokenPostGrantTypeEnum = {
    AuthorizationCode: 'authorization_code',
    RefreshToken: 'refresh_token'
} as const;
export type ApiPublicOauthTokenPostGrantTypeEnum = typeof ApiPublicOauthTokenPostGrantTypeEnum[keyof typeof ApiPublicOauthTokenPostGrantTypeEnum];
