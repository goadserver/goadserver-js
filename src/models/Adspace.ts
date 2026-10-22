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
import type { AdspaceNetworkBinding } from './AdspaceNetworkBinding';
import {
    AdspaceNetworkBindingFromJSON,
    AdspaceNetworkBindingFromJSONTyped,
    AdspaceNetworkBindingToJSON,
    AdspaceNetworkBindingToJSONTyped,
} from './AdspaceNetworkBinding';
import type { AdspaceSite } from './AdspaceSite';
import {
    AdspaceSiteFromJSON,
    AdspaceSiteFromJSONTyped,
    AdspaceSiteToJSON,
    AdspaceSiteToJSONTyped,
} from './AdspaceSite';

/**
 * Full adspace record returned by `GET /api/v1/adspaces/{id}` and
 * the create/update endpoints. Shape mirrors `AdspaceCreate` so
 * round-trips work without translation, plus a few read-only
 * identity fields (`id`, `uniq_name`, `adspace_type`, `is_active`,
 * `date_added`, `time_changed`) and the parsed `json_settings`.
 * 
 * @export
 * @interface Adspace
 */
export interface Adspace {
    [key: string]: any | any;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof Adspace
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof Adspace
     */
    description?: string;
    /**
     * MD5 of (name, type, system, site) — internal dedupe key.
     * @type {string}
     * @memberof Adspace
     */
    uniqName?: string;
    /**
     * 
     * @type {AdspaceSite}
     * @memberof Adspace
     */
    site?: AdspaceSite;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    siteid?: number;
    /**
     * Type config key (e.g. bannerads).
     * @type {string}
     * @memberof Adspace
     */
    adspaceType?: string;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    adzoneTypeid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    adtypeId?: number;
    /**
     * Backward-compat alias for adtype_id.
     * @type {number}
     * @memberof Adspace
     */
    adType?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    adsizeid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    displayType?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    ratingid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    mainCatid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    catid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    locationid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    qualityRank?: number;
    /**
     * Derived from publisher_adzones.isinuse — true when at least one campaign-spot link exists.
     * @type {boolean}
     * @memberof Adspace
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    autoapprove?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    isvisible?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    sendmails?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useownbanners?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    usealtbanner?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    usecpmbuys?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    allowIframes?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    allowAnimation?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    runRtbAfterSmartzone?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    usePixelLog?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    showAbout?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    skipRonIfCpm?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    noPromotion?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    hidecopy?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useSubidList?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Adspace
     */
    subidList?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useDomainList?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof Adspace
     */
    domainList?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useCosts?: boolean;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof Adspace
     */
    costsData?: { [key: string]: any; };
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useDynamicCosts?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useFixedPayouts?: boolean;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof Adspace
     */
    fixedPayoutData?: { [key: string]: any; };
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useFallbackCampaign?: boolean;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    fallbackCampaignid?: number;
    /**
     * 
     * @type {string}
     * @memberof Adspace
     */
    exclCatids?: string;
    /**
     * 
     * @type {string}
     * @memberof Adspace
     */
    exclproperties?: string;
    /**
     * 
     * @type {Array<number>}
     * @memberof Adspace
     */
    tags?: Array<number>;
    /**
     * 
     * @type {string}
     * @memberof Adspace
     */
    rtbName?: string;
    /**
     * 
     * @type {Date}
     * @memberof Adspace
     */
    dateAdded?: Date;
    /**
     * Unix seconds of last update.
     * @type {number}
     * @memberof Adspace
     */
    timeChanged?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    useflatbuys?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    onlyWlCampaigns?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    onlyTaggedCampaigns?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Adspace
     */
    forceWlTargeting?: boolean;
    /**
     * From json_settings.options.
     * @type {boolean}
     * @memberof Adspace
     */
    skipRtbWhenWl?: boolean;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    parentid?: number;
    /**
     * 
     * @type {number}
     * @memberof Adspace
     */
    newZoneid?: number;
    /**
     * 
     * @type {AdspaceNetworkBinding}
     * @memberof Adspace
     */
    networkBinding?: AdspaceNetworkBinding;
    /**
     * Raw assembled blob — unioned hoisted to top level for convenience.
     * @type {{ [key: string]: any; }}
     * @memberof Adspace
     */
    jsonSettings?: { [key: string]: any; };
}

