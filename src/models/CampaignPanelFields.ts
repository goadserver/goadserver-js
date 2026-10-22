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
import type { CampaignPanelFieldsAboutSettings } from './CampaignPanelFieldsAboutSettings';
import {
    CampaignPanelFieldsAboutSettingsFromJSON,
    CampaignPanelFieldsAboutSettingsFromJSONTyped,
    CampaignPanelFieldsAboutSettingsToJSON,
    CampaignPanelFieldsAboutSettingsToJSONTyped,
} from './CampaignPanelFieldsAboutSettings';
import type { CampaignPanelFieldsAvCheck } from './CampaignPanelFieldsAvCheck';
import {
    CampaignPanelFieldsAvCheckFromJSON,
    CampaignPanelFieldsAvCheckFromJSONTyped,
    CampaignPanelFieldsAvCheckToJSON,
    CampaignPanelFieldsAvCheckToJSONTyped,
} from './CampaignPanelFieldsAvCheck';
import type { CampaignPanelFieldsBoosterSettings } from './CampaignPanelFieldsBoosterSettings';
import {
    CampaignPanelFieldsBoosterSettingsFromJSON,
    CampaignPanelFieldsBoosterSettingsFromJSONTyped,
    CampaignPanelFieldsBoosterSettingsToJSON,
    CampaignPanelFieldsBoosterSettingsToJSONTyped,
} from './CampaignPanelFieldsBoosterSettings';
import type { CampaignPanelFieldsSuggestions } from './CampaignPanelFieldsSuggestions';
import {
    CampaignPanelFieldsSuggestionsFromJSON,
    CampaignPanelFieldsSuggestionsFromJSONTyped,
    CampaignPanelFieldsSuggestionsToJSON,
    CampaignPanelFieldsSuggestionsToJSONTyped,
} from './CampaignPanelFieldsSuggestions';
import type { CampaignPanelFieldsScreens } from './CampaignPanelFieldsScreens';
import {
    CampaignPanelFieldsScreensFromJSON,
    CampaignPanelFieldsScreensFromJSONTyped,
    CampaignPanelFieldsScreensToJSON,
    CampaignPanelFieldsScreensToJSONTyped,
} from './CampaignPanelFieldsScreens';
import type { CampaignPanelFieldsConversionCapping } from './CampaignPanelFieldsConversionCapping';
import {
    CampaignPanelFieldsConversionCappingFromJSON,
    CampaignPanelFieldsConversionCappingFromJSONTyped,
    CampaignPanelFieldsConversionCappingToJSON,
    CampaignPanelFieldsConversionCappingToJSONTyped,
} from './CampaignPanelFieldsConversionCapping';
import type { CampaignPanelFieldsDayParting } from './CampaignPanelFieldsDayParting';
import {
    CampaignPanelFieldsDayPartingFromJSON,
    CampaignPanelFieldsDayPartingFromJSONTyped,
    CampaignPanelFieldsDayPartingToJSON,
    CampaignPanelFieldsDayPartingToJSONTyped,
} from './CampaignPanelFieldsDayParting';
import type { CampaignPanelFieldsDomainMask } from './CampaignPanelFieldsDomainMask';
import {
    CampaignPanelFieldsDomainMaskFromJSON,
    CampaignPanelFieldsDomainMaskFromJSONTyped,
    CampaignPanelFieldsDomainMaskToJSON,
    CampaignPanelFieldsDomainMaskToJSONTyped,
} from './CampaignPanelFieldsDomainMask';
import type { CampaignPanelFieldsFeedSettings } from './CampaignPanelFieldsFeedSettings';
import {
    CampaignPanelFieldsFeedSettingsFromJSON,
    CampaignPanelFieldsFeedSettingsFromJSONTyped,
    CampaignPanelFieldsFeedSettingsToJSON,
    CampaignPanelFieldsFeedSettingsToJSONTyped,
} from './CampaignPanelFieldsFeedSettings';
import type { CampaignPanelFieldsPriority } from './CampaignPanelFieldsPriority';
import {
    CampaignPanelFieldsPriorityFromJSON,
    CampaignPanelFieldsPriorityFromJSONTyped,
    CampaignPanelFieldsPriorityToJSON,
    CampaignPanelFieldsPriorityToJSONTyped,
} from './CampaignPanelFieldsPriority';

