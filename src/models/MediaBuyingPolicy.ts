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
import type { MediaBuyingPolicyTestPhase } from './MediaBuyingPolicyTestPhase';
import {
    MediaBuyingPolicyTestPhaseFromJSON,
    MediaBuyingPolicyTestPhaseFromJSONTyped,
    MediaBuyingPolicyTestPhaseToJSON,
    MediaBuyingPolicyTestPhaseToJSONTyped,
} from './MediaBuyingPolicyTestPhase';

/**
 * The buying policy of one ad zone (docs/MEDIA_BUYING.md). On PUT every field is optional: a field left out keeps its stored value; out-of-range values are clamped. Nothing scheduled acts on the zone until `enabled` is true.
 * @export
 * @interface MediaBuyingPolicy
 */
export interface MediaBuyingPolicy {
    /**
     * The zone's master switch. Off (the default): no scheduled job acts on the zone whatever the modes say; the report and your own actions still work.
     * @type {boolean}
     * @memberof MediaBuyingPolicy
     */
    enabled?: boolean;
    /**
     * off | advise | auto
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    mode?: string;
    /**
     * Stats slot holding the source zone id
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    zoneSlot?: string;
    /**
     * paid | earned
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    revenueMetric?: string;
    /**
     * Days judged, 1-30
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    windowDays?: number;
    /**
     * Judge a zone only after this cost (main currency)
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minSpend?: number;
    /**
     * Judge a zone only after this much traffic too (clicks or impressions, per ad type).
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minVolume?: number;
    /**
     * Block below this margin; null = not used
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    targetMarginPct?: number;
    /**
     * Block above this cost per conversion; null = not used
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    maxCpa?: number;
    /**
     * Auto mode: blocks the policy may apply per day
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    maxBlocksPerDay?: number;
    /**
     * fixed | confidence
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    judging?: string;
    /**
     * 70-99
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    confidencePct?: number;
    /**
     * off | buy | country
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    pooling?: string;
    /**
     * The group counts as this many paid events, 0-20
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    poolStrength?: number;
    /**
     * off | advise | auto
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    ipPreblockMode?: string;
    /**
     * Also data centre / VPN ranges and ASNs
     * @type {boolean}
     * @memberof MediaBuyingPolicy
     */
    ipPreblockHosting?: boolean;
    /**
     * Entries on the list, 1-1000
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    ipPreblockMax?: number;
    /**
     * Take an entry off after this many days unseen
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    ipPreblockTtlDays?: number;
    /**
     * Which day a conversion's revenue counts on: `conversion` (the day it arrives, default) | `click` (the day of the visit that led to it; needs the source id in subid).
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    attribution?: string;
    /**
     * `off` | `daily` (08:00 tenant time) | `weekly` (Mondays 08:00) report by email / Telegram / Slack and the `media_buying.report` event.
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    report?: string;
    /**
     * Block below this % delivered; null = off
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minDeliveryPct?: number;
    /**
     * Judge delivery only after this many network impressions/clicks
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minNetworkCount?: number;
    /**
     * Block a zone whose visitors come from outside the campaign's countries more than this share; null = off.
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    maxOffgeoPct?: number;
    /**
     * Judge geo only after this many visits (or clicks)
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minGeoVolume?: number;
    /**
     * Goadserver: stop buying when a linked campaign has < this % of its day budget left
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    budgetReservePct?: number;
    /**
     * Goadserver: no re-activation within this many minutes of the last switch
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minSwitchMinutes?: number;
    /**
     * Hold the source once today's external cost reaches this
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    maxDailySourceSpend?: number;
    /**
     * Hold the source once today's profit on the adzone is below -this
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    stopLoss?: number;
    /**
     * off | advise | auto (auto only on networks with absolute bids)
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    bidMode?: string;
    /**
     * Size of one change, 1-30 %
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    bidStepPct?: number;
    /**
     * Margin dead-zone around the target, in points
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    bidBandPct?: number;
    /**
     * Judge only once the window cost reaches this
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    bidMinSpend?: number;
    /**
     * Never lower below (network bid units)
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minBid?: number;
    /**
     * Never raise above; no raise at all without it
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    maxBid?: number;
    /**
     * At most one change (or open proposal) per this many hours
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    bidCooldownHours?: number;
    /**
     * off | advise | auto
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    agentMode?: string;
    /**
     * Legacy: the agent interval in hours; read only when agent_every_minutes is unset.
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    agentEveryHours?: number;
    /**
     * How often the buying agent reviews the zone, 15-10080 minutes.
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    agentEveryMinutes?: number;
    /**
     * Pick the agent interval from the zone's traffic instead of agent_every_minutes.
     * @type {boolean}
     * @memberof MediaBuyingPolicy
     */
    agentIntervalAuto?: boolean;
    /**
     * Actions kept per run, 1-50
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    agentMaxActions?: number;
    /**
     * The buyer's own instructions, max 1000 characters
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    agentNotes?: string;
    /**
     * Make this buy the untouched control of buy N (another of your connected ad zones / tracking links), e.g. a campaign left to the network's own optimiser: saving it switches `enabled` off. 0 = not a control. Compare the two with GET …/media-buying/compare.
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    controlFor?: number;
    /**
     * Set by a launch with `preset`: the zone switches on with this preset when the network approves the campaign, then it is cleared. An unknown value is dropped.
     * @type {MediaBuyingPolicyStartPresetEnum}
     * @memberof MediaBuyingPolicy
     */
    startPreset?: MediaBuyingPolicyStartPresetEnum;
    /**
     * 
     * @type {MediaBuyingPolicyTestPhase}
     * @memberof MediaBuyingPolicy
     */
    testPhase?: MediaBuyingPolicyTestPhase;
    /**
     * Network daily budget (level E): off | advise | auto. Decided once a day; written only where the network has a budget API.
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    budgetMode?: string;
    /**
     * Added on top of the computed network budget, 0-100 %
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    budgetHeadroomPct?: number;
    /**
     * Never set the network budget below this (network currency); null = no floor
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    minNetworkBudget?: number;
    /**
     * Never set the network budget above this (network currency); null = no ceiling
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    maxNetworkBudget?: number;
    /**
     * Even pacing: spread the day budget over at least this many hours — the network's hourly budget is set to day budget / hours, in the same update as the daily budget (networks with `supports_hourly_budget` in the overview, today Adsterra). 0 = off (default), else 4-24. Switching it off leaves the network's hourly budget as it is.
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    budgetPaceHours?: number;
    /**
     * Segment exclusions (levels B/C): off | advise | auto
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    segmentMode?: string;
    /**
     * Judge a segment only after this cost (main currency); estimated segments need twice this
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    segmentMinSpend?: number;
    /**
     * Full days a segment is judged on, 3-28 (weekday: always 28)
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    segmentWindowDays?: number;
    /**
     * When the zone feeds exactly one campaign and its source ids arrive as subid: subids that campaign's advertiser blocks are blocked at the network too.
     * @type {boolean}
     * @memberof MediaBuyingPolicy
     */
    mirrorAdvertiserBlocks?: boolean;
    /**
     * off | advise | auto
     * @type {string}
     * @memberof MediaBuyingPolicy
     */
    zoneBidMode?: string;
    /**
     * Size of one change, 1-30 %
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    zoneBidStepPct?: number;
    /**
     * Margin band above the target, in points
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    zoneBidBandPct?: number;
    /**
     * Never below this % of the country base bid
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    zoneBidFloorPct?: number;
    /**
     * Never above this % of the country base bid
     * @type {number}
     * @memberof MediaBuyingPolicy
     */
    zoneBidCeilingPct?: number;
    /**
     * Set by an ad zone clone: a pending carry-over of another zone's blocks (`from`, `kind`, `done`). Read-only; send it back unchanged or leave it out.
     * @type {object}
     * @memberof MediaBuyingPolicy
     */
    readonly inheritBlocks?: object;
}


