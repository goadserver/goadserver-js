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
import type { AdspaceCreateScreenSettings } from './AdspaceCreateScreenSettings';
import {
    AdspaceCreateScreenSettingsFromJSON,
    AdspaceCreateScreenSettingsFromJSONTyped,
    AdspaceCreateScreenSettingsToJSON,
    AdspaceCreateScreenSettingsToJSONTyped,
} from './AdspaceCreateScreenSettings';
import type { AdspaceCreateBotSettings } from './AdspaceCreateBotSettings';
import {
    AdspaceCreateBotSettingsFromJSON,
    AdspaceCreateBotSettingsFromJSONTyped,
    AdspaceCreateBotSettingsToJSON,
    AdspaceCreateBotSettingsToJSONTyped,
} from './AdspaceCreateBotSettings';
import type { AdspaceCreateEmailSettings } from './AdspaceCreateEmailSettings';
import {
    AdspaceCreateEmailSettingsFromJSON,
    AdspaceCreateEmailSettingsFromJSONTyped,
    AdspaceCreateEmailSettingsToJSON,
    AdspaceCreateEmailSettingsToJSONTyped,
} from './AdspaceCreateEmailSettings';
import type { AdspaceCreateBannerSettings } from './AdspaceCreateBannerSettings';
import {
    AdspaceCreateBannerSettingsFromJSON,
    AdspaceCreateBannerSettingsFromJSONTyped,
    AdspaceCreateBannerSettingsToJSON,
    AdspaceCreateBannerSettingsToJSONTyped,
} from './AdspaceCreateBannerSettings';
import type { AdspaceCreateSearchSettings } from './AdspaceCreateSearchSettings';
import {
    AdspaceCreateSearchSettingsFromJSON,
    AdspaceCreateSearchSettingsFromJSONTyped,
    AdspaceCreateSearchSettingsToJSON,
    AdspaceCreateSearchSettingsToJSONTyped,
} from './AdspaceCreateSearchSettings';

/**
 * Adspace create body. The fields below are the common top-level
 * keys every type accepts; the type-specific settings block goes
 * under the body key returned in `settings_block.name` from
 * `GET /api/v1/adspaces/{type}/_schema` (e.g. `banner_settings`,
 * `pop_settings`, `native_settings`, `player_settings`).
 * 
 * Per-type details — including which `*_settings` block to send and
 * the legal fields inside it — live at the runtime
 * `_schema` endpoint, since they vary by tenant config.
 * 
 * @export
 * @interface AdspaceCreate
 */
