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
  ApiV1PublisherPushDeliveryRulesGet200Response,
  ApiV1PublisherPushDeliveryRulesIdPutRequest,
  ApiV1PublisherPushDeliveryRulesPostRequest,
  ApiV1PublisherPushSegmentsGet200Response,
  ApiV1PublisherPushSegmentsIdPutRequest,
  ApiV1PublisherPushSegmentsPostRequest,
  ApiV1PublisherPushSetupGet200Response,
  ApiV1PublisherPushStatsGet200Response,
  ApiV1PublisherPushSubscribersActionPost200Response,
  ApiV1PublisherPushSubscribersActionPostRequest,
  ApiV1PublisherPushSubscribersGet200Response,
} from '../models/index';
import {
    ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseToJSON,
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1PublisherPushDeliveryRulesGet200ResponseFromJSON,
    ApiV1PublisherPushDeliveryRulesGet200ResponseToJSON,
    ApiV1PublisherPushDeliveryRulesIdPutRequestFromJSON,
    ApiV1PublisherPushDeliveryRulesIdPutRequestToJSON,
    ApiV1PublisherPushDeliveryRulesPostRequestFromJSON,
    ApiV1PublisherPushDeliveryRulesPostRequestToJSON,
    ApiV1PublisherPushSegmentsGet200ResponseFromJSON,
    ApiV1PublisherPushSegmentsGet200ResponseToJSON,
    ApiV1PublisherPushSegmentsIdPutRequestFromJSON,
    ApiV1PublisherPushSegmentsIdPutRequestToJSON,
    ApiV1PublisherPushSegmentsPostRequestFromJSON,
    ApiV1PublisherPushSegmentsPostRequestToJSON,
    ApiV1PublisherPushSetupGet200ResponseFromJSON,
    ApiV1PublisherPushSetupGet200ResponseToJSON,
    ApiV1PublisherPushStatsGet200ResponseFromJSON,
    ApiV1PublisherPushStatsGet200ResponseToJSON,
    ApiV1PublisherPushSubscribersActionPost200ResponseFromJSON,
    ApiV1PublisherPushSubscribersActionPost200ResponseToJSON,
    ApiV1PublisherPushSubscribersActionPostRequestFromJSON,
    ApiV1PublisherPushSubscribersActionPostRequestToJSON,
    ApiV1PublisherPushSubscribersGet200ResponseFromJSON,
    ApiV1PublisherPushSubscribersGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1PublisherPushDeliveryRulesIdDeleteRequest {
    id: number;
}

export interface ApiV1PublisherPushDeliveryRulesIdPutOperationRequest {
    id: number;
    apiV1PublisherPushDeliveryRulesIdPutRequest: ApiV1PublisherPushDeliveryRulesIdPutRequest;
}

export interface ApiV1PublisherPushDeliveryRulesPostOperationRequest {
    apiV1PublisherPushDeliveryRulesPostRequest: ApiV1PublisherPushDeliveryRulesPostRequest;
}

export interface ApiV1PublisherPushSegmentsIdDeleteRequest {
    id: number;
}

export interface ApiV1PublisherPushSegmentsIdPutOperationRequest {
    id: number;
    apiV1PublisherPushSegmentsIdPutRequest: ApiV1PublisherPushSegmentsIdPutRequest;
}

export interface ApiV1PublisherPushSegmentsPostOperationRequest {
    apiV1PublisherPushSegmentsPostRequest: ApiV1PublisherPushSegmentsPostRequest;
}

export interface ApiV1PublisherPushStatsGetRequest {
    days?: number;
}

export interface ApiV1PublisherPushSubscribersActionPostOperationRequest {
    apiV1PublisherPushSubscribersActionPostRequest: ApiV1PublisherPushSubscribersActionPostRequest;
}

export interface ApiV1PublisherPushSubscribersGetRequest {
    days?: number;
}

/**
 * 
 */
export class PushAudienceApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1PublisherPushDeliveryRulesGet without sending the request
     */
    async apiV1PublisherPushDeliveryRulesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/push-delivery-rules`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns up to 200 rules, newest first, each with the outcome of its last run (sent / failed / no-ad counts). 
     * List standing delivery rules.
     */
    async apiV1PublisherPushDeliveryRulesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushDeliveryRulesGet200Response>> {
        const requestOptions = await this.apiV1PublisherPushDeliveryRulesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushDeliveryRulesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns up to 200 rules, newest first, each with the outcome of its last run (sent / failed / no-ad counts). 
     * List standing delivery rules.
     */
    async apiV1PublisherPushDeliveryRulesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushDeliveryRulesGet200Response> {
        const response = await this.apiV1PublisherPushDeliveryRulesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushDeliveryRulesIdDelete without sending the request
     */
    async apiV1PublisherPushDeliveryRulesIdDeleteRequestOpts(requestParameters: ApiV1PublisherPushDeliveryRulesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherPushDeliveryRulesIdDelete().'
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

        let urlPath = `/api/v1/publisher/push-delivery-rules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a delivery rule.
     */
    async apiV1PublisherPushDeliveryRulesIdDeleteRaw(requestParameters: ApiV1PublisherPushDeliveryRulesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1PublisherPushDeliveryRulesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Delete a delivery rule.
     */
    async apiV1PublisherPushDeliveryRulesIdDelete(requestParameters: ApiV1PublisherPushDeliveryRulesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1PublisherPushDeliveryRulesIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushDeliveryRulesIdPut without sending the request
     */
    async apiV1PublisherPushDeliveryRulesIdPutRequestOpts(requestParameters: ApiV1PublisherPushDeliveryRulesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherPushDeliveryRulesIdPut().'
            );
        }

        if (requestParameters['apiV1PublisherPushDeliveryRulesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherPushDeliveryRulesIdPutRequest',
                'Required parameter "apiV1PublisherPushDeliveryRulesIdPutRequest" was null or undefined when calling apiV1PublisherPushDeliveryRulesIdPut().'
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

        let urlPath = `/api/v1/publisher/push-delivery-rules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherPushDeliveryRulesIdPutRequestToJSON(requestParameters['apiV1PublisherPushDeliveryRulesIdPutRequest']),
        };
    }

    /**
     * Full replace, including `is_active` — this is also how a rule is paused and resumed. 
     * Update a delivery rule.
     */
    async apiV1PublisherPushDeliveryRulesIdPutRaw(requestParameters: ApiV1PublisherPushDeliveryRulesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1PublisherPushDeliveryRulesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Full replace, including `is_active` — this is also how a rule is paused and resumed. 
     * Update a delivery rule.
     */
    async apiV1PublisherPushDeliveryRulesIdPut(requestParameters: ApiV1PublisherPushDeliveryRulesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1PublisherPushDeliveryRulesIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushDeliveryRulesPost without sending the request
     */
    async apiV1PublisherPushDeliveryRulesPostRequestOpts(requestParameters: ApiV1PublisherPushDeliveryRulesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherPushDeliveryRulesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherPushDeliveryRulesPostRequest',
                'Required parameter "apiV1PublisherPushDeliveryRulesPostRequest" was null or undefined when calling apiV1PublisherPushDeliveryRulesPost().'
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

        let urlPath = `/api/v1/publisher/push-delivery-rules`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherPushDeliveryRulesPostRequestToJSON(requestParameters['apiV1PublisherPushDeliveryRulesPostRequest']),
        };
    }

    /**
     * `segment_id` must be a segment you own, or 0 for the whole active audience. `cadence_hours` below 1 is rejected into the 24h default; the other numeric knobs clamp to >= 0. 
     * Create a delivery rule.
     */
    async apiV1PublisherPushDeliveryRulesPostRaw(requestParameters: ApiV1PublisherPushDeliveryRulesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1PublisherPushDeliveryRulesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `segment_id` must be a segment you own, or 0 for the whole active audience. `cadence_hours` below 1 is rejected into the 24h default; the other numeric knobs clamp to >= 0. 
     * Create a delivery rule.
     */
    async apiV1PublisherPushDeliveryRulesPost(requestParameters: ApiV1PublisherPushDeliveryRulesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1PublisherPushDeliveryRulesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSegmentsGet without sending the request
     */
    async apiV1PublisherPushSegmentsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/push-segments`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns up to 200 segments, newest first. Each carries `subscriber_count` — how many of the caller\'s subscribers match the segment right now, counted live. 
     * List saved audience segments.
     */
    async apiV1PublisherPushSegmentsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushSegmentsGet200Response>> {
        const requestOptions = await this.apiV1PublisherPushSegmentsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushSegmentsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Returns up to 200 segments, newest first. Each carries `subscriber_count` — how many of the caller\'s subscribers match the segment right now, counted live. 
     * List saved audience segments.
     */
    async apiV1PublisherPushSegmentsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushSegmentsGet200Response> {
        const response = await this.apiV1PublisherPushSegmentsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSegmentsIdDelete without sending the request
     */
    async apiV1PublisherPushSegmentsIdDeleteRequestOpts(requestParameters: ApiV1PublisherPushSegmentsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherPushSegmentsIdDelete().'
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

        let urlPath = `/api/v1/publisher/push-segments/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deletes the segment. Delivery rules that referenced it keep running against the whole active audience. 
     * Delete an audience segment.
     */
    async apiV1PublisherPushSegmentsIdDeleteRaw(requestParameters: ApiV1PublisherPushSegmentsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1PublisherPushSegmentsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Deletes the segment. Delivery rules that referenced it keep running against the whole active audience. 
     * Delete an audience segment.
     */
    async apiV1PublisherPushSegmentsIdDelete(requestParameters: ApiV1PublisherPushSegmentsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1PublisherPushSegmentsIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSegmentsIdPut without sending the request
     */
    async apiV1PublisherPushSegmentsIdPutRequestOpts(requestParameters: ApiV1PublisherPushSegmentsIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherPushSegmentsIdPut().'
            );
        }

        if (requestParameters['apiV1PublisherPushSegmentsIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherPushSegmentsIdPutRequest',
                'Required parameter "apiV1PublisherPushSegmentsIdPutRequest" was null or undefined when calling apiV1PublisherPushSegmentsIdPut().'
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

        let urlPath = `/api/v1/publisher/push-segments/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherPushSegmentsIdPutRequestToJSON(requestParameters['apiV1PublisherPushSegmentsIdPutRequest']),
        };
    }

    /**
     * Full replace — every omitted criterion resets to its zero value. Saving identical values is a no-op, not a 404. 
     * Update an audience segment.
     */
    async apiV1PublisherPushSegmentsIdPutRaw(requestParameters: ApiV1PublisherPushSegmentsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1PublisherPushSegmentsIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Full replace — every omitted criterion resets to its zero value. Saving identical values is a no-op, not a 404. 
     * Update an audience segment.
     */
    async apiV1PublisherPushSegmentsIdPut(requestParameters: ApiV1PublisherPushSegmentsIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1PublisherPushSegmentsIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSegmentsPost without sending the request
     */
    async apiV1PublisherPushSegmentsPostRequestOpts(requestParameters: ApiV1PublisherPushSegmentsPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherPushSegmentsPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherPushSegmentsPostRequest',
                'Required parameter "apiV1PublisherPushSegmentsPostRequest" was null or undefined when calling apiV1PublisherPushSegmentsPost().'
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

        let urlPath = `/api/v1/publisher/push-segments`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherPushSegmentsPostRequestToJSON(requestParameters['apiV1PublisherPushSegmentsPostRequest']),
        };
    }

    /**
     * Every criterion is optional and they AND together — a segment with no criteria set matches the whole audience. Only `name` is required. Numeric criteria are clamped to >= 0. 
     * Create an audience segment.
     */
    async apiV1PublisherPushSegmentsPostRaw(requestParameters: ApiV1PublisherPushSegmentsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1PublisherPushSegmentsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Every criterion is optional and they AND together — a segment with no criteria set matches the whole audience. Only `name` is required. Numeric criteria are clamped to >= 0. 
     * Create an audience segment.
     */
    async apiV1PublisherPushSegmentsPost(requestParameters: ApiV1PublisherPushSegmentsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1PublisherPushSegmentsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSetupGet without sending the request
     */
    async apiV1PublisherPushSetupGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/push-setup`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Everything needed to wire the web-push opt-in collector onto a landing page: the ad host the collector and service worker are served from, the service-worker path this network expects, and every pushads adzone you own with its ad domain, captured subscriber count and most recent opt-in. Read-only — nothing is generated or registered by calling it. 
     * Collector setup facts for the opt-in script.
     */
    async apiV1PublisherPushSetupGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushSetupGet200Response>> {
        const requestOptions = await this.apiV1PublisherPushSetupGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushSetupGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Everything needed to wire the web-push opt-in collector onto a landing page: the ad host the collector and service worker are served from, the service-worker path this network expects, and every pushads adzone you own with its ad domain, captured subscriber count and most recent opt-in. Read-only — nothing is generated or registered by calling it. 
     * Collector setup facts for the opt-in script.
     */
    async apiV1PublisherPushSetupGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushSetupGet200Response> {
        const response = await this.apiV1PublisherPushSetupGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushStatsGet without sending the request
     */
    async apiV1PublisherPushStatsGetRequestOpts(requestParameters: ApiV1PublisherPushStatsGetRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/api/v1/publisher/push-stats`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delivery, clicks and revenue for auctioned pushes served on the caller\'s pushads adzones, paired with subscriber growth over the same window. Revenue is in the account currency. 
     * Push delivery performance.
     */
    async apiV1PublisherPushStatsGetRaw(requestParameters: ApiV1PublisherPushStatsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushStatsGet200Response>> {
        const requestOptions = await this.apiV1PublisherPushStatsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushStatsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Delivery, clicks and revenue for auctioned pushes served on the caller\'s pushads adzones, paired with subscriber growth over the same window. Revenue is in the account currency. 
     * Push delivery performance.
     */
    async apiV1PublisherPushStatsGet(requestParameters: ApiV1PublisherPushStatsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushStatsGet200Response> {
        const response = await this.apiV1PublisherPushStatsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSubscribersActionPost without sending the request
     */
    async apiV1PublisherPushSubscribersActionPostRequestOpts(requestParameters: ApiV1PublisherPushSubscribersActionPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherPushSubscribersActionPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherPushSubscribersActionPostRequest',
                'Required parameter "apiV1PublisherPushSubscribersActionPostRequest" was null or undefined when calling apiV1PublisherPushSubscribersActionPost().'
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

        let urlPath = `/api/v1/publisher/push-subscribers/action`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherPushSubscribersActionPostRequestToJSON(requestParameters['apiV1PublisherPushSubscribersActionPostRequest']),
        };
    }

    /**
     * One action over up to 5000 subscriber ids. Ids that are not the caller\'s are silently skipped — `affected` reports how many rows actually changed. 
     * Activate, deactivate or delete subscribers in bulk.
     */
    async apiV1PublisherPushSubscribersActionPostRaw(requestParameters: ApiV1PublisherPushSubscribersActionPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushSubscribersActionPost200Response>> {
        const requestOptions = await this.apiV1PublisherPushSubscribersActionPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushSubscribersActionPost200ResponseFromJSON(jsonValue));
    }

    /**
     * One action over up to 5000 subscriber ids. Ids that are not the caller\'s are silently skipped — `affected` reports how many rows actually changed. 
     * Activate, deactivate or delete subscribers in bulk.
     */
    async apiV1PublisherPushSubscribersActionPost(requestParameters: ApiV1PublisherPushSubscribersActionPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushSubscribersActionPost200Response> {
        const response = await this.apiV1PublisherPushSubscribersActionPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherPushSubscribersGet without sending the request
     */
    async apiV1PublisherPushSubscribersGetRequestOpts(requestParameters: ApiV1PublisherPushSubscribersGetRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/api/v1/publisher/push-subscribers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The caller\'s opt-ins within the trailing window, newest first, capped at 1000 rows — alongside lifetime totals so you can size the audience without paging. Subscriber IPs are masked to a /24 (IPv4) or /48 (IPv6) prefix on the way out. 
     * List captured push subscribers.
     */
    async apiV1PublisherPushSubscribersGetRaw(requestParameters: ApiV1PublisherPushSubscribersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushSubscribersGet200Response>> {
        const requestOptions = await this.apiV1PublisherPushSubscribersGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushSubscribersGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The caller\'s opt-ins within the trailing window, newest first, capped at 1000 rows — alongside lifetime totals so you can size the audience without paging. Subscriber IPs are masked to a /24 (IPv4) or /48 (IPv6) prefix on the way out. 
     * List captured push subscribers.
     */
    async apiV1PublisherPushSubscribersGet(requestParameters: ApiV1PublisherPushSubscribersGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushSubscribersGet200Response> {
        const response = await this.apiV1PublisherPushSubscribersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
