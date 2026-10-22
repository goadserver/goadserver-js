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

import { mapValues } from '../runtime';
import type { SspCampaignWriteZoneurlsInner } from './SspCampaignWriteZoneurlsInner';
import {
    SspCampaignWriteZoneurlsInnerFromJSON,
    SspCampaignWriteZoneurlsInnerFromJSONTyped,
    SspCampaignWriteZoneurlsInnerToJSON,
    SspCampaignWriteZoneurlsInnerToJSONTyped,
} from './SspCampaignWriteZoneurlsInner';
import type { SspCampaignWriteSlotsInner } from './SspCampaignWriteSlotsInner';
import {
    SspCampaignWriteSlotsInnerFromJSON,
    SspCampaignWriteSlotsInnerFromJSONTyped,
    SspCampaignWriteSlotsInnerToJSON,
    SspCampaignWriteSlotsInnerToJSONTyped,
} from './SspCampaignWriteSlotsInner';

/**
 * 
 * @export
 * @interface SspCampaignWrite
 */
export interface SspCampaignWrite {
    /**
     * 
     * @type {string}
     * @memberof SspCampaignWrite
     */
    name: string;
    /**
     * Ad type id (setup-data `ad_types[].id`).
     * @type {number}
     * @memberof SspCampaignWrite
     */
    adtype?: number;
    /**
     * 
     * @type {SspCampaignWriteSsptypeEnum}
     * @memberof SspCampaignWrite
     */
    ssptype?: SspCampaignWriteSsptypeEnum;
    /**
     * openrtb or a legacy XML/JSON template type, per setup-data.
     * @type {string}
     * @memberof SspCampaignWrite
     */
    rtbtype?: string;
    /**
     * external/exchange only; locked after create.
     * @type {boolean}
     * @memberof SspCampaignWrite
     */
    headerBidding?: boolean;
    /**
     * RTB network id (setup-data `rtb_networks`). Required for ssptype=ssp.
     * @type {number}
     * @memberof SspCampaignWrite
     */
    rtbNetwork?: number;
    /**
     * Revenue share in percent (required 1-100 for exchange).
     * @type {number}
     * @memberof SspCampaignWrite
     */
    sspPct?: number;
    /**
     * One of your sites. Required for external and header bidding.
     * @type {number}
     * @memberof SspCampaignWrite
     */
    siteid?: number;
    /**
     * Header-bidding slots.
     * @type {Array<SspCampaignWriteSlotsInner>}
     * @memberof SspCampaignWrite
     */
    slots?: Array<SspCampaignWriteSlotsInner>;
    /**
     * Partner endpoint (ssptype=ssp, use_type 0).
     * @type {string}
     * @memberof SspCampaignWrite
     */
    requestUrl?: string;
    /**
     * ssp only: 0 = one URL, 1 = per-ad-zone URLs, 2 = smart-zone RTB feed.
     * @type {SspCampaignWriteUseTypeEnum}
     * @memberof SspCampaignWrite
     */
    useType?: SspCampaignWriteUseTypeEnum;
    /**
     * use_type 1: per-zone URLs (your own ad zones only; others are dropped).
     * @type {Array<SspCampaignWriteZoneurlsInner>}
     * @memberof SspCampaignWrite
     */
    zoneurls?: Array<SspCampaignWriteZoneurlsInner>;
    /**
     * 
     * @type {number}
     * @memberof SspCampaignWrite
     */
    pType?: number;
    /**
     * 
     * @type {string}
     * @memberof SspCampaignWrite
     */
    admResponseType?: string;
    /**
     * 
     * @type {number}
     * @memberof SspCampaignWrite
     */
    rtbTplId?: number;
    /**
     * 
     * @type {number}
     * @memberof SspCampaignWrite
     */
    bidAction?: number;
    /**
     * Empty = all. A comma-separated string is accepted too (same for every list below).
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    deviceTypeIds?: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    osids?: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    browserids?: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    regionids?: Array<number>;
    /**
     * 
     * @type {Array<string>}
     * @memberof SspCampaignWrite
     */
    browserlanguages?: Array<string>;
    /**
     * 
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    connectionTypes?: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    sspIds?: Array<number>;
    /**
     * From GET .../wl-ron-campaigns.
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    wlRonCampaignIds?: Array<number>;
    /**
     * 
     * @type {Array<string>}
     * @memberof SspCampaignWrite
     */
    rtbCategories?: Array<string>;
    /**
     * Admin only (ignored for API keys).
     * @type {Array<number>}
     * @memberof SspCampaignWrite
     */
    dspIds?: Array<number>;
    /**
     * 
     * @type {string}
     * @memberof SspCampaignWrite
     */
    displayoptions?: string;
    /**
     * 
     * @type {SspCampaignWriteLogSkippedEnum}
     * @memberof SspCampaignWrite
     */
    logSkipped?: SspCampaignWriteLogSkippedEnum;
    /**
     * 
     * @type {SspCampaignWriteUseAdscanEnum}
     * @memberof SspCampaignWrite
     */
    useAdscan?: SspCampaignWriteUseAdscanEnum;
    /**
     * Bill on the OpenRTB burl (external/exchange, openrtb).
     * @type {SspCampaignWriteBillOnBurlEnum}
     * @memberof SspCampaignWrite
     */
    billOnBurl?: SspCampaignWriteBillOnBurlEnum;
    /**
     * 
     * @type {SspCampaignWriteUseOptimiserEnum}
     * @memberof SspCampaignWrite
     */
    useOptimiser?: SspCampaignWriteUseOptimiserEnum;
    /**
     * {disc_rules: [...]}, external/exchange only.
     * @type {object}
     * @memberof SspCampaignWrite
     */
    optimiserData?: object;
    /**
     * 
     * @type {SspCampaignWriteUseApiEnum}
     * @memberof SspCampaignWrite
     */
    useApi?: SspCampaignWriteUseApiEnum;
    /**
     * Partner reporting-API credentials (ssp/external).
     * @type {object}
     * @memberof SspCampaignWrite
     */
    apiData?: object;
}


