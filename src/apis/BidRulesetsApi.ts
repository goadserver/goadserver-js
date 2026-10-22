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
  ApiV1BidRulesetsGet200Response,
  ApiV1BidRulesetsIdClonePostRequest,
  ApiV1BidRulesetsIdDelete200Response,
  ApiV1BidRulesetsIdDelete422Response,
  ApiV1BidRulesetsIdPatchRequest,
  ApiV1BidRulesetsPostRequest,
  BidRuleset,
} from '../models/index';
import {
    ApiV1BidRulesetsGet200ResponseFromJSON,
    ApiV1BidRulesetsGet200ResponseToJSON,
    ApiV1BidRulesetsIdClonePostRequestFromJSON,
    ApiV1BidRulesetsIdClonePostRequestToJSON,
    ApiV1BidRulesetsIdDelete200ResponseFromJSON,
    ApiV1BidRulesetsIdDelete200ResponseToJSON,
    ApiV1BidRulesetsIdDelete422ResponseFromJSON,
    ApiV1BidRulesetsIdDelete422ResponseToJSON,
    ApiV1BidRulesetsIdPatchRequestFromJSON,
    ApiV1BidRulesetsIdPatchRequestToJSON,
    ApiV1BidRulesetsPostRequestFromJSON,
    ApiV1BidRulesetsPostRequestToJSON,
    BidRulesetFromJSON,
    BidRulesetToJSON,
} from '../models/index';

export interface ApiV1BidRulesetsGetRequest {
    paytype?: ApiV1BidRulesetsGetPaytypeEnum;
    includeDeleted?: boolean;
}

export interface ApiV1BidRulesetsIdClonePostOperationRequest {
    id: number;
    apiV1BidRulesetsIdClonePostRequest?: ApiV1BidRulesetsIdClonePostRequest;
}

export interface ApiV1BidRulesetsIdDeleteRequest {
    id: number;
}

export interface ApiV1BidRulesetsIdGetRequest {
    id: number;
}

export interface ApiV1BidRulesetsIdPatchOperationRequest {
    id: number;
    apiV1BidRulesetsIdPatchRequest: ApiV1BidRulesetsIdPatchRequest;
}

export interface ApiV1BidRulesetsPostOperationRequest {
    apiV1BidRulesetsPostRequest: ApiV1BidRulesetsPostRequest;
}

/**
 * 
 */
