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

export interface ApiV1CleanupAdvertiserExportGetRequest {
    format?: ApiV1CleanupAdvertiserExportGetFormatEnum;
    kinds?: string;
    inactiveDays?: number;
    neverServed?: boolean;
}

export interface ApiV1CleanupAdvertiserGetRequest {
    kind?: ApiV1CleanupAdvertiserGetKindEnum;
    inactiveDays?: number;
    neverServed?: boolean;
    search?: string;
    sort?: ApiV1CleanupAdvertiserGetSortEnum;
    dir?: ApiV1CleanupAdvertiserGetDirEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1CleanupAdvertiserLinkedGetRequest {
    kind: ApiV1CleanupAdvertiserLinkedGetKindEnum;
    ids: string;
}

export interface ApiV1CleanupAdvertiserRunsIdGetRequest {
    id: number;
}

export interface ApiV1CleanupAdvertiserRunsIdUndonePostRequest {
    id: number;
}

export interface ApiV1CleanupAdvertiserSummaryGetRequest {
    inactiveDays?: number;
    neverServed?: boolean;
}

export interface ApiV1CleanupPublisherExportGetRequest {
    format?: ApiV1CleanupPublisherExportGetFormatEnum;
    kinds?: string;
    inactiveDays?: number;
    neverServed?: boolean;
}

export interface ApiV1CleanupPublisherGetRequest {
    kind?: ApiV1CleanupPublisherGetKindEnum;
    inactiveDays?: number;
    neverServed?: boolean;
    search?: string;
    sort?: ApiV1CleanupPublisherGetSortEnum;
    dir?: ApiV1CleanupPublisherGetDirEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1CleanupPublisherLinkedGetRequest {
    kind: ApiV1CleanupPublisherLinkedGetKindEnum;
    ids: string;
}

export interface ApiV1CleanupPublisherRunsIdGetRequest {
    id: number;
}

export interface ApiV1CleanupPublisherRunsIdUndonePostRequest {
    id: number;
}

export interface ApiV1CleanupPublisherSummaryGetRequest {
    inactiveDays?: number;
    neverServed?: boolean;
}

/**
 * 
 */
export class CleanupApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1CleanupAdvertiserArchivedGet without sending the request
     */
    async apiV1CleanupAdvertiserArchivedGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/archived`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Per kind the caller may read, how many archived (deleted) items are still restorable, i.e. not purged.
     * Archived advertiser items that can be purged.
     */
    async apiV1CleanupAdvertiserArchivedGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserArchivedGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Per kind the caller may read, how many archived (deleted) items are still restorable, i.e. not purged.
     * Archived advertiser items that can be purged.
     */
    async apiV1CleanupAdvertiserArchivedGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserArchivedGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserExportGet without sending the request
     */
    async apiV1CleanupAdvertiserExportGetRequestOpts(requestParameters: ApiV1CleanupAdvertiserExportGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        if (requestParameters['kinds'] != null) {
            queryParameters['kinds'] = requestParameters['kinds'];
        }

        if (requestParameters['inactiveDays'] != null) {
            queryParameters['inactive_days'] = requestParameters['inactiveDays'];
        }

        if (requestParameters['neverServed'] != null) {
            queryParameters['never_served'] = requestParameters['neverServed'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/export`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every kind the caller may read (or the comma-separated `kinds`) with the same filter, as one xlsx workbook with a sheet per kind (default) or one csv where each kind starts with its own header row. 
     * Download the advertiser cleanup candidates.
     */
    async apiV1CleanupAdvertiserExportGetRaw(requestParameters: ApiV1CleanupAdvertiserExportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserExportGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every kind the caller may read (or the comma-separated `kinds`) with the same filter, as one xlsx workbook with a sheet per kind (default) or one csv where each kind starts with its own header row. 
     * Download the advertiser cleanup candidates.
     */
    async apiV1CleanupAdvertiserExportGet(requestParameters: ApiV1CleanupAdvertiserExportGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserExportGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserGet without sending the request
     */
    async apiV1CleanupAdvertiserGetRequestOpts(requestParameters: ApiV1CleanupAdvertiserGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['kind'] != null) {
            queryParameters['kind'] = requestParameters['kind'];
        }

        if (requestParameters['inactiveDays'] != null) {
            queryParameters['inactive_days'] = requestParameters['inactiveDays'];
        }

        if (requestParameters['neverServed'] != null) {
            queryParameters['never_served'] = requestParameters['neverServed'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
        }

        if (requestParameters['dir'] != null) {
            queryParameters['dir'] = requestParameters['dir'];
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

        let urlPath = `/api/v1/cleanup/advertiser`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One kind at a time (`campaign`, `ad`, `creative`, `creative_pool`, `url_pool` — campaigns and ads need `campaigns.read`, the rest `creatives.read`): every not-deleted row the account owns that has not served an impression for at least `inactive_days` days (default 90; `0` lists everything), or with `never_served=1` only the rows that never served at all. Each row carries its first / last served date (`\"\"` = never), `days_idle` (`-1` = never served), lifetime impressions / clicks / spend in the account\'s currency units, and a suggestion:  - `pause` — still switched on but idle (campaigns, ads). - `archive` — off or not switchable and nothing depends on it. - `review` — idle but still used (`used_by` live ads or pool   items for creatives and pools, live adzones for websites). - `keep` — served within the last 90 days; only appears with   `inactive_days=0`, the full inventory.  Read-only: act through the kind\'s own endpoints (pause a campaign or ad, mass-delete, delete a pool or site), which keep their own checks. History comes from the full stats history (2021 onward) and is cached for five minutes. RTB campaigns are not listed: their delivery is reported separately. Each kind also needs its own scope (campaigns.read, creatives.read); a kind the key or team member cannot read is 403. The panel\'s Cleanup page uses the same handler. 
     * List advertiser items that no longer serve.
     */
    async apiV1CleanupAdvertiserGetRaw(requestParameters: ApiV1CleanupAdvertiserGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * One kind at a time (`campaign`, `ad`, `creative`, `creative_pool`, `url_pool` — campaigns and ads need `campaigns.read`, the rest `creatives.read`): every not-deleted row the account owns that has not served an impression for at least `inactive_days` days (default 90; `0` lists everything), or with `never_served=1` only the rows that never served at all. Each row carries its first / last served date (`\"\"` = never), `days_idle` (`-1` = never served), lifetime impressions / clicks / spend in the account\'s currency units, and a suggestion:  - `pause` — still switched on but idle (campaigns, ads). - `archive` — off or not switchable and nothing depends on it. - `review` — idle but still used (`used_by` live ads or pool   items for creatives and pools, live adzones for websites). - `keep` — served within the last 90 days; only appears with   `inactive_days=0`, the full inventory.  Read-only: act through the kind\'s own endpoints (pause a campaign or ad, mass-delete, delete a pool or site), which keep their own checks. History comes from the full stats history (2021 onward) and is cached for five minutes. RTB campaigns are not listed: their delivery is reported separately. Each kind also needs its own scope (campaigns.read, creatives.read); a kind the key or team member cannot read is 403. The panel\'s Cleanup page uses the same handler. 
     * List advertiser items that no longer serve.
     */
    async apiV1CleanupAdvertiserGet(requestParameters: ApiV1CleanupAdvertiserGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserLinkedGet without sending the request
     */
    async apiV1CleanupAdvertiserLinkedGetRequestOpts(requestParameters: ApiV1CleanupAdvertiserLinkedGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['kind'] == null) {
            throw new runtime.RequiredError(
                'kind',
                'Required parameter "kind" was null or undefined when calling apiV1CleanupAdvertiserLinkedGet().'
            );
        }

        if (requestParameters['ids'] == null) {
            throw new runtime.RequiredError(
                'ids',
                'Required parameter "ids" was null or undefined when calling apiV1CleanupAdvertiserLinkedGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['kind'] != null) {
            queryParameters['kind'] = requestParameters['kind'];
        }

        if (requestParameters['ids'] != null) {
            queryParameters['ids'] = requestParameters['ids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/linked`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * For rows suggested `review` (still in use): the live ads in live campaigns that use them (creatives, creative pools, URL pools), the campaigns those ads would leave without any live ad, the live pool items holding a creative, and the live ad zones on a website. Read only; the panel\'s archive dialog archives these first when the user ticks \"archive linked too\" (ads, then emptied campaigns, then ad zones and pool items, then the rows). 
     * What still uses advertiser cleanup rows.
     */
    async apiV1CleanupAdvertiserLinkedGetRaw(requestParameters: ApiV1CleanupAdvertiserLinkedGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserLinkedGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * For rows suggested `review` (still in use): the live ads in live campaigns that use them (creatives, creative pools, URL pools), the campaigns those ads would leave without any live ad, the live pool items holding a creative, and the live ad zones on a website. Read only; the panel\'s archive dialog archives these first when the user ticks \"archive linked too\" (ads, then emptied campaigns, then ad zones and pool items, then the rows). 
     * What still uses advertiser cleanup rows.
     */
    async apiV1CleanupAdvertiserLinkedGet(requestParameters: ApiV1CleanupAdvertiserLinkedGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserLinkedGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserPurgePost without sending the request
     */
    async apiV1CleanupAdvertiserPurgePostRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/purge`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every archived item of the named kinds leaves the Deleted views and can no longer be restored (each kind\'s recover / undelete route answers 404 for it). The rows stay archived in the database, so past statistics keep their names and serving is not affected. Cannot be undone; logged in GET /runs as a `purge` entry. Body `{kinds: [...], confirm: \"PURGE\"}` (campaign, ad, creative, creative_pool, url_pool). 
     * Purge archived advertiser items for good.
     */
    async apiV1CleanupAdvertiserPurgePostRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserPurgePostRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every archived item of the named kinds leaves the Deleted views and can no longer be restored (each kind\'s recover / undelete route answers 404 for it). The rows stay archived in the database, so past statistics keep their names and serving is not affected. Cannot be undone; logged in GET /runs as a `purge` entry. Body `{kinds: [...], confirm: \"PURGE\"}` (campaign, ad, creative, creative_pool, url_pool). 
     * Purge archived advertiser items for good.
     */
    async apiV1CleanupAdvertiserPurgePost(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserPurgePostRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserRunsGet without sending the request
     */
    async apiV1CleanupAdvertiserRunsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/runs`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every pause / archive the Cleanup page (or an integration) recorded in the last 90 days, newest first, at most 50: `id`, `source` (selected | suggested | linked), `time`, `actor_userid`, `undone`, and `counts` keyed `<op>:<kind>`. Item lists come from GET /runs/{id}. 
     * Recent advertiser cleanup runs.
     */
    async apiV1CleanupAdvertiserRunsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserRunsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every pause / archive the Cleanup page (or an integration) recorded in the last 90 days, newest first, at most 50: `id`, `source` (selected | suggested | linked), `time`, `actor_userid`, `undone`, and `counts` keyed `<op>:<kind>`. Item lists come from GET /runs/{id}. 
     * Recent advertiser cleanup runs.
     */
    async apiV1CleanupAdvertiserRunsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserRunsGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserRunsIdGet without sending the request
     */
    async apiV1CleanupAdvertiserRunsIdGetRequestOpts(requestParameters: ApiV1CleanupAdvertiserRunsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CleanupAdvertiserRunsIdGet().'
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

        let urlPath = `/api/v1/cleanup/advertiser/runs/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What to call to undo it, action by action, newest action first: pause → resume (PUT /campaigns/mass-toggle pause false, PUT /campaigns/{type}/{campaignId}/ads/mass-toggle activate true); archive → restore (POST /campaigns/mass-undelete, POST /campaigns/{type}/{campaignId}/ads/mass-undelete, POST /creatives/bulk-undelete, POST /adspaces/mass-recover, POST /creative-pools/{id}/recover, POST /url-pools/{id}/recover, POST /sites/{id}/recover); remove_pool_item → POST /creative-pools/{id}/items/recover. Then POST /runs/{id}/undone. 
     * One advertiser cleanup run with its items.
     */
    async apiV1CleanupAdvertiserRunsIdGetRaw(requestParameters: ApiV1CleanupAdvertiserRunsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserRunsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * What to call to undo it, action by action, newest action first: pause → resume (PUT /campaigns/mass-toggle pause false, PUT /campaigns/{type}/{campaignId}/ads/mass-toggle activate true); archive → restore (POST /campaigns/mass-undelete, POST /campaigns/{type}/{campaignId}/ads/mass-undelete, POST /creatives/bulk-undelete, POST /adspaces/mass-recover, POST /creative-pools/{id}/recover, POST /url-pools/{id}/recover, POST /sites/{id}/recover); remove_pool_item → POST /creative-pools/{id}/items/recover. Then POST /runs/{id}/undone. 
     * One advertiser cleanup run with its items.
     */
    async apiV1CleanupAdvertiserRunsIdGet(requestParameters: ApiV1CleanupAdvertiserRunsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserRunsIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserRunsIdUndonePost without sending the request
     */
    async apiV1CleanupAdvertiserRunsIdUndonePostRequestOpts(requestParameters: ApiV1CleanupAdvertiserRunsIdUndonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CleanupAdvertiserRunsIdUndonePost().'
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

        let urlPath = `/api/v1/cleanup/advertiser/runs/{id}/undone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Call after restoring / resuming its items. 409 `already_undone` when it already was.
     * Mark a advertiser cleanup run as undone.
     */
    async apiV1CleanupAdvertiserRunsIdUndonePostRaw(requestParameters: ApiV1CleanupAdvertiserRunsIdUndonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserRunsIdUndonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Call after restoring / resuming its items. 409 `already_undone` when it already was.
     * Mark a advertiser cleanup run as undone.
     */
    async apiV1CleanupAdvertiserRunsIdUndonePost(requestParameters: ApiV1CleanupAdvertiserRunsIdUndonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserRunsIdUndonePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserRunsPost without sending the request
     */
    async apiV1CleanupAdvertiserRunsPostRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/runs`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Record what you just changed so it can be listed and undone. Body `{source, actions: [{op, kind, items: [{id, campaign_id, campaign_type, pool_id, was_active}]}]}`; `op` is `pause` (campaigns, ads), `archive` (any kind of this side) or `remove_pool_item` (kind `creative`; `pool_id`, `was_active`). Ads need `campaign_id` + `campaign_type`, campaigns `campaign_type`. At most 100000 items. Recording changes nothing by itself. 
     * Record a advertiser cleanup run.
     */
    async apiV1CleanupAdvertiserRunsPostRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserRunsPostRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Record what you just changed so it can be listed and undone. Body `{source, actions: [{op, kind, items: [{id, campaign_id, campaign_type, pool_id, was_active}]}]}`; `op` is `pause` (campaigns, ads), `archive` (any kind of this side) or `remove_pool_item` (kind `creative`; `pool_id`, `was_active`). Ads need `campaign_id` + `campaign_type`, campaigns `campaign_type`. At most 100000 items. Recording changes nothing by itself. 
     * Record a advertiser cleanup run.
     */
    async apiV1CleanupAdvertiserRunsPost(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserRunsPostRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupAdvertiserSummaryGet without sending the request
     */
    async apiV1CleanupAdvertiserSummaryGetRequestOpts(requestParameters: ApiV1CleanupAdvertiserSummaryGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['inactiveDays'] != null) {
            queryParameters['inactive_days'] = requestParameters['inactiveDays'];
        }

        if (requestParameters['neverServed'] != null) {
            queryParameters['never_served'] = requestParameters['neverServed'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/advertiser/summary`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * For every kind the caller may read: how many rows match the same `inactive_days` / `never_served` filter, how many never served, and the split by suggestion. 
     * Count the advertiser cleanup candidates per kind.
     */
    async apiV1CleanupAdvertiserSummaryGetRaw(requestParameters: ApiV1CleanupAdvertiserSummaryGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupAdvertiserSummaryGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * For every kind the caller may read: how many rows match the same `inactive_days` / `never_served` filter, how many never served, and the split by suggestion. 
     * Count the advertiser cleanup candidates per kind.
     */
    async apiV1CleanupAdvertiserSummaryGet(requestParameters: ApiV1CleanupAdvertiserSummaryGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupAdvertiserSummaryGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherArchivedGet without sending the request
     */
    async apiV1CleanupPublisherArchivedGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/archived`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Per kind the caller may read, how many archived (deleted) items are still restorable, i.e. not purged.
     * Archived publisher items that can be purged.
     */
    async apiV1CleanupPublisherArchivedGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherArchivedGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Per kind the caller may read, how many archived (deleted) items are still restorable, i.e. not purged.
     * Archived publisher items that can be purged.
     */
    async apiV1CleanupPublisherArchivedGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherArchivedGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherExportGet without sending the request
     */
    async apiV1CleanupPublisherExportGetRequestOpts(requestParameters: ApiV1CleanupPublisherExportGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        if (requestParameters['kinds'] != null) {
            queryParameters['kinds'] = requestParameters['kinds'];
        }

        if (requestParameters['inactiveDays'] != null) {
            queryParameters['inactive_days'] = requestParameters['inactiveDays'];
        }

        if (requestParameters['neverServed'] != null) {
            queryParameters['never_served'] = requestParameters['neverServed'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/export`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every kind the caller may read (or the comma-separated `kinds`) with the same filter, as one xlsx workbook with a sheet per kind (default) or one csv where each kind starts with its own header row. 
     * Download the publisher cleanup candidates.
     */
    async apiV1CleanupPublisherExportGetRaw(requestParameters: ApiV1CleanupPublisherExportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherExportGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every kind the caller may read (or the comma-separated `kinds`) with the same filter, as one xlsx workbook with a sheet per kind (default) or one csv where each kind starts with its own header row. 
     * Download the publisher cleanup candidates.
     */
    async apiV1CleanupPublisherExportGet(requestParameters: ApiV1CleanupPublisherExportGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherExportGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherGet without sending the request
     */
    async apiV1CleanupPublisherGetRequestOpts(requestParameters: ApiV1CleanupPublisherGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['kind'] != null) {
            queryParameters['kind'] = requestParameters['kind'];
        }

        if (requestParameters['inactiveDays'] != null) {
            queryParameters['inactive_days'] = requestParameters['inactiveDays'];
        }

        if (requestParameters['neverServed'] != null) {
            queryParameters['never_served'] = requestParameters['neverServed'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
        }

        if (requestParameters['dir'] != null) {
            queryParameters['dir'] = requestParameters['dir'];
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

        let urlPath = `/api/v1/cleanup/publisher`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One kind at a time (`adzone` needs `adspaces.read`, `website` needs `sites.read`): every not-deleted row the account owns that has not served an impression for at least `inactive_days` days (default 90; `0` lists everything), or with `never_served=1` only the rows that never served at all. Each row carries its first / last served date (`\"\"` = never), `days_idle` (`-1` = never served), lifetime impressions / clicks / earnings in the account\'s currency units, and a suggestion:  - `pause` — still switched on but idle (campaigns, ads). - `archive` — off or not switchable and nothing depends on it. - `review` — idle but still used (`used_by` live ads or pool   items for creatives and pools, live adzones for websites). - `keep` — served within the last 90 days; only appears with   `inactive_days=0`, the full inventory.  Read-only: act through the kind\'s own endpoints (pause a campaign or ad, mass-delete, delete a pool or site), which keep their own checks. History comes from the full stats history (2021 onward) and is cached for five minutes. RTB campaigns are not listed: their delivery is reported separately. Each kind also needs its own scope (adspaces.read, sites.read); a kind the key or team member cannot read is 403. The panel\'s Cleanup page uses the same handler. 
     * List publisher items that no longer serve.
     */
    async apiV1CleanupPublisherGetRaw(requestParameters: ApiV1CleanupPublisherGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * One kind at a time (`adzone` needs `adspaces.read`, `website` needs `sites.read`): every not-deleted row the account owns that has not served an impression for at least `inactive_days` days (default 90; `0` lists everything), or with `never_served=1` only the rows that never served at all. Each row carries its first / last served date (`\"\"` = never), `days_idle` (`-1` = never served), lifetime impressions / clicks / earnings in the account\'s currency units, and a suggestion:  - `pause` — still switched on but idle (campaigns, ads). - `archive` — off or not switchable and nothing depends on it. - `review` — idle but still used (`used_by` live ads or pool   items for creatives and pools, live adzones for websites). - `keep` — served within the last 90 days; only appears with   `inactive_days=0`, the full inventory.  Read-only: act through the kind\'s own endpoints (pause a campaign or ad, mass-delete, delete a pool or site), which keep their own checks. History comes from the full stats history (2021 onward) and is cached for five minutes. RTB campaigns are not listed: their delivery is reported separately. Each kind also needs its own scope (adspaces.read, sites.read); a kind the key or team member cannot read is 403. The panel\'s Cleanup page uses the same handler. 
     * List publisher items that no longer serve.
     */
    async apiV1CleanupPublisherGet(requestParameters: ApiV1CleanupPublisherGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherLinkedGet without sending the request
     */
    async apiV1CleanupPublisherLinkedGetRequestOpts(requestParameters: ApiV1CleanupPublisherLinkedGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['kind'] == null) {
            throw new runtime.RequiredError(
                'kind',
                'Required parameter "kind" was null or undefined when calling apiV1CleanupPublisherLinkedGet().'
            );
        }

        if (requestParameters['ids'] == null) {
            throw new runtime.RequiredError(
                'ids',
                'Required parameter "ids" was null or undefined when calling apiV1CleanupPublisherLinkedGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['kind'] != null) {
            queryParameters['kind'] = requestParameters['kind'];
        }

        if (requestParameters['ids'] != null) {
            queryParameters['ids'] = requestParameters['ids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/linked`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * For rows suggested `review` (still in use): the live ads in live campaigns that use them (creatives, creative pools, URL pools), the campaigns those ads would leave without any live ad, the live pool items holding a creative, and the live ad zones on a website. Read only; the panel\'s archive dialog archives these first when the user ticks \"archive linked too\" (ads, then emptied campaigns, then ad zones and pool items, then the rows). 
     * What still uses publisher cleanup rows.
     */
    async apiV1CleanupPublisherLinkedGetRaw(requestParameters: ApiV1CleanupPublisherLinkedGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherLinkedGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * For rows suggested `review` (still in use): the live ads in live campaigns that use them (creatives, creative pools, URL pools), the campaigns those ads would leave without any live ad, the live pool items holding a creative, and the live ad zones on a website. Read only; the panel\'s archive dialog archives these first when the user ticks \"archive linked too\" (ads, then emptied campaigns, then ad zones and pool items, then the rows). 
     * What still uses publisher cleanup rows.
     */
    async apiV1CleanupPublisherLinkedGet(requestParameters: ApiV1CleanupPublisherLinkedGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherLinkedGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherPurgePost without sending the request
     */
    async apiV1CleanupPublisherPurgePostRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/purge`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every archived item of the named kinds leaves the Deleted views and can no longer be restored (each kind\'s recover / undelete route answers 404 for it). The rows stay archived in the database, so past statistics keep their names and serving is not affected. Cannot be undone; logged in GET /runs as a `purge` entry. Body `{kinds: [...], confirm: \"PURGE\"}` (adzone, website). 
     * Purge archived publisher items for good.
     */
    async apiV1CleanupPublisherPurgePostRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherPurgePostRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every archived item of the named kinds leaves the Deleted views and can no longer be restored (each kind\'s recover / undelete route answers 404 for it). The rows stay archived in the database, so past statistics keep their names and serving is not affected. Cannot be undone; logged in GET /runs as a `purge` entry. Body `{kinds: [...], confirm: \"PURGE\"}` (adzone, website). 
     * Purge archived publisher items for good.
     */
    async apiV1CleanupPublisherPurgePost(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherPurgePostRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherRunsGet without sending the request
     */
    async apiV1CleanupPublisherRunsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/runs`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every pause / archive the Cleanup page (or an integration) recorded in the last 90 days, newest first, at most 50: `id`, `source` (selected | suggested | linked), `time`, `actor_userid`, `undone`, and `counts` keyed `<op>:<kind>`. Item lists come from GET /runs/{id}. 
     * Recent publisher cleanup runs.
     */
    async apiV1CleanupPublisherRunsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherRunsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every pause / archive the Cleanup page (or an integration) recorded in the last 90 days, newest first, at most 50: `id`, `source` (selected | suggested | linked), `time`, `actor_userid`, `undone`, and `counts` keyed `<op>:<kind>`. Item lists come from GET /runs/{id}. 
     * Recent publisher cleanup runs.
     */
    async apiV1CleanupPublisherRunsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherRunsGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherRunsIdGet without sending the request
     */
    async apiV1CleanupPublisherRunsIdGetRequestOpts(requestParameters: ApiV1CleanupPublisherRunsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CleanupPublisherRunsIdGet().'
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

        let urlPath = `/api/v1/cleanup/publisher/runs/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What to call to undo it, action by action, newest action first: pause → resume (PUT /campaigns/mass-toggle pause false, PUT /campaigns/{type}/{campaignId}/ads/mass-toggle activate true); archive → restore (POST /campaigns/mass-undelete, POST /campaigns/{type}/{campaignId}/ads/mass-undelete, POST /creatives/bulk-undelete, POST /adspaces/mass-recover, POST /creative-pools/{id}/recover, POST /url-pools/{id}/recover, POST /sites/{id}/recover); remove_pool_item → POST /creative-pools/{id}/items/recover. Then POST /runs/{id}/undone. 
     * One publisher cleanup run with its items.
     */
    async apiV1CleanupPublisherRunsIdGetRaw(requestParameters: ApiV1CleanupPublisherRunsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherRunsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * What to call to undo it, action by action, newest action first: pause → resume (PUT /campaigns/mass-toggle pause false, PUT /campaigns/{type}/{campaignId}/ads/mass-toggle activate true); archive → restore (POST /campaigns/mass-undelete, POST /campaigns/{type}/{campaignId}/ads/mass-undelete, POST /creatives/bulk-undelete, POST /adspaces/mass-recover, POST /creative-pools/{id}/recover, POST /url-pools/{id}/recover, POST /sites/{id}/recover); remove_pool_item → POST /creative-pools/{id}/items/recover. Then POST /runs/{id}/undone. 
     * One publisher cleanup run with its items.
     */
    async apiV1CleanupPublisherRunsIdGet(requestParameters: ApiV1CleanupPublisherRunsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherRunsIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherRunsIdUndonePost without sending the request
     */
    async apiV1CleanupPublisherRunsIdUndonePostRequestOpts(requestParameters: ApiV1CleanupPublisherRunsIdUndonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CleanupPublisherRunsIdUndonePost().'
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

        let urlPath = `/api/v1/cleanup/publisher/runs/{id}/undone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Call after restoring / resuming its items. 409 `already_undone` when it already was.
     * Mark a publisher cleanup run as undone.
     */
    async apiV1CleanupPublisherRunsIdUndonePostRaw(requestParameters: ApiV1CleanupPublisherRunsIdUndonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherRunsIdUndonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Call after restoring / resuming its items. 409 `already_undone` when it already was.
     * Mark a publisher cleanup run as undone.
     */
    async apiV1CleanupPublisherRunsIdUndonePost(requestParameters: ApiV1CleanupPublisherRunsIdUndonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherRunsIdUndonePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherRunsPost without sending the request
     */
    async apiV1CleanupPublisherRunsPostRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/runs`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Record what you just changed so it can be listed and undone. Body `{source, actions: [{op, kind, items: [{id, campaign_id, campaign_type, pool_id, was_active}]}]}`; `op` is `pause` (campaigns, ads), `archive` (any kind of this side) or `remove_pool_item` (kind `creative`; `pool_id`, `was_active`). Ads need `campaign_id` + `campaign_type`, campaigns `campaign_type`. At most 100000 items. Recording changes nothing by itself. 
     * Record a publisher cleanup run.
     */
    async apiV1CleanupPublisherRunsPostRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherRunsPostRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Record what you just changed so it can be listed and undone. Body `{source, actions: [{op, kind, items: [{id, campaign_id, campaign_type, pool_id, was_active}]}]}`; `op` is `pause` (campaigns, ads), `archive` (any kind of this side) or `remove_pool_item` (kind `creative`; `pool_id`, `was_active`). Ads need `campaign_id` + `campaign_type`, campaigns `campaign_type`. At most 100000 items. Recording changes nothing by itself. 
     * Record a publisher cleanup run.
     */
    async apiV1CleanupPublisherRunsPost(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherRunsPostRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1CleanupPublisherSummaryGet without sending the request
     */
    async apiV1CleanupPublisherSummaryGetRequestOpts(requestParameters: ApiV1CleanupPublisherSummaryGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['inactiveDays'] != null) {
            queryParameters['inactive_days'] = requestParameters['inactiveDays'];
        }

        if (requestParameters['neverServed'] != null) {
            queryParameters['never_served'] = requestParameters['neverServed'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/cleanup/publisher/summary`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * For every kind the caller may read: how many rows match the same `inactive_days` / `never_served` filter, how many never served, and the split by suggestion. 
     * Count the publisher cleanup candidates per kind.
     */
    async apiV1CleanupPublisherSummaryGetRaw(requestParameters: ApiV1CleanupPublisherSummaryGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CleanupPublisherSummaryGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * For every kind the caller may read: how many rows match the same `inactive_days` / `never_served` filter, how many never served, and the split by suggestion. 
     * Count the publisher cleanup candidates per kind.
     */
    async apiV1CleanupPublisherSummaryGet(requestParameters: ApiV1CleanupPublisherSummaryGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CleanupPublisherSummaryGetRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1CleanupAdvertiserExportGetFormatEnum = {
    Xlsx: 'xlsx',
    Csv: 'csv'
} as const;
export type ApiV1CleanupAdvertiserExportGetFormatEnum = typeof ApiV1CleanupAdvertiserExportGetFormatEnum[keyof typeof ApiV1CleanupAdvertiserExportGetFormatEnum];
/**
 * @export
 */
export const ApiV1CleanupAdvertiserGetKindEnum = {
    Campaign: 'campaign',
    Ad: 'ad',
    Creative: 'creative',
    CreativePool: 'creative_pool',
    UrlPool: 'url_pool'
} as const;
export type ApiV1CleanupAdvertiserGetKindEnum = typeof ApiV1CleanupAdvertiserGetKindEnum[keyof typeof ApiV1CleanupAdvertiserGetKindEnum];
/**
 * @export
 */
export const ApiV1CleanupAdvertiserGetSortEnum = {
    LastServed: 'last_served',
    LifetimeImpressions: 'lifetime_impressions',
    Name: 'name',
    Id: 'id'
} as const;
export type ApiV1CleanupAdvertiserGetSortEnum = typeof ApiV1CleanupAdvertiserGetSortEnum[keyof typeof ApiV1CleanupAdvertiserGetSortEnum];
/**
 * @export
 */
export const ApiV1CleanupAdvertiserGetDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1CleanupAdvertiserGetDirEnum = typeof ApiV1CleanupAdvertiserGetDirEnum[keyof typeof ApiV1CleanupAdvertiserGetDirEnum];
/**
 * @export
 */
export const ApiV1CleanupAdvertiserLinkedGetKindEnum = {
    Campaign: 'campaign',
    Ad: 'ad',
    Creative: 'creative',
    CreativePool: 'creative_pool',
    UrlPool: 'url_pool'
} as const;
export type ApiV1CleanupAdvertiserLinkedGetKindEnum = typeof ApiV1CleanupAdvertiserLinkedGetKindEnum[keyof typeof ApiV1CleanupAdvertiserLinkedGetKindEnum];
/**
 * @export
 */
export const ApiV1CleanupPublisherExportGetFormatEnum = {
    Xlsx: 'xlsx',
    Csv: 'csv'
} as const;
export type ApiV1CleanupPublisherExportGetFormatEnum = typeof ApiV1CleanupPublisherExportGetFormatEnum[keyof typeof ApiV1CleanupPublisherExportGetFormatEnum];
/**
 * @export
 */
export const ApiV1CleanupPublisherGetKindEnum = {
    Adzone: 'adzone',
    Website: 'website'
} as const;
export type ApiV1CleanupPublisherGetKindEnum = typeof ApiV1CleanupPublisherGetKindEnum[keyof typeof ApiV1CleanupPublisherGetKindEnum];
/**
 * @export
 */
export const ApiV1CleanupPublisherGetSortEnum = {
    LastServed: 'last_served',
    LifetimeImpressions: 'lifetime_impressions',
    Name: 'name',
    Id: 'id'
} as const;
export type ApiV1CleanupPublisherGetSortEnum = typeof ApiV1CleanupPublisherGetSortEnum[keyof typeof ApiV1CleanupPublisherGetSortEnum];
/**
 * @export
 */
export const ApiV1CleanupPublisherGetDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1CleanupPublisherGetDirEnum = typeof ApiV1CleanupPublisherGetDirEnum[keyof typeof ApiV1CleanupPublisherGetDirEnum];
/**
 * @export
 */
export const ApiV1CleanupPublisherLinkedGetKindEnum = {
    Adzone: 'adzone',
    Website: 'website'
} as const;
export type ApiV1CleanupPublisherLinkedGetKindEnum = typeof ApiV1CleanupPublisherLinkedGetKindEnum[keyof typeof ApiV1CleanupPublisherLinkedGetKindEnum];