/**
 * @export
 */
export const SspCampaignWriteSsptypeEnum = {
    Ssp: 'ssp',
    External: 'external',
    Exchange: 'exchange'
} as const;
export type SspCampaignWriteSsptypeEnum = typeof SspCampaignWriteSsptypeEnum[keyof typeof SspCampaignWriteSsptypeEnum];

/**
 * @export
 */
export const SspCampaignWriteUseTypeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2
} as const;
export type SspCampaignWriteUseTypeEnum = typeof SspCampaignWriteUseTypeEnum[keyof typeof SspCampaignWriteUseTypeEnum];

/**
 * @export
 */
export const SspCampaignWriteLogSkippedEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type SspCampaignWriteLogSkippedEnum = typeof SspCampaignWriteLogSkippedEnum[keyof typeof SspCampaignWriteLogSkippedEnum];

/**
 * @export
 */
export const SspCampaignWriteUseAdscanEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type SspCampaignWriteUseAdscanEnum = typeof SspCampaignWriteUseAdscanEnum[keyof typeof SspCampaignWriteUseAdscanEnum];

/**
 * @export
 */
export const SspCampaignWriteBillOnBurlEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type SspCampaignWriteBillOnBurlEnum = typeof SspCampaignWriteBillOnBurlEnum[keyof typeof SspCampaignWriteBillOnBurlEnum];

/**
 * @export
 */
export const SspCampaignWriteUseOptimiserEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type SspCampaignWriteUseOptimiserEnum = typeof SspCampaignWriteUseOptimiserEnum[keyof typeof SspCampaignWriteUseOptimiserEnum];

/**
 * @export
 */
export const SspCampaignWriteUseApiEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type SspCampaignWriteUseApiEnum = typeof SspCampaignWriteUseApiEnum[keyof typeof SspCampaignWriteUseApiEnum];


/**
 * Check if a given object implements the SspCampaignWrite interface.
 */
