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
  ApiV1PublisherPushCampaignsIdDelete200Response,
  ApiV1PublisherPushCampaignsPost200Response,
  ApiV1PublisherPushSubscribersActionPost200Response,
  ApiV1TrackerOffersBulkPostRequest,
  ApiV1TrackerOffersGet200Response,
  ApiV1TrackerOffersIdGet200Response,
  ApiV1TrackerOffersIdPutRequest,
  ApiV1TrackerOffersIdUrlsPostRequest,
  ApiV1TrackerOffersIdUrlsUrlIdPutRequest,
  ApiV1TrackerOffersPostRequest,
} from '../models/index';
import {
    ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseToJSON,
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1PublisherPushSubscribersActionPost200ResponseFromJSON,
    ApiV1PublisherPushSubscribersActionPost200ResponseToJSON,
    ApiV1TrackerOffersBulkPostRequestFromJSON,
    ApiV1TrackerOffersBulkPostRequestToJSON,
    ApiV1TrackerOffersGet200ResponseFromJSON,
    ApiV1TrackerOffersGet200ResponseToJSON,
    ApiV1TrackerOffersIdGet200ResponseFromJSON,
    ApiV1TrackerOffersIdGet200ResponseToJSON,
    ApiV1TrackerOffersIdPutRequestFromJSON,
    ApiV1TrackerOffersIdPutRequestToJSON,
    ApiV1TrackerOffersIdUrlsPostRequestFromJSON,
    ApiV1TrackerOffersIdUrlsPostRequestToJSON,
    ApiV1TrackerOffersIdUrlsUrlIdPutRequestFromJSON,
    ApiV1TrackerOffersIdUrlsUrlIdPutRequestToJSON,
    ApiV1TrackerOffersPostRequestFromJSON,
    ApiV1TrackerOffersPostRequestToJSON,
} from '../models/index';

export interface ApiV1TrackerOffersBulkPostOperationRequest {
    apiV1TrackerOffersBulkPostRequest: ApiV1TrackerOffersBulkPostRequest;
}

export interface ApiV1TrackerOffersIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerOffersIdGetRequest {
    id: number;
}

export interface ApiV1TrackerOffersIdPutOperationRequest {
    id: number;
    apiV1TrackerOffersIdPutRequest: ApiV1TrackerOffersIdPutRequest;
}

export interface ApiV1TrackerOffersIdUrlsPostOperationRequest {
    id: number;
    apiV1TrackerOffersIdUrlsPostRequest: ApiV1TrackerOffersIdUrlsPostRequest;
}

export interface ApiV1TrackerOffersIdUrlsUrlIdDeleteRequest {
    id: number;
    urlId: number;
}

export interface ApiV1TrackerOffersIdUrlsUrlIdPutOperationRequest {
    id: number;
    urlId: number;
    apiV1TrackerOffersIdUrlsUrlIdPutRequest: ApiV1TrackerOffersIdUrlsUrlIdPutRequest;
}

export interface ApiV1TrackerOffersPostOperationRequest {
    apiV1TrackerOffersPostRequest: ApiV1TrackerOffersPostRequest;
}

/**
 * 
 */
