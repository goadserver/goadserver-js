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

export interface ApiV1AdvertiserStatsGetRequest {
    from?: Date;
    to?: Date;
    interval?: ApiV1AdvertiserStatsGetIntervalEnum;
    groupBy?: Array<ApiV1AdvertiserStatsGetGroupByEnum>;
    metrics?: Array<ApiV1AdvertiserStatsGetMetricsEnum>;
    filterCampaignId?: string;
    filterAdId?: string;
    filterTagId?: string;
    filterAdType?: number;
    filterSellingType?: string;
    filterAdzoneType?: string;
    filterDevice?: ApiV1AdvertiserStatsGetFilterDeviceEnum;
    filterCountry?: string;
    filterAdzoneId?: string;
    filterSiteId?: string;
    filterNetworkId?: number;
    filterBidrulesetId?: number;
    filterBidruleId?: number;
    filterCreativePoolId?: number;
    filterCreativePoolAdId?: number;
    format?: ApiV1AdvertiserStatsGetFormatEnum;
    page?: number;
    perPage?: number;
    sort?: string;
    min?: { [key: string]: number; };
    max?: { [key: string]: number; };
    strict?: ApiV1AdvertiserStatsGetStrictEnum;
}

/**
 * 
 */
export class StatsAdvertiserApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1AdvertiserStatsGet without sending the request
     */
    async apiV1AdvertiserStatsGetRequestOpts(requestParameters: ApiV1AdvertiserStatsGetRequest): Promise<runtime.RequestOpts> {
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

        if (requestParameters['filterCampaignId'] != null) {
            queryParameters['filter[campaign_id]'] = requestParameters['filterCampaignId'];
        }

        if (requestParameters['filterAdId'] != null) {
            queryParameters['filter[ad_id]'] = requestParameters['filterAdId'];
        }

        if (requestParameters['filterTagId'] != null) {
            queryParameters['filter[tag_id]'] = requestParameters['filterTagId'];
        }

        if (requestParameters['filterAdType'] != null) {
            queryParameters['filter[ad_type]'] = requestParameters['filterAdType'];
        }

        if (requestParameters['filterSellingType'] != null) {
            queryParameters['filter[selling_type]'] = requestParameters['filterSellingType'];
        }

        if (requestParameters['filterAdzoneType'] != null) {
            queryParameters['filter[adzone_type]'] = requestParameters['filterAdzoneType'];
        }

        if (requestParameters['filterDevice'] != null) {
            queryParameters['filter[device]'] = requestParameters['filterDevice'];
        }

        if (requestParameters['filterCountry'] != null) {
            queryParameters['filter[country]'] = requestParameters['filterCountry'];
        }

        if (requestParameters['filterAdzoneId'] != null) {
            queryParameters['filter[adzone_id]'] = requestParameters['filterAdzoneId'];
        }

        if (requestParameters['filterSiteId'] != null) {
            queryParameters['filter[site_id]'] = requestParameters['filterSiteId'];
        }

        if (requestParameters['filterNetworkId'] != null) {
            queryParameters['filter[network_id]'] = requestParameters['filterNetworkId'];
        }

        if (requestParameters['filterBidrulesetId'] != null) {
            queryParameters['filter[bidruleset_id]'] = requestParameters['filterBidrulesetId'];
        }

        if (requestParameters['filterBidruleId'] != null) {
            queryParameters['filter[bidrule_id]'] = requestParameters['filterBidruleId'];
        }

        if (requestParameters['filterCreativePoolId'] != null) {
            queryParameters['filter[creative_pool_id]'] = requestParameters['filterCreativePoolId'];
        }

        if (requestParameters['filterCreativePoolAdId'] != null) {
            queryParameters['filter[creative_pool_ad_id]'] = requestParameters['filterCreativePoolAdId'];
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

        if (requestParameters['min'] != null) {
            for (let key of Object.keys(requestParameters['min'])) {
                queryParameters[key] = requestParameters['min'][key];
            }
        }

        if (requestParameters['max'] != null) {
            for (let key of Object.keys(requestParameters['max'])) {
                queryParameters[key] = requestParameters['max'][key];
            }
        }

        if (requestParameters['strict'] != null) {
            queryParameters['strict'] = requestParameters['strict'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/advertiser/stats`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Aggregated performance for the advertiser\'s campaigns. Pick the dimensions to group by, the metrics you want returned, and any filters — the form below auto-builds the query.  The numbers are the panel\'s Stats screen numbers: the same aggregate and the same formulas (revenue, profit, ROI, CPA, CR, eCPC, traffic cost and the bot breakdown included), over `userstats_daily` (or `userstats_daily_details` when a grouped dimension or filter needs it).  **Money unit:** every money metric (`paid`, `cpm_paid`, `cpc_paid`, `ecpm`, `ecpc`, `conv_*_earned`, `revenue`, `profit`, `cpa`, `traffic_cost`) is in the account currency\'s **main unit** (dollars/euros, not cents), rounded to 4 decimals. `ctr`, `cr`, `roi` and the `bot_*_pct` metrics are percentages.  **Dates:** `from` and `to` are used only when *both* are given and valid; otherwise the range is the last 7 days ending today (a lone `from` is ignored). Max range 92 days.  A key made by a team member whose role is limited to their own campaigns sees only those campaigns, as in the panel. A key pinned to campaigns sees only those campaigns.  **Several values:** `filter[ad_type]`, `filter[device]` and `filter[country]` also take a comma-separated list (`filter[country]=NL,DE`), matching any of them — the panel\'s multi-select filters send the same. 
     * Display, native and CPM/RON campaign stats.
     */
    async apiV1AdvertiserStatsGetRaw(requestParameters: ApiV1AdvertiserStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StatsResponse>> {
        const requestOptions = await this.apiV1AdvertiserStatsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatsResponseFromJSON(jsonValue));
    }

    /**
     * Aggregated performance for the advertiser\'s campaigns. Pick the dimensions to group by, the metrics you want returned, and any filters — the form below auto-builds the query.  The numbers are the panel\'s Stats screen numbers: the same aggregate and the same formulas (revenue, profit, ROI, CPA, CR, eCPC, traffic cost and the bot breakdown included), over `userstats_daily` (or `userstats_daily_details` when a grouped dimension or filter needs it).  **Money unit:** every money metric (`paid`, `cpm_paid`, `cpc_paid`, `ecpm`, `ecpc`, `conv_*_earned`, `revenue`, `profit`, `cpa`, `traffic_cost`) is in the account currency\'s **main unit** (dollars/euros, not cents), rounded to 4 decimals. `ctr`, `cr`, `roi` and the `bot_*_pct` metrics are percentages.  **Dates:** `from` and `to` are used only when *both* are given and valid; otherwise the range is the last 7 days ending today (a lone `from` is ignored). Max range 92 days.  A key made by a team member whose role is limited to their own campaigns sees only those campaigns, as in the panel. A key pinned to campaigns sees only those campaigns.  **Several values:** `filter[ad_type]`, `filter[device]` and `filter[country]` also take a comma-separated list (`filter[country]=NL,DE`), matching any of them — the panel\'s multi-select filters send the same. 
     * Display, native and CPM/RON campaign stats.
     */
    async apiV1AdvertiserStatsGet(requestParameters: ApiV1AdvertiserStatsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StatsResponse> {
        const response = await this.apiV1AdvertiserStatsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1AdvertiserStatsGetIntervalEnum = {
    Day: 'day',
    Hour: 'hour',
    Week: 'week',
    Month: 'month',
    Sum: 'sum'
} as const;
export type ApiV1AdvertiserStatsGetIntervalEnum = typeof ApiV1AdvertiserStatsGetIntervalEnum[keyof typeof ApiV1AdvertiserStatsGetIntervalEnum];
/**
 * @export
 */
export const ApiV1AdvertiserStatsGetGroupByEnum = {
    Campaign: 'campaign',
    Ad: 'ad',
    Adtype: 'adtype',
    AdzoneType: 'adzone_type',
    SellingType: 'selling_type',
    Adzone: 'adzone',
    Website: 'website',
    Publisher: 'publisher',
    Device: 'device',
    Country: 'country',
    Os: 'os',
    Browser: 'browser',
    Isp: 'isp',
    Domain: 'domain',
    Subid: 'subid',
    Sid1: 'sid1',
    Sid2: 'sid2',
    Sid3: 'sid3',
    Sid4: 'sid4',
    Sid5: 'sid5',
    CreativePool: 'creative_pool',
    CreativePoolAd: 'creative_pool_ad',
    UrlPool: 'url_pool',
    UrlPoolAd: 'url_pool_ad',
    Bidruleset: 'bidruleset',
    Bidrule: 'bidrule'
} as const;
export type ApiV1AdvertiserStatsGetGroupByEnum = typeof ApiV1AdvertiserStatsGetGroupByEnum[keyof typeof ApiV1AdvertiserStatsGetGroupByEnum];
/**
 * @export
 */
export const ApiV1AdvertiserStatsGetMetricsEnum = {
    All: 'all',
    Views: 'views',
    Clicks: 'clicks',
    Ctr: 'ctr',
    Ecpm: 'ecpm',
    Paid: 'paid',
    ConvA: 'conv_a',
    ConvB: 'conv_b',
    ConvC: 'conv_c',
    Ecpc: 'ecpc',
    CpmViews: 'cpm_views',
    CpmPaid: 'cpm_paid',
    CpcClicks: 'cpc_clicks',
    CpcPaid: 'cpc_paid',
    ConvAEarned: 'conv_a_earned',
    ConvBEarned: 'conv_b_earned',
    ConvCEarned: 'conv_c_earned',
    Revenue: 'revenue',
    Profit: 'profit',
    Roi: 'roi',
    Cpa: 'cpa',
    Cr: 'cr',
    TrafficCost: 'traffic_cost',
    NwViews: 'nw_views',
    NwClicks: 'nw_clicks',
    BotViews: 'bot_views',
    BotClicks: 'bot_clicks',
    BotViewsPct: 'bot_views_pct',
    BotClicksPct: 'bot_clicks_pct',
    BotUnknown: 'bot_unknown',
    BotClick: 'bot_click',
    BotImpression: 'bot_impression',
    BotConversion: 'bot_conversion',
    BotWeb: 'bot_web',
    BotHighFrequency: 'bot_high_frequency',
    BotArtificialIp: 'bot_artificial_ip',
    BotAdspaceAbuse: 'bot_adspace_abuse',
    BotSuspicious: 'bot_suspicious',
    BotDatacenter: 'bot_datacenter',
    BotVpn: 'bot_vpn'
} as const;
export type ApiV1AdvertiserStatsGetMetricsEnum = typeof ApiV1AdvertiserStatsGetMetricsEnum[keyof typeof ApiV1AdvertiserStatsGetMetricsEnum];
/**
 * @export
 */
export const ApiV1AdvertiserStatsGetFilterDeviceEnum = {
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5,
    NUMBER_6: 6
} as const;
export type ApiV1AdvertiserStatsGetFilterDeviceEnum = typeof ApiV1AdvertiserStatsGetFilterDeviceEnum[keyof typeof ApiV1AdvertiserStatsGetFilterDeviceEnum];
/**
 * @export
 */
export const ApiV1AdvertiserStatsGetFormatEnum = {
    Json: 'json',
    Csv: 'csv'
} as const;
export type ApiV1AdvertiserStatsGetFormatEnum = typeof ApiV1AdvertiserStatsGetFormatEnum[keyof typeof ApiV1AdvertiserStatsGetFormatEnum];
/**
 * @export
 */
export const ApiV1AdvertiserStatsGetStrictEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1AdvertiserStatsGetStrictEnum = typeof ApiV1AdvertiserStatsGetStrictEnum[keyof typeof ApiV1AdvertiserStatsGetStrictEnum];