export class BidRulesetsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1BidRulesetsGet without sending the request
     */
    async apiV1BidRulesetsGetRequestOpts(requestParameters: ApiV1BidRulesetsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['paytype'] != null) {
            queryParameters['paytype'] = requestParameters['paytype'];
        }

        if (requestParameters['includeDeleted'] != null) {
            queryParameters['include_deleted'] = requestParameters['includeDeleted'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/bid-rulesets`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns every non-deleted ruleset of the authenticated user, optionally filtered by paytype. Not paginated: `page` is always 1 and `per_page` / `total_rows` equal the number of rows returned (users typically hold fewer than 50 rulesets). Each row carries identity + summary counts (`rule_count`, `campaign_count`) but **not** the rule rows themselves — fetch the full record via `GET /api/v1/bid-rulesets/{id}` when you need the conditions JSON for editing.  Use this endpoint to populate ruleset-picker UIs (e.g. the campaign-edit \"Use bid rules\" picker) and library views.  Default sort is `updated DESC`. Soft-deleted rulesets are excluded.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * List the caller\'s bid rulesets (lightweight rows).
     */
    async apiV1BidRulesetsGetRaw(requestParameters: ApiV1BidRulesetsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1BidRulesetsGet200Response>> {
        const requestOptions = await this.apiV1BidRulesetsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1BidRulesetsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every non-deleted ruleset of the authenticated user, optionally filtered by paytype. Not paginated: `page` is always 1 and `per_page` / `total_rows` equal the number of rows returned (users typically hold fewer than 50 rulesets). Each row carries identity + summary counts (`rule_count`, `campaign_count`) but **not** the rule rows themselves — fetch the full record via `GET /api/v1/bid-rulesets/{id}` when you need the conditions JSON for editing.  Use this endpoint to populate ruleset-picker UIs (e.g. the campaign-edit \"Use bid rules\" picker) and library views.  Default sort is `updated DESC`. Soft-deleted rulesets are excluded.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * List the caller\'s bid rulesets (lightweight rows).
     */
    async apiV1BidRulesetsGet(requestParameters: ApiV1BidRulesetsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1BidRulesetsGet200Response> {
        const response = await this.apiV1BidRulesetsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1BidRulesetsIdClonePost without sending the request
     */
    async apiV1BidRulesetsIdClonePostRequestOpts(requestParameters: ApiV1BidRulesetsIdClonePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1BidRulesetsIdClonePost().'
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

        let urlPath = `/api/v1/bid-rulesets/{id}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1BidRulesetsIdClonePostRequestToJSON(requestParameters['apiV1BidRulesetsIdClonePostRequest']),
        };
    }

    /**
     * Duplicates the ruleset row and every non-deleted rule on it. New ruleset name defaults to `<original> (copy)` — override via the body. Same `paytype` and `default_tz` as the source. Ad / campaign attachments are **not** copied — the clone starts unattached (`campaign_count: 0`).  Use this to fork a working ruleset for an experiment without affecting the live campaigns that reference the original.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Clone a ruleset with all its rules.
     */
    async apiV1BidRulesetsIdClonePostRaw(requestParameters: ApiV1BidRulesetsIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BidRuleset>> {
        const requestOptions = await this.apiV1BidRulesetsIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BidRulesetFromJSON(jsonValue));
    }

    /**
     * Duplicates the ruleset row and every non-deleted rule on it. New ruleset name defaults to `<original> (copy)` — override via the body. Same `paytype` and `default_tz` as the source. Ad / campaign attachments are **not** copied — the clone starts unattached (`campaign_count: 0`).  Use this to fork a working ruleset for an experiment without affecting the live campaigns that reference the original.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Clone a ruleset with all its rules.
     */
    async apiV1BidRulesetsIdClonePost(requestParameters: ApiV1BidRulesetsIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BidRuleset> {
        const response = await this.apiV1BidRulesetsIdClonePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1BidRulesetsIdDelete without sending the request
     */
    async apiV1BidRulesetsIdDeleteRequestOpts(requestParameters: ApiV1BidRulesetsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1BidRulesetsIdDelete().'
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

        let urlPath = `/api/v1/bid-rulesets/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sets `isdeleted=1` on the ruleset (rule rows stay in place for audit; goadserver simply stops loading them on next refresh). Idempotent.  **Hard-blocked while attached to a non-deleted campaign** — the response is a 422 whose message gives the number of attached campaigns (`ruleset is attached to N active campaign(s); detach first`). Find them with `GET /api/v1/campaigns` and detach each one (set `bidruleset_id=0` via `PATCH /api/v1/campaigns/{type}/{id}`) first. The list endpoint\'s `campaign_count` flags this ahead of time.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Soft-delete a ruleset.
     */
    async apiV1BidRulesetsIdDeleteRaw(requestParameters: ApiV1BidRulesetsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1BidRulesetsIdDelete200Response>> {
        const requestOptions = await this.apiV1BidRulesetsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1BidRulesetsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets `isdeleted=1` on the ruleset (rule rows stay in place for audit; goadserver simply stops loading them on next refresh). Idempotent.  **Hard-blocked while attached to a non-deleted campaign** — the response is a 422 whose message gives the number of attached campaigns (`ruleset is attached to N active campaign(s); detach first`). Find them with `GET /api/v1/campaigns` and detach each one (set `bidruleset_id=0` via `PATCH /api/v1/campaigns/{type}/{id}`) first. The list endpoint\'s `campaign_count` flags this ahead of time.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Soft-delete a ruleset.
     */
    async apiV1BidRulesetsIdDelete(requestParameters: ApiV1BidRulesetsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1BidRulesetsIdDelete200Response> {
        const response = await this.apiV1BidRulesetsIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1BidRulesetsIdGet without sending the request
     */
    async apiV1BidRulesetsIdGetRequestOpts(requestParameters: ApiV1BidRulesetsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1BidRulesetsIdGet().'
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

        let urlPath = `/api/v1/bid-rulesets/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the full ruleset record with the rule rows in priority order — this is what an editor UI loads to render the rule list and condition pickers.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Show one ruleset, including all rules.
     */
    async apiV1BidRulesetsIdGetRaw(requestParameters: ApiV1BidRulesetsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BidRuleset>> {
        const requestOptions = await this.apiV1BidRulesetsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BidRulesetFromJSON(jsonValue));
    }

    /**
     * Returns the full ruleset record with the rule rows in priority order — this is what an editor UI loads to render the rule list and condition pickers.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Show one ruleset, including all rules.
     */
    async apiV1BidRulesetsIdGet(requestParameters: ApiV1BidRulesetsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BidRuleset> {
        const response = await this.apiV1BidRulesetsIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1BidRulesetsIdPatch without sending the request
     */
    async apiV1BidRulesetsIdPatchRequestOpts(requestParameters: ApiV1BidRulesetsIdPatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1BidRulesetsIdPatch().'
            );
        }

        if (requestParameters['apiV1BidRulesetsIdPatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1BidRulesetsIdPatchRequest',
                'Required parameter "apiV1BidRulesetsIdPatchRequest" was null or undefined when calling apiV1BidRulesetsIdPatch().'
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

        let urlPath = `/api/v1/bid-rulesets/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1BidRulesetsIdPatchRequestToJSON(requestParameters['apiV1BidRulesetsIdPatchRequest']),
        };
    }

    /**
     * Fields you leave out keep their stored value:  - `name`, `paytype`, `default_tz` omitted → unchanged. - `rules` omitted → the current rules are kept. - `rules` present → the array **replaces** the whole rule list   in one transaction; `rules: []` clears it.  Every save rewrites the rule rows: the previous rows are soft-deleted and the resulting list is inserted with **new** rule ids (stats already attributed to an old rule id stay on the old row). Rule `id`s in the body are ignored.  `paytype` can be changed, as in the panel editor — make sure the attached campaigns use the same paytype.  You can send back a record fetched with `GET` unchanged: the read-only fields (`id`, `userid`, `is_deleted`, `created`, `updated`, `campaign_count`, `rule_count`) are accepted and ignored, also in strict mode.  Reorder by changing `priority` values — rules walk in ascending priority at serve time.  Editing a ruleset that\'s attached to multiple campaigns affects all of them — no per-campaign override exists. The list endpoint surfaces `campaign_count` so a UI can warn before save.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Update a ruleset\'s metadata and/or replace its rules.
     */
    async apiV1BidRulesetsIdPatchRaw(requestParameters: ApiV1BidRulesetsIdPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BidRuleset>> {
        const requestOptions = await this.apiV1BidRulesetsIdPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BidRulesetFromJSON(jsonValue));
    }

    /**
     * Fields you leave out keep their stored value:  - `name`, `paytype`, `default_tz` omitted → unchanged. - `rules` omitted → the current rules are kept. - `rules` present → the array **replaces** the whole rule list   in one transaction; `rules: []` clears it.  Every save rewrites the rule rows: the previous rows are soft-deleted and the resulting list is inserted with **new** rule ids (stats already attributed to an old rule id stay on the old row). Rule `id`s in the body are ignored.  `paytype` can be changed, as in the panel editor — make sure the attached campaigns use the same paytype.  You can send back a record fetched with `GET` unchanged: the read-only fields (`id`, `userid`, `is_deleted`, `created`, `updated`, `campaign_count`, `rule_count`) are accepted and ignored, also in strict mode.  Reorder by changing `priority` values — rules walk in ascending priority at serve time.  Editing a ruleset that\'s attached to multiple campaigns affects all of them — no per-campaign override exists. The list endpoint surfaces `campaign_count` so a UI can warn before save.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Update a ruleset\'s metadata and/or replace its rules.
     */
    async apiV1BidRulesetsIdPatch(requestParameters: ApiV1BidRulesetsIdPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BidRuleset> {
        const response = await this.apiV1BidRulesetsIdPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1BidRulesetsPost without sending the request
     */
    async apiV1BidRulesetsPostRequestOpts(requestParameters: ApiV1BidRulesetsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1BidRulesetsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1BidRulesetsPostRequest',
                'Required parameter "apiV1BidRulesetsPostRequest" was null or undefined when calling apiV1BidRulesetsPost().'
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

        let urlPath = `/api/v1/bid-rulesets`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1BidRulesetsPostRequestToJSON(requestParameters['apiV1BidRulesetsPostRequest']),
        };
    }

    /**
     * Creates a ruleset and the full rule list in a single transaction. Rules without an `id` are inserted; the supplied `priority` is honored — sort the array client-side or just set `priority` to the desired walk order.  `paytype` must match the paytype of the campaigns you attach the ruleset to. `default_tz` defaults to `UTC` when omitted. Rule `bid` values are whole cents.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Create a new bid ruleset (with rules in one shot).
     */
    async apiV1BidRulesetsPostRaw(requestParameters: ApiV1BidRulesetsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BidRuleset>> {
        const requestOptions = await this.apiV1BidRulesetsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BidRulesetFromJSON(jsonValue));
    }

    /**
     * Creates a ruleset and the full rule list in a single transaction. Rules without an `id` are inserted; the supplied `priority` is honored — sort the array client-side or just set `priority` to the desired walk order.  `paytype` must match the paytype of the campaigns you attach the ruleset to. `default_tz` defaults to `UTC` when omitted. Rule `bid` values are whole cents.  Reference: [`docs/BID_RULES.md`](BID_RULES.md). 
     * Create a new bid ruleset (with rules in one shot).
     */
    async apiV1BidRulesetsPost(requestParameters: ApiV1BidRulesetsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BidRuleset> {
        const response = await this.apiV1BidRulesetsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1BidRulesetsGetPaytypeEnum = {
    Cpc: 'cpc',
    Cpm: 'cpm',
    Other: 'other'
} as const;
export type ApiV1BidRulesetsGetPaytypeEnum = typeof ApiV1BidRulesetsGetPaytypeEnum[keyof typeof ApiV1BidRulesetsGetPaytypeEnum];
