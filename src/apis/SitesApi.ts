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
  ApiV1DomainsIdNotesPutRequest,
  ApiV1DomainsPostRequest,
  ApiV1SitesGet200Response,
  ApiV1SitesIdClonePostRequest,
  ApiV1SitesSchemaGet200Response,
  Site,
  SiteCreate,
  SiteSnippetWrite,
} from '../models/index';
import {
    ApiV1DomainsIdNotesPutRequestFromJSON,
    ApiV1DomainsIdNotesPutRequestToJSON,
    ApiV1DomainsPostRequestFromJSON,
    ApiV1DomainsPostRequestToJSON,
    ApiV1SitesGet200ResponseFromJSON,
    ApiV1SitesGet200ResponseToJSON,
    ApiV1SitesIdClonePostRequestFromJSON,
    ApiV1SitesIdClonePostRequestToJSON,
    ApiV1SitesSchemaGet200ResponseFromJSON,
    ApiV1SitesSchemaGet200ResponseToJSON,
    SiteFromJSON,
    SiteToJSON,
    SiteCreateFromJSON,
    SiteCreateToJSON,
    SiteSnippetWriteFromJSON,
    SiteSnippetWriteToJSON,
} from '../models/index';

export interface ApiV1DomainsGetRequest {
    type?: ApiV1DomainsGetTypeEnum;
    state?: number;
    isactive?: ApiV1DomainsGetIsactiveEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1DomainsIdDeleteRequest {
    id: number;
}

export interface ApiV1DomainsIdGetRequest {
    id: number;
}

export interface ApiV1DomainsIdNotesPutOperationRequest {
    id: number;
    apiV1DomainsIdNotesPutRequest: ApiV1DomainsIdNotesPutRequest;
}

export interface ApiV1DomainsIdRedoPostRequest {
    id: number;
}

export interface ApiV1DomainsIdToggleActivePostRequest {
    id: number;
}

export interface ApiV1DomainsPostOperationRequest {
    apiV1DomainsPostRequest: ApiV1DomainsPostRequest;
}

export interface ApiV1SitesGetRequest {
    state?: ApiV1SitesGetStateEnum;
    sitestate?: ApiV1SitesGetSitestateEnum;
    search?: string;
    page?: number;
    perPage?: number;
}

export interface ApiV1SitesIdClonePostOperationRequest {
    id: number;
    apiV1SitesIdClonePostRequest: ApiV1SitesIdClonePostRequest;
}

export interface ApiV1SitesIdDeleteRequest {
    id: number;
}

export interface ApiV1SitesIdGetRequest {
    id: number;
}

export interface ApiV1SitesIdPatchRequest {
    id: number;
    requestBody: { [key: string]: any; };
}

export interface ApiV1SitesIdRecoverPostRequest {
    id: number;
}

export interface ApiV1SitesIdSnippetsGetRequest {
    id: number;
}

export interface ApiV1SitesIdSnippetsPostRequest {
    id: number;
    siteSnippetWrite: SiteSnippetWrite;
}

export interface ApiV1SitesIdSnippetsSnippetIdDeleteRequest {
    id: number;
    snippetId: number;
}

export interface ApiV1SitesIdSnippetsSnippetIdPutRequest {
    id: number;
    snippetId: number;
    siteSnippetWrite: SiteSnippetWrite;
}

export interface ApiV1SitesIdVerifyPostRequest {
    id: number;
}

export interface ApiV1SitesPostRequest {
    siteCreate: SiteCreate;
}

/**
 * 
 */
export class SitesApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1DomainsGet without sending the request
     */
    async apiV1DomainsGetRequestOpts(requestParameters: ApiV1DomainsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
        }

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state'];
        }

        if (requestParameters['isactive'] != null) {
            queryParameters['isactive'] = requestParameters['isactive'];
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

        let urlPath = `/api/v1/domains`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The domains you serve ads (`ads`), static files (`static`) or your branded panel (`up`) from. `dns_target` is the host an `ads`/`static` domain must CNAME to (your network\'s ad domain); `dns_target_up` the host an `up` domain must CNAME to. Paginated like every list (`page`, `per_page` ≤ 100); filters: `type`, `state`, `isactive`, `domain` (LIKE). 
     * List your custom domains (Domain Manager).
     */
    async apiV1DomainsGetRaw(requestParameters: ApiV1DomainsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The domains you serve ads (`ads`), static files (`static`) or your branded panel (`up`) from. `dns_target` is the host an `ads`/`static` domain must CNAME to (your network\'s ad domain); `dns_target_up` the host an `up` domain must CNAME to. Paginated like every list (`page`, `per_page` ≤ 100); filters: `type`, `state`, `isactive`, `domain` (LIKE). 
     * List your custom domains (Domain Manager).
     */
    async apiV1DomainsGet(requestParameters: ApiV1DomainsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1DomainsIdDelete without sending the request
     */
    async apiV1DomainsIdDeleteRequestOpts(requestParameters: ApiV1DomainsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1DomainsIdDelete().'
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

        let urlPath = `/api/v1/domains/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Refused with 409 `brand_in_use` while the domain is your branded panel domain.
     * Delete a custom domain.
     */
    async apiV1DomainsIdDeleteRaw(requestParameters: ApiV1DomainsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Refused with 409 `brand_in_use` while the domain is your branded panel domain.
     * Delete a custom domain.
     */
    async apiV1DomainsIdDelete(requestParameters: ApiV1DomainsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1DomainsIdGet without sending the request
     */
    async apiV1DomainsIdGetRequestOpts(requestParameters: ApiV1DomainsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1DomainsIdGet().'
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

        let urlPath = `/api/v1/domains/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Show one custom domain.
     */
    async apiV1DomainsIdGetRaw(requestParameters: ApiV1DomainsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Show one custom domain.
     */
    async apiV1DomainsIdGet(requestParameters: ApiV1DomainsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1DomainsIdNotesPut without sending the request
     */
    async apiV1DomainsIdNotesPutRequestOpts(requestParameters: ApiV1DomainsIdNotesPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1DomainsIdNotesPut().'
            );
        }

        if (requestParameters['apiV1DomainsIdNotesPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1DomainsIdNotesPutRequest',
                'Required parameter "apiV1DomainsIdNotesPutRequest" was null or undefined when calling apiV1DomainsIdNotesPut().'
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

        let urlPath = `/api/v1/domains/{id}/notes`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1DomainsIdNotesPutRequestToJSON(requestParameters['apiV1DomainsIdNotesPutRequest']),
        };
    }

    /**
     * Set your notes on a domain.
     */
    async apiV1DomainsIdNotesPutRaw(requestParameters: ApiV1DomainsIdNotesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsIdNotesPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set your notes on a domain.
     */
    async apiV1DomainsIdNotesPut(requestParameters: ApiV1DomainsIdNotesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsIdNotesPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1DomainsIdRedoPost without sending the request
     */
    async apiV1DomainsIdRedoPostRequestOpts(requestParameters: ApiV1DomainsIdRedoPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1DomainsIdRedoPost().'
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

        let urlPath = `/api/v1/domains/{id}/redo`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Retry setting up a domain (DNS / certificate check again).
     */
    async apiV1DomainsIdRedoPostRaw(requestParameters: ApiV1DomainsIdRedoPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsIdRedoPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Retry setting up a domain (DNS / certificate check again).
     */
    async apiV1DomainsIdRedoPost(requestParameters: ApiV1DomainsIdRedoPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsIdRedoPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1DomainsIdToggleActivePost without sending the request
     */
    async apiV1DomainsIdToggleActivePostRequestOpts(requestParameters: ApiV1DomainsIdToggleActivePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1DomainsIdToggleActivePost().'
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

        let urlPath = `/api/v1/domains/{id}/toggle-active`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Switch a custom domain on or off.
     */
    async apiV1DomainsIdToggleActivePostRaw(requestParameters: ApiV1DomainsIdToggleActivePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsIdToggleActivePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Switch a custom domain on or off.
     */
    async apiV1DomainsIdToggleActivePost(requestParameters: ApiV1DomainsIdToggleActivePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsIdToggleActivePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1DomainsPost without sending the request
     */
    async apiV1DomainsPostRequestOpts(requestParameters: ApiV1DomainsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1DomainsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1DomainsPostRequest',
                'Required parameter "apiV1DomainsPostRequest" was null or undefined when calling apiV1DomainsPost().'
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

        let urlPath = `/api/v1/domains`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1DomainsPostRequestToJSON(requestParameters['apiV1DomainsPostRequest']),
        };
    }

    /**
     * Create the CNAME first (see `dns_target` on GET /api/v1/domains), then add the domain. The server checks that it resolves and that it really reaches our servers before it is accepted; the certificate is then issued automatically and `state` moves on as it goes live. Errors (409): `invalid_domain`, `invalid_dns` (does not resolve), `invalid_dns_point` (resolves, but not to us yet — DNS can take a few hours), `domain_exists`. 
     * Add a custom domain.
     */
    async apiV1DomainsPostRaw(requestParameters: ApiV1DomainsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1DomainsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create the CNAME first (see `dns_target` on GET /api/v1/domains), then add the domain. The server checks that it resolves and that it really reaches our servers before it is accepted; the certificate is then issued automatically and `state` moves on as it goes live. Errors (409): `invalid_domain`, `invalid_dns` (does not resolve), `invalid_dns_point` (resolves, but not to us yet — DNS can take a few hours), `domain_exists`. 
     * Add a custom domain.
     */
    async apiV1DomainsPost(requestParameters: ApiV1DomainsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1DomainsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesGet without sending the request
     */
    async apiV1SitesGetRequestOpts(requestParameters: ApiV1SitesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state'];
        }

        if (requestParameters['sitestate'] != null) {
            queryParameters['sitestate'] = requestParameters['sitestate'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
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

        let urlPath = `/api/v1/sites`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Paged list (sorted by name). `state=deleted` lists soft-deleted sites so `POST /api/v1/sites/{id}/recover` has ids to work with. Per-site period stats (the panel\'s Websites listing stats columns) come from `GET /api/v1/publisher/stats?group_by=website&from=&to=`, keyed by site id; per-zone ones from `group_by=adzone`. 
     * List the caller\'s websites.
     */
    async apiV1SitesGetRaw(requestParameters: ApiV1SitesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1SitesGet200Response>> {
        const requestOptions = await this.apiV1SitesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1SitesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Paged list (sorted by name). `state=deleted` lists soft-deleted sites so `POST /api/v1/sites/{id}/recover` has ids to work with. Per-site period stats (the panel\'s Websites listing stats columns) come from `GET /api/v1/publisher/stats?group_by=website&from=&to=`, keyed by site id; per-zone ones from `group_by=adzone`. 
     * List the caller\'s websites.
     */
    async apiV1SitesGet(requestParameters: ApiV1SitesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1SitesGet200Response> {
        const response = await this.apiV1SitesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1SitesIdClonePost without sending the request
     */
    async apiV1SitesIdClonePostRequestOpts(requestParameters: ApiV1SitesIdClonePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdClonePost().'
            );
        }

        if (requestParameters['apiV1SitesIdClonePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1SitesIdClonePostRequest',
                'Required parameter "apiV1SitesIdClonePostRequest" was null or undefined when calling apiV1SitesIdClonePost().'
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

        let urlPath = `/api/v1/sites/{id}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1SitesIdClonePostRequestToJSON(requestParameters['apiV1SitesIdClonePostRequest']),
        };
    }

    /**
     * Creates a new site from this one (same settings) and copies its live ad zones onto it. The new URL goes through the same domain checks as `POST /api/v1/sites`. Keys pinned to `site_ids` / `adzone_ids` are refused (the copy could never be on the pin). 
     * Duplicate a site under a new name and URL, with its ad zones.
     */
    async apiV1SitesIdClonePostRaw(requestParameters: ApiV1SitesIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new site from this one (same settings) and copies its live ad zones onto it. The new URL goes through the same domain checks as `POST /api/v1/sites`. Keys pinned to `site_ids` / `adzone_ids` are refused (the copy could never be on the pin). 
     * Duplicate a site under a new name and URL, with its ad zones.
     */
    async apiV1SitesIdClonePost(requestParameters: ApiV1SitesIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdClonePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdDelete without sending the request
     */
    async apiV1SitesIdDeleteRequestOpts(requestParameters: ApiV1SitesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdDelete().'
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

        let urlPath = `/api/v1/sites/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sets `isdeleted = 1`. Refused with **422 `has_adzones`** while the site still has live ad zones — delete or move them first (`POST /api/v1/adspaces/mass-delete`). Undo with `POST /api/v1/sites/{id}/recover`. 
     * Soft-delete a site.
     */
    async apiV1SitesIdDeleteRaw(requestParameters: ApiV1SitesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets `isdeleted = 1`. Refused with **422 `has_adzones`** while the site still has live ad zones — delete or move them first (`POST /api/v1/adspaces/mass-delete`). Undo with `POST /api/v1/sites/{id}/recover`. 
     * Soft-delete a site.
     */
    async apiV1SitesIdDelete(requestParameters: ApiV1SitesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdGet without sending the request
     */
    async apiV1SitesIdGetRequestOpts(requestParameters: ApiV1SitesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdGet().'
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

        let urlPath = `/api/v1/sites/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get a single site.
     */
    async apiV1SitesIdGetRaw(requestParameters: ApiV1SitesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Site>> {
        const requestOptions = await this.apiV1SitesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SiteFromJSON(jsonValue));
    }

    /**
     * Get a single site.
     */
    async apiV1SitesIdGet(requestParameters: ApiV1SitesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Site> {
        const response = await this.apiV1SitesIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1SitesIdPatch without sending the request
     */
    async apiV1SitesIdPatchRequestOpts(requestParameters: ApiV1SitesIdPatchRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdPatch().'
            );
        }

        if (requestParameters['requestBody'] == null) {
            throw new runtime.RequiredError(
                'requestBody',
                'Required parameter "requestBody" was null or undefined when calling apiV1SitesIdPatch().'
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

        let urlPath = `/api/v1/sites/{id}`;
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
     * Update fields on an existing site. Send only the keys you want to change — omitted fields keep their current value. The `url` domain is re-validated when changed. A change of `url`, `categories` or `sitelanguages` puts a validated site back to pending review where the tenant reviews sites. `tags` (site groups) replaces the list; `[]` clears it. 
     * Update a site.
     */
    async apiV1SitesIdPatchRaw(requestParameters: ApiV1SitesIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update fields on an existing site. Send only the keys you want to change — omitted fields keep their current value. The `url` domain is re-validated when changed. A change of `url`, `categories` or `sitelanguages` puts a validated site back to pending review where the tenant reviews sites. `tags` (site groups) replaces the list; `[]` clears it. 
     * Update a site.
     */
    async apiV1SitesIdPatch(requestParameters: ApiV1SitesIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdPatchRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdRecoverPost without sending the request
     */
    async apiV1SitesIdRecoverPostRequestOpts(requestParameters: ApiV1SitesIdRecoverPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdRecoverPost().'
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

        let urlPath = `/api/v1/sites/{id}/recover`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sets `isdeleted = 0` so the site appears in listings again (the panel\'s Restore in the websites list\'s Deleted view). Returns 404 if the site doesn\'t exist, isn\'t currently soft-deleted, or was purged. 
     * Reverse a soft-delete on a site.
     */
    async apiV1SitesIdRecoverPostRaw(requestParameters: ApiV1SitesIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdRecoverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets `isdeleted = 0` so the site appears in listings again (the panel\'s Restore in the websites list\'s Deleted view). Returns 404 if the site doesn\'t exist, isn\'t currently soft-deleted, or was purged. 
     * Reverse a soft-delete on a site.
     */
    async apiV1SitesIdRecoverPost(requestParameters: ApiV1SitesIdRecoverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdRecoverPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdSnippetsGet without sending the request
     */
    async apiV1SitesIdSnippetsGetRequestOpts(requestParameters: ApiV1SitesIdSnippetsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdSnippetsGet().'
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

        let urlPath = `/api/v1/sites/{id}/snippets`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Managed `<meta>` / `<script>` / `<link>` / `<style>` tags injected through the site\'s one container tag (the panel\'s HTML snippets panel). Up to 100 per site. 
     * List the site\'s HTML snippets.
     */
    async apiV1SitesIdSnippetsGetRaw(requestParameters: ApiV1SitesIdSnippetsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdSnippetsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Managed `<meta>` / `<script>` / `<link>` / `<style>` tags injected through the site\'s one container tag (the panel\'s HTML snippets panel). Up to 100 per site. 
     * List the site\'s HTML snippets.
     */
    async apiV1SitesIdSnippetsGet(requestParameters: ApiV1SitesIdSnippetsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdSnippetsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdSnippetsPost without sending the request
     */
    async apiV1SitesIdSnippetsPostRequestOpts(requestParameters: ApiV1SitesIdSnippetsPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdSnippetsPost().'
            );
        }

        if (requestParameters['siteSnippetWrite'] == null) {
            throw new runtime.RequiredError(
                'siteSnippetWrite',
                'Required parameter "siteSnippetWrite" was null or undefined when calling apiV1SitesIdSnippetsPost().'
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

        let urlPath = `/api/v1/sites/{id}/snippets`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SiteSnippetWriteToJSON(requestParameters['siteSnippetWrite']),
        };
    }

    /**
     * Add an HTML snippet.
     */
    async apiV1SitesIdSnippetsPostRaw(requestParameters: ApiV1SitesIdSnippetsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdSnippetsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add an HTML snippet.
     */
    async apiV1SitesIdSnippetsPost(requestParameters: ApiV1SitesIdSnippetsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdSnippetsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdSnippetsSnippetIdDelete without sending the request
     */
    async apiV1SitesIdSnippetsSnippetIdDeleteRequestOpts(requestParameters: ApiV1SitesIdSnippetsSnippetIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdSnippetsSnippetIdDelete().'
            );
        }

        if (requestParameters['snippetId'] == null) {
            throw new runtime.RequiredError(
                'snippetId',
                'Required parameter "snippetId" was null or undefined when calling apiV1SitesIdSnippetsSnippetIdDelete().'
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

        let urlPath = `/api/v1/sites/{id}/snippets/{snippetId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"snippetId"}}`, encodeURIComponent(String(requestParameters['snippetId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete an HTML snippet.
     */
    async apiV1SitesIdSnippetsSnippetIdDeleteRaw(requestParameters: ApiV1SitesIdSnippetsSnippetIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdSnippetsSnippetIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an HTML snippet.
     */
    async apiV1SitesIdSnippetsSnippetIdDelete(requestParameters: ApiV1SitesIdSnippetsSnippetIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdSnippetsSnippetIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdSnippetsSnippetIdPut without sending the request
     */
    async apiV1SitesIdSnippetsSnippetIdPutRequestOpts(requestParameters: ApiV1SitesIdSnippetsSnippetIdPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdSnippetsSnippetIdPut().'
            );
        }

        if (requestParameters['snippetId'] == null) {
            throw new runtime.RequiredError(
                'snippetId',
                'Required parameter "snippetId" was null or undefined when calling apiV1SitesIdSnippetsSnippetIdPut().'
            );
        }

        if (requestParameters['siteSnippetWrite'] == null) {
            throw new runtime.RequiredError(
                'siteSnippetWrite',
                'Required parameter "siteSnippetWrite" was null or undefined when calling apiV1SitesIdSnippetsSnippetIdPut().'
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

        let urlPath = `/api/v1/sites/{id}/snippets/{snippetId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"snippetId"}}`, encodeURIComponent(String(requestParameters['snippetId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SiteSnippetWriteToJSON(requestParameters['siteSnippetWrite']),
        };
    }

    /**
     * Replace an HTML snippet.
     */
    async apiV1SitesIdSnippetsSnippetIdPutRaw(requestParameters: ApiV1SitesIdSnippetsSnippetIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdSnippetsSnippetIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Replace an HTML snippet.
     */
    async apiV1SitesIdSnippetsSnippetIdPut(requestParameters: ApiV1SitesIdSnippetsSnippetIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdSnippetsSnippetIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesIdVerifyPost without sending the request
     */
    async apiV1SitesIdVerifyPostRequestOpts(requestParameters: ApiV1SitesIdVerifyPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1SitesIdVerifyPost().'
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

        let urlPath = `/api/v1/sites/{id}/verify`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Tells the server to fetch the site URL and look for the verify meta tag the publisher embedded. On success the site flips to `is_verified=true` and can start serving ads.  The verify code + tag prefix are exposed on `GET /api/v1/sites/{id}` (`verify_code`, `verify_tag_prefix`, `verify_meta_tag`) — the publisher pastes the meta tag on the site root, then POSTs here.  Only meaningful when `modules.publisher.websites.options.need_verification` is on (otherwise the site is auto-verified at create time). 
     * Trigger HTTP re-check of the site verification meta tag.
     */
    async apiV1SitesIdVerifyPostRaw(requestParameters: ApiV1SitesIdVerifyPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesIdVerifyPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Tells the server to fetch the site URL and look for the verify meta tag the publisher embedded. On success the site flips to `is_verified=true` and can start serving ads.  The verify code + tag prefix are exposed on `GET /api/v1/sites/{id}` (`verify_code`, `verify_tag_prefix`, `verify_meta_tag`) — the publisher pastes the meta tag on the site root, then POSTs here.  Only meaningful when `modules.publisher.websites.options.need_verification` is on (otherwise the site is auto-verified at create time). 
     * Trigger HTTP re-check of the site verification meta tag.
     */
    async apiV1SitesIdVerifyPost(requestParameters: ApiV1SitesIdVerifyPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesIdVerifyPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesPost without sending the request
     */
    async apiV1SitesPostRequestOpts(requestParameters: ApiV1SitesPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['siteCreate'] == null) {
            throw new runtime.RequiredError(
                'siteCreate',
                'Required parameter "siteCreate" was null or undefined when calling apiV1SitesPost().'
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

        let urlPath = `/api/v1/sites`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SiteCreateToJSON(requestParameters['siteCreate']),
        };
    }

    /**
     * Create a website (publisher_sites row). Required: `name` + `url`. The domain in `url` is checked against the publisher-domain blocklist; subdomain duplicates of an existing site are rejected.  Module-gated fields become required when their module is active on the tenant — see `GET /api/v1/sites/_schema` for the exact field list applicable to this tenant.  On create, the server resolves the domain to a `domainid`. If `modules.publisher.websites.options.need_verification` is on, the new site starts at `is_verified=false` — the publisher must complete the dashboard verification flow before the site can serve ads.  API keys with `resource_filter.site_ids` set cannot create new sites — pinning to a fixed list is incompatible with adding new ones (returns 403). 
     * Create a new website.
     */
    async apiV1SitesPostRaw(requestParameters: ApiV1SitesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1SitesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a website (publisher_sites row). Required: `name` + `url`. The domain in `url` is checked against the publisher-domain blocklist; subdomain duplicates of an existing site are rejected.  Module-gated fields become required when their module is active on the tenant — see `GET /api/v1/sites/_schema` for the exact field list applicable to this tenant.  On create, the server resolves the domain to a `domainid`. If `modules.publisher.websites.options.need_verification` is on, the new site starts at `is_verified=false` — the publisher must complete the dashboard verification flow before the site can serve ads.  API keys with `resource_filter.site_ids` set cannot create new sites — pinning to a fixed list is incompatible with adding new ones (returns 403). 
     * Create a new website.
     */
    async apiV1SitesPost(requestParameters: ApiV1SitesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1SitesPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1SitesSchemaGet without sending the request
     */
    async apiV1SitesSchemaGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/sites/_schema`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the canonical field list for `POST /api/v1/sites` and `PATCH /api/v1/sites/{id}`. Module-gated fields (`typeid`, `categories`, `sitelanguages`, `postbacks`) only appear when the relevant module is active on the calling tenant. 
     * Field metadata for site create/update.
     */
    async apiV1SitesSchemaGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1SitesSchemaGet200Response>> {
        const requestOptions = await this.apiV1SitesSchemaGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1SitesSchemaGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the canonical field list for `POST /api/v1/sites` and `PATCH /api/v1/sites/{id}`. Module-gated fields (`typeid`, `categories`, `sitelanguages`, `postbacks`) only appear when the relevant module is active on the calling tenant. 
     * Field metadata for site create/update.
     */
    async apiV1SitesSchemaGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1SitesSchemaGet200Response> {
        const response = await this.apiV1SitesSchemaGetRaw(initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1DomainsGetTypeEnum = {
    Ads: 'ads',
    Static: 'static',
    Up: 'up'
} as const;
export type ApiV1DomainsGetTypeEnum = typeof ApiV1DomainsGetTypeEnum[keyof typeof ApiV1DomainsGetTypeEnum];
/**
 * @export
 */
export const ApiV1DomainsGetIsactiveEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1DomainsGetIsactiveEnum = typeof ApiV1DomainsGetIsactiveEnum[keyof typeof ApiV1DomainsGetIsactiveEnum];
/**
 * @export
 */
export const ApiV1SitesGetStateEnum = {
    Live: 'live',
    Deleted: 'deleted',
    All: 'all'
} as const;
export type ApiV1SitesGetStateEnum = typeof ApiV1SitesGetStateEnum[keyof typeof ApiV1SitesGetStateEnum];
/**
 * @export
 */
export const ApiV1SitesGetSitestateEnum = {
    NUMBER_MINUS_1: -1,
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1SitesGetSitestateEnum = typeof ApiV1SitesGetSitestateEnum[keyof typeof ApiV1SitesGetSitestateEnum];