export class TrackerOffersApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackerOffersBulkPost without sending the request
     */
    async apiV1TrackerOffersBulkPostRequestOpts(requestParameters: ApiV1TrackerOffersBulkPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerOffersBulkPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerOffersBulkPostRequest',
                'Required parameter "apiV1TrackerOffersBulkPostRequest" was null or undefined when calling apiV1TrackerOffersBulkPost().'
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

        let urlPath = `/api/v1/tracker/offers/bulk`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerOffersBulkPostRequestToJSON(requestParameters['apiV1TrackerOffersBulkPostRequest']),
        };
    }

    /**
     * One action across a list of offer ids the caller owns. Ids that are not the caller\'s are skipped rather than failing the batch. 
     * Pause, activate or delete many offers.
     */
    async apiV1TrackerOffersBulkPostRaw(requestParameters: ApiV1TrackerOffersBulkPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushSubscribersActionPost200Response>> {
        const requestOptions = await this.apiV1TrackerOffersBulkPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushSubscribersActionPost200ResponseFromJSON(jsonValue));
    }

    /**
     * One action across a list of offer ids the caller owns. Ids that are not the caller\'s are skipped rather than failing the batch. 
     * Pause, activate or delete many offers.
     */
    async apiV1TrackerOffersBulkPost(requestParameters: ApiV1TrackerOffersBulkPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushSubscribersActionPost200Response> {
        const response = await this.apiV1TrackerOffersBulkPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersGet without sending the request
     */
    async apiV1TrackerOffersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/offers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every offer the caller owns. An offer is a `roncampaigns` row with `adtypeid=21` — the same row the click pipeline, conversion settlement and stats already key off, so an offer created here is immediately servable through a tracking link. 
     * List tracker offers.
     */
    async apiV1TrackerOffersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerOffersGet200Response>> {
        const requestOptions = await this.apiV1TrackerOffersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerOffersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Every offer the caller owns. An offer is a `roncampaigns` row with `adtypeid=21` — the same row the click pipeline, conversion settlement and stats already key off, so an offer created here is immediately servable through a tracking link. 
     * List tracker offers.
     */
    async apiV1TrackerOffersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerOffersGet200Response> {
        const response = await this.apiV1TrackerOffersGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersIdDelete without sending the request
     */
    async apiV1TrackerOffersIdDeleteRequestOpts(requestParameters: ApiV1TrackerOffersIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerOffersIdDelete().'
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

        let urlPath = `/api/v1/tracker/offers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete (`isdeleted=1`). Clicks, conversions and stats history stay intact and keep reporting under the offer\'s name. 
     * Delete an offer.
     */
    async apiV1TrackerOffersIdDeleteRaw(requestParameters: ApiV1TrackerOffersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerOffersIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Soft delete (`isdeleted=1`). Clicks, conversions and stats history stay intact and keep reporting under the offer\'s name. 
     * Delete an offer.
     */
    async apiV1TrackerOffersIdDelete(requestParameters: ApiV1TrackerOffersIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerOffersIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersIdGet without sending the request
     */
    async apiV1TrackerOffersIdGetRequestOpts(requestParameters: ApiV1TrackerOffersIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerOffersIdGet().'
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

        let urlPath = `/api/v1/tracker/offers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The full offer including its landing URLs and targeting. 
     * Get one offer.
     */
    async apiV1TrackerOffersIdGetRaw(requestParameters: ApiV1TrackerOffersIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerOffersIdGet200Response>> {
        const requestOptions = await this.apiV1TrackerOffersIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerOffersIdGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The full offer including its landing URLs and targeting. 
     * Get one offer.
     */
    async apiV1TrackerOffersIdGet(requestParameters: ApiV1TrackerOffersIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerOffersIdGet200Response> {
        const response = await this.apiV1TrackerOffersIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersIdPut without sending the request
     */
    async apiV1TrackerOffersIdPutRequestOpts(requestParameters: ApiV1TrackerOffersIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerOffersIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerOffersIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerOffersIdPutRequest',
                'Required parameter "apiV1TrackerOffersIdPutRequest" was null or undefined when calling apiV1TrackerOffersIdPut().'
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

        let urlPath = `/api/v1/tracker/offers/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerOffersIdPutRequestToJSON(requestParameters['apiV1TrackerOffersIdPutRequest']),
        };
    }

    /**
     * Partial update — only the fields present in the body are written, so a caller that knows about one field cannot blank the rest. 
     * Update an offer.
     */
    async apiV1TrackerOffersIdPutRaw(requestParameters: ApiV1TrackerOffersIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerOffersIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update — only the fields present in the body are written, so a caller that knows about one field cannot blank the rest. 
     * Update an offer.
     */
    async apiV1TrackerOffersIdPut(requestParameters: ApiV1TrackerOffersIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerOffersIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersIdUrlsPost without sending the request
     */
    async apiV1TrackerOffersIdUrlsPostRequestOpts(requestParameters: ApiV1TrackerOffersIdUrlsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerOffersIdUrlsPost().'
            );
        }

        if (requestParameters['apiV1TrackerOffersIdUrlsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerOffersIdUrlsPostRequest',
                'Required parameter "apiV1TrackerOffersIdUrlsPostRequest" was null or undefined when calling apiV1TrackerOffersIdUrlsPost().'
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

        let urlPath = `/api/v1/tracker/offers/{id}/urls`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerOffersIdUrlsPostRequestToJSON(requestParameters['apiV1TrackerOffersIdUrlsPostRequest']),
        };
    }

    /**
     * Adds one rotator URL without round-tripping the whole offer. 
     * Add a landing URL to an offer.
     */
    async apiV1TrackerOffersIdUrlsPostRaw(requestParameters: ApiV1TrackerOffersIdUrlsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerOffersIdUrlsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Adds one rotator URL without round-tripping the whole offer. 
     * Add a landing URL to an offer.
     */
    async apiV1TrackerOffersIdUrlsPost(requestParameters: ApiV1TrackerOffersIdUrlsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerOffersIdUrlsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersIdUrlsUrlIdDelete without sending the request
     */
    async apiV1TrackerOffersIdUrlsUrlIdDeleteRequestOpts(requestParameters: ApiV1TrackerOffersIdUrlsUrlIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerOffersIdUrlsUrlIdDelete().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1TrackerOffersIdUrlsUrlIdDelete().'
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

        let urlPath = `/api/v1/tracker/offers/{id}/urls/{urlId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Soft delete, so the URL\'s click and conversion history survives. 
     * Delete one landing URL.
     */
    async apiV1TrackerOffersIdUrlsUrlIdDeleteRaw(requestParameters: ApiV1TrackerOffersIdUrlsUrlIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerOffersIdUrlsUrlIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Soft delete, so the URL\'s click and conversion history survives. 
     * Delete one landing URL.
     */
    async apiV1TrackerOffersIdUrlsUrlIdDelete(requestParameters: ApiV1TrackerOffersIdUrlsUrlIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerOffersIdUrlsUrlIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersIdUrlsUrlIdPut without sending the request
     */
    async apiV1TrackerOffersIdUrlsUrlIdPutRequestOpts(requestParameters: ApiV1TrackerOffersIdUrlsUrlIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerOffersIdUrlsUrlIdPut().'
            );
        }

        if (requestParameters['urlId'] == null) {
            throw new runtime.RequiredError(
                'urlId',
                'Required parameter "urlId" was null or undefined when calling apiV1TrackerOffersIdUrlsUrlIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerOffersIdUrlsUrlIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerOffersIdUrlsUrlIdPutRequest',
                'Required parameter "apiV1TrackerOffersIdUrlsUrlIdPutRequest" was null or undefined when calling apiV1TrackerOffersIdUrlsUrlIdPut().'
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

        let urlPath = `/api/v1/tracker/offers/{id}/urls/{urlId}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"urlId"}}`, encodeURIComponent(String(requestParameters['urlId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerOffersIdUrlsUrlIdPutRequestToJSON(requestParameters['apiV1TrackerOffersIdUrlsUrlIdPutRequest']),
        };
    }

    /**
     * Writes only the columns the payload carries, so saving one row cannot clobber fields another editor changed. 
     * Update one landing URL.
     */
    async apiV1TrackerOffersIdUrlsUrlIdPutRaw(requestParameters: ApiV1TrackerOffersIdUrlsUrlIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerOffersIdUrlsUrlIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Writes only the columns the payload carries, so saving one row cannot clobber fields another editor changed. 
     * Update one landing URL.
     */
    async apiV1TrackerOffersIdUrlsUrlIdPut(requestParameters: ApiV1TrackerOffersIdUrlsUrlIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerOffersIdUrlsUrlIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerOffersPost without sending the request
     */
    async apiV1TrackerOffersPostRequestOpts(requestParameters: ApiV1TrackerOffersPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerOffersPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerOffersPostRequest',
                'Required parameter "apiV1TrackerOffersPostRequest" was null or undefined when calling apiV1TrackerOffersPost().'
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

        let urlPath = `/api/v1/tracker/offers`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerOffersPostRequestToJSON(requestParameters['apiV1TrackerOffersPostRequest']),
        };
    }

    /**
     * Creates the offer and its first landing URL in one call. Give either `destination_url` for a single URL or `urls` for a weighted rotator. 
     * Create an offer.
     */
    async apiV1TrackerOffersPostRaw(requestParameters: ApiV1TrackerOffersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerOffersPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Creates the offer and its first landing URL in one call. Give either `destination_url` for a single URL or `urls` for a weighted rotator. 
     * Create an offer.
     */
    async apiV1TrackerOffersPost(requestParameters: ApiV1TrackerOffersPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerOffersPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
