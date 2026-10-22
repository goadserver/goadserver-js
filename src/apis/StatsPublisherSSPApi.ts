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
  StatsResponse,
} from '../models/index';
import {
    StatsResponseFromJSON,
    StatsResponseToJSON,
} from '../models/index';

export interface ApiV1PublisherSspStatsDetailsGetRequest {
    from?: Date;
    to?: Date;
    type?: ApiV1PublisherSspStatsDetailsGetTypeEnum;
    ssptype?: ApiV1PublisherSspStatsDetailsGetSsptypeEnum;
    campaignid?: Array<number>;
    networkid?: Array<number>;
    siteid?: Array<number>;
    country?: Array<string>;
    deviceType?: Array<number>;
    adType?: Array<number>;
    subid?: string;
    filterBidType?: number;
}

export interface ApiV1PublisherSspStatsFlatGetRequest {
    from?: Date;
    to?: Date;
    group?: string;
    viewtype?: ApiV1PublisherSspStatsFlatGetViewtypeEnum;
    ssptype?: ApiV1PublisherSspStatsFlatGetSsptypeEnum;
    campaignid?: Array<number>;
    networkid?: Array<number>;
    siteid?: Array<number>;
    country?: Array<string>;
    deviceType?: Array<number>;
    adType?: Array<number>;
    subid?: string;
    filterBidType?: number;
}

export interface ApiV1PublisherSspStatsGetRequest {
    from?: Date;
    to?: Date;
    interval?: ApiV1PublisherSspStatsGetIntervalEnum;
    groupBy?: Array<ApiV1PublisherSspStatsGetGroupByEnum>;
    metrics?: Array<ApiV1PublisherSspStatsGetMetricsEnum>;
    filterFeedId?: string;
    filterCampaignId?: number;
    filterSsptype?: string;
    filterCountry?: string;
    filterDevice?: ApiV1PublisherSspStatsGetFilterDeviceEnum;
    filterAdType?: number;
    filterNetworkId?: number;
    filterAdzoneId?: number;
    filterWebsite?: number;
    format?: ApiV1PublisherSspStatsGetFormatEnum;
    page?: number;
    perPage?: number;
    sort?: string;
}

/**
 * 
 */
