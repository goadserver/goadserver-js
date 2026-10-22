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
import type { ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner } from './ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner';
import {
    ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInnerFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInnerFromJSONTyped,
    ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInnerToJSON,
    ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInnerToJSONTyped,
} from './ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner';

/**
 * 
 * @export
 * @interface ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
 */
export interface ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    description?: string;
    /**
     * Click URL. Alias: destination_url.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    destinationurl?: string;
    /**
     * Display URL (required content for native / push / offer ads). Alias: display_url.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    displayurl?: string;
    /**
     * Alias: preview_url.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    previewurl?: string;
    /**
     * Currency units of your account currency, like the panel (see the bid endpoint for the floor and the bid_unit contract).
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    bid?: number;
    /**
     * Alias: is_active (boolean accepted). Prefer PATCH …/active, which also runs the publisher-approval and notification side effects.
     * @type {ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIsactiveEnum}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    isactive?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIsactiveEnum;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    sortWeight?: number;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    position?: number;
    /**
     * Video ads: comma-separated placements (1 pre-roll, 2 mid-roll, 3 post-roll, 4 in-video slider, 5 interstitial, 6 in-page, 7 video carousel); "0" = all.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    displaytype?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    properties?: string;
    /**
     * Click-URL rotation pool (0 = none). Alias: url_pool_id.
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    urlPoolid?: number;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    creativeId?: number;
    /**
     * Push icon creative (with icon_type=creative).
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    iconId?: number;
    /**
     * 
     * @type {boolean}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    useImptracking?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    imptrackingurl?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    usekeywords?: boolean;
    /**
     * Comma- or newline-separated. Trimmed, lowercased and deduplicated on save.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    keywords?: string;
    /**
     * SmartAds `{fixed_position, smart_options}`; `chat` {followup, price} for AI chat ads (set those with chat_followup / chat_price); `keyword_preference` for Search Ads (set with keyword_mode).
     * @type {object}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    adOptions?: object;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    smartNetworkId?: number;
    /**
     * Search Ads (adtype 42) ron ads: a sponsored follow-up question for AI chat zones (chat_followups > 0); picking it asks the chat that question and counts as a click. Stored in ad_options.chat.followup (merged — other ad_options keys are kept); empty string clears.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    chatFollowup?: string;
    /**
     * Search Ads ron ads: the price on AI chat product cards (chat_style products). Stored in ad_options.chat.price; product feeds fill it.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    chatPrice?: string;
    /**
     * Search Ads (adtype 42) ron ads: how the ad's own keywords (usekeywords + keywords) act on a search. specific = shown only when a keyword matches the search; preference = shown for any search and ranked first when a keyword matches, at most 6 keywords (422 on keywords otherwise). Stored as ad_options.keyword_preference (true, or absent = specific); other ad_options keys are kept. Other zone types always treat ad keywords as specific.
     * @type {ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestKeywordModeEnum}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    keywordMode?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestKeywordModeEnum;
    /**
     * Shoppable video (ron video ads, adtype 4 / 20): timed hotspots and product cards over the ad. A click counts as the ad's click and lands on the overlay's url (empty = the ad's destination). Served to goCtrl's video players and in VAST (Extension goadserver-overlays + a SIMID InteractiveCreativeFile, VAST 4.1). Stored in ad_options.overlays (merged — other ad_options keys are kept); [] clears. Per-overlay shown / clicks: GET /campaigns/{type}/{campaignId}/ads/{adId}/overlay-stats.
     * @type {Array<ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner>}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    videoOverlays?: Array<ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner>;
    /**
     * The creative blob verbatim (object or JSON string).
     * @type {object}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    creatives?: object;
    /**
     * 
     * @type {ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestBannerTypeEnum}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    bannerType?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestBannerTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    bannerUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    bannerIframeUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    bannerHtml?: string;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    bannerPoolId?: number;
    /**
     * 
     * @type {ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestImageTypeEnum}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    imageType?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestImageTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    imageUrl?: string;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    imagePoolId?: number;
    /**
     * 
     * @type {ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestVideoTypeEnum}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    videoType?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestVideoTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    videoUrl?: string;
    /**
     * Audio ads (adtype 43): an https companion image shown while the ad plays (VAST CompanionAds; the goCtrl audio plugin's bar). Stored as creatives.image {type: url}.
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    companionUrl?: string;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    companionWidth?: number;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    companionHeight?: number;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    videoPoolId?: number;
    /**
     * 
     * @type {string}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    htmlCode?: string;
    /**
     * 
     * @type {number}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    htmlTotalItems?: number;
    /**
     * 
     * @type {ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIconTypeEnum}
     * @memberof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
     */
    iconType?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIconTypeEnum;
}


/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIsactiveEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIsactiveEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIsactiveEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIsactiveEnum];

/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestKeywordModeEnum = {
    Specific: 'specific',
    Preference: 'preference'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestKeywordModeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestKeywordModeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestKeywordModeEnum];

/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestBannerTypeEnum = {
    Creative: 'creative',
    Pool: 'pool',
    HotlinkImage: 'hotlink_image',
    HotlinkVideo: 'hotlink_video',
    Iframe: 'iframe',
    Html: 'html'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestBannerTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestBannerTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestBannerTypeEnum];

/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestImageTypeEnum = {
    Creative: 'creative',
    Pool: 'pool',
    Html: 'html',
    None: 'none'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestImageTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestImageTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestImageTypeEnum];

/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestVideoTypeEnum = {
    Url: 'url',
    Xml: 'xml',
    Html: 'html',
    Creative: 'creative',
    Pool: 'pool'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestVideoTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestVideoTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestVideoTypeEnum];

/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIconTypeEnum = {
    Creative: 'creative'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIconTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIconTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestIconTypeEnum];


