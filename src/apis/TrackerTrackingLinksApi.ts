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
  ApiV1CampaignsTypeIdActivePatchRequest,
  ApiV1PublisherPushCampaignsIdDelete200Response,
  ApiV1PublisherPushCampaignsPost200Response,
  ApiV1PublisherPushSubscribersActionPost200Response,
  ApiV1TrackerTrackingLinksBulkPostRequest,
  ApiV1TrackerTrackingLinksGet200Response,
  ApiV1TrackerTrackingLinksIdBlocklistPostRequest,
  ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest,
  ApiV1TrackerTrackingLinksIdPutRequest,
  ApiV1TrackerTrackingLinksIdToggleActivePost200Response,
  ApiV1TrackerTrackingLinksIdZoneCostsGet200Response,
  ApiV1TrackerTrackingLinksPostRequest,
} from '../models/index';
import {
    ApiV1CampaignsTypeIdActivePatchRequestFromJSON,
    ApiV1CampaignsTypeIdActivePatchRequestToJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseToJSON,
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1PublisherPushSubscribersActionPost200ResponseFromJSON,
    ApiV1PublisherPushSubscribersActionPost200ResponseToJSON,
    ApiV1TrackerTrackingLinksBulkPostRequestFromJSON,
    ApiV1TrackerTrackingLinksBulkPostRequestToJSON,
    ApiV1TrackerTrackingLinksGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksGet200ResponseToJSON,
    ApiV1TrackerTrackingLinksIdBlocklistPostRequestFromJSON,
    ApiV1TrackerTrackingLinksIdBlocklistPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdNetworkBindingPutRequestFromJSON,
    ApiV1TrackerTrackingLinksIdNetworkBindingPutRequestToJSON,
    ApiV1TrackerTrackingLinksIdPutRequestFromJSON,
    ApiV1TrackerTrackingLinksIdPutRequestToJSON,
    ApiV1TrackerTrackingLinksIdToggleActivePost200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdToggleActivePost200ResponseToJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseToJSON,
    ApiV1TrackerTrackingLinksPostRequestFromJSON,
    ApiV1TrackerTrackingLinksPostRequestToJSON,
} from '../models/index';

export interface ApiV1TrackerTrackingLinksBulkPostOperationRequest {
    apiV1TrackerTrackingLinksBulkPostRequest: ApiV1TrackerTrackingLinksBulkPostRequest;
}

export interface ApiV1TrackerTrackingLinksIdBlocklistGetRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdBlocklistPostOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdBlocklistPostRequest: ApiV1TrackerTrackingLinksIdBlocklistPostRequest;
}

export interface ApiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequest {
    id: number;
    zoneId: string;
}

export interface ApiV1TrackerTrackingLinksIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdNetworkBindingDeleteRequest {
    id: number;
}

export interface ApiV1TrackerTrackingLinksIdNetworkBindingPutOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdNetworkBindingPutRequest: ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest;
}

export interface ApiV1TrackerTrackingLinksIdPutOperationRequest {
    id: number;
    apiV1TrackerTrackingLinksIdPutRequest: ApiV1TrackerTrackingLinksIdPutRequest;
}

export interface ApiV1TrackerTrackingLinksIdToggleActivePostRequest {
    id: number;
    apiV1CampaignsTypeIdActivePatchRequest: ApiV1CampaignsTypeIdActivePatchRequest;
}

export interface ApiV1TrackerTrackingLinksIdZoneCostsGetRequest {
    id: number;
    days?: number;
}

export interface ApiV1TrackerTrackingLinksPostOperationRequest {
    apiV1TrackerTrackingLinksPostRequest: ApiV1TrackerTrackingLinksPostRequest;
}

/**
 * 
 */