export function instanceOfSspCampaignWrite(value: object): value is SspCampaignWrite {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function SspCampaignWriteFromJSON(json: any): SspCampaignWrite {
    return SspCampaignWriteFromJSONTyped(json, false);
}

export function SspCampaignWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): SspCampaignWrite {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'adtype': json['adtype'] == null ? undefined : json['adtype'],
        'ssptype': json['ssptype'] == null ? undefined : json['ssptype'],
        'rtbtype': json['rtbtype'] == null ? undefined : json['rtbtype'],
        'headerBidding': json['header_bidding'] == null ? undefined : json['header_bidding'],
        'rtbNetwork': json['rtb_network'] == null ? undefined : json['rtb_network'],
        'sspPct': json['ssp_pct'] == null ? undefined : json['ssp_pct'],
        'siteid': json['siteid'] == null ? undefined : json['siteid'],
        'slots': json['slots'] == null ? undefined : ((json['slots'] as Array<any>).map(SspCampaignWriteSlotsInnerFromJSON)),
        'requestUrl': json['request_url'] == null ? undefined : json['request_url'],
        'useType': json['use_type'] == null ? undefined : json['use_type'],
        'zoneurls': json['zoneurls'] == null ? undefined : ((json['zoneurls'] as Array<any>).map(SspCampaignWriteZoneurlsInnerFromJSON)),
        'pType': json['p_type'] == null ? undefined : json['p_type'],
        'admResponseType': json['adm_response_type'] == null ? undefined : json['adm_response_type'],
        'rtbTplId': json['rtb_tpl_id'] == null ? undefined : json['rtb_tpl_id'],
        'bidAction': json['bid_action'] == null ? undefined : json['bid_action'],
        'deviceTypeIds': json['device_type_ids'] == null ? undefined : json['device_type_ids'],
        'osids': json['osids'] == null ? undefined : json['osids'],
        'browserids': json['browserids'] == null ? undefined : json['browserids'],
        'regionids': json['regionids'] == null ? undefined : json['regionids'],
        'browserlanguages': json['browserlanguages'] == null ? undefined : json['browserlanguages'],
        'connectionTypes': json['connection_types'] == null ? undefined : json['connection_types'],
        'sspIds': json['ssp_ids'] == null ? undefined : json['ssp_ids'],
        'wlRonCampaignIds': json['wl_ron_campaign_ids'] == null ? undefined : json['wl_ron_campaign_ids'],
        'rtbCategories': json['rtb_categories'] == null ? undefined : json['rtb_categories'],
        'dspIds': json['dsp_ids'] == null ? undefined : json['dsp_ids'],
        'displayoptions': json['displayoptions'] == null ? undefined : json['displayoptions'],
        'logSkipped': json['log_skipped'] == null ? undefined : json['log_skipped'],
        'useAdscan': json['use_adscan'] == null ? undefined : json['use_adscan'],
        'billOnBurl': json['bill_on_burl'] == null ? undefined : json['bill_on_burl'],
        'useOptimiser': json['use_optimiser'] == null ? undefined : json['use_optimiser'],
        'optimiserData': json['optimiser_data'] == null ? undefined : json['optimiser_data'],
        'useApi': json['use_api'] == null ? undefined : json['use_api'],
        'apiData': json['api_data'] == null ? undefined : json['api_data'],
    };
}

export function SspCampaignWriteToJSON(json: any): SspCampaignWrite {
    return SspCampaignWriteToJSONTyped(json, false);
}

export function SspCampaignWriteToJSONTyped(value?: SspCampaignWrite | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'adtype': value['adtype'],
        'ssptype': value['ssptype'],
        'rtbtype': value['rtbtype'],
        'header_bidding': value['headerBidding'],
        'rtb_network': value['rtbNetwork'],
        'ssp_pct': value['sspPct'],
        'siteid': value['siteid'],
        'slots': value['slots'] == null ? undefined : ((value['slots'] as Array<any>).map(SspCampaignWriteSlotsInnerToJSON)),
        'request_url': value['requestUrl'],
        'use_type': value['useType'],
        'zoneurls': value['zoneurls'] == null ? undefined : ((value['zoneurls'] as Array<any>).map(SspCampaignWriteZoneurlsInnerToJSON)),
        'p_type': value['pType'],
        'adm_response_type': value['admResponseType'],
        'rtb_tpl_id': value['rtbTplId'],
        'bid_action': value['bidAction'],
        'device_type_ids': value['deviceTypeIds'],
        'osids': value['osids'],
        'browserids': value['browserids'],
        'regionids': value['regionids'],
        'browserlanguages': value['browserlanguages'],
        'connection_types': value['connectionTypes'],
        'ssp_ids': value['sspIds'],
        'wl_ron_campaign_ids': value['wlRonCampaignIds'],
        'rtb_categories': value['rtbCategories'],
        'dsp_ids': value['dspIds'],
        'displayoptions': value['displayoptions'],
        'log_skipped': value['logSkipped'],
        'use_adscan': value['useAdscan'],
        'bill_on_burl': value['billOnBurl'],
        'use_optimiser': value['useOptimiser'],
        'optimiser_data': value['optimiserData'],
        'use_api': value['useApi'],
        'api_data': value['apiData'],
    };
}

