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
  ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest,
  ApiV1AdspacesIdMediaBuyingBlockPostRequest,
  ApiV1AdspacesIdMediaBuyingIpsPostRequest,
  ApiV1AdspacesIdMediaBuyingLaunchPostRequest,
  ApiV1AdspacesIdMediaBuyingReportPostRequest,
  ApiV1AdspacesIdMediaBuyingSourceBidPutRequest,
  ApiV1AdspacesIdMediaBuyingTargetingPutRequest,
  ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest,
  ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest,
  ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest,
  ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest,
  ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest,
  ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest,
  MediaBuyingPolicy,
} from '../models/index';
import {
    ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequestToJSON,
    ApiV1AdspacesIdMediaBuyingBlockPostRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingBlockPostRequestToJSON,
    ApiV1AdspacesIdMediaBuyingIpsPostRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingIpsPostRequestToJSON,
    ApiV1AdspacesIdMediaBuyingLaunchPostRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingLaunchPostRequestToJSON,
    ApiV1AdspacesIdMediaBuyingReportPostRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingReportPostRequestToJSON,
    ApiV1AdspacesIdMediaBuyingSourceBidPutRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingSourceBidPutRequestToJSON,
    ApiV1AdspacesIdMediaBuyingTargetingPutRequestFromJSON,
    ApiV1AdspacesIdMediaBuyingTargetingPutRequestToJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequestFromJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequestToJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequestFromJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequestFromJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequestFromJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequestFromJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequestToJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequestFromJSON,
    ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequestToJSON,
    MediaBuyingPolicyFromJSON,
    MediaBuyingPolicyToJSON,
} from '../models/index';

export interface ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostOperationRequest {
    id: number;
    actionId: number;
    apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest: ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest;
}

export interface ApiV1AdspacesIdMediaBuyingActionsGetRequest {
    id: number;
    status?: string;
    actor?: string;
    action?: string;
    zone?: string;
    from?: string;
    to?: string;
    limit?: number;
    format?: string;
}

export interface ApiV1AdspacesIdMediaBuyingAgentRunPostRequest {
    id: number;
    body?: object;
}

export interface ApiV1AdspacesIdMediaBuyingAgentRunsGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingBlockPostOperationRequest {
    id: number;
    apiV1AdspacesIdMediaBuyingBlockPostRequest: ApiV1AdspacesIdMediaBuyingBlockPostRequest;
}

export interface ApiV1AdspacesIdMediaBuyingCompareGetRequest {
    id: number;
    _with?: number;
    days?: number;
}

export interface ApiV1AdspacesIdMediaBuyingGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingIpsGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingIpsPostOperationRequest {
    id: number;
    apiV1AdspacesIdMediaBuyingIpsPostRequest: ApiV1AdspacesIdMediaBuyingIpsPostRequest;
}

export interface ApiV1AdspacesIdMediaBuyingLaunchGetRequest {
    id: number;
    adnetworkId?: number;
}

export interface ApiV1AdspacesIdMediaBuyingLaunchPostOperationRequest {
    id: number;
    apiV1AdspacesIdMediaBuyingLaunchPostRequest: ApiV1AdspacesIdMediaBuyingLaunchPostRequest;
}

export interface ApiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequest {
    id: number;
    adnetworkId?: number;
}

export interface ApiV1AdspacesIdMediaBuyingNetworkBudgetGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingPolicyPutRequest {
    id: number;
    mediaBuyingPolicy: Omit<MediaBuyingPolicy, 'inherit_blocks'>;
}

export interface ApiV1AdspacesIdMediaBuyingPolicySuggestGetRequest {
    id: number;
    preset?: ApiV1AdspacesIdMediaBuyingPolicySuggestGetPresetEnum;
}

export interface ApiV1AdspacesIdMediaBuyingReportPostOperationRequest {
    id: number;
    apiV1AdspacesIdMediaBuyingReportPostRequest: ApiV1AdspacesIdMediaBuyingReportPostRequest;
}

export interface ApiV1AdspacesIdMediaBuyingSegmentsGetRequest {
    id: number;
    dim?: string;
    refresh?: string;
}

export interface ApiV1AdspacesIdMediaBuyingSourceBidGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingSourceBidPutOperationRequest {
    id: number;
    apiV1AdspacesIdMediaBuyingSourceBidPutRequest: ApiV1AdspacesIdMediaBuyingSourceBidPutRequest;
}

export interface ApiV1AdspacesIdMediaBuyingSourceRetryPostRequest {
    id: number;
    body?: object;
}

export interface ApiV1AdspacesIdMediaBuyingTargetingGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingTargetingPutOperationRequest {
    id: number;
    apiV1AdspacesIdMediaBuyingTargetingPutRequest: ApiV1AdspacesIdMediaBuyingTargetingPutRequest;
}

export interface ApiV1AdspacesIdMediaBuyingTargetingSuggestGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingTrackRecordGetRequest {
    id: number;
}

export interface ApiV1AdspacesIdMediaBuyingZonesGetRequest {
    id: number;
    days?: number;
    revenueMetric?: string;
}

export interface ApiV1MediaBuyingPortfolioGetRequest {
    days?: number;
}