export class StatsPublisherSSPApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1PublisherSspStatsDetailsGet without sending the request
     */
    async apiV1PublisherSspStatsDetailsGetRequestOpts(requestParameters: ApiV1PublisherSspStatsDetailsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
        }

        if (requestParameters['ssptype'] != null) {
            queryParameters['ssptype'] = requestParameters['ssptype'];
        }

        if (requestParameters['campaignid'] != null) {
            queryParameters['campaignid'] = requestParameters['campaignid'];
        }

        if (requestParameters['networkid'] != null) {
            queryParameters['networkid'] = requestParameters['networkid'];
        }

        if (requestParameters['siteid'] != null) {
            queryParameters['siteid'] = requestParameters['siteid'];
        }

        if (requestParameters['country'] != null) {
            queryParameters['country[]'] = requestParameters['country'];
        }

        if (requestParameters['deviceType'] != null) {
            queryParameters['device_type'] = requestParameters['deviceType'];
        }

        if (requestParameters['adType'] != null) {
            queryParameters['ad_type'] = requestParameters['adType'];
        }

        if (requestParameters['subid'] != null) {
            queryParameters['subid'] = requestParameters['subid'];
        }

        if (requestParameters['filterBidType'] != null) {
            queryParameters['filter_bid_type'] = requestParameters['filterBidType'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/stats/details`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s SSP \"details\" console: one row per value of `type` (`campaign`, `country`, `website`, `adzone`, `network`, `bid_type`, `keyword`), with request/bid/win funnel, errors and timings. Defaults to every SSP campaign of yours (narrow with `ssptype` or `campaignid`). Capped rows report `truncated: true` + `row_cap`. **Money is in currency units (not cents)**: `paid`, `ecpm`, `avg_bidfloor`, `avg_cpm` (CPM) and `nw_earned`. `avg_resp_time` is seconds. For campaign/country rows, `nw_views` / `nw_clicks` / `nw_earned` carry what the partner\'s own API reported. 
     * SSP report broken down by one dimension.
     */
    async apiV1PublisherSspStatsDetailsGetRaw(requestParameters: ApiV1PublisherSspStatsDetailsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspStatsDetailsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s SSP \"details\" console: one row per value of `type` (`campaign`, `country`, `website`, `adzone`, `network`, `bid_type`, `keyword`), with request/bid/win funnel, errors and timings. Defaults to every SSP campaign of yours (narrow with `ssptype` or `campaignid`). Capped rows report `truncated: true` + `row_cap`. **Money is in currency units (not cents)**: `paid`, `ecpm`, `avg_bidfloor`, `avg_cpm` (CPM) and `nw_earned`. `avg_resp_time` is seconds. For campaign/country rows, `nw_views` / `nw_clicks` / `nw_earned` carry what the partner\'s own API reported. 
     * SSP report broken down by one dimension.
     */
    async apiV1PublisherSspStatsDetailsGet(requestParameters: ApiV1PublisherSspStatsDetailsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspStatsDetailsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspStatsFiltersGet without sending the request
     */
    async apiV1PublisherSspStatsFiltersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/stats/filters`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Filter values for the SSP reports.
     */
    async apiV1PublisherSspStatsFiltersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspStatsFiltersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Filter values for the SSP reports.
     */
    async apiV1PublisherSspStatsFiltersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspStatsFiltersGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspStatsFlatGet without sending the request
     */
    async apiV1PublisherSspStatsFlatGetRequestOpts(requestParameters: ApiV1PublisherSspStatsFlatGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['group'] != null) {
            queryParameters['group'] = requestParameters['group'];
        }

        if (requestParameters['viewtype'] != null) {
            queryParameters['viewtype'] = requestParameters['viewtype'];
        }

        if (requestParameters['ssptype'] != null) {
            queryParameters['ssptype'] = requestParameters['ssptype'];
        }

        if (requestParameters['campaignid'] != null) {
            queryParameters['campaignid'] = requestParameters['campaignid'];
        }

        if (requestParameters['networkid'] != null) {
            queryParameters['networkid'] = requestParameters['networkid'];
        }

        if (requestParameters['siteid'] != null) {
            queryParameters['siteid'] = requestParameters['siteid'];
        }

        if (requestParameters['country'] != null) {
            queryParameters['country[]'] = requestParameters['country'];
        }

        if (requestParameters['deviceType'] != null) {
            queryParameters['device_type'] = requestParameters['deviceType'];
        }

        if (requestParameters['adType'] != null) {
            queryParameters['ad_type'] = requestParameters['adType'];
        }

        if (requestParameters['subid'] != null) {
            queryParameters['subid'] = requestParameters['subid'];
        }

        if (requestParameters['filterBidType'] != null) {
            queryParameters['filter_bid_type'] = requestParameters['filterBidType'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/stats/flat`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s flat SSP table. `group` is a comma-separated list of `date`, `campaign`, `country`, `website`, `adzone`, `subid`, `domainid`, `bid_type`, `bid_advid`, `bid_cid`, `bid_adid`, `mxispid` (default `date`); each row carries the grouped values plus `<dim>_name` where a name exists, and `startdate`/`enddate` for the row\'s period. `viewtype` sets the date bucket. At most 10,000 rows. Same filters and money units as `stats/details` (**currency units, not cents**). `totals` sums the whole result. 
     * SSP report grouped by several dimensions.
     */
    async apiV1PublisherSspStatsFlatGetRaw(requestParameters: ApiV1PublisherSspStatsFlatGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspStatsFlatGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s flat SSP table. `group` is a comma-separated list of `date`, `campaign`, `country`, `website`, `adzone`, `subid`, `domainid`, `bid_type`, `bid_advid`, `bid_cid`, `bid_adid`, `mxispid` (default `date`); each row carries the grouped values plus `<dim>_name` where a name exists, and `startdate`/`enddate` for the row\'s period. `viewtype` sets the date bucket. At most 10,000 rows. Same filters and money units as `stats/details` (**currency units, not cents**). `totals` sums the whole result. 
     * SSP report grouped by several dimensions.
     */
    async apiV1PublisherSspStatsFlatGet(requestParameters: ApiV1PublisherSspStatsFlatGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspStatsFlatGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspStatsGet without sending the request
     */
    async apiV1PublisherSspStatsGetRequestOpts(requestParameters: ApiV1PublisherSspStatsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['interval'] != null) {
            queryParameters['interval'] = requestParameters['interval'];
        }

        if (requestParameters['groupBy'] != null) {
            queryParameters['group_by'] = requestParameters['groupBy']!.join(runtime.COLLECTION_FORMATS["csv"]);
        }

        if (requestParameters['metrics'] != null) {
            queryParameters['metrics'] = requestParameters['metrics']!.join(runtime.COLLECTION_FORMATS["csv"]);
        }

        if (requestParameters['filterFeedId'] != null) {
            queryParameters['filter[feed_id]'] = requestParameters['filterFeedId'];
        }

        if (requestParameters['filterCampaignId'] != null) {
            queryParameters['filter[campaign_id]'] = requestParameters['filterCampaignId'];
        }

        if (requestParameters['filterSsptype'] != null) {
            queryParameters['filter[ssptype]'] = requestParameters['filterSsptype'];
        }

        if (requestParameters['filterCountry'] != null) {
            queryParameters['filter[country]'] = requestParameters['filterCountry'];
        }

        if (requestParameters['filterDevice'] != null) {
            queryParameters['filter[device]'] = requestParameters['filterDevice'];
        }

        if (requestParameters['filterAdType'] != null) {
            queryParameters['filter[ad_type]'] = requestParameters['filterAdType'];
        }

        if (requestParameters['filterNetworkId'] != null) {
            queryParameters['filter[network_id]'] = requestParameters['filterNetworkId'];
        }

        if (requestParameters['filterAdzoneId'] != null) {
            queryParameters['filter[adzone_id]'] = requestParameters['filterAdzoneId'];
        }

        if (requestParameters['filterWebsite'] != null) {
            queryParameters['filter[website]'] = requestParameters['filterWebsite'];
        }

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/stats`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * SSP / smart-campaign earnings.  **Scoping (priority order):** 1. `filter[feed_id]` — the SSP feed hash from the campaign row    (the public identifier you give to ad networks). Limits results    to one campaign without exposing the internal numeric ID. 2. `filter[campaign_id]` — internal numeric ID. 3. (default) every SSP campaign owned by the caller, optionally    narrowed with `filter[ssptype]`.  **Authentication — this endpoint accepts two credentials.** Either an account API key with the `stats.read` scope in the `Authorization` header, as everywhere else on this API, or the feed hash itself in `filter[feed_id]` (`token` is accepted as an alias, matching the legacy `/apitool/ssp_stats/` URL). The feed hash authenticates nothing but this report for that one feed, which is what makes the URL safe to hand to an ad network; an account key covers every feed on the account. When an `Authorization` header is present it is always used, so an invalid key is reported as such rather than falling back to the feed hash. 
     * SSP / smart-campaign earnings.
     */
    async apiV1PublisherSspStatsGetRaw(requestParameters: ApiV1PublisherSspStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StatsResponse>> {
        const requestOptions = await this.apiV1PublisherSspStatsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatsResponseFromJSON(jsonValue));
    }

    /**
     * SSP / smart-campaign earnings.  **Scoping (priority order):** 1. `filter[feed_id]` — the SSP feed hash from the campaign row    (the public identifier you give to ad networks). Limits results    to one campaign without exposing the internal numeric ID. 2. `filter[campaign_id]` — internal numeric ID. 3. (default) every SSP campaign owned by the caller, optionally    narrowed with `filter[ssptype]`.  **Authentication — this endpoint accepts two credentials.** Either an account API key with the `stats.read` scope in the `Authorization` header, as everywhere else on this API, or the feed hash itself in `filter[feed_id]` (`token` is accepted as an alias, matching the legacy `/apitool/ssp_stats/` URL). The feed hash authenticates nothing but this report for that one feed, which is what makes the URL safe to hand to an ad network; an account key covers every feed on the account. When an `Authorization` header is present it is always used, so an invalid key is reported as such rather than falling back to the feed hash. 
     * SSP / smart-campaign earnings.
     */
    async apiV1PublisherSspStatsGet(requestParameters: ApiV1PublisherSspStatsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StatsResponse> {
        const response = await this.apiV1PublisherSspStatsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1PublisherSspStatsDetailsGetTypeEnum = {
    Campaign: 'campaign',
    Country: 'country',
    Website: 'website',
    Adzone: 'adzone',
    Network: 'network',
    BidType: 'bid_type',
    Keyword: 'keyword'
} as const;
export type ApiV1PublisherSspStatsDetailsGetTypeEnum = typeof ApiV1PublisherSspStatsDetailsGetTypeEnum[keyof typeof ApiV1PublisherSspStatsDetailsGetTypeEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsDetailsGetSsptypeEnum = {
    Ssp: 'ssp',
    External: 'external',
    Exchange: 'exchange'
} as const;
export type ApiV1PublisherSspStatsDetailsGetSsptypeEnum = typeof ApiV1PublisherSspStatsDetailsGetSsptypeEnum[keyof typeof ApiV1PublisherSspStatsDetailsGetSsptypeEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsFlatGetViewtypeEnum = {
    Day: 'day',
    Week: 'week',
    Month: 'month',
    Year: 'year',
    Sum: 'sum'
} as const;
export type ApiV1PublisherSspStatsFlatGetViewtypeEnum = typeof ApiV1PublisherSspStatsFlatGetViewtypeEnum[keyof typeof ApiV1PublisherSspStatsFlatGetViewtypeEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsFlatGetSsptypeEnum = {
    Ssp: 'ssp',
    External: 'external',
    Exchange: 'exchange'
} as const;
export type ApiV1PublisherSspStatsFlatGetSsptypeEnum = typeof ApiV1PublisherSspStatsFlatGetSsptypeEnum[keyof typeof ApiV1PublisherSspStatsFlatGetSsptypeEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsGetIntervalEnum = {
    Day: 'day',
    Hour: 'hour',
    Week: 'week',
    Month: 'month',
    Sum: 'sum'
} as const;
export type ApiV1PublisherSspStatsGetIntervalEnum = typeof ApiV1PublisherSspStatsGetIntervalEnum[keyof typeof ApiV1PublisherSspStatsGetIntervalEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsGetGroupByEnum = {
    Campaign: 'campaign',
    Country: 'country',
    Website: 'website',
    Adzone: 'adzone',
    Network: 'network'
} as const;
export type ApiV1PublisherSspStatsGetGroupByEnum = typeof ApiV1PublisherSspStatsGetGroupByEnum[keyof typeof ApiV1PublisherSspStatsGetGroupByEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsGetMetricsEnum = {
    Requests: 'requests',
    Wins: 'wins',
    Views: 'views',
    Clicks: 'clicks',
    Ctr: 'ctr',
    Ecpm: 'ecpm',
    Earned: 'earned',
    Errors: 'errors'
} as const;
export type ApiV1PublisherSspStatsGetMetricsEnum = typeof ApiV1PublisherSspStatsGetMetricsEnum[keyof typeof ApiV1PublisherSspStatsGetMetricsEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsGetFilterDeviceEnum = {
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5,
    NUMBER_6: 6
} as const;
export type ApiV1PublisherSspStatsGetFilterDeviceEnum = typeof ApiV1PublisherSspStatsGetFilterDeviceEnum[keyof typeof ApiV1PublisherSspStatsGetFilterDeviceEnum];
/**
 * @export
 */
export const ApiV1PublisherSspStatsGetFormatEnum = {
    Json: 'json',
    Csv: 'csv'
} as const;
export type ApiV1PublisherSspStatsGetFormatEnum = typeof ApiV1PublisherSspStatsGetFormatEnum[keyof typeof ApiV1PublisherSspStatsGetFormatEnum];