/**
 * Check if a given object implements the ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest interface.
 */
export function instanceOfApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest(value: object): value is ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest {
    return true;
}

export function ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestFromJSON(json: any): ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest {
    return ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestFromJSONTyped(json, false);
}

export function ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'] == null ? undefined : json['title'],
        'description': json['description'] == null ? undefined : json['description'],
        'destinationurl': json['destinationurl'] == null ? undefined : json['destinationurl'],
        'displayurl': json['displayurl'] == null ? undefined : json['displayurl'],
        'previewurl': json['previewurl'] == null ? undefined : json['previewurl'],
        'bid': json['bid'] == null ? undefined : json['bid'],
        'isactive': json['isactive'] == null ? undefined : json['isactive'],
        'sortWeight': json['sort_weight'] == null ? undefined : json['sort_weight'],
        'position': json['position'] == null ? undefined : json['position'],
        'displaytype': json['displaytype'] == null ? undefined : json['displaytype'],
        'properties': json['properties'] == null ? undefined : json['properties'],
        'urlPoolid': json['url_poolid'] == null ? undefined : json['url_poolid'],
        'creativeId': json['creative_id'] == null ? undefined : json['creative_id'],
        'iconId': json['icon_id'] == null ? undefined : json['icon_id'],
        'useImptracking': json['use_imptracking'] == null ? undefined : json['use_imptracking'],
        'imptrackingurl': json['imptrackingurl'] == null ? undefined : json['imptrackingurl'],
        'usekeywords': json['usekeywords'] == null ? undefined : json['usekeywords'],
        'keywords': json['keywords'] == null ? undefined : json['keywords'],
        'adOptions': json['ad_options'] == null ? undefined : json['ad_options'],
        'smartNetworkId': json['smart_network_id'] == null ? undefined : json['smart_network_id'],
        'chatFollowup': json['chat_followup'] == null ? undefined : json['chat_followup'],
        'chatPrice': json['chat_price'] == null ? undefined : json['chat_price'],
        'keywordMode': json['keyword_mode'] == null ? undefined : json['keyword_mode'],
        'videoOverlays': json['video_overlays'] == null ? undefined : ((json['video_overlays'] as Array<any>).map(ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInnerFromJSON)),
        'creatives': json['creatives'] == null ? undefined : json['creatives'],
        'bannerType': json['banner_type'] == null ? undefined : json['banner_type'],
        'bannerUrl': json['banner_url'] == null ? undefined : json['banner_url'],
        'bannerIframeUrl': json['banner_iframe_url'] == null ? undefined : json['banner_iframe_url'],
        'bannerHtml': json['banner_html'] == null ? undefined : json['banner_html'],
        'bannerPoolId': json['banner_pool_id'] == null ? undefined : json['banner_pool_id'],
        'imageType': json['image_type'] == null ? undefined : json['image_type'],
        'imageUrl': json['image_url'] == null ? undefined : json['image_url'],
        'imagePoolId': json['image_pool_id'] == null ? undefined : json['image_pool_id'],
        'videoType': json['video_type'] == null ? undefined : json['video_type'],
        'videoUrl': json['video_url'] == null ? undefined : json['video_url'],
        'companionUrl': json['companion_url'] == null ? undefined : json['companion_url'],
        'companionWidth': json['companion_width'] == null ? undefined : json['companion_width'],
        'companionHeight': json['companion_height'] == null ? undefined : json['companion_height'],
        'videoPoolId': json['video_pool_id'] == null ? undefined : json['video_pool_id'],
        'htmlCode': json['html_code'] == null ? undefined : json['html_code'],
        'htmlTotalItems': json['html_total_items'] == null ? undefined : json['html_total_items'],
        'iconType': json['icon_type'] == null ? undefined : json['icon_type'],
    };
}

export function ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestToJSON(json: any): ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest {
    return ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestToJSONTyped(json, false);
}

export function ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestToJSONTyped(value?: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'title': value['title'],
        'description': value['description'],
        'destinationurl': value['destinationurl'],
        'displayurl': value['displayurl'],
        'previewurl': value['previewurl'],
        'bid': value['bid'],
        'isactive': value['isactive'],
        'sort_weight': value['sortWeight'],
        'position': value['position'],
        'displaytype': value['displaytype'],
        'properties': value['properties'],
        'url_poolid': value['urlPoolid'],
        'creative_id': value['creativeId'],
        'icon_id': value['iconId'],
        'use_imptracking': value['useImptracking'],
        'imptrackingurl': value['imptrackingurl'],
        'usekeywords': value['usekeywords'],
        'keywords': value['keywords'],
        'ad_options': value['adOptions'],
        'smart_network_id': value['smartNetworkId'],
        'chat_followup': value['chatFollowup'],
        'chat_price': value['chatPrice'],
        'keyword_mode': value['keywordMode'],
        'video_overlays': value['videoOverlays'] == null ? undefined : ((value['videoOverlays'] as Array<any>).map(ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInnerToJSON)),
        'creatives': value['creatives'],
        'banner_type': value['bannerType'],
        'banner_url': value['bannerUrl'],
        'banner_iframe_url': value['bannerIframeUrl'],
        'banner_html': value['bannerHtml'],
        'banner_pool_id': value['bannerPoolId'],
        'image_type': value['imageType'],
        'image_url': value['imageUrl'],
        'image_pool_id': value['imagePoolId'],
        'video_type': value['videoType'],
        'video_url': value['videoUrl'],
        'companion_url': value['companionUrl'],
        'companion_width': value['companionWidth'],
        'companion_height': value['companionHeight'],
        'video_pool_id': value['videoPoolId'],
        'html_code': value['htmlCode'],
        'html_total_items': value['htmlTotalItems'],
        'icon_type': value['iconType'],
    };
}

