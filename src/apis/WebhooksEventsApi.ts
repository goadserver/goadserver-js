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
  ApiV1EventsGet200Response,
  ApiV1WebhooksGet200Response,
  ApiV1WebhooksIdDelete200Response,
  ApiV1WebhooksIdDeliveriesGet200Response,
  ApiV1WebhooksIdPatchRequest,
  ApiV1WebhooksIdRotateSecretPostRequest,
  ApiV1WebhooksIdTestPost200Response,
  ApiV1WebhooksPost201Response,
  ApiV1WebhooksPostRequest,
} from '../models/index';
import {
    ApiV1EventsGet200ResponseFromJSON,
    ApiV1EventsGet200ResponseToJSON,
    ApiV1WebhooksGet200ResponseFromJSON,
    ApiV1WebhooksGet200ResponseToJSON,
    ApiV1WebhooksIdDelete200ResponseFromJSON,
    ApiV1WebhooksIdDelete200ResponseToJSON,
    ApiV1WebhooksIdDeliveriesGet200ResponseFromJSON,
    ApiV1WebhooksIdDeliveriesGet200ResponseToJSON,
    ApiV1WebhooksIdPatchRequestFromJSON,
    ApiV1WebhooksIdPatchRequestToJSON,
    ApiV1WebhooksIdRotateSecretPostRequestFromJSON,
    ApiV1WebhooksIdRotateSecretPostRequestToJSON,
    ApiV1WebhooksIdTestPost200ResponseFromJSON,
    ApiV1WebhooksIdTestPost200ResponseToJSON,
    ApiV1WebhooksPost201ResponseFromJSON,
    ApiV1WebhooksPost201ResponseToJSON,
    ApiV1WebhooksPostRequestFromJSON,
    ApiV1WebhooksPostRequestToJSON,
} from '../models/index';

export interface ApiV1EventsGetRequest {
    since?: string;
    types?: string;
    limit?: number;
}

export interface ApiV1WebhooksIdDeleteRequest {
    id: number;
}

export interface ApiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequest {
    id: number;
    delivery: number;
}

export interface ApiV1WebhooksIdDeliveriesGetRequest {
    id: number;
    status?: ApiV1WebhooksIdDeliveriesGetStatusEnum;
    limit?: number;
}

export interface ApiV1WebhooksIdGetRequest {
    id: number;
}

export interface ApiV1WebhooksIdPatchOperationRequest {
    id: number;
    apiV1WebhooksIdPatchRequest: ApiV1WebhooksIdPatchRequest;
}

export interface ApiV1WebhooksIdRotateSecretPostOperationRequest {
    id: number;
    apiV1WebhooksIdRotateSecretPostRequest?: ApiV1WebhooksIdRotateSecretPostRequest;
}

export interface ApiV1WebhooksIdTestPostRequest {
    id: number;
}

export interface ApiV1WebhooksPostOperationRequest {
    apiV1WebhooksPostRequest: ApiV1WebhooksPostRequest;
}

/**
 * 
 */
