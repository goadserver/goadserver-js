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
  ApiV1AdShopCartPostRequest,
  ApiV1AdShopConfirmPostRequest,
  ApiV1AdShopGroupSummaryPostRequest,
} from '../models/index';
import {
    ApiV1AdShopCartPostRequestFromJSON,
    ApiV1AdShopCartPostRequestToJSON,
    ApiV1AdShopConfirmPostRequestFromJSON,
    ApiV1AdShopConfirmPostRequestToJSON,
    ApiV1AdShopGroupSummaryPostRequestFromJSON,
    ApiV1AdShopGroupSummaryPostRequestToJSON,
} from '../models/index';

export interface ApiV1AdShopCartPostOperationRequest {
    apiV1AdShopCartPostRequest: ApiV1AdShopCartPostRequest;
}

export interface ApiV1AdShopConfirmPostOperationRequest {
    apiV1AdShopConfirmPostRequest: ApiV1AdShopConfirmPostRequest;
}

export interface ApiV1AdShopGroupSummaryPostOperationRequest {
    apiV1AdShopGroupSummaryPostRequest: ApiV1AdShopGroupSummaryPostRequest;
}

export interface ApiV1AdShopOpportunitiesGetRequest {
    formats?: Array<number>;
    payTypes?: Array<number>;
    categories?: Array<number>;
    devices?: Array<number>;
    countries?: Array<string>;
    search?: string;
    sort?: ApiV1AdShopOpportunitiesGetSortEnum;
    direction?: ApiV1AdShopOpportunitiesGetDirectionEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1AdShopPlanGetRequest {
    flatStart?: Date;
    flatEnd?: Date;
}

/**
 * 
 */
export class AdShopApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1AdShopCartGet without sending the request
     */
    async apiV1AdShopCartGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-shop/cart`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The current draft cart of the person acting (one for the account owner, and a separate one for each team member, so nobody confirms items someone else picked). Same handler as the panel.
     * Read the draft cart.
     */
    async apiV1AdShopCartGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopCartGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The current draft cart of the person acting (one for the account owner, and a separate one for each team member, so nobody confirms items someone else picked). Same handler as the panel.
     * Read the draft cart.
     */
    async apiV1AdShopCartGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopCartGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1AdShopCartPost without sending the request
     */
    async apiV1AdShopCartPostRequestOpts(requestParameters: ApiV1AdShopCartPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdShopCartPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdShopCartPostRequest',
                'Required parameter "apiV1AdShopCartPostRequest" was null or undefined when calling apiV1AdShopCartPost().'
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

        let urlPath = `/api/v1/ad-shop/cart`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdShopCartPostRequestToJSON(requestParameters['apiV1AdShopCartPostRequest']),
        };
    }

    /**
     * Stores the full list of picked opportunity ids for a snapshot (replaces, not appends). Same handler as the panel.
     * Replace the draft cart.
     */
    async apiV1AdShopCartPostRaw(requestParameters: ApiV1AdShopCartPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopCartPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Stores the full list of picked opportunity ids for a snapshot (replaces, not appends). Same handler as the panel.
     * Replace the draft cart.
     */
    async apiV1AdShopCartPost(requestParameters: ApiV1AdShopCartPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopCartPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdShopConfirmPost without sending the request
     */
    async apiV1AdShopConfirmPostRequestOpts(requestParameters: ApiV1AdShopConfirmPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdShopConfirmPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdShopConfirmPostRequest',
                'Required parameter "apiV1AdShopConfirmPostRequest" was null or undefined when calling apiV1AdShopConfirmPost().'
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

        let urlPath = `/api/v1/ad-shop/confirm`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdShopConfirmPostRequestToJSON(requestParameters['apiV1AdShopConfirmPostRequest']),
        };
    }

    /**
     * Creates the RON campaigns of the plan (live and able to spend once they have ads) and records an order. `idempotency_key` is required: a retry with the same key returns the first order (`reused: true`) instead of buying twice; keys are per account. Lines that need manual sourcing go to the network\'s fulfilment queue and the admins are alerted. With a flat window, a zone already booked in it fails the whole order (422). Keys pinned to campaigns cannot confirm (403): the new campaigns would be outside the pin. A team member with read-only campaign access gets 403 `forbidden` (also on `POST /api/v1/ad-shop/cart`). The campaigns are recorded as created by, and managed by, whoever confirms, so a team member limited to their own campaigns can open them afterwards. Same handler as the panel. 
     * Check out the cart — creates the campaigns.
     */
    async apiV1AdShopConfirmPostRaw(requestParameters: ApiV1AdShopConfirmPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopConfirmPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates the RON campaigns of the plan (live and able to spend once they have ads) and records an order. `idempotency_key` is required: a retry with the same key returns the first order (`reused: true`) instead of buying twice; keys are per account. Lines that need manual sourcing go to the network\'s fulfilment queue and the admins are alerted. With a flat window, a zone already booked in it fails the whole order (422). Keys pinned to campaigns cannot confirm (403): the new campaigns would be outside the pin. A team member with read-only campaign access gets 403 `forbidden` (also on `POST /api/v1/ad-shop/cart`). The campaigns are recorded as created by, and managed by, whoever confirms, so a team member limited to their own campaigns can open them afterwards. Same handler as the panel. 
     * Check out the cart — creates the campaigns.
     */
    async apiV1AdShopConfirmPost(requestParameters: ApiV1AdShopConfirmPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopConfirmPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdShopFilterOptionsGet without sending the request
     */
    async apiV1AdShopFilterOptionsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-shop/filter-options`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Formats, pay types, countries, devices and categories that occur in the latest snapshot. Same handler as the panel.
     * Filter values present in the current snapshot.
     */
    async apiV1AdShopFilterOptionsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopFilterOptionsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Formats, pay types, countries, devices and categories that occur in the latest snapshot. Same handler as the panel.
     * Filter values present in the current snapshot.
     */
    async apiV1AdShopFilterOptionsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopFilterOptionsGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1AdShopGroupSummaryPost without sending the request
     */
    async apiV1AdShopGroupSummaryPostRequestOpts(requestParameters: ApiV1AdShopGroupSummaryPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1AdShopGroupSummaryPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdShopGroupSummaryPostRequest',
                'Required parameter "apiV1AdShopGroupSummaryPostRequest" was null or undefined when calling apiV1AdShopGroupSummaryPost().'
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

        let urlPath = `/api/v1/ad-shop/group-summary`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdShopGroupSummaryPostRequestToJSON(requestParameters['apiV1AdShopGroupSummaryPostRequest']),
        };
    }

    /**
     * Read-only (POST only because the filter set is large). Nests the filtered snapshot by up to 4 of `format`, `country`, `device`, `category`, `paytype`, with available views / clicks per group and, for `selected_ids`, the selected totals. Same handler as the panel. 
     * Group the catalog by targeting dimensions.
     */
    async apiV1AdShopGroupSummaryPostRaw(requestParameters: ApiV1AdShopGroupSummaryPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopGroupSummaryPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Read-only (POST only because the filter set is large). Nests the filtered snapshot by up to 4 of `format`, `country`, `device`, `category`, `paytype`, with available views / clicks per group and, for `selected_ids`, the selected totals. Same handler as the panel. 
     * Group the catalog by targeting dimensions.
     */
    async apiV1AdShopGroupSummaryPost(requestParameters: ApiV1AdShopGroupSummaryPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopGroupSummaryPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdShopOpportunitiesGet without sending the request
     */
    async apiV1AdShopOpportunitiesGetRequestOpts(requestParameters: ApiV1AdShopOpportunitiesGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['formats'] != null) {
            queryParameters['formats[]'] = requestParameters['formats'];
        }

        if (requestParameters['payTypes'] != null) {
            queryParameters['payTypes[]'] = requestParameters['payTypes'];
        }

        if (requestParameters['categories'] != null) {
            queryParameters['categories[]'] = requestParameters['categories'];
        }

        if (requestParameters['devices'] != null) {
            queryParameters['devices[]'] = requestParameters['devices'];
        }

        if (requestParameters['countries'] != null) {
            queryParameters['countries[]'] = requestParameters['countries'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
        }

        if (requestParameters['direction'] != null) {
            queryParameters['direction'] = requestParameters['direction'];
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

        let urlPath = `/api/v1/ad-shop/opportunities`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Inventory lines from the tenant\'s latest opportunity snapshot, shopped by targeting (format × country × device × category × pay type) — never by site or zone. `rate` is the advertiser rate in **currency units** (per click for CPC, per 1000 views for CPM); `flat_price` (currency units) applies to flat lines. `availability_status`: available, reserved, manual_confirmation, auction, unavailable, expired. Same handler as the panel. 404 when the tenant\'s Ad Shop module is off. 
     * Browse Ad Shop opportunities.
     */
    async apiV1AdShopOpportunitiesGetRaw(requestParameters: ApiV1AdShopOpportunitiesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopOpportunitiesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Inventory lines from the tenant\'s latest opportunity snapshot, shopped by targeting (format × country × device × category × pay type) — never by site or zone. `rate` is the advertiser rate in **currency units** (per click for CPC, per 1000 views for CPM); `flat_price` (currency units) applies to flat lines. `availability_status`: available, reserved, manual_confirmation, auction, unavailable, expired. Same handler as the panel. 404 when the tenant\'s Ad Shop module is off. 
     * Browse Ad Shop opportunities.
     */
    async apiV1AdShopOpportunitiesGet(requestParameters: ApiV1AdShopOpportunitiesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopOpportunitiesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdShopPlanGet without sending the request
     */
    async apiV1AdShopPlanGetRequestOpts(requestParameters: ApiV1AdShopPlanGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['flatStart'] != null) {
            queryParameters['flat_start'] = (requestParameters['flatStart'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['flatEnd'] != null) {
            queryParameters['flat_end'] = (requestParameters['flatEnd'] as any).toISOString().substring(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/ad-shop/plan`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * No writes. Splits the cart into the campaigns confirm would create (one per format × pay type …). `bid` and `flat_price` are in currency units. With a flat window (`flat_start` + `flat_end`) the lines are priced as flat bookings and `conflicts` lists zones already booked in that window. Same handler as the panel. 
     * Preview how the cart becomes campaigns.
     */
    async apiV1AdShopPlanGetRaw(requestParameters: ApiV1AdShopPlanGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdShopPlanGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * No writes. Splits the cart into the campaigns confirm would create (one per format × pay type …). `bid` and `flat_price` are in currency units. With a flat window (`flat_start` + `flat_end`) the lines are priced as flat bookings and `conflicts` lists zones already booked in that window. Same handler as the panel. 
     * Preview how the cart becomes campaigns.
     */
    async apiV1AdShopPlanGet(requestParameters: ApiV1AdShopPlanGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdShopPlanGetRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1AdShopOpportunitiesGetSortEnum = {
    Status: 'status',
    Format: 'format',
    Country: 'country',
    Device: 'device',
    Views: 'views',
    Clicks: 'clicks',
    Rate: 'rate'
} as const;
export type ApiV1AdShopOpportunitiesGetSortEnum = typeof ApiV1AdShopOpportunitiesGetSortEnum[keyof typeof ApiV1AdShopOpportunitiesGetSortEnum];
/**
 * @export
 */
export const ApiV1AdShopOpportunitiesGetDirectionEnum = {
    Asc: 'asc',
    Desc: 'desc',
    Hot: 'hot'
} as const;
export type ApiV1AdShopOpportunitiesGetDirectionEnum = typeof ApiV1AdShopOpportunitiesGetDirectionEnum[keyof typeof ApiV1AdShopOpportunitiesGetDirectionEnum];