/**
 * @export
 */
export const MediaBuyingPolicyStartPresetEnum = {
    Conservative: 'conservative',
    Balanced: 'balanced',
    Aggressive: 'aggressive'
} as const;
export type MediaBuyingPolicyStartPresetEnum = typeof MediaBuyingPolicyStartPresetEnum[keyof typeof MediaBuyingPolicyStartPresetEnum];


/**
 * Check if a given object implements the MediaBuyingPolicy interface.
 */
export function instanceOfMediaBuyingPolicy(value: object): value is MediaBuyingPolicy {
    return true;
}

export function MediaBuyingPolicyFromJSON(json: any): MediaBuyingPolicy {
    return MediaBuyingPolicyFromJSONTyped(json, false);
}

export function MediaBuyingPolicyFromJSONTyped(json: any, ignoreDiscriminator: boolean): MediaBuyingPolicy {
    if (json == null) {
        return json;
    }
    return {
        
        'enabled': json['enabled'] == null ? undefined : json['enabled'],
        'mode': json['mode'] == null ? undefined : json['mode'],
        'zoneSlot': json['zone_slot'] == null ? undefined : json['zone_slot'],
        'revenueMetric': json['revenue_metric'] == null ? undefined : json['revenue_metric'],
        'windowDays': json['window_days'] == null ? undefined : json['window_days'],
        'minSpend': json['min_spend'] == null ? undefined : json['min_spend'],
        'minVolume': json['min_volume'] == null ? undefined : json['min_volume'],
        'targetMarginPct': json['target_margin_pct'] == null ? undefined : json['target_margin_pct'],
        'maxCpa': json['max_cpa'] == null ? undefined : json['max_cpa'],
        'maxBlocksPerDay': json['max_blocks_per_day'] == null ? undefined : json['max_blocks_per_day'],
        'judging': json['judging'] == null ? undefined : json['judging'],
        'confidencePct': json['confidence_pct'] == null ? undefined : json['confidence_pct'],
        'pooling': json['pooling'] == null ? undefined : json['pooling'],
        'poolStrength': json['pool_strength'] == null ? undefined : json['pool_strength'],
        'ipPreblockMode': json['ip_preblock_mode'] == null ? undefined : json['ip_preblock_mode'],
        'ipPreblockHosting': json['ip_preblock_hosting'] == null ? undefined : json['ip_preblock_hosting'],
        'ipPreblockMax': json['ip_preblock_max'] == null ? undefined : json['ip_preblock_max'],
        'ipPreblockTtlDays': json['ip_preblock_ttl_days'] == null ? undefined : json['ip_preblock_ttl_days'],
        'attribution': json['attribution'] == null ? undefined : json['attribution'],
        'report': json['report'] == null ? undefined : json['report'],
        'minDeliveryPct': json['min_delivery_pct'] == null ? undefined : json['min_delivery_pct'],
        'minNetworkCount': json['min_network_count'] == null ? undefined : json['min_network_count'],
        'maxOffgeoPct': json['max_offgeo_pct'] == null ? undefined : json['max_offgeo_pct'],
        'minGeoVolume': json['min_geo_volume'] == null ? undefined : json['min_geo_volume'],
        'budgetReservePct': json['budget_reserve_pct'] == null ? undefined : json['budget_reserve_pct'],
        'minSwitchMinutes': json['min_switch_minutes'] == null ? undefined : json['min_switch_minutes'],
        'maxDailySourceSpend': json['max_daily_source_spend'] == null ? undefined : json['max_daily_source_spend'],
        'stopLoss': json['stop_loss'] == null ? undefined : json['stop_loss'],
        'bidMode': json['bid_mode'] == null ? undefined : json['bid_mode'],
        'bidStepPct': json['bid_step_pct'] == null ? undefined : json['bid_step_pct'],
        'bidBandPct': json['bid_band_pct'] == null ? undefined : json['bid_band_pct'],
        'bidMinSpend': json['bid_min_spend'] == null ? undefined : json['bid_min_spend'],
        'minBid': json['min_bid'] == null ? undefined : json['min_bid'],
        'maxBid': json['max_bid'] == null ? undefined : json['max_bid'],
        'bidCooldownHours': json['bid_cooldown_hours'] == null ? undefined : json['bid_cooldown_hours'],
        'agentMode': json['agent_mode'] == null ? undefined : json['agent_mode'],
        'agentEveryHours': json['agent_every_hours'] == null ? undefined : json['agent_every_hours'],
        'agentEveryMinutes': json['agent_every_minutes'] == null ? undefined : json['agent_every_minutes'],
        'agentIntervalAuto': json['agent_interval_auto'] == null ? undefined : json['agent_interval_auto'],
        'agentMaxActions': json['agent_max_actions'] == null ? undefined : json['agent_max_actions'],
        'agentNotes': json['agent_notes'] == null ? undefined : json['agent_notes'],
        'controlFor': json['control_for'] == null ? undefined : json['control_for'],
        'startPreset': json['start_preset'] == null ? undefined : json['start_preset'],
        'testPhase': json['test_phase'] == null ? undefined : MediaBuyingPolicyTestPhaseFromJSON(json['test_phase']),
        'budgetMode': json['budget_mode'] == null ? undefined : json['budget_mode'],
        'budgetHeadroomPct': json['budget_headroom_pct'] == null ? undefined : json['budget_headroom_pct'],
        'minNetworkBudget': json['min_network_budget'] == null ? undefined : json['min_network_budget'],
        'maxNetworkBudget': json['max_network_budget'] == null ? undefined : json['max_network_budget'],
        'budgetPaceHours': json['budget_pace_hours'] == null ? undefined : json['budget_pace_hours'],
        'segmentMode': json['segment_mode'] == null ? undefined : json['segment_mode'],
        'segmentMinSpend': json['segment_min_spend'] == null ? undefined : json['segment_min_spend'],
        'segmentWindowDays': json['segment_window_days'] == null ? undefined : json['segment_window_days'],
        'mirrorAdvertiserBlocks': json['mirror_advertiser_blocks'] == null ? undefined : json['mirror_advertiser_blocks'],
        'zoneBidMode': json['zone_bid_mode'] == null ? undefined : json['zone_bid_mode'],
        'zoneBidStepPct': json['zone_bid_step_pct'] == null ? undefined : json['zone_bid_step_pct'],
        'zoneBidBandPct': json['zone_bid_band_pct'] == null ? undefined : json['zone_bid_band_pct'],
        'zoneBidFloorPct': json['zone_bid_floor_pct'] == null ? undefined : json['zone_bid_floor_pct'],
        'zoneBidCeilingPct': json['zone_bid_ceiling_pct'] == null ? undefined : json['zone_bid_ceiling_pct'],
        'inheritBlocks': json['inherit_blocks'] == null ? undefined : json['inherit_blocks'],
    };
}