/**
 * Campaign-form fields for `ron` / `cpm` / `rtb` campaigns, writable on
 * `POST /api/v1/campaigns/{type}` and `PATCH /api/v1/campaigns/{type}/{id}`
 * and returned by list / show (option fields when stored). Which of them a
 * campaign takes depends on its type, the network's modules, its ad type
 * and its pay type — `GET /api/v1/campaigns/{type}/_schema` lists exactly
 * the ones available to you (`?ad_type=` narrows it), with `ad_types` /
 * `selling_types` restrictions. Sending one that is not available is a
 * `422` naming the field (for example
 * `"orientation applies only to ad type(s) 3, 22."`), not a silent drop.
 * Object fields merge on PATCH: keys you omit keep their stored value.
 * Money is in main currency units (not cents).
 * 
 * @export
 * @interface CampaignPanelFields
 */
export interface CampaignPanelFields {
    /**
     * Campaign tags / groups: comma-separated group ids ("0" = none). A JSON array is accepted.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    groupid?: string;
    /**
     * Display options for the ad type (e.g. video roll position), comma-separated ids.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    displayOptions?: string;
    /**
     * Minimum ad zone quality rank (flat campaigns on networks that rank ad zones). Not the same as `priority`.
     * @type {number}
     * @memberof CampaignPanelFields
     */
    minRank?: number;
    /**
     * Fixed rating flag (advanced).
     * @type {number}
     * @memberof CampaignPanelFields
     */
    fxRating?: number;
    /**
     * ron/cpm: email the account when `total_budget` is reached. Where the network offers lifetime budgets.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    mailCampaignBudget?: boolean;
    /**
     * ron CPC/CPM (`selling_type` 0/1): let the bid rise automatically by up to `dynamic_costs_increase` percent.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    useDynamicCosts?: boolean;
    /**
     * Maximum dynamic-cost increase in percent.
     * @type {number}
     * @memberof CampaignPanelFields
     */
    dynamicCostsIncrease?: number;
    /**
     * 
     * @type {CampaignPanelFieldsConversionCapping}
     * @memberof CampaignPanelFields
     */
    conversionCapping?: CampaignPanelFieldsConversionCapping;
    /**
     * ron/cpm CPA goal in main currency. After create only your account manager changes it, except on AdManager networks (a PATCH with a different value is a 422; the same value is a no-op).
     * @type {number}
     * @memberof CampaignPanelFields
     */
    fixCpa?: number;
    /**
     * Conversion type ids the CPA goal counts (empty = all). A JSON array is accepted.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    fixCpaConvTypes?: string;
    /**
     * ron CPA (`selling_type` 2): AdBooster, where the network licenses it.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    booster?: boolean;
    /**
     * 
     * @type {CampaignPanelFieldsBoosterSettings}
     * @memberof CampaignPanelFields
     */
    boosterSettings?: CampaignPanelFieldsBoosterSettings;
    /**
     * ron: smart bidding on (1) / off (0), for CPC or CPM where the network lets users switch it on.
     * @type {CampaignPanelFieldsDefaultBidTypeEnum}
     * @memberof CampaignPanelFields
     */
    defaultBidType?: CampaignPanelFieldsDefaultBidTypeEnum;
    /**
     * ron: ad sorting — 0 = eCPM, 1 = random, 2 = weighted. Any pay type (CPC/CPM: random or weighted skips smart-bid repricing). Not for offers.
     * @type {number}
     * @memberof CampaignPanelFields
     */
    sortType?: number;
    /**
     * ron (AdManager networks, not flat): serve only as failover.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    asFailover?: boolean;
    /**
     * 
     * @type {CampaignPanelFieldsDayParting}
     * @memberof CampaignPanelFields
     */
    dayParting?: CampaignPanelFieldsDayParting;
    /**
     * 
     * @type {CampaignPanelFieldsScreens}
     * @memberof CampaignPanelFields
     */
    screens?: CampaignPanelFieldsScreens;
    /**
     * Legacy daily time windows (pipe-separated; overlaps merged). Superseded by `day_parting`.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    displayTimes?: string;
    /**
     * Legacy weekday list ("0" = every day). Superseded by `day_parting`.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    displayDays?: string;
    /**
     * Website language codes ("0" = all). A JSON array is accepted.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    siteLanguages?: string;
    /**
     * Connection type ids ("0" = all). A JSON array is accepted.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    connectionTypes?: string;
    /**
     * ron: mobile carrier ids ("0" = all); meaningful with `connection_types` = "2" and no IP pool.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    carrierIds?: string;
    /**
     * Content rating id, where the network uses ratings.
     * @type {number}
     * @memberof CampaignPanelFields
     */
    ratingId?: number;
    /**
     * ron/cpm ad types 3 and 22.
     * @type {CampaignPanelFieldsOrientationEnum}
     * @memberof CampaignPanelFields
     */
    orientation?: CampaignPanelFieldsOrientationEnum;
    /**
     * ron: 0 = RON (all sites), 1 = Premium sites (display only; may need a minimum balance). Read back with the admin-set `sites_locked`.
     * @type {CampaignPanelFieldsSiteModeEnum}
     * @memberof CampaignPanelFields
     */
    siteMode?: CampaignPanelFieldsSiteModeEnum;
    /**
     * ron/cpm on AdManager networks: only run on ad zones sharing one of the campaign's groups.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    onlyTaggedZones?: boolean;
    /**
     * ron/cpm (not flat): low-quality traffic 0 = accept, 1 = block, 2 = target only.
     * @type {CampaignPanelFieldsSkipLowQualityEnum}
     * @memberof CampaignPanelFields
     */
    skipLowQuality?: CampaignPanelFieldsSkipLowQualityEnum;
    /**
     * IP allow list, one entry per line (IPv4/IPv6, CIDR or `a|b` ranges); each line is validated. A JSON array is accepted.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    ipWhitelist?: string;
    /**
     * IP deny list, same syntax. An IP on both lists is blocked.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    ipBlacklist?: string;
    /**
     * 
     * @type {CampaignPanelFieldsAvCheck}
     * @memberof CampaignPanelFields
     */
    avCheck?: CampaignPanelFieldsAvCheck;
    /**
     * ron/rtb email ads (ad type 15): 0 = accept all, 1 = email only, 2 = non-email only.
     * @type {CampaignPanelFieldsEmailTypeEnum}
     * @memberof CampaignPanelFields
     */
    emailType?: CampaignPanelFieldsEmailTypeEnum;
    /**
     * ron push ads (ad type 7).
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    useSubscriptionAge?: boolean;
    /**
     * 
     * @type {number}
     * @memberof CampaignPanelFields
     */
    subscriptionAge?: number;
    /**
     * ron video (ad type 4) on AdManager networks.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    instantImpression?: boolean;
    /**
     * ron/cpm (not flat): SubIDs to filter on, one per line or comma-separated (empty clears). Stored as the campaign's SubID filter.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    subidList?: string;
    /**
     * 
     * @type {CampaignPanelFieldsSubidListModeEnum}
     * @memberof CampaignPanelFields
     */
    subidListMode?: CampaignPanelFieldsSubidListModeEnum;
    /**
     * ron: your own active source optimizers, at most one per filter type; ids that are not yours are dropped. "0" detaches all.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    sourceOptimizerIds?: string;
    /**
     * cpm: ad zone ids the campaign is pinned to (empty = all).
     * @type {string}
     * @memberof CampaignPanelFields
     */
    wlZoneIds?: string;
    /**
     * ron ad types 3 / 22: one of your XML feeds (0 = none).
     * @type {number}
     * @memberof CampaignPanelFields
     */
    feedId?: number;
    /**
     * 
     * @type {CampaignPanelFieldsFeedSettings}
     * @memberof CampaignPanelFields
     */
    feedSettings?: CampaignPanelFieldsFeedSettings;
    /**
     * 
     * @type {CampaignPanelFieldsPriority}
     * @memberof CampaignPanelFields
     */
    priority?: CampaignPanelFieldsPriority;
    /**
     * 
     * @type {CampaignPanelFieldsSuggestions}
     * @memberof CampaignPanelFields
     */
    suggestions?: CampaignPanelFieldsSuggestions;
    /**
     * ron/rtb on AdManager networks (options): JS redirect so the landing page sees the ad server as referrer.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    hideReferrer?: boolean;
    /**
     * ron on AdManager networks where you own an SSP campaign (options): book spend as Traffic Cost and conversions as Paid. Defaults to true on new campaigns there.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    logConvAsPaid?: boolean;
    /**
     * 
     * @type {CampaignPanelFieldsAboutSettings}
     * @memberof CampaignPanelFields
     */
    aboutSettings?: CampaignPanelFieldsAboutSettings;
    /**
     * ron video (ad type 4): live HLS feed, where the network offers it (not on AdNetwork networks).
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    useLiveFeed?: boolean;
    /**
     * One of your master-feed video campaigns (0 = this campaign is a master feed).
     * @type {number}
     * @memberof CampaignPanelFields
     */
    liveFeedParentId?: number;
    /**
     * {hls_provider, campaign, gender, resize_to, bid, desturl_macro, desturl_type, use_logo}. hls_provider: chaturbate, bongacams or camsoda; campaign: the provider's affiliate/campaign id (CamSoda: your affiliate id); gender: f, m, t or c; desturl_type (chat_room_url or chat_room_url_revshare) is Chaturbate only; desturl_macro fills the link's tracking slot (CamSoda: appended to the link as query text, e.g. sub_id={clickid}).
     * @type {{ [key: string]: any; }}
     * @memberof CampaignPanelFields
     */
    liveFeedSettings?: { [key: string]: any; };
    /**
     * ron offers (ad type 21).
     * @type {number}
     * @memberof CampaignPanelFields
     */
    offerTypeId?: number;
    /**
     * ron offers (ad type 21): the offer description (stored on the offer's ad).
     * @type {string}
     * @memberof CampaignPanelFields
     */
    description?: string;
    /**
     * ron offers (ad type 21): http(s) destination URL (include `{tracking}` for CPA offers).
     * @type {string}
     * @memberof CampaignPanelFields
     */
    destinationUrl?: string;
    /**
     * ron offers (ad type 21): http(s) preview URL.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    previewUrl?: string;
    /**
     * rtb: an active RTB network of this tenant. Ignored when your account is locked to one network.
     * @type {number}
     * @memberof CampaignPanelFields
     */
    rtbNetworkId?: number;
    /**
     * rtb protocol; json / xml only for ad types 7, 11, 15.
     * @type {CampaignPanelFieldsRtbTypeEnum}
     * @memberof CampaignPanelFields
     */
    rtbType?: CampaignPanelFieldsRtbTypeEnum;
    /**
     * rtb: 0 = one `request_url`; 1 = a URL per zone in `zone_urls` (then `request_url` is optional).
     * @type {CampaignPanelFieldsUseTypeEnum}
     * @memberof CampaignPanelFields
     */
    useType?: CampaignPanelFieldsUseTypeEnum;
    /**
     * rtb URLs per zone (use_type 1).
     * @type {Array<object>}
     * @memberof CampaignPanelFields
     */
    zoneUrls?: Array<object>;
    /**
     * rtb OpenRTB auction: 1 = first price, 2 = second price.
     * @type {CampaignPanelFieldsBidActionEnum}
     * @memberof CampaignPanelFields
     */
    bidAction?: CampaignPanelFieldsBidActionEnum;
    /**
     * 
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    useQps?: boolean;
    /**
     * 
     * @type {number}
     * @memberof CampaignPanelFields
     */
    qps?: number;
    /**
     * rtb OpenRTB content categories. A JSON array is accepted.
     * @type {string}
     * @memberof CampaignPanelFields
     */
    rtbCategories?: string;
    /**
     * rtb: pull the partner's stats through its reporting API.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    useApi?: boolean;
    /**
     * rtb per-network stats-API credentials.
     * @type {{ [key: string]: any; }}
     * @memberof CampaignPanelFields
     */
    apiData?: { [key: string]: any; };
    /**
     * rtb: log no-bid responses in the stats.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    logSkipped?: boolean;
    /**
     * 
     * @type {CampaignPanelFieldsDomainMask}
     * @memberof CampaignPanelFields
     */
    domainMask?: CampaignPanelFieldsDomainMask;
    /**
     * rtb banner (ad type 2), stored as options.rtb.xml_markup: ask the bidder for XML ad markup.
     * @type {boolean}
     * @memberof CampaignPanelFields
     */
    rtbXmlMarkup?: boolean;
}


