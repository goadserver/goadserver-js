# FundsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1FundsBalanceSettingsPut**](FundsApi.md#apiv1fundsbalancesettingsputoperation) | **PUT** /api/v1/funds/balance-settings | Set the low-balance warning. |
| [**apiV1FundsDepositTypeFidGet**](FundsApi.md#apiv1fundsdeposittypefidget) | **GET** /api/v1/funds/deposit/{type}/{fid} | Checkout data for an open deposit — or its paid state. |
| [**apiV1FundsDepositTypePost**](FundsApi.md#apiv1fundsdeposittypepostoperation) | **POST** /api/v1/funds/deposit/{type} | Open a deposit (or redeem a bonus / coupon code). |
| [**apiV1FundsDepositsIdDelete**](FundsApi.md#apiv1fundsdepositsiddelete) | **DELETE** /api/v1/funds/deposits/{id} | Cancel an unpaid deposit. |
| [**apiV1FundsDepositsIdProofGet**](FundsApi.md#apiv1fundsdepositsidproofget) | **GET** /api/v1/funds/deposits/{id}/proof | Download the proof of payment you uploaded on a deposit. |
| [**apiV1FundsDepositsIdProofPost**](FundsApi.md#apiv1fundsdepositsidproofpost) | **POST** /api/v1/funds/deposits/{id}/proof | Upload the proof of payment of an open bank or Wise deposit. |
| [**apiV1FundsDepositsIdTxnHashPost**](FundsApi.md#apiv1fundsdepositsidtxnhashpostoperation) | **POST** /api/v1/funds/deposits/{id}/txn-hash | Attach the transaction hash of a manual crypto deposit, or the transaction ID of a Payoneer deposit. |
| [**apiV1FundsGet**](FundsApi.md#apiv1fundsget) | **GET** /api/v1/funds | Current advertiser balance + pending deposits. |
| [**apiV1FundsPayTypesGet**](FundsApi.md#apiv1fundspaytypesget) | **GET** /api/v1/funds/pay-types | Payment methods this account can deposit with. |
| [**apiV1FundsTransactionsGet**](FundsApi.md#apiv1fundstransactionsget) | **GET** /api/v1/funds/transactions | Funds ledger — deposits, bonuses, transfers, refunds. |
| [**apiV1FundsTransferPost**](FundsApi.md#apiv1fundstransferpostoperation) | **POST** /api/v1/funds/transfer | Move balance to a connected advertiser account. |



## apiV1FundsBalanceSettingsPut

> apiV1FundsBalanceSettingsPut(apiV1FundsBalanceSettingsPutRequest)

Set the low-balance warning.

&#x60;ad_sendbalancemail&#x60; (0/1) turns the low-balance email on or off; &#x60;ad_minbalance&#x60; is the threshold in **currency units** (your account currency, e.g. &#x60;50.00&#x60;; stored as cents). Send either or both — an omitted field keeps its value. Read them back as &#x60;min_balance&#x60; / &#x60;low_balance&#x60; on &#x60;GET /funds&#x60;. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsBalanceSettingsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // ApiV1FundsBalanceSettingsPutRequest
    apiV1FundsBalanceSettingsPutRequest: {"ad_sendbalancemail":1,"ad_minbalance":50},
  } satisfies ApiV1FundsBalanceSettingsPutOperationRequest;

  try {
    const data = await api.apiV1FundsBalanceSettingsPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1FundsBalanceSettingsPutRequest** | [ApiV1FundsBalanceSettingsPutRequest](ApiV1FundsBalanceSettingsPutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Saved. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Nothing sent, &#x60;ad_sendbalancemail&#x60; not 0/1, &#x60;ad_minbalance&#x60; negative / out of range, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsDepositTypeFidGet

> ApiV1FundsDepositTypeFidGet200Response apiV1FundsDepositTypeFidGet(type, fid)

Checkout data for an open deposit — or its paid state.

Same handler as the panel\&#39;s pay dialog. For an unpaid deposit it returns what is needed to pay: &#x60;view&#x60; names the method; hosted gateways (mollie, inxy, payhound, bybitpay, capitalist, trustpay, commercegate, yaadpay, whitebit fiat) return a checkout &#x60;url&#x60; to send the payer to (they come back to the tenant\&#39;s panel); bank returns &#x60;bank_details&#x60; + &#x60;payee&#x60; + the transfer reference (&#x60;transaction_id&#x60;); wallet types return &#x60;wallet_id&#x60; / &#x60;wallet_network&#x60;; &#x60;wise&#x60; returns &#x60;bank_details&#x60; + &#x60;payee&#x60; like bank (the tenant\&#39;s Wise account details for the deposit currency). Manual crypto wallets (btc_wallet, usdt_wallet*, usdc_wallet_erc20) also return &#x60;accepts_txn_hash: true&#x60; and the last &#x60;txn_claim&#x60; — after sending, POST the transaction hash to /api/v1/funds/deposits/{id}/txn-hash. &#x60;payoneer&#x60; returns the same (with &#x60;txn_ref_kind: reference&#x60;): POST the Payoneer transaction ID there. &#x60;bank&#x60; / &#x60;wise&#x60; return &#x60;accepts_proof: true&#x60; and the current &#x60;proof&#x60; where the tenant takes a proof of payment — upload it to /api/v1/funds/deposits/{id}/proof. &#x60;paypal&#x60;, &#x60;revolut&#x60; and &#x60;stripe&#x60; need the browser widget (client secret / order id) and are not completable by a server-side caller — use a URL-based type for agents. Amounts (&#x60;money&#x60;, &#x60;totalmoney&#x60;, &#x60;vat_amount&#x60;, &#x60;transaction_costs&#x60;) are cents.  Calling it can open a new order at the gateway (some types issue a fresh checkout each call), so it needs &#x60;funds.deposit&#x60;, not &#x60;funds.read&#x60;.  Once the deposit can no longer be paid the body is a single flag instead: &#x60;{\&quot;invoice_paid\&quot;: true}&#x60; (paid), &#x60;{\&quot;invoice_in_progress\&quot;: true}&#x60; (payment being processed) or &#x60;{\&quot;unknown_invoice\&quot;: true}&#x60; (not yours / cancelled) — poll for &#x60;invoice_paid&#x60;. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsDepositTypeFidGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // string | The pay type the deposit was opened with.
    type: bank,
    // number | Deposit id from POST /api/v1/funds/deposit/{type}.
    fid: 56,
  } satisfies ApiV1FundsDepositTypeFidGetRequest;

  try {
    const data = await api.apiV1FundsDepositTypeFidGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **type** | `string` | The pay type the deposit was opened with. | [Defaults to `undefined`] |
| **fid** | `number` | Deposit id from POST /api/v1/funds/deposit/{type}. | [Defaults to `undefined`] |

### Return type

[**ApiV1FundsDepositTypeFidGet200Response**](ApiV1FundsDepositTypeFidGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Checkout payload, or a status flag |  -  |
| **400** | Unknown pay type or deposit id (&#x60;invalid_request&#x60;), or a type with no checkout (&#x60;unsupported_paytype&#x60;). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **409** | Stripe not configured for the tenant. |  -  |
| **500** | The gateway refused to open the order (&#x60;&lt;type&gt;_failed&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsDepositTypePost

> ApiV1FundsDepositTypePost200Response apiV1FundsDepositTypePost(type, apiV1FundsDepositTypePostRequest)

Open a deposit (or redeem a bonus / coupon code).

Same handler as the panel. For a payment type from GET /api/v1/funds/pay-types this books an unpaid deposit of &#x60;amount&#x60; (currency units, &gt;&#x3D; the type\&#39;s &#x60;min_amount&#x60;) and returns its id as &#x60;fid&#x60; — no payment happens yet. Then call GET /api/v1/funds/deposit/{type}/{fid} for the checkout URL / bank details, and poll it (or GET /api/v1/funds/transactions) for the paid state.  Special &#x60;{type}&#x60; values that settle directly and need no pay type: - &#x60;bonus&#x60; — redeem a bonus code: body &#x60;{bonus: \&quot;CODE\&quot;}&#x60;, no amount. - &#x60;coupon&#x60; — redeem a voucher: body &#x60;{code: \&quot;CODE\&quot;}&#x60;, no amount. - &#x60;advertiser&#x60; — transfer &#x60;amount&#x60; to a connected advertiser   (&#x60;connectedUsers&#x60; &#x3D; its user id).  &#x60;amount_deduction&#x60; and &#x60;credit_no_invoice&#x60; exist but need an admin session — an API key always gets 403. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsDepositTypePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // string | A `key` from GET /api/v1/funds/pay-types, or bonus / coupon / advertiser.
    type: bank,
    // ApiV1FundsDepositTypePostRequest
    apiV1FundsDepositTypePostRequest: {"amount":250},
  } satisfies ApiV1FundsDepositTypePostOperationRequest;

  try {
    const data = await api.apiV1FundsDepositTypePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **type** | `string` | A &#x60;key&#x60; from GET /api/v1/funds/pay-types, or bonus / coupon / advertiser. | [Defaults to `undefined`] |
| **apiV1FundsDepositTypePostRequest** | [ApiV1FundsDepositTypePostRequest](ApiV1FundsDepositTypePostRequest.md) |  | |

### Return type

[**ApiV1FundsDepositTypePost200Response**](ApiV1FundsDepositTypePost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pay type: &#x60;{fid}&#x60; (the deposit id). bonus / coupon / advertiser: a message about the credited / transferred amount.  |  -  |
| **400** | Missing or unavailable payment type (&#x60;invalid_paytype&#x60;), or a coupon without &#x60;code&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **413** | Body over 16 KB. |  -  |
| **422** | Amount missing / below the minimum, or an invalid bonus (&#x60;errors.bonus: [FALSE_CODE_GIVEN]&#x60;) / coupon code (&#x60;invalid_coupon&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsDepositsIdDelete

> ApiV1RetargetingPixelsIdDelete200Response apiV1FundsDepositsIdDelete(id)

Cancel an unpaid deposit.

Deletes an open deposit of yours (same handler as the panel). A paid deposit, or one a card / PayPal / Stripe payment is already processing, can\&#39;t be cancelled (404). 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsDepositsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // number | Deposit id (`fid`).
    id: 56,
  } satisfies ApiV1FundsDepositsIdDeleteRequest;

  try {
    const data = await api.apiV1FundsDepositsIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Deposit id (&#x60;fid&#x60;). | [Defaults to `undefined`] |

### Return type

[**ApiV1RetargetingPixelsIdDelete200Response**](ApiV1RetargetingPixelsIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Cancelled |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found or cannot be cancelled. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsDepositsIdProofGet

> Blob apiV1FundsDepositsIdProofGet(id)

Download the proof of payment you uploaded on a deposit.

Streams your uploaded proof inline with its type (&#x60;application/pdf&#x60;, &#x60;image/jpeg&#x60; or &#x60;image/png&#x60;). 404 when the deposit is not yours or has no proof. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsDepositsIdProofGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // number | Deposit id (`fid`).
    id: 56,
  } satisfies ApiV1FundsDepositsIdProofGetRequest;

  try {
    const data = await api.apiV1FundsDepositsIdProofGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Deposit id (&#x60;fid&#x60;). | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/pdf`, `image/jpeg`, `image/png`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The file |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | No proof on this deposit, or not your deposit. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsDepositsIdProofPost

> ApiV1FundsDepositsIdProofPost200Response apiV1FundsDepositsIdProofPost(id, file)

Upload the proof of payment of an open bank or Wise deposit.

Same handler as the panel\&#39;s deposit list and pay dialog. After paying an open &#x60;bank&#x60; or &#x60;wise&#x60; deposit by transfer, upload the proof of payment (bank receipt / transfer confirmation) so the tenant\&#39;s finance team can approve the deposit without waiting for the money to show up. Only where the tenant switched it on for that method — the deposit rows and the deposit payload say so with &#x60;accepts_proof: true&#x60;.  Multipart, field &#x60;file&#x60;: a PDF, JPG or PNG of at most 10 MB. The type is read from the file content, not its name. A new upload replaces the earlier proof; cancelling the deposit removes it. **The proof never credits the balance** — an admin approves the deposit. At most 30 uploads per hour per account. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsDepositsIdProofPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // number | Deposit id (`fid`).
    id: 56,
    // Blob | PDF, JPG or PNG, max 10 MB.
    file: BINARY_DATA_HERE,
  } satisfies ApiV1FundsDepositsIdProofPostRequest;

  try {
    const data = await api.apiV1FundsDepositsIdProofPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Deposit id (&#x60;fid&#x60;). | [Defaults to `undefined`] |
| **file** | `Blob` | PDF, JPG or PNG, max 10 MB. | [Defaults to `undefined`] |

### Return type

[**ApiV1FundsDepositsIdProofPost200Response**](ApiV1FundsDepositsIdProofPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Stored |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Deposit not found (not yours). |  -  |
| **413** | File larger than 10 MB. |  -  |
| **422** | &#x60;errors.file&#x60;: no file, not a PDF / JPG / PNG, the deposit is paid, or its payment method takes no proof (not bank / Wise, or switched off by the tenant). |  -  |
| **429** | Too many uploads; see Retry-After. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsDepositsIdTxnHashPost

> ApiV1FundsDepositsIdTxnHashPost200Response apiV1FundsDepositsIdTxnHashPost(id, apiV1FundsDepositsIdTxnHashPostRequest)

Attach the transaction hash of a manual crypto deposit, or the transaction ID of a Payoneer deposit.

Same handler as the panel\&#39;s pay dialog. After sending a manual crypto deposit (btc_wallet, usdt_wallet, usdt_wallet_trc20 / _bep20 / _erc20, usdc_wallet_erc20) to the tenant\&#39;s wallet, post the transaction hash. It is looked up on the public blockchain and the result is stored on the deposit for the tenant\&#39;s finance team.  **The hash never credits the balance.** An admin approves the deposit after the check (or with a written override). The check confirms: the tenant\&#39;s wallet received the deposit\&#39;s asset (the real USDT / USDC contract, or BTC), at least the invoice total, in a final block, sent no earlier than the deposit was opened.  &#x60;txn_claim.status&#x60;: &#x60;verified&#x60;, &#x60;pending&#x60; (not final yet — post the same hash again later to re-check), &#x60;mismatch&#x60; (wrong asset / wallet / amount / date — see &#x60;reason&#x60;), &#x60;not_found&#x60;, &#x60;unchecked&#x60; (the tenant\&#39;s wallet or network is not configured) or &#x60;error&#x60; (the explorer could not be reached). Posting a different hash replaces the earlier one while the deposit is open. A hash already used on another deposit is refused. At most 20 checks per hour per account.  **Payoneer deposits** take the Payoneer transaction ID on the same route: 4–64 letters, digits and &#x60;. _ / # : -&#x60;, no spaces. It is stored as given for the finance team to match with the payment (&#x60;txn_claim.status: submitted&#x60;) and not checked automatically; one ID per deposit, an ID already on another deposit is refused, posting a new one replaces it while the deposit is open. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsDepositsIdTxnHashPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // number | Deposit id (`fid`).
    id: 56,
    // ApiV1FundsDepositsIdTxnHashPostRequest
    apiV1FundsDepositsIdTxnHashPostRequest: {"txn_hash":"d6f659cce4d1bf2f1c724593fde8d9bb7c0385d5224ad410557f85297cdc8f71"},
  } satisfies ApiV1FundsDepositsIdTxnHashPostOperationRequest;

  try {
    const data = await api.apiV1FundsDepositsIdTxnHashPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Deposit id (&#x60;fid&#x60;). | [Defaults to `undefined`] |
| **apiV1FundsDepositsIdTxnHashPostRequest** | [ApiV1FundsDepositsIdTxnHashPostRequest](ApiV1FundsDepositsIdTxnHashPostRequest.md) |  | |

### Return type

[**ApiV1FundsDepositsIdTxnHashPost200Response**](ApiV1FundsDepositsIdTxnHashPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Stored, with the check result |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Deposit not found (not yours). |  -  |
| **422** | &#x60;errors.txn_hash&#x60;: empty, not a valid hash for the network (or not a valid Payoneer transaction ID), already used on another deposit, the deposit is paid, or its payment method takes no hash. |  -  |
| **429** | Too many checks; see Retry-After. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsGet

> ApiV1FundsGet200Response apiV1FundsGet()

Current advertiser balance + pending deposits.

Use this before deciding to launch or pause a campaign — &#x60;low_balance&#x60; is true when current balance is below the user-configured minimum. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  try {
    const data = await api.apiV1FundsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiV1FundsGet200Response**](ApiV1FundsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Balance snapshot |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsPayTypesGet

> ApiV1FundsPayTypesGet200Response apiV1FundsPayTypesGet()

Payment methods this account can deposit with.

The &#x60;{type}&#x60; values POST /api/v1/funds/deposit/{type} accepts for this account: active on the tenant, allowed by the account\&#39;s rights and offered in its currency. Same handler as the panel\&#39;s Add Funds page. &#x60;initiates_payment: false&#x60; means the deposit only books an invoice to settle out of band (bank transfer, wallet address, Pay ID). &#x60;min_amount&#x60; is in currency units. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsPayTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  try {
    const data = await api.apiV1FundsPayTypesGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiV1FundsPayTypesGet200Response**](ApiV1FundsPayTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pay types |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsTransactionsGet

> ApiV1FundsTransactionsGet200Response apiV1FundsTransactionsGet(from, to, filterId, filterPaytype, sortBy, sortDir, page, perPage)

Funds ledger — deposits, bonuses, transfers, refunds.

Paginated &#x60;advertiser_money&#x60; rows for the account (paid and unpaid, incl. transfers received). Same handler as the panel\&#39;s Transactions tab. &#x60;money&#x60; is in cents; &#x60;amount&#x60; is the same value in currency units (negative for a transfer you sent). &#x60;status&#x60; is &#x60;pending&#x60;, &#x60;processing&#x60; or &#x60;completed&#x60;. &#x60;payment_methods&#x60; lists every paytype the history carries, for filtering with &#x60;filter_paytype&#x60;. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsTransactionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // Date | dateadded >= from (optional)
    from: 2013-10-20,
    // Date | dateadded <= to (optional)
    to: 2013-10-20,
    // number (optional)
    filterId: 56,
    // number | Numeric paytype (negative = internal: -1 bonus, -2 transfer, -3 flat refund, -4 coupon, -5 from publisher, -6 RON refund, -7 credit, -8 deduction). (optional)
    filterPaytype: 56,
    // 'id' | 'dateadded' | 'money' | 'paytype' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1FundsTransactionsGetRequest;

  try {
    const data = await api.apiV1FundsTransactionsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **from** | `Date` | dateadded &gt;&#x3D; from | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | dateadded &lt;&#x3D; to | [Optional] [Defaults to `undefined`] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterPaytype** | `number` | Numeric paytype (negative &#x3D; internal: -1 bonus, -2 transfer, -3 flat refund, -4 coupon, -5 from publisher, -6 RON refund, -7 credit, -8 deduction). | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `dateadded`, `money`, `paytype` |  | [Optional] [Defaults to `&#39;dateadded&#39;`] [Enum: id, dateadded, money, paytype] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |

### Return type

[**ApiV1FundsTransactionsGet200Response**](ApiV1FundsTransactionsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ledger page |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FundsTransferPost

> apiV1FundsTransferPost(apiV1FundsTransferPostRequest)

Move balance to a connected advertiser account.

Transfers &#x60;amount&#x60; from your advertiser balance to another account your network has connected to yours. Every panel safeguard applies:  - the account needs the &#x60;transfer_money_other_advertiser&#x60; right   (403 otherwise); - &#x60;connectedUsers&#x60; must be on the account\&#39;s connected-transfer list,   which only network staff maintain (403 otherwise); - &#x60;amount&#x60; is in **currency units** of your account currency, at   least 5.00; - the balance is checked and debited atomically (422 &#x60;insufficient&#x60;,   409 &#x60;balance_changed&#x60; on a race); the recipient is credited in   their own currency at the current rate, and a ledger row   (paytype −2) plus an action-log entry record it.  &#x60;funds.write&#x60; is required for every key path that moves money, including &#x60;POST /funds/deposit/advertiser&#x60;. Not idempotent — do not blindly retry a timed-out call; check &#x60;GET /funds/transactions&#x60;. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsTransferPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  const body = {
    // ApiV1FundsTransferPostRequest
    apiV1FundsTransferPostRequest: {"connectedUsers":10234,"amount":250},
  } satisfies ApiV1FundsTransferPostOperationRequest;

  try {
    const data = await api.apiV1FundsTransferPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **apiV1FundsTransferPostRequest** | [ApiV1FundsTransferPostRequest](ApiV1FundsTransferPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transferred. The body is the bare string &#x60;SUCCESS_TRANSFER&#x60;. |  -  |
| **400** | &#x60;invalid_request&#x60;, &#x60;missing_target&#x60;. |  -  |
| **403** | &#x60;missing_scope&#x60; (funds.write), right missing, or recipient not connected. |  -  |
| **409** | &#x60;balance_changed&#x60; — retry after reading the balance. |  -  |
| **422** | Amount invalid / below 5.00, &#x60;insufficient&#x60; balance, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