export interface AdspaceCreate {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof AdspaceCreate
     */
    name: string;
    /**
     * Parent website id from /api/v1/sites.
     * @type {number}
     * @memberof AdspaceCreate
     */
    siteid: number;
    /**
     * 
     * @type {string}
     * @memberof AdspaceCreate
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof AdspaceCreate
     */
    ratingid?: number;
    /**
     * 
     * @type {number}
     * @memberof AdspaceCreate
     */
    mainCatid?: number;
    /**
     * 
     * @type {number}
     * @memberof AdspaceCreate
     */
    catid?: number;
    /**
     * 
     * @type {number}
     * @memberof AdspaceCreate
     */
    locationid?: number;
    /**
     * Banner size id (banner-flavored types only). Also accepted as banner_settings.sizeid.
     * @type {number}
     * @memberof AdspaceCreate
     */
    adsizeid?: number;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    autoapprove?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    isvisible?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    sendmails?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useownbanners?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    usealtbanner?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    usecpmbuys?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    allowIframes?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    allowAnimation?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    skipRonIfCpm?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    noPromotion?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    runRtbAfterSmartzone?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    usePixelLog?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    showAbout?: boolean;
    /**
     * Hide the "Ads by" copy. Stored as json_settings.hideadsby; `hideadsby` is accepted as an alias and wins when both are sent.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    hidecopy?: boolean;
    /**
     * Alias of hidecopy (the stored name).
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    hideadsby?: boolean;
    /**
     * Accept flat bookings on this zone.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useflatbuys?: boolean;
    /**
     * Parent ad zone (another live zone of yours) — in-video sub-zones hang under their player zone. 0 = top level.
     * @type {number}
     * @memberof AdspaceCreate
     */
    parentid?: number;
    /**
     * Banner zones: 0 = inline, 1 = floater (send floater_settings). Forced to 1 for types 17, 19, 20, 22.
     * @type {AdspaceCreateDisplayTypeEnum}
     * @memberof AdspaceCreate
     */
    displayType?: AdspaceCreateDisplayTypeEnum;
    /**
     * Banner zones: forward unfilled traffic to this ad zone id. 0 = off.
     * @type {number}
     * @memberof AdspaceCreate
     */
    newZoneid?: number;
    /**
     * Serve only the whitelisted campaigns. Ad Manager tenants only — dropped elsewhere.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    onlyWlCampaigns?: boolean;
    /**
     * Serve only campaigns in the zone's campaign groups (`tags`). Only where campaign-group targeting is enabled — dropped elsewhere.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    onlyTaggedCampaigns?: boolean;
    /**
     * Apply the whitelisted campaigns' own targeting. Also written by PUT /wl-campaigns.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    forceWlTargeting?: boolean;
    /**
     * Skip RTB when a whitelisted campaign can fill. Stored in json_settings.options.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    skipRtbWhenWl?: boolean;
    /**
     * Fixed payout instead of revenue share (alias `fixed_payouts`). Only where modules.publisher.adzones.options.use_fixed_payouts is on and the tenant is Ad Manager; dropped silently otherwise.
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useFixedPayouts?: boolean;
    /**
     * Alias of use_fixed_payouts (the name the panel sends).
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    fixedPayouts?: boolean;
    /**
     * {type: cpc|cpm, amount (currency units), enddate, amounts: per-country overrides}. Only with use_fixed_payouts.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    fixedPayoutData?: { [key: string]: any; };
    /**
     * Name the zone is reported under to RTB partners.
     * @type {string}
     * @memberof AdspaceCreate
     */
    rtbName?: string;
    /**
     * Campaign-group ids (campaign_groups). Empty = inherit the site's groups.
     * @type {Array<number>}
     * @memberof AdspaceCreate
     */
    tags?: Array<number>;
    /**
     * Comma-separated category ids to exclude.
     * @type {string}
     * @memberof AdspaceCreate
     */
    exclCatids?: string;
    /**
     * 
     * @type {string}
     * @memberof AdspaceCreate
     */
    exclproperties?: string;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useSubidList?: boolean;
    /**
     * Comma-separated subid allowlist (use_subid_list=true required).
     * @type {string}
     * @memberof AdspaceCreate
     */
    subidList?: string;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useDomainList?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof AdspaceCreate
     */
    domainList?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useCosts?: boolean;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    costsData?: { [key: string]: any; };
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useDynamicCosts?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AdspaceCreate
     */
    useFallbackCampaign?: boolean;
    /**
     * 
     * @type {number}
     * @memberof AdspaceCreate
     */
    fallbackCampaignid?: number;
    /**
     * 
     * @type {number}
     * @memberof AdspaceCreate
     */
    qualityRank?: number;
    /**
     * 
     * @type {AdspaceCreateBannerSettings}
     * @memberof AdspaceCreate
     */
    bannerSettings?: AdspaceCreateBannerSettings;
    /**
     * Native-flavored zones (nativeads, interstitial_native, creator_widget, search_ads, bot_ads — search_ads and bot_ads read only `orientation`). nativeads also takes the infinite content feed: `infinite` (boolean; switches GET /api/v1/adspaces/{id}/code to goCtrl's feed plugin), `feed_rss` (your RSS feed: http(s) URL or a path such as /feed/; anything else 422 `native_settings.feed_rss`), `feed_ad_every` (organic cards before each ad, 0-10, default 2), `feed_max_pages` (1-30, default 10), `feed_title`, `feed_label` (plain text). Ad impressions in the feed are counted when the card is at least half on screen. Full field list: GET /api/v1/adspaces/nativeads/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    nativeSettings?: { [key: string]: any; };
    /**
     * 
     * @type {AdspaceCreateSearchSettings}
     * @memberof AdspaceCreate
     */
    searchSettings?: AdspaceCreateSearchSettings;
    /**
     * 
     * @type {AdspaceCreateEmailSettings}
     * @memberof AdspaceCreate
     */
    emailSettings?: AdspaceCreateEmailSettings;
    /**
     * 
     * @type {AdspaceCreateBotSettings}
     * @memberof AdspaceCreate
     */
    botSettings?: AdspaceCreateBotSettings;
    /**
     * 
     * @type {AdspaceCreateScreenSettings}
     * @memberof AdspaceCreate
     */
    screenSettings?: AdspaceCreateScreenSettings;
    /**
     * Video zones (videoads, interstitial_video, videoslider). videoads also takes rewarded web ads: `rewarded` (boolean; GET /api/v1/adspaces/{id}/code then returns goCtrl's rewarded plugin plus an example button), `reward_min_seconds` (5-120, default 10), `reward_callback` (your server's http(s) URL, GET with {uid} {sid} {campaignid} {ts} {token}; anything else 422 `player_settings.reward_callback`), `reward_secret` (64 hex, generated when rewarded is switched on; the reward token is `<base64url(payload)>.<hex HMAC-SHA256(reward_secret, payload)>`, payload `<sid>.<campaignid>.<uid>.<unix time>`). CTV / streaming (videoads and audioads): `pod_size` (1-6, ads per VAST answer as an ad pod, never the same campaign or advertiser twice; a player can also send &pod=N), `pod_max_seconds` (0-600, 0 = no limit), `midroll_offsets` (up to 20 seconds into the stream, array or "600, 1200"; out of range 422), `vmap_no_preroll`, `vmap_postroll`, `pause_zone_id` (0 or one of your own banner zones, else 422 `player_settings.pause_zone_id`), `ssai` (allow server-side ad insertion). The player URLs are in the code answer's `ctv` block. Full field list: GET /api/v1/adspaces/videoads/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    playerSettings?: { [key: string]: any; };
    /**
     * Pop zones (popads). `fpa_zoneid` is the full-page-ad zone served instead of the pop to visitors whose browser is in `bl_browsers`: 0 = none, otherwise one of YOUR OWN full-page zones (`fullpageads`, type 12) — another publisher's zone, a deleted zone or another type is refused with 422 (`pop_settings.fpa_zoneid`). Full field list: GET /api/v1/adspaces/popads/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    popSettings?: { [key: string]: any; };
    /**
     * Full-page ad zones (fullpageads). Shown when the visitor clicks a link, before the link opens. `link_scope`: empty = any link, `internal` = vignette (only links to the same site; anything else is refused with 422 `fpa_settings.link_scope`). `start_at` / `repeat_at` count link clicks, `refreshtime` caps it to once per N seconds. Full field list: GET /api/v1/adspaces/fullpageads/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    fpaSettings?: { [key: string]: any; };
    /**
     * Direct-URL zones: redirects (10), legacy types 14/15 and hard links 1-5 (35-39).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    redirectSettings?: { [key: string]: any; };
    /**
     * In-message popup zones (impopup).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    imSettings?: { [key: string]: any; };
    /**
     * Fixed-position banner zones (fixim_banner).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    fiximBannerSettings?: { [key: string]: any; };
    /**
     * Native bar zones (native_bar). position: top_left | top_right | left_middle | right_middle (the positions the native bar plugin draws); totalitems; topmargin (px, top positions); css. Full field list: GET /api/v1/adspaces/native_bar/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    nativeBarSettings?: { [key: string]: any; };
    /**
     * Native webpush zones (native_webpush). position: top_left | top_right | center | bottom_left | bottom_right; totalitems; topmargin; css (classic card only); skin: "" (classic card) | chat | call | alert — the social bar styles; delay_seconds 0-120 before the first message. Other skins or delays are refused with 422. Full field list: GET /api/v1/adspaces/native_webpush/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    nativeWebpushSettings?: { [key: string]: any; };
    /**
     * Text-list zones (textads).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    textSettings?: { [key: string]: any; };
    /**
     * Floater wrapper for interstitial-flavored zones (interstitialads, interstitial_banner, interstitial_native, interstitial_video). `trigger`: empty = as usual, `exit` = exit intent (desktop: the mouse leaves the page towards the tab bar; touch: a fast scroll back up after reading at least a screen; never in the first 5 seconds) — banner and native interstitials (17, 20, 21); anything else is refused with 422 `floater_settings.trigger`. Floating banners (bannerads with display_type 1, interstitialads) also take `anchor` (full-width bottom/top strip with a collapse tab), `refresh_seconds` (0, or 30-600 seconds on screen), `min_width` / `max_width` (screen-width range in px, 0 = no limit; e.g. side rails = left-middle / right-middle with min_width 1200) — out-of-range values are refused with 422. Full field list: GET /api/v1/adspaces/interstitial_banner/_schema.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    floaterSettings?: { [key: string]: any; };
    /**
     * Video-slider zones (videoslider).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    videosliderSettings?: { [key: string]: any; };
    /**
     * In-video plugin zones (invideo_plugin, type 16): roll slots, the zone each serves, pop-on-close/play. See `_schema`.
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    invideoSettings?: { [key: string]: any; };
    /**
     * Dynamic iframe zones (dyn_iframes).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    dynAdsettings?: { [key: string]: any; };
    /**
     * In-page video zones (inpage_video).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    inpageVideosettings?: { [key: string]: any; };
    /**
     * Video carousel zones (video_carousel).
     * @type {{ [key: string]: any; }}
     * @memberof AdspaceCreate
     */
    carouselVideosettings?: { [key: string]: any; };
}