/**
 * @export
 */
export const CampaignPanelFieldsDefaultBidTypeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type CampaignPanelFieldsDefaultBidTypeEnum = typeof CampaignPanelFieldsDefaultBidTypeEnum[keyof typeof CampaignPanelFieldsDefaultBidTypeEnum];

/**
 * @export
 */
export const CampaignPanelFieldsOrientationEnum = {
    Landscape: 'landscape',
    Portrait: 'portrait',
    Square: 'square'
} as const;
export type CampaignPanelFieldsOrientationEnum = typeof CampaignPanelFieldsOrientationEnum[keyof typeof CampaignPanelFieldsOrientationEnum];

/**
 * @export
 */
export const CampaignPanelFieldsSiteModeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type CampaignPanelFieldsSiteModeEnum = typeof CampaignPanelFieldsSiteModeEnum[keyof typeof CampaignPanelFieldsSiteModeEnum];

/**
 * @export
 */
export const CampaignPanelFieldsSkipLowQualityEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2
} as const;
export type CampaignPanelFieldsSkipLowQualityEnum = typeof CampaignPanelFieldsSkipLowQualityEnum[keyof typeof CampaignPanelFieldsSkipLowQualityEnum];

/**
 * @export
 */
export const CampaignPanelFieldsEmailTypeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2
} as const;
export type CampaignPanelFieldsEmailTypeEnum = typeof CampaignPanelFieldsEmailTypeEnum[keyof typeof CampaignPanelFieldsEmailTypeEnum];

