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
  ApiV1TrackerReportSchedulesGet200Response,
  ApiV1TrackerReportSchedulesIdGet200Response,
  ApiV1TrackerReportSchedulesIdPutRequest,
  ApiV1TrackerReportSchedulesPostRequest,
  ApiV1TrackerRulesGet200Response,
  ApiV1TrackerRulesIdGet200Response,
  ApiV1TrackerRulesIdPutRequest,
  ApiV1TrackerRulesPostRequest,
  ApiV1TrackerTrackingLinksIdZoneCostsGet200Response,
} from '../models/index';
import {
    ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON,
    ApiV1PublisherPushCampaignsIdDelete200ResponseToJSON,
    ApiV1PublisherPushCampaignsPost200ResponseFromJSON,
    ApiV1PublisherPushCampaignsPost200ResponseToJSON,
    ApiV1TrackerReportSchedulesGet200ResponseFromJSON,
    ApiV1TrackerReportSchedulesGet200ResponseToJSON,
    ApiV1TrackerReportSchedulesIdGet200ResponseFromJSON,
    ApiV1TrackerReportSchedulesIdGet200ResponseToJSON,
    ApiV1TrackerReportSchedulesIdPutRequestFromJSON,
    ApiV1TrackerReportSchedulesIdPutRequestToJSON,
    ApiV1TrackerReportSchedulesPostRequestFromJSON,
    ApiV1TrackerReportSchedulesPostRequestToJSON,
    ApiV1TrackerRulesGet200ResponseFromJSON,
    ApiV1TrackerRulesGet200ResponseToJSON,
    ApiV1TrackerRulesIdGet200ResponseFromJSON,
    ApiV1TrackerRulesIdGet200ResponseToJSON,
    ApiV1TrackerRulesIdPutRequestFromJSON,
    ApiV1TrackerRulesIdPutRequestToJSON,
    ApiV1TrackerRulesPostRequestFromJSON,
    ApiV1TrackerRulesPostRequestToJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON,
    ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseToJSON,
} from '../models/index';

export interface ApiV1TrackerExportTypeGetRequest {
    type: ApiV1TrackerExportTypeGetTypeEnum;
}

export interface ApiV1TrackerImportTypePostRequest {
    type: ApiV1TrackerImportTypePostTypeEnum;
    file: Blob;
    commit?: string;
    overwrite?: string;
}

export interface ApiV1TrackerReportSchedulesIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerReportSchedulesIdGetRequest {
    id: number;
}

export interface ApiV1TrackerReportSchedulesIdPutOperationRequest {
    id: number;
    apiV1TrackerReportSchedulesIdPutRequest: ApiV1TrackerReportSchedulesIdPutRequest;
}

export interface ApiV1TrackerReportSchedulesPostOperationRequest {
    apiV1TrackerReportSchedulesPostRequest: ApiV1TrackerReportSchedulesPostRequest;
}

export interface ApiV1TrackerRulesIdDeleteRequest {
    id: number;
}

export interface ApiV1TrackerRulesIdExecutionsGetRequest {
    id: number;
}

export interface ApiV1TrackerRulesIdGetRequest {
    id: number;
}

export interface ApiV1TrackerRulesIdPutOperationRequest {
    id: number;
    apiV1TrackerRulesIdPutRequest: ApiV1TrackerRulesIdPutRequest;
}

export interface ApiV1TrackerRulesIdRunPostRequest {
    id: number;
    window?: string;
}

export interface ApiV1TrackerRulesPostOperationRequest {
    apiV1TrackerRulesPostRequest: ApiV1TrackerRulesPostRequest;
}

/**
 * 
 */