/**
 * @export
 */
export const AdspaceCreateDisplayTypeEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type AdspaceCreateDisplayTypeEnum = typeof AdspaceCreateDisplayTypeEnum[keyof typeof AdspaceCreateDisplayTypeEnum];


/**
 * Check if a given object implements the AdspaceCreate interface.
 */
export function instanceOfAdspaceCreate(value: object): value is AdspaceCreate {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('siteid' in value) || value['siteid'] === undefined) return false;
    return true;
}

export function AdspaceCreateFromJSON(json: any): AdspaceCreate {
    return AdspaceCreateFromJSONTyped(json, false);
}

export function AdspaceCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): AdspaceCreate {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'name': json['name'],
        'siteid': json['siteid'],
        'description': json['description'] == null ? undefined : json['description'],
        'ratingid': json['ratingid'] == null ? undefined : json['ratingid'],
        'mainCatid': json['main_catid'] == null ? undefined : json['main_catid'],
        'catid': json['catid'] == null ? undefined : json['catid'],
        'locationid': json['locationid'] == null ? undefined : json['locationid'],
        'adsizeid': json['adsizeid'] == null ? undefined : json['adsizeid'],
        'autoapprove': json['autoapprove'] == null ? undefined : json['autoapprove'],
        'isvisible': json['isvisible'] == null ? undefined : json['isvisible'],
        'sendmails': json['sendmails'] == null ? undefined : json['sendmails'],
        'useownbanners': json['useownbanners'] == null ? undefined : json['useownbanners'],
        'usealtbanner': json['usealtbanner'] == null ? undefined : json['usealtbanner'],
        'usecpmbuys': json['usecpmbuys'] == null ? undefined : json['usecpmbuys'],
        'allowIframes': json['allow_iframes'] == null ? undefined : json['allow_iframes'],
        'allowAnimation': json['allow_animation'] == null ? undefined : json['allow_animation'],
        'skipRonIfCpm': json['skip_ron_if_cpm'] == null ? undefined : json['skip_ron_if_cpm'],
        'noPromotion': json['no_promotion'] == null ? undefined : json['no_promotion'],
        'runRtbAfterSmartzone': json['run_rtb_after_smartzone'] == null ? undefined : json['run_rtb_after_smartzone'],
        'usePixelLog': json['use_pixel_log'] == null ? undefined : json['use_pixel_log'],
        'showAbout': json['show_about'] == null ? undefined : json['show_about'],
        'hidecopy': json['hidecopy'] == null ? undefined : json['hidecopy'],
        'hideadsby': json['hideadsby'] == null ? undefined : json['hideadsby'],
        'useflatbuys': json['useflatbuys'] == null ? undefined : json['useflatbuys'],
        'parentid': json['parentid'] == null ? undefined : json['parentid'],
        'displayType': json['display_type'] == null ? undefined : json['display_type'],
        'newZoneid': json['new_zoneid'] == null ? undefined : json['new_zoneid'],
        'onlyWlCampaigns': json['only_wl_campaigns'] == null ? undefined : json['only_wl_campaigns'],
        'onlyTaggedCampaigns': json['only_tagged_campaigns'] == null ? undefined : json['only_tagged_campaigns'],
        'forceWlTargeting': json['force_wl_targeting'] == null ? undefined : json['force_wl_targeting'],
        'skipRtbWhenWl': json['skip_rtb_when_wl'] == null ? undefined : json['skip_rtb_when_wl'],
        'useFixedPayouts': json['use_fixed_payouts'] == null ? undefined : json['use_fixed_payouts'],
        'fixedPayouts': json['fixed_payouts'] == null ? undefined : json['fixed_payouts'],
        'fixedPayoutData': json['fixed_payout_data'] == null ? undefined : json['fixed_payout_data'],
        'rtbName': json['rtb_name'] == null ? undefined : json['rtb_name'],
        'tags': json['tags'] == null ? undefined : json['tags'],
        'exclCatids': json['excl_catids'] == null ? undefined : json['excl_catids'],
        'exclproperties': json['exclproperties'] == null ? undefined : json['exclproperties'],
        'useSubidList': json['use_subid_list'] == null ? undefined : json['use_subid_list'],
        'subidList': json['subid_list'] == null ? undefined : json['subid_list'],
        'useDomainList': json['use_domain_list'] == null ? undefined : json['use_domain_list'],
        'domainList': json['domain_list'] == null ? undefined : json['domain_list'],
        'useCosts': json['use_costs'] == null ? undefined : json['use_costs'],
        'costsData': json['costs_data'] == null ? undefined : json['costs_data'],
        'useDynamicCosts': json['use_dynamic_costs'] == null ? undefined : json['use_dynamic_costs'],
        'useFallbackCampaign': json['use_fallback_campaign'] == null ? undefined : json['use_fallback_campaign'],
        'fallbackCampaignid': json['fallback_campaignid'] == null ? undefined : json['fallback_campaignid'],
        'qualityRank': json['quality_rank'] == null ? undefined : json['quality_rank'],
        'bannerSettings': json['banner_settings'] == null ? undefined : AdspaceCreateBannerSettingsFromJSON(json['banner_settings']),
        'nativeSettings': json['native_settings'] == null ? undefined : json['native_settings'],
        'searchSettings': json['search_settings'] == null ? undefined : AdspaceCreateSearchSettingsFromJSON(json['search_settings']),
        'emailSettings': json['email_settings'] == null ? undefined : AdspaceCreateEmailSettingsFromJSON(json['email_settings']),
        'botSettings': json['bot_settings'] == null ? undefined : AdspaceCreateBotSettingsFromJSON(json['bot_settings']),
        'screenSettings': json['screen_settings'] == null ? undefined : AdspaceCreateScreenSettingsFromJSON(json['screen_settings']),
        'playerSettings': json['player_settings'] == null ? undefined : json['player_settings'],
        'popSettings': json['pop_settings'] == null ? undefined : json['pop_settings'],
        'fpaSettings': json['fpa_settings'] == null ? undefined : json['fpa_settings'],
        'redirectSettings': json['redirect_settings'] == null ? undefined : json['redirect_settings'],
        'imSettings': json['im_settings'] == null ? undefined : json['im_settings'],
        'fiximBannerSettings': json['fixim_banner_settings'] == null ? undefined : json['fixim_banner_settings'],
        'nativeBarSettings': json['native_bar_settings'] == null ? undefined : json['native_bar_settings'],
        'nativeWebpushSettings': json['native_webpush_settings'] == null ? undefined : json['native_webpush_settings'],
        'textSettings': json['text_settings'] == null ? undefined : json['text_settings'],
        'floaterSettings': json['floater_settings'] == null ? undefined : json['floater_settings'],
        'videosliderSettings': json['videoslider_settings'] == null ? undefined : json['videoslider_settings'],
        'invideoSettings': json['invideo_settings'] == null ? undefined : json['invideo_settings'],
        'dynAdsettings': json['dyn_adsettings'] == null ? undefined : json['dyn_adsettings'],
        'inpageVideosettings': json['inpage_videosettings'] == null ? undefined : json['inpage_videosettings'],
        'carouselVideosettings': json['carousel_videosettings'] == null ? undefined : json['carousel_videosettings'],
    };
}