/**
 * @export
 */
export const CampaignPanelFieldsSubidListModeEnum = {
    Whitelist: 'whitelist',
    Blacklist: 'blacklist'
} as const;
export type CampaignPanelFieldsSubidListModeEnum = typeof CampaignPanelFieldsSubidListModeEnum[keyof typeof CampaignPanelFieldsSubidListModeEnum];

/**
 * @export
 */
export const CampaignPanelFieldsRtbTypeEnum = {
    Openrtb: 'openrtb',
    Json: 'json',
    Xml: 'xml'
} as const;
export type CampaignPanelFieldsRtbTypeEnum = typeof CampaignPanelFieldsRtbTypeEnum[keyof typeof CampaignPanelFieldsRtbTypeEnum];

/**
 * @export
 */
export const CampaignPanelFieldsUseTypeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type CampaignPanelFieldsUseTypeEnum = typeof CampaignPanelFieldsUseTypeEnum[keyof typeof CampaignPanelFieldsUseTypeEnum];

/**
 * @export
 */
export const CampaignPanelFieldsBidActionEnum = {
    NUMBER_1: 1,
    NUMBER_2: 2
} as const;
export type CampaignPanelFieldsBidActionEnum = typeof CampaignPanelFieldsBidActionEnum[keyof typeof CampaignPanelFieldsBidActionEnum];


