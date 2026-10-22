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
  ApiV1PublisherSspCampaignsIdTestRtbPostRequest,
  ApiV1PublisherSspCampaignsIdToggleDeletePutRequest,
  ApiV1PublisherSspCampaignsIdTogglePausePutRequest,
  ApiV1PublisherSspSellerDisclosurePutRequest,
  SspCampaignWrite,
} from '../models/index';
import {
    ApiV1PublisherSspCampaignsIdTestRtbPostRequestFromJSON,
    ApiV1PublisherSspCampaignsIdTestRtbPostRequestToJSON,
    ApiV1PublisherSspCampaignsIdToggleDeletePutRequestFromJSON,
    ApiV1PublisherSspCampaignsIdToggleDeletePutRequestToJSON,
    ApiV1PublisherSspCampaignsIdTogglePausePutRequestFromJSON,
    ApiV1PublisherSspCampaignsIdTogglePausePutRequestToJSON,
    ApiV1PublisherSspSellerDisclosurePutRequestFromJSON,
    ApiV1PublisherSspSellerDisclosurePutRequestToJSON,
    SspCampaignWriteFromJSON,
    SspCampaignWriteToJSON,
} from '../models/index';

export interface ApiV1PublisherSspCampaignsIdClonePostRequest {
    id: number;
}

export interface ApiV1PublisherSspCampaignsIdGetRequest {
    id: number;
}

export interface ApiV1PublisherSspCampaignsIdPutRequest {
    id: number;
    sspCampaignWrite: SspCampaignWrite;
}

export interface ApiV1PublisherSspCampaignsIdTestRtbGetRequest {
    id: number;
}

export interface ApiV1PublisherSspCampaignsIdTestRtbPostOperationRequest {
    id: number;
    apiV1PublisherSspCampaignsIdTestRtbPostRequest?: ApiV1PublisherSspCampaignsIdTestRtbPostRequest;
}

export interface ApiV1PublisherSspCampaignsIdToggleDeletePutOperationRequest {
    id: number;
    apiV1PublisherSspCampaignsIdToggleDeletePutRequest: ApiV1PublisherSspCampaignsIdToggleDeletePutRequest;
}

export interface ApiV1PublisherSspCampaignsIdTogglePausePutOperationRequest {
    id: number;
    apiV1PublisherSspCampaignsIdTogglePausePutRequest: ApiV1PublisherSspCampaignsIdTogglePausePutRequest;
}

export interface ApiV1PublisherSspCampaignsIdWlRonCampaignsGetRequest {
    id: number;
    adtype?: number;
    siteid?: number;
    search?: string;
    ids?: string;
}

export interface ApiV1PublisherSspCampaignsPostRequest {
    sspCampaignWrite: SspCampaignWrite;
}

export interface ApiV1PublisherSspNetworksGetRequest {
    page?: number;
    perPage?: number;
    sortBy?: ApiV1PublisherSspNetworksGetSortByEnum;
    sortDir?: ApiV1PublisherSspNetworksGetSortDirEnum;
    filterId?: number;
    filterName?: string;
}

export interface ApiV1PublisherSspSellerDisclosurePutOperationRequest {
    apiV1PublisherSspSellerDisclosurePutRequest: ApiV1PublisherSspSellerDisclosurePutRequest;
}

export interface ApiV1PublisherSspSitesIdAdsTxtCheckPostRequest {
    id: number;
}

export interface ApiV1PublisherSspSitesIdAdsTxtStatusGetRequest {
    id: number;
}

/**
 * 
 */