export class TrackerAutomationApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1TrackerExportTypeGet without sending the request
     */
    async apiV1TrackerExportTypeGetRequestOpts(requestParameters: ApiV1TrackerExportTypeGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1TrackerExportTypeGet().'
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

        let urlPath = `/api/v1/tracker/export/{type}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns `text/csv`, not JSON — the same file the scheduled reports mail. Scoped `tracker.read` rather than `stats.read`: this dumps configuration, not statistics. 
     * Export tracker entities as CSV.
     */
    async apiV1TrackerExportTypeGetRaw(requestParameters: ApiV1TrackerExportTypeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const requestOptions = await this.apiV1TrackerExportTypeGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Returns `text/csv`, not JSON — the same file the scheduled reports mail. Scoped `tracker.read` rather than `stats.read`: this dumps configuration, not statistics. 
     * Export tracker entities as CSV.
     */
    async apiV1TrackerExportTypeGet(requestParameters: ApiV1TrackerExportTypeGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.apiV1TrackerExportTypeGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerImportTypePost without sending the request
     */
    async apiV1TrackerImportTypePostRequestOpts(requestParameters: ApiV1TrackerImportTypePostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1TrackerImportTypePost().'
            );
        }

        if (requestParameters['file'] == null) {
            throw new runtime.RequiredError(
                'file',
                'Required parameter "file" was null or undefined when calling apiV1TrackerImportTypePost().'
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

        if (requestParameters['commit'] != null) {
            formParams.append('commit', requestParameters['commit'] as any);
        }

        if (requestParameters['overwrite'] != null) {
            formParams.append('overwrite', requestParameters['overwrite'] as any);
        }


        let urlPath = `/api/v1/tracker/import/{type}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * `multipart/form-data` with the CSV as `file`. Two flags decide how far it goes: without `commit` the upload is validated and reported on but nothing is written, and without `overwrite` every row inserts and any `id` column is ignored, so a spreadsheet cannot clobber live rows by accident. An id that resolves to no row the caller owns is a row error, never a silent insert. 
     * Bulk-import offers from CSV.
     */
    async apiV1TrackerImportTypePostRaw(requestParameters: ApiV1TrackerImportTypePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerImportTypePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * `multipart/form-data` with the CSV as `file`. Two flags decide how far it goes: without `commit` the upload is validated and reported on but nothing is written, and without `overwrite` every row inserts and any `id` column is ignored, so a spreadsheet cannot clobber live rows by accident. An id that resolves to no row the caller owns is a row error, never a silent insert. 
     * Bulk-import offers from CSV.
     */
    async apiV1TrackerImportTypePost(requestParameters: ApiV1TrackerImportTypePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerImportTypePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerReportSchedulesGet without sending the request
     */
    async apiV1TrackerReportSchedulesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/report-schedules`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Recurring CSV exports mailed to a list of recipients. 
     * List scheduled report deliveries.
     */
    async apiV1TrackerReportSchedulesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerReportSchedulesGet200Response>> {
        const requestOptions = await this.apiV1TrackerReportSchedulesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerReportSchedulesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Recurring CSV exports mailed to a list of recipients. 
     * List scheduled report deliveries.
     */
    async apiV1TrackerReportSchedulesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerReportSchedulesGet200Response> {
        const response = await this.apiV1TrackerReportSchedulesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerReportSchedulesIdDelete without sending the request
     */
    async apiV1TrackerReportSchedulesIdDeleteRequestOpts(requestParameters: ApiV1TrackerReportSchedulesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerReportSchedulesIdDelete().'
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

        let urlPath = `/api/v1/tracker/report-schedules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a report schedule.
     */
    async apiV1TrackerReportSchedulesIdDeleteRaw(requestParameters: ApiV1TrackerReportSchedulesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerReportSchedulesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Delete a report schedule.
     */
    async apiV1TrackerReportSchedulesIdDelete(requestParameters: ApiV1TrackerReportSchedulesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerReportSchedulesIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerReportSchedulesIdGet without sending the request
     */
    async apiV1TrackerReportSchedulesIdGetRequestOpts(requestParameters: ApiV1TrackerReportSchedulesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerReportSchedulesIdGet().'
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

        let urlPath = `/api/v1/tracker/report-schedules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get one report schedule.
     */
    async apiV1TrackerReportSchedulesIdGetRaw(requestParameters: ApiV1TrackerReportSchedulesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerReportSchedulesIdGet200Response>> {
        const requestOptions = await this.apiV1TrackerReportSchedulesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerReportSchedulesIdGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Get one report schedule.
     */
    async apiV1TrackerReportSchedulesIdGet(requestParameters: ApiV1TrackerReportSchedulesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerReportSchedulesIdGet200Response> {
        const response = await this.apiV1TrackerReportSchedulesIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerReportSchedulesIdPut without sending the request
     */
    async apiV1TrackerReportSchedulesIdPutRequestOpts(requestParameters: ApiV1TrackerReportSchedulesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerReportSchedulesIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerReportSchedulesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerReportSchedulesIdPutRequest',
                'Required parameter "apiV1TrackerReportSchedulesIdPutRequest" was null or undefined when calling apiV1TrackerReportSchedulesIdPut().'
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

        let urlPath = `/api/v1/tracker/report-schedules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerReportSchedulesIdPutRequestToJSON(requestParameters['apiV1TrackerReportSchedulesIdPutRequest']),
        };
    }

    /**
     * Partial update. 
     * Update a report schedule.
     */
    async apiV1TrackerReportSchedulesIdPutRaw(requestParameters: ApiV1TrackerReportSchedulesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerReportSchedulesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update. 
     * Update a report schedule.
     */
    async apiV1TrackerReportSchedulesIdPut(requestParameters: ApiV1TrackerReportSchedulesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerReportSchedulesIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerReportSchedulesPost without sending the request
     */
    async apiV1TrackerReportSchedulesPostRequestOpts(requestParameters: ApiV1TrackerReportSchedulesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerReportSchedulesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerReportSchedulesPostRequest',
                'Required parameter "apiV1TrackerReportSchedulesPostRequest" was null or undefined when calling apiV1TrackerReportSchedulesPost().'
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

        let urlPath = `/api/v1/tracker/report-schedules`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerReportSchedulesPostRequestToJSON(requestParameters['apiV1TrackerReportSchedulesPostRequest']),
        };
    }

    /**
     * `report_type` names the same three exports `/export/{type}` serves. 
     * Schedule a recurring report.
     */
    async apiV1TrackerReportSchedulesPostRaw(requestParameters: ApiV1TrackerReportSchedulesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerReportSchedulesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `report_type` names the same three exports `/export/{type}` serves. 
     * Schedule a recurring report.
     */
    async apiV1TrackerReportSchedulesPost(requestParameters: ApiV1TrackerReportSchedulesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerReportSchedulesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesGet without sending the request
     */
    async apiV1TrackerRulesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/rules`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Standing rules that watch performance and act — pause an offer, block a placement, adjust a bid, or raise an alert. 
     * List automation rules.
     */
    async apiV1TrackerRulesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerRulesGet200Response>> {
        const requestOptions = await this.apiV1TrackerRulesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerRulesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Standing rules that watch performance and act — pause an offer, block a placement, adjust a bid, or raise an alert. 
     * List automation rules.
     */
    async apiV1TrackerRulesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerRulesGet200Response> {
        const response = await this.apiV1TrackerRulesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesIdDelete without sending the request
     */
    async apiV1TrackerRulesIdDeleteRequestOpts(requestParameters: ApiV1TrackerRulesIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerRulesIdDelete().'
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

        let urlPath = `/api/v1/tracker/rules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a rule.
     */
    async apiV1TrackerRulesIdDeleteRaw(requestParameters: ApiV1TrackerRulesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsIdDelete200Response>> {
        const requestOptions = await this.apiV1TrackerRulesIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Delete a rule.
     */
    async apiV1TrackerRulesIdDelete(requestParameters: ApiV1TrackerRulesIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsIdDelete200Response> {
        const response = await this.apiV1TrackerRulesIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesIdExecutionsGet without sending the request
     */
    async apiV1TrackerRulesIdExecutionsGetRequestOpts(requestParameters: ApiV1TrackerRulesIdExecutionsGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerRulesIdExecutionsGet().'
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

        let urlPath = `/api/v1/tracker/rules/{id}/executions`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every firing, what matched, and what the rule did — including the runs it only reported because `apply_actions` was off. 
     * Execution history for one rule.
     */
    async apiV1TrackerRulesIdExecutionsGetRaw(requestParameters: ApiV1TrackerRulesIdExecutionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerRulesIdExecutionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Every firing, what matched, and what the rule did — including the runs it only reported because `apply_actions` was off. 
     * Execution history for one rule.
     */
    async apiV1TrackerRulesIdExecutionsGet(requestParameters: ApiV1TrackerRulesIdExecutionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerRulesIdExecutionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesIdGet without sending the request
     */
    async apiV1TrackerRulesIdGetRequestOpts(requestParameters: ApiV1TrackerRulesIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerRulesIdGet().'
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

        let urlPath = `/api/v1/tracker/rules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Get one rule.
     */
    async apiV1TrackerRulesIdGetRaw(requestParameters: ApiV1TrackerRulesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerRulesIdGet200Response>> {
        const requestOptions = await this.apiV1TrackerRulesIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerRulesIdGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Get one rule.
     */
    async apiV1TrackerRulesIdGet(requestParameters: ApiV1TrackerRulesIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerRulesIdGet200Response> {
        const response = await this.apiV1TrackerRulesIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesIdPut without sending the request
     */
    async apiV1TrackerRulesIdPutRequestOpts(requestParameters: ApiV1TrackerRulesIdPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerRulesIdPut().'
            );
        }

        if (requestParameters['apiV1TrackerRulesIdPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerRulesIdPutRequest',
                'Required parameter "apiV1TrackerRulesIdPutRequest" was null or undefined when calling apiV1TrackerRulesIdPut().'
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

        let urlPath = `/api/v1/tracker/rules/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerRulesIdPutRequestToJSON(requestParameters['apiV1TrackerRulesIdPutRequest']),
        };
    }

    /**
     * Partial update. 
     * Update a rule.
     */
    async apiV1TrackerRulesIdPutRaw(requestParameters: ApiV1TrackerRulesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerRulesIdPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update. 
     * Update a rule.
     */
    async apiV1TrackerRulesIdPut(requestParameters: ApiV1TrackerRulesIdPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerRulesIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesIdRunPost without sending the request
     */
    async apiV1TrackerRulesIdRunPostRequestOpts(requestParameters: ApiV1TrackerRulesIdRunPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1TrackerRulesIdRunPost().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['window'] != null) {
            queryParameters['window'] = requestParameters['window'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/tracker/rules/{id}/run`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Evaluates immediately instead of waiting for the schedule. Honours the rule\'s own `apply_actions`, so a reporting-only rule stays harmless. 
     * Run a rule now.
     */
    async apiV1TrackerRulesIdRunPostRaw(requestParameters: ApiV1TrackerRulesIdRunPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response>> {
        const requestOptions = await this.apiV1TrackerRulesIdRunPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1TrackerTrackingLinksIdZoneCostsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Evaluates immediately instead of waiting for the schedule. Honours the rule\'s own `apply_actions`, so a reporting-only rule stays harmless. 
     * Run a rule now.
     */
    async apiV1TrackerRulesIdRunPost(requestParameters: ApiV1TrackerRulesIdRunPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1TrackerTrackingLinksIdZoneCostsGet200Response> {
        const response = await this.apiV1TrackerRulesIdRunPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1TrackerRulesPost without sending the request
     */
    async apiV1TrackerRulesPostRequestOpts(requestParameters: ApiV1TrackerRulesPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1TrackerRulesPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1TrackerRulesPostRequest',
                'Required parameter "apiV1TrackerRulesPostRequest" was null or undefined when calling apiV1TrackerRulesPost().'
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

        let urlPath = `/api/v1/tracker/rules`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1TrackerRulesPostRequestToJSON(requestParameters['apiV1TrackerRulesPostRequest']),
        };
    }

    /**
     * `conditions` is the list the evaluator ANDs; `action` is what fires when they all hold. With `apply_actions` false the rule reports what it would have done without touching anything — the way to trust one before arming it. 
     * Create an automation rule.
     */
    async apiV1TrackerRulesPostRaw(requestParameters: ApiV1TrackerRulesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherPushCampaignsPost200Response>> {
        const requestOptions = await this.apiV1TrackerRulesPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherPushCampaignsPost200ResponseFromJSON(jsonValue));
    }

    /**
     * `conditions` is the list the evaluator ANDs; `action` is what fires when they all hold. With `apply_actions` false the rule reports what it would have done without touching anything — the way to trust one before arming it. 
     * Create an automation rule.
     */
    async apiV1TrackerRulesPost(requestParameters: ApiV1TrackerRulesPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherPushCampaignsPost200Response> {
        const response = await this.apiV1TrackerRulesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1TrackerExportTypeGetTypeEnum = {
    Offers: 'offers',
    TrackingLinks: 'tracking-links',
    Rules: 'rules'
} as const;
export type ApiV1TrackerExportTypeGetTypeEnum = typeof ApiV1TrackerExportTypeGetTypeEnum[keyof typeof ApiV1TrackerExportTypeGetTypeEnum];
/**
 * @export
 */
export const ApiV1TrackerImportTypePostTypeEnum = {
    Offers: 'offers'
} as const;
export type ApiV1TrackerImportTypePostTypeEnum = typeof ApiV1TrackerImportTypePostTypeEnum[keyof typeof ApiV1TrackerImportTypePostTypeEnum];