export function AdspaceCreateToJSON(json: any): AdspaceCreate {
    return AdspaceCreateToJSONTyped(json, false);
}

export function AdspaceCreateToJSONTyped(value?: AdspaceCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
            ...value,
        'name': value['name'],
        'siteid': value['siteid'],
        'description': value['description'],
        'ratingid': value['ratingid'],
        'main_catid': value['mainCatid'],
        'catid': value['catid'],
        'locationid': value['locationid'],
        'adsizeid': value['adsizeid'],
        'autoapprove': value['autoapprove'],
        'isvisible': value['isvisible'],
        'sendmails': value['sendmails'],
        'useownbanners': value['useownbanners'],
        'usealtbanner': value['usealtbanner'],
        'usecpmbuys': value['usecpmbuys'],
        'allow_iframes': value['allowIframes'],
        'allow_animation': value['allowAnimation'],
        'skip_ron_if_cpm': value['skipRonIfCpm'],
        'no_promotion': value['noPromotion'],
        'run_rtb_after_smartzone': value['runRtbAfterSmartzone'],
        'use_pixel_log': value['usePixelLog'],
        'show_about': value['showAbout'],
        'hidecopy': value['hidecopy'],
        'hideadsby': value['hideadsby'],
        'useflatbuys': value['useflatbuys'],
        'parentid': value['parentid'],
        'display_type': value['displayType'],
        'new_zoneid': value['newZoneid'],
        'only_wl_campaigns': value['onlyWlCampaigns'],
        'only_tagged_campaigns': value['onlyTaggedCampaigns'],
        'force_wl_targeting': value['forceWlTargeting'],
        'skip_rtb_when_wl': value['skipRtbWhenWl'],
        'use_fixed_payouts': value['useFixedPayouts'],
        'fixed_payouts': value['fixedPayouts'],
        'fixed_payout_data': value['fixedPayoutData'],
        'rtb_name': value['rtbName'],
        'tags': value['tags'],
        'excl_catids': value['exclCatids'],
        'exclproperties': value['exclproperties'],
        'use_subid_list': value['useSubidList'],
        'subid_list': value['subidList'],
        'use_domain_list': value['useDomainList'],
        'domain_list': value['domainList'],
        'use_costs': value['useCosts'],
        'costs_data': value['costsData'],
        'use_dynamic_costs': value['useDynamicCosts'],
        'use_fallback_campaign': value['useFallbackCampaign'],
        'fallback_campaignid': value['fallbackCampaignid'],
        'quality_rank': value['qualityRank'],
        'banner_settings': AdspaceCreateBannerSettingsToJSON(value['bannerSettings']),
        'native_settings': value['nativeSettings'],
        'search_settings': AdspaceCreateSearchSettingsToJSON(value['searchSettings']),
        'email_settings': AdspaceCreateEmailSettingsToJSON(value['emailSettings']),
        'bot_settings': AdspaceCreateBotSettingsToJSON(value['botSettings']),
        'screen_settings': AdspaceCreateScreenSettingsToJSON(value['screenSettings']),
        'player_settings': value['playerSettings'],
        'pop_settings': value['popSettings'],
        'fpa_settings': value['fpaSettings'],
        'redirect_settings': value['redirectSettings'],
        'im_settings': value['imSettings'],
        'fixim_banner_settings': value['fiximBannerSettings'],
        'native_bar_settings': value['nativeBarSettings'],
        'native_webpush_settings': value['nativeWebpushSettings'],
        'text_settings': value['textSettings'],
        'floater_settings': value['floaterSettings'],
        'videoslider_settings': value['videosliderSettings'],
        'invideo_settings': value['invideoSettings'],
        'dyn_adsettings': value['dynAdsettings'],
        'inpage_videosettings': value['inpageVideosettings'],
        'carousel_videosettings': value['carouselVideosettings'],
    };
}