/**
 * Check if a given object implements the Adspace interface.
 */
export function instanceOfAdspace(value: object): value is Adspace {
    return true;
}

export function AdspaceFromJSON(json: any): Adspace {
    return AdspaceFromJSONTyped(json, false);
}

export function AdspaceFromJSONTyped(json: any, ignoreDiscriminator: boolean): Adspace {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'uniqName': json['uniq_name'] == null ? undefined : json['uniq_name'],
        'site': json['site'] == null ? undefined : AdspaceSiteFromJSON(json['site']),
        'siteid': json['siteid'] == null ? undefined : json['siteid'],
        'adspaceType': json['adspace_type'] == null ? undefined : json['adspace_type'],
        'adzoneTypeid': json['adzone_typeid'] == null ? undefined : json['adzone_typeid'],
        'adtypeId': json['adtype_id'] == null ? undefined : json['adtype_id'],
        'adType': json['ad_type'] == null ? undefined : json['ad_type'],
        'adsizeid': json['adsizeid'] == null ? undefined : json['adsizeid'],
        'displayType': json['display_type'] == null ? undefined : json['display_type'],
        'ratingid': json['ratingid'] == null ? undefined : json['ratingid'],
        'mainCatid': json['main_catid'] == null ? undefined : json['main_catid'],
        'catid': json['catid'] == null ? undefined : json['catid'],
        'locationid': json['locationid'] == null ? undefined : json['locationid'],
        'qualityRank': json['quality_rank'] == null ? undefined : json['quality_rank'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'autoapprove': json['autoapprove'] == null ? undefined : json['autoapprove'],
        'isvisible': json['isvisible'] == null ? undefined : json['isvisible'],
        'sendmails': json['sendmails'] == null ? undefined : json['sendmails'],
        'useownbanners': json['useownbanners'] == null ? undefined : json['useownbanners'],
        'usealtbanner': json['usealtbanner'] == null ? undefined : json['usealtbanner'],
        'usecpmbuys': json['usecpmbuys'] == null ? undefined : json['usecpmbuys'],
        'allowIframes': json['allow_iframes'] == null ? undefined : json['allow_iframes'],
        'allowAnimation': json['allow_animation'] == null ? undefined : json['allow_animation'],
        'runRtbAfterSmartzone': json['run_rtb_after_smartzone'] == null ? undefined : json['run_rtb_after_smartzone'],
        'usePixelLog': json['use_pixel_log'] == null ? undefined : json['use_pixel_log'],
        'showAbout': json['show_about'] == null ? undefined : json['show_about'],
        'skipRonIfCpm': json['skip_ron_if_cpm'] == null ? undefined : json['skip_ron_if_cpm'],
        'noPromotion': json['no_promotion'] == null ? undefined : json['no_promotion'],
        'hidecopy': json['hidecopy'] == null ? undefined : json['hidecopy'],
        'useSubidList': json['use_subid_list'] == null ? undefined : json['use_subid_list'],
        'subidList': json['subid_list'] == null ? undefined : json['subid_list'],
        'useDomainList': json['use_domain_list'] == null ? undefined : json['use_domain_list'],
        'domainList': json['domain_list'] == null ? undefined : json['domain_list'],
        'useCosts': json['use_costs'] == null ? undefined : json['use_costs'],
        'costsData': json['costs_data'] == null ? undefined : json['costs_data'],
        'useDynamicCosts': json['use_dynamic_costs'] == null ? undefined : json['use_dynamic_costs'],
        'useFixedPayouts': json['use_fixed_payouts'] == null ? undefined : json['use_fixed_payouts'],
        'fixedPayoutData': json['fixed_payout_data'] == null ? undefined : json['fixed_payout_data'],
        'useFallbackCampaign': json['use_fallback_campaign'] == null ? undefined : json['use_fallback_campaign'],
        'fallbackCampaignid': json['fallback_campaignid'] == null ? undefined : json['fallback_campaignid'],
        'exclCatids': json['excl_catids'] == null ? undefined : json['excl_catids'],
        'exclproperties': json['exclproperties'] == null ? undefined : json['exclproperties'],
        'tags': json['tags'] == null ? undefined : json['tags'],
        'rtbName': json['rtb_name'] == null ? undefined : json['rtb_name'],
        'dateAdded': json['date_added'] == null ? undefined : (new Date(json['date_added'])),
        'timeChanged': json['time_changed'] == null ? undefined : json['time_changed'],
        'useflatbuys': json['useflatbuys'] == null ? undefined : json['useflatbuys'],
        'onlyWlCampaigns': json['only_wl_campaigns'] == null ? undefined : json['only_wl_campaigns'],
        'onlyTaggedCampaigns': json['only_tagged_campaigns'] == null ? undefined : json['only_tagged_campaigns'],
        'forceWlTargeting': json['force_wl_targeting'] == null ? undefined : json['force_wl_targeting'],
        'skipRtbWhenWl': json['skip_rtb_when_wl'] == null ? undefined : json['skip_rtb_when_wl'],
        'parentid': json['parentid'] == null ? undefined : json['parentid'],
        'newZoneid': json['new_zoneid'] == null ? undefined : json['new_zoneid'],
        'networkBinding': json['network_binding'] == null ? undefined : AdspaceNetworkBindingFromJSON(json['network_binding']),
        'jsonSettings': json['json_settings'] == null ? undefined : json['json_settings'],
    };
}

