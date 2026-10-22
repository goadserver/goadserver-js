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
  ApiV1PublisherFinanceEarningsGet200Response,
  ApiV1PublisherFinanceGet200Response,
  ApiV1PublisherFinanceMonthEarningsGet200ResponseInner,
  ApiV1PublisherFinancePayoutRequestPost201Response,
  ApiV1PublisherFinancePayoutRequestPostRequest,
  ApiV1PublisherFinancePayoutTypesGet200ResponseInner,
  ApiV1PublisherFinancePayoutsGet200Response,
  ApiV1PublisherFinanceSettingsGet200Response,
  ApiV1PublisherFinanceSettingsPutRequest,
  ApiV1PublisherFinanceTransactionsGet200Response,
  ApiV1PublisherFinanceTransactionsIdGet200Response,
  ApiV1PublisherFinanceTransferToAdvertiserPost200Response,
  ApiV1PublisherFinanceTransferToAdvertiserPostRequest,
  ApiV1RetargetingPixelsIdDelete200Response,
} from '../models/index';
import {
    ApiV1PublisherFinanceEarningsGet200ResponseFromJSON,
    ApiV1PublisherFinanceEarningsGet200ResponseToJSON,
    ApiV1PublisherFinanceGet200ResponseFromJSON,
    ApiV1PublisherFinanceGet200ResponseToJSON,
    ApiV1PublisherFinanceMonthEarningsGet200ResponseInnerFromJSON,
    ApiV1PublisherFinanceMonthEarningsGet200ResponseInnerToJSON,
    ApiV1PublisherFinancePayoutRequestPost201ResponseFromJSON,
    ApiV1PublisherFinancePayoutRequestPost201ResponseToJSON,
    ApiV1PublisherFinancePayoutRequestPostRequestFromJSON,
    ApiV1PublisherFinancePayoutRequestPostRequestToJSON,
    ApiV1PublisherFinancePayoutTypesGet200ResponseInnerFromJSON,
    ApiV1PublisherFinancePayoutTypesGet200ResponseInnerToJSON,
    ApiV1PublisherFinancePayoutsGet200ResponseFromJSON,
    ApiV1PublisherFinancePayoutsGet200ResponseToJSON,
    ApiV1PublisherFinanceSettingsGet200ResponseFromJSON,
    ApiV1PublisherFinanceSettingsGet200ResponseToJSON,
    ApiV1PublisherFinanceSettingsPutRequestFromJSON,
    ApiV1PublisherFinanceSettingsPutRequestToJSON,
    ApiV1PublisherFinanceTransactionsGet200ResponseFromJSON,
    ApiV1PublisherFinanceTransactionsGet200ResponseToJSON,
    ApiV1PublisherFinanceTransactionsIdGet200ResponseFromJSON,
    ApiV1PublisherFinanceTransactionsIdGet200ResponseToJSON,
    ApiV1PublisherFinanceTransferToAdvertiserPost200ResponseFromJSON,
    ApiV1PublisherFinanceTransferToAdvertiserPost200ResponseToJSON,
    ApiV1PublisherFinanceTransferToAdvertiserPostRequestFromJSON,
    ApiV1PublisherFinanceTransferToAdvertiserPostRequestToJSON,
    ApiV1RetargetingPixelsIdDelete200ResponseFromJSON,
    ApiV1RetargetingPixelsIdDelete200ResponseToJSON,
} from '../models/index';

export interface ApiV1PublisherFinanceEarningsGetRequest {
    from?: Date;
    to?: Date;
    groupBy?: ApiV1PublisherFinanceEarningsGetGroupByEnum;
}

export interface ApiV1PublisherFinancePayoutRequestPostOperationRequest {
    apiV1PublisherFinancePayoutRequestPostRequest?: ApiV1PublisherFinancePayoutRequestPostRequest;
}

export interface ApiV1PublisherFinancePayoutsGetRequest {
    page?: number;
    perPage?: number;
    sortBy?: ApiV1PublisherFinancePayoutsGetSortByEnum;
    sortDir?: ApiV1PublisherFinancePayoutsGetSortDirEnum;
    filterId?: number;
    filterIspayed?: ApiV1PublisherFinancePayoutsGetFilterIspayedEnum;
    filterTransacttype?: number;
}

