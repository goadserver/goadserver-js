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
  ApiV1FundsBalanceSettingsPutRequest,
  ApiV1FundsDepositTypeFidGet200Response,
  ApiV1FundsDepositTypePost200Response,
  ApiV1FundsDepositTypePostRequest,
  ApiV1FundsDepositsIdProofPost200Response,
  ApiV1FundsDepositsIdTxnHashPost200Response,
  ApiV1FundsDepositsIdTxnHashPostRequest,
  ApiV1FundsGet200Response,
  ApiV1FundsPayTypesGet200Response,
  ApiV1FundsTransactionsGet200Response,
  ApiV1FundsTransferPostRequest,
  ApiV1RetargetingPixelsIdDelete200Response,
} from '../models/index';
import {
    ApiV1FundsBalanceSettingsPutRequestFromJSON,
    ApiV1FundsBalanceSettingsPutRequestToJSON,
    ApiV1FundsDepositTypeFidGet200ResponseFromJSON,
    ApiV1FundsDepositTypeFidGet200ResponseToJSON,
    ApiV1FundsDepositTypePost200ResponseFromJSON,
    ApiV1FundsDepositTypePost200ResponseToJSON,
    ApiV1FundsDepositTypePostRequestFromJSON,
    ApiV1FundsDepositTypePostRequestToJSON,
    ApiV1FundsDepositsIdProofPost200ResponseFromJSON,
    ApiV1FundsDepositsIdProofPost200ResponseToJSON,
    ApiV1FundsDepositsIdTxnHashPost200ResponseFromJSON,
    ApiV1FundsDepositsIdTxnHashPost200ResponseToJSON,
    ApiV1FundsDepositsIdTxnHashPostRequestFromJSON,
    ApiV1FundsDepositsIdTxnHashPostRequestToJSON,
    ApiV1FundsGet200ResponseFromJSON,
    ApiV1FundsGet200ResponseToJSON,
    ApiV1FundsPayTypesGet200ResponseFromJSON,
    ApiV1FundsPayTypesGet200ResponseToJSON,
    ApiV1FundsTransactionsGet200ResponseFromJSON,
    ApiV1FundsTransactionsGet200ResponseToJSON,
    ApiV1FundsTransferPostRequestFromJSON,
    ApiV1FundsTransferPostRequestToJSON,
    ApiV1RetargetingPixelsIdDelete200ResponseFromJSON,
    ApiV1RetargetingPixelsIdDelete200ResponseToJSON,
} from '../models/index';

export interface ApiV1FundsBalanceSettingsPutOperationRequest {
    apiV1FundsBalanceSettingsPutRequest: ApiV1FundsBalanceSettingsPutRequest;
}

export interface ApiV1FundsDepositTypeFidGetRequest {
    type: string;
    fid: number;
}

export interface ApiV1FundsDepositTypePostOperationRequest {
    type: string;
    apiV1FundsDepositTypePostRequest: ApiV1FundsDepositTypePostRequest;
}

export interface ApiV1FundsDepositsIdDeleteRequest {
    id: number;
}

export interface ApiV1FundsDepositsIdProofGetRequest {
    id: number;
}

export interface ApiV1FundsDepositsIdProofPostRequest {
    id: number;
    file: Blob;
}

export interface ApiV1FundsDepositsIdTxnHashPostOperationRequest {
    id: number;
    apiV1FundsDepositsIdTxnHashPostRequest: ApiV1FundsDepositsIdTxnHashPostRequest;
}

export interface ApiV1FundsTransactionsGetRequest {
    from?: Date;
    to?: Date;
    filterId?: number;
    filterPaytype?: number;
    sortBy?: ApiV1FundsTransactionsGetSortByEnum;
    sortDir?: ApiV1FundsTransactionsGetSortDirEnum;
    page?: number;
    perPage?: number;
}

export interface ApiV1FundsTransferPostOperationRequest {
    apiV1FundsTransferPostRequest: ApiV1FundsTransferPostRequest;
}

/**
 * 
 */
export class FundsApi extends runtime.BaseAPI {