export class TrackerTrackingLinksApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackerTrackingLinksBulkPost without sending the request
     */
    async apiV1TrackerTrackingLinksBulkPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksBulkPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerTrackingLinksBulkPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksBulkPostRequest',
                'Required parameter "apiV1TrackerTrackingLinksBulkPostRequest" was null or undefined when calling apiV1TrackerTrackingLinksBulkPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/bulk`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksBulkPostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksBulkPostRequest']),
        };
    }

    /**
     * The tracking-link twin of `/offers/bulk`, but delete-only. A link\'s on/off state is set one at a time through `POST /tracking-links/{id}/toggle-active` — pausing a link a live traffic source is still sending to is a decision worth making per link, not per batch. 
     * Delete many tracking links.
     */
    async apiV1TrackerTrackingLinksBulkPostRaw(requestParameters: ApiV1TrackerTrackingLinksBulkPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushSubscribersActionPost200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksBulkPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushSubscribersActionPost200ResponseFromJSON(jsonValue));
    }

    /**
     * The tracking-link twin of `/offers/bulk`, but delete-only. A link\'s on/off state is set one at a time through `POST /tracking-links/{id}/toggle-active` — pausing a link a live traffic source is still sending to is a decision worth making per link, not per batch. 
     * Delete many tracking links.
     */
    async apiV1TrackerTrackingLinksBulkPost(requestParameters: ApiV1TrackerTrackingLinksBulkPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushSubscribersActionPost200Response> {
        const response = await this.apiV1TrackerTrackingLinksBulkPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksGet without sending the request
     */
    async apiV1TrackerTrackingLinksGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/tracking-links`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Each link is a `publisher_adzones` row under a hidden source site. A link bound to one offer redirects straight to it; a smartlink carries several `offer_ids` and lets targeting and eCPM pick the winner per click. 
     * List tracking links.
     */
    async apiV1TrackerTrackingLinksGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksGet200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Each link is a `publisher_adzones` row under a hidden source site. A link bound to one offer redirects straight to it; a smartlink carries several `offer_ids` and lets targeting and eCPM pick the winner per click. 
     * List tracking links.
     */
    async apiV1TrackerTrackingLinksGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksGet200Response> {
        const response = await this.apiV1TrackerTrackingLinksGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdBlocklistGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdBlocklistGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdBlocklistGet().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/blocklist`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The placements this link refuses to buy. 404 while the link is not bound to an ad network — there are no placements to block until it is. 
     * List zones blocked on one link.
     */
    async apiV1TrackerTrackingLinksIdBlocklistGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdBlocklistGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The placements this link refuses to buy. 404 while the link is not bound to an ad network — there are no placements to block until it is. 
     * List zones blocked on one link.
     */
    async apiV1TrackerTrackingLinksIdBlocklistGet(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdBlocklistGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdBlocklistPost without sending the request
     */
    async apiV1TrackerTrackingLinksIdBlocklistPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdBlocklistPost().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdBlocklistPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdBlocklistPostRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdBlocklistPostRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdBlocklistPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/blocklist`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdBlocklistPostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdBlocklistPostRequest']),
        };
    }

    /**
     * Adds a placement to the link\'s block list; the traffic source stops being bought on that zone. 404 while the link is not bound to an ad network. 
     * Block a zone on one link.
     */
    async apiV1TrackerTrackingLinksIdBlocklistPostRaw(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdBlocklistPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds a placement to the link\'s block list; the traffic source stops being bought on that zone. 404 while the link is not bound to an ad network. 
     * Block a zone on one link.
     */
    async apiV1TrackerTrackingLinksIdBlocklistPost(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdBlocklistPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete without sending the request
     */
    async apiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete().'
            );
        }

        if (requestParameters['zoneId'] == null) {
            throw new runtime.RequiredError(
                'zoneId',
                'Required parameter "zoneId" was null or undefined when calling apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/blocklist/{zoneId}`;
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
     * Removes the placement from the block list. 404 while the link is not bound to an ad network. 
     * Unblock a zone on one link.
     */
    async apiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRaw(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Removes the placement from the block list. 404 while the link is not bound to an ad network. 
     * Unblock a zone on one link.
     */
    async apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete(requestParameters: ApiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdDelete without sending the request
     */
    async apiV1TrackerTrackingLinksIdDeleteRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdDelete().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete — the link stops serving, its click history stays. 
     * Delete a tracking link.
     */
    async apiV1TrackerTrackingLinksIdDeleteRaw(requestParameters: ApiV1TrackerTrackingLinksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Soft delete — the link stops serving, its click history stays. 
     * Delete a tracking link.
     */
    async apiV1TrackerTrackingLinksIdDelete(requestParameters: ApiV1TrackerTrackingLinksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdNetworkBindingDelete without sending the request
     */
    async apiV1TrackerTrackingLinksIdNetworkBindingDeleteRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdNetworkBindingDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdNetworkBindingDelete().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/network-binding`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Cost stops being attributed to the link. 
     * Unbind a tracking link from its ad-network campaign.
     */
    async apiV1TrackerTrackingLinksIdNetworkBindingDeleteRaw(requestParameters: ApiV1TrackerTrackingLinksIdNetworkBindingDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdNetworkBindingDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Cost stops being attributed to the link. 
     * Unbind a tracking link from its ad-network campaign.
     */
    async apiV1TrackerTrackingLinksIdNetworkBindingDelete(requestParameters: ApiV1TrackerTrackingLinksIdNetworkBindingDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdNetworkBindingDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdNetworkBindingPut without sending the request
     */
    async apiV1TrackerTrackingLinksIdNetworkBindingPutRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdNetworkBindingPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdNetworkBindingPut().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdNetworkBindingPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdNetworkBindingPutRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdNetworkBindingPutRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdNetworkBindingPut().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/network-binding`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdNetworkBindingPutRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdNetworkBindingPutRequest']),
        };
    }

    /**
     * Ties the link to a campaign on the buying side, so spend pulled from that network lands against this link\'s revenue. `auto_api` lets rules push pause / bid changes back to the network. 
     * Bind a tracking link to an ad-network campaign.
     */
    async apiV1TrackerTrackingLinksIdNetworkBindingPutRaw(requestParameters: ApiV1TrackerTrackingLinksIdNetworkBindingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdNetworkBindingPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Ties the link to a campaign on the buying side, so spend pulled from that network lands against this link\'s revenue. `auto_api` lets rules push pause / bid changes back to the network. 
     * Bind a tracking link to an ad-network campaign.
     */
    async apiV1TrackerTrackingLinksIdNetworkBindingPut(requestParameters: ApiV1TrackerTrackingLinksIdNetworkBindingPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdNetworkBindingPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdPut without sending the request
     */
    async apiV1TrackerTrackingLinksIdPutRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerTrackingLinksIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksIdPutRequest',
                'Required parameter "apiV1TrackerTrackingLinksIdPutRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdPut().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksIdPutRequestToJSON(requestParameters['apiV1TrackerTrackingLinksIdPutRequest']),
        };
    }

    /**
     * Partial update — omitted fields keep their current value. 
     * Update a tracking link.
     */
    async apiV1TrackerTrackingLinksIdPutRaw(requestParameters: ApiV1TrackerTrackingLinksIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update — omitted fields keep their current value. 
     * Update a tracking link.
     */
    async apiV1TrackerTrackingLinksIdPut(requestParameters: ApiV1TrackerTrackingLinksIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdToggleActivePost without sending the request
     */
    async apiV1TrackerTrackingLinksIdToggleActivePostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdToggleActivePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdToggleActivePost().'
            );
        }

        if (requestParameters['apiV1CampaignsTypeIdActivePatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1CampaignsTypeIdActivePatchRequest',
                'Required parameter "apiV1CampaignsTypeIdActivePatchRequest" was null or undefined when calling apiV1TrackerTrackingLinksIdToggleActivePost().'
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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/toggle-active`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1CampaignsTypeIdActivePatchRequestToJSON(requestParameters['apiV1CampaignsTypeIdActivePatchRequest']),
        };
    }

    /**
     * **This reaches out to the traffic source.** It does not flip a local flag: it calls the bound ad network\'s API to pause or resume the campaign this link is bound to, and writes the outcome back to `adnetwork_state`.  The binding is required — an unbound link answers 400 `no_binding`.  Day to day you do not need this: goadserver\'s `UpdateFromAdzones` cron already mirrors local offer state to the remote campaign every tick. It exists for \"pause the source right now\" without waiting for the next tick, and for reporting-only bindings (`auto_api` false) where the cron never acts. 
     * Pause or resume the bound network campaign.
     */
    async apiV1TrackerTrackingLinksIdToggleActivePostRaw(requestParameters: ApiV1TrackerTrackingLinksIdToggleActivePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdToggleActivePost200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdToggleActivePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdToggleActivePost200ResponseFromJSON(jsonValue));
    }

    /**
     * **This reaches out to the traffic source.** It does not flip a local flag: it calls the bound ad network\'s API to pause or resume the campaign this link is bound to, and writes the outcome back to `adnetwork_state`.  The binding is required — an unbound link answers 400 `no_binding`.  Day to day you do not need this: goadserver\'s `UpdateFromAdzones` cron already mirrors local offer state to the remote campaign every tick. It exists for \"pause the source right now\" without waiting for the next tick, and for reporting-only bindings (`auto_api` false) where the cron never acts. 
     * Pause or resume the bound network campaign.
     */
    async apiV1TrackerTrackingLinksIdToggleActivePost(requestParameters: ApiV1TrackerTrackingLinksIdToggleActivePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdToggleActivePost200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdToggleActivePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksIdZoneCostsGet without sending the request
     */
    async apiV1TrackerTrackingLinksIdZoneCostsGetRequestOpts(requestParameters: ApiV1TrackerTrackingLinksIdZoneCostsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerTrackingLinksIdZoneCostsGet().'
            );
        }

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

        let urlPath = `/api/v1/tracker/tracking-links/{id}/zone-costs`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Placement-level spend and result for the link\'s bound traffic source, the input a placement rule blocks on. See docs/TRACKER_ZONE_BLOCKING.md.  Placement data comes from the bound ad network, so a link with no binding answers 404 — bind it with `PUT /tracking-links/{id}/network-binding` first. 
     * Per-zone cost and performance for one link.
     */
    async apiV1TrackerTrackingLinksIdZoneCostsGetRaw(requestParameters: ApiV1TrackerTrackingLinksIdZoneCostsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksIdZoneCostsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Placement-level spend and result for the link\'s bound traffic source, the input a placement rule blocks on. See docs/TRACKER_ZONE_BLOCKING.md.  Placement data comes from the bound ad network, so a link with no binding answers 404 — bind it with `PUT /tracking-links/{id}/network-binding` first. 
     * Per-zone cost and performance for one link.
     */
    async apiV1TrackerTrackingLinksIdZoneCostsGet(requestParameters: ApiV1TrackerTrackingLinksIdZoneCostsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerTrackingLinksIdZoneCostsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerTrackingLinksPost without sending the request
     */
    async apiV1TrackerTrackingLinksPostRequestOpts(requestParameters: ApiV1TrackerTrackingLinksPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerTrackingLinksPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerTrackingLinksPostRequest',
                'Required parameter "apiV1TrackerTrackingLinksPostRequest" was null or undefined when calling apiV1TrackerTrackingLinksPost().'
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

        let urlPath = `/api/v1/tracker/tracking-links`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerTrackingLinksPostRequestToJSON(requestParameters['apiV1TrackerTrackingLinksPostRequest']),
        };
    }

    /**
     * Pass `offer_id` for a single-offer link, or `offer_ids` (optionally with matching `weights`) for a smartlink. `tokens` names the macro slots the click URL should carry. 
     * Create a tracking link.
     */
    async apiV1TrackerTrackingLinksPostRaw(requestParameters: ApiV1TrackerTrackingLinksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerTrackingLinksPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Pass `offer_id` for a single-offer link, or `offer_ids` (optionally with matching `weights`) for a smartlink. `tokens` names the macro slots the click URL should carry. 
     * Create a tracking link.
     */
    async apiV1TrackerTrackingLinksPost(requestParameters: ApiV1TrackerTrackingLinksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerTrackingLinksPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
