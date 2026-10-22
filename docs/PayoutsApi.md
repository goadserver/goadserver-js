# PayoutsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherFinanceEarningsGet**](PayoutsApi.md#apiv1publisherfinanceearningsget) | **GET** /api/v1/publisher/finance/earnings | Earnings per day, week or month. |
| [**apiV1PublisherFinanceGet**](PayoutsApi.md#apiv1publisherfinanceget) | **GET** /api/v1/publisher/finance | Publisher balance and payout rules. |
| [**apiV1PublisherFinanceMonthEarningsGet**](PayoutsApi.md#apiv1publisherfinancemonthearningsget) | **GET** /api/v1/publisher/finance/month-earnings | Monthly earnings statements. |
| [**apiV1PublisherFinancePayoutRequestPost**](PayoutsApi.md#apiv1publisherfinancepayoutrequestpostoperation) | **POST** /api/v1/publisher/finance/payout-request | Request a payout of the balance. |
| [**apiV1PublisherFinancePayoutTypesGet**](PayoutsApi.md#apiv1publisherfinancepayouttypesget) | **GET** /api/v1/publisher/finance/payout-types | Payout methods this account may choose. |
| [**apiV1PublisherFinancePayoutsGet**](PayoutsApi.md#apiv1publisherfinancepayoutsget) | **GET** /api/v1/publisher/finance/payouts | List payout requests and payouts. |
| [**apiV1PublisherFinanceSettingsGet**](PayoutsApi.md#apiv1publisherfinancesettingsget) | **GET** /api/v1/publisher/finance/settings | Payout method and payment details. |
| [**apiV1PublisherFinanceSettingsPut**](PayoutsApi.md#apiv1publisherfinancesettingsputoperation) | **PUT** /api/v1/publisher/finance/settings | Change the payout method or payment details. |
| [**apiV1PublisherFinanceTransactionsGet**](PayoutsApi.md#apiv1publisherfinancetransactionsget) | **GET** /api/v1/publisher/finance/transactions | List payout transactions (with USD totals). |
| [**apiV1PublisherFinanceTransactionsIdGet**](PayoutsApi.md#apiv1publisherfinancetransactionsidget) | **GET** /api/v1/publisher/finance/transactions/{id} | One payout transaction. |
| [**apiV1PublisherFinanceTransactionsIdInvoicePdfGet**](PayoutsApi.md#apiv1publisherfinancetransactionsidinvoicepdfget) | **GET** /api/v1/publisher/finance/transactions/{id}/invoice-pdf | Download the self-billing invoice PDF of a paid payout. |
| [**apiV1PublisherFinanceTransferToAdvertiserPost**](PayoutsApi.md#apiv1publisherfinancetransfertoadvertiserpostoperation) | **POST** /api/v1/publisher/finance/transfer-to-advertiser | Move publisher balance to the advertiser budget. |



## apiV1PublisherFinanceEarningsGet

> ApiV1PublisherFinanceEarningsGet200Response apiV1PublisherFinanceEarningsGet(from, to, groupBy)

Earnings per day, week or month.

Publisher earnings from the stats store, bucketed by &#x60;group_by&#x60;.  **Money units.** &#x60;amount&#x60; and &#x60;summary.total&#x60; are **whole currency units** rounded to 2 decimals (unlike the balance fields, which are cents). Recent hours may still be incomplete. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceEarningsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // Date | Inclusive start (YYYY-MM-DD). Both `from` and `to` must be given, else the last 30 days are used. (optional)
    from: 2013-10-20,
    // Date | Inclusive end (YYYY-MM-DD). (optional)
    to: 2013-10-20,
    // 'day' | 'week' | 'month' | `week` buckets are labelled `YYYY-WW` (ISO week), `month` buckets `YYYY-MM`. (optional)
    groupBy: groupBy_example,
  } satisfies ApiV1PublisherFinanceEarningsGetRequest;

  try {
    const data = await api.apiV1PublisherFinanceEarningsGet(body);
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
| **from** | `Date` | Inclusive start (YYYY-MM-DD). Both &#x60;from&#x60; and &#x60;to&#x60; must be given, else the last 30 days are used. | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | Inclusive end (YYYY-MM-DD). | [Optional] [Defaults to `undefined`] |
| **groupBy** | `day`, `week`, `month` | &#x60;week&#x60; buckets are labelled &#x60;YYYY-WW&#x60; (ISO week), &#x60;month&#x60; buckets &#x60;YYYY-MM&#x60;. | [Optional] [Defaults to `&#39;day&#39;`] [Enum: day, week, month] |

### Return type

[**ApiV1PublisherFinanceEarningsGet200Response**](ApiV1PublisherFinanceEarningsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Earnings series. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceGet

> ApiV1PublisherFinanceGet200Response apiV1PublisherFinanceGet()

Publisher balance and payout rules.

The publisher\&#39;s current balance, the sum of open payout requests, the total already paid out, and the network\&#39;s payout rules — the header of the panel\&#39;s Billing page.  **Money units.** &#x60;balance.current&#x60;, &#x60;balance.pending&#x60; and &#x60;balance.total_earned&#x60; are **cents** of the network\&#39;s main currency. &#x60;payout_threshold&#x60; is **whole currency units** (50 &#x3D; 50.00). 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  try {
    const data = await api.apiV1PublisherFinanceGet();
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

[**ApiV1PublisherFinanceGet200Response**](ApiV1PublisherFinanceGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Balance overview. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceMonthEarningsGet

> Array&lt;ApiV1PublisherFinanceMonthEarningsGet200ResponseInner&gt; apiV1PublisherFinanceMonthEarningsGet()

Monthly earnings statements.

One row per month from the monthly earnings ledger (the panel\&#39;s Earnings tab), newest first. Not paginated.  **Money units.** &#x60;earned&#x60;, &#x60;pro_earned&#x60;, &#x60;ad_earned&#x60; and &#x60;total_earned&#x60; are **cents**. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceMonthEarningsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  try {
    const data = await api.apiV1PublisherFinanceMonthEarningsGet();
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

[**Array&lt;ApiV1PublisherFinanceMonthEarningsGet200ResponseInner&gt;**](ApiV1PublisherFinanceMonthEarningsGet200ResponseInner.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Monthly rows. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **500** | &#x60;query_failed&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinancePayoutRequestPost

> ApiV1PublisherFinancePayoutRequestPost201Response apiV1PublisherFinancePayoutRequestPost(apiV1PublisherFinancePayoutRequestPostRequest)

Request a payout of the balance.

Creates a payout request (paid out by staff, by the method in the payout settings) and deducts the amount from the balance at once.  **Money units.** The request &#x60;amount&#x60; is **whole currency units** (&#x60;12.50&#x60;); every amount in the response is **cents**.  Rules (same as the panel):  - &#x60;total_amount: true&#x60; requests the whole balance; otherwise &#x60;amount&#x60;   is required and is capped to the balance. - The balance must reach the network &#x60;payout_threshold&#x60;, and the   requested amount must reach the larger of that threshold and the   payout method\&#39;s &#x60;min_payout&#x60;. - Only one open request at a time. - A fee is deducted when the method has one configured for amounts   below its &#x60;fee_below&#x60;; &#x60;net_amount&#x60; is what is paid. - Payouts go to the payment details on file. If those are not yet   approved by staff (&#x60;isvalidbanking: 0&#x60; in the settings) the request   is still recorded, and staff validate the details before paying. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinancePayoutRequestPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // ApiV1PublisherFinancePayoutRequestPostRequest (optional)
    apiV1PublisherFinancePayoutRequestPostRequest: {"total_amount":true},
  } satisfies ApiV1PublisherFinancePayoutRequestPostOperationRequest;

  try {
    const data = await api.apiV1PublisherFinancePayoutRequestPost(body);
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
| **apiV1PublisherFinancePayoutRequestPostRequest** | [ApiV1PublisherFinancePayoutRequestPostRequest](ApiV1PublisherFinancePayoutRequestPostRequest.md) |  | [Optional] |

### Return type

[**ApiV1PublisherFinancePayoutRequestPost201Response**](ApiV1PublisherFinancePayoutRequestPost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Request created. |  -  |
| **400** | &#x60;insufficient_balance&#x60; (balance below the payout threshold), &#x60;below_minimum&#x60; (amount below the threshold / method minimum), &#x60;invalid_amount&#x60; (missing, ≤ 0 or not a valid number), &#x60;pending_request_exists&#x60; (an open request already exists).  |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **409** | &#x60;balance_changed&#x60; — the balance moved while the request ran; nothing was deducted. Retry. |  -  |
| **422** | &#x60;unknown_fields&#x60; — the body has keys other than amount, total_amount, description. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinancePayoutTypesGet

> Array&lt;ApiV1PublisherFinancePayoutTypesGet200ResponseInner&gt; apiV1PublisherFinancePayoutTypesGet()

Payout methods this account may choose.

The methods offered in the panel\&#39;s payout-method picker — active on the tenant, allowed by the account\&#39;s rights. The advertiser-budget method is not listed here (use &#x60;POST …/transfer-to-advertiser&#x60;). &#x60;id&#x60; is the value for &#x60;payouttype&#x60; in &#x60;PUT /api/v1/publisher/finance/settings&#x60;; any other id is refused there.  **Money units.** &#x60;min_payout&#x60; is **whole currency units**. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinancePayoutTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  try {
    const data = await api.apiV1PublisherFinancePayoutTypesGet();
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

[**Array&lt;ApiV1PublisherFinancePayoutTypesGet200ResponseInner&gt;**](ApiV1PublisherFinancePayoutTypesGet200ResponseInner.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Payout methods. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinancePayoutsGet

> ApiV1PublisherFinancePayoutsGet200Response apiV1PublisherFinancePayoutsGet(page, perPage, sortBy, sortDir, filterId, filterIspayed, filterTransacttype)

List payout requests and payouts.

Rows of &#x60;publisher_transactions&#x60; — every payout request (paid or not) and every transfer to the advertiser budget. Paginated.  **Money units.** &#x60;money&#x60; is **cents** in the network\&#39;s main currency; &#x60;paid_currency&#x60; is the currency the payout is made in.  &#x60;transacttype&#x60; is the payout method id (see &#x60;GET /api/v1/publisher/finance/payout-types&#x60;); &#x60;0&#x60; is a transfer to the advertiser budget. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinancePayoutsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // 'id' | 'dateadded' | 'money' | 'ispayed' | 'transacttype' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    filterId: 56,
    // 0 | 1 (optional)
    filterIspayed: 56,
    // number (optional)
    filterTransacttype: 56,
  } satisfies ApiV1PublisherFinancePayoutsGetRequest;

  try {
    const data = await api.apiV1PublisherFinancePayoutsGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `id`, `dateadded`, `money`, `ispayed`, `transacttype` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, dateadded, money, ispayed, transacttype] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterIspayed** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **filterTransacttype** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherFinancePayoutsGet200Response**](ApiV1PublisherFinancePayoutsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | One page of payouts. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceSettingsGet

> ApiV1PublisherFinanceSettingsGet200Response apiV1PublisherFinanceSettingsGet()

Payout method and payment details.

The account\&#39;s payout settings. When none were ever saved, the defaults are returned with &#x60;payouttype: -1&#x60;.  **Money units.** &#x60;minimum_payout&#x60; is **whole currency units**.  Read-only here: &#x60;isvalidbanking&#x60; (staff approval of the payment details — reset whenever the destination changes), &#x60;isvalidcompany&#x60;, &#x60;last_time_validated&#x60;, &#x60;allowweeklypayments&#x60; (whether &#x60;directpayout: 2&#x60; is permitted) and the invoice-address block (&#x60;inv_*&#x60;, &#x60;useaccountadress&#x60;), which is edited through the account settings, not here. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceSettingsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  try {
    const data = await api.apiV1PublisherFinanceSettingsGet();
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

[**ApiV1PublisherFinanceSettingsGet200Response**](ApiV1PublisherFinanceSettingsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Settings. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceSettingsPut

> ApiV1RetargetingPixelsIdDelete200Response apiV1PublisherFinanceSettingsPut(apiV1PublisherFinanceSettingsPutRequest)

Change the payout method or payment details.

Partial update: send only the fields to change. Needs its own scope, &#x60;payouts.method&#x60; — a key holding &#x60;payouts.write&#x60; (request a payout) cannot redirect where the money goes.  Same rules as the panel\&#39;s Billing → Payout settings save:  - &#x60;payouttype&#x60; must be one of &#x60;GET …/payout-types&#x60; (or ≤ 0). - &#x60;minimum_payout&#x60; (**whole currency units**) may not be below the   selected method\&#39;s &#x60;min_payout&#x60;. - &#x60;p_currency&#x60; must be &#x60;eur&#x60; or &#x60;usd&#x60;. - &#x60;directpayout: 2&#x60; (weekly) silently becomes &#x60;0&#x60; without the   &#x60;weekly_payout&#x60; right; values outside 0–2 become &#x60;0&#x60;. - IBAN / BIC are stored uppercased, IBAN without separators. Strings   longer than the column are truncated to its width. - **Changing a destination** (&#x60;bankaccountnumber&#x60;, &#x60;ibancode&#x60;,   &#x60;routingnumber&#x60;, &#x60;paypaladress&#x60;, &#x60;paxumadress&#x60;, &#x60;payoneeradress&#x60;,   &#x60;paymentdata&#x60;) **resets &#x60;isvalidbanking&#x60; to 0**: the new details   need staff approval again before payouts are made to them.  Neither the panel nor this endpoint asks for 2FA or an email confirmation. Read-only fields of the GET (&#x60;isvalidbanking&#x60;, &#x60;isvalidcompany&#x60;, &#x60;last_time_validated&#x60;, &#x60;allowweeklypayments&#x60;) and the invoice-address block (&#x60;inv_*&#x60;, &#x60;useaccountadress&#x60; — edited via the account settings) are not accepted: strip them before sending a GET body back, or the call answers 422 &#x60;unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceSettingsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // ApiV1PublisherFinanceSettingsPutRequest
    apiV1PublisherFinanceSettingsPutRequest: {"payouttype":1,"ibancode":"NL91 ABNA 0417 1643 00","biccode":"abnanl2a","bankaccountname":"Example Media BV","minimum_payout":100},
  } satisfies ApiV1PublisherFinanceSettingsPutOperationRequest;

  try {
    const data = await api.apiV1PublisherFinanceSettingsPut(body);
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
| **apiV1PublisherFinanceSettingsPutRequest** | [ApiV1PublisherFinanceSettingsPutRequest](ApiV1PublisherFinanceSettingsPutRequest.md) |  | |

### Return type

[**ApiV1RetargetingPixelsIdDelete200Response**](ApiV1RetargetingPixelsIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Saved. |  -  |
| **400** | &#x60;no_fields&#x60; — nothing writable in the body; &#x60;bad_request&#x60; — body is not valid JSON. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **413** | &#x60;payload_too_large&#x60; — body over 32 KB. |  -  |
| **422** | &#x60;validation_error&#x60; (&#x60;errors.payouttype&#x60; — method not offered to this account; &#x60;errors.minimum_payout&#x60; — below the method minimum or not a valid amount; &#x60;errors.p_currency&#x60;), or &#x60;unknown_fields&#x60; with the offending keys listed in &#x60;unknown_fields&#x60;.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceTransactionsGet

> ApiV1PublisherFinanceTransactionsGet200Response apiV1PublisherFinanceTransactionsGet(page, perPage, sortBy, sortDir, filterId, filterIspayed, filterTransacttype, filterDateadded)

List payout transactions (with USD totals).

Same rows as &#x60;GET /api/v1/publisher/finance/payouts&#x60; with the field names the panel\&#39;s Transactions tab uses (&#x60;ispaid&#x60;, &#x60;datepaid&#x60;) plus the USD conversion of paid rows.  **Money units.** &#x60;money&#x60; and &#x60;totalusd&#x60; are **cents**; &#x60;usdrate&#x60; is the conversion rate applied. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceTransactionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // 'id' | 'dateadded' | 'money' | 'transacttype' | 'ispayed' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    filterId: 56,
    // 0 | 1 (optional)
    filterIspayed: 56,
    // number (optional)
    filterTransacttype: 56,
    // Date (optional)
    filterDateadded: 2013-10-20,
  } satisfies ApiV1PublisherFinanceTransactionsGetRequest;

  try {
    const data = await api.apiV1PublisherFinanceTransactionsGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `id`, `dateadded`, `money`, `transacttype`, `ispayed` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, dateadded, money, transacttype, ispayed] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterIspayed** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **filterTransacttype** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterDateadded** | `Date` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherFinanceTransactionsGet200Response**](ApiV1PublisherFinanceTransactionsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | One page of transactions. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceTransactionsIdGet

> ApiV1PublisherFinanceTransactionsIdGet200Response apiV1PublisherFinanceTransactionsIdGet(id)

One payout transaction.

A single row of the caller\&#39;s &#x60;publisher_transactions&#x60;. **&#x60;money&#x60; is cents.** Another account\&#39;s id answers 404. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceTransactionsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherFinanceTransactionsIdGetRequest;

  try {
    const data = await api.apiV1PublisherFinanceTransactionsIdGet(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherFinanceTransactionsIdGet200Response**](ApiV1PublisherFinanceTransactionsIdGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The transaction. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Transaction not found (or the finance module is off — see ModuleDisabled). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceTransactionsIdInvoicePdfGet

> Blob apiV1PublisherFinanceTransactionsIdInvoicePdfGet(id)

Download the self-billing invoice PDF of a paid payout.

Returns &#x60;application/pdf&#x60; as an attachment named after the invoice number. Only **paid** payouts have an invoice; an unpaid or unknown id answers 404. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceTransactionsIdInvoicePdfGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherFinanceTransactionsIdInvoicePdfGetRequest;

  try {
    const data = await api.apiV1PublisherFinanceTransactionsIdInvoicePdfGet(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/pdf`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The PDF. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Transaction not found or not yet paid. |  -  |
| **500** | &#x60;pdf_error&#x60; — the PDF could not be generated. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFinanceTransferToAdvertiserPost

> ApiV1PublisherFinanceTransferToAdvertiserPost200Response apiV1PublisherFinanceTransferToAdvertiserPost(apiV1PublisherFinanceTransferToAdvertiserPostRequest)

Move publisher balance to the advertiser budget.

Moves money from the publisher balance to the same account\&#39;s advertiser budget, immediately (recorded as a paid transaction with &#x60;transacttype: 0&#x60;). Only for accounts that are also advertisers on a tenant offering the advertiser-budget method — see &#x60;can_transfer_to_advertiser&#x60; in &#x60;GET /api/v1/publisher/finance&#x60;.  **Money units.** Request &#x60;amount&#x60; and response &#x60;amount_transferred&#x60; are both **whole currency units**.  The amount must reach the network &#x60;payout_threshold&#x60;; a larger amount than the balance is capped to the balance. 

### Example

```ts
import {
  Configuration,
  PayoutsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFinanceTransferToAdvertiserPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PayoutsApi(config);

  const body = {
    // ApiV1PublisherFinanceTransferToAdvertiserPostRequest
    apiV1PublisherFinanceTransferToAdvertiserPostRequest: {"amount":75.0},
  } satisfies ApiV1PublisherFinanceTransferToAdvertiserPostOperationRequest;

  try {
    const data = await api.apiV1PublisherFinanceTransferToAdvertiserPost(body);
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
| **apiV1PublisherFinanceTransferToAdvertiserPostRequest** | [ApiV1PublisherFinanceTransferToAdvertiserPostRequest](ApiV1PublisherFinanceTransferToAdvertiserPostRequest.md) |  | |

### Return type

[**ApiV1PublisherFinanceTransferToAdvertiserPost200Response**](ApiV1PublisherFinanceTransferToAdvertiserPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transferred. |  -  |
| **400** | &#x60;invalid_amount&#x60;, &#x60;below_minimum&#x60; (below the payout threshold), &#x60;no_balance&#x60;, or &#x60;bad_request&#x60; (body not valid JSON). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Missing scope (see Forbidden), or &#x60;not_advertiser&#x60; — the account has no advertiser role. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **409** | &#x60;balance_changed&#x60; — the balance moved while the request ran; nothing was deducted. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

