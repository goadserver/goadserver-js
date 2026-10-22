# AccountBillingApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AccountBillingAffiliatedPaymentsGet**](AccountBillingApi.md#apiv1accountbillingaffiliatedpaymentsget) | **GET** /api/v1/account/billing/affiliated-payments | Payments made to affiliated accounts. |
| [**apiV1AccountBillingAveragesGet**](AccountBillingApi.md#apiv1accountbillingaveragesget) | **GET** /api/v1/account/billing/averages | Average costs and overcharges. |
| [**apiV1AccountBillingInvoicesGet**](AccountBillingApi.md#apiv1accountbillinginvoicesget) | **GET** /api/v1/account/billing/invoices | List invoices. |
| [**apiV1AccountBillingInvoicesIdPdfGet**](AccountBillingApi.md#apiv1accountbillinginvoicesidpdfget) | **GET** /api/v1/account/billing/invoices/{id}/pdf | Download an invoice PDF. |
| [**apiV1AccountBillingSettingsGet**](AccountBillingApi.md#apiv1accountbillingsettingsget) | **GET** /api/v1/account/billing/settings | The account\&#39;s billing plan. |



## apiV1AccountBillingAffiliatedPaymentsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountBillingAffiliatedPaymentsGet()

Payments made to affiliated accounts.

Payouts recorded against accounts affiliated with this one. 

### Example

```ts
import {
  Configuration,
  AccountBillingApi,
} from 'goadserver-sdk';
import type { ApiV1AccountBillingAffiliatedPaymentsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountBillingApi(config);

  try {
    const data = await api.apiV1AccountBillingAffiliatedPaymentsGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountBillingAveragesGet

> ApiV1AccountBillingAveragesGet200Response apiV1AccountBillingAveragesGet()

Average costs and overcharges.

This month\&#39;s usage projected to month end and priced with the account\&#39;s billing plan (the tenant default fills any rate the plan leaves out) — the same pricing the monthly invoice uses. Not wrapped in &#x60;data&#x60;. With no active plan every field is zero / empty.  &#x60;modules&#x60; lists the charges of the plan\&#39;s add-on modules (CRM, Agentic Media Buying), already included in &#x60;costs&#x60;. Media buying is a percentage of the managed network spend of your ad zones with Agentic Media Buying switched on, with a monthly minimum in a month that has managed spend. 

### Example

```ts
import {
  Configuration,
  AccountBillingApi,
} from 'goadserver-sdk';
import type { ApiV1AccountBillingAveragesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountBillingApi(config);

  try {
    const data = await api.apiV1AccountBillingAveragesGet();
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

[**ApiV1AccountBillingAveragesGet200Response**](ApiV1AccountBillingAveragesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountBillingInvoicesGet

> ApiV1AccountBillingInvoicesGet200Response apiV1AccountBillingInvoicesGet()

List invoices.

Every invoice raised against the account, paid or not, newest first, unpaginated, under &#x60;results&#x60; (not &#x60;data&#x60;). &#x60;money&#x60;, &#x60;bandwidth_costs&#x60; and &#x60;pro_adearned&#x60; are **cents** (unlike GET /api/v1/funds, which reports currency units). &#x60;paystatus_string&#x60; is Open / Processing / Paid / Prevalidated. A database error answers 200 with an empty list. 

### Example

```ts
import {
  Configuration,
  AccountBillingApi,
} from 'goadserver-sdk';
import type { ApiV1AccountBillingInvoicesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountBillingApi(config);

  try {
    const data = await api.apiV1AccountBillingInvoicesGet();
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

[**ApiV1AccountBillingInvoicesGet200Response**](ApiV1AccountBillingInvoicesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountBillingInvoicesIdPdfGet

> Blob apiV1AccountBillingInvoicesIdPdfGet(id)

Download an invoice PDF.

Returns &#x60;application/pdf&#x60;, not JSON. 404 for an invoice that is not the caller\&#39;s. 

### Example

```ts
import {
  Configuration,
  AccountBillingApi,
} from 'goadserver-sdk';
import type { ApiV1AccountBillingInvoicesIdPdfGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountBillingApi(config);

  const body = {
    // number | Invoice ID.
    id: 56,
  } satisfies ApiV1AccountBillingInvoicesIdPdfGetRequest;

  try {
    const data = await api.apiV1AccountBillingInvoicesIdPdfGet(body);
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
| **id** | `number` | Invoice ID. | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/pdf`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | PDF file |  -  |
| **404** | Invoice not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountBillingSettingsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountBillingSettingsGet()

The account\&#39;s billing plan.

The plan the account is on, its fixed costs and currency, and whether this membership may manage billing at all. 

### Example

```ts
import {
  Configuration,
  AccountBillingApi,
} from 'goadserver-sdk';
import type { ApiV1AccountBillingSettingsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountBillingApi(config);

  try {
    const data = await api.apiV1AccountBillingSettingsGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