export function MediaBuyingPolicyToJSON(json: any): MediaBuyingPolicy {
    return MediaBuyingPolicyToJSONTyped(json, false);
}

export function MediaBuyingPolicyToJSONTyped(value?: Omit<MediaBuyingPolicy, 'inherit_blocks'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'enabled': value['enabled'],
        'mode': value['mode'],
        'zone_slot': value['zoneSlot'],
        'revenue_metric': value['revenueMetric'],
        'window_days': value['windowDays'],
        'min_spend': value['minSpend'],
        'min_volume': value['minVolume'],
        'target_margin_pct': value['targetMarginPct'],
        'max_cpa': value['maxCpa'],
        'max_blocks_per_day': value['maxBlocksPerDay'],
        'judging': value['judging'],
        'confidence_pct': value['confidencePct'],
        'pooling': value['pooling'],
        'pool_strength': value['poolStrength'],
        'ip_preblock_mode': value['ipPreblockMode'],
        'ip_preblock_hosting': value['ipPreblockHosting'],
        'ip_preblock_max': value['ipPreblockMax'],
        'ip_preblock_ttl_days': value['ipPreblockTtlDays'],
        'attribution': value['attribution'],
        'report': value['report'],
        'min_delivery_pct': value['minDeliveryPct'],
        'min_network_count': value['minNetworkCount'],
        'max_offgeo_pct': value['maxOffgeoPct'],
        'min_geo_volume': value['minGeoVolume'],
        'budget_reserve_pct': value['budgetReservePct'],
        'min_switch_minutes': value['minSwitchMinutes'],
        'max_daily_source_spend': value['maxDailySourceSpend'],
        'stop_loss': value['stopLoss'],
        'bid_mode': value['bidMode'],
        'bid_step_pct': value['bidStepPct'],
        'bid_band_pct': value['bidBandPct'],
        'bid_min_spend': value['bidMinSpend'],
        'min_bid': value['minBid'],
        'max_bid': value['maxBid'],
        'bid_cooldown_hours': value['bidCooldownHours'],
        'agent_mode': value['agentMode'],
        'agent_every_hours': value['agentEveryHours'],
        'agent_every_minutes': value['agentEveryMinutes'],
        'agent_interval_auto': value['agentIntervalAuto'],
        'agent_max_actions': value['agentMaxActions'],
        'agent_notes': value['agentNotes'],
        'control_for': value['controlFor'],
        'start_preset': value['startPreset'],
        'test_phase': MediaBuyingPolicyTestPhaseToJSON(value['testPhase']),
        'budget_mode': value['budgetMode'],
        'budget_headroom_pct': value['budgetHeadroomPct'],
        'min_network_budget': value['minNetworkBudget'],
        'max_network_budget': value['maxNetworkBudget'],
        'budget_pace_hours': value['budgetPaceHours'],
        'segment_mode': value['segmentMode'],
        'segment_min_spend': value['segmentMinSpend'],
        'segment_window_days': value['segmentWindowDays'],
        'mirror_advertiser_blocks': value['mirrorAdvertiserBlocks'],
        'zone_bid_mode': value['zoneBidMode'],
        'zone_bid_step_pct': value['zoneBidStepPct'],
        'zone_bid_band_pct': value['zoneBidBandPct'],
        'zone_bid_floor_pct': value['zoneBidFloorPct'],
        'zone_bid_ceiling_pct': value['zoneBidCeilingPct'],
    };
}