/**
 * Check if a given object implements the CampaignPanelFields interface.
 */
export function instanceOfCampaignPanelFields(value: object): value is CampaignPanelFields {
    return true;
}

export function CampaignPanelFieldsFromJSON(json: any): CampaignPanelFields {
    return CampaignPanelFieldsFromJSONTyped(json, false);
}

export function CampaignPanelFieldsFromJSONTyped(json: any, ignoreDiscriminator: boolean): CampaignPanelFields {
    if (json == null) {
        return json;
    }
    return {
        
        'groupid': json['groupid'] == null ? undefined : json['groupid'],
        'displayOptions': json['display_options'] == null ? undefined : json['display_options'],
        'minRank': json['min_rank'] == null ? undefined : json['min_rank'],
        'fxRating': json['fx_rating'] == null ? undefined : json['fx_rating'],
        'mailCampaignBudget': json['mail_campaign_budget'] == null ? undefined : json['mail_campaign_budget'],
        'useDynamicCosts': json['use_dynamic_costs'] == null ? undefined : json['use_dynamic_costs'],
        'dynamicCostsIncrease': json['dynamic_costs_increase'] == null ? undefined : json['dynamic_costs_increase'],
        'conversionCapping': json['conversion_capping'] == null ? undefined : CampaignPanelFieldsConversionCappingFromJSON(json['conversion_capping']),
        'fixCpa': json['fix_cpa'] == null ? undefined : json['fix_cpa'],
        'fixCpaConvTypes': json['fix_cpa_conv_types'] == null ? undefined : json['fix_cpa_conv_types'],
        'booster': json['booster'] == null ? undefined : json['booster'],
        'boosterSettings': json['booster_settings'] == null ? undefined : CampaignPanelFieldsBoosterSettingsFromJSON(json['booster_settings']),
        'defaultBidType': json['default_bid_type'] == null ? undefined : json['default_bid_type'],
        'sortType': json['sort_type'] == null ? undefined : json['sort_type'],
        'asFailover': json['as_failover'] == null ? undefined : json['as_failover'],
        'dayParting': json['day_parting'] == null ? undefined : CampaignPanelFieldsDayPartingFromJSON(json['day_parting']),
        'screens': json['screens'] == null ? undefined : CampaignPanelFieldsScreensFromJSON(json['screens']),
        'displayTimes': json['display_times'] == null ? undefined : json['display_times'],
        'displayDays': json['display_days'] == null ? undefined : json['display_days'],
        'siteLanguages': json['site_languages'] == null ? undefined : json['site_languages'],
        'connectionTypes': json['connection_types'] == null ? undefined : json['connection_types'],
        'carrierIds': json['carrier_ids'] == null ? undefined : json['carrier_ids'],
        'ratingId': json['rating_id'] == null ? undefined : json['rating_id'],
        'orientation': json['orientation'] == null ? undefined : json['orientation'],
        'siteMode': json['site_mode'] == null ? undefined : json['site_mode'],
        'onlyTaggedZones': json['only_tagged_zones'] == null ? undefined : json['only_tagged_zones'],
        'skipLowQuality': json['skip_low_quality'] == null ? undefined : json['skip_low_quality'],
        'ipWhitelist': json['ip_whitelist'] == null ? undefined : json['ip_whitelist'],
        'ipBlacklist': json['ip_blacklist'] == null ? undefined : json['ip_blacklist'],
        'avCheck': json['av_check'] == null ? undefined : CampaignPanelFieldsAvCheckFromJSON(json['av_check']),
        'emailType': json['email_type'] == null ? undefined : json['email_type'],
        'useSubscriptionAge': json['use_subscription_age'] == null ? undefined : json['use_subscription_age'],
        'subscriptionAge': json['subscription_age'] == null ? undefined : json['subscription_age'],
        'instantImpression': json['instant_impression'] == null ? undefined : json['instant_impression'],
        'subidList': json['subid_list'] == null ? undefined : json['subid_list'],
        'subidListMode': json['subid_list_mode'] == null ? undefined : json['subid_list_mode'],
        'sourceOptimizerIds': json['source_optimizer_ids'] == null ? undefined : json['source_optimizer_ids'],
        'wlZoneIds': json['wl_zone_ids'] == null ? undefined : json['wl_zone_ids'],
        'feedId': json['feed_id'] == null ? undefined : json['feed_id'],
        'feedSettings': json['feed_settings'] == null ? undefined : CampaignPanelFieldsFeedSettingsFromJSON(json['feed_settings']),
        'priority': json['priority'] == null ? undefined : CampaignPanelFieldsPriorityFromJSON(json['priority']),
        'suggestions': json['suggestions'] == null ? undefined : CampaignPanelFieldsSuggestionsFromJSON(json['suggestions']),
        'hideReferrer': json['hide_referrer'] == null ? undefined : json['hide_referrer'],
        'logConvAsPaid': json['log_conv_as_paid'] == null ? undefined : json['log_conv_as_paid'],
        'aboutSettings': json['about_settings'] == null ? undefined : CampaignPanelFieldsAboutSettingsFromJSON(json['about_settings']),
        'useLiveFeed': json['use_live_feed'] == null ? undefined : json['use_live_feed'],
        'liveFeedParentId': json['live_feed_parent_id'] == null ? undefined : json['live_feed_parent_id'],
        'liveFeedSettings': json['live_feed_settings'] == null ? undefined : json['live_feed_settings'],
        'offerTypeId': json['offer_type_id'] == null ? undefined : json['offer_type_id'],
        'description': json['description'] == null ? undefined : json['description'],
        'destinationUrl': json['destination_url'] == null ? undefined : json['destination_url'],
        'previewUrl': json['preview_url'] == null ? undefined : json['preview_url'],
        'rtbNetworkId': json['rtb_network_id'] == null ? undefined : json['rtb_network_id'],
        'rtbType': json['rtb_type'] == null ? undefined : json['rtb_type'],
        'useType': json['use_type'] == null ? undefined : json['use_type'],
        'zoneUrls': json['zone_urls'] == null ? undefined : json['zone_urls'],
        'bidAction': json['bid_action'] == null ? undefined : json['bid_action'],
        'useQps': json['use_qps'] == null ? undefined : json['use_qps'],
        'qps': json['qps'] == null ? undefined : json['qps'],
        'rtbCategories': json['rtb_categories'] == null ? undefined : json['rtb_categories'],
        'useApi': json['use_api'] == null ? undefined : json['use_api'],
        'apiData': json['api_data'] == null ? undefined : json['api_data'],
        'logSkipped': json['log_skipped'] == null ? undefined : json['log_skipped'],
        'domainMask': json['domain_mask'] == null ? undefined : CampaignPanelFieldsDomainMaskFromJSON(json['domain_mask']),
        'rtbXmlMarkup': json['rtb_xml_markup'] == null ? undefined : json['rtb_xml_markup'],
    };
}