    /**
     * Creates request options for apiV1FundsBalanceSettingsPut without sending the request
     */
    async apiV1FundsBalanceSettingsPutRequestOpts(requestParameters: ApiV1FundsBalanceSettingsPutOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1FundsBalanceSettingsPutRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FundsBalanceSettingsPutRequest',
                'Required parameter "apiV1FundsBalanceSettingsPutRequest" was null or undefined when calling apiV1FundsBalanceSettingsPut().'
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

        let urlPath = `/api/v1/funds/balance-settings`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FundsBalanceSettingsPutRequestToJSON(requestParameters['apiV1FundsBalanceSettingsPutRequest']),
        };
    }

    /**
     * `ad_sendbalancemail` (0/1) turns the low-balance email on or off; `ad_minbalance` is the threshold in **currency units** (your account currency, e.g. `50.00`; stored as cents). Send either or both — an omitted field keeps its value. Read them back as `min_balance` / `low_balance` on `GET /funds`. Same handler as the panel. 
     * Set the low-balance warning.
     */
    async apiV1FundsBalanceSettingsPutRaw(requestParameters: ApiV1FundsBalanceSettingsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1FundsBalanceSettingsPutRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * `ad_sendbalancemail` (0/1) turns the low-balance email on or off; `ad_minbalance` is the threshold in **currency units** (your account currency, e.g. `50.00`; stored as cents). Send either or both — an omitted field keeps its value. Read them back as `min_balance` / `low_balance` on `GET /funds`. Same handler as the panel. 
     * Set the low-balance warning.
     */
    async apiV1FundsBalanceSettingsPut(requestParameters: ApiV1FundsBalanceSettingsPutOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1FundsBalanceSettingsPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for apiV1FundsDepositTypeFidGet without sending the request
     */
    async apiV1FundsDepositTypeFidGetRequestOpts(requestParameters: ApiV1FundsDepositTypeFidGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FundsDepositTypeFidGet().'
            );
        }

        if (requestParameters['fid'] == null) {
            throw new runtime.RequiredError(
                'fid',
                'Required parameter "fid" was null or undefined when calling apiV1FundsDepositTypeFidGet().'
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

        let urlPath = `/api/v1/funds/deposit/{type}/{fid}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));
        urlPath = urlPath.replace(`{${"fid"}}`, encodeURIComponent(String(requestParameters['fid'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Same handler as the panel\'s pay dialog. For an unpaid deposit it returns what is needed to pay: `view` names the method; hosted gateways (mollie, inxy, payhound, bybitpay, capitalist, trustpay, commercegate, yaadpay, whitebit fiat) return a checkout `url` to send the payer to (they come back to the tenant\'s panel); bank returns `bank_details` + `payee` + the transfer reference (`transaction_id`); wallet types return `wallet_id` / `wallet_network`; `wise` returns `bank_details` + `payee` like bank (the tenant\'s Wise account details for the deposit currency). Manual crypto wallets (btc_wallet, usdt_wallet*, usdc_wallet_erc20) also return `accepts_txn_hash: true` and the last `txn_claim` — after sending, POST the transaction hash to /api/v1/funds/deposits/{id}/txn-hash. `payoneer` returns the same (with `txn_ref_kind: reference`): POST the Payoneer transaction ID there. `bank` / `wise` return `accepts_proof: true` and the current `proof` where the tenant takes a proof of payment — upload it to /api/v1/funds/deposits/{id}/proof. `paypal`, `revolut` and `stripe` need the browser widget (client secret / order id) and are not completable by a server-side caller — use a URL-based type for agents. Amounts (`money`, `totalmoney`, `vat_amount`, `transaction_costs`) are cents.  Calling it can open a new order at the gateway (some types issue a fresh checkout each call), so it needs `funds.deposit`, not `funds.read`.  Once the deposit can no longer be paid the body is a single flag instead: `{\"invoice_paid\": true}` (paid), `{\"invoice_in_progress\": true}` (payment being processed) or `{\"unknown_invoice\": true}` (not yours / cancelled) — poll for `invoice_paid`. 
     * Checkout data for an open deposit — or its paid state.
     */
    async apiV1FundsDepositTypeFidGetRaw(requestParameters: ApiV1FundsDepositTypeFidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsDepositTypeFidGet200Response>> {
        const requestOptions = await this.apiV1FundsDepositTypeFidGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsDepositTypeFidGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Same handler as the panel\'s pay dialog. For an unpaid deposit it returns what is needed to pay: `view` names the method; hosted gateways (mollie, inxy, payhound, bybitpay, capitalist, trustpay, commercegate, yaadpay, whitebit fiat) return a checkout `url` to send the payer to (they come back to the tenant\'s panel); bank returns `bank_details` + `payee` + the transfer reference (`transaction_id`); wallet types return `wallet_id` / `wallet_network`; `wise` returns `bank_details` + `payee` like bank (the tenant\'s Wise account details for the deposit currency). Manual crypto wallets (btc_wallet, usdt_wallet*, usdc_wallet_erc20) also return `accepts_txn_hash: true` and the last `txn_claim` — after sending, POST the transaction hash to /api/v1/funds/deposits/{id}/txn-hash. `payoneer` returns the same (with `txn_ref_kind: reference`): POST the Payoneer transaction ID there. `bank` / `wise` return `accepts_proof: true` and the current `proof` where the tenant takes a proof of payment — upload it to /api/v1/funds/deposits/{id}/proof. `paypal`, `revolut` and `stripe` need the browser widget (client secret / order id) and are not completable by a server-side caller — use a URL-based type for agents. Amounts (`money`, `totalmoney`, `vat_amount`, `transaction_costs`) are cents.  Calling it can open a new order at the gateway (some types issue a fresh checkout each call), so it needs `funds.deposit`, not `funds.read`.  Once the deposit can no longer be paid the body is a single flag instead: `{\"invoice_paid\": true}` (paid), `{\"invoice_in_progress\": true}` (payment being processed) or `{\"unknown_invoice\": true}` (not yours / cancelled) — poll for `invoice_paid`. 
     * Checkout data for an open deposit — or its paid state.
     */
    async apiV1FundsDepositTypeFidGet(requestParameters: ApiV1FundsDepositTypeFidGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsDepositTypeFidGet200Response> {
        const response = await this.apiV1FundsDepositTypeFidGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsDepositTypePost without sending the request
     */
    async apiV1FundsDepositTypePostRequestOpts(requestParameters: ApiV1FundsDepositTypePostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling apiV1FundsDepositTypePost().'
            );
        }

        if (requestParameters['apiV1FundsDepositTypePostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FundsDepositTypePostRequest',
                'Required parameter "apiV1FundsDepositTypePostRequest" was null or undefined when calling apiV1FundsDepositTypePost().'
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

        let urlPath = `/api/v1/funds/deposit/{type}`;
        urlPath = urlPath.replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FundsDepositTypePostRequestToJSON(requestParameters['apiV1FundsDepositTypePostRequest']),
        };
    }

    /**
     * Same handler as the panel. For a payment type from GET /api/v1/funds/pay-types this books an unpaid deposit of `amount` (currency units, >= the type\'s `min_amount`) and returns its id as `fid` — no payment happens yet. Then call GET /api/v1/funds/deposit/{type}/{fid} for the checkout URL / bank details, and poll it (or GET /api/v1/funds/transactions) for the paid state.  Special `{type}` values that settle directly and need no pay type: - `bonus` — redeem a bonus code: body `{bonus: \"CODE\"}`, no amount. - `coupon` — redeem a voucher: body `{code: \"CODE\"}`, no amount. - `advertiser` — transfer `amount` to a connected advertiser   (`connectedUsers` = its user id).  `amount_deduction` and `credit_no_invoice` exist but need an admin session — an API key always gets 403. 
     * Open a deposit (or redeem a bonus / coupon code).
     */
    async apiV1FundsDepositTypePostRaw(requestParameters: ApiV1FundsDepositTypePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsDepositTypePost200Response>> {
        const requestOptions = await this.apiV1FundsDepositTypePostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsDepositTypePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Same handler as the panel. For a payment type from GET /api/v1/funds/pay-types this books an unpaid deposit of `amount` (currency units, >= the type\'s `min_amount`) and returns its id as `fid` — no payment happens yet. Then call GET /api/v1/funds/deposit/{type}/{fid} for the checkout URL / bank details, and poll it (or GET /api/v1/funds/transactions) for the paid state.  Special `{type}` values that settle directly and need no pay type: - `bonus` — redeem a bonus code: body `{bonus: \"CODE\"}`, no amount. - `coupon` — redeem a voucher: body `{code: \"CODE\"}`, no amount. - `advertiser` — transfer `amount` to a connected advertiser   (`connectedUsers` = its user id).  `amount_deduction` and `credit_no_invoice` exist but need an admin session — an API key always gets 403. 
     * Open a deposit (or redeem a bonus / coupon code).
     */
    async apiV1FundsDepositTypePost(requestParameters: ApiV1FundsDepositTypePostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsDepositTypePost200Response> {
        const response = await this.apiV1FundsDepositTypePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsDepositsIdDelete without sending the request
     */
    async apiV1FundsDepositsIdDeleteRequestOpts(requestParameters: ApiV1FundsDepositsIdDeleteRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FundsDepositsIdDelete().'
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

        let urlPath = `/api/v1/funds/deposits/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Deletes an open deposit of yours (same handler as the panel). A paid deposit, or one a card / PayPal / Stripe payment is already processing, can\'t be cancelled (404). 
     * Cancel an unpaid deposit.
     */
    async apiV1FundsDepositsIdDeleteRaw(requestParameters: ApiV1FundsDepositsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1RetargetingPixelsIdDelete200Response>> {
        const requestOptions = await this.apiV1FundsDepositsIdDeleteRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1RetargetingPixelsIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * Deletes an open deposit of yours (same handler as the panel). A paid deposit, or one a card / PayPal / Stripe payment is already processing, can\'t be cancelled (404). 
     * Cancel an unpaid deposit.
     */
    async apiV1FundsDepositsIdDelete(requestParameters: ApiV1FundsDepositsIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1RetargetingPixelsIdDelete200Response> {
        const response = await this.apiV1FundsDepositsIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsDepositsIdProofGet without sending the request
     */
    async apiV1FundsDepositsIdProofGetRequestOpts(requestParameters: ApiV1FundsDepositsIdProofGetRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FundsDepositsIdProofGet().'
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

        let urlPath = `/api/v1/funds/deposits/{id}/proof`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Streams your uploaded proof inline with its type (`application/pdf`, `image/jpeg` or `image/png`). 404 when the deposit is not yours or has no proof. 
     * Download the proof of payment you uploaded on a deposit.
     */
    async apiV1FundsDepositsIdProofGetRaw(requestParameters: ApiV1FundsDepositsIdProofGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        const requestOptions = await this.apiV1FundsDepositsIdProofGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Streams your uploaded proof inline with its type (`application/pdf`, `image/jpeg` or `image/png`). 404 when the deposit is not yours or has no proof. 
     * Download the proof of payment you uploaded on a deposit.
     */
    async apiV1FundsDepositsIdProofGet(requestParameters: ApiV1FundsDepositsIdProofGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.apiV1FundsDepositsIdProofGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsDepositsIdProofPost without sending the request
     */
    async apiV1FundsDepositsIdProofPostRequestOpts(requestParameters: ApiV1FundsDepositsIdProofPostRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FundsDepositsIdProofPost().'
            );
        }

        if (requestParameters['file'] == null) {
            throw new runtime.RequiredError(
                'file',
                'Required parameter "file" was null or undefined when calling apiV1FundsDepositsIdProofPost().'
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


        let urlPath = `/api/v1/funds/deposits/{id}/proof`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * Same handler as the panel\'s deposit list and pay dialog. After paying an open `bank` or `wise` deposit by transfer, upload the proof of payment (bank receipt / transfer confirmation) so the tenant\'s finance team can approve the deposit without waiting for the money to show up. Only where the tenant switched it on for that method — the deposit rows and the deposit payload say so with `accepts_proof: true`.  Multipart, field `file`: a PDF, JPG or PNG of at most 10 MB. The type is read from the file content, not its name. A new upload replaces the earlier proof; cancelling the deposit removes it. **The proof never credits the balance** — an admin approves the deposit. At most 30 uploads per hour per account. 
     * Upload the proof of payment of an open bank or Wise deposit.
     */
    async apiV1FundsDepositsIdProofPostRaw(requestParameters: ApiV1FundsDepositsIdProofPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsDepositsIdProofPost200Response>> {
        const requestOptions = await this.apiV1FundsDepositsIdProofPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsDepositsIdProofPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Same handler as the panel\'s deposit list and pay dialog. After paying an open `bank` or `wise` deposit by transfer, upload the proof of payment (bank receipt / transfer confirmation) so the tenant\'s finance team can approve the deposit without waiting for the money to show up. Only where the tenant switched it on for that method — the deposit rows and the deposit payload say so with `accepts_proof: true`.  Multipart, field `file`: a PDF, JPG or PNG of at most 10 MB. The type is read from the file content, not its name. A new upload replaces the earlier proof; cancelling the deposit removes it. **The proof never credits the balance** — an admin approves the deposit. At most 30 uploads per hour per account. 
     * Upload the proof of payment of an open bank or Wise deposit.
     */
    async apiV1FundsDepositsIdProofPost(requestParameters: ApiV1FundsDepositsIdProofPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsDepositsIdProofPost200Response> {
        const response = await this.apiV1FundsDepositsIdProofPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsDepositsIdTxnHashPost without sending the request
     */
    async apiV1FundsDepositsIdTxnHashPostRequestOpts(requestParameters: ApiV1FundsDepositsIdTxnHashPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiV1FundsDepositsIdTxnHashPost().'
            );
        }

        if (requestParameters['apiV1FundsDepositsIdTxnHashPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FundsDepositsIdTxnHashPostRequest',
                'Required parameter "apiV1FundsDepositsIdTxnHashPostRequest" was null or undefined when calling apiV1FundsDepositsIdTxnHashPost().'
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

        let urlPath = `/api/v1/funds/deposits/{id}/txn-hash`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FundsDepositsIdTxnHashPostRequestToJSON(requestParameters['apiV1FundsDepositsIdTxnHashPostRequest']),
        };
    }

    /**
     * Same handler as the panel\'s pay dialog. After sending a manual crypto deposit (btc_wallet, usdt_wallet, usdt_wallet_trc20 / _bep20 / _erc20, usdc_wallet_erc20) to the tenant\'s wallet, post the transaction hash. It is looked up on the public blockchain and the result is stored on the deposit for the tenant\'s finance team.  **The hash never credits the balance.** An admin approves the deposit after the check (or with a written override). The check confirms: the tenant\'s wallet received the deposit\'s asset (the real USDT / USDC contract, or BTC), at least the invoice total, in a final block, sent no earlier than the deposit was opened.  `txn_claim.status`: `verified`, `pending` (not final yet — post the same hash again later to re-check), `mismatch` (wrong asset / wallet / amount / date — see `reason`), `not_found`, `unchecked` (the tenant\'s wallet or network is not configured) or `error` (the explorer could not be reached). Posting a different hash replaces the earlier one while the deposit is open. A hash already used on another deposit is refused. At most 20 checks per hour per account.  **Payoneer deposits** take the Payoneer transaction ID on the same route: 4–64 letters, digits and `. _ / # : -`, no spaces. It is stored as given for the finance team to match with the payment (`txn_claim.status: submitted`) and not checked automatically; one ID per deposit, an ID already on another deposit is refused, posting a new one replaces it while the deposit is open. 
     * Attach the transaction hash of a manual crypto deposit, or the transaction ID of a Payoneer deposit.
     */
    async apiV1FundsDepositsIdTxnHashPostRaw(requestParameters: ApiV1FundsDepositsIdTxnHashPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsDepositsIdTxnHashPost200Response>> {
        const requestOptions = await this.apiV1FundsDepositsIdTxnHashPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsDepositsIdTxnHashPost200ResponseFromJSON(jsonValue));
    }

    /**
     * Same handler as the panel\'s pay dialog. After sending a manual crypto deposit (btc_wallet, usdt_wallet, usdt_wallet_trc20 / _bep20 / _erc20, usdc_wallet_erc20) to the tenant\'s wallet, post the transaction hash. It is looked up on the public blockchain and the result is stored on the deposit for the tenant\'s finance team.  **The hash never credits the balance.** An admin approves the deposit after the check (or with a written override). The check confirms: the tenant\'s wallet received the deposit\'s asset (the real USDT / USDC contract, or BTC), at least the invoice total, in a final block, sent no earlier than the deposit was opened.  `txn_claim.status`: `verified`, `pending` (not final yet — post the same hash again later to re-check), `mismatch` (wrong asset / wallet / amount / date — see `reason`), `not_found`, `unchecked` (the tenant\'s wallet or network is not configured) or `error` (the explorer could not be reached). Posting a different hash replaces the earlier one while the deposit is open. A hash already used on another deposit is refused. At most 20 checks per hour per account.  **Payoneer deposits** take the Payoneer transaction ID on the same route: 4–64 letters, digits and `. _ / # : -`, no spaces. It is stored as given for the finance team to match with the payment (`txn_claim.status: submitted`) and not checked automatically; one ID per deposit, an ID already on another deposit is refused, posting a new one replaces it while the deposit is open. 
     * Attach the transaction hash of a manual crypto deposit, or the transaction ID of a Payoneer deposit.
     */
    async apiV1FundsDepositsIdTxnHashPost(requestParameters: ApiV1FundsDepositsIdTxnHashPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsDepositsIdTxnHashPost200Response> {
        const response = await this.apiV1FundsDepositsIdTxnHashPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsGet without sending the request
     */
    async apiV1FundsGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/funds`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Use this before deciding to launch or pause a campaign — `low_balance` is true when current balance is below the user-configured minimum. 
     * Current advertiser balance + pending deposits.
     */
    async apiV1FundsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsGet200Response>> {
        const requestOptions = await this.apiV1FundsGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Use this before deciding to launch or pause a campaign — `low_balance` is true when current balance is below the user-configured minimum. 
     * Current advertiser balance + pending deposits.
     */
    async apiV1FundsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsGet200Response> {
        const response = await this.apiV1FundsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsPayTypesGet without sending the request
     */
    async apiV1FundsPayTypesGetRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/v1/funds/pay-types`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The `{type}` values POST /api/v1/funds/deposit/{type} accepts for this account: active on the tenant, allowed by the account\'s rights and offered in its currency. Same handler as the panel\'s Add Funds page. `initiates_payment: false` means the deposit only books an invoice to settle out of band (bank transfer, wallet address, Pay ID). `min_amount` is in currency units. 
     * Payment methods this account can deposit with.
     */
    async apiV1FundsPayTypesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsPayTypesGet200Response>> {
        const requestOptions = await this.apiV1FundsPayTypesGetRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsPayTypesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * The `{type}` values POST /api/v1/funds/deposit/{type} accepts for this account: active on the tenant, allowed by the account\'s rights and offered in its currency. Same handler as the panel\'s Add Funds page. `initiates_payment: false` means the deposit only books an invoice to settle out of band (bank transfer, wallet address, Pay ID). `min_amount` is in currency units. 
     * Payment methods this account can deposit with.
     */
    async apiV1FundsPayTypesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsPayTypesGet200Response> {
        const response = await this.apiV1FundsPayTypesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsTransactionsGet without sending the request
     */
    async apiV1FundsTransactionsGetRequestOpts(requestParameters: ApiV1FundsTransactionsGetRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = (requestParameters['from'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['to'] != null) {
            queryParameters['to'] = (requestParameters['to'] as any).toISOString().substring(0,10);
        }

        if (requestParameters['filterId'] != null) {
            queryParameters['filter_id'] = requestParameters['filterId'];
        }

        if (requestParameters['filterPaytype'] != null) {
            queryParameters['filter_paytype'] = requestParameters['filterPaytype'];
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

        let urlPath = `/api/v1/funds/transactions`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Paginated `advertiser_money` rows for the account (paid and unpaid, incl. transfers received). Same handler as the panel\'s Transactions tab. `money` is in cents; `amount` is the same value in currency units (negative for a transfer you sent). `status` is `pending`, `processing` or `completed`. `payment_methods` lists every paytype the history carries, for filtering with `filter_paytype`. 
     * Funds ledger — deposits, bonuses, transfers, refunds.
     */
    async apiV1FundsTransactionsGetRaw(requestParameters: ApiV1FundsTransactionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiV1FundsTransactionsGet200Response>> {
        const requestOptions = await this.apiV1FundsTransactionsGetRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiV1FundsTransactionsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * Paginated `advertiser_money` rows for the account (paid and unpaid, incl. transfers received). Same handler as the panel\'s Transactions tab. `money` is in cents; `amount` is the same value in currency units (negative for a transfer you sent). `status` is `pending`, `processing` or `completed`. `payment_methods` lists every paytype the history carries, for filtering with `filter_paytype`. 
     * Funds ledger — deposits, bonuses, transfers, refunds.
     */
    async apiV1FundsTransactionsGet(requestParameters: ApiV1FundsTransactionsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiV1FundsTransactionsGet200Response> {
        const response = await this.apiV1FundsTransactionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for apiV1FundsTransferPost without sending the request
     */
    async apiV1FundsTransferPostRequestOpts(requestParameters: ApiV1FundsTransferPostOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['apiV1FundsTransferPostRequest'] == null) {
            throw new runtime.RequiredError(
                'apiV1FundsTransferPostRequest',
                'Required parameter "apiV1FundsTransferPostRequest" was null or undefined when calling apiV1FundsTransferPost().'
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

        let urlPath = `/api/v1/funds/transfer`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApiV1FundsTransferPostRequestToJSON(requestParameters['apiV1FundsTransferPostRequest']),
        };
    }

    /**
     * Transfers `amount` from your advertiser balance to another account your network has connected to yours. Every panel safeguard applies:  - the account needs the `transfer_money_other_advertiser` right   (403 otherwise); - `connectedUsers` must be on the account\'s connected-transfer list,   which only network staff maintain (403 otherwise); - `amount` is in **currency units** of your account currency, at   least 5.00; - the balance is checked and debited atomically (422 `insufficient`,   409 `balance_changed` on a race); the recipient is credited in   their own currency at the current rate, and a ledger row   (paytype −2) plus an action-log entry record it.  `funds.write` is required for every key path that moves money, including `POST /funds/deposit/advertiser`. Not idempotent — do not blindly retry a timed-out call; check `GET /funds/transactions`. 
     * Move balance to a connected advertiser account.
     */
    async apiV1FundsTransferPostRaw(requestParameters: ApiV1FundsTransferPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.apiV1FundsTransferPostRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Transfers `amount` from your advertiser balance to another account your network has connected to yours. Every panel safeguard applies:  - the account needs the `transfer_money_other_advertiser` right   (403 otherwise); - `connectedUsers` must be on the account\'s connected-transfer list,   which only network staff maintain (403 otherwise); - `amount` is in **currency units** of your account currency, at   least 5.00; - the balance is checked and debited atomically (422 `insufficient`,   409 `balance_changed` on a race); the recipient is credited in   their own currency at the current rate, and a ledger row   (paytype −2) plus an action-log entry record it.  `funds.write` is required for every key path that moves money, including `POST /funds/deposit/advertiser`. Not idempotent — do not blindly retry a timed-out call; check `GET /funds/transactions`. 
     * Move balance to a connected advertiser account.
     */
    async apiV1FundsTransferPost(requestParameters: ApiV1FundsTransferPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1FundsTransferPostRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ApiV1FundsTransactionsGetSortByEnum = {
    Id: 'id',
    Dateadded: 'dateadded',
    Money: 'money',
    Paytype: 'paytype'
} as const;
export type ApiV1FundsTransactionsGetSortByEnum = typeof ApiV1FundsTransactionsGetSortByEnum[keyof typeof ApiV1FundsTransactionsGetSortByEnum];
/**
 * @export
 */
export const ApiV1FundsTransactionsGetSortDirEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ApiV1FundsTransactionsGetSortDirEnum = typeof ApiV1FundsTransactionsGetSortDirEnum[keyof typeof ApiV1FundsTransactionsGetSortDirEnum];
