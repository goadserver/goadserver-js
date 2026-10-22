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
  ApiV1PublisherOffersPostbackLogGet200Response,
  StatsResponse,
} from '../models/index';
import {
    ApiV1PublisherOffersPostbackLogGet200ResponseFromJSON,
    ApiV1PublisherOffersPostbackLogGet200ResponseToJSON,
    StatsResponseFromJSON,
    StatsResponseToJSON,
} from '../models/index';

export interface ApiV1PublisherOffersPostbackLogGetRequest {
    from?: Date;
    to?: Date;
    siteId?: number;
}

export interface ApiV1PublisherOffersStatsGetRequest {
    from?: Date;
    to?: Date;
    interval?: ApiV1PublisherOffersStatsGetIntervalEnum;
    groupBy?: Array<ApiV1PublisherOffersStatsGetGroupByEnum>;
    metrics?: Array<ApiV1PublisherOffersStatsGetMetricsEnum>;
    filterOfferId?: number;
    filterOfferTypeId?: number;
    filterWebsite?: number;
    filterAdzoneId?: string;
    filterDevice?: ApiV1PublisherOffersStatsGetFilterDeviceEnum;
    filterCountry?: string;
    filterSubid?: string;
    format?: ApiV1PublisherOffersStatsGetFormatEnum;
    page?: number;
    perPage?: number;
    sort?: string;
}

/**
 * 
 */