export interface ApiV1TrackerMediaBuyingPortfolioGetRequest {
    days?: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostOperationRequest {
    id: number;
    actionId: number;
    apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest: ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequest {
    id: number;
    status?: string;
    actor?: string;
    action?: string;
    zone?: string;
    from?: string;
    to?: string;
    limit?: number;
    format?: string;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequest {
    id: number;
    body?: object;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest: ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequest {
    id: number;
    _with?: number;
    days?: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest: ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequest {
    id: number;
    mediaBuyingPolicy: Omit<MediaBuyingPolicy, 'inherit_blocks'>;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequest {
    id: number;
    preset?: ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetPresetEnum;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingReportPostOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest: ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequest {
    id: number;
    dim?: string;
    refresh?: string;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequest {
    id: number;
    body?: object;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequest {
    id: number;
    days?: number;
    revenueMetric?: string;
}

/**
 * 
 */
export class AgenticMediaBuyingApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost().'
            );
        }

        if (requestParameters['actionId'] == null) {
            throw new runtime.RequiredError(
                'actionId',
                'Required parameter "actionId" was null or undefined when calling apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/actions/{actionId}/decide`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"actionId"}}`, encodeURIComponent(String(requestParameters['actionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest']),
        };
    }

    /**
     * Approving carries the proposal out at the network (a block, a bid, a budget, a segment exclusion). Approving an `expand_country` proposal (ad zones only) duplicates the ad zone — linked campaigns, own ads, settings, buying policy — and launches its own network campaign for that one country at the proposed bid and test budget, with the source zone\'s quality blocks as its blacklist; answers `{id, action, status, zone_id, new_spaceid, launch}`; a failure removes the duplicate again (422).
     * Approve or reject a proposal.
     */
    async apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Approving carries the proposal out at the network (a block, a bid, a budget, a segment exclusion). Approving an `expand_country` proposal (ad zones only) duplicates the ad zone — linked campaigns, own ads, settings, buying policy — and launches its own network campaign for that one country at the proposed bid and test budget, with the source zone\'s quality blocks as its blacklist; answers `{id, action, status, zone_id, new_spaceid, launch}`; a failure removes the duplicate again (422).
     * Approve or reject a proposal.
     */
    async apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost(requestParameters: ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingActionsGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingActionsGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingActionsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingActionsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['actor'] != null) {
            queryParameters['actor'] = requestParameters['actor'];
        }

        if (requestParameters['action'] != null) {
            queryParameters['action'] = requestParameters['action'];
        }

        if (requestParameters['zone'] != null) {
            queryParameters['zone'] = requestParameters['zone'];
        }

        if (requestParameters['from'] != null) {
            queryParameters['from'] = requestParameters['from'];
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = requestParameters['to'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/actions`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Newest first. A `bid_change` on a network with a bid per country carries `metrics.countries` [{country, pct, old, new, margin, cost, revenue}].
     * Activity log: every block, bid, budget and other change, and open proposals.
     */
    async apiV1AdspacesIdMediaBuyingActionsGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingActionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingActionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Newest first. A `bid_change` on a network with a bid per country carries `metrics.countries` [{country, pct, old, new, margin, cost, revenue}].
     * Activity log: every block, bid, budget and other change, and open proposals.
     */
    async apiV1AdspacesIdMediaBuyingActionsGet(requestParameters: ApiV1AdspacesIdMediaBuyingActionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingActionsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingAgentRunPost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingAgentRunPostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingAgentRunPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingAgentRunPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/agent/run`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        };
    }

    /**
     * At most once per 10 minutes per zone (429 `too_soon`). Refused while the zone is switched off. Returns the new run.
     * Run the buying agent now.
     */
    async apiV1AdspacesIdMediaBuyingAgentRunPostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingAgentRunPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingAgentRunPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * At most once per 10 minutes per zone (429 `too_soon`). Refused while the zone is switched off. Returns the new run.
     * Run the buying agent now.
     */
    async apiV1AdspacesIdMediaBuyingAgentRunPost(requestParameters: ApiV1AdspacesIdMediaBuyingAgentRunPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingAgentRunPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingAgentRunsGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingAgentRunsGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingAgentRunsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingAgentRunsGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/agent/runs`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The buying agent\'s recent runs with their summaries and proposals.
     */
    async apiV1AdspacesIdMediaBuyingAgentRunsGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingAgentRunsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingAgentRunsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The buying agent\'s recent runs with their summaries and proposals.
     */
    async apiV1AdspacesIdMediaBuyingAgentRunsGet(requestParameters: ApiV1AdspacesIdMediaBuyingAgentRunsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingAgentRunsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingBlockPost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingBlockPostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingBlockPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingBlockPost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingBlockPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingBlockPostRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingBlockPostRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingBlockPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/block`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingBlockPostRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingBlockPostRequest']),
        };
    }

    /**
     * Writes the change to the network campaign right away and logs it as a manual action. 502 when the network refuses.
     * Block or unblock one source zone at the network.
     */
    async apiV1AdspacesIdMediaBuyingBlockPostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingBlockPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingBlockPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Writes the change to the network campaign right away and logs it as a manual action. 502 when the network refuses.
     * Block or unblock one source zone at the network.
     */
    async apiV1AdspacesIdMediaBuyingBlockPost(requestParameters: ApiV1AdspacesIdMediaBuyingBlockPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingBlockPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingCompareGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingCompareGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingCompareGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingCompareGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['_with'] != null) {
            queryParameters['with'] = requestParameters['_with'];
        }

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/compare`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * This buy against another of yours over the same days (default: its control — policy `control_for` — or the buy it is the control of). Per buy: revenue, network cost, profit, margin, profit and volume per day, and each day\'s figures. Verdict: a paired test on the daily margins — `a_better` / `b_better` (a = this buy) only when the mean difference is at least twice its standard error over at least 5 days with revenue on both sides, else `too_close` or `too_little_data`; `note` says it in a sentence. Database only, no network call.
     * Compare with another buy (A/B, e.g. against a control left to the network\'s own optimiser).
     */
    async apiV1AdspacesIdMediaBuyingCompareGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingCompareGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingCompareGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * This buy against another of yours over the same days (default: its control — policy `control_for` — or the buy it is the control of). Per buy: revenue, network cost, profit, margin, profit and volume per day, and each day\'s figures. Verdict: a paired test on the daily margins — `a_better` / `b_better` (a = this buy) only when the mean difference is at least twice its standard error over at least 5 days with revenue on both sides, else `too_close` or `too_little_data`; `note` says it in a sentence. Database only, no network call.
     * Compare with another buy (A/B, e.g. against a control left to the network\'s own optimiser).
     */
    async apiV1AdspacesIdMediaBuyingCompareGet(requestParameters: ApiV1AdspacesIdMediaBuyingCompareGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingCompareGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Everything the panel shows before the report: network and campaign, capability flags (`supports_*`; `supports_country_bids` = the campaign bid is an absolute bid per country, judged and moved per country), the URL suffix that captures the source zone id (`capture`), the stored `policy`, `pending_proposals`, the source campaign state and `owner_gets_report`. 404 when the ad space is not connected to an external network campaign.
     * Overview: the connected network, what it supports, the policy and open proposals.
     */
    async apiV1AdspacesIdMediaBuyingGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Everything the panel shows before the report: network and campaign, capability flags (`supports_*`; `supports_country_bids` = the campaign bid is an absolute bid per country, judged and moved per country), the URL suffix that captures the source zone id (`capture`), the stored `policy`, `pending_proposals`, the source campaign state and `owner_gets_report`. 404 when the ad space is not connected to an external network campaign.
     * Overview: the connected network, what it supports, the policy and open proposals.
     */
    async apiV1AdspacesIdMediaBuyingGet(requestParameters: ApiV1AdspacesIdMediaBuyingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingIpsGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingIpsGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingIpsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingIpsGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/ips`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The IP preblock list: ranges on the network\'s exclusion list and proposals.
     */
    async apiV1AdspacesIdMediaBuyingIpsGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingIpsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingIpsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The IP preblock list: ranges on the network\'s exclusion list and proposals.
     */
    async apiV1AdspacesIdMediaBuyingIpsGet(requestParameters: ApiV1AdspacesIdMediaBuyingIpsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingIpsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingIpsPost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingIpsPostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingIpsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingIpsPost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingIpsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingIpsPostRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingIpsPostRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingIpsPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/ips`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingIpsPostRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingIpsPostRequest']),
        };
    }

    /**
     * `add` blocks the given ranges now, `approve` / `reject` decide proposals, `remove` takes ranges off, `refresh` builds the list now (no `cidrs`).
     * Change the IP preblock list.
     */
    async apiV1AdspacesIdMediaBuyingIpsPostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingIpsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingIpsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `add` blocks the given ranges now, `approve` / `reject` decide proposals, `remove` takes ranges off, `refresh` builds the list now (no `cidrs`).
     * Change the IP preblock list.
     */
    async apiV1AdspacesIdMediaBuyingIpsPost(requestParameters: ApiV1AdspacesIdMediaBuyingIpsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingIpsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingLaunchGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingLaunchGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingLaunchGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['adnetworkId'] != null) {
            queryParameters['adnetwork_id'] = requestParameters['adnetworkId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/launch`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Without `adnetwork_id`: the network accounts that can launch. With it: that network\'s launch options (formats, countries, minimum bids).
     * What a new campaign can be launched with (unconnected ad zones).
     */
    async apiV1AdspacesIdMediaBuyingLaunchGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingLaunchGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Without `adnetwork_id`: the network accounts that can launch. With it: that network\'s launch options (formats, countries, minimum bids).
     * What a new campaign can be launched with (unconnected ad zones).
     */
    async apiV1AdspacesIdMediaBuyingLaunchGet(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingLaunchGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingLaunchPost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingLaunchPostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingLaunchPost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingLaunchPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingLaunchPostRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingLaunchPostRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingLaunchPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/launch`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingLaunchPostRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingLaunchPostRequest']),
        };
    }

    /**
     * Files the create request; once the network approves it the campaign is connected to the zone (auto pause/activate on).
     * Launch a new campaign at the network for this ad zone.
     */
    async apiV1AdspacesIdMediaBuyingLaunchPostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingLaunchPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Files the create request; once the network approves it the campaign is connected to the zone (auto pause/activate on).
     * Launch a new campaign at the network for this ad zone.
     */
    async apiV1AdspacesIdMediaBuyingLaunchPost(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingLaunchPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingLaunchTemplatesGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingLaunchTemplatesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['adnetworkId'] != null) {
            queryParameters['adnetwork_id'] = requestParameters['adnetworkId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/launch/templates`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Existing campaigns that can be cloned for a launch.
     */
    async apiV1AdspacesIdMediaBuyingLaunchTemplatesGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Existing campaigns that can be cloned for a launch.
     */
    async apiV1AdspacesIdMediaBuyingLaunchTemplatesGet(requestParameters: ApiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingLaunchTemplatesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingNetworkBudgetGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingNetworkBudgetGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingNetworkBudgetGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingNetworkBudgetGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/network-budget`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s daily budget at the network.
     */
    async apiV1AdspacesIdMediaBuyingNetworkBudgetGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingNetworkBudgetGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingNetworkBudgetGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The campaign\'s daily budget at the network.
     */
    async apiV1AdspacesIdMediaBuyingNetworkBudgetGet(requestParameters: ApiV1AdspacesIdMediaBuyingNetworkBudgetGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingNetworkBudgetGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingPolicyPut without sending the request
     */
    async apiV1AdspacesIdMediaBuyingPolicyPutRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingPolicyPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingPolicyPut().'
            );
        }

        if (requestParameters['mediaBuyingPolicy'] == null) {
            throw new runtime.RequiredError(
                'mediaBuyingPolicy',
                'Required parameter "mediaBuyingPolicy" was null or undefined when calling apiV1AdspacesIdMediaBuyingPolicyPut().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/policy`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: MediaBuyingPolicyToJSON(requestParameters['mediaBuyingPolicy']),
        };
    }

    /**
     * Fields left out keep their stored value. Returns the stored, normalized policy.
     * Save the buying policy (any subset of its fields).
     */
    async apiV1AdspacesIdMediaBuyingPolicyPutRaw(requestParameters: ApiV1AdspacesIdMediaBuyingPolicyPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingPolicyPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Fields left out keep their stored value. Returns the stored, normalized policy.
     * Save the buying policy (any subset of its fields).
     */
    async apiV1AdspacesIdMediaBuyingPolicyPut(requestParameters: ApiV1AdspacesIdMediaBuyingPolicyPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingPolicyPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingPolicySuggestGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingPolicySuggestGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingPolicySuggestGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingPolicySuggestGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['preset'] != null) {
            queryParameters['preset'] = requestParameters['preset'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/policy/suggest`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Nothing is saved. `data.policy` is the full suggested policy; `data.suggestions` lists `{field, value, why}`; with `preset` the preset\'s own changes follow, each with its reason.
     * Suggested policy from the zone\'s own traffic, with a reason per field.
     */
    async apiV1AdspacesIdMediaBuyingPolicySuggestGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingPolicySuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingPolicySuggestGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Nothing is saved. `data.policy` is the full suggested policy; `data.suggestions` lists `{field, value, why}`; with `preset` the preset\'s own changes follow, each with its reason.
     * Suggested policy from the zone\'s own traffic, with a reason per field.
     */
    async apiV1AdspacesIdMediaBuyingPolicySuggestGet(requestParameters: ApiV1AdspacesIdMediaBuyingPolicySuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingPolicySuggestGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingReportPost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingReportPostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingReportPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingReportPost().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingReportPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingReportPostRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingReportPostRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingReportPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/report`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingReportPostRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingReportPostRequest']),
        };
    }

    /**
     * The same report the daily / weekly schedule sends: to the admins\' notification event and, where the owner runs the buy (admanager, tracking links), the owner\'s email and the `media_buying.report` event. Returns the report and where it went.
     * Send the media buying report now.
     */
    async apiV1AdspacesIdMediaBuyingReportPostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingReportPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingReportPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The same report the daily / weekly schedule sends: to the admins\' notification event and, where the owner runs the buy (admanager, tracking links), the owner\'s email and the `media_buying.report` event. Returns the report and where it went.
     * Send the media buying report now.
     */
    async apiV1AdspacesIdMediaBuyingReportPost(requestParameters: ApiV1AdspacesIdMediaBuyingReportPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingReportPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingSegmentsGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingSegmentsGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingSegmentsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingSegmentsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['dim'] != null) {
            queryParameters['dim'] = requestParameters['dim'];
        }

        if (requestParameters['refresh'] != null) {
            queryParameters['refresh'] = requestParameters['refresh'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/segments`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * `data.cost_basis`: `network` (country / os / hour: the network\'s exact cost per segment; 400 `not_supported` when the network does not report it), `daily` (weekday: the network\'s cost per day over 28 days, keys 1 = Monday … 7 = Sunday, `days` per row = how many of that day were charged; judged from 3) or `estimated` (browser / region / carrier / language: the period\'s cost split by each value\'s share of the traffic, `cost_estimated: true`; a candidate needs twice `segment_min_spend`). On ExoClick browser and language are `network` (its own cost per value); a row keyed `n:<name>` is cost for a value our stats do not have and is never a candidate. The weekday and estimated dimensions work on every network and are always proposals (never written by `segment_mode` auto); approving a browser or language exclusion on ExoClick or TrafficStars writes it there (`writable: true`; TrafficStars only takes include lists, so it is refused on a campaign that targets every browser / language), every other one is applied by hand.
     * Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.
     */
    async apiV1AdspacesIdMediaBuyingSegmentsGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingSegmentsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingSegmentsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `data.cost_basis`: `network` (country / os / hour: the network\'s exact cost per segment; 400 `not_supported` when the network does not report it), `daily` (weekday: the network\'s cost per day over 28 days, keys 1 = Monday … 7 = Sunday, `days` per row = how many of that day were charged; judged from 3) or `estimated` (browser / region / carrier / language: the period\'s cost split by each value\'s share of the traffic, `cost_estimated: true`; a candidate needs twice `segment_min_spend`). On ExoClick browser and language are `network` (its own cost per value); a row keyed `n:<name>` is cost for a value our stats do not have and is never a candidate. The weekday and estimated dimensions work on every network and are always proposals (never written by `segment_mode` auto); approving a browser or language exclusion on ExoClick or TrafficStars writes it there (`writable: true`; TrafficStars only takes include lists, so it is refused on a campaign that targets every browser / language), every other one is applied by hand.
     * Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.
     */
    async apiV1AdspacesIdMediaBuyingSegmentsGet(requestParameters: ApiV1AdspacesIdMediaBuyingSegmentsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingSegmentsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingSourceBidGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingSourceBidGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingSourceBidGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingSourceBidGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/source/bid`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * 400 `not_supported` when the network does not report bids.
     * The campaign\'s current bid at the network.
     */
    async apiV1AdspacesIdMediaBuyingSourceBidGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingSourceBidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingSourceBidGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * 400 `not_supported` when the network does not report bids.
     * The campaign\'s current bid at the network.
     */
    async apiV1AdspacesIdMediaBuyingSourceBidGet(requestParameters: ApiV1AdspacesIdMediaBuyingSourceBidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingSourceBidGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingSourceBidPut without sending the request
     */
    async apiV1AdspacesIdMediaBuyingSourceBidPutRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingSourceBidPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingSourceBidPut().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingSourceBidPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingSourceBidPutRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingSourceBidPutRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingSourceBidPut().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/source/bid`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingSourceBidPutRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingSourceBidPutRequest']),
        };
    }

    /**
     * In the network\'s currency and bid unit.
     * Set the campaign\'s bid at the network.
     */
    async apiV1AdspacesIdMediaBuyingSourceBidPutRaw(requestParameters: ApiV1AdspacesIdMediaBuyingSourceBidPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingSourceBidPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * In the network\'s currency and bid unit.
     * Set the campaign\'s bid at the network.
     */
    async apiV1AdspacesIdMediaBuyingSourceBidPut(requestParameters: ApiV1AdspacesIdMediaBuyingSourceBidPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingSourceBidPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingSourceRetryPost without sending the request
     */
    async apiV1AdspacesIdMediaBuyingSourceRetryPostRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingSourceRetryPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingSourceRetryPost().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/source/retry`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        };
    }

    /**
     * Clears a failed pause/activate state so goadserver tries the network again.
     * Retry the connection to the source campaign.
     */
    async apiV1AdspacesIdMediaBuyingSourceRetryPostRaw(requestParameters: ApiV1AdspacesIdMediaBuyingSourceRetryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingSourceRetryPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Clears a failed pause/activate state so goadserver tries the network again.
     * Retry the connection to the source campaign.
     */
    async apiV1AdspacesIdMediaBuyingSourceRetryPost(requestParameters: ApiV1AdspacesIdMediaBuyingSourceRetryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingSourceRetryPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingTargetingGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingTargetingGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingTargetingGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/targeting`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s placement targeting (all, or an allow-list).
     */
    async apiV1AdspacesIdMediaBuyingTargetingGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingTargetingGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The campaign\'s placement targeting (all, or an allow-list).
     */
    async apiV1AdspacesIdMediaBuyingTargetingGet(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingTargetingGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingTargetingPut without sending the request
     */
    async apiV1AdspacesIdMediaBuyingTargetingPutRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingTargetingPut().'
            );
        }

        if (requestParameters['apiV1AdspacesIdMediaBuyingTargetingPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1AdspacesIdMediaBuyingTargetingPutRequest',
                'Required parameter "apiV1AdspacesIdMediaBuyingTargetingPutRequest" was null or undefined when calling apiV1AdspacesIdMediaBuyingTargetingPut().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/targeting`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1AdspacesIdMediaBuyingTargetingPutRequestToJSON(requestParameters['apiV1AdspacesIdMediaBuyingTargetingPutRequest']),
        };
    }

    /**
     * Switch to / edit the allow-list, or back to all placements.
     */
    async apiV1AdspacesIdMediaBuyingTargetingPutRaw(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingTargetingPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Switch to / edit the allow-list, or back to all placements.
     */
    async apiV1AdspacesIdMediaBuyingTargetingPut(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingTargetingPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingTargetingSuggestGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingTargetingSuggestGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingSuggestGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingTargetingSuggestGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/targeting/suggest`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Suggested allow-list: the profitable placements of the policy window.
     */
    async apiV1AdspacesIdMediaBuyingTargetingSuggestGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingSuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingTargetingSuggestGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Suggested allow-list: the profitable placements of the policy window.
     */
    async apiV1AdspacesIdMediaBuyingTargetingSuggestGet(requestParameters: ApiV1AdspacesIdMediaBuyingTargetingSuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingTargetingSuggestGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingTrackRecordGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingTrackRecordGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingTrackRecordGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingTrackRecordGet().'
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

        let urlPath = `/api/v1/adspaces/{id}/media-buying/track-record`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every change of the last 60 days (blocks, bid per placement, campaign bid, network budget, segment exclusions…) measured on the money: the policy window of full days before the change against the same after it, per lever and actor (`policy` / `agent` / `manual`). Per lever: proposed / approved / rejected / expired / auto / failed counts, measured right / wrong (`no_data` under 0.05 cost a side, `pending` until the after-window is complete, `not_judged` for quality blocks), `right_pct`, `approval_pct`, `profit_per_day` (blocks: the loss stopped per day) and `ready_for_auto` (>= 10 measured and >= 70% right — a hint, no mode is switched); the 20 newest measured actions with their before / after. Cached 15 minutes.
     * Track record: did each change do what it was meant to?
     */
    async apiV1AdspacesIdMediaBuyingTrackRecordGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingTrackRecordGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingTrackRecordGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every change of the last 60 days (blocks, bid per placement, campaign bid, network budget, segment exclusions…) measured on the money: the policy window of full days before the change against the same after it, per lever and actor (`policy` / `agent` / `manual`). Per lever: proposed / approved / rejected / expired / auto / failed counts, measured right / wrong (`no_data` under 0.05 cost a side, `pending` until the after-window is complete, `not_judged` for quality blocks), `right_pct`, `approval_pct`, `profit_per_day` (blocks: the loss stopped per day) and `ready_for_auto` (>= 10 measured and >= 70% right — a hint, no mode is switched); the 20 newest measured actions with their before / after. Cached 15 minutes.
     * Track record: did each change do what it was meant to?
     */
    async apiV1AdspacesIdMediaBuyingTrackRecordGet(requestParameters: ApiV1AdspacesIdMediaBuyingTrackRecordGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingTrackRecordGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1AdspacesIdMediaBuyingZonesGet without sending the request
     */
    async apiV1AdspacesIdMediaBuyingZonesGetRequestOpts(requestParameters: ApiV1AdspacesIdMediaBuyingZonesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1AdspacesIdMediaBuyingZonesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        if (requestParameters['revenueMetric'] != null) {
            queryParameters['revenue_metric'] = requestParameters['revenueMetric'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/adspaces/{id}/media-buying/zones`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Per source zone (placement) of the connected campaign over the policy window: cost (exact from the network or estimated), revenue, margin, CPA, traffic, delivery, off-geo share, confidence fields and whether it is blocked.
     * Source-zone report: revenue against cost per placement.
     */
    async apiV1AdspacesIdMediaBuyingZonesGetRaw(requestParameters: ApiV1AdspacesIdMediaBuyingZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1AdspacesIdMediaBuyingZonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Per source zone (placement) of the connected campaign over the policy window: cost (exact from the network or estimated), revenue, margin, CPA, traffic, delivery, off-geo share, confidence fields and whether it is blocked.
     * Source-zone report: revenue against cost per placement.
     */
    async apiV1AdspacesIdMediaBuyingZonesGet(requestParameters: ApiV1AdspacesIdMediaBuyingZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1AdspacesIdMediaBuyingZonesGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1MediaBuyingPortfolioGet without sending the request
     */
    async apiV1MediaBuyingPortfolioGetRequestOpts(requestParameters: ApiV1MediaBuyingPortfolioGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/media-buying/portfolio`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One row per ad zone or tracking link connected to a network campaign (`kind` adzone | tracking_link): network and campaign, the linked campaigns\' countries, the policy\'s modes and target, revenue / network cost / profit / margin over the last `days` full days, cost per day, today\'s revenue and cost, `status` (losing | below_target | on_target | no_data — worst first), open proposals, last action and the agent\'s latest summary; plus `totals`. Database only, no network call. A key pinned to ad spaces or sites sees only those.
     * Every buy side by side: margin against target, spend, proposals, the agent\'s latest summary.
     */
    async apiV1MediaBuyingPortfolioGetRaw(requestParameters: ApiV1MediaBuyingPortfolioGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1MediaBuyingPortfolioGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * One row per ad zone or tracking link connected to a network campaign (`kind` adzone | tracking_link): network and campaign, the linked campaigns\' countries, the policy\'s modes and target, revenue / network cost / profit / margin over the last `days` full days, cost per day, today\'s revenue and cost, `status` (losing | below_target | on_target | no_data — worst first), open proposals, last action and the agent\'s latest summary; plus `totals`. Database only, no network call. A key pinned to ad spaces or sites sees only those.
     * Every buy side by side: margin against target, spend, proposals, the agent\'s latest summary.
     */
    async apiV1MediaBuyingPortfolioGet(requestParameters: ApiV1MediaBuyingPortfolioGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1MediaBuyingPortfolioGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerMediaBuyingPortfolioGet without sending the request
     */
    async apiV1TrackerMediaBuyingPortfolioGetRequestOpts(requestParameters: ApiV1TrackerMediaBuyingPortfolioGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/media-buying/portfolio`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One row per ad zone or tracking link connected to a network campaign (`kind` adzone | tracking_link): network and campaign, the linked campaigns\' countries, the policy\'s modes and target, revenue / network cost / profit / margin over the last `days` full days, cost per day, today\'s revenue and cost, `status` (losing | below_target | on_target | no_data — worst first), open proposals, last action and the agent\'s latest summary; plus `totals`. Database only, no network call. A key pinned to ad spaces or sites sees only those.
     * Every buy side by side (tracker accounts — the same overview): margin against target, spend, proposals, the agent\'s latest summary.
     */
    async apiV1TrackerMediaBuyingPortfolioGetRaw(requestParameters: ApiV1TrackerMediaBuyingPortfolioGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerMediaBuyingPortfolioGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * One row per ad zone or tracking link connected to a network campaign (`kind` adzone | tracking_link): network and campaign, the linked campaigns\' countries, the policy\'s modes and target, revenue / network cost / profit / margin over the last `days` full days, cost per day, today\'s revenue and cost, `status` (losing | below_target | on_target | no_data — worst first), open proposals, last action and the agent\'s latest summary; plus `totals`. Database only, no network call. A key pinned to ad spaces or sites sees only those.
     * Every buy side by side (tracker accounts — the same overview): margin against target, spend, proposals, the agent\'s latest summary.
     */
    async apiV1TrackerMediaBuyingPortfolioGet(requestParameters: ApiV1TrackerMediaBuyingPortfolioGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerMediaBuyingPortfolioGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost().'
            );
        }

        if (requestParameters['actionId'] == null) {
            throw new runtime.RequiredError(
                'actionId',
                'Required parameter "actionId" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/actions/{actionId}/decide`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"actionId"}}`, encodeURIComponent(String(requestParameters['actionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest']),
        };
    }

    /**
     * Approving carries the proposal out at the network (a block, a bid, a budget, a segment exclusion). Approving an `expand_country` proposal (ad zones only) duplicates the ad zone — linked campaigns, own ads, settings, buying policy — and launches its own network campaign for that one country at the proposed bid and test budget, with the source zone\'s quality blocks as its blacklist; answers `{id, action, status, zone_id, new_spaceid, launch}`; a failure removes the duplicate again (422).
     * Approve or reject a proposal.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Approving carries the proposal out at the network (a block, a bid, a budget, a segment exclusion). Approving an `expand_country` proposal (ad zones only) duplicates the ad zone — linked campaigns, own ads, settings, buying policy — and launches its own network campaign for that one country at the proposed bid and test budget, with the source zone\'s quality blocks as its blacklist; answers `{id, action, status, zone_id, new_spaceid, launch}`; a failure removes the duplicate again (422).
     * Approve or reject a proposal.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingActionsGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingActionsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['actor'] != null) {
            queryParameters['actor'] = requestParameters['actor'];
        }

        if (requestParameters['action'] != null) {
            queryParameters['action'] = requestParameters['action'];
        }

        if (requestParameters['zone'] != null) {
            queryParameters['zone'] = requestParameters['zone'];
        }

        if (requestParameters['from'] != null) {
            queryParameters['from'] = requestParameters['from'];
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = requestParameters['to'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['format'] != null) {
            queryParameters['format'] = requestParameters['format'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/actions`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Newest first. A `bid_change` on a network with a bid per country carries `metrics.countries` [{country, pct, old, new, margin, cost, revenue}].
     * Activity log: every block, bid, budget and other change, and open proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingActionsGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Newest first. A `bid_change` on a network with a bid per country carries `metrics.countries` [{country, pct, old, new, margin, cost, revenue}].
     * Activity log: every block, bid, budget and other change, and open proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingActionsGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingActionsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/agent/run`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        };
    }

    /**
     * At most once per 10 minutes per zone (429 `too_soon`). Refused while the zone is switched off. Returns the new run.
     * Run the buying agent now.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * At most once per 10 minutes per zone (429 `too_soon`). Refused while the zone is switched off. Returns the new run.
     * Run the buying agent now.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/agent/runs`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The buying agent\'s recent runs with their summaries and proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The buying agent\'s recent runs with their summaries and proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingBlockPost without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingBlockPost().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingBlockPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/block`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest']),
        };
    }

    /**
     * Writes the change to the network campaign right away and logs it as a manual action. 502 when the network refuses.
     * Block or unblock one source zone at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Writes the change to the network campaign right away and logs it as a manual action. 502 when the network refuses.
     * Block or unblock one source zone at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingBlockPost(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingCompareGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingCompareGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['_with'] != null) {
            queryParameters['with'] = requestParameters['_with'];
        }

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/compare`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * This buy against another of yours over the same days (default: its control — policy `control_for` — or the buy it is the control of). Per buy: revenue, network cost, profit, margin, profit and volume per day, and each day\'s figures. Verdict: a paired test on the daily margins — `a_better` / `b_better` (a = this buy) only when the mean difference is at least twice its standard error over at least 5 days with revenue on both sides, else `too_close` or `too_little_data`; `note` says it in a sentence. Database only, no network call.
     * Compare with another buy (A/B, e.g. against a control left to the network\'s own optimiser).
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingCompareGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * This buy against another of yours over the same days (default: its control — policy `control_for` — or the buy it is the control of). Per buy: revenue, network cost, profit, margin, profit and volume per day, and each day\'s figures. Verdict: a paired test on the daily margins — `a_better` / `b_better` (a = this buy) only when the mean difference is at least twice its standard error over at least 5 days with revenue on both sides, else `too_close` or `too_little_data`; `note` says it in a sentence. Database only, no network call.
     * Compare with another buy (A/B, e.g. against a control left to the network\'s own optimiser).
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingCompareGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingCompareGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Everything the panel shows before the report: network and campaign, capability flags (`supports_*`; `supports_country_bids` = the campaign bid is an absolute bid per country, judged and moved per country), the URL suffix that captures the source zone id (`capture`), the stored `policy`, `pending_proposals`, the source campaign state and `owner_gets_report`. 404 when the tracking link is not connected to an external network campaign.
     * Overview: the connected network, what it supports, the policy and open proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Everything the panel shows before the report: network and campaign, capability flags (`supports_*`; `supports_country_bids` = the campaign bid is an absolute bid per country, judged and moved per country), the URL suffix that captures the source zone id (`capture`), the stored `policy`, `pending_proposals`, the source campaign state and `owner_gets_report`. 404 when the tracking link is not connected to an external network campaign.
     * Overview: the connected network, what it supports, the policy and open proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingIpsGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingIpsGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/ips`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The IP preblock list: ranges on the network\'s exclusion list and proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingIpsGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The IP preblock list: ranges on the network\'s exclusion list and proposals.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingIpsGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingIpsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingIpsPost without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingIpsPost().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingIpsPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/ips`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest']),
        };
    }

    /**
     * `add` blocks the given ranges now, `approve` / `reject` decide proposals, `remove` takes ranges off, `refresh` builds the list now (no `cidrs`).
     * Change the IP preblock list.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `add` blocks the given ranges now, `approve` / `reject` decide proposals, `remove` takes ranges off, `refresh` builds the list now (no `cidrs`).
     * Change the IP preblock list.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingIpsPost(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/network-budget`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s daily budget at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The campaign\'s daily budget at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut().'
            );
        }

        if (requestParameters['mediaBuyingPolicy'] == null) {
            throw new runtime.RequiredError(
                'mediaBuyingPolicy',
                'Required parameter "mediaBuyingPolicy" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/policy`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: MediaBuyingPolicyToJSON(requestParameters['mediaBuyingPolicy']),
        };
    }

    /**
     * Fields left out keep their stored value. Returns the stored, normalized policy.
     * Save the buying policy (any subset of its fields).
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Fields left out keep their stored value. Returns the stored, normalized policy.
     * Save the buying policy (any subset of its fields).
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['preset'] != null) {
            queryParameters['preset'] = requestParameters['preset'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/policy/suggest`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Nothing is saved. `data.policy` is the full suggested policy; `data.suggestions` lists `{field, value, why}`; with `preset` the preset\'s own changes follow, each with its reason.
     * Suggested policy from the zone\'s own traffic, with a reason per field.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Nothing is saved. `data.policy` is the full suggested policy; `data.suggestions` lists `{field, value, why}`; with `preset` the preset\'s own changes follow, each with its reason.
     * Suggested policy from the zone\'s own traffic, with a reason per field.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingReportPost without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingReportPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingReportPost().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingReportPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/report`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest']),
        };
    }

    /**
     * The same report the daily / weekly schedule sends: to the admins\' notification event and, where the owner runs the buy (admanager, tracking links), the owner\'s email and the `media_buying.report` event. Returns the report and where it went.
     * Send the media buying report now.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingReportPostRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingReportPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The same report the daily / weekly schedule sends: to the admins\' notification event and, where the owner runs the buy (admanager, tracking links), the owner\'s email and the `media_buying.report` event. Returns the report and where it went.
     * Send the media buying report now.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingReportPost(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingReportPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingReportPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['dim'] != null) {
            queryParameters['dim'] = requestParameters['dim'];
        }

        if (requestParameters['refresh'] != null) {
            queryParameters['refresh'] = requestParameters['refresh'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/segments`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * `data.cost_basis`: `network` (country / os / hour: the network\'s exact cost per segment; 400 `not_supported` when the network does not report it), `daily` (weekday: the network\'s cost per day over 28 days, keys 1 = Monday … 7 = Sunday, `days` per row = how many of that day were charged; judged from 3) or `estimated` (browser / region / carrier / language: the period\'s cost split by each value\'s share of the traffic, `cost_estimated: true`; a candidate needs twice `segment_min_spend`). On ExoClick browser and language are `network` (its own cost per value); a row keyed `n:<name>` is cost for a value our stats do not have and is never a candidate. The weekday and estimated dimensions work on every network and are always proposals (never written by `segment_mode` auto); approving a browser or language exclusion on ExoClick or TrafficStars writes it there (`writable: true`; TrafficStars only takes include lists, so it is refused on a campaign that targets every browser / language), every other one is applied by hand.
     * Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `data.cost_basis`: `network` (country / os / hour: the network\'s exact cost per segment; 400 `not_supported` when the network does not report it), `daily` (weekday: the network\'s cost per day over 28 days, keys 1 = Monday … 7 = Sunday, `days` per row = how many of that day were charged; judged from 3) or `estimated` (browser / region / carrier / language: the period\'s cost split by each value\'s share of the traffic, `cost_estimated: true`; a candidate needs twice `segment_min_spend`). On ExoClick browser and language are `network` (its own cost per value); a row keyed `n:<name>` is cost for a value our stats do not have and is never a candidate. The weekday and estimated dimensions work on every network and are always proposals (never written by `segment_mode` auto); approving a browser or language exclusion on ExoClick or TrafficStars writes it there (`writable: true`; TrafficStars only takes include lists, so it is refused on a campaign that targets every browser / language), every other one is applied by hand.
     * Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/source/bid`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * 400 `not_supported` when the network does not report bids.
     * The campaign\'s current bid at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * 400 `not_supported` when the network does not report bids.
     * The campaign\'s current bid at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/source/bid`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest']),
        };
    }

    /**
     * In the network\'s currency and bid unit.
     * Set the campaign\'s bid at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * In the network\'s currency and bid unit.
     * Set the campaign\'s bid at the network.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/source/retry`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        };
    }

    /**
     * Clears a failed pause/activate state so goadserver tries the network again.
     * Retry the connection to the source campaign.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Clears a failed pause/activate state so goadserver tries the network again.
     * Retry the connection to the source campaign.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/targeting`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The campaign\'s placement targeting (all, or an allow-list).
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The campaign\'s placement targeting (all, or an allow-list).
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/targeting`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest']),
        };
    }

    /**
     * Switch to / edit the allow-list, or back to all placements.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Switch to / edit the allow-list, or back to all placements.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/targeting/suggest`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Suggested allow-list: the profitable placements of the policy window.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Suggested allow-list: the profitable placements of the policy window.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/track-record`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every change of the last 60 days (blocks, bid per placement, campaign bid, network budget, segment exclusions…) measured on the money: the policy window of full days before the change against the same after it, per lever and actor (`policy` / `agent` / `manual`). Per lever: proposed / approved / rejected / expired / auto / failed counts, measured right / wrong (`no_data` under 0.05 cost a side, `pending` until the after-window is complete, `not_judged` for quality blocks), `right_pct`, `approval_pct`, `profit_per_day` (blocks: the loss stopped per day) and `ready_for_auto` (>= 10 measured and >= 70% right — a hint, no mode is switched); the 20 newest measured actions with their before / after. Cached 15 minutes.
     * Track record: did each change do what it was meant to?
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every change of the last 60 days (blocks, bid per placement, campaign bid, network budget, segment exclusions…) measured on the money: the policy window of full days before the change against the same after it, per lever and actor (`policy` / `agent` / `manual`). Per lever: proposed / approved / rejected / expired / auto / failed counts, measured right / wrong (`no_data` under 0.05 cost a side, `pending` until the after-window is complete, `not_judged` for quality blocks), `right_pct`, `approval_pct`, `profit_per_day` (blocks: the loss stopped per day) and `ready_for_auto` (>= 10 measured and >= 70% right — a hint, no mode is switched); the 20 newest measured actions with their before / after. Cached 15 minutes.
     * Track record: did each change do what it was meant to?
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdMediaBuyingZonesGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdMediaBuyingZonesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        if (requestParameters['revenueMetric'] != null) {
            queryParameters['revenue_metric'] = requestParameters['revenueMetric'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/tracking-links/{id}/media-buying/zones`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Per source zone (placement) of the connected campaign over the policy window: cost (exact from the network or estimated), revenue, margin, CPA, traffic, delivery, off-geo share, confidence fields and whether it is blocked.
     * Source-zone report: revenue against cost per placement.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingZonesGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Per source zone (placement) of the connected campaign over the policy window: cost (exact from the network or estimated), revenue, margin, CPA, traffic, delivery, off-geo share, confidence fields and whether it is blocked.
     * Source-zone report: revenue against cost per placement.
     */
    async apiV1TrackerTrackingLinksIdMediaBuyingZonesGet(requestParameters: ApiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1TrackerTrackingLinksIdMediaBuyingZonesGetRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1AdspacesIdMediaBuyingPolicySuggestGetPresetEnum = {
    Conservative: 'conservative',
    Balanced: 'balanced',
    Aggressive: 'aggressive'
} as const;
export type ApiV1AdspacesIdMediaBuyingPolicySuggestGetPresetEnum = typeof ApiV1AdspacesIdMediaBuyingPolicySuggestGetPresetEnum[keyof typeof ApiV1AdspacesIdMediaBuyingPolicySuggestGetPresetEnum];
/**
 * @export
 */
export const ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetPresetEnum = {
    Conservative: 'conservative',
    Balanced: 'balanced',
    Aggressive: 'aggressive'
} as const;
export type ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetPresetEnum = typeof ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetPresetEnum[keyof typeof ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetPresetEnum];