export class WebhooksEventsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1EventsGet without sending the request
     */
    async apiV1EventsGetRequestOpts(requestParameters: ApiV1EventsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['since'] != null) {
            queryParameters['since'] = requestParameters['since'];
        }

        if (requestParameters['types'] != null) {
            queryParameters['types'] = requestParameters['types'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/events`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The same events the webhooks carry, for agents that cannot receive webhooks. Oldest first, kept **7 days**. Page with the cursor: pass `next_cursor` from one answer as `since` in the next; `has_more` says whether to call again at once. `since=now` returns no events, only the current cursor — the way to start following from now.  Only the events this credential may see are returned: each event needs the scope of what it is about (see the tag description), and a key pinned to campaigns, ad spaces or sites only sees events about those (and never the account-wide `conversion.summary`). The cursor moves past events you may not see, so a reader never stalls.  Events are recorded only for accounts that have a live API key, a connected app or a webhook. `conversion.received` is never in the feed (webhook opt-in only). 
     * Read the account\'s event feed.
     */
    async apiV1EventsGetRaw(requestParameters: ApiV1EventsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1EventsGet200Response>> {
        const requestOptions = await this.apiV1EventsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1EventsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The same events the webhooks carry, for agents that cannot receive webhooks. Oldest first, kept **7 days**. Page with the cursor: pass `next_cursor` from one answer as `since` in the next; `has_more` says whether to call again at once. `since=now` returns no events, only the current cursor — the way to start following from now.  Only the events this credential may see are returned: each event needs the scope of what it is about (see the tag description), and a key pinned to campaigns, ad spaces or sites only sees events about those (and never the account-wide `conversion.summary`). The cursor moves past events you may not see, so a reader never stalls.  Events are recorded only for accounts that have a live API key, a connected app or a webhook. `conversion.received` is never in the feed (webhook opt-in only). 
     * Read the account\'s event feed.
     */
    async apiV1EventsGet(requestParameters: ApiV1EventsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1EventsGet200Response> {
        const response = await this.apiV1EventsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksGet without sending the request
     */
    async apiV1WebhooksGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/webhooks`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * An API key or app sees the webhooks **it** created (the panel shows all of the account\'s). `available_events` lists the events this credential may subscribe to; `limit` is the per-account cap (20). 
     * List webhooks.
     */
    async apiV1WebhooksGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksGet200Response>> {
        const requestOptions = await this.apiV1WebhooksGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksGet200ResponseFromJSON(jsonValue));
    }

    /**
     * An API key or app sees the webhooks **it** created (the panel shows all of the account\'s). `available_events` lists the events this credential may subscribe to; `limit` is the per-account cap (20). 
     * List webhooks.
     */
    async apiV1WebhooksGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksGet200Response> {
        const response = await this.apiV1WebhooksGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdDelete without sending the request
     */
    async apiV1WebhooksIdDeleteRequestOpts(requestParameters: ApiV1WebhooksIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdDelete().'
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

        let urlPath = `/api/v1/webhooks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deliveries still waiting for it are dropped and never sent.
     * Remove a webhook.
     */
    async apiV1WebhooksIdDeleteRaw(requestParameters: ApiV1WebhooksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdDelete200Response>> {
        const requestOptions = await this.apiV1WebhooksIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Deliveries still waiting for it are dropped and never sent.
     * Remove a webhook.
     */
    async apiV1WebhooksIdDelete(requestParameters: ApiV1WebhooksIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdDelete200Response> {
        const response = await this.apiV1WebhooksIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdDeliveriesDeliveryRedeliverPost without sending the request
     */
    async apiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequestOpts(requestParameters: ApiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdDeliveriesDeliveryRedeliverPost().'
            );
        }

        if (requestParameters['delivery'] == null) {
            throw new runtime.RequiredError(
                'delivery',
                'Required parameter "delivery" was null or undefined when calling apiV1WebhooksIdDeliveriesDeliveryRedeliverPost().'
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

        let urlPath = `/api/v1/webhooks/{id}/deliveries/{delivery}/redeliver`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));
        urlPath = urlPath.replace(`{${"delivery"}}`, encodeURIComponent(String(requestParameters['delivery'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delivered, failed or waiting — it is queued again with its original event id. The content comes from the 7-day event feed when the delivery itself no longer holds it (410 after that). 
     * Send a delivery again.
     */
    async apiV1WebhooksIdDeliveriesDeliveryRedeliverPostRaw(requestParameters: ApiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdDelete200Response>> {
        const requestOptions = await this.apiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Delivered, failed or waiting — it is queued again with its original event id. The content comes from the 7-day event feed when the delivery itself no longer holds it (410 after that). 
     * Send a delivery again.
     */
    async apiV1WebhooksIdDeliveriesDeliveryRedeliverPost(requestParameters: ApiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdDelete200Response> {
        const response = await this.apiV1WebhooksIdDeliveriesDeliveryRedeliverPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdDeliveriesGet without sending the request
     */
    async apiV1WebhooksIdDeliveriesGetRequestOpts(requestParameters: ApiV1WebhooksIdDeliveriesGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdDeliveriesGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/webhooks/{id}/deliveries`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The last 30 days, newest first.
     * List a webhook\'s deliveries.
     */
    async apiV1WebhooksIdDeliveriesGetRaw(requestParameters: ApiV1WebhooksIdDeliveriesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdDeliveriesGet200Response>> {
        const requestOptions = await this.apiV1WebhooksIdDeliveriesGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdDeliveriesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The last 30 days, newest first.
     * List a webhook\'s deliveries.
     */
    async apiV1WebhooksIdDeliveriesGet(requestParameters: ApiV1WebhooksIdDeliveriesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdDeliveriesGet200Response> {
        const response = await this.apiV1WebhooksIdDeliveriesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdGet without sending the request
     */
    async apiV1WebhooksIdGetRequestOpts(requestParameters: ApiV1WebhooksIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdGet().'
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

        let urlPath = `/api/v1/webhooks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get one webhook.
     */
    async apiV1WebhooksIdGetRaw(requestParameters: ApiV1WebhooksIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksPost201Response>> {
        const requestOptions = await this.apiV1WebhooksIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksPost201ResponseFromJSON(jsonValue));
    }

    /**
     * Get one webhook.
     */
    async apiV1WebhooksIdGet(requestParameters: ApiV1WebhooksIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksPost201Response> {
        const response = await this.apiV1WebhooksIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdPatch without sending the request
     */
    async apiV1WebhooksIdPatchRequestOpts(requestParameters: ApiV1WebhooksIdPatchOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdPatch().'
            );
        }

        if (requestParameters['apiV1WebhooksIdPatchRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1WebhooksIdPatchRequest',
                'Required parameter "apiV1WebhooksIdPatchRequest" was null or undefined when calling apiV1WebhooksIdPatch().'
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

        let urlPath = `/api/v1/webhooks/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1WebhooksIdPatchRequestToJSON(requestParameters['apiV1WebhooksIdPatchRequest']),
        };
    }

    /**
     * Omitted fields keep their value; the result is validated like a create. `status: paused` stops new events (read them from `/api/v1/events` meanwhile — kept 7 days) and holds what was already queued; `active` resumes and sends what was held. An event taken off the webhook drops its waiting deliveries. The secret stays. 
     * Edit, pause or resume a webhook.
     */
    async apiV1WebhooksIdPatchRaw(requestParameters: ApiV1WebhooksIdPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksPost201Response>> {
        const requestOptions = await this.apiV1WebhooksIdPatchRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksPost201ResponseFromJSON(jsonValue));
    }

    /**
     * Omitted fields keep their value; the result is validated like a create. `status: paused` stops new events (read them from `/api/v1/events` meanwhile — kept 7 days) and holds what was already queued; `active` resumes and sends what was held. An event taken off the webhook drops its waiting deliveries. The secret stays. 
     * Edit, pause or resume a webhook.
     */
    async apiV1WebhooksIdPatch(requestParameters: ApiV1WebhooksIdPatchOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksPost201Response> {
        const response = await this.apiV1WebhooksIdPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdRotateSecretPost without sending the request
     */
    async apiV1WebhooksIdRotateSecretPostRequestOpts(requestParameters: ApiV1WebhooksIdRotateSecretPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdRotateSecretPost().'
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

        let urlPath = `/api/v1/webhooks/{id}/rotate-secret`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1WebhooksIdRotateSecretPostRequestToJSON(requestParameters['apiV1WebhooksIdRotateSecretPostRequest']),
        };
    }

    /**
     * For `overlap_hours` (0..168, default 24) the previous secret keeps signing too — two `v1=` values — so you can switch whenever you like. `0` ends the old secret at once. The new `secret` is in the answer only. 
     * Issue a new signing secret.
     */
    async apiV1WebhooksIdRotateSecretPostRaw(requestParameters: ApiV1WebhooksIdRotateSecretPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksPost201Response>> {
        const requestOptions = await this.apiV1WebhooksIdRotateSecretPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksPost201ResponseFromJSON(jsonValue));
    }

    /**
     * For `overlap_hours` (0..168, default 24) the previous secret keeps signing too — two `v1=` values — so you can switch whenever you like. `0` ends the old secret at once. The new `secret` is in the answer only. 
     * Issue a new signing secret.
     */
    async apiV1WebhooksIdRotateSecretPost(requestParameters: ApiV1WebhooksIdRotateSecretPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksPost201Response> {
        const response = await this.apiV1WebhooksIdRotateSecretPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksIdTestPost without sending the request
     */
    async apiV1WebhooksIdTestPostRequestOpts(requestParameters: ApiV1WebhooksIdTestPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1WebhooksIdTestPost().'
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

        let urlPath = `/api/v1/webhooks/{id}/test`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sends a signed `webhook.test` event now and answers what the receiver said (`status` delivered / pending / dead, `http_status`, `error`). A paused webhook only queues it. 
     * Send a test ping.
     */
    async apiV1WebhooksIdTestPostRaw(requestParameters: ApiV1WebhooksIdTestPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksIdTestPost200Response>> {
        const requestOptions = await this.apiV1WebhooksIdTestPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksIdTestPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Sends a signed `webhook.test` event now and answers what the receiver said (`status` delivered / pending / dead, `http_status`, `error`). A paused webhook only queues it. 
     * Send a test ping.
     */
    async apiV1WebhooksIdTestPost(requestParameters: ApiV1WebhooksIdTestPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksIdTestPost200Response> {
        const response = await this.apiV1WebhooksIdTestPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1WebhooksPost without sending the request
     */
    async apiV1WebhooksPostRequestOpts(requestParameters: ApiV1WebhooksPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1WebhooksPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1WebhooksPostRequest',
                'Required parameter "apiV1WebhooksPostRequest" was null or undefined when calling apiV1WebhooksPost().'
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

        let urlPath = `/api/v1/webhooks`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1WebhooksPostRequestToJSON(requestParameters['apiV1WebhooksPostRequest']),
        };
    }

    /**
     * Returns the signing `secret` (`whsec_…`) **once**. Every delivery is a POST of the event envelope with `X-Integration-Event`, `X-Integration-Delivery` (the event id — dedupe on it, delivery is at-least-once), `X-Integration-Key-Id` and `X-Integration-Signature: t=<unix>,v1=<hex HMAC-SHA256(secret, \"<t>.<body>\")>` (check every `v1`; during a secret rotation there are two). Answer 2xx within 10 s. Failures retry after 1 m, 5 m, 15 m, 1 h, 3 h, 6 h, 12 h, 24 h; a 4xx other than 408/429 is final; redirects are not followed. 20 failures in a row over a day pause the webhook (`paused_reason: auto_failing`). Events are queued within about a minute (state changes detected by the server\'s checks within about two to five).  The URL must be a public `https://` address — private, loopback, link-local, metadata and reserved addresses are refused, when saved and again when sent. Each event must be one this credential may see (422 names the missing scope). Unknown body fields are refused. 
     * Create a webhook.
     */
    async apiV1WebhooksPostRaw(requestParameters: ApiV1WebhooksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1WebhooksPost201Response>> {
        const requestOptions = await this.apiV1WebhooksPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1WebhooksPost201ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the signing `secret` (`whsec_…`) **once**. Every delivery is a POST of the event envelope with `X-Integration-Event`, `X-Integration-Delivery` (the event id — dedupe on it, delivery is at-least-once), `X-Integration-Key-Id` and `X-Integration-Signature: t=<unix>,v1=<hex HMAC-SHA256(secret, \"<t>.<body>\")>` (check every `v1`; during a secret rotation there are two). Answer 2xx within 10 s. Failures retry after 1 m, 5 m, 15 m, 1 h, 3 h, 6 h, 12 h, 24 h; a 4xx other than 408/429 is final; redirects are not followed. 20 failures in a row over a day pause the webhook (`paused_reason: auto_failing`). Events are queued within about a minute (state changes detected by the server\'s checks within about two to five).  The URL must be a public `https://` address — private, loopback, link-local, metadata and reserved addresses are refused, when saved and again when sent. Each event must be one this credential may see (422 names the missing scope). Unknown body fields are refused. 
     * Create a webhook.
     */
    async apiV1WebhooksPost(requestParameters: ApiV1WebhooksPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1WebhooksPost201Response> {
        const response = await this.apiV1WebhooksPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1WebhooksIdDeliveriesGetStatusEnum = {
    Pending: 'pending',
    Sending: 'sending',
    Delivered: 'delivered',
    Dead: 'dead'
} as const;
export type ApiV1WebhooksIdDeliveriesGetStatusEnum = typeof ApiV1WebhooksIdDeliveriesGetStatusEnum[keyof typeof ApiV1WebhooksIdDeliveriesGetStatusEnum];