export class StatsAffiliateApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1PublisherOffersPostbackLogGet without sending the request
     */
    async apiV1PublisherOffersPostbackLogGetRequestOpts(requestParameters: ApiV1PublisherOffersPostbackLogGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['siteId'] != null) {
            queryParameters['site_id'] = requestParameters['siteId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/offers/postback-log`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The panel\'s Offer Reports → Postback Log. One row per postback the platform fired to the publisher\'s postback URL, newest first, capped at 1000 rows (no paging). `status` is `Success` for HTTP 200 (or an unrecorded state) and `Failed (<state>)` otherwise. Date params that are missing or not `YYYY-MM-DD` fall back to the last 7 days. 
     * Postback log — the conversion postbacks fired to your URLs.
     */
    async apiV1PublisherOffersPostbackLogGetRaw(requestParameters: ApiV1PublisherOffersPostbackLogGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherOffersPostbackLogGet200Response>> {
        const requestOptions = await this.apiV1PublisherOffersPostbackLogGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherOffersPostbackLogGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The panel\'s Offer Reports → Postback Log. One row per postback the platform fired to the publisher\'s postback URL, newest first, capped at 1000 rows (no paging). `status` is `Success` for HTTP 200 (or an unrecorded state) and `Failed (<state>)` otherwise. Date params that are missing or not `YYYY-MM-DD` fall back to the last 7 days. 
     * Postback log — the conversion postbacks fired to your URLs.
     */
    async apiV1PublisherOffersPostbackLogGet(requestParameters: ApiV1PublisherOffersPostbackLogGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherOffersPostbackLogGet200Response> {
        const response = await this.apiV1PublisherOffersPostbackLogGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherOffersStatsGet without sending the request
     */
    async apiV1PublisherOffersStatsGetRequestOpts(requestParameters: ApiV1PublisherOffersStatsGetRequest): Promise<runtime.RequestOpts> {
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

        if (requestParameters['filterOfferId'] != null) {
            queryParameters['filter[offer_id]'] = requestParameters['filterOfferId'];
        }

        if (requestParameters['filterOfferTypeId'] != null) {
            queryParameters['filter[offer_type_id]'] = requestParameters['filterOfferTypeId'];
        }

        if (requestParameters['filterWebsite'] != null) {
            queryParameters['filter[website]'] = requestParameters['filterWebsite'];
        }

        if (requestParameters['filterAdzoneId'] != null) {
            queryParameters['filter[adzone_id]'] = requestParameters['filterAdzoneId'];
        }

        if (requestParameters['filterDevice'] != null) {
            queryParameters['filter[device]'] = requestParameters['filterDevice'];
        }

        if (requestParameters['filterCountry'] != null) {
            queryParameters['filter[country]'] = requestParameters['filterCountry'];
        }

        if (requestParameters['filterSubid'] != null) {
            queryParameters['filter[subid]'] = requestParameters['filterSubid'];
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

        let urlPath = `/api/v1/publisher/offers/stats`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Affiliate / smartlink offer performance for the publisher. `earned` and `epc` are in the account currency (currency units, not cents). 
     * Affiliate / smartlink offer performance — publisher side.
     */
    async apiV1PublisherOffersStatsGetRaw(requestParameters: ApiV1PublisherOffersStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StatsResponse>> {
        const requestOptions = await this.apiV1PublisherOffersStatsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatsResponseFromJSON(jsonValue));
    }

    /**
     * Affiliate / smartlink offer performance for the publisher. `earned` and `epc` are in the account currency (currency units, not cents). 
     * Affiliate / smartlink offer performance — publisher side.
     */
    async apiV1PublisherOffersStatsGet(requestParameters: ApiV1PublisherOffersStatsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StatsResponse> {
        const response = await this.apiV1PublisherOffersStatsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1PublisherOffersStatsGetIntervalEnum = {
    Day: 'day',
    Hour: 'hour',
    Week: 'week',
    Month: 'month',
    Sum: 'sum'
} as const;
export type ApiV1PublisherOffersStatsGetIntervalEnum = typeof ApiV1PublisherOffersStatsGetIntervalEnum[keyof typeof ApiV1PublisherOffersStatsGetIntervalEnum];
/**
 * @export
 */
export const ApiV1PublisherOffersStatsGetGroupByEnum = {
    Offer: 'offer',
    Country: 'country',
    Device: 'device',
    Os: 'os',
    Browser: 'browser',
    Domain: 'domain',
    Subid: 'subid',
    Website: 'website',
    Adzone: 'adzone',
    Sid1: 'sid1',
    Sid2: 'sid2',
    Sid3: 'sid3',
    Sid4: 'sid4',
    Sid5: 'sid5',
    Clickid: 'clickid'
} as const;
export type ApiV1PublisherOffersStatsGetGroupByEnum = typeof ApiV1PublisherOffersStatsGetGroupByEnum[keyof typeof ApiV1PublisherOffersStatsGetGroupByEnum];
/**
 * @export
 */
export const ApiV1PublisherOffersStatsGetMetricsEnum = {
    Clicks: 'clicks',
    Conversions: 'conversions',
    Cr: 'cr',
    Epc: 'epc',
    Earned: 'earned',
    ConvA: 'conv_a',
    ConvB: 'conv_b',
    ConvC: 'conv_c'
} as const;
export type ApiV1PublisherOffersStatsGetMetricsEnum = typeof ApiV1PublisherOffersStatsGetMetricsEnum[keyof typeof ApiV1PublisherOffersStatsGetMetricsEnum];
/**
 * @export
 */
export const ApiV1PublisherOffersStatsGetFilterDeviceEnum = {
    NUMBER_1: 1,
    NUMBER_2: 2,
    NUMBER_3: 3,
    NUMBER_4: 4,
    NUMBER_5: 5,
    NUMBER_6: 6
} as const;
export type ApiV1PublisherOffersStatsGetFilterDeviceEnum = typeof ApiV1PublisherOffersStatsGetFilterDeviceEnum[keyof typeof ApiV1PublisherOffersStatsGetFilterDeviceEnum];
/**
 * @export
 */
export const ApiV1PublisherOffersStatsGetFormatEnum = {
    Json: 'json',
    Csv: 'csv'
} as const;
export type ApiV1PublisherOffersStatsGetFormatEnum = typeof ApiV1PublisherOffersStatsGetFormatEnum[keyof typeof ApiV1PublisherOffersStatsGetFormatEnum];
