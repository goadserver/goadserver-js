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
  ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest,
  ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest,
  ApiV1CampaignsGet200Response,
  ApiV1CampaignsMassDeletePostRequest,
  ApiV1CampaignsMassTogglePutRequest,
  ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response,
  ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response,
  ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest,
  ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response,
  ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest,
  ApiV1CampaignsRonIdSiteListSiteIdPutRequest,
  ApiV1CampaignsRonIdZonesGet200Response,
  ApiV1CampaignsSaveCategoriesPutRequest,
  ApiV1CampaignsSaveTagsPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response,
  ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response,
  ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest,
  ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response,
  ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response,
  ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest,
  ApiV1CampaignsTypeCampaignIdAdsGet200Response,
  ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest,
  ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest,
  ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest,
  ApiV1CampaignsTypeCampaignIdAdsPostRequest,
  ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest,
  ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest,
  ApiV1CampaignsTypeIdActivePatch200Response,
  ApiV1CampaignsTypeIdActivePatchRequest,
  ApiV1CampaignsTypeIdBidsPatch200Response,
  ApiV1CampaignsTypeIdBidsPatchRequest,
  ApiV1CampaignsTypeIdBudgetPatch200Response,
  ApiV1CampaignsTypeIdBudgetPatchRequest,
  ApiV1CampaignsTypeIdClonePost201Response,
  ApiV1CampaignsTypeIdClonePostRequest,
  ApiV1CampaignsTypeIdDelete200Response,
  ApiV1CampaignsTypeIdFiltersGet200Response,
  ApiV1CampaignsTypeIdFiltersPost200Response,
  ApiV1CampaignsTypeIdFiltersPostRequest,
  ApiV1CampaignsTypeIdMinBidGet200Response,
  ApiV1CampaignsTypeIdPatchRequest,
  ApiV1CampaignsTypeIdZonesPostRequest,
  ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest,
  ApiV1CampaignsTypePostRequest,
  ApiV1CampaignsTypeSchemaAdsGet200Response,
  ApiV1CampaignsTypeSchemaGet200Response,
  ApiV1RtbTestRtbPostRequest,
  ApiV1ToolsReplaceDomainPutRequest,
  RtbTestRequest,
  RtbTestResult,
} from '../models/index';
import {
    ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequestFromJSON,
    ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequestToJSON,
    ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequestFromJSON,
    ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequestToJSON,
    ApiV1CampaignsGet200ResponseFromJSON,
    ApiV1CampaignsGet200ResponseToJSON,
    ApiV1CampaignsMassDeletePostRequestFromJSON,
    ApiV1CampaignsMassDeletePostRequestToJSON,
    ApiV1CampaignsMassTogglePutRequestFromJSON,
    ApiV1CampaignsMassTogglePutRequestToJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseFromJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseToJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200ResponseFromJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200ResponseToJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestFromJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestToJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200ResponseFromJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200ResponseToJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequestFromJSON,
    ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequestToJSON,
    ApiV1CampaignsRonIdSiteListSiteIdPutRequestFromJSON,
    ApiV1CampaignsRonIdSiteListSiteIdPutRequestToJSON,
    ApiV1CampaignsRonIdZonesGet200ResponseFromJSON,
    ApiV1CampaignsRonIdZonesGet200ResponseToJSON,
    ApiV1CampaignsSaveCategoriesPutRequestFromJSON,
    ApiV1CampaignsSaveCategoriesPutRequestToJSON,
    ApiV1CampaignsSaveTagsPutRequestFromJSON,
    ApiV1CampaignsSaveTagsPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200ResponseToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200ResponseToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200ResponseToJSON,
    ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsGet200ResponseFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsGet200ResponseToJSON,
    ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsPostRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsPostRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequestToJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequestFromJSON,
    ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequestToJSON,
    ApiV1CampaignsTypeIdActivePatch200ResponseFromJSON,
    ApiV1CampaignsTypeIdActivePatch200ResponseToJSON,
    ApiV1CampaignsTypeIdActivePatchRequestFromJSON,
    ApiV1CampaignsTypeIdActivePatchRequestToJSON,
    ApiV1CampaignsTypeIdBidsPatch200ResponseFromJSON,
    ApiV1CampaignsTypeIdBidsPatch200ResponseToJSON,
    ApiV1CampaignsTypeIdBidsPatchRequestFromJSON,
    ApiV1CampaignsTypeIdBidsPatchRequestToJSON,
    ApiV1CampaignsTypeIdBudgetPatch200ResponseFromJSON,
    ApiV1CampaignsTypeIdBudgetPatch200ResponseToJSON,
    ApiV1CampaignsTypeIdBudgetPatchRequestFromJSON,
    ApiV1CampaignsTypeIdBudgetPatchRequestToJSON,
    ApiV1CampaignsTypeIdClonePost201ResponseFromJSON,
    ApiV1CampaignsTypeIdClonePost201ResponseToJSON,
    ApiV1CampaignsTypeIdClonePostRequestFromJSON,
    ApiV1CampaignsTypeIdClonePostRequestToJSON,
    ApiV1CampaignsTypeIdDelete200ResponseFromJSON,
    ApiV1CampaignsTypeIdDelete200ResponseToJSON,
    ApiV1CampaignsTypeIdFiltersGet200ResponseFromJSON,
    ApiV1CampaignsTypeIdFiltersGet200ResponseToJSON,
    ApiV1CampaignsTypeIdFiltersPost200ResponseFromJSON,
    ApiV1CampaignsTypeIdFiltersPost200ResponseToJSON,
    ApiV1CampaignsTypeIdFiltersPostRequestFromJSON,
    ApiV1CampaignsTypeIdFiltersPostRequestToJSON,
    ApiV1CampaignsTypeIdMinBidGet200ResponseFromJSON,
    ApiV1CampaignsTypeIdMinBidGet200ResponseToJSON,
    ApiV1CampaignsTypeIdPatchRequestFromJSON,
    ApiV1CampaignsTypeIdPatchRequestToJSON,
    ApiV1CampaignsTypeIdZonesPostRequestFromJSON,
    ApiV1CampaignsTypeIdZonesPostRequestToJSON,
    ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequestFromJSON,
    ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequestToJSON,
    ApiV1CampaignsTypePostRequestFromJSON,
    ApiV1CampaignsTypePostRequestToJSON,
    ApiV1CampaignsTypeSchemaAdsGet200ResponseFromJSON,
    ApiV1CampaignsTypeSchemaAdsGet200ResponseToJSON,
    ApiV1CampaignsTypeSchemaGet200ResponseFromJSON,
    ApiV1CampaignsTypeSchemaGet200ResponseToJSON,
    ApiV1RtbTestRtbPostRequestFromJSON,
    ApiV1RtbTestRtbPostRequestToJSON,
    ApiV1ToolsReplaceDomainPutRequestFromJSON,
    ApiV1ToolsReplaceDomainPutRequestToJSON,
    RtbTestRequestFromJSON,
    RtbTestRequestToJSON,
    RtbTestResultFromJSON,
    RtbTestResultToJSON,
} from '../models/index';

export interface ApiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequest {
    campaignId: number;
    spaceId: number;
}

export interface ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostOperationRequest {
    campaignId: number;
    spaceId: number;
    apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest?: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest;
}

export interface ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequest {
    campaignId: number;
    spaceId: number;
}

export interface ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationRequest {
    campaignId: number;
    spaceId: number;
    type: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationTypeEnum;
    apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest;
}

export interface ApiV1CampaignsGetRequest {
    type?: ApiV1CampaignsGetTypeEnum;
    deleted?: boolean;
    page?: number;
    perPage?: number;
    fields?: string;
}

export interface ApiV1CampaignsMassDeletePostOperationRequest {
    apiV1CampaignsMassDeletePostRequest: ApiV1CampaignsMassDeletePostRequest;
}

export interface ApiV1CampaignsMassTogglePutOperationRequest {
    apiV1CampaignsMassTogglePutRequest: ApiV1CampaignsMassTogglePutRequest;
}

export interface ApiV1CampaignsMassUndeletePostRequest {
    apiV1CampaignsMassDeletePostRequest: ApiV1CampaignsMassDeletePostRequest;
}

export interface ApiV1CampaignsPurgePostRequest {
    apiV1CampaignsMassDeletePostRequest: ApiV1CampaignsMassDeletePostRequest;
}

export interface ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequest {
    campaignId: number;
    adId: number;
}

export interface ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutOperationRequest {
    campaignId: number;
    adId: number;
    apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest;
}

export interface ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequest {
    campaignId: number;
    adId: number;
    zoneId: number;
}

export interface ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutOperationRequest {
    campaignId: number;
    adId: number;
    apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest;
}

export interface ApiV1CampaignsRonIdSiteListGetRequest {
    id: number;
    mainCatid?: number;
    catids?: string;
}

export interface ApiV1CampaignsRonIdSiteListSiteIdPutOperationRequest {
    id: number;
    siteId: number;
    apiV1CampaignsRonIdSiteListSiteIdPutRequest: ApiV1CampaignsRonIdSiteListSiteIdPutRequest;
}

export interface ApiV1CampaignsRonIdZonesGetRequest {
    id: number;
}

export interface ApiV1CampaignsRtbIdTestRtbGetRequest {
    id: number;
}

export interface ApiV1CampaignsRtbIdTestRtbPostRequest {
    id: number;
    rtbTestRequest?: RtbTestRequest;
}

export interface ApiV1CampaignsSaveCategoriesPutOperationRequest {
    apiV1CampaignsSaveCategoriesPutRequest: ApiV1CampaignsSaveCategoriesPutRequest;
}

export interface ApiV1CampaignsSaveTagsPutOperationRequest {
    apiV1CampaignsSaveTagsPutRequest: ApiV1CampaignsSaveTagsPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchTypeEnum;
    campaignId: number;
    adId: number;
    apiV1CampaignsTypeIdActivePatchRequest: ApiV1CampaignsTypeIdActivePatchRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationTypeEnum;
    campaignId: number;
    adId: number;
    apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest: ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationTypeEnum;
    campaignId: number;
    adId: number;
    apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest: ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostTypeEnum;
    campaignId: number;
    adId: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationTypeEnum;
    campaignId: number;
    adId: number;
    apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest: ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteTypeEnum;
    campaignId: number;
    adId: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdGetRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdGetTypeEnum;
    campaignId: number;
    adId: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetTypeEnum;
    campaignId: number;
    adId: number;
    from?: Date;
    to?: Date;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationTypeEnum;
    campaignId: number;
    adId: number;
    apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutTypeEnum;
    campaignId: number;
    adId: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetTypeEnum;
    campaignId: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsCsvImportPostRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostTypeEnum;
    campaignId: number;
    file: Blob;
    imageColumn?: string;
    urlColumn?: string;
    nameColumn?: string;
    groupColumn?: string;
    groups?: string;
    folderId?: number;
    folderName?: string;
    folderPerGroup?: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostFolderPerGroupEnum;
    namePrefix?: string;
    squareMode?: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSquareModeEnum;
    padColor?: string;
    cropSquare?: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostCropSquareEnum;
    setActive?: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSetActiveEnum;
    bid?: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest: ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsGetRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsGetTypeEnum;
    campaignId: number;
    adState?: ApiV1CampaignsTypeCampaignIdAdsGetAdStateEnum;
    search?: string;
    sortBy?: ApiV1CampaignsTypeCampaignIdAdsGetSortByEnum;
    sortDir?: ApiV1CampaignsTypeCampaignIdAdsGetSortDirEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest: ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest: ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest: ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostTypeEnum;
    campaignId: number;
    files: Array<Blob>;
    title?: string;
    description?: string;
    useOverlays?: ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostUseOverlaysEnum;
    clonePerOverlay?: ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostClonePerOverlayEnum;
    overlay?: Array<Blob>;
    overlaysZip?: Array<Blob>;
}

export interface ApiV1CampaignsTypeCampaignIdAdsPostOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsPostOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsPostRequest: ApiV1CampaignsTypeCampaignIdAdsPostRequest;
    dryRun?: ApiV1CampaignsTypeCampaignIdAdsPostOperationDryRunEnum;
    strict?: ApiV1CampaignsTypeCampaignIdAdsPostOperationStrictEnum;
}

export interface ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest: ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationRequest {
    type: ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationTypeEnum;
    campaignId: number;
    apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest: ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest;
}

export interface ApiV1CampaignsTypeCampaignIdSchemaAdsGetRequest {
    type: ApiV1CampaignsTypeCampaignIdSchemaAdsGetTypeEnum;
    campaignId: number;
}

export interface ApiV1CampaignsTypeIdActivePatchOperationRequest {
    type: ApiV1CampaignsTypeIdActivePatchOperationTypeEnum;
    id: number;
    apiV1CampaignsTypeIdActivePatchRequest: ApiV1CampaignsTypeIdActivePatchRequest;
}

export interface ApiV1CampaignsTypeIdAvailableZonesGetRequest {
    type: ApiV1CampaignsTypeIdAvailableZonesGetTypeEnum;
    id: number;
    page?: number;
    perPage?: number;
    search?: string;
    siteId?: number;
    excludeIds?: string;
    onlyUsedSizes?: boolean;
}

export interface ApiV1CampaignsTypeIdBidsPatchOperationRequest {
    type: ApiV1CampaignsTypeIdBidsPatchOperationTypeEnum;
    id: number;
    apiV1CampaignsTypeIdBidsPatchRequest: ApiV1CampaignsTypeIdBidsPatchRequest;
}

export interface ApiV1CampaignsTypeIdBudgetPatchOperationRequest {
    type: ApiV1CampaignsTypeIdBudgetPatchOperationTypeEnum;
    id: number;
    apiV1CampaignsTypeIdBudgetPatchRequest: ApiV1CampaignsTypeIdBudgetPatchRequest;
}

export interface ApiV1CampaignsTypeIdClonePostOperationRequest {
    type: ApiV1CampaignsTypeIdClonePostOperationTypeEnum;
    id: number;
    strict?: ApiV1CampaignsTypeIdClonePostOperationStrictEnum;
    apiV1CampaignsTypeIdClonePostRequest?: ApiV1CampaignsTypeIdClonePostRequest;
}

export interface ApiV1CampaignsTypeIdDeleteRequest {
    type: ApiV1CampaignsTypeIdDeleteTypeEnum;
    id: number;
}

export interface ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequest {
    type: ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteTypeEnum;
    id: number;
    filterType: string;
    filterId: number;
}

export interface ApiV1CampaignsTypeIdFiltersGetRequest {
    type: ApiV1CampaignsTypeIdFiltersGetTypeEnum;
    id: number;
}

export interface ApiV1CampaignsTypeIdFiltersPostOperationRequest {
    type: ApiV1CampaignsTypeIdFiltersPostOperationTypeEnum;
    id: number;
    apiV1CampaignsTypeIdFiltersPostRequest: ApiV1CampaignsTypeIdFiltersPostRequest;
}

export interface ApiV1CampaignsTypeIdGetRequest {
    type: ApiV1CampaignsTypeIdGetTypeEnum;
    id: number;
}

export interface ApiV1CampaignsTypeIdMinBidGetRequest {
    type: ApiV1CampaignsTypeIdMinBidGetTypeEnum;
    id: number;
}

export interface ApiV1CampaignsTypeIdPatchOperationRequest {
    type: ApiV1CampaignsTypeIdPatchOperationTypeEnum;
    id: number;
    apiV1CampaignsTypeIdPatchRequest: ApiV1CampaignsTypeIdPatchRequest;
    dryRun?: ApiV1CampaignsTypeIdPatchOperationDryRunEnum;
    strict?: ApiV1CampaignsTypeIdPatchOperationStrictEnum;
}

export interface ApiV1CampaignsTypeIdResetMaxBudgetPutRequest {
    type: ApiV1CampaignsTypeIdResetMaxBudgetPutTypeEnum;
    id: number;
}

export interface ApiV1CampaignsTypeIdSitesGetRequest {
    type: ApiV1CampaignsTypeIdSitesGetTypeEnum;
    id: number;
    excludeIds?: string;
}

export interface ApiV1CampaignsTypeIdWhitelistZonesGetRequest {
    type: ApiV1CampaignsTypeIdWhitelistZonesGetTypeEnum;
    id: number;
}

export interface ApiV1CampaignsTypeIdZonesPostOperationRequest {
    type: ApiV1CampaignsTypeIdZonesPostOperationTypeEnum;
    id: number;
    apiV1CampaignsTypeIdZonesPostRequest: ApiV1CampaignsTypeIdZonesPostRequest;
}

export interface ApiV1CampaignsTypeIdZonesZoneIdDeleteRequest {
    type: ApiV1CampaignsTypeIdZonesZoneIdDeleteTypeEnum;
    id: number;
    zoneId: number;
}

export interface ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationRequest {
    type: ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationTypeEnum;
    id: number;
    zoneId: number;
    apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest: ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest;
}

export interface ApiV1CampaignsTypePostOperationRequest {
    type: ApiV1CampaignsTypePostOperationTypeEnum;
    apiV1CampaignsTypePostRequest: ApiV1CampaignsTypePostRequest;
    dryRun?: ApiV1CampaignsTypePostOperationDryRunEnum;
    strict?: ApiV1CampaignsTypePostOperationStrictEnum;
}

export interface ApiV1CampaignsTypeSchemaAdsGetRequest {
    type: ApiV1CampaignsTypeSchemaAdsGetTypeEnum;
}

export interface ApiV1CampaignsTypeSchemaGetRequest {
    type: ApiV1CampaignsTypeSchemaGetTypeEnum;
    adType?: number;
}

export interface ApiV1RtbTestRtbContextGetRequest {
    adtypeid?: number;
    rtbtype?: ApiV1RtbTestRtbContextGetRtbtypeEnum;
}

export interface ApiV1RtbTestRtbPostOperationRequest {
    apiV1RtbTestRtbPostRequest: ApiV1RtbTestRtbPostRequest;
}

export interface ApiV1ToolsReplaceDomainPutOperationRequest {
    apiV1ToolsReplaceDomainPutRequest: ApiV1ToolsReplaceDomainPutRequest;
}

/**
 * 
 */