export function CampaignPanelFieldsToJSON(json: any): CampaignPanelFields {
    return CampaignPanelFieldsToJSONTyped(json, false);
}

export function CampaignPanelFieldsToJSONTyped(value?: CampaignPanelFields | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'groupid': value['groupid'],
        'display_options': value['displayOptions'],
        'min_rank': value['minRank'],
        'fx_rating': value['fxRating'],
        'mail_campaign_budget': value['mailCampaignBudget'],
        'use_dynamic_costs': value['useDynamicCosts'],
        'dynamic_costs_increase': value['dynamicCostsIncrease'],
        'conversion_capping': CampaignPanelFieldsConversionCappingToJSON(value['conversionCapping']),
        'fix_cpa': value['fixCpa'],
        'fix_cpa_conv_types': value['fixCpaConvTypes'],
        'booster': value['booster'],
        'booster_settings': CampaignPanelFieldsBoosterSettingsToJSON(value['boosterSettings']),
        'default_bid_type': value['defaultBidType'],
        'sort_type': value['sortType'],
        'as_failover': value['asFailover'],
        'day_parting': CampaignPanelFieldsDayPartingToJSON(value['dayParting']),
        'screens': CampaignPanelFieldsScreensToJSON(value['screens']),
        'display_times': value['displayTimes'],
        'display_days': value['displayDays'],
        'site_languages': value['siteLanguages'],
        'connection_types': value['connectionTypes'],
        'carrier_ids': value['carrierIds'],
        'rating_id': value['ratingId'],
        'orientation': value['orientation'],
        'site_mode': value['siteMode'],
        'only_tagged_zones': value['onlyTaggedZones'],
        'skip_low_quality': value['skipLowQuality'],
        'ip_whitelist': value['ipWhitelist'],
        'ip_blacklist': value['ipBlacklist'],
        'av_check': CampaignPanelFieldsAvCheckToJSON(value['avCheck']),
        'email_type': value['emailType'],
        'use_subscription_age': value['useSubscriptionAge'],
        'subscription_age': value['subscriptionAge'],
        'instant_impression': value['instantImpression'],
        'subid_list': value['subidList'],
        'subid_list_mode': value['subidListMode'],
        'source_optimizer_ids': value['sourceOptimizerIds'],
        'wl_zone_ids': value['wlZoneIds'],
        'feed_id': value['feedId'],
        'feed_settings': CampaignPanelFieldsFeedSettingsToJSON(value['feedSettings']),
        'priority': CampaignPanelFieldsPriorityToJSON(value['priority']),
        'suggestions': CampaignPanelFieldsSuggestionsToJSON(value['suggestions']),
        'hide_referrer': value['hideReferrer'],
        'log_conv_as_paid': value['logConvAsPaid'],
        'about_settings': CampaignPanelFieldsAboutSettingsToJSON(value['aboutSettings']),
        'use_live_feed': value['useLiveFeed'],
        'live_feed_parent_id': value['liveFeedParentId'],
        'live_feed_settings': value['liveFeedSettings'],
        'offer_type_id': value['offerTypeId'],
        'description': value['description'],
        'destination_url': value['destinationUrl'],
        'preview_url': value['previewUrl'],
        'rtb_network_id': value['rtbNetworkId'],
        'rtb_type': value['rtbType'],
        'use_type': value['useType'],
        'zone_urls': value['zoneUrls'],
        'bid_action': value['bidAction'],
        'use_qps': value['useQps'],
        'qps': value['qps'],
        'rtb_categories': value['rtbCategories'],
        'use_api': value['useApi'],
        'api_data': value['apiData'],
        'log_skipped': value['logSkipped'],
        'domain_mask': CampaignPanelFieldsDomainMaskToJSON(value['domainMask']),
        'rtb_xml_markup': value['rtbXmlMarkup'],
    };
}

