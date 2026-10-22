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
/**
 * A tracking link — a `publisher_adzones` row under a hidden source
 * site. `is_smartlink` distinguishes the two shapes: a single-offer link
 * redirects straight through, a smartlink carries several `offer_ids`
 * and lets each offer's own targeting and eCPM pick the winner per click.
 * 
 * @export
 * @interface TrackingLink
 */
export interface TrackingLink {
    /**
     * The link's id — pass this as {id} on the link routes.
     * @type {number}
     * @memberof TrackingLink
     */
    adzoneId?: number;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    name?: string;
    /**
     * Traffic source the link belongs to.
     * @type {number}
     * @memberof TrackingLink
     */
    siteid?: number;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    sourceName?: string;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    sourceDescription?: string;
    /**
     * Macro template slug inherited from the source.
     * @type {string}
     * @memberof TrackingLink
     */
    sourceTemplate?: string;
    /**
     * The click URL path to hand the traffic source.
     * @type {string}
     * @memberof TrackingLink
     */
    urlPath?: string;
    /**
     * 
     * @type {boolean}
     * @memberof TrackingLink
     */
    isSmartlink?: boolean;
    /**
     * Bound offer on a single-offer link. 0 on a smartlink.
     * @type {number}
     * @memberof TrackingLink
     */
    offerId?: number;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    offerName?: string;
    /**
     * Offer pool on a smartlink.
     * @type {Array<number>}
     * @memberof TrackingLink
     */
    offerIds?: Array<number>;
    /**
     * Rotation weights, positionally matching offer_ids.
     * @type {Array<number>}
     * @memberof TrackingLink
     */
    weights?: Array<number>;
    /**
     * Macro slots the click URL carries.
     * @type {Array<string>}
     * @memberof TrackingLink
     */
    tokens?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    tags?: string;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    dateAdded?: string;
    /**
     * 
     * @type {boolean}
     * @memberof TrackingLink
     */
    isDeleted?: boolean;
    /**
     * Bound ad network, 0 when unbound.
     * @type {number}
     * @memberof TrackingLink
     */
    adnetworkId?: number;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    adnetworkName?: string;
    /**
     * 
     * @type {number}
     * @memberof TrackingLink
     */
    adnetworkCampaignid?: number;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    adnetworkCampaignKind?: string;
    /**
     * 
     * @type {string}
     * @memberof TrackingLink
     */
    adnetworkState?: string;
    /**
     * Whether rules may push changes back to the network.
     * @type {boolean}
     * @memberof TrackingLink
     */
    adnetworkAutoApi?: boolean;
}

/**
 * Check if a given object implements the TrackingLink interface.
 */
export function instanceOfTrackingLink(value: object): value is TrackingLink {
    return true;
}

export function TrackingLinkFromJSON(json: any): TrackingLink {
    return TrackingLinkFromJSONTyped(json, false);
}

export function TrackingLinkFromJSONTyped(json: any, ignoreDiscriminator: boolean): TrackingLink {
    if (json == null) {
        return json;
    }
    return {
        
        'adzoneId': json['adzone_id'] == null ? undefined : json['adzone_id'],
        'name': json['name'] == null ? undefined : json['name'],
        'siteid': json['siteid'] == null ? undefined : json['siteid'],
        'sourceName': json['source_name'] == null ? undefined : json['source_name'],
        'sourceDescription': json['source_description'] == null ? undefined : json['source_description'],
        'sourceTemplate': json['source_template'] == null ? undefined : json['source_template'],
        'urlPath': json['url_path'] == null ? undefined : json['url_path'],
        'isSmartlink': json['is_smartlink'] == null ? undefined : json['is_smartlink'],
        'offerId': json['offer_id'] == null ? undefined : json['offer_id'],
        'offerName': json['offer_name'] == null ? undefined : json['offer_name'],
        'offerIds': json['offer_ids'] == null ? undefined : json['offer_ids'],
        'weights': json['weights'] == null ? undefined : json['weights'],
        'tokens': json['tokens'] == null ? undefined : json['tokens'],
        'tags': json['tags'] == null ? undefined : json['tags'],
        'dateAdded': json['date_added'] == null ? undefined : json['date_added'],
        'isDeleted': json['is_deleted'] == null ? undefined : json['is_deleted'],
        'adnetworkId': json['adnetwork_id'] == null ? undefined : json['adnetwork_id'],
        'adnetworkName': json['adnetwork_name'] == null ? undefined : json['adnetwork_name'],
        'adnetworkCampaignid': json['adnetwork_campaignid'] == null ? undefined : json['adnetwork_campaignid'],
        'adnetworkCampaignKind': json['adnetwork_campaign_kind'] == null ? undefined : json['adnetwork_campaign_kind'],
        'adnetworkState': json['adnetwork_state'] == null ? undefined : json['adnetwork_state'],
        'adnetworkAutoApi': json['adnetwork_auto_api'] == null ? undefined : json['adnetwork_auto_api'],
    };
}

export function TrackingLinkToJSON(json: any): TrackingLink {
    return TrackingLinkToJSONTyped(json, false);
}

export function TrackingLinkToJSONTyped(value?: TrackingLink | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'adzone_id': value['adzoneId'],
        'name': value['name'],
        'siteid': value['siteid'],
        'source_name': value['sourceName'],
        'source_description': value['sourceDescription'],
        'source_template': value['sourceTemplate'],
        'url_path': value['urlPath'],
        'is_smartlink': value['isSmartlink'],
        'offer_id': value['offerId'],
        'offer_name': value['offerName'],
        'offer_ids': value['offerIds'],
        'weights': value['weights'],
        'tokens': value['tokens'],
        'tags': value['tags'],
        'date_added': value['dateAdded'],
        'is_deleted': value['isDeleted'],
        'adnetwork_id': value['adnetworkId'],
        'adnetwork_name': value['adnetworkName'],
        'adnetwork_campaignid': value['adnetworkCampaignid'],
        'adnetwork_campaign_kind': value['adnetworkCampaignKind'],
        'adnetwork_state': value['adnetworkState'],
        'adnetwork_auto_api': value['adnetworkAutoApi'],
    };
}