export interface ApiV1PublisherFinanceSettingsPutOperationRequest {
    apiV1PublisherFinanceSettingsPutRequest: ApiV1PublisherFinanceSettingsPutRequest;
}

export interface ApiV1PublisherFinanceTransactionsGetRequest {
    page?: number;
    perPage?: number;
    sortBy?: ApiV1PublisherFinanceTransactionsGetSortByEnum;
    sortDir?: ApiV1PublisherFinanceTransactionsGetSortDirEnum;
    filterId?: number;
    filterIspayed?: ApiV1PublisherFinanceTransactionsGetFilterIspayedEnum;
    filterTransacttype?: number;
    filterDateadded?: Date;
}

export interface ApiV1PublisherFinanceTransactionsIdGetRequest {
    id: number;
}

export interface ApiV1PublisherFinanceTransactionsIdInvoicePdfGetRequest {
    id: number;
}

export interface ApiV1PublisherFinanceTransferToAdvertiserPostOperationRequest {
    apiV1PublisherFinanceTransferToAdvertiserPostRequest: ApiV1PublisherFinanceTransferToAdvertiserPostRequest;
}

/**
 * 
 */
export class PayoutsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1PublisherFinanceEarningsGet without sending the request
     */
    async apiV1PublisherFinanceEarningsGetRequestOpts(requestParameters: ApiV1PublisherFinanceEarningsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['groupBy'] != null) {
            queryParameters['group_by'] = requestParameters['groupBy'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance/earnings`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Publisher earnings from the stats store, bucketed by `group_by`.  **Money units.** `amount` and `summary.total` are **whole currency units** rounded to 2 decimals (unlike the balance fields, which are cents). Recent hours may still be incomplete. 
     * Earnings per day, week or month.
     */
    async apiV1PublisherFinanceEarningsGetRaw(requestParameters: ApiV1PublisherFinanceEarningsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinanceEarningsGet200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceEarningsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinanceEarningsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Publisher earnings from the stats store, bucketed by `group_by`.  **Money units.** `amount` and `summary.total` are **whole currency units** rounded to 2 decimals (unlike the balance fields, which are cents). Recent hours may still be incomplete. 
     * Earnings per day, week or month.
     */
    async apiV1PublisherFinanceEarningsGet(requestParameters: ApiV1PublisherFinanceEarningsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinanceEarningsGet200Response> {
        const response = await this.apiV1PublisherFinanceEarningsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceGet without sending the request
     */
    async apiV1PublisherFinanceGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The publisher\'s current balance, the sum of open payout requests, the total already paid out, and the network\'s payout rules — the header of the panel\'s Billing page.  **Money units.** `balance.current`, `balance.pending` and `balance.total_earned` are **cents** of the network\'s main currency. `payout_threshold` is **whole currency units** (50 = 50.00). 
     * Publisher balance and payout rules.
     */
    async apiV1PublisherFinanceGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinanceGet200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinanceGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The publisher\'s current balance, the sum of open payout requests, the total already paid out, and the network\'s payout rules — the header of the panel\'s Billing page.  **Money units.** `balance.current`, `balance.pending` and `balance.total_earned` are **cents** of the network\'s main currency. `payout_threshold` is **whole currency units** (50 = 50.00). 
     * Publisher balance and payout rules.
     */
    async apiV1PublisherFinanceGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinanceGet200Response> {
        const response = await this.apiV1PublisherFinanceGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceMonthEarningsGet without sending the request
     */
    async apiV1PublisherFinanceMonthEarningsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance/month-earnings`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One row per month from the monthly earnings ledger (the panel\'s Earnings tab), newest first. Not paginated.  **Money units.** `earned`, `pro_earned`, `ad_earned` and `total_earned` are **cents**. 
     * Monthly earnings statements.
     */
    async apiV1PublisherFinanceMonthEarningsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ApiV1PublisherFinanceMonthEarningsGet200ResponseInner>>> {
        const requestOptions = await this.apiV1PublisherFinanceMonthEarningsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ApiV1PublisherFinanceMonthEarningsGet200ResponseInnerFromJSON));
    }

    /**
     * One row per month from the monthly earnings ledger (the panel\'s Earnings tab), newest first. Not paginated.  **Money units.** `earned`, `pro_earned`, `ad_earned` and `total_earned` are **cents**. 
     * Monthly earnings statements.
     */
    async apiV1PublisherFinanceMonthEarningsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ApiV1PublisherFinanceMonthEarningsGet200ResponseInner>> {
        const response = await this.apiV1PublisherFinanceMonthEarningsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinancePayoutRequestPost without sending the request
     */
    async apiV1PublisherFinancePayoutRequestPostRequestOpts(requestParameters: ApiV1PublisherFinancePayoutRequestPostOperationRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/api/v1/publisher/finance/payout-request`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherFinancePayoutRequestPostRequestToJSON(requestParameters['apiV1PublisherFinancePayoutRequestPostRequest']),
        };
    }

    /**
     * Creates a payout request (paid out by staff, by the method in the payout settings) and deducts the amount from the balance at once.  **Money units.** The request `amount` is **whole currency units** (`12.50`); every amount in the response is **cents**.  Rules (same as the panel):  - `total_amount: true` requests the whole balance; otherwise `amount`   is required and is capped to the balance. - The balance must reach the network `payout_threshold`, and the   requested amount must reach the larger of that threshold and the   payout method\'s `min_payout`. - Only one open request at a time. - A fee is deducted when the method has one configured for amounts   below its `fee_below`; `net_amount` is what is paid. - Payouts go to the payment details on file. If those are not yet   approved by staff (`isvalidbanking: 0` in the settings) the request   is still recorded, and staff validate the details before paying. 
     * Request a payout of the balance.
     */
    async apiV1PublisherFinancePayoutRequestPostRaw(requestParameters: ApiV1PublisherFinancePayoutRequestPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinancePayoutRequestPost201Response>> {
        const requestOptions = await this.apiV1PublisherFinancePayoutRequestPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinancePayoutRequestPost201ResponseFromJSON(jsonValue));
    }

    /**
     * Creates a payout request (paid out by staff, by the method in the payout settings) and deducts the amount from the balance at once.  **Money units.** The request `amount` is **whole currency units** (`12.50`); every amount in the response is **cents**.  Rules (same as the panel):  - `total_amount: true` requests the whole balance; otherwise `amount`   is required and is capped to the balance. - The balance must reach the network `payout_threshold`, and the   requested amount must reach the larger of that threshold and the   payout method\'s `min_payout`. - Only one open request at a time. - A fee is deducted when the method has one configured for amounts   below its `fee_below`; `net_amount` is what is paid. - Payouts go to the payment details on file. If those are not yet   approved by staff (`isvalidbanking: 0` in the settings) the request   is still recorded, and staff validate the details before paying. 
     * Request a payout of the balance.
     */
    async apiV1PublisherFinancePayoutRequestPost(requestParameters: ApiV1PublisherFinancePayoutRequestPostOperationRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinancePayoutRequestPost201Response> {
        const response = await this.apiV1PublisherFinancePayoutRequestPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinancePayoutTypesGet without sending the request
     */
    async apiV1PublisherFinancePayoutTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance/payout-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The methods offered in the panel\'s payout-method picker — active on the tenant, allowed by the account\'s rights. The advertiser-budget method is not listed here (use `POST …/transfer-to-advertiser`). `id` is the value for `payouttype` in `PUT /api/v1/publisher/finance/settings`; any other id is refused there.  **Money units.** `min_payout` is **whole currency units**. 
     * Payout methods this account may choose.
     */
    async apiV1PublisherFinancePayoutTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ApiV1PublisherFinancePayoutTypesGet200ResponseInner>>> {
        const requestOptions = await this.apiV1PublisherFinancePayoutTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ApiV1PublisherFinancePayoutTypesGet200ResponseInnerFromJSON));
    }

    /**
     * The methods offered in the panel\'s payout-method picker — active on the tenant, allowed by the account\'s rights. The advertiser-budget method is not listed here (use `POST …/transfer-to-advertiser`). `id` is the value for `payouttype` in `PUT /api/v1/publisher/finance/settings`; any other id is refused there.  **Money units.** `min_payout` is **whole currency units**. 
     * Payout methods this account may choose.
     */
    async apiV1PublisherFinancePayoutTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ApiV1PublisherFinancePayoutTypesGet200ResponseInner>> {
        const response = await this.apiV1PublisherFinancePayoutTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinancePayoutsGet without sending the request
     */
    async apiV1PublisherFinancePayoutsGetRequestOpts(requestParameters: ApiV1PublisherFinancePayoutsGetRequest): Promise<runtime.RequestOpts> {
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

        if (requestParameters['filterIspayed'] != null) {
            queryParameters['filter_ispayed'] = requestParameters['filterIspayed'];
        }

        if (requestParameters['filterTransacttype'] != null) {
            queryParameters['filter_transacttype'] = requestParameters['filterTransacttype'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance/payouts`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Rows of `publisher_transactions` — every payout request (paid or not) and every transfer to the advertiser budget. Paginated.  **Money units.** `money` is **cents** in the network\'s main currency; `paid_currency` is the currency the payout is made in.  `transacttype` is the payout method id (see `GET /api/v1/publisher/finance/payout-types`); `0` is a transfer to the advertiser budget. 
     * List payout requests and payouts.
     */
    async apiV1PublisherFinancePayoutsGetRaw(requestParameters: ApiV1PublisherFinancePayoutsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinancePayoutsGet200Response>> {
        const requestOptions = await this.apiV1PublisherFinancePayoutsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinancePayoutsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Rows of `publisher_transactions` — every payout request (paid or not) and every transfer to the advertiser budget. Paginated.  **Money units.** `money` is **cents** in the network\'s main currency; `paid_currency` is the currency the payout is made in.  `transacttype` is the payout method id (see `GET /api/v1/publisher/finance/payout-types`); `0` is a transfer to the advertiser budget. 
     * List payout requests and payouts.
     */
    async apiV1PublisherFinancePayoutsGet(requestParameters: ApiV1PublisherFinancePayoutsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinancePayoutsGet200Response> {
        const response = await this.apiV1PublisherFinancePayoutsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceSettingsGet without sending the request
     */
    async apiV1PublisherFinanceSettingsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance/settings`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The account\'s payout settings. When none were ever saved, the defaults are returned with `payouttype: -1`.  **Money units.** `minimum_payout` is **whole currency units**.  Read-only here: `isvalidbanking` (staff approval of the payment details — reset whenever the destination changes), `isvalidcompany`, `last_time_validated`, `allowweeklypayments` (whether `directpayout: 2` is permitted) and the invoice-address block (`inv_*`, `useaccountadress`), which is edited through the account settings, not here. 
     * Payout method and payment details.
     */
    async apiV1PublisherFinanceSettingsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinanceSettingsGet200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceSettingsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinanceSettingsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The account\'s payout settings. When none were ever saved, the defaults are returned with `payouttype: -1`.  **Money units.** `minimum_payout` is **whole currency units**.  Read-only here: `isvalidbanking` (staff approval of the payment details — reset whenever the destination changes), `isvalidcompany`, `last_time_validated`, `allowweeklypayments` (whether `directpayout: 2` is permitted) and the invoice-address block (`inv_*`, `useaccountadress`), which is edited through the account settings, not here. 
     * Payout method and payment details.
     */
    async apiV1PublisherFinanceSettingsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinanceSettingsGet200Response> {
        const response = await this.apiV1PublisherFinanceSettingsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceSettingsPut without sending the request
     */
    async apiV1PublisherFinanceSettingsPutRequestOpts(requestParameters: ApiV1PublisherFinanceSettingsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherFinanceSettingsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherFinanceSettingsPutRequest',
                'Required parameter "apiV1PublisherFinanceSettingsPutRequest" was null or undefined when calling apiV1PublisherFinanceSettingsPut().'
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

        let urlPath = `/api/v1/publisher/finance/settings`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherFinanceSettingsPutRequestToJSON(requestParameters['apiV1PublisherFinanceSettingsPutRequest']),
        };
    }

    /**
     * Partial update: send only the fields to change. Needs its own scope, `payouts.method` — a key holding `payouts.write` (request a payout) cannot redirect where the money goes.  Same rules as the panel\'s Billing → Payout settings save:  - `payouttype` must be one of `GET …/payout-types` (or ≤ 0). - `minimum_payout` (**whole currency units**) may not be below the   selected method\'s `min_payout`. - `p_currency` must be `eur` or `usd`. - `directpayout: 2` (weekly) silently becomes `0` without the   `weekly_payout` right; values outside 0–2 become `0`. - IBAN / BIC are stored uppercased, IBAN without separators. Strings   longer than the column are truncated to its width. - **Changing a destination** (`bankaccountnumber`, `ibancode`,   `routingnumber`, `paypaladress`, `paxumadress`, `payoneeradress`,   `paymentdata`) **resets `isvalidbanking` to 0**: the new details   need staff approval again before payouts are made to them.  Neither the panel nor this endpoint asks for 2FA or an email confirmation. Read-only fields of the GET (`isvalidbanking`, `isvalidcompany`, `last_time_validated`, `allowweeklypayments`) and the invoice-address block (`inv_*`, `useaccountadress` — edited via the account settings) are not accepted: strip them before sending a GET body back, or the call answers 422 `unknown_fields`. 
     * Change the payout method or payment details.
     */
    async apiV1PublisherFinanceSettingsPutRaw(requestParameters: ApiV1PublisherFinanceSettingsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1RetargetingPixelsIdDelete200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceSettingsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1RetargetingPixelsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Partial update: send only the fields to change. Needs its own scope, `payouts.method` — a key holding `payouts.write` (request a payout) cannot redirect where the money goes.  Same rules as the panel\'s Billing → Payout settings save:  - `payouttype` must be one of `GET …/payout-types` (or ≤ 0). - `minimum_payout` (**whole currency units**) may not be below the   selected method\'s `min_payout`. - `p_currency` must be `eur` or `usd`. - `directpayout: 2` (weekly) silently becomes `0` without the   `weekly_payout` right; values outside 0–2 become `0`. - IBAN / BIC are stored uppercased, IBAN without separators. Strings   longer than the column are truncated to its width. - **Changing a destination** (`bankaccountnumber`, `ibancode`,   `routingnumber`, `paypaladress`, `paxumadress`, `payoneeradress`,   `paymentdata`) **resets `isvalidbanking` to 0**: the new details   need staff approval again before payouts are made to them.  Neither the panel nor this endpoint asks for 2FA or an email confirmation. Read-only fields of the GET (`isvalidbanking`, `isvalidcompany`, `last_time_validated`, `allowweeklypayments`) and the invoice-address block (`inv_*`, `useaccountadress` — edited via the account settings) are not accepted: strip them before sending a GET body back, or the call answers 422 `unknown_fields`. 
     * Change the payout method or payment details.
     */
    async apiV1PublisherFinanceSettingsPut(requestParameters: ApiV1PublisherFinanceSettingsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1RetargetingPixelsIdDelete200Response> {
        const response = await this.apiV1PublisherFinanceSettingsPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceTransactionsGet without sending the request
     */
    async apiV1PublisherFinanceTransactionsGetRequestOpts(requestParameters: ApiV1PublisherFinanceTransactionsGetRequest): Promise<runtime.RequestOpts> {
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

        if (requestParameters['filterIspayed'] != null) {
            queryParameters['filter_ispayed'] = requestParameters['filterIspayed'];
        }

        if (requestParameters['filterTransacttype'] != null) {
            queryParameters['filter_transacttype'] = requestParameters['filterTransacttype'];
        }

        if (requestParameters['filterDateadded'] != null) {
            queryParameters['filter_dateadded'] = (requestParameters['filterDateadded'] as any).toISOString().substring(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/publisher/finance/transactions`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Same rows as `GET /api/v1/publisher/finance/payouts` with the field names the panel\'s Transactions tab uses (`ispaid`, `datepaid`) plus the USD conversion of paid rows.  **Money units.** `money` and `totalusd` are **cents**; `usdrate` is the conversion rate applied. 
     * List payout transactions (with USD totals).
     */
    async apiV1PublisherFinanceTransactionsGetRaw(requestParameters: ApiV1PublisherFinanceTransactionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinanceTransactionsGet200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceTransactionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinanceTransactionsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Same rows as `GET /api/v1/publisher/finance/payouts` with the field names the panel\'s Transactions tab uses (`ispaid`, `datepaid`) plus the USD conversion of paid rows.  **Money units.** `money` and `totalusd` are **cents**; `usdrate` is the conversion rate applied. 
     * List payout transactions (with USD totals).
     */
    async apiV1PublisherFinanceTransactionsGet(requestParameters: ApiV1PublisherFinanceTransactionsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinanceTransactionsGet200Response> {
        const response = await this.apiV1PublisherFinanceTransactionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceTransactionsIdGet without sending the request
     */
    async apiV1PublisherFinanceTransactionsIdGetRequestOpts(requestParameters: ApiV1PublisherFinanceTransactionsIdGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherFinanceTransactionsIdGet().'
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

        let urlPath = `/api/v1/publisher/finance/transactions/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A single row of the caller\'s `publisher_transactions`. **`money` is cents.** Another account\'s id answers 404. 
     * One payout transaction.
     */
    async apiV1PublisherFinanceTransactionsIdGetRaw(requestParameters: ApiV1PublisherFinanceTransactionsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinanceTransactionsIdGet200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceTransactionsIdGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinanceTransactionsIdGet200ResponseFromJSON(jsonValue));
    }

    /**
     * A single row of the caller\'s `publisher_transactions`. **`money` is cents.** Another account\'s id answers 404. 
     * One payout transaction.
     */
    async apiV1PublisherFinanceTransactionsIdGet(requestParameters: ApiV1PublisherFinanceTransactionsIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinanceTransactionsIdGet200Response> {
        const response = await this.apiV1PublisherFinanceTransactionsIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceTransactionsIdInvoicePdfGet without sending the request
     */
    async apiV1PublisherFinanceTransactionsIdInvoicePdfGetRequestOpts(requestParameters: ApiV1PublisherFinanceTransactionsIdInvoicePdfGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1PublisherFinanceTransactionsIdInvoicePdfGet().'
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

        let urlPath = `/api/v1/publisher/finance/transactions/{id}/invoice-pdf`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Returns `application/pdf` as an attachment named after the invoice number. Only **paid** payouts have an invoice; an unpaid or unknown id answers 404. 
     * Download the self-billing invoice PDF of a paid payout.
     */
    async apiV1PublisherFinanceTransactionsIdInvoicePdfGetRaw(requestParameters: ApiV1PublisherFinanceTransactionsIdInvoicePdfGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        const requestOptions = await this.apiV1PublisherFinanceTransactionsIdInvoicePdfGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Returns `application/pdf` as an attachment named after the invoice number. Only **paid** payouts have an invoice; an unpaid or unknown id answers 404. 
     * Download the self-billing invoice PDF of a paid payout.
     */
    async apiV1PublisherFinanceTransactionsIdInvoicePdfGet(requestParameters: ApiV1PublisherFinanceTransactionsIdInvoicePdfGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.apiV1PublisherFinanceTransactionsIdInvoicePdfGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1PublisherFinanceTransferToAdvertiserPost without sending the request
     */
    async apiV1PublisherFinanceTransferToAdvertiserPostRequestOpts(requestParameters: ApiV1PublisherFinanceTransferToAdvertiserPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1PublisherFinanceTransferToAdvertiserPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1PublisherFinanceTransferToAdvertiserPostRequest',
                'Required parameter "apiV1PublisherFinanceTransferToAdvertiserPostRequest" was null or undefined when calling apiV1PublisherFinanceTransferToAdvertiserPost().'
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

        let urlPath = `/api/v1/publisher/finance/transfer-to-advertiser`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1PublisherFinanceTransferToAdvertiserPostRequestToJSON(requestParameters['apiV1PublisherFinanceTransferToAdvertiserPostRequest']),
        };
    }

    /**
     * Moves money from the publisher balance to the same account\'s advertiser budget, immediately (recorded as a paid transaction with `transacttype: 0`). Only for accounts that are also advertisers on a tenant offering the advertiser-budget method — see `can_transfer_to_advertiser` in `GET /api/v1/publisher/finance`.  **Money units.** Request `amount` and response `amount_transferred` are both **whole currency units**.  The amount must reach the network `payout_threshold`; a larger amount than the balance is capped to the balance. 
     * Move publisher balance to the advertiser budget.
     */
    async apiV1PublisherFinanceTransferToAdvertiserPostRaw(requestParameters: ApiV1PublisherFinanceTransferToAdvertiserPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1PublisherFinanceTransferToAdvertiserPost200Response>> {
        const requestOptions = await this.apiV1PublisherFinanceTransferToAdvertiserPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1PublisherFinanceTransferToAdvertiserPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Moves money from the publisher balance to the same account\'s advertiser budget, immediately (recorded as a paid transaction with `transacttype: 0`). Only for accounts that are also advertisers on a tenant offering the advertiser-budget method — see `can_transfer_to_advertiser` in `GET /api/v1/publisher/finance`.  **Money units.** Request `amount` and response `amount_transferred` are both **whole currency units**.  The amount must reach the network `payout_threshold`; a larger amount than the balance is capped to the balance. 
     * Move publisher balance to the advertiser budget.
     */
    async apiV1PublisherFinanceTransferToAdvertiserPost(requestParameters: ApiV1PublisherFinanceTransferToAdvertiserPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1PublisherFinanceTransferToAdvertiserPost200Response> {
        const response = await this.apiV1PublisherFinanceTransferToAdvertiserPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ApiV1PublisherFinanceEarningsGetGroupByEnum = {
    Day: 'day',
    Week: 'week',
    Month: 'month'
} as const;
export type ApiV1PublisherFinanceEarningsGetGroupByEnum = typeof ApiV1PublisherFinanceEarningsGetGroupByEnum[keyof typeof ApiV1PublisherFinanceEarningsGetGroupByEnum];
/**
 * @export
 */
export const ApiV1PublisherFinancePayoutsGetSortByEnum = {
    Id: 'id',
    Dateadded: 'dateadded',
    Money: 'money',
    Ispayed: 'ispayed',
    Transacttype: 'transacttype'
} as const;
export type ApiV1PublisherFinancePayoutsGetSortByEnum = typeof ApiV1PublisherFinancePayoutsGetSortByEnum[keyof typeof ApiV1PublisherFinancePayoutsGetSortByEnum];
/**
 * @export
 */
export const ApiV1PublisherFinancePayoutsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1PublisherFinancePayoutsGetSortDirEnum = typeof ApiV1PublisherFinancePayoutsGetSortDirEnum[keyof typeof ApiV1PublisherFinancePayoutsGetSortDirEnum];
/**
 * @export
 */
export const ApiV1PublisherFinancePayoutsGetFilterIspayedEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1PublisherFinancePayoutsGetFilterIspayedEnum = typeof ApiV1PublisherFinancePayoutsGetFilterIspayedEnum[keyof typeof ApiV1PublisherFinancePayoutsGetFilterIspayedEnum];
/**
 * @export
 */
export const ApiV1PublisherFinanceTransactionsGetSortByEnum = {
    Id: 'id',
    Dateadded: 'dateadded',
    Money: 'money',
    Transacttype: 'transacttype',
    Ispayed: 'ispayed'
} as const;
export type ApiV1PublisherFinanceTransactionsGetSortByEnum = typeof ApiV1PublisherFinanceTransactionsGetSortByEnum[keyof typeof ApiV1PublisherFinanceTransactionsGetSortByEnum];
/**
 * @export
 */
export const ApiV1PublisherFinanceTransactionsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1PublisherFinanceTransactionsGetSortDirEnum = typeof ApiV1PublisherFinanceTransactionsGetSortDirEnum[keyof typeof ApiV1PublisherFinanceTransactionsGetSortDirEnum];
/**
 * @export
 */
export const ApiV1PublisherFinanceTransactionsGetFilterIspayedEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type ApiV1PublisherFinanceTransactionsGetFilterIspayedEnum = typeof ApiV1PublisherFinanceTransactionsGetFilterIspayedEnum[keyof typeof ApiV1PublisherFinanceTransactionsGetFilterIspayedEnum];