export function AdspaceToJSON(json: any): Adspace {
    return AdspaceToJSONTyped(json, false);
}

export function AdspaceToJSONTyped(value?: Adspace | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
            ...value,
        'id': value['id'],
        'name': value['name'],
        'description': value['description'],
        'uniq_name': value['uniqName'],
        'site': AdspaceSiteToJSON(value['site']),
        'siteid': value['siteid'],
        'adspace_type': value['adspaceType'],
        'adzone_typeid': value['adzoneTypeid'],
        'adtype_id': value['adtypeId'],
        'ad_type': value['adType'],
        'adsizeid': value['adsizeid'],
        'display_type': value['displayType'],
        'ratingid': value['ratingid'],
        'main_catid': value['mainCatid'],
        'catid': value['catid'],
        'locationid': value['locationid'],
        'quality_rank': value['qualityRank'],
        'is_active': value['isActive'],
        'autoapprove': value['autoapprove'],
        'isvisible': value['isvisible'],
        'sendmails': value['sendmails'],
        'useownbanners': value['useownbanners'],
        'usealtbanner': value['usealtbanner'],
        'usecpmbuys': value['usecpmbuys'],
        'allow_iframes': value['allowIframes'],
        'allow_animation': value['allowAnimation'],
        'run_rtb_after_smartzone': value['runRtbAfterSmartzone'],
        'use_pixel_log': value['usePixelLog'],
        'show_about': value['showAbout'],
        'skip_ron_if_cpm': value['skipRonIfCpm'],
        'no_promotion': value['noPromotion'],
        'hidecopy': value['hidecopy'],
        'use_subid_list': value['useSubidList'],
        'subid_list': value['subidList'],
        'use_domain_list': value['useDomainList'],
        'domain_list': value['domainList'],
        'use_costs': value['useCosts'],
        'costs_data': value['costsData'],
        'use_dynamic_costs': value['useDynamicCosts'],
        'use_fixed_payouts': value['useFixedPayouts'],
        'fixed_payout_data': value['fixedPayoutData'],
        'use_fallback_campaign': value['useFallbackCampaign'],
        'fallback_campaignid': value['fallbackCampaignid'],
        'excl_catids': value['exclCatids'],
        'exclproperties': value['exclproperties'],
        'tags': value['tags'],
        'rtb_name': value['rtbName'],
        'date_added': value['dateAdded'] == null ? value['dateAdded'] : value['dateAdded'].toISOString(),
        'time_changed': value['timeChanged'],
        'useflatbuys': value['useflatbuys'],
        'only_wl_campaigns': value['onlyWlCampaigns'],
        'only_tagged_campaigns': value['onlyTaggedCampaigns'],
        'force_wl_targeting': value['forceWlTargeting'],
        'skip_rtb_when_wl': value['skipRtbWhenWl'],
        'parentid': value['parentid'],
        'new_zoneid': value['newZoneid'],
        'network_binding': AdspaceNetworkBindingToJSON(value['networkBinding']),
        'json_settings': value['jsonSettings'],
    };
}