export class CampaignsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete without sending the request
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequestOpts(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete().'
            );
        }

        if (requestParameters['spaceId'] == null) {
            throw new runtime.RequiredError(
                'spaceId',
                'Required parameter "spaceId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/cpm/{campaignId}/spots/{spaceId}`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"spaceId"}}`, encodeURIComponent(String(requestParameters['spaceId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Remove an ad zone from a CPM campaign.
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRaw(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove an ad zone from a CPM campaign.
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost without sending the request
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequestOpts(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost().'
            );
        }

        if (requestParameters['spaceId'] == null) {
            throw new runtime.RequiredError(
                'spaceId',
                'Required parameter "spaceId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/cpm/{campaignId}/spots/{spaceId}`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"spaceId"}}`, encodeURIComponent(String(requestParameters['spaceId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequestToJSON(requestParameters['apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest']),
        };
    }

    /**
     * Adds the zone as a spot of the campaign, or updates the bid when it is already one. `cpm` 0 / omitted takes the zone\'s minimum CPM; a `cpm` under the minimum is raised to it; a Mini Network peer zone is also raised to the floor its publisher set for you. The zone must be yours or shared with you through an accepted Mini Network pair. Spot activity is recalculated from the campaign\'s ads. Same handler as the panel. 
     * Add an ad zone to a CPM campaign (or re-price it).
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRaw(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Adds the zone as a spot of the campaign, or updates the bid when it is already one. `cpm` 0 / omitted takes the zone\'s minimum CPM; a `cpm` under the minimum is raised to it; a Mini Network peer zone is also raised to the floor its publisher set for you. The zone must be yours or shared with you through an accepted Mini Network pair. Spot activity is recalculated from the campaign\'s ads. Same handler as the panel. 
     * Add an ad zone to a CPM campaign (or re-price it).
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut without sending the request
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequestOpts(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut().'
            );
        }

        if (requestParameters['spaceId'] == null) {
            throw new runtime.RequiredError(
                'spaceId',
                'Required parameter "spaceId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/cpm/{campaignId}/spots/{spaceId}`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"spaceId"}}`, encodeURIComponent(String(requestParameters['spaceId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Without a sub-path this toggles the spot\'s `isinuse`. Use `PUT …/spots/{spaceId}/bidding` to set the bid and `…/state` to set state explicitly. Same handler as the panel. 
     * Switch a CPM campaign\'s zone spot on or off.
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRaw(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Without a sub-path this toggles the spot\'s `isinuse`. Use `PUT …/spots/{spaceId}/bidding` to set the bid and `…/state` to set state explicitly. Same handler as the panel. 
     * Switch a CPM campaign\'s zone spot on or off.
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut without sending the request
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequestOpts(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut().'
            );
        }

        if (requestParameters['spaceId'] == null) {
            throw new runtime.RequiredError(
                'spaceId',
                'Required parameter "spaceId" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut().'
            );
        }

        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut().'
            );
        }

        if (requestParameters['apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest',
                'Required parameter "apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest" was null or undefined when calling apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/cpm/{campaignId}/spots/{spaceId}/{type}`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"spaceId"}}`, encodeURIComponent(String(requestParameters['spaceId'])));
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequestToJSON(requestParameters['apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest']),
        };
    }

    /**
     * `type=bidding`: `cpm` (cents CPM) > 0 sets the bid, raised to the zone\'s minimum and any Mini Network floor; `user_bid` defaults to `cpm`. `bid_type` (1 = smart bidding) and `isinuse` (1 on, 0 off) change only when sent.  `type=state`: `state` (-1, 0 or 1) and/or `isinuse`, each only when sent. The state is recalculated from the campaign\'s ads right after, so it mostly reflects ad availability.  Any other `type` toggles `isinuse` like the plain PUT. Same handler as the panel. 
     * Set a CPM zone spot\'s bid or state.
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRaw(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `type=bidding`: `cpm` (cents CPM) > 0 sets the bid, raised to the zone\'s minimum and any Mini Network floor; `user_bid` defaults to `cpm`. `bid_type` (1 = smart bidding) and `isinuse` (1 on, 0 off) change only when sent.  `type=state`: `state` (-1, 0 or 1) and/or `isinuse`, each only when sent. The state is recalculated from the campaign\'s ads right after, so it mostly reflects ad availability.  Any other `type` toggles `isinuse` like the plain PUT. Same handler as the panel. 
     * Set a CPM zone spot\'s bid or state.
     */
    async apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut(requestParameters: ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsGet without sending the request
     */
    async apiV1CampaignsGetRequestOpts(requestParameters: ApiV1CampaignsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
        }

        if (requestParameters['deleted'] != null) {
            queryParameters['deleted'] = requestParameters['deleted'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the caller\'s campaigns. By default each row carries a rich-but-bounded projection: identity (`id`, `name`, `campaign_type`, `ad_type` + `ad_type_label`, `selling_type`), lifecycle (`is_paused`, `is_active`, `is_deleted`, `is_complete`, `pending_state`), budget in main currency units (`daily_budget`, `total_budget`, `total_spent`, `use_campaign_budget`), impression limits (`use_maxday_impressions` / `maxday_impressions` per day and `use_maxtotal_impressions` / `maxtotal_impressions` for the campaign\'s lifetime), targeting summary (`countries`, `languages`, `categories`, `device_type_ids`, …), capping, schedule (`use_start_date` / `start_date`, `use_end_date` / `end_date`), linked filter/pool ids, the campaign-form fields of `CampaignPanelFields` the row carries, and timestamps. The list does not read the options column, so option fields other than `priority` (`day_parting`, `av_check`, …) are returned by `GET /api/v1/campaigns/{type}/{id}` only. Spend per day and ad bids are not part of the campaign row — use `/api/v1/stats` and the ad endpoints.  Use `?fields=` to opt in or out of fields:    - `?fields=*` — return **every** column on the underlying     campaign row (70+ fields, type-dependent). Convenient for     AI agents that want the full picture in one call.   - `?fields=name,daily_budget,countries` — narrow to just     those fields. `id` is always included.   - (omitted) — default rich projection above. 
     * List the caller\'s campaigns across all types (or one type).
     */
    async apiV1CampaignsGetRaw(requestParameters: ApiV1CampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsGet200Response>> {
        const requestOptions = await this.apiV1CampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the caller\'s campaigns. By default each row carries a rich-but-bounded projection: identity (`id`, `name`, `campaign_type`, `ad_type` + `ad_type_label`, `selling_type`), lifecycle (`is_paused`, `is_active`, `is_deleted`, `is_complete`, `pending_state`), budget in main currency units (`daily_budget`, `total_budget`, `total_spent`, `use_campaign_budget`), impression limits (`use_maxday_impressions` / `maxday_impressions` per day and `use_maxtotal_impressions` / `maxtotal_impressions` for the campaign\'s lifetime), targeting summary (`countries`, `languages`, `categories`, `device_type_ids`, …), capping, schedule (`use_start_date` / `start_date`, `use_end_date` / `end_date`), linked filter/pool ids, the campaign-form fields of `CampaignPanelFields` the row carries, and timestamps. The list does not read the options column, so option fields other than `priority` (`day_parting`, `av_check`, …) are returned by `GET /api/v1/campaigns/{type}/{id}` only. Spend per day and ad bids are not part of the campaign row — use `/api/v1/stats` and the ad endpoints.  Use `?fields=` to opt in or out of fields:    - `?fields=*` — return **every** column on the underlying     campaign row (70+ fields, type-dependent). Convenient for     AI agents that want the full picture in one call.   - `?fields=name,daily_budget,countries` — narrow to just     those fields. `id` is always included.   - (omitted) — default rich projection above. 
     * List the caller\'s campaigns across all types (or one type).
     */
    async apiV1CampaignsGet(requestParameters: ApiV1CampaignsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsGet200Response> {
        const response = await this.apiV1CampaignsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsMassDeletePost without sending the request
     */
    async apiV1CampaignsMassDeletePostRequestOpts(requestParameters: ApiV1CampaignsMassDeletePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CampaignsMassDeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsMassDeletePostRequest',
                'Required parameter "apiV1CampaignsMassDeletePostRequest" was null or undefined when calling apiV1CampaignsMassDeletePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/mass-delete`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsMassDeletePostRequestToJSON(requestParameters['apiV1CampaignsMassDeletePostRequest']),
        };
    }

    /**
     * Marks every listed campaign you own deleted (`isdeleted = 1`; flat deals and direct deals: `iscancelled = 1`). Their live ads are soft-deleted with them (marked as deleted-with-the-campaign), and `POST /api/v1/campaigns/mass-undelete` brings the campaigns and those ads back exactly as they were. A ron flat campaign\'s pending marketplace flat-deal request is cancelled. Unlike the single `DELETE /api/v1/campaigns/{type}/{id}` this does not refuse a flat campaign with a live deal. Same handler as the panel. On a network that reviews campaign deletes, live ron campaigns go to Pending Delete instead and keep running until approved: `affected` counts what was deleted, `pending_review` what was sent for approval. 
     * Soft-delete many campaigns.
     */
    async apiV1CampaignsMassDeletePostRaw(requestParameters: ApiV1CampaignsMassDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsMassDeletePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Marks every listed campaign you own deleted (`isdeleted = 1`; flat deals and direct deals: `iscancelled = 1`). Their live ads are soft-deleted with them (marked as deleted-with-the-campaign), and `POST /api/v1/campaigns/mass-undelete` brings the campaigns and those ads back exactly as they were. A ron flat campaign\'s pending marketplace flat-deal request is cancelled. Unlike the single `DELETE /api/v1/campaigns/{type}/{id}` this does not refuse a flat campaign with a live deal. Same handler as the panel. On a network that reviews campaign deletes, live ron campaigns go to Pending Delete instead and keep running until approved: `affected` counts what was deleted, `pending_review` what was sent for approval. 
     * Soft-delete many campaigns.
     */
    async apiV1CampaignsMassDeletePost(requestParameters: ApiV1CampaignsMassDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsMassDeletePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsMassTogglePut without sending the request
     */
    async apiV1CampaignsMassTogglePutRequestOpts(requestParameters: ApiV1CampaignsMassTogglePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CampaignsMassTogglePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsMassTogglePutRequest',
                'Required parameter "apiV1CampaignsMassTogglePutRequest" was null or undefined when calling apiV1CampaignsMassTogglePut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/mass-toggle`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsMassTogglePutRequestToJSON(requestParameters['apiV1CampaignsMassTogglePutRequest']),
        };
    }

    /**
     * Writes `ispaused` for every listed campaign you own. Same handler as the panel\'s bulk Pause / Resume buttons, and like them it skips the per-campaign checks `PATCH …/{id}/active` makes (flat-deal rules, lifetime-budget cap): a campaign resumed here that is at its budget cap pauses itself again within about a minute. Use `PATCH /api/v1/campaigns/{type}/{id}/active` when you want those checks. 
     * Pause or resume many campaigns at once.
     */
    async apiV1CampaignsMassTogglePutRaw(requestParameters: ApiV1CampaignsMassTogglePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsMassTogglePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Writes `ispaused` for every listed campaign you own. Same handler as the panel\'s bulk Pause / Resume buttons, and like them it skips the per-campaign checks `PATCH …/{id}/active` makes (flat-deal rules, lifetime-budget cap): a campaign resumed here that is at its budget cap pauses itself again within about a minute. Use `PATCH /api/v1/campaigns/{type}/{id}/active` when you want those checks. 
     * Pause or resume many campaigns at once.
     */
    async apiV1CampaignsMassTogglePut(requestParameters: ApiV1CampaignsMassTogglePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsMassTogglePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsMassUndeletePost without sending the request
     */
    async apiV1CampaignsMassUndeletePostRequestOpts(requestParameters: ApiV1CampaignsMassUndeletePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CampaignsMassDeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsMassDeletePostRequest',
                'Required parameter "apiV1CampaignsMassDeletePostRequest" was null or undefined when calling apiV1CampaignsMassUndeletePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/mass-undelete`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsMassDeletePostRequestToJSON(requestParameters['apiV1CampaignsMassDeletePostRequest']),
        };
    }

    /**
     * Undoes a delete: `isdeleted = 0` (flat / direct deals: `iscancelled = 0`) for every listed campaign you own that is currently deleted. This is how a `DELETE /api/v1/campaigns/{type}/{id}` or a `mass-delete` is reversed. Find deleted campaigns with `GET /api/v1/campaigns?deleted=1`.  The ads the delete took down with the campaign come back too; ads you had deleted one by one before stay deleted. A ron / cpm / rtb campaign returns paused or running as it was before the delete; a flat / direct deal deleted with the single `DELETE` comes back paused (resume it with `PATCH …/{id}/active`). Ads deleted together with a campaign before 2026-10-13 cannot be told apart from ones deleted individually and stay deleted — bring RON ads back with `PUT /api/v1/campaigns/ron/{campaignId}/ads/{adId}/restore` (list them with `GET …/ads?ad_state=3`). A purged campaign cannot be restored. Same handler as the panel. 
     * Restore soft-deleted campaigns.
     */
    async apiV1CampaignsMassUndeletePostRaw(requestParameters: ApiV1CampaignsMassUndeletePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsMassUndeletePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Undoes a delete: `isdeleted = 0` (flat / direct deals: `iscancelled = 0`) for every listed campaign you own that is currently deleted. This is how a `DELETE /api/v1/campaigns/{type}/{id}` or a `mass-delete` is reversed. Find deleted campaigns with `GET /api/v1/campaigns?deleted=1`.  The ads the delete took down with the campaign come back too; ads you had deleted one by one before stay deleted. A ron / cpm / rtb campaign returns paused or running as it was before the delete; a flat / direct deal deleted with the single `DELETE` comes back paused (resume it with `PATCH …/{id}/active`). Ads deleted together with a campaign before 2026-10-13 cannot be told apart from ones deleted individually and stay deleted — bring RON ads back with `PUT /api/v1/campaigns/ron/{campaignId}/ads/{adId}/restore` (list them with `GET …/ads?ad_state=3`). A purged campaign cannot be restored. Same handler as the panel. 
     * Restore soft-deleted campaigns.
     */
    async apiV1CampaignsMassUndeletePost(requestParameters: ApiV1CampaignsMassUndeletePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsMassUndeletePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsPurgePost without sending the request
     */
    async apiV1CampaignsPurgePostRequestOpts(requestParameters: ApiV1CampaignsPurgePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CampaignsMassDeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsMassDeletePostRequest',
                'Required parameter "apiV1CampaignsMassDeletePostRequest" was null or undefined when calling apiV1CampaignsPurgePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/purge`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsMassDeletePostRequestToJSON(requestParameters['apiV1CampaignsMassDeletePostRequest']),
        };
    }

    /**
     * Hard-deletes listed campaigns that are already soft-deleted, with their ads. Irreversible — the rows are snapshotted into the action log first, but nothing can restore them. Ids that are not deleted (or not yours) are skipped. Same handler as the panel\'s Purge. 
     * Permanently delete soft-deleted campaigns and their ads.
     */
    async apiV1CampaignsPurgePostRaw(requestParameters: ApiV1CampaignsPurgePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsPurgePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Hard-deletes listed campaigns that are already soft-deleted, with their ads. Irreversible — the rows are snapshotted into the action log first, but nothing can restore them. Ids that are not deleted (or not yours) are skipped. Same handler as the panel\'s Purge. 
     * Permanently delete soft-deleted campaigns and their ads.
     */
    async apiV1CampaignsPurgePost(requestParameters: ApiV1CampaignsPurgePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsPurgePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet without sending the request
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequestOpts(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * RON ads carry a per-adzone bid map (`bids_per_zone` JSON), letting an advertiser bid different amounts on different publisher zones. This endpoint returns each override enriched with the zone + site names, so an auto-optimiser can correlate ids ↔ human labels in one call.  Empty list if the ad has no overrides — the global ad bid applies to every zone. 
     * List per-zone bid overrides for a RON ad.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRaw(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response>> {
        const requestOptions = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * RON ads carry a per-adzone bid map (`bids_per_zone` JSON), letting an advertiser bid different amounts on different publisher zones. This endpoint returns each override enriched with the zone + site names, so an auto-optimiser can correlate ids ↔ human labels in one call.  Empty list if the ad has no overrides — the global ad bid applies to every zone. 
     * List per-zone bid overrides for a RON ad.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response> {
        const response = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut without sending the request
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestOpts(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut().'
            );
        }

        if (requestParameters['apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest',
                'Required parameter "apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestToJSON(requestParameters['apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest']),
        };
    }

    /**
     * Full-replace semantics — any zone NOT in the request body has its override cleared. If you only want to update a few zones, pass the complete current set merged with your changes. Auto-optimisers usually recompute the full bid sheet per cycle so this fits the common loop.  Negative or zero `zone_id` and negative `bid` entries are silently dropped. 
     * Replace the per-zone bid overrides on a RON ad.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRaw(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response>> {
        const requestOptions = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200ResponseFromJSON(jsonValue));
    }

    /**
     * Full-replace semantics — any zone NOT in the request body has its override cleared. If you only want to update a few zones, pass the complete current set merged with your changes. Auto-optimisers usually recompute the full bid sheet per cycle so this fits the common loop.  Negative or zero `zone_id` and negative `bid` entries are silently dropped. 
     * Replace the per-zone bid overrides on a RON ad.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response> {
        const response = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete without sending the request
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequestOpts(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete().'
            );
        }

        if (requestParameters['zoneId'] == null) {
            throw new runtime.RequiredError(
                'zoneId',
                'Required parameter "zoneId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/{zoneId}`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));
        urlPath = urlPath.replace(`{${"zoneId"}}`, encodeURIComponent(String(requestParameters['zoneId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Removes the override for one zone. The global ad bid takes over again for that zone. Returns 404 if no override exists for the given zone. 
     * Clear a single per-zone bid override.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRaw(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response>> {
        const requestOptions = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Removes the override for one zone. The global ad bid takes over again for that zone. Returns 404 if no override exists for the given zone. 
     * Clear a single per-zone bid override.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response> {
        const response = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut without sending the request
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequestOpts(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut().'
            );
        }

        if (requestParameters['apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest',
                'Required parameter "apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest" was null or undefined when calling apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/zones-only`;
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequestToJSON(requestParameters['apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest']),
        };
    }

    /**
     * When on, the ad serves **only** on the zones listed in its per-zone bid map (`GET/PUT …/zone-bids`) — the panel\'s \"only these zones\" switch on the Bids per zone tab. When off (default) the zone bids are overrides and every other zone uses the ad bid. Same write as the panel. 
     * Switch \"only these zones\" mode for a RON ad\'s per-zone bids.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRaw(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * When on, the ad serves **only** on the zones listed in its per-zone bid map (`GET/PUT …/zone-bids`) — the panel\'s \"only these zones\" switch on the Bids per zone tab. When off (default) the zone bids are overrides and every other zone uses the ad bid. Same write as the panel. 
     * Switch \"only these zones\" mode for a RON ad\'s per-zone bids.
     */
    async apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut(requestParameters: ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsRonIdSiteListGet without sending the request
     */
    async apiV1CampaignsRonIdSiteListGetRequestOpts(requestParameters: ApiV1CampaignsRonIdSiteListGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsRonIdSiteListGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['mainCatid'] != null) {
            queryParameters['main_catid'] = requestParameters['mainCatid'];
        }

        if (requestParameters['catids'] != null) {
            queryParameters['catids'] = requestParameters['catids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{id}/site-list`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The tenant\'s site list filtered to the campaign\'s categories, each with this campaign\'s status (1 active, 0 blocked). Shown only when the tenant switched the Sites box on for your account or for all users; otherwise `visible: false` and an empty `data`. `editable` is false when an admin made this campaign\'s list read only. Optional `main_catid` + `catids` filter on categories other than the saved ones. Display only — the ad server does not read it. Same handler as the panel. 
     * The Premium-sites box of a RON campaign.
     */
    async apiV1CampaignsRonIdSiteListGetRaw(requestParameters: ApiV1CampaignsRonIdSiteListGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsRonIdSiteListGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The tenant\'s site list filtered to the campaign\'s categories, each with this campaign\'s status (1 active, 0 blocked). Shown only when the tenant switched the Sites box on for your account or for all users; otherwise `visible: false` and an empty `data`. `editable` is false when an admin made this campaign\'s list read only. Optional `main_catid` + `catids` filter on categories other than the saved ones. Display only — the ad server does not read it. Same handler as the panel. 
     * The Premium-sites box of a RON campaign.
     */
    async apiV1CampaignsRonIdSiteListGet(requestParameters: ApiV1CampaignsRonIdSiteListGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsRonIdSiteListGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsRonIdSiteListSiteIdPut without sending the request
     */
    async apiV1CampaignsRonIdSiteListSiteIdPutRequestOpts(requestParameters: ApiV1CampaignsRonIdSiteListSiteIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsRonIdSiteListSiteIdPut().'
            );
        }

        if (requestParameters['siteId'] == null) {
            throw new runtime.RequiredError(
                'siteId',
                'Required parameter "siteId" was null or undefined when calling apiV1CampaignsRonIdSiteListSiteIdPut().'
            );
        }

        if (requestParameters['apiV1CampaignsRonIdSiteListSiteIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsRonIdSiteListSiteIdPutRequest',
                'Required parameter "apiV1CampaignsRonIdSiteListSiteIdPutRequest" was null or undefined when calling apiV1CampaignsRonIdSiteListSiteIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{id}/site-list/{siteId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"siteId"}}`, encodeURIComponent(String(requestParameters['siteId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsRonIdSiteListSiteIdPutRequestToJSON(requestParameters['apiV1CampaignsRonIdSiteListSiteIdPutRequest']),
        };
    }

    /**
     * `status` 1 = active, 0 = blocked. Refused (403) when the Sites box is not on for you or the campaign\'s list is read only. Setting a site active needs the tenant\'s minimum balance for Premium sites (422 with code `premium_sites_min_balance` and `amount`); blocking is always allowed. Same handler as the panel. 
     * Set one site of the Premium-sites box active or blocked.
     */
    async apiV1CampaignsRonIdSiteListSiteIdPutRaw(requestParameters: ApiV1CampaignsRonIdSiteListSiteIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsRonIdSiteListSiteIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `status` 1 = active, 0 = blocked. Refused (403) when the Sites box is not on for you or the campaign\'s list is read only. Setting a site active needs the tenant\'s minimum balance for Premium sites (422 with code `premium_sites_min_balance` and `amount`); blocking is always allowed. Same handler as the panel. 
     * Set one site of the Premium-sites box active or blocked.
     */
    async apiV1CampaignsRonIdSiteListSiteIdPut(requestParameters: ApiV1CampaignsRonIdSiteListSiteIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsRonIdSiteListSiteIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsRonIdZonesGet without sending the request
     */
    async apiV1CampaignsRonIdZonesGetRequestOpts(requestParameters: ApiV1CampaignsRonIdZonesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsRonIdZonesGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/ron/{id}/zones`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s whitelist zones, the same list the panel shows on the campaign\'s Ad Zones step: zone id, zone name, site and the campaign\'s weight on that zone. The raw id list is also available as `wl_zoneids` on `GET /api/v1/campaigns/ron/{id}?fields=*`. 
     * List the zones a RON campaign is linked to.
     */
    async apiV1CampaignsRonIdZonesGetRaw(requestParameters: ApiV1CampaignsRonIdZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsRonIdZonesGet200Response>> {
        const requestOptions = await this.apiV1CampaignsRonIdZonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsRonIdZonesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The campaign\'s whitelist zones, the same list the panel shows on the campaign\'s Ad Zones step: zone id, zone name, site and the campaign\'s weight on that zone. The raw id list is also available as `wl_zoneids` on `GET /api/v1/campaigns/ron/{id}?fields=*`. 
     * List the zones a RON campaign is linked to.
     */
    async apiV1CampaignsRonIdZonesGet(requestParameters: ApiV1CampaignsRonIdZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsRonIdZonesGet200Response> {
        const response = await this.apiV1CampaignsRonIdZonesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsRtbIdTestRtbGet without sending the request
     */
    async apiV1CampaignsRtbIdTestRtbGetRequestOpts(requestParameters: ApiV1CampaignsRtbIdTestRtbGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsRtbIdTestRtbGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/rtb/{id}/test-rtb`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s `request_url`, `rtbtype` and ad type, the network\'s common banner sizes, and the caller\'s IP / user agent (the defaults the test sends). Same handler as the panel.
     * Context for testing an RTB campaign\'s endpoint.
     */
    async apiV1CampaignsRtbIdTestRtbGetRaw(requestParameters: ApiV1CampaignsRtbIdTestRtbGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsRtbIdTestRtbGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The campaign\'s `request_url`, `rtbtype` and ad type, the network\'s common banner sizes, and the caller\'s IP / user agent (the defaults the test sends). Same handler as the panel.
     * Context for testing an RTB campaign\'s endpoint.
     */
    async apiV1CampaignsRtbIdTestRtbGet(requestParameters: ApiV1CampaignsRtbIdTestRtbGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsRtbIdTestRtbGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsRtbIdTestRtbPost without sending the request
     */
    async apiV1CampaignsRtbIdTestRtbPostRequestOpts(requestParameters: ApiV1CampaignsRtbIdTestRtbPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsRtbIdTestRtbPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/rtb/{id}/test-rtb`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RtbTestRequestToJSON(requestParameters['rtbTestRequest']),
        };
    }

    /**
     * Sends one bid-style request to the campaign\'s `request_url` (or `override_url`) the way the ad server would — OpenRTB 2.6 POST for `openrtb`, GET with macros for `json` / `json_bidder` / `xml` — and returns what was sent, what came back and a `verdict`: `ok` (a bid), `no_bid`, `http_error`, `network_error`. Only public hosts are reached (private / loopback / metadata addresses are refused with `error_category: blocked_url`). `bidfloor` and `best_price` are in the request\'s currency units (`currency`, default USD). Nothing is stored. Same handler as the panel. 
     * Fire a test bid request at an RTB campaign\'s endpoint.
     */
    async apiV1CampaignsRtbIdTestRtbPostRaw(requestParameters: ApiV1CampaignsRtbIdTestRtbPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RtbTestResult>> {
        const requestOptions = await this.apiV1CampaignsRtbIdTestRtbPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RtbTestResultFromJSON(jsonValue));
    }

    /**
     * Sends one bid-style request to the campaign\'s `request_url` (or `override_url`) the way the ad server would — OpenRTB 2.6 POST for `openrtb`, GET with macros for `json` / `json_bidder` / `xml` — and returns what was sent, what came back and a `verdict`: `ok` (a bid), `no_bid`, `http_error`, `network_error`. Only public hosts are reached (private / loopback / metadata addresses are refused with `error_category: blocked_url`). `bidfloor` and `best_price` are in the request\'s currency units (`currency`, default USD). Nothing is stored. Same handler as the panel. 
     * Fire a test bid request at an RTB campaign\'s endpoint.
     */
    async apiV1CampaignsRtbIdTestRtbPost(requestParameters: ApiV1CampaignsRtbIdTestRtbPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RtbTestResult> {
        const response = await this.apiV1CampaignsRtbIdTestRtbPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsSaveCategoriesPut without sending the request
     */
    async apiV1CampaignsSaveCategoriesPutRequestOpts(requestParameters: ApiV1CampaignsSaveCategoriesPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CampaignsSaveCategoriesPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsSaveCategoriesPutRequest',
                'Required parameter "apiV1CampaignsSaveCategoriesPutRequest" was null or undefined when calling apiV1CampaignsSaveCategoriesPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/save-categories`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsSaveCategoriesPutRequestToJSON(requestParameters['apiV1CampaignsSaveCategoriesPutRequest']),
        };
    }

    /**
     * Adds the category ids in `categories` (GET /api/v1/lookups/categories) to every listed campaign; `overwrite: true` replaces the campaigns\' categories instead. Unknown category ids are dropped; none left → 400 `no_categories`. Same handler as the panel\'s bulk Categories. 
     * Assign categories to many campaigns.
     */
    async apiV1CampaignsSaveCategoriesPutRaw(requestParameters: ApiV1CampaignsSaveCategoriesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsSaveCategoriesPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Adds the category ids in `categories` (GET /api/v1/lookups/categories) to every listed campaign; `overwrite: true` replaces the campaigns\' categories instead. Unknown category ids are dropped; none left → 400 `no_categories`. Same handler as the panel\'s bulk Categories. 
     * Assign categories to many campaigns.
     */
    async apiV1CampaignsSaveCategoriesPut(requestParameters: ApiV1CampaignsSaveCategoriesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsSaveCategoriesPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsSaveTagsPut without sending the request
     */
    async apiV1CampaignsSaveTagsPutRequestOpts(requestParameters: ApiV1CampaignsSaveTagsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1CampaignsSaveTagsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsSaveTagsPutRequest',
                'Required parameter "apiV1CampaignsSaveTagsPutRequest" was null or undefined when calling apiV1CampaignsSaveTagsPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/save-tags`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsSaveTagsPutRequestToJSON(requestParameters['apiV1CampaignsSaveTagsPutRequest']),
        };
    }

    /**
     * Adds the tag ids in `tags` to every listed campaign (`groupid`); with `clear: true` the campaigns\' tags are replaced by `tags` (an empty `tags` + `clear: true` removes all). Tag ids come from the campaign tags list. Same handler as the panel\'s bulk Tags. 
     * Assign tags (campaign groups) to many campaigns.
     */
    async apiV1CampaignsSaveTagsPutRaw(requestParameters: ApiV1CampaignsSaveTagsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsSaveTagsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Adds the tag ids in `tags` to every listed campaign (`groupid`); with `clear: true` the campaigns\' tags are replaced by `tags` (an empty `tags` + `clear: true` removes all). Tag ids come from the campaign tags list. Same handler as the panel\'s bulk Tags. 
     * Assign tags (campaign groups) to many campaigns.
     */
    async apiV1CampaignsSaveTagsPut(requestParameters: ApiV1CampaignsSaveTagsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsSaveTagsPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdActivePatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdActivePatchRequest',
                'Required parameter "apiV1CampaignsTypeIdActivePatchRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/active`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdActivePatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdActivePatchRequest']),
        };
    }

    /**
     * Idempotent set. `active=true` activates the ad, `active=false` pauses it. Useful for granular pause/resume from an optimiser without touching the campaign-level pause state.  Same effect as the panel\'s ad toggle: the pause/activate notification is sent, CPM zone states are recomputed, and on networks that validate changes to whitelist-zone RON campaigns the change is queued for approval — `pending_validation: true` in the response. 
     * Pause or unpause a single ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Idempotent set. `active=true` activates the ad, `active=false` pauses it. Useful for granular pause/resume from an optimiser without touching the campaign-level pause state.  Same effect as the panel\'s ad toggle: the pause/activate notification is sent, CPM zone states are recomputed, and on networks that validate changes to whitelist-zone RON campaigns the change is queued for approval — `pending_validation: true` in the response. 
     * Pause or unpause a single ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response> {
        const response = await this.apiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bid`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest']),
        };
    }

    /**
     * Updates one ad\'s bid.  Bids are in **currency units of your account\'s currency** (`0.05` = 0.05), the same as the panel, and must be at least `GET /api/v1/campaigns/{type}/{id}/min-bid` (422 otherwise; `0` is allowed and stops the ad bidding). Reads return the bid as `bid_amount` in the same unit; `user_bid` / `bid` are the stored values in cents (your currency / the network\'s main currency). Keys that wrote bids before 2026-10-12 keep the old raw-cents contract; every bid write echoes `bid_unit` (`currency` or `raw_cents`). 
     * Set a single ad\'s bid.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Updates one ad\'s bid.  Bids are in **currency units of your account\'s currency** (`0.05` = 0.05), the same as the panel, and must be at least `GET /api/v1/campaigns/{type}/{id}/min-bid` (422 otherwise; `0` is allowed and stops the ad bidding). Reads return the bid as `bid_amount` in the same unit; `user_bid` / `bid` are the stored values in cents (your currency / the network\'s main currency). Keys that wrote bids before 2026-10-12 keep the old raw-cents contract; every bid write echoes `bid_unit` (`currency` or `raw_cents`). 
     * Set a single ad\'s bid.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response> {
        const response = await this.apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bids-per-geo`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest']),
        };
    }

    /**
     * Replaces the ad\'s whole per-country bid map (`ronads.bids_per_geo`) — send every country you want to keep; `[]` clears it. A bid of 0 removes that country. On CPC / CPM campaigns the ad server uses the visitor country\'s bid in place of the ad bid (and skips smart bidding for that impression).  **Unit** — the same contract as the ad `bid` writes, echoed as `bid_unit`:  - `currency` (every key minted normally): the bid is in the   advertiser\'s own currency, e.g. `0.08`. Stored as sent — this   column is kept in currency units (the ad server multiplies by 100   and converts to the network currency when it loads the ad), the   same as the panel\'s Bids per country tab. - `raw_cents` (keys on the grandfathered raw-bid contract): send   cents, as for that key\'s ad bids (`8` = 0.08); divided by 100   before storage.  Per-country bids are not held to the ad format\'s minimum bid (the panel does not check it either). Codes are two-letter country codes (case-insensitive, stored lowercase). Unknown fields → 422. RON campaigns only (`type` must be `ron`, else 400 `invalid_type`). 
     * Set per-country bids for a RON ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Replaces the ad\'s whole per-country bid map (`ronads.bids_per_geo`) — send every country you want to keep; `[]` clears it. A bid of 0 removes that country. On CPC / CPM campaigns the ad server uses the visitor country\'s bid in place of the ad bid (and skips smart bidding for that impression).  **Unit** — the same contract as the ad `bid` writes, echoed as `bid_unit`:  - `currency` (every key minted normally): the bid is in the   advertiser\'s own currency, e.g. `0.08`. Stored as sent — this   column is kept in currency units (the ad server multiplies by 100   and converts to the network currency when it loads the ad), the   same as the panel\'s Bids per country tab. - `raw_cents` (keys on the grandfathered raw-bid contract): send   cents, as for that key\'s ad bids (`8` = 0.08); divided by 100   before storage.  Per-country bids are not held to the ad format\'s minimum bid (the panel does not check it either). Codes are two-letter country codes (case-insensitive, stored lowercase). Unknown fields → 422. RON campaigns only (`type` must be `ron`, else 400 `invalid_type`). 
     * Set per-country bids for a RON ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdClonePost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdClonePost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdClonePost().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdClonePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/clone`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Duplicates one ad. The clone is attached to the same campaign as the source. Useful for A/B-testing creative variants without rebuilding the whole record from scratch. 
     * Clone a single ad within a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdClonePostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Duplicates one ad. The clone is attached to the same campaign as the source. Useful for A/B-testing creative variants without rebuilding the whole record from scratch. 
     * Clone a single ad within a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdClonePost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response> {
        const response = await this.apiV1CampaignsTypeCampaignIdAdsAdIdClonePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/countries`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest']),
        };
    }

    /**
     * Narrows one ad to a subset of countries (`ronads.countries`). An empty list means the ad runs wherever the campaign runs (the default). Codes are lowercased, de-duplicated and checked against the country table; unknown codes are dropped. The stored list is capped at 255 characters (~85 countries) → 422. Applies to every paytype. Same handler as the panel. RON campaigns only. 
     * Set per-ad country targeting for a RON ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Narrows one ad to a subset of countries (`ronads.countries`). An empty list means the ad runs wherever the campaign runs (the default). Codes are lowercased, de-duplicated and checked against the country table; unknown codes are dropped. The stored list is capped at 255 characters (~85 countries) → 422. Applies to every paytype. Same handler as the panel. RON campaigns only. 
     * Set per-ad country targeting for a RON ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdDelete without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdDelete().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdDelete().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft-delete an ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdDeleteRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft-delete an ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdDelete(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdGet without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdGetRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdGet().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdGet().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Show one ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdGetRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Show one ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdGet(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/overlay-stats`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Per overlay of the ad\'s video_overlays (index = position in the list): how often it came on screen and how often it was clicked, with the click-through rate in percent. `from` / `to` (YYYY-MM-DD, UTC days, default the last 30 days, at most a year). Overlays removed from the ad since keep their numbers as type `removed`. The clicks are also the ad\'s own clicks in the normal stats. 
     * Shoppable video — shown and clicks per overlay.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Per overlay of the ad\'s video_overlays (index = position in the list): how often it came on screen and how often it was clicked, with the click-through rate in percent. `from` / `to` (YYYY-MM-DD, UTC days, default the last 30 days, at most a year). Overlays removed from the ad since keep their numbers as type `removed`. The clicks are also the ad\'s own clicks in the normal stats. 
     * Shoppable video — shown and clicks per overlay.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdPut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest']),
        };
    }

    /**
     * Partial update — the same handler the panel\'s ad form saves through, with the same validation (per-format minimum bid, destination-URL rules, SmartAds `{spaceid}`, html video zones, native SmartAd html-only, creator pool orientation). Send only the fields to change. Accepts JSON or `multipart/form-data` (multipart adds the file inputs `banner_file`, `icon_file`, `image_file`, `video_file`, which replace that creative slot).  Field names are the ad\'s column names. The create-style names `destination_url`, `display_url`, `preview_url`, `is_active`, `url_pool_id` are accepted as aliases (the column name wins if both are sent), so a create payload can be reused here.  Which columns exist depends on the campaign type: ron / cpm ads take every field below; flatrate / directdeal ads have no bid / sort / keyword / imptracking / icon / SmartAds columns, and those keys are dropped there. Unknown keys are ignored (not an error). `bansizeid` is locked after create and ignored.  Changing the destination URL (or rebuilding the creative) sends the ad back to review unless your account is auto-validated.  **Creative inputs** (rebuild the `creatives` blob, panel vocabulary): `banner_type` (`creative` / `pool` / `hotlink_image` / `hotlink_video` / `iframe` / `html`) with `creative_id` / `banner_pool_id` / `banner_url` / `banner_iframe_url` / `banner_html`; `image_type` (`creative` / `pool` / `html` / `none`) with `creative_id` / `image_pool_id` / `image_url` / `html_code` + `html_total_items` (`none` = native text-only ad); `video_type` (`url` / `xml` / `html` / `creative` / `pool`) with `video_url` / `html_code` / `creative_id` / `video_pool_id`; `icon_type: creative` + `icon_id` (push icon). Or send `creatives` itself (object, as GET returns it, or a JSON string) to write the blob verbatim. 
     * Update an ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Partial update — the same handler the panel\'s ad form saves through, with the same validation (per-format minimum bid, destination-URL rules, SmartAds `{spaceid}`, html video zones, native SmartAd html-only, creator pool orientation). Send only the fields to change. Accepts JSON or `multipart/form-data` (multipart adds the file inputs `banner_file`, `icon_file`, `image_file`, `video_file`, which replace that creative slot).  Field names are the ad\'s column names. The create-style names `destination_url`, `display_url`, `preview_url`, `is_active`, `url_pool_id` are accepted as aliases (the column name wins if both are sent), so a create payload can be reused here.  Which columns exist depends on the campaign type: ron / cpm ads take every field below; flatrate / directdeal ads have no bid / sort / keyword / imptracking / icon / SmartAds columns, and those keys are dropped there. Unknown keys are ignored (not an error). `bansizeid` is locked after create and ignored.  Changing the destination URL (or rebuilding the creative) sends the ad back to review unless your account is auto-validated.  **Creative inputs** (rebuild the `creatives` blob, panel vocabulary): `banner_type` (`creative` / `pool` / `hotlink_image` / `hotlink_video` / `iframe` / `html`) with `creative_id` / `banner_pool_id` / `banner_url` / `banner_iframe_url` / `banner_html`; `image_type` (`creative` / `pool` / `html` / `none`) with `creative_id` / `image_pool_id` / `image_url` / `html_code` + `html_total_items` (`none` = native text-only ad); `video_type` (`url` / `xml` / `html` / `creative` / `pool`) with `video_url` / `html_code` / `creative_id` / `video_pool_id`; `icon_type: creative` + `icon_id` (push icon). Or send `creatives` itself (object, as GET returns it, or a JSON string) to write the blob verbatim. 
     * Update an ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut().'
            );
        }

        if (requestParameters['adId'] == null) {
            throw new runtime.RequiredError(
                'adId',
                'Required parameter "adId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/{adId}/restore`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));
        urlPath = urlPath.replace(`{${"adId"}}`, encodeURIComponent(String(requestParameters['adId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Undoes a soft delete (`is_deleted = 0`, `pending_state = 0`). The ad comes back in the state it was deleted in. List deleted ads with `GET …/ads?ad_state=3`. Same handler as the panel. RON campaigns only. 
     * Restore a deleted RON ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Undoes a soft delete (`is_deleted = 0`, `pending_state = 0`). The ad comes back in the state it was deleted in. List deleted ads with `GET …/ads?ad_state=3`. Same handler as the panel. RON campaigns only. 
     * Restore a deleted RON ad.
     */
    async apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/copy-targets`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Your live campaigns (other than this one) whose ads share this campaign\'s ad format: RON and CPM, flat deals and direct deals, RTB alone. Use an `id` as `target_campaign_id` on `…/ads/mass-clone`. Narrowed to a key\'s campaign pin. Same handler as the panel\'s Copy to campaign… picker. 
     * Campaigns this campaign\'s ads can be copied into.
     */
    async apiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Your live campaigns (other than this one) whose ads share this campaign\'s ad format: RON and CPM, flat deals and direct deals, RTB alone. Use an `id` as `target_campaign_id` on `…/ads/mass-clone`. Narrowed to a key\'s campaign pin. Same handler as the panel\'s Copy to campaign… picker. 
     * Campaigns this campaign\'s ads can be copied into.
     */
    async apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet(requestParameters: ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsCsvImportPost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsCsvImportPostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsCsvImportPost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsCsvImportPost().'
            );
        }

        if (requestParameters['file'] == null) {
            throw new runtime.RequiredError(
                'file',
                'Required parameter "file" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsCsvImportPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['file'] != null) {
            formParams.append('file', requestParameters['file'] as any);
        }

        if (requestParameters['imageColumn'] != null) {
            formParams.append('image_column', requestParameters['imageColumn'] as any);
        }

        if (requestParameters['urlColumn'] != null) {
            formParams.append('url_column', requestParameters['urlColumn'] as any);
        }

        if (requestParameters['nameColumn'] != null) {
            formParams.append('name_column', requestParameters['nameColumn'] as any);
        }

        if (requestParameters['groupColumn'] != null) {
            formParams.append('group_column', requestParameters['groupColumn'] as any);
        }

        if (requestParameters['groups'] != null) {
            formParams.append('groups', requestParameters['groups'] as any);
        }

        if (requestParameters['folderId'] != null) {
            formParams.append('folder_id', requestParameters['folderId'] as any);
        }

        if (requestParameters['folderName'] != null) {
            formParams.append('folder_name', requestParameters['folderName'] as any);
        }

        if (requestParameters['folderPerGroup'] != null) {
            formParams.append('folder_per_group', requestParameters['folderPerGroup'] as any);
        }

        if (requestParameters['namePrefix'] != null) {
            formParams.append('name_prefix', requestParameters['namePrefix'] as any);
        }

        if (requestParameters['squareMode'] != null) {
            formParams.append('square_mode', requestParameters['squareMode'] as any);
        }

        if (requestParameters['padColor'] != null) {
            formParams.append('pad_color', requestParameters['padColor'] as any);
        }

        if (requestParameters['cropSquare'] != null) {
            formParams.append('crop_square', requestParameters['cropSquare'] as any);
        }

        if (requestParameters['setActive'] != null) {
            formParams.append('set_active', requestParameters['setActive'] as any);
        }

        if (requestParameters['bid'] != null) {
            formParams.append('bid', requestParameters['bid'] as any);
        }


        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/csv-import`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * `multipart/form-data`. Field `file` is a CSV (comma, semicolon or tab separated) with a header row. Each row names an image URL, a destination URL and optionally an ad name; the server fetches the image (public http/https only, max 20 MB), centre-crops it to 1:1 — by default PADDING the whole image onto a square canvas rather than cropping it, since a centre crop on a wide video still routinely removes the subject (`square_mode`) — and creates one native ad. Columns are chosen by header name via `image_column` / `url_column` / `name_column`, or guessed from common names (`image_url`, `thumbnail_url`, `destination_url`, `url`, `name`, ...). At most 100 rows per request; rows not started within 180s are reported as not attempted. Native campaigns only.  With `group_column` set the import switches to GROUPED mode: rows sharing that column\'s value become ONE ad whose creatives live in a creative pool of their own, each pool item carrying its row\'s destination URL tail in `url_prefix` so the image and its page stay paired. The ad\'s destination URL is the group\'s common base, cut back to the last `/`; rows of a group whose URL shares no base with the rest get their own pool + ad, named `<group> (2)`. Answer `groups` must be echoed back in the next request\'s `groups` field when a group spans several requests, or it gets a second ad instead of reusing the first. 
     * Import native ads from a CSV — one ad per row, or one ad per group.
     */
    async apiV1CampaignsTypeCampaignIdAdsCsvImportPostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsCsvImportPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `multipart/form-data`. Field `file` is a CSV (comma, semicolon or tab separated) with a header row. Each row names an image URL, a destination URL and optionally an ad name; the server fetches the image (public http/https only, max 20 MB), centre-crops it to 1:1 — by default PADDING the whole image onto a square canvas rather than cropping it, since a centre crop on a wide video still routinely removes the subject (`square_mode`) — and creates one native ad. Columns are chosen by header name via `image_column` / `url_column` / `name_column`, or guessed from common names (`image_url`, `thumbnail_url`, `destination_url`, `url`, `name`, ...). At most 100 rows per request; rows not started within 180s are reported as not attempted. Native campaigns only.  With `group_column` set the import switches to GROUPED mode: rows sharing that column\'s value become ONE ad whose creatives live in a creative pool of their own, each pool item carrying its row\'s destination URL tail in `url_prefix` so the image and its page stay paired. The ad\'s destination URL is the group\'s common base, cut back to the last `/`; rows of a group whose URL shares no base with the rest get their own pool + ad, named `<group> (2)`. Answer `groups` must be echoed back in the next request\'s `groups` field when a group spans several requests, or it gets a second ad instead of reusing the first. 
     * Import native ads from a CSV — one ad per row, or one ad per group.
     */
    async apiV1CampaignsTypeCampaignIdAdsCsvImportPost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsCsvImportPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response> {
        const response = await this.apiV1CampaignsTypeCampaignIdAdsCsvImportPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsFromPoolPost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsFromPoolPost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsFromPoolPost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsFromPoolPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/from-pool`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest']),
        };
    }

    /**
     * A banner pool yields one ad per banner size it holds; a native / creator / video pool yields one ad referencing the whole pool. The pool must be yours and of a flavour the campaign\'s ad type renders (422 otherwise), and for creator campaigns it must hold creatives of the campaign\'s orientation.  `bid` uses the same unit contract as the other ad bid writes: **currency units** (the advertiser\'s currency, e.g. `0.05`), checked against the ad format\'s minimum bid and converted to the stored cents; keys on the grandfathered raw-bid contract write raw cents. Omit it (or 0) to leave the bid empty. `destinationurl` passes the single-ad checks (format, blocked domains). New ads start unvalidated unless the account is auto-validated. 
     * Create ads from a creative pool.
     */
    async apiV1CampaignsTypeCampaignIdAdsFromPoolPostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A banner pool yields one ad per banner size it holds; a native / creator / video pool yields one ad referencing the whole pool. The pool must be yours and of a flavour the campaign\'s ad type renders (422 otherwise), and for creator campaigns it must hold creatives of the campaign\'s orientation.  `bid` uses the same unit contract as the other ad bid writes: **currency units** (the advertiser\'s currency, e.g. `0.05`), checked against the ad format\'s minimum bid and converted to the stored cents; keys on the grandfathered raw-bid contract write raw cents. Omit it (or 0) to leave the bid empty. `destinationurl` passes the single-ad checks (format, blocked domains). New ads start unvalidated unless the account is auto-validated. 
     * Create ads from a creative pool.
     */
    async apiV1CampaignsTypeCampaignIdAdsFromPoolPost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsFromPoolPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsGet without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsGetRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsGet().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['adState'] != null) {
            queryParameters['ad_state'] = requestParameters['adState'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sort_by'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sort_dir'] = requestParameters['sortDir'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns every ad attached to the campaign (paginated). Each row carries `id`, `bid`, `isactive`, `bansizeid`, the underlying `creatives` JSON (banner/video/native, with file paths and creative_id refs), and lifetime stats from the campaign-side rollup. 
     * List ads on a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsGetRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeCampaignIdAdsGet200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeCampaignIdAdsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every ad attached to the campaign (paginated). Each row carries `id`, `bid`, `isactive`, `bansizeid`, the underlying `creatives` JSON (banner/video/native, with file paths and creative_id refs), and lifetime stats from the campaign-side rollup. 
     * List ads on a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsGet(requestParameters: ApiV1CampaignsTypeCampaignIdAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeCampaignIdAdsGet200Response> {
        const response = await this.apiV1CampaignsTypeCampaignIdAdsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsMassClonePost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsMassClonePostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassClonePost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassClonePost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassClonePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/mass-clone`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest']),
        };
    }

    /**
     * Bulk form of `POST …/ads/{adId}/clone`: each copy keeps every column of its source (including the active state) and starts unvalidated. At most 50 ids per call. An id that fails to copy (not in this campaign, deleted meanwhile) is listed in `failed`; the call fails only when nothing was copied. Same handler as the panel.  `target_campaign_id` copies into another of your campaigns instead (the panel\'s Mass Actions → Copy to campaign…). The target must be live and take the same ads: RON ↔ CPM, flat deal ↔ direct deal, RTB → RTB — list them with `GET …/ads/copy-targets`. Copies into another campaign keep their title; all copies start unvalidated. A key pinned to campaigns needs the target on its pin too. 
     * Copy many ads of a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsMassClonePostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsMassClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Bulk form of `POST …/ads/{adId}/clone`: each copy keeps every column of its source (including the active state) and starts unvalidated. At most 50 ids per call. An id that fails to copy (not in this campaign, deleted meanwhile) is listed in `failed`; the call fails only when nothing was copied. Same handler as the panel.  `target_campaign_id` copies into another of your campaigns instead (the panel\'s Mass Actions → Copy to campaign…). The target must be live and take the same ads: RON ↔ CPM, flat deal ↔ direct deal, RTB → RTB — list them with `GET …/ads/copy-targets`. Copies into another campaign keep their title; all copies start unvalidated. A key pinned to campaigns needs the target on its pin too. 
     * Copy many ads of a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsMassClonePost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsMassClonePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsMassDeletePost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassDeletePost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassDeletePost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassDeletePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/mass-delete`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest']),
        };
    }

    /**
     * Soft delete (`is_deleted = 1`); restore one with `PUT …/ads/{adId}/restore`. Ids outside the campaign are ignored. On tenants that validate connect-campaign changes the deletion is queued for publisher approval; a CPM campaign\'s zone states are recomputed. Same handler as the panel. 
     * Soft-delete many ads of a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsMassDeletePostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft delete (`is_deleted = 1`); restore one with `PUT …/ads/{adId}/restore`. Ids outside the campaign are ignored. On tenants that validate connect-campaign changes the deletion is queued for publisher approval; a CPM campaign\'s zone states are recomputed. Same handler as the panel. 
     * Soft-delete many ads of a campaign.
     */
    async apiV1CampaignsTypeCampaignIdAdsMassDeletePost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsMassDeletePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsMassTogglePut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassTogglePut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassTogglePut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMassTogglePut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/mass-toggle`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest']),
        };
    }

    /**
     * The panel\'s Mass Actions → Activate / Deactivate. `ids` selects ads of this campaign; an empty or missing list means **every** live ad of the campaign. Runs the same steps as the single toggle (`PATCH …/ads/{adId}/active`): on tenants that validate connect-campaign changes the ads are queued for publisher approval, one pause/activate notification is sent for the whole action, and a CPM campaign\'s zone states are recomputed. Ids outside the campaign are ignored (not counted in `affected`). Same handler as the panel. Unknown body fields → 422 `unknown_fields`. 
     * Activate or pause many ads of a campaign at once.
     */
    async apiV1CampaignsTypeCampaignIdAdsMassTogglePutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s Mass Actions → Activate / Deactivate. `ids` selects ads of this campaign; an empty or missing list means **every** live ad of the campaign. Runs the same steps as the single toggle (`PATCH …/ads/{adId}/active`): on tenants that validate connect-campaign changes the ads are queued for publisher approval, one pause/activate notification is sent for the whole action, and a CPM campaign\'s zone states are recomputed. Ids outside the campaign are ignored (not counted in `affected`). Same handler as the panel. Unknown body fields → 422 `unknown_fields`. 
     * Activate or pause many ads of a campaign at once.
     */
    async apiV1CampaignsTypeCampaignIdAdsMassTogglePut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsMassTogglePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsMultiUploadPost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMultiUploadPost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMultiUploadPost().'
            );
        }

        if (requestParameters['files'] == null) {
            throw new runtime.RequiredError(
                'files',
                'Required parameter "files" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsMultiUploadPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['files'] != null) {
            requestParameters['files'].forEach((element) => {
                formParams.append('files', element as any);
            })
        }

        if (requestParameters['title'] != null) {
            formParams.append('title', requestParameters['title'] as any);
        }

        if (requestParameters['description'] != null) {
            formParams.append('description', requestParameters['description'] as any);
        }

        if (requestParameters['useOverlays'] != null) {
            formParams.append('use_overlays', requestParameters['useOverlays'] as any);
        }

        if (requestParameters['clonePerOverlay'] != null) {
            formParams.append('clone_per_overlay', requestParameters['clonePerOverlay'] as any);
        }

        if (requestParameters['overlay'] != null) {
            requestParameters['overlay'].forEach((element) => {
                formParams.append('overlay', element as any);
            })
        }

        if (requestParameters['overlaysZip'] != null) {
            requestParameters['overlaysZip'].forEach((element) => {
                formParams.append('overlays_zip', element as any);
            })
        }


        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/multi-upload`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * `multipart/form-data` upload of multiple creative files; the server creates one ad per file on the campaign. Field `files` (repeatable) carries the uploads. 
     * Bulk-upload ads — one ad per creative file.
     */
    async apiV1CampaignsTypeCampaignIdAdsMultiUploadPostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `multipart/form-data` upload of multiple creative files; the server creates one ad per file on the campaign. Field `files` (repeatable) carries the uploads. 
     * Bulk-upload ads — one ad per creative file.
     */
    async apiV1CampaignsTypeCampaignIdAdsMultiUploadPost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsMultiUploadPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsPost without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsPostRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsPost().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsPost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsPostRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsPostRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsPost().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['dryRun'] != null) {
            queryParameters['dry_run'] = requestParameters['dryRun'];
        }

        if (requestParameters['strict'] != null) {
            queryParameters['strict'] = requestParameters['strict'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsPostRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsPostRequest']),
        };
    }

    /**
     * Creates a new ad attached to the campaign. Two request modes, selected by `Content-Type`:  - **`application/json`** — reference an existing creative   (banner pool, single creative, URL, HTML or a native image);   no file upload. - **`multipart/form-data`** — upload a real creative file   directly: `banner_file` (banner image / HTML5 zip),   `icon_file`, `image_file` (native), or `video_file`,   alongside the text fields (`title`, `bid`,   `destination_url`, …). The server stores the file, creates   the creative row and attaches it — no pre-uploaded   `creative_id` needed.  Required (JSON mode): `title` + `bid` + exactly **one** creative reference (`banner_pool_id` / `creative_id` / `banner_url` / `banner_html` / `banner_iframe_url` / `video_url` / `video_pool_id` / `native_image_url` / `image_pool_id` / `html_code`). Push ads add their icon with `icon_id` on top of the image reference. `destination_url` is required unless the creative carries its own URL (popunder/JS, VAST, html video) or you set `url_pool_id`. In multipart mode the uploaded file *is* the creative reference.  **Same validation as the panel.** Both modes run the panel\'s create checks: the per-format minimum bid, the destination-URL rules (format, blocked domains), the SmartAds `{spaceid}` macro requirement (paytype 4 campaigns), the html-video zone rule (an `html_code` video ad needs a Video Slider / In-page Video zone in the campaign whitelist), native SmartAds html-only, and the creator-pool orientation fit (`image_pool_id` on adtype 22). CPM campaigns get their zone states recomputed after the insert. `creative_id` / `icon_id` must be creatives from your own library.  **Field names.** The create names (`destination_url`, `display_url`, `preview_url`, `is_active`, `url_pool_id`) and the panel / PUT column names (`destinationurl`, `displayurl`, `previewurl`, `isactive`, `url_poolid`) are both accepted on create and on PUT, so one payload works for both. When both spellings are sent the create name wins here and the column name wins on PUT.  **Native ads (uploading a native creative by URL):**  The canonical field is `native_image_url` — a direct image URL. The native headline/body are taken from `title` + `description`, and `destination_url` is the click target; no creative pool needed. The server saves `creatives = {\"image\": {\"type\": \"url\", \"url\": \"…\"}}`, which is the only shape the panel preview and the goadserver native-ad poll render.  Convenience for callers that don\'t know the campaign\'s ad type: on a native campaign (adtypeid 3 / 21 / 22 / 42) a `banner_url`, `banner_pool_id` or `creative_id` is **auto-routed** into `creatives.image.*` using the matching shape — i.e. `banner_url` becomes `{image:{type:url,url:…}}`, `banner_pool_id` becomes `{image:{type:pool,poolid:…}}`, `creative_id` becomes `{image:{type:creative,creative_id:…}}`. Banner-only shapes that have no native equivalent (`banner_html`, `banner_iframe_url`, `video_url`, `video_pool_id`) are rejected with a 422 on native campaigns rather than persisted as an unrenderable row.  New integrations should still send `native_image_url` explicitly — it\'s the unambiguous, type-correct path.  **Modes:**   - `?dry_run=1` — return the resolved field map + computed     `creatives` JSON without inserting.   - `?strict=1` / `?strict=0` — reject / ignore unknown field names     (default: the key\'s setting, strict for keys created from 2026-10-12). 
     * Create an ad on a campaign (smart-default).
     */
    async apiV1CampaignsTypeCampaignIdAdsPostRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new ad attached to the campaign. Two request modes, selected by `Content-Type`:  - **`application/json`** — reference an existing creative   (banner pool, single creative, URL, HTML or a native image);   no file upload. - **`multipart/form-data`** — upload a real creative file   directly: `banner_file` (banner image / HTML5 zip),   `icon_file`, `image_file` (native), or `video_file`,   alongside the text fields (`title`, `bid`,   `destination_url`, …). The server stores the file, creates   the creative row and attaches it — no pre-uploaded   `creative_id` needed.  Required (JSON mode): `title` + `bid` + exactly **one** creative reference (`banner_pool_id` / `creative_id` / `banner_url` / `banner_html` / `banner_iframe_url` / `video_url` / `video_pool_id` / `native_image_url` / `image_pool_id` / `html_code`). Push ads add their icon with `icon_id` on top of the image reference. `destination_url` is required unless the creative carries its own URL (popunder/JS, VAST, html video) or you set `url_pool_id`. In multipart mode the uploaded file *is* the creative reference.  **Same validation as the panel.** Both modes run the panel\'s create checks: the per-format minimum bid, the destination-URL rules (format, blocked domains), the SmartAds `{spaceid}` macro requirement (paytype 4 campaigns), the html-video zone rule (an `html_code` video ad needs a Video Slider / In-page Video zone in the campaign whitelist), native SmartAds html-only, and the creator-pool orientation fit (`image_pool_id` on adtype 22). CPM campaigns get their zone states recomputed after the insert. `creative_id` / `icon_id` must be creatives from your own library.  **Field names.** The create names (`destination_url`, `display_url`, `preview_url`, `is_active`, `url_pool_id`) and the panel / PUT column names (`destinationurl`, `displayurl`, `previewurl`, `isactive`, `url_poolid`) are both accepted on create and on PUT, so one payload works for both. When both spellings are sent the create name wins here and the column name wins on PUT.  **Native ads (uploading a native creative by URL):**  The canonical field is `native_image_url` — a direct image URL. The native headline/body are taken from `title` + `description`, and `destination_url` is the click target; no creative pool needed. The server saves `creatives = {\"image\": {\"type\": \"url\", \"url\": \"…\"}}`, which is the only shape the panel preview and the goadserver native-ad poll render.  Convenience for callers that don\'t know the campaign\'s ad type: on a native campaign (adtypeid 3 / 21 / 22 / 42) a `banner_url`, `banner_pool_id` or `creative_id` is **auto-routed** into `creatives.image.*` using the matching shape — i.e. `banner_url` becomes `{image:{type:url,url:…}}`, `banner_pool_id` becomes `{image:{type:pool,poolid:…}}`, `creative_id` becomes `{image:{type:creative,creative_id:…}}`. Banner-only shapes that have no native equivalent (`banner_html`, `banner_iframe_url`, `video_url`, `video_pool_id`) are rejected with a 422 on native campaigns rather than persisted as an unrenderable row.  New integrations should still send `native_image_url` explicitly — it\'s the unambiguous, type-correct path.  **Modes:**   - `?dry_run=1` — return the resolved field map + computed     `creatives` JSON without inserting.   - `?strict=1` / `?strict=0` — reject / ignore unknown field names     (default: the key\'s setting, strict for keys created from 2026-10-12). 
     * Create an ad on a campaign (smart-default).
     */
    async apiV1CampaignsTypeCampaignIdAdsPost(requestParameters: ApiV1CampaignsTypeCampaignIdAdsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/update-pool`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest']),
        };
    }

    /**
     * The panel\'s bulk \"Change creative pool\". `ids` selects ads (max 200; empty = every ad of the campaign). Give either one `pool_id` for the whole selection or `pool_by_size` (`{bansizeid: poolid}`) for a banner selection running several sizes (it wins when both are sent). Only ads with a pool-shaped slot are touched; `include_unpooled: true` also converts ads that carry their own uploaded / hotlinked creative (that creative reference is replaced). Every target pool must be yours; native / creator pools must fit the campaign\'s orientation (422 names the mismatch). List the pools a selection can take with the panel picker rules described on the ad schema. 
     * Point many ads at a different creative pool.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s bulk \"Change creative pool\". `ids` selects ads (max 200; empty = every ad of the campaign). Give either one `pool_id` for the whole selection or `pool_by_size` (`{bansizeid: poolid}`) for a banner selection running several sizes (it wins when both are sent). Only ads with a pool-shaped slot are touched; `include_unpooled: true` also converts ads that carry their own uploaded / hotlinked creative (that creative reference is replaced). Every target pool must be yours; native / creator pools must fit the campaign\'s orientation (422 names the mismatch). List the pools a selection can take with the panel picker rules described on the ad schema. 
     * Point many ads at a different creative pool.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/update-url-pool`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest']),
        };
    }

    /**
     * The panel\'s bulk \"Change URL pool\". `pool_id` > 0 attaches that URL pool (it must be yours and hold at least one active URL); `pool_id: 0` detaches, so each ad falls back to its own destination URL — an ad with none stays on its pool and is counted in `no_fallback`. Ads whose creative links itself (html / iframe / VAST / phone) are `skipped`. `ids` max 200, empty = every ad. Changed ads go back to review unless the account is auto-validated. 
     * Point many ads at a URL pool, or detach it.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s bulk \"Change URL pool\". `pool_id` > 0 attaches that URL pool (it must be yours and hold at least one active URL); `pool_id: 0` detaches, so each ad falls back to its own destination URL — an ad with none stays on its pool and is counted in `no_fallback`. Ads whose creative links itself (html / iframe / VAST / phone) are `skipped`. `ids` max 200, empty = every ad. Changed ads go back to review unless the account is auto-validated. 
     * Point many ads at a URL pool, or detach it.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/update-url`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest']),
        };
    }

    /**
     * The panel\'s bulk \"Change URL\" action. Two modes:  - `set` (default) — write `url` onto every selected ad. - `replace` — substring find/replace (`find` → `replace`) inside   each ad\'s own URL, e.g. to move a campaign to a new domain or   tracker id while per-ad paths and macros differ.  `ids` selects ads (max 200); empty = every ad of the campaign. Only ads whose click target is their own destination URL are touched — ads on a URL pool, with a self-linking creative (html / iframe / VAST) or a phone number are reported as `skipped`. Every new URL passes the single-ad checks first (format, blocked domains); one bad URL fails the whole call before anything is written. Changed ads go back to review unless the account is auto-validated. Legacy shape `{adids, destinationurl}` is also accepted. 
     * Rewrite the destination URL of many ads at once.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s bulk \"Change URL\" action. Two modes:  - `set` (default) — write `url` onto every selected ad. - `replace` — substring find/replace (`find` → `replace`) inside   each ad\'s own URL, e.g. to move a campaign to a new domain or   tracker id while per-ad paths and macros differ.  `ids` selects ads (max 200); empty = every ad of the campaign. Only ads whose click target is their own destination URL are touched — ads on a URL pool, with a self-linking creative (html / iframe / VAST) or a phone number are reported as `skipped`. Every new URL passes the single-ad checks first (format, blocked domains); one bad URL fails the whole call before anything is written. Changed ads go back to review unless the account is auto-validated. Legacy shape `{adids, destinationurl}` is also accepted. 
     * Rewrite the destination URL of many ads at once.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut without sending the request
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest',
                'Required parameter "apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest" was null or undefined when calling apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/ads/update-weight`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequestToJSON(requestParameters['apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest']),
        };
    }

    /**
     * Writes `sort_weight` on every listed ad of this campaign (the relative share an ad gets when the campaign rotates its ads by weight). Same handler as the panel. RON only. 
     * Set the rotation weight of one or more RON ads.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRaw(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Writes `sort_weight` on every listed ad of this campaign (the relative share an ad gets when the campaign rotates its ads by weight). Same handler as the panel. RON only. 
     * Set the rotation weight of one or more RON ads.
     */
    async apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut(requestParameters: ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeCampaignIdSchemaAdsGet without sending the request
     */
    async apiV1CampaignsTypeCampaignIdSchemaAdsGetRequestOpts(requestParameters: ApiV1CampaignsTypeCampaignIdSchemaAdsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeCampaignIdSchemaAdsGet().'
            );
        }

        if (requestParameters['campaignId'] == null) {
            throw new runtime.RequiredError(
                'campaignId',
                'Required parameter "campaignId" was null or undefined when calling apiV1CampaignsTypeCampaignIdSchemaAdsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{campaignId}/_schema/ads`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"campaignId"}}`, encodeURIComponent(String(requestParameters['campaignId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Same as `/_schema/ads` above, but uses the campaign\'s ad type to return only the fields that apply (e.g. video pools omitted for a banner-only campaign). Sets `campaign_ad_type` in the response. 
     * Field metadata for ad creation, scoped to a campaign.
     */
    async apiV1CampaignsTypeCampaignIdSchemaAdsGetRaw(requestParameters: ApiV1CampaignsTypeCampaignIdSchemaAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeCampaignIdSchemaAdsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Same as `/_schema/ads` above, but uses the campaign\'s ad type to return only the fields that apply (e.g. video pools omitted for a banner-only campaign). Sets `campaign_ad_type` in the response. 
     * Field metadata for ad creation, scoped to a campaign.
     */
    async apiV1CampaignsTypeCampaignIdSchemaAdsGet(requestParameters: ApiV1CampaignsTypeCampaignIdSchemaAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeCampaignIdSchemaAdsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdActivePatch without sending the request
     */
    async apiV1CampaignsTypeIdActivePatchRequestOpts(requestParameters: ApiV1CampaignsTypeIdActivePatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdActivePatch().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdActivePatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdActivePatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdActivePatchRequest',
                'Required parameter "apiV1CampaignsTypeIdActivePatchRequest" was null or undefined when calling apiV1CampaignsTypeIdActivePatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/active`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdActivePatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdActivePatchRequest']),
        };
    }

    /**
     * Idempotent. `active=true` unpauses, `active=false` pauses. Reuses the same panel-side guards: flat-rate campaigns with running deals cannot be paused; offer campaigns require >= 5 ads to be unpaused.  This is the endpoint behind the **\"On / off only\"** key preset. 
     * Pause or unpause a campaign.
     */
    async apiV1CampaignsTypeIdActivePatchRaw(requestParameters: ApiV1CampaignsTypeIdActivePatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdActivePatch200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdActivePatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdActivePatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Idempotent. `active=true` unpauses, `active=false` pauses. Reuses the same panel-side guards: flat-rate campaigns with running deals cannot be paused; offer campaigns require >= 5 ads to be unpaused.  This is the endpoint behind the **\"On / off only\"** key preset. 
     * Pause or unpause a campaign.
     */
    async apiV1CampaignsTypeIdActivePatch(requestParameters: ApiV1CampaignsTypeIdActivePatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdActivePatch200Response> {
        const response = await this.apiV1CampaignsTypeIdActivePatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdAvailableZonesGet without sending the request
     */
    async apiV1CampaignsTypeIdAvailableZonesGetRequestOpts(requestParameters: ApiV1CampaignsTypeIdAvailableZonesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdAvailableZonesGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdAvailableZonesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['siteId'] != null) {
            queryParameters['site_id'] = requestParameters['siteId'];
        }

        if (requestParameters['excludeIds'] != null) {
            queryParameters['exclude_ids'] = requestParameters['excludeIds'];
        }

        if (requestParameters['onlyUsedSizes'] != null) {
            queryParameters['only_used_sizes'] = requestParameters['onlyUsedSizes'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/available-zones`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Your own, non-deleted ad zones matching the campaign\'s ad type (and main category / native orientation where they apply), newest first, with `is_whitelisted` for the ones already attached. Paginated (`per_page` default 50, max 200). Same handler as the panel\'s zone picker. 
     * List your ad zones that can be attached to a campaign.
     */
    async apiV1CampaignsTypeIdAvailableZonesGetRaw(requestParameters: ApiV1CampaignsTypeIdAvailableZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdAvailableZonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Your own, non-deleted ad zones matching the campaign\'s ad type (and main category / native orientation where they apply), newest first, with `is_whitelisted` for the ones already attached. Paginated (`per_page` default 50, max 200). Same handler as the panel\'s zone picker. 
     * List your ad zones that can be attached to a campaign.
     */
    async apiV1CampaignsTypeIdAvailableZonesGet(requestParameters: ApiV1CampaignsTypeIdAvailableZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdAvailableZonesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdBidsPatch without sending the request
     */
    async apiV1CampaignsTypeIdBidsPatchRequestOpts(requestParameters: ApiV1CampaignsTypeIdBidsPatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdBidsPatch().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdBidsPatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdBidsPatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdBidsPatchRequest',
                'Required parameter "apiV1CampaignsTypeIdBidsPatchRequest" was null or undefined when calling apiV1CampaignsTypeIdBidsPatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/bids`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdBidsPatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdBidsPatchRequest']),
        };
    }

    /**
     * Update every (or a subset of) ad\'s bid in one call. Three modes:    - `set`     — overwrite each target ad\'s bid with `value`.   - `pct_inc` — raise each target ad\'s bid by `pct` percent.   - `pct_dec` — lower each target ad\'s bid by `pct` percent.  Optional `ad_ids` narrows the update to a subset (omit or empty list = every non-deleted ad on the campaign). Bids are clamped at 0 — anything that would resolve below 0 is set to 0.  Bids are in **currency units of your account\'s currency** (`0.05` = 0.05), the same as the panel, and must be at least `GET /api/v1/campaigns/{type}/{id}/min-bid` (422 otherwise; `0` is allowed and stops the ad bidding). Reads return the bid as `bid_amount` in the same unit; `user_bid` / `bid` are the stored values in cents (your currency / the network\'s main currency). Keys that wrote bids before 2026-10-12 keep the old raw-cents contract; every bid write echoes `bid_unit` (`currency` or `raw_cents`).  `pct_inc` / `pct_dec` scale the stored bid and user_bid alike. 
     * Mass update bids on every ad in a campaign.
     */
    async apiV1CampaignsTypeIdBidsPatchRaw(requestParameters: ApiV1CampaignsTypeIdBidsPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdBidsPatch200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdBidsPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdBidsPatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Update every (or a subset of) ad\'s bid in one call. Three modes:    - `set`     — overwrite each target ad\'s bid with `value`.   - `pct_inc` — raise each target ad\'s bid by `pct` percent.   - `pct_dec` — lower each target ad\'s bid by `pct` percent.  Optional `ad_ids` narrows the update to a subset (omit or empty list = every non-deleted ad on the campaign). Bids are clamped at 0 — anything that would resolve below 0 is set to 0.  Bids are in **currency units of your account\'s currency** (`0.05` = 0.05), the same as the panel, and must be at least `GET /api/v1/campaigns/{type}/{id}/min-bid` (422 otherwise; `0` is allowed and stops the ad bidding). Reads return the bid as `bid_amount` in the same unit; `user_bid` / `bid` are the stored values in cents (your currency / the network\'s main currency). Keys that wrote bids before 2026-10-12 keep the old raw-cents contract; every bid write echoes `bid_unit` (`currency` or `raw_cents`).  `pct_inc` / `pct_dec` scale the stored bid and user_bid alike. 
     * Mass update bids on every ad in a campaign.
     */
    async apiV1CampaignsTypeIdBidsPatch(requestParameters: ApiV1CampaignsTypeIdBidsPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdBidsPatch200Response> {
        const response = await this.apiV1CampaignsTypeIdBidsPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdBudgetPatch without sending the request
     */
    async apiV1CampaignsTypeIdBudgetPatchRequestOpts(requestParameters: ApiV1CampaignsTypeIdBudgetPatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdBudgetPatch().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdBudgetPatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdBudgetPatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdBudgetPatchRequest',
                'Required parameter "apiV1CampaignsTypeIdBudgetPatchRequest" was null or undefined when calling apiV1CampaignsTypeIdBudgetPatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/budget`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdBudgetPatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdBudgetPatchRequest']),
        };
    }

    /**
     * Sets the campaign (total) budget and/or the max daily budget, plus the flags that enable each cap. All four fields are optional — send only the ones you want to change. Amounts are in the account currency. Documented in audit_20260723_1117 (was implemented but unspecified).  `max_day_budget` is corrected upward to the ad type\'s configured minimum daily budget rather than rejected, matching every other write path. The stored amount is returned as `max_day_budget` in the response — read it back instead of assuming the value you sent. 
     * Update a campaign\'s total and/or daily budget.
     */
    async apiV1CampaignsTypeIdBudgetPatchRaw(requestParameters: ApiV1CampaignsTypeIdBudgetPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdBudgetPatch200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdBudgetPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdBudgetPatch200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets the campaign (total) budget and/or the max daily budget, plus the flags that enable each cap. All four fields are optional — send only the ones you want to change. Amounts are in the account currency. Documented in audit_20260723_1117 (was implemented but unspecified).  `max_day_budget` is corrected upward to the ad type\'s configured minimum daily budget rather than rejected, matching every other write path. The stored amount is returned as `max_day_budget` in the response — read it back instead of assuming the value you sent. 
     * Update a campaign\'s total and/or daily budget.
     */
    async apiV1CampaignsTypeIdBudgetPatch(requestParameters: ApiV1CampaignsTypeIdBudgetPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdBudgetPatch200Response> {
        const response = await this.apiV1CampaignsTypeIdBudgetPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdClonePost without sending the request
     */
    async apiV1CampaignsTypeIdClonePostRequestOpts(requestParameters: ApiV1CampaignsTypeIdClonePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdClonePost().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdClonePost().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['strict'] != null) {
            queryParameters['strict'] = requestParameters['strict'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/clone`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdClonePostRequestToJSON(requestParameters['apiV1CampaignsTypeIdClonePostRequest']),
        };
    }

    /**
     * Same core as the panel\'s Duplicate button. The clone lands paused (`is_active=false`; a network can make ron clones start active, and one that reviews new campaigns puts them in Pending Created) and named \"<original> Copy\" unless `name` is sent. By default every part is copied; the four `copy_*` switches (the Duplicate dialog\'s choices, each default `true`) leave a part out, in which case the clone gets the table defaults for it:  - `copy_ads` — the campaign\'s ads and creatives. - `copy_targeting` — countries/regions, categories, devices,   browsers, OS, languages, location, connection / carrier / ISP,   keywords, webview / adblock, orientation and the linked domain /   IP / retargeting filters. - `copy_budget` — total and daily budget, impression limits,   frequency capping, conversion capping. - `copy_schedule` — day/time parting and the start / end dates.  Bookkeeping (`num_ads`, `pending_state`, `dateadded`, `wl_zoneids`) is always reset. A RON clone also drops any flat-deal records, copies offer screenshots, and goes to review when the network validates campaigns. A flat campaign (paytype 5) can only be cloned by an administrator → 403 for API keys.  `copied` in the response echoes which parts were copied. Unknown body keys are ignored, or a 422 with `?strict=1`. 
     * Clone a campaign — everything, or the parts you pick.
     */
    async apiV1CampaignsTypeIdClonePostRaw(requestParameters: ApiV1CampaignsTypeIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdClonePost201Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdClonePost201ResponseFromJSON(jsonValue));
    }

    /**
     * Same core as the panel\'s Duplicate button. The clone lands paused (`is_active=false`; a network can make ron clones start active, and one that reviews new campaigns puts them in Pending Created) and named \"<original> Copy\" unless `name` is sent. By default every part is copied; the four `copy_*` switches (the Duplicate dialog\'s choices, each default `true`) leave a part out, in which case the clone gets the table defaults for it:  - `copy_ads` — the campaign\'s ads and creatives. - `copy_targeting` — countries/regions, categories, devices,   browsers, OS, languages, location, connection / carrier / ISP,   keywords, webview / adblock, orientation and the linked domain /   IP / retargeting filters. - `copy_budget` — total and daily budget, impression limits,   frequency capping, conversion capping. - `copy_schedule` — day/time parting and the start / end dates.  Bookkeeping (`num_ads`, `pending_state`, `dateadded`, `wl_zoneids`) is always reset. A RON clone also drops any flat-deal records, copies offer screenshots, and goes to review when the network validates campaigns. A flat campaign (paytype 5) can only be cloned by an administrator → 403 for API keys.  `copied` in the response echoes which parts were copied. Unknown body keys are ignored, or a 422 with `?strict=1`. 
     * Clone a campaign — everything, or the parts you pick.
     */
    async apiV1CampaignsTypeIdClonePost(requestParameters: ApiV1CampaignsTypeIdClonePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdClonePost201Response> {
        const response = await this.apiV1CampaignsTypeIdClonePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdDelete without sending the request
     */
    async apiV1CampaignsTypeIdDeleteRequestOpts(requestParameters: ApiV1CampaignsTypeIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdDelete().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sets `isdeleted=1`, `dayactive=0` (flatrate / directdeal: `iscancelled=1`, `ispaused=1`, `dayactive=0`). The campaign and its history remain in the database for billing/stats reconciliation but stop serving immediately. Idempotent — deleting an already-deleted campaign returns 404. The campaign\'s live ads are soft-deleted with it (marked as deleted-with-the-campaign; ads you had deleted yourself before stay as they were).  Undo with `POST /api/v1/campaigns/mass-undelete` `{ids:[id], type}`: the ads the delete took down come back, and a ron / cpm / rtb campaign returns paused or running as it was before the delete (a flat / direct deal comes back paused). Find deleted campaigns with `GET /api/v1/campaigns?deleted=1`.  On a network that reviews campaign deletes, a live ron campaign (not a flat one) is not deleted: the answer is `deleted: false, pending_review: true`, the campaign keeps running with `pending_state: 2` (Pending Delete), and an admin\'s approval deletes it. 
     * Soft-delete a campaign.
     */
    async apiV1CampaignsTypeIdDeleteRaw(requestParameters: ApiV1CampaignsTypeIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdDelete200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Sets `isdeleted=1`, `dayactive=0` (flatrate / directdeal: `iscancelled=1`, `ispaused=1`, `dayactive=0`). The campaign and its history remain in the database for billing/stats reconciliation but stop serving immediately. Idempotent — deleting an already-deleted campaign returns 404. The campaign\'s live ads are soft-deleted with it (marked as deleted-with-the-campaign; ads you had deleted yourself before stay as they were).  Undo with `POST /api/v1/campaigns/mass-undelete` `{ids:[id], type}`: the ads the delete took down come back, and a ron / cpm / rtb campaign returns paused or running as it was before the delete (a flat / direct deal comes back paused). Find deleted campaigns with `GET /api/v1/campaigns?deleted=1`.  On a network that reviews campaign deletes, a live ron campaign (not a flat one) is not deleted: the answer is `deleted: false, pending_review: true`, the campaign keeps running with `pending_state: 2` (Pending Delete), and an admin\'s approval deletes it. 
     * Soft-delete a campaign.
     */
    async apiV1CampaignsTypeIdDelete(requestParameters: ApiV1CampaignsTypeIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdDelete200Response> {
        const response = await this.apiV1CampaignsTypeIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete without sending the request
     */
    async apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequestOpts(requestParameters: ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete().'
            );
        }

        if (requestParameters['filterType'] == null) {
            throw new runtime.RequiredError(
                'filterType',
                'Required parameter "filterType" was null or undefined when calling apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete().'
            );
        }

        if (requestParameters['filterId'] == null) {
            throw new runtime.RequiredError(
                'filterId',
                'Required parameter "filterId" was null or undefined when calling apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/filters/{filter_type}/{filter_id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"filter_type"}}`, encodeURIComponent(String(requestParameters['filterType'])));
        urlPath = urlPath.replace(`{${"filter_id"}}`, encodeURIComponent(String(requestParameters['filterId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Block list: removes the campaign from the filter\'s campaign list. Refused with 409 when that would widen the filter instead — `last_campaign` (it is the only listed campaign; an empty list means every campaign of the ad type) or `filter_not_campaign_scoped` (the filter covers every campaign anyway). Deactivate, delete or re-scope the filter (PUT /api/v1/filters/{type}/{id}) instead. Allow-list / `ip`: clears the campaign\'s FK column only if it currently points to this filter; otherwise returns 404. 
     * Detach a filter from this campaign.
     */
    async apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRaw(requestParameters: ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Block list: removes the campaign from the filter\'s campaign list. Refused with 409 when that would widen the filter instead — `last_campaign` (it is the only listed campaign; an empty list means every campaign of the ad type) or `filter_not_campaign_scoped` (the filter covers every campaign anyway). Deactivate, delete or re-scope the filter (PUT /api/v1/filters/{type}/{id}) instead. Allow-list / `ip`: clears the campaign\'s FK column only if it currently points to this filter; otherwise returns 404. 
     * Detach a filter from this campaign.
     */
    async apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete(requestParameters: ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdFiltersGet without sending the request
     */
    async apiV1CampaignsTypeIdFiltersGetRequestOpts(requestParameters: ApiV1CampaignsTypeIdFiltersGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdFiltersGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdFiltersGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/filters`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns every filter that reaches this campaign: allow-lists and the IP pool via the campaign\'s FK columns, and block lists that either list it (`applies_to: listed_campaigns`, matching campaign_type) or cover it without a list (`all_campaigns` = ad_type 0; `all_campaigns_of_ad_type` = same ad type, empty list). `ron`, `cpm` and `rtb` campaigns support filter linkage. A cpm campaign takes `subid_incl`, `subid_excl`, `ip` and the domain / adzone / ISP block lists (block lists hold it as a `ron` campaign); `domain_incl` / `adzone_incl` are ron / rtb only → 422 `validation_error`. Any other type → 422 \"Filter linking is only supported for campaign types: ron, cpm, rtb.\" 
     * List filters attached to this campaign.
     */
    async apiV1CampaignsTypeIdFiltersGetRaw(requestParameters: ApiV1CampaignsTypeIdFiltersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdFiltersGet200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdFiltersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdFiltersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns every filter that reaches this campaign: allow-lists and the IP pool via the campaign\'s FK columns, and block lists that either list it (`applies_to: listed_campaigns`, matching campaign_type) or cover it without a list (`all_campaigns` = ad_type 0; `all_campaigns_of_ad_type` = same ad type, empty list). `ron`, `cpm` and `rtb` campaigns support filter linkage. A cpm campaign takes `subid_incl`, `subid_excl`, `ip` and the domain / adzone / ISP block lists (block lists hold it as a `ron` campaign); `domain_incl` / `adzone_incl` are ron / rtb only → 422 `validation_error`. Any other type → 422 \"Filter linking is only supported for campaign types: ron, cpm, rtb.\" 
     * List filters attached to this campaign.
     */
    async apiV1CampaignsTypeIdFiltersGet(requestParameters: ApiV1CampaignsTypeIdFiltersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdFiltersGet200Response> {
        const response = await this.apiV1CampaignsTypeIdFiltersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdFiltersPost without sending the request
     */
    async apiV1CampaignsTypeIdFiltersPostRequestOpts(requestParameters: ApiV1CampaignsTypeIdFiltersPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdFiltersPost().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdFiltersPost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdFiltersPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdFiltersPostRequest',
                'Required parameter "apiV1CampaignsTypeIdFiltersPostRequest" was null or undefined when calling apiV1CampaignsTypeIdFiltersPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/filters`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdFiltersPostRequestToJSON(requestParameters['apiV1CampaignsTypeIdFiltersPostRequest']),
        };
    }

    /**
     * Block lists (`*_excl`): adds the campaign to the filter\'s campaign list. A filter that already covers the campaign (ad_type 0, or an empty list of the campaign\'s ad type) is left alone — `changed: false` + `applies_to` — instead of being narrowed to this one campaign. Refused with 422 when the filter\'s ad type differs from the campaign\'s (the block would never apply) or when its list holds the other campaign kind (ron vs rtb). Allow-lists (`*_incl`) and `ip`: sets the campaign\'s FK column to this filter (replacing any previous one of the same kind). 
     * Attach a filter to this campaign.
     */
    async apiV1CampaignsTypeIdFiltersPostRaw(requestParameters: ApiV1CampaignsTypeIdFiltersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdFiltersPost200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdFiltersPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdFiltersPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Block lists (`*_excl`): adds the campaign to the filter\'s campaign list. A filter that already covers the campaign (ad_type 0, or an empty list of the campaign\'s ad type) is left alone — `changed: false` + `applies_to` — instead of being narrowed to this one campaign. Refused with 422 when the filter\'s ad type differs from the campaign\'s (the block would never apply) or when its list holds the other campaign kind (ron vs rtb). Allow-lists (`*_incl`) and `ip`: sets the campaign\'s FK column to this filter (replacing any previous one of the same kind). 
     * Attach a filter to this campaign.
     */
    async apiV1CampaignsTypeIdFiltersPost(requestParameters: ApiV1CampaignsTypeIdFiltersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdFiltersPost200Response> {
        const response = await this.apiV1CampaignsTypeIdFiltersPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdGet without sending the request
     */
    async apiV1CampaignsTypeIdGetRequestOpts(requestParameters: ApiV1CampaignsTypeIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get a single campaign.
     */
    async apiV1CampaignsTypeIdGetRaw(requestParameters: ApiV1CampaignsTypeIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<object>> {
        const requestOptions = await this.apiV1CampaignsTypeIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Get a single campaign.
     */
    async apiV1CampaignsTypeIdGet(requestParameters: ApiV1CampaignsTypeIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<object> {
        const response = await this.apiV1CampaignsTypeIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdMinBidGet without sending the request
     */
    async apiV1CampaignsTypeIdMinBidGetRequestOpts(requestParameters: ApiV1CampaignsTypeIdMinBidGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdMinBidGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdMinBidGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/min-bid`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns the floor the platform will accept for this campaign, derived from the same logic the panel uses (admanager → effectively zero, custom `fx_minprice`, or the `min_prices_ron` table matched against the campaign\'s targeting). Use this before bulk-updating bids so the optimiser doesn\'t push values below the floor and have them clamped or rejected. 
     * Get the campaign\'s minimum acceptable CPC bid.
     */
    async apiV1CampaignsTypeIdMinBidGetRaw(requestParameters: ApiV1CampaignsTypeIdMinBidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeIdMinBidGet200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeIdMinBidGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeIdMinBidGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the floor the platform will accept for this campaign, derived from the same logic the panel uses (admanager → effectively zero, custom `fx_minprice`, or the `min_prices_ron` table matched against the campaign\'s targeting). Use this before bulk-updating bids so the optimiser doesn\'t push values below the floor and have them clamped or rejected. 
     * Get the campaign\'s minimum acceptable CPC bid.
     */
    async apiV1CampaignsTypeIdMinBidGet(requestParameters: ApiV1CampaignsTypeIdMinBidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeIdMinBidGet200Response> {
        const response = await this.apiV1CampaignsTypeIdMinBidGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdPatch without sending the request
     */
    async apiV1CampaignsTypeIdPatchRequestOpts(requestParameters: ApiV1CampaignsTypeIdPatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdPatch().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdPatch().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdPatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdPatchRequest',
                'Required parameter "apiV1CampaignsTypeIdPatchRequest" was null or undefined when calling apiV1CampaignsTypeIdPatch().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['dryRun'] != null) {
            queryParameters['dry_run'] = requestParameters['dryRun'];
        }

        if (requestParameters['strict'] != null) {
            queryParameters['strict'] = requestParameters['strict'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdPatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdPatchRequest']),
        };
    }

    /**
     * Updates one or more writable fields on an existing campaign. Send only the fields you want to change — anything you omit is left alone. Field names are the public ones from `GET /api/v1/campaigns/{type}/_schema` (`daily_budget`, `regions`, `device_type_ids`, …).  **Region targeting (`regions`):** the server defensively trims any ancestor id whose descendant is also in the list, at any depth (continent → country → state → sub-region → city). If you send a higher-level id alongside one of its descendants, the higher-level id is dropped — sending both would otherwise broaden targeting back up to the whole subtree and undo the leaf pick. Use `GET /api/v1/lookups/regions` to walk the geo tree and pick the leaf id you actually want.  **`directdeal` / `flatrate`** take their own field set: `name`, `is_paused`, `start_date`, `total_days` (either alone — the other keeps its stored value; the end date is recomputed), `deal_type`, `total_budget`, `regions` (or legacy `countries`), `languages`, `device_type_ids`, `os_ids`, `browser_ids`, `max_impressions`, `percentage` (0-100), `use_keywords`, `keywords`, `keywords_exclude`. Any other field — including `ad_space_id`, which is fixed at create — answers `422 unsupported_fields` with the list, rather than being ignored.  Some fields cannot be changed via this endpoint:   - `ad_type` — the ads table layout differs per type, change     requires recreating the campaign.   - `id`, `userid`, `systemid`, `isdeleted`, `dateadded`, audit     stamps — system-managed.   - Read-only projection fields — `total_spent`, `sites_locked`,     `pending_state`, `num_ads`, `is_deleted`, `is_complete`,     `created_at`, `started_at`, `ended_at`, `last_paid_at` — are     ignored (rejected in strict mode).   - `selling_type` — a change is refused with 409; change it in     the panel.  The same save rules as the panel apply: `daily_budget` is raised to the system minimum, `total_budget` must be > 0 while `use_campaign_budget` is true, an impression limit that is switched on needs a value > 0, and `start_date` / `end_date` must be YYYY-MM-DD. Every campaign-form field of `CampaignPanelFields` is writable here too, with the same gates as on create (a field that does not apply is a `422`); object fields (`day_parting`, `conversion_capping`, …) merge with the stored value, and the other option keys are kept. `banner_size_ids` (rtb banner) replaces the size set. The change is recorded in the campaign history and mailed like a panel save.  **Modes:**   - `?dry_run=1` — return the resolved field map without writing.   - `?strict=1` / `?strict=0` — reject / ignore unknown field names     (default: the key\'s setting, strict for keys created from 2026-10-12). 
     * Partially update a campaign.
     */
    async apiV1CampaignsTypeIdPatchRaw(requestParameters: ApiV1CampaignsTypeIdPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Updates one or more writable fields on an existing campaign. Send only the fields you want to change — anything you omit is left alone. Field names are the public ones from `GET /api/v1/campaigns/{type}/_schema` (`daily_budget`, `regions`, `device_type_ids`, …).  **Region targeting (`regions`):** the server defensively trims any ancestor id whose descendant is also in the list, at any depth (continent → country → state → sub-region → city). If you send a higher-level id alongside one of its descendants, the higher-level id is dropped — sending both would otherwise broaden targeting back up to the whole subtree and undo the leaf pick. Use `GET /api/v1/lookups/regions` to walk the geo tree and pick the leaf id you actually want.  **`directdeal` / `flatrate`** take their own field set: `name`, `is_paused`, `start_date`, `total_days` (either alone — the other keeps its stored value; the end date is recomputed), `deal_type`, `total_budget`, `regions` (or legacy `countries`), `languages`, `device_type_ids`, `os_ids`, `browser_ids`, `max_impressions`, `percentage` (0-100), `use_keywords`, `keywords`, `keywords_exclude`. Any other field — including `ad_space_id`, which is fixed at create — answers `422 unsupported_fields` with the list, rather than being ignored.  Some fields cannot be changed via this endpoint:   - `ad_type` — the ads table layout differs per type, change     requires recreating the campaign.   - `id`, `userid`, `systemid`, `isdeleted`, `dateadded`, audit     stamps — system-managed.   - Read-only projection fields — `total_spent`, `sites_locked`,     `pending_state`, `num_ads`, `is_deleted`, `is_complete`,     `created_at`, `started_at`, `ended_at`, `last_paid_at` — are     ignored (rejected in strict mode).   - `selling_type` — a change is refused with 409; change it in     the panel.  The same save rules as the panel apply: `daily_budget` is raised to the system minimum, `total_budget` must be > 0 while `use_campaign_budget` is true, an impression limit that is switched on needs a value > 0, and `start_date` / `end_date` must be YYYY-MM-DD. Every campaign-form field of `CampaignPanelFields` is writable here too, with the same gates as on create (a field that does not apply is a `422`); object fields (`day_parting`, `conversion_capping`, …) merge with the stored value, and the other option keys are kept. `banner_size_ids` (rtb banner) replaces the size set. The change is recorded in the campaign history and mailed like a panel save.  **Modes:**   - `?dry_run=1` — return the resolved field map without writing.   - `?strict=1` / `?strict=0` — reject / ignore unknown field names     (default: the key\'s setting, strict for keys created from 2026-10-12). 
     * Partially update a campaign.
     */
    async apiV1CampaignsTypeIdPatch(requestParameters: ApiV1CampaignsTypeIdPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdPatchRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdResetMaxBudgetPut without sending the request
     */
    async apiV1CampaignsTypeIdResetMaxBudgetPutRequestOpts(requestParameters: ApiV1CampaignsTypeIdResetMaxBudgetPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdResetMaxBudgetPut().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdResetMaxBudgetPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/reset-max-budget`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Zeroes the spend counted against the campaign\'s total budget (`campaignbudget`) and re-arms the \"budget reached\" email, so a campaign stopped by its lifetime budget can spend it again. The budget value itself is unchanged. Not for flatrate / directdeal (422 `budget_reset_not_supported`). Same handler as the panel\'s Reset button. 
     * Reset a campaign\'s lifetime-budget spend.
     */
    async apiV1CampaignsTypeIdResetMaxBudgetPutRaw(requestParameters: ApiV1CampaignsTypeIdResetMaxBudgetPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdResetMaxBudgetPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Zeroes the spend counted against the campaign\'s total budget (`campaignbudget`) and re-arms the \"budget reached\" email, so a campaign stopped by its lifetime budget can spend it again. The budget value itself is unchanged. Not for flatrate / directdeal (422 `budget_reset_not_supported`). Same handler as the panel\'s Reset button. 
     * Reset a campaign\'s lifetime-budget spend.
     */
    async apiV1CampaignsTypeIdResetMaxBudgetPut(requestParameters: ApiV1CampaignsTypeIdResetMaxBudgetPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdResetMaxBudgetPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdSitesGet without sending the request
     */
    async apiV1CampaignsTypeIdSitesGetRequestOpts(requestParameters: ApiV1CampaignsTypeIdSitesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdSitesGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdSitesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['excludeIds'] != null) {
            queryParameters['exclude_ids'] = requestParameters['excludeIds'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/sites`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Your own sites with the number of their zones that match the campaign (same rules as available-zones); sites with none are left out. Use a site\'s `id` as `site_id` on available-zones. Same handler as the panel. 
     * Your sites that have zones attachable to a campaign.
     */
    async apiV1CampaignsTypeIdSitesGetRaw(requestParameters: ApiV1CampaignsTypeIdSitesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdSitesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Your own sites with the number of their zones that match the campaign (same rules as available-zones); sites with none are left out. Use a site\'s `id` as `site_id` on available-zones. Same handler as the panel. 
     * Your sites that have zones attachable to a campaign.
     */
    async apiV1CampaignsTypeIdSitesGet(requestParameters: ApiV1CampaignsTypeIdSitesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdSitesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdWhitelistZonesGet without sending the request
     */
    async apiV1CampaignsTypeIdWhitelistZonesGetRequestOpts(requestParameters: ApiV1CampaignsTypeIdWhitelistZonesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdWhitelistZonesGet().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdWhitelistZonesGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/whitelist-zones`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s zone allow-list with each zone\'s weight for this campaign (0–100, default 100). Only zones you own are returned. `owned` is false for a zone that is deleted. On an Ad Shop campaign the zone name is masked (\"Space #N\") and `site` / `siteid` are left out unless you hold the source-names right. Same handler as the panel. 
     * List the ad zones attached to a campaign.
     */
    async apiV1CampaignsTypeIdWhitelistZonesGetRaw(requestParameters: ApiV1CampaignsTypeIdWhitelistZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdWhitelistZonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The campaign\'s zone allow-list with each zone\'s weight for this campaign (0–100, default 100). Only zones you own are returned. `owned` is false for a zone that is deleted. On an Ad Shop campaign the zone name is masked (\"Space #N\") and `site` / `siteid` are left out unless you hold the source-names right. Same handler as the panel. 
     * List the ad zones attached to a campaign.
     */
    async apiV1CampaignsTypeIdWhitelistZonesGet(requestParameters: ApiV1CampaignsTypeIdWhitelistZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdWhitelistZonesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdZonesPost without sending the request
     */
    async apiV1CampaignsTypeIdZonesPostRequestOpts(requestParameters: ApiV1CampaignsTypeIdZonesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdZonesPost().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdZonesPost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdZonesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdZonesPostRequest',
                'Required parameter "apiV1CampaignsTypeIdZonesPostRequest" was null or undefined when calling apiV1CampaignsTypeIdZonesPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/zones`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdZonesPostRequestToJSON(requestParameters['apiV1CampaignsTypeIdZonesPostRequest']),
        };
    }

    /**
     * Adds zones to the campaign\'s allow-list (kept ones stay) and connects each zone to the campaign at weight 100. Ids that are not yours, deleted, or don\'t match the campaign\'s ad type / main category / orientation are dropped; when none is left → 403 `not_allowed`. An empty list is a no-op 200. Same handler as the panel. 
     * Attach ad zones to a campaign.
     */
    async apiV1CampaignsTypeIdZonesPostRaw(requestParameters: ApiV1CampaignsTypeIdZonesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdZonesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Adds zones to the campaign\'s allow-list (kept ones stay) and connects each zone to the campaign at weight 100. Ids that are not yours, deleted, or don\'t match the campaign\'s ad type / main category / orientation are dropped; when none is left → 403 `not_allowed`. An empty list is a no-op 200. Same handler as the panel. 
     * Attach ad zones to a campaign.
     */
    async apiV1CampaignsTypeIdZonesPost(requestParameters: ApiV1CampaignsTypeIdZonesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdZonesPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdZonesZoneIdDelete without sending the request
     */
    async apiV1CampaignsTypeIdZonesZoneIdDeleteRequestOpts(requestParameters: ApiV1CampaignsTypeIdZonesZoneIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdDelete().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdDelete().'
            );
        }

        if (requestParameters['zoneId'] == null) {
            throw new runtime.RequiredError(
                'zoneId',
                'Required parameter "zoneId" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/zones/{zoneId}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"zoneId"}}`, encodeURIComponent(String(requestParameters['zoneId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Removes the zone from the allow-list and the campaign from the zone\'s connected campaigns. Removing the last zone stores `0` (no allow-list). Detaching a zone that isn\'t attached is a 200 no-op. Same handler as the panel. 
     * Detach an ad zone from a campaign.
     */
    async apiV1CampaignsTypeIdZonesZoneIdDeleteRaw(requestParameters: ApiV1CampaignsTypeIdZonesZoneIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdZonesZoneIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Removes the zone from the allow-list and the campaign from the zone\'s connected campaigns. Removing the last zone stores `0` (no allow-list). Detaching a zone that isn\'t attached is a 200 no-op. Same handler as the panel. 
     * Detach an ad zone from a campaign.
     */
    async apiV1CampaignsTypeIdZonesZoneIdDelete(requestParameters: ApiV1CampaignsTypeIdZonesZoneIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdZonesZoneIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeIdZonesZoneIdWeightPut without sending the request
     */
    async apiV1CampaignsTypeIdZonesZoneIdWeightPutRequestOpts(requestParameters: ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdWeightPut().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdWeightPut().'
            );
        }

        if (requestParameters['zoneId'] == null) {
            throw new runtime.RequiredError(
                'zoneId',
                'Required parameter "zoneId" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdWeightPut().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest',
                'Required parameter "apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest" was null or undefined when calling apiV1CampaignsTypeIdZonesZoneIdWeightPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/{id}/zones/{zoneId}/weight`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"zoneId"}}`, encodeURIComponent(String(requestParameters['zoneId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequestToJSON(requestParameters['apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest']),
        };
    }

    /**
     * The share of the zone\'s traffic this campaign gets relative to the zone\'s other connected campaigns, 0–100 (values outside are clamped). The zone must be yours and connected to the campaign. Same handler as the panel. 
     * Set an attached zone\'s weight for this campaign.
     */
    async apiV1CampaignsTypeIdZonesZoneIdWeightPutRaw(requestParameters: ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypeIdZonesZoneIdWeightPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The share of the zone\'s traffic this campaign gets relative to the zone\'s other connected campaigns, 0–100 (values outside are clamped). The zone must be yours and connected to the campaign. Same handler as the panel. 
     * Set an attached zone\'s weight for this campaign.
     */
    async apiV1CampaignsTypeIdZonesZoneIdWeightPut(requestParameters: ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypeIdZonesZoneIdWeightPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypePost without sending the request
     */
    async apiV1CampaignsTypePostRequestOpts(requestParameters: ApiV1CampaignsTypePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypePost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypePostRequest',
                'Required parameter "apiV1CampaignsTypePostRequest" was null or undefined when calling apiV1CampaignsTypePost().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['dryRun'] != null) {
            queryParameters['dry_run'] = requestParameters['dryRun'];
        }

        if (requestParameters['strict'] != null) {
            queryParameters['strict'] = requestParameters['strict'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypePostRequestToJSON(requestParameters['apiV1CampaignsTypePostRequest']),
        };
    }

    /**
     * Creates a new campaign with sensible defaults applied for any field you don\'t send. Everything not supplied defaults to \"all/none\" — see `GET /api/v1/campaigns/{type}/_schema` for the exact field list, which **differs by `type`**.  **Per campaign type:**   - `ron` / `cpm` / `rtb` — required `name` + `ad_type`; the     request body documented below applies.   - `directdeal` — books one of your own ad zones for a date     range. Required `name` + `ad_space_id` + `start_date` +     `total_days`; `ad_type` is taken from the zone and is not     accepted. Geo targeting takes `regions` (region ids from     `/api/v1/lookups/regions`, states and cities included), the     same as the other types; the legacy `countries` codes are     still accepted when `regions` is not sent. See     `GET /api/v1/campaigns/directdeal/_schema`.   - `rtb` — also requires `request_url` (unless `use_type: 1`, a     URL per zone in `zone_urls`), and for banner campaigns     (`ad_type: 2`) `banner_size_ids`. The daily cap applies only     with `use_daily_budget: true`; there is no total budget     (exchange-paced). A user locked to one RTB network always     lands on it.  Every campaign-form field is accepted (`CampaignPanelFields`: day parting and the other options, language / connection / carrier / IP / SubID targeting, pricing extras, RTB config, offers) with the panel\'s own rules: the minimum daily budget, IP list syntax, source-optimizer ownership, and — on create — a real ad zone location for ron banner (2), ron/rtb link (6) and ron reel (20) campaigns where the network defines locations, link types or reel types (`location_ids` empty or `\"0\"` is a `422` there, as in the panel).   - `flatrate` — **not creatable through the public API** (the     legacy self-service ad-space buy is heading EOL). A POST     returns `422 unsupported_type`.  The campaign starts paused (`is_paused=true`) so you can attach ads via `POST /api/v1/campaigns/{type}/{id}/ads` and verify before activating — unless you send `is_paused`, or the network has new ron campaigns start active. On a network that reviews new campaigns, a new ron campaign also shows `pending_state: 5` (Pending Created) until an admin approves it. Flip the active flag when ready via `PATCH /api/v1/campaigns/{type}/{id}/active`.  **Modes:**   - `?dry_run=1` — validate and return the resolved field map     without inserting. Useful for previewing what an LLM would     create before charging it.   - `?strict=1` / `?strict=0` — reject / ignore unknown field names     for this request (422 `unknown_fields` listing them). Without     it the key\'s default applies: keys created from 2026-10-12 are     strict, older keys ignore unknown fields. 
     * Create a new campaign (smart-default).
     */
    async apiV1CampaignsTypePostRaw(requestParameters: ApiV1CampaignsTypePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1CampaignsTypePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new campaign with sensible defaults applied for any field you don\'t send. Everything not supplied defaults to \"all/none\" — see `GET /api/v1/campaigns/{type}/_schema` for the exact field list, which **differs by `type`**.  **Per campaign type:**   - `ron` / `cpm` / `rtb` — required `name` + `ad_type`; the     request body documented below applies.   - `directdeal` — books one of your own ad zones for a date     range. Required `name` + `ad_space_id` + `start_date` +     `total_days`; `ad_type` is taken from the zone and is not     accepted. Geo targeting takes `regions` (region ids from     `/api/v1/lookups/regions`, states and cities included), the     same as the other types; the legacy `countries` codes are     still accepted when `regions` is not sent. See     `GET /api/v1/campaigns/directdeal/_schema`.   - `rtb` — also requires `request_url` (unless `use_type: 1`, a     URL per zone in `zone_urls`), and for banner campaigns     (`ad_type: 2`) `banner_size_ids`. The daily cap applies only     with `use_daily_budget: true`; there is no total budget     (exchange-paced). A user locked to one RTB network always     lands on it.  Every campaign-form field is accepted (`CampaignPanelFields`: day parting and the other options, language / connection / carrier / IP / SubID targeting, pricing extras, RTB config, offers) with the panel\'s own rules: the minimum daily budget, IP list syntax, source-optimizer ownership, and — on create — a real ad zone location for ron banner (2), ron/rtb link (6) and ron reel (20) campaigns where the network defines locations, link types or reel types (`location_ids` empty or `\"0\"` is a `422` there, as in the panel).   - `flatrate` — **not creatable through the public API** (the     legacy self-service ad-space buy is heading EOL). A POST     returns `422 unsupported_type`.  The campaign starts paused (`is_paused=true`) so you can attach ads via `POST /api/v1/campaigns/{type}/{id}/ads` and verify before activating — unless you send `is_paused`, or the network has new ron campaigns start active. On a network that reviews new campaigns, a new ron campaign also shows `pending_state: 5` (Pending Created) until an admin approves it. Flip the active flag when ready via `PATCH /api/v1/campaigns/{type}/{id}/active`.  **Modes:**   - `?dry_run=1` — validate and return the resolved field map     without inserting. Useful for previewing what an LLM would     create before charging it.   - `?strict=1` / `?strict=0` — reject / ignore unknown field names     for this request (422 `unknown_fields` listing them). Without     it the key\'s default applies: keys created from 2026-10-12 are     strict, older keys ignore unknown fields. 
     * Create a new campaign (smart-default).
     */
    async apiV1CampaignsTypePost(requestParameters: ApiV1CampaignsTypePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1CampaignsTypePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1CampaignsTypeSchemaAdsGet without sending the request
     */
    async apiV1CampaignsTypeSchemaAdsGetRequestOpts(requestParameters: ApiV1CampaignsTypeSchemaAdsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeSchemaAdsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/_schema/ads`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Discovery endpoint mirroring `/_schema` for campaigns, scoped to ads. Lists every public field a `POST /campaigns/{type}/{campaignId}/ads` accepts, with type, required-flag, default, example, and description. Also returns a `creative_choice` block reminding the caller that exactly one of `banner_pool_id` / `creative_id` / `banner_url` / `banner_html` / `video_pool_id` must be set.  Use the campaign-scoped variant `/api/v1/campaigns/{type}/{campaignId}/_schema/ads` to get the same payload narrowed to fields that apply to that specific campaign\'s ad type (returns `campaign_ad_type` so AI agents know which creative shape is appropriate). For native ad types (`campaign_ad_type` 3 / 21 / 22) the canonical URL field is `native_image_url`; `banner_url` works too because the server auto-routes it to `creatives.image` on a native campaign. 
     * Field metadata for ad creation.
     */
    async apiV1CampaignsTypeSchemaAdsGetRaw(requestParameters: ApiV1CampaignsTypeSchemaAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeSchemaAdsGet200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeSchemaAdsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeSchemaAdsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Discovery endpoint mirroring `/_schema` for campaigns, scoped to ads. Lists every public field a `POST /campaigns/{type}/{campaignId}/ads` accepts, with type, required-flag, default, example, and description. Also returns a `creative_choice` block reminding the caller that exactly one of `banner_pool_id` / `creative_id` / `banner_url` / `banner_html` / `video_pool_id` must be set.  Use the campaign-scoped variant `/api/v1/campaigns/{type}/{campaignId}/_schema/ads` to get the same payload narrowed to fields that apply to that specific campaign\'s ad type (returns `campaign_ad_type` so AI agents know which creative shape is appropriate). For native ad types (`campaign_ad_type` 3 / 21 / 22) the canonical URL field is `native_image_url`; `banner_url` works too because the server auto-routes it to `creatives.image` on a native campaign. 
     * Field metadata for ad creation.
     */
    async apiV1CampaignsTypeSchemaAdsGet(requestParameters: ApiV1CampaignsTypeSchemaAdsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeSchemaAdsGet200Response> {
        const response = await this.apiV1CampaignsTypeSchemaAdsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1CampaignsTypeSchemaGet without sending the request
     */
    async apiV1CampaignsTypeSchemaGetRequestOpts(requestParameters: ApiV1CampaignsTypeSchemaGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1CampaignsTypeSchemaGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['adType'] != null) {
            queryParameters['ad_type'] = requestParameters['adType'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/campaigns/{type}/_schema`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Discovery endpoint for AI agents and integrators. Returns the canonical list of public field names a `POST /api/v1/campaigns/{type}` accepts, with type, required-flag, default value, an example, and a one-line description. `ad_type` enumerates the active ad-type ids on the caller\'s tenant.  The field set differs by `type` — `directdeal` returns its own ad-zone-booking fields (`ad_space_id`, `start_date`, `total_days`, …), not the RON-shaped targeting fields. `flatrate` is not creatable through the public API: its `_schema` returns `{creatable: false}` instead of a field list.  For `ron` / `cpm` / `rtb` the list is built from the campaign table\'s real columns and the network\'s modules: a field the type cannot store (keywords or schedule dates on rtb, total budget on rtb) or the network does not offer is not listed. It is exactly the set `?strict=1` accepts on **both** `POST` and `PATCH`. `ad_types` / `selling_types` / `not_selling_types` on a field mean it only applies to those ad types / pay types; sending it to any other campaign is a `422`. `?ad_type=<id>` narrows the list to one ad type.  Use this to drive form UIs, validate agent-generated payloads client-side, or feed into a function-calling LLM. 
     * Field metadata for create/update.
     */
    async apiV1CampaignsTypeSchemaGetRaw(requestParameters: ApiV1CampaignsTypeSchemaGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1CampaignsTypeSchemaGet200Response>> {
        const requestOptions = await this.apiV1CampaignsTypeSchemaGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1CampaignsTypeSchemaGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Discovery endpoint for AI agents and integrators. Returns the canonical list of public field names a `POST /api/v1/campaigns/{type}` accepts, with type, required-flag, default value, an example, and a one-line description. `ad_type` enumerates the active ad-type ids on the caller\'s tenant.  The field set differs by `type` — `directdeal` returns its own ad-zone-booking fields (`ad_space_id`, `start_date`, `total_days`, …), not the RON-shaped targeting fields. `flatrate` is not creatable through the public API: its `_schema` returns `{creatable: false}` instead of a field list.  For `ron` / `cpm` / `rtb` the list is built from the campaign table\'s real columns and the network\'s modules: a field the type cannot store (keywords or schedule dates on rtb, total budget on rtb) or the network does not offer is not listed. It is exactly the set `?strict=1` accepts on **both** `POST` and `PATCH`. `ad_types` / `selling_types` / `not_selling_types` on a field mean it only applies to those ad types / pay types; sending it to any other campaign is a `422`. `?ad_type=<id>` narrows the list to one ad type.  Use this to drive form UIs, validate agent-generated payloads client-side, or feed into a function-calling LLM. 
     * Field metadata for create/update.
     */
    async apiV1CampaignsTypeSchemaGet(requestParameters: ApiV1CampaignsTypeSchemaGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1CampaignsTypeSchemaGet200Response> {
        const response = await this.apiV1CampaignsTypeSchemaGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1RtbTestRtbContextGet without sending the request
     */
    async apiV1RtbTestRtbContextGetRequestOpts(requestParameters: ApiV1RtbTestRtbContextGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['adtypeid'] != null) {
            queryParameters['adtypeid'] = requestParameters['adtypeid'];
        }

        if (requestParameters['rtbtype'] != null) {
            queryParameters['rtbtype'] = requestParameters['rtbtype'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/rtb/test-rtb/context`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Same as the per-campaign context, for an unsaved endpoint — resolves `adtypeid` to the bid-request ad type. Same handler as the panel.
     * Context for testing an endpoint before the campaign exists.
     */
    async apiV1RtbTestRtbContextGetRaw(requestParameters: ApiV1RtbTestRtbContextGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1RtbTestRtbContextGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Same as the per-campaign context, for an unsaved endpoint — resolves `adtypeid` to the bid-request ad type. Same handler as the panel.
     * Context for testing an endpoint before the campaign exists.
     */
    async apiV1RtbTestRtbContextGet(requestParameters: ApiV1RtbTestRtbContextGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1RtbTestRtbContextGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1RtbTestRtbPost without sending the request
     */
    async apiV1RtbTestRtbPostRequestOpts(requestParameters: ApiV1RtbTestRtbPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1RtbTestRtbPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1RtbTestRtbPostRequest',
                'Required parameter "apiV1RtbTestRtbPostRequest" was null or undefined when calling apiV1RtbTestRtbPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/rtb/test-rtb`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1RtbTestRtbPostRequestToJSON(requestParameters['apiV1RtbTestRtbPostRequest']),
        };
    }

    /**
     * The tester for an endpoint you are about to save on an RTB campaign: `url` (or `override_url`) + `rtbtype` + `adtypeid` come from the body instead of a campaign. Same safety rules and result as `POST /api/v1/campaigns/rtb/{id}/test-rtb`. Same handler as the panel. 
     * Fire a test bid request at any endpoint URL.
     */
    async apiV1RtbTestRtbPostRaw(requestParameters: ApiV1RtbTestRtbPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RtbTestResult>> {
        const requestOptions = await this.apiV1RtbTestRtbPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RtbTestResultFromJSON(jsonValue));
    }

    /**
     * The tester for an endpoint you are about to save on an RTB campaign: `url` (or `override_url`) + `rtbtype` + `adtypeid` come from the body instead of a campaign. Same safety rules and result as `POST /api/v1/campaigns/rtb/{id}/test-rtb`. Same handler as the panel. 
     * Fire a test bid request at any endpoint URL.
     */
    async apiV1RtbTestRtbPost(requestParameters: ApiV1RtbTestRtbPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RtbTestResult> {
        const response = await this.apiV1RtbTestRtbPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1ToolsReplaceDomainPut without sending the request
     */
    async apiV1ToolsReplaceDomainPutRequestOpts(requestParameters: ApiV1ToolsReplaceDomainPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1ToolsReplaceDomainPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1ToolsReplaceDomainPutRequest',
                'Required parameter "apiV1ToolsReplaceDomainPutRequest" was null or undefined when calling apiV1ToolsReplaceDomainPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tools/replace-domain`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1ToolsReplaceDomainPutRequestToJSON(requestParameters['apiV1ToolsReplaceDomainPutRequest']),
        };
    }

    /**
     * The panel\'s Tools → Replace domain: in every live RON ad whose destination URL contains `search`, the first occurrence is replaced with `replace` (a domain). `campaignids` narrows it to those campaigns; empty = every RON ad of the account. A key pinned to campaigns must list `campaignids`, all within its pin (403 `forbidden_resource` otherwise).  Same safeguards as a single-ad save: a resulting URL on a blocked domain fails the whole call before anything is written, and the changed ads go back to review unless the account is auto-validated. 
     * Replace the landing domain across your RON ads.
     */
    async apiV1ToolsReplaceDomainPutRaw(requestParameters: ApiV1ToolsReplaceDomainPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1ToolsReplaceDomainPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The panel\'s Tools → Replace domain: in every live RON ad whose destination URL contains `search`, the first occurrence is replaced with `replace` (a domain). `campaignids` narrows it to those campaigns; empty = every RON ad of the account. A key pinned to campaigns must list `campaignids`, all within its pin (403 `forbidden_resource` otherwise).  Same safeguards as a single-ad save: a resulting URL on a blocked domain fails the whole call before anything is written, and the changed ads go back to review unless the account is auto-validated. 
     * Replace the landing domain across your RON ads.
     */
    async apiV1ToolsReplaceDomainPut(requestParameters: ApiV1ToolsReplaceDomainPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ToolsReplaceDomainPutRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationTypeEnum = {
    Bidding: 'bidding',
    State: 'state'
} as const;
export type ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationTypeEnum = typeof ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationTypeEnum[keyof typeof ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsGetTypeEnum = {
    All: 'all',
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsGetTypeEnum = typeof ApiV1CampaignsGetTypeEnum[keyof typeof ApiV1CampaignsGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationTypeEnum = {
    Ron: 'ron'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationTypeEnum = {
    Ron: 'ron'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdGetTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdGetTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetTypeEnum = {
    Ron: 'ron'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutTypeEnum = {
    Ron: 'ron'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsCsvImportPostTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsCsvImportPostTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsCsvImportPostFolderPerGroupEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsCsvImportPostFolderPerGroupEnum = typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostFolderPerGroupEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostFolderPerGroupEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSquareModeEnum = {
    Pad: 'pad',
    Crop: 'crop',
    None: 'none'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSquareModeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSquareModeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSquareModeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsCsvImportPostCropSquareEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsCsvImportPostCropSquareEnum = typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostCropSquareEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostCropSquareEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSetActiveEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSetActiveEnum = typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSetActiveEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsCsvImportPostSetActiveEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsGetTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsGetTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsGetAdStateEnum = {
    _1: '1',
    _2: '2',
    _3: '3'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsGetAdStateEnum = typeof ApiV1CampaignsTypeCampaignIdAdsGetAdStateEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsGetAdStateEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsGetSortByEnum = {
    Id: 'id',
    Title: 'title',
    Bid: 'bid',
    UserBid: 'user_bid',
    Isactive: 'isactive',
    SortWeight: 'sort_weight',
    Position: 'position'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsGetSortByEnum = typeof ApiV1CampaignsTypeCampaignIdAdsGetSortByEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsGetSortByEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsGetSortDirEnum = typeof ApiV1CampaignsTypeCampaignIdAdsGetSortDirEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsGetSortDirEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostUseOverlaysEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostUseOverlaysEnum = typeof ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostUseOverlaysEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostUseOverlaysEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostClonePerOverlayEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostClonePerOverlayEnum = typeof ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostClonePerOverlayEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostClonePerOverlayEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsPostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsPostOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsPostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsPostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsPostOperationDryRunEnum = {
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsPostOperationDryRunEnum = typeof ApiV1CampaignsTypeCampaignIdAdsPostOperationDryRunEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsPostOperationDryRunEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsPostOperationStrictEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsPostOperationStrictEnum = typeof ApiV1CampaignsTypeCampaignIdAdsPostOperationStrictEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsPostOperationStrictEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationTypeEnum = {
    Ron: 'ron'
} as const;
export type ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationTypeEnum = typeof ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeCampaignIdSchemaAdsGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeCampaignIdSchemaAdsGetTypeEnum = typeof ApiV1CampaignsTypeCampaignIdSchemaAdsGetTypeEnum[keyof typeof ApiV1CampaignsTypeCampaignIdSchemaAdsGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdActivePatchOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdActivePatchOperationTypeEnum = typeof ApiV1CampaignsTypeIdActivePatchOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdActivePatchOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdAvailableZonesGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdAvailableZonesGetTypeEnum = typeof ApiV1CampaignsTypeIdAvailableZonesGetTypeEnum[keyof typeof ApiV1CampaignsTypeIdAvailableZonesGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdBidsPatchOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdBidsPatchOperationTypeEnum = typeof ApiV1CampaignsTypeIdBidsPatchOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdBidsPatchOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdBudgetPatchOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdBudgetPatchOperationTypeEnum = typeof ApiV1CampaignsTypeIdBudgetPatchOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdBudgetPatchOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdClonePostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdClonePostOperationTypeEnum = typeof ApiV1CampaignsTypeIdClonePostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdClonePostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdClonePostOperationStrictEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1CampaignsTypeIdClonePostOperationStrictEnum = typeof ApiV1CampaignsTypeIdClonePostOperationStrictEnum[keyof typeof ApiV1CampaignsTypeIdClonePostOperationStrictEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdDeleteTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdDeleteTypeEnum = typeof ApiV1CampaignsTypeIdDeleteTypeEnum[keyof typeof ApiV1CampaignsTypeIdDeleteTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteTypeEnum = typeof ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteTypeEnum[keyof typeof ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdFiltersGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdFiltersGetTypeEnum = typeof ApiV1CampaignsTypeIdFiltersGetTypeEnum[keyof typeof ApiV1CampaignsTypeIdFiltersGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdFiltersPostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdFiltersPostOperationTypeEnum = typeof ApiV1CampaignsTypeIdFiltersPostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdFiltersPostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdGetTypeEnum = typeof ApiV1CampaignsTypeIdGetTypeEnum[keyof typeof ApiV1CampaignsTypeIdGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdMinBidGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdMinBidGetTypeEnum = typeof ApiV1CampaignsTypeIdMinBidGetTypeEnum[keyof typeof ApiV1CampaignsTypeIdMinBidGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdPatchOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdPatchOperationTypeEnum = typeof ApiV1CampaignsTypeIdPatchOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdPatchOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdPatchOperationDryRunEnum = {
    _1: '1'
} as const;
export type ApiV1CampaignsTypeIdPatchOperationDryRunEnum = typeof ApiV1CampaignsTypeIdPatchOperationDryRunEnum[keyof typeof ApiV1CampaignsTypeIdPatchOperationDryRunEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdPatchOperationStrictEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypeIdPatchOperationStrictEnum = typeof ApiV1CampaignsTypeIdPatchOperationStrictEnum[keyof typeof ApiV1CampaignsTypeIdPatchOperationStrictEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdResetMaxBudgetPutTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeIdResetMaxBudgetPutTypeEnum = typeof ApiV1CampaignsTypeIdResetMaxBudgetPutTypeEnum[keyof typeof ApiV1CampaignsTypeIdResetMaxBudgetPutTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdSitesGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdSitesGetTypeEnum = typeof ApiV1CampaignsTypeIdSitesGetTypeEnum[keyof typeof ApiV1CampaignsTypeIdSitesGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdWhitelistZonesGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdWhitelistZonesGetTypeEnum = typeof ApiV1CampaignsTypeIdWhitelistZonesGetTypeEnum[keyof typeof ApiV1CampaignsTypeIdWhitelistZonesGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdZonesPostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdZonesPostOperationTypeEnum = typeof ApiV1CampaignsTypeIdZonesPostOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdZonesPostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdZonesZoneIdDeleteTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdZonesZoneIdDeleteTypeEnum = typeof ApiV1CampaignsTypeIdZonesZoneIdDeleteTypeEnum[keyof typeof ApiV1CampaignsTypeIdZonesZoneIdDeleteTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm'
} as const;
export type ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationTypeEnum = typeof ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationTypeEnum[keyof typeof ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypePostOperationTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypePostOperationTypeEnum = typeof ApiV1CampaignsTypePostOperationTypeEnum[keyof typeof ApiV1CampaignsTypePostOperationTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypePostOperationDryRunEnum = {
    _1: '1'
} as const;
export type ApiV1CampaignsTypePostOperationDryRunEnum = typeof ApiV1CampaignsTypePostOperationDryRunEnum[keyof typeof ApiV1CampaignsTypePostOperationDryRunEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypePostOperationStrictEnum = {
    _0: '0',
    _1: '1'
} as const;
export type ApiV1CampaignsTypePostOperationStrictEnum = typeof ApiV1CampaignsTypePostOperationStrictEnum[keyof typeof ApiV1CampaignsTypePostOperationStrictEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeSchemaAdsGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeSchemaAdsGetTypeEnum = typeof ApiV1CampaignsTypeSchemaAdsGetTypeEnum[keyof typeof ApiV1CampaignsTypeSchemaAdsGetTypeEnum];
/**
 * @export
 */
export const ApiV1CampaignsTypeSchemaGetTypeEnum = {
    Ron: 'ron',
    Cpm: 'cpm',
    Flatrate: 'flatrate',
    Directdeal: 'directdeal',
    Rtb: 'rtb'
} as const;
export type ApiV1CampaignsTypeSchemaGetTypeEnum = typeof ApiV1CampaignsTypeSchemaGetTypeEnum[keyof typeof ApiV1CampaignsTypeSchemaGetTypeEnum];
/**
 * @export
 */
export const ApiV1RtbTestRtbContextGetRtbtypeEnum = {
    Openrtb: 'openrtb',
    Json: 'json',
    JsonBidder: 'json_bidder',
    Xml: 'xml'
} as const;
export type ApiV1RtbTestRtbContextGetRtbtypeEnum = typeof ApiV1RtbTestRtbContextGetRtbtypeEnum[keyof typeof ApiV1RtbTestRtbContextGetRtbtypeEnum];