export class SSPCampaignsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1PublisherSspCampaignsGet without sending the request
     */
    async apiV1PublisherSspCampaignsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/campaigns`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every SSP campaign of the account, newest first, including paused and deleted ones (`campaignstate`: 0 active, 1 paused, 2 deleted). An SSP campaign is a feed that sells your inventory to — or buys RTB traffic from — another platform. The response is a bare JSON array, not paginated.  All SSP routes need one of the SSP rights (`mod_ssp`, `ssp_external`, `ssp_networks`, `ssp_exchange`, `ssp_headerbidding`) and answer for publisher and advertiser (ad-manager) accounts alike. Keys pinned to `adzone_ids` or `site_ids` are refused with `403 forbidden_resource`: a feed spans sites and zones the pin cannot follow. 
     * List SSP campaigns (feeds).
     */
    async apiV1PublisherSspCampaignsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Every SSP campaign of the account, newest first, including paused and deleted ones (`campaignstate`: 0 active, 1 paused, 2 deleted). An SSP campaign is a feed that sells your inventory to — or buys RTB traffic from — another platform. The response is a bare JSON array, not paginated.  All SSP routes need one of the SSP rights (`mod_ssp`, `ssp_external`, `ssp_networks`, `ssp_exchange`, `ssp_headerbidding`) and answer for publisher and advertiser (ad-manager) accounts alike. Keys pinned to `adzone_ids` or `site_ids` are refused with `403 forbidden_resource`: a feed spans sites and zones the pin cannot follow. 
     * List SSP campaigns (feeds).
     */
    async apiV1PublisherSspCampaignsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdClonePost without sending the request
     */
    async apiV1PublisherSspCampaignsIdClonePostRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdClonePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdClonePost().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}/clone`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Copies every column into a new campaign named `<name>(\'Copy\')`. A clone of an external/exchange feed gets its own fresh `hash`. No request body. 
     * Clone an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdClonePostRaw(requestParameters: ApiV1PublisherSspCampaignsIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdClonePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Copies every column into a new campaign named `<name>(\'Copy\')`. A clone of an external/exchange feed gets its own fresh `hash`. No request body. 
     * Clone an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdClonePost(requestParameters: ApiV1PublisherSspCampaignsIdClonePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdClonePostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdGet without sending the request
     */
    async apiV1PublisherSspCampaignsIdGetRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdGet().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The full campaign as the edit form loads it. Targeting lists come back as string arrays (`\"0\"`/empty = all). `json_zone_urls` is the stored `{zoneId: {url, active}}` map, `zone_urls` the same as an array with zone names. Note: the browser-language targeting is read back as `language` (comma-separated) but written as `browserlanguages`. 
     * Get one SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdGetRaw(requestParameters: ApiV1PublisherSspCampaignsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The full campaign as the edit form loads it. Targeting lists come back as string arrays (`\"0\"`/empty = all). `json_zone_urls` is the stored `{zoneId: {url, active}}` map, `zone_urls` the same as an array with zone names. Note: the browser-language targeting is read back as `language` (comma-separated) but written as `browserlanguages`. 
     * Get one SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdGet(requestParameters: ApiV1PublisherSspCampaignsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdPut without sending the request
     */
    async apiV1PublisherSspCampaignsIdPutRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdPutRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdPut().'
            );
        }

        if (requestParameters['sspCampaignWrite'] == null) {
            throw new runtime.RequiredError(
                'sspCampaignWrite',
                'Required parameter "sspCampaignWrite" was null or undefined when calling apiV1PublisherSspCampaignsIdPut().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SspCampaignWriteToJSON(requestParameters['sspCampaignWrite']),
        };
    }

    /**
     * **Full replace, not a patch**: every column is rewritten from the body, so a missing targeting list resets to \"all\" and a missing scalar to its default. Read the campaign first and send it back whole. Exceptions: `header_bidding` is locked to its create-time value, `dsp_ids` is kept unless an admin sets it, and an absent `bill_on_burl` keeps the stored value. Same validation (409) and `unknown_fields` (422) as create. 
     * Update an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdPutRaw(requestParameters: ApiV1PublisherSspCampaignsIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * **Full replace, not a patch**: every column is rewritten from the body, so a missing targeting list resets to \"all\" and a missing scalar to its default. Read the campaign first and send it back whole. Exceptions: `header_bidding` is locked to its create-time value, `dsp_ids` is kept unless an admin sets it, and an absent `bill_on_burl` keeps the stored value. Same validation (409) and `unknown_fields` (422) as create. 
     * Update an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdPut(requestParameters: ApiV1PublisherSspCampaignsIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdTestRtbGet without sending the request
     */
    async apiV1PublisherSspCampaignsIdTestRtbGetRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdTestRtbGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdTestRtbGet().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}/test-rtb`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The resolved ad type, request URL and RTB type of the campaign, the tenant\'s common banner sizes and the caller\'s IP/UA, as defaults for the POST.
     * Context for an RTB test request.
     */
    async apiV1PublisherSspCampaignsIdTestRtbGetRaw(requestParameters: ApiV1PublisherSspCampaignsIdTestRtbGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdTestRtbGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The resolved ad type, request URL and RTB type of the campaign, the tenant\'s common banner sizes and the caller\'s IP/UA, as defaults for the POST.
     * Context for an RTB test request.
     */
    async apiV1PublisherSspCampaignsIdTestRtbGet(requestParameters: ApiV1PublisherSspCampaignsIdTestRtbGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdTestRtbGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdTestRtbPost without sending the request
     */
    async apiV1PublisherSspCampaignsIdTestRtbPostRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdTestRtbPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdTestRtbPost().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}/test-rtb`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSspCampaignsIdTestRtbPostRequestToJSON(requestParameters['apiV1PublisherSspCampaignsIdTestRtbPostRequest']),
        };
    }

    /**
     * Builds a request the way the ad server would for this campaign, sends it (outbound to public addresses only) and classifies the answer. Every field is optional. **`bidfloor` and `best_price` are CPM in currency units.** 
     * Send one test bid request to the feed\'s endpoint.
     */
    async apiV1PublisherSspCampaignsIdTestRtbPostRaw(requestParameters: ApiV1PublisherSspCampaignsIdTestRtbPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdTestRtbPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Builds a request the way the ad server would for this campaign, sends it (outbound to public addresses only) and classifies the answer. Every field is optional. **`bidfloor` and `best_price` are CPM in currency units.** 
     * Send one test bid request to the feed\'s endpoint.
     */
    async apiV1PublisherSspCampaignsIdTestRtbPost(requestParameters: ApiV1PublisherSspCampaignsIdTestRtbPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdTestRtbPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdToggleDeletePut without sending the request
     */
    async apiV1PublisherSspCampaignsIdToggleDeletePutRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdToggleDeletePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdToggleDeletePut().'
            );
        }

        if (requestParameters['apiV1PublisherSspCampaignsIdToggleDeletePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSspCampaignsIdToggleDeletePutRequest',
                'Required parameter "apiV1PublisherSspCampaignsIdToggleDeletePutRequest" was null or undefined when calling apiV1PublisherSspCampaignsIdToggleDeletePut().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}/toggle-delete`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSspCampaignsIdToggleDeletePutRequestToJSON(requestParameters['apiV1PublisherSspCampaignsIdToggleDeletePutRequest']),
        };
    }

    /**
     * Soft delete (`isdeleted`). `{status: 0}` restores it.
     * Delete or restore an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdToggleDeletePutRaw(requestParameters: ApiV1PublisherSspCampaignsIdToggleDeletePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdToggleDeletePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Soft delete (`isdeleted`). `{status: 0}` restores it.
     * Delete or restore an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdToggleDeletePut(requestParameters: ApiV1PublisherSspCampaignsIdToggleDeletePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdToggleDeletePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdTogglePausePut without sending the request
     */
    async apiV1PublisherSspCampaignsIdTogglePausePutRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdTogglePausePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdTogglePausePut().'
            );
        }

        if (requestParameters['apiV1PublisherSspCampaignsIdTogglePausePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSspCampaignsIdTogglePausePutRequest',
                'Required parameter "apiV1PublisherSspCampaignsIdTogglePausePutRequest" was null or undefined when calling apiV1PublisherSspCampaignsIdTogglePausePut().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}/toggle-pause`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSspCampaignsIdTogglePausePutRequestToJSON(requestParameters['apiV1PublisherSspCampaignsIdTogglePausePutRequest']),
        };
    }

    /**
     * Pause or resume an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdTogglePausePutRaw(requestParameters: ApiV1PublisherSspCampaignsIdTogglePausePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdTogglePausePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Pause or resume an SSP campaign.
     */
    async apiV1PublisherSspCampaignsIdTogglePausePut(requestParameters: ApiV1PublisherSspCampaignsIdTogglePausePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdTogglePausePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsIdWlRonCampaignsGet without sending the request
     */
    async apiV1PublisherSspCampaignsIdWlRonCampaignsGetRequestOpts(requestParameters: ApiV1PublisherSspCampaignsIdWlRonCampaignsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspCampaignsIdWlRonCampaignsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['adtype'] != null) {
            queryParameters['adtype'] = requestParameters['adtype'];
        }

        if (requestParameters['siteid'] != null) {
            queryParameters['siteid'] = requestParameters['siteid'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['ids'] != null) {
            queryParameters['ids'] = requestParameters['ids'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/campaigns/{id}/wl-ron-campaigns`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Candidates for `wl_ron_campaign_ids`: RON campaigns of the feed\'s ad type (matching the site\'s main category when that module is on). `available: false` means the picker is off for this tenant (the `modules.publisher.connect_campaigns` module, ad-manager tenants only) — not an error. Use `id = 0` with `?adtype=` for a campaign that is not saved yet. `ids` echoes the current selection. 
     * RON campaigns that can be whitelisted on a feed.
     */
    async apiV1PublisherSspCampaignsIdWlRonCampaignsGetRaw(requestParameters: ApiV1PublisherSspCampaignsIdWlRonCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsIdWlRonCampaignsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Candidates for `wl_ron_campaign_ids`: RON campaigns of the feed\'s ad type (matching the site\'s main category when that module is on). `available: false` means the picker is off for this tenant (the `modules.publisher.connect_campaigns` module, ad-manager tenants only) — not an error. Use `id = 0` with `?adtype=` for a campaign that is not saved yet. `ids` echoes the current selection. 
     * RON campaigns that can be whitelisted on a feed.
     */
    async apiV1PublisherSspCampaignsIdWlRonCampaignsGet(requestParameters: ApiV1PublisherSspCampaignsIdWlRonCampaignsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsIdWlRonCampaignsGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsPost without sending the request
     */
    async apiV1PublisherSspCampaignsPostRequestOpts(requestParameters: ApiV1PublisherSspCampaignsPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sspCampaignWrite'] == null) {
            throw new runtime.RequiredError(
                'sspCampaignWrite',
                'Required parameter "sspCampaignWrite" was null or undefined when calling apiV1PublisherSspCampaignsPost().'
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

        let urlPath = `/api/v1/publisher/ssp/campaigns`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SspCampaignWriteToJSON(requestParameters['sspCampaignWrite']),
        };
    }

    /**
     * Same save path as the panel\'s SSP campaign form. New campaigns start **paused** (`ispaused = 1`); resume with `PUT /api/v1/publisher/ssp/campaigns/{id}/toggle-pause` `{status: 0}`. External and exchange campaigns get a fresh feed `hash` (their endpoint identity and the token for the SSP stats feed).  `ssptype`: - `ssp` — outgoing RTB to a network (`rtb_network` required).   `use_type`: 0 = one request URL, 1 = per-ad-zone URLs   (`zoneurls`), 2 = smart-zone RTB feed. - `external` — an incoming feed a partner calls (`siteid` required). - `exchange` — incoming exchange feed (`ssp_pct` 1–100 required). - `header_bidding: true` (external/exchange only) collapses the   campaign to Prebid slots (`slots` required).  Validation failures answer **409** with `{\"errors\": {\"<field>\": \"<CODE>\"}}` (codes such as `EMPTY_NAME`, `NO_NETWORK_ID_GIVEN`, `NO_WEBSITE_SELECTED`, `WEBSITE_NOT_FOUND`, `SSP_EXCHANGE_PCT_ERROR`, `HB_SLOTS_REQUIRED`) — the panel\'s shape, kept as is. Unknown body fields are refused with `422 unknown_fields`. 
     * Create an SSP campaign.
     */
    async apiV1PublisherSspCampaignsPostRaw(requestParameters: ApiV1PublisherSspCampaignsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Same save path as the panel\'s SSP campaign form. New campaigns start **paused** (`ispaused = 1`); resume with `PUT /api/v1/publisher/ssp/campaigns/{id}/toggle-pause` `{status: 0}`. External and exchange campaigns get a fresh feed `hash` (their endpoint identity and the token for the SSP stats feed).  `ssptype`: - `ssp` — outgoing RTB to a network (`rtb_network` required).   `use_type`: 0 = one request URL, 1 = per-ad-zone URLs   (`zoneurls`), 2 = smart-zone RTB feed. - `external` — an incoming feed a partner calls (`siteid` required). - `exchange` — incoming exchange feed (`ssp_pct` 1–100 required). - `header_bidding: true` (external/exchange only) collapses the   campaign to Prebid slots (`slots` required).  Validation failures answer **409** with `{\"errors\": {\"<field>\": \"<CODE>\"}}` (codes such as `EMPTY_NAME`, `NO_NETWORK_ID_GIVEN`, `NO_WEBSITE_SELECTED`, `WEBSITE_NOT_FOUND`, `SSP_EXCHANGE_PCT_ERROR`, `HB_SLOTS_REQUIRED`) — the panel\'s shape, kept as is. Unknown body fields are refused with `422 unknown_fields`. 
     * Create an SSP campaign.
     */
    async apiV1PublisherSspCampaignsPost(requestParameters: ApiV1PublisherSspCampaignsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspCampaignsSetupDataGet without sending the request
     */
    async apiV1PublisherSspCampaignsSetupDataGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/campaigns/setup-data`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Ad types, RTB networks, your websites, targeting lists (device types, OS, browsers, connection types, languages, carriers, IP pools, RTB categories, tier country lists), your other SSP campaigns, enabled modules, display-option config, and the values a partner needs to integrate (`ad_domain`, `rtb_domain`, `hb_endpoint`, `openrtb2_endpoint`, `sellers_json_url`, `ads_txt_line`, `seller_id`, `public_seller_disclosure`). In-app (Prebid Mobile, docs/IN_APP.md): the SDK\'s Prebid Server host is `openrtb2_endpoint`, its account id the campaign\'s token (`hash`), and each ad unit\'s config id names its adzone; apps send `app.bundle` instead of `site.page`, interstitial units `imp.instl`, rewarded ones `imp.rwdd` / `imp.ext.prebid.is_rewarded_inventory`. `ads_txt_line` goes in app-ads.txt on the app\'s developer website. 
     * Lookups for the SSP campaign form.
     */
    async apiV1PublisherSspCampaignsSetupDataGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspCampaignsSetupDataGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Ad types, RTB networks, your websites, targeting lists (device types, OS, browsers, connection types, languages, carriers, IP pools, RTB categories, tier country lists), your other SSP campaigns, enabled modules, display-option config, and the values a partner needs to integrate (`ad_domain`, `rtb_domain`, `hb_endpoint`, `openrtb2_endpoint`, `sellers_json_url`, `ads_txt_line`, `seller_id`, `public_seller_disclosure`). In-app (Prebid Mobile, docs/IN_APP.md): the SDK\'s Prebid Server host is `openrtb2_endpoint`, its account id the campaign\'s token (`hash`), and each ad unit\'s config id names its adzone; apps send `app.bundle` instead of `site.page`, interstitial units `imp.instl`, rewarded ones `imp.rwdd` / `imp.ext.prebid.is_rewarded_inventory`. `ads_txt_line` goes in app-ads.txt on the app\'s developer website. 
     * Lookups for the SSP campaign form.
     */
    async apiV1PublisherSspCampaignsSetupDataGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspCampaignsSetupDataGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspFiltersGet without sending the request
     */
    async apiV1PublisherSspFiltersGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/filters`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Filter values for the SSP campaign list.
     */
    async apiV1PublisherSspFiltersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspFiltersGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Filter values for the SSP campaign list.
     */
    async apiV1PublisherSspFiltersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspFiltersGetRaw(initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspNetworksGet without sending the request
     */
    async apiV1PublisherSspNetworksGetRequestOpts(requestParameters: ApiV1PublisherSspNetworksGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        if (requestParameters['sortBy'] != null) {
            queryParameters['sort_by'] = requestParameters['sortBy'];
        }

        if (requestParameters['sortDir'] != null) {
            queryParameters['sort_dir'] = requestParameters['sortDir'];
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterName'] != null) {
            queryParameters['filter_name'] = requestParameters['filterName'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/ssp/networks`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * RTB networks your SSP campaigns use.
     */
    async apiV1PublisherSspNetworksGetRaw(requestParameters: ApiV1PublisherSspNetworksGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspNetworksGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * RTB networks your SSP campaigns use.
     */
    async apiV1PublisherSspNetworksGet(requestParameters: ApiV1PublisherSspNetworksGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspNetworksGetRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspSellerDisclosurePut without sending the request
     */
    async apiV1PublisherSspSellerDisclosurePutRequestOpts(requestParameters: ApiV1PublisherSspSellerDisclosurePutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherSspSellerDisclosurePutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherSspSellerDisclosurePutRequest',
                'Required parameter "apiV1PublisherSspSellerDisclosurePutRequest" was null or undefined when calling apiV1PublisherSspSellerDisclosurePut().'
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

        let urlPath = `/api/v1/publisher/ssp/seller-disclosure`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherSspSellerDisclosurePutRequestToJSON(requestParameters['apiV1PublisherSspSellerDisclosurePutRequest']),
        };
    }

    /**
     * `true`: `/sellers.json` lists your company name and primary site domain. `false`: confidential, `seller_id` only (the default).
     * Publish or hide your name in sellers.json.
     */
    async apiV1PublisherSspSellerDisclosurePutRaw(requestParameters: ApiV1PublisherSspSellerDisclosurePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspSellerDisclosurePutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `true`: `/sellers.json` lists your company name and primary site domain. `false`: confidential, `seller_id` only (the default).
     * Publish or hide your name in sellers.json.
     */
    async apiV1PublisherSspSellerDisclosurePut(requestParameters: ApiV1PublisherSspSellerDisclosurePutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspSellerDisclosurePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspSitesIdAdsTxtCheckPost without sending the request
     */
    async apiV1PublisherSspSitesIdAdsTxtCheckPostRequestOpts(requestParameters: ApiV1PublisherSspSitesIdAdsTxtCheckPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspSitesIdAdsTxtCheckPost().'
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

        let urlPath = `/api/v1/publisher/ssp/sites/{id}/ads-txt-check`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Fetches `https://<site>/ads.txt`, looks for the network\'s line (`ad_domain`, your `seller_id`, `DIRECT`), stores and returns the result. Within the fetch cooldown the stored result is returned without a new fetch. No request body. 
     * Re-check a site\'s ads.txt now.
     */
    async apiV1PublisherSspSitesIdAdsTxtCheckPostRaw(requestParameters: ApiV1PublisherSspSitesIdAdsTxtCheckPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspSitesIdAdsTxtCheckPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Fetches `https://<site>/ads.txt`, looks for the network\'s line (`ad_domain`, your `seller_id`, `DIRECT`), stores and returns the result. Within the fetch cooldown the stored result is returned without a new fetch. No request body. 
     * Re-check a site\'s ads.txt now.
     */
    async apiV1PublisherSspSitesIdAdsTxtCheckPost(requestParameters: ApiV1PublisherSspSitesIdAdsTxtCheckPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspSitesIdAdsTxtCheckPostRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1PublisherSspSitesIdAdsTxtStatusGet without sending the request
     */
    async apiV1PublisherSspSitesIdAdsTxtStatusGetRequestOpts(requestParameters: ApiV1PublisherSspSitesIdAdsTxtStatusGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherSspSitesIdAdsTxtStatusGet().'
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

        let urlPath = `/api/v1/publisher/ssp/sites/{id}/ads-txt-status`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * No fetch. `checked:false` when the site was never checked.
     * Last stored ads.txt check for a site.
     */
    async apiV1PublisherSspSitesIdAdsTxtStatusGetRaw(requestParameters: ApiV1PublisherSspSitesIdAdsTxtStatusGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1PublisherSspSitesIdAdsTxtStatusGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * No fetch. `checked:false` when the site was never checked.
     * Last stored ads.txt check for a site.
     */
    async apiV1PublisherSspSitesIdAdsTxtStatusGet(requestParameters: ApiV1PublisherSspSitesIdAdsTxtStatusGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1PublisherSspSitesIdAdsTxtStatusGetRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1PublisherSspNetworksGetSortByEnum = {
    Id: 'id',
    Name: 'name'
} as const;
export type ApiV1PublisherSspNetworksGetSortByEnum = typeof ApiV1PublisherSspNetworksGetSortByEnum[keyof typeof ApiV1PublisherSspNetworksGetSortByEnum];
/**
 * @export
 */
export const ApiV1PublisherSspNetworksGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1PublisherSspNetworksGetSortDirEnum = typeof ApiV1PublisherSspNetworksGetSortDirEnum[keyof typeof ApiV1PublisherSspNetworksGetSortDirEnum];
