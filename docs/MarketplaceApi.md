# MarketplaceApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1MarketplaceFiltersGet**](MarketplaceApi.md#apiv1marketplacefiltersget) | **GET** /api/v1/marketplace/filters | Filter vocabulary for the marketplace. |
| [**apiV1MarketplaceFlatRequestsGet**](MarketplaceApi.md#apiv1marketplaceflatrequestsget) | **GET** /api/v1/marketplace/flat-requests | List my flat-deal requests. |
| [**apiV1MarketplaceFlatRequestsIdCancelPost**](MarketplaceApi.md#apiv1marketplaceflatrequestsidcancelpost) | **POST** /api/v1/marketplace/flat-requests/{id}/cancel | Withdraw a pending flat-deal request. |
| [**apiV1MarketplaceFlatRequestsRenewPost**](MarketplaceApi.md#apiv1marketplaceflatrequestsrenewpostoperation) | **POST** /api/v1/marketplace/flat-requests/renew | Propose one more flat deal on a live flat campaign. |
| [**apiV1MarketplaceGet**](MarketplaceApi.md#apiv1marketplaceget) | **GET** /api/v1/marketplace | List marketplace sites. |
| [**apiV1MarketplaceIdGet**](MarketplaceApi.md#apiv1marketplaceidget) | **GET** /api/v1/marketplace/{id} | Ad zones of one marketplace site, with starting prices. |



## apiV1MarketplaceFiltersGet

> apiV1MarketplaceFiltersGet()

Filter vocabulary for the marketplace.

Ad types, ad zone types, countries, banner sizes, device types, operating systems, browsers and main categories the marketplace filters accept, plus &#x60;flat_request_min_total&#x60; (the tenant minimum for a flat-deal amount, in currency units). Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  MarketplaceApi,
} from 'goadserver-sdk';
import type { ApiV1MarketplaceFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketplaceApi(config);

  try {
    const data = await api.apiV1MarketplaceFiltersGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Option lists. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1MarketplaceFlatRequestsGet

> apiV1MarketplaceFlatRequestsGet()

List my flat-deal requests.

The account\&#39;s flat-deal requests, newest first (max 200). A request is created by booking a flat deal in the panel\&#39;s campaign wizard from a marketplace zone — that create path (&#x60;flat_request: 1&#x60;) is not exposed on &#x60;POST /api/v1/campaigns&#x60; yet. &#x60;accepted_campaignid&#x60; is the flat campaign the request created (set from the start, not only after acceptance). &#x60;status&#x60;: pending, accepted, rejected, cancelled. Account-wide: refused (403) for campaign-pinned keys. 

### Example

```ts
import {
  Configuration,
  MarketplaceApi,
} from 'goadserver-sdk';
import type { ApiV1MarketplaceFlatRequestsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketplaceApi(config);

  try {
    const data = await api.apiV1MarketplaceFlatRequestsGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Requests. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1MarketplaceFlatRequestsIdCancelPost

> apiV1MarketplaceFlatRequestsIdCancelPost(id)

Withdraw a pending flat-deal request.

Only a &#x60;pending&#x60; request of your own. Also soft-deletes the (never-served) flat campaign the request created, and tells the network admins the request is withdrawn. Pinned keys / own-scoped members are checked against that campaign. Same handler as the panel. No body. 

### Example

```ts
import {
  Configuration,
  MarketplaceApi,
} from 'goadserver-sdk';
import type { ApiV1MarketplaceFlatRequestsIdCancelPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketplaceApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1MarketplaceFlatRequestsIdCancelPostRequest;

  try {
    const data = await api.apiV1MarketplaceFlatRequestsIdCancelPost(body);
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Cancelled. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found, not yours, or no longer pending (&#x60;{error: ...}&#x60;). |  -  |
| **422** | Invalid id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1MarketplaceFlatRequestsRenewPost

> apiV1MarketplaceFlatRequestsRenewPost(apiV1MarketplaceFlatRequestsRenewPostRequest)

Propose one more flat deal on a live flat campaign.

Appends a deal (new date window + price) to a flat campaign (&#x60;paytype&#x60; 5) that already has an accepted deal, and files it in the admin\&#39;s Accept / Reject queue (&#x60;deal_state&#x60; 0 &#x3D; pending). Only one renewal may be pending at a time and the window must start after the last deal\&#39;s end and not in the past. &#x60;total_costs&#x60; is the deal amount in **currency units** and must be ≥ the tenant\&#39;s &#x60;flat_request_min_total&#x60; (GET /api/v1/marketplace/filters). Same handler as the panel; campaign pin and member own-scope apply. 

### Example

```ts
import {
  Configuration,
  MarketplaceApi,
} from 'goadserver-sdk';
import type { ApiV1MarketplaceFlatRequestsRenewPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketplaceApi(config);

  const body = {
    // ApiV1MarketplaceFlatRequestsRenewPostRequest
    apiV1MarketplaceFlatRequestsRenewPostRequest: {"campaign_id":90412,"date_start":"2026-11-01","date_end":"2026-11-30","total_costs":1500},
  } satisfies ApiV1MarketplaceFlatRequestsRenewPostOperationRequest;

  try {
    const data = await api.apiV1MarketplaceFlatRequestsRenewPost(body);
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
| **apiV1MarketplaceFlatRequestsRenewPostRequest** | [ApiV1MarketplaceFlatRequestsRenewPostRequest](ApiV1MarketplaceFlatRequestsRenewPostRequest.md) |  | |

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
| **200** | Filed. |  -  |
| **403** | Not a flat campaign, or key / member not permitted. |  -  |
| **404** | Campaign not found. |  -  |
| **409** | &#x60;renewal_pending&#x60;, &#x60;campaign_not_live&#x60; (no accepted deal yet) or &#x60;no_flat_block&#x60;. |  -  |
| **422** | Invalid campaign / dates (past start, end before start, overlaps the last deal) or &#x60;total_costs&#x60; below the minimum. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1MarketplaceGet

> apiV1MarketplaceGet(adtype, format, adzoneType, mainCategory, countries, deviceType, search, includeAdShop, perPage)

List marketplace sites.

Publisher sites the network admin put in the marketplace (&#x60;marketplace_websites&#x60;), each with its matching zone count and last-period views / clicks. Offer zones (ad type 21) never appear. Same handler as the panel. All matching sites are returned in one page (&#x60;last_page&#x60; is always 1). 

### Example

```ts
import {
  Configuration,
  MarketplaceApi,
} from 'goadserver-sdk';
import type { ApiV1MarketplaceGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketplaceApi(config);

  const body = {
    // number | Ad type id (GET /api/v1/marketplace/filters → ad_types). (optional)
    adtype: 56,
    // number | Banner size id; only with adtype=2. (optional)
    format: 56,
    // number | Ad zone type id; implies its ad type when adtype is not sent. (optional)
    adzoneType: 56,
    // number (optional)
    mainCategory: 56,
    // Array<string> | ISO-2 codes; narrows the traffic stats. (optional)
    countries: ...,
    // number (optional)
    deviceType: 56,
    // string | Site name / URL substring. (optional)
    search: search_example,
    // '1' | Also list sites the Ad Shop generator found eligible traffic on. (optional)
    includeAdShop: includeAdShop_example,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1MarketplaceGetRequest;

  try {
    const data = await api.apiV1MarketplaceGet(body);
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
| **adtype** | `number` | Ad type id (GET /api/v1/marketplace/filters → ad_types). | [Optional] [Defaults to `undefined`] |
| **format** | `number` | Banner size id; only with adtype&#x3D;2. | [Optional] [Defaults to `undefined`] |
| **adzoneType** | `number` | Ad zone type id; implies its ad type when adtype is not sent. | [Optional] [Defaults to `undefined`] |
| **mainCategory** | `number` |  | [Optional] [Defaults to `undefined`] |
| **countries** | `Array<string>` | ISO-2 codes; narrows the traffic stats. | [Optional] |
| **deviceType** | `number` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` | Site name / URL substring. | [Optional] [Defaults to `undefined`] |
| **includeAdShop** | `1` | Also list sites the Ad Shop generator found eligible traffic on. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **perPage** | `number` |  | [Optional] [Defaults to `40`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sites. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1MarketplaceIdGet

> apiV1MarketplaceIdGet(id, adtype, format, adzoneType, countries, deviceType, os, browser, includeAdShop)

Ad zones of one marketplace site, with starting prices.

The zones the admin exposed on the site, filtered by ad type / format, each with its traffic (&#x60;stats&#x60;: clicks for click ad types, views otherwise — see &#x60;stat_type&#x60;) and a starting price &#x60;min_price&#x60;. &#x60;min_price&#x60; is in **cents** (the panel shows &#x60;min_price / 100&#x60; in the account currency); for CPM zones it is per 1000 views. It comes from recent market rates, else the zone\&#39;s own per-country floor (when &#x60;countries[]&#x60; matches), else the network floor, else a built-in default. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  MarketplaceApi,
} from 'goadserver-sdk';
import type { ApiV1MarketplaceIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketplaceApi(config);

  const body = {
    // number | Site id from GET /api/v1/marketplace.
    id: 56,
    // number (optional)
    adtype: 56,
    // number (optional)
    format: 56,
    // number (optional)
    adzoneType: 56,
    // Array<string> (optional)
    countries: ...,
    // number (optional)
    deviceType: 56,
    // Array<number> (optional)
    os: ...,
    // Array<number> (optional)
    browser: ...,
    // '1' (optional)
    includeAdShop: includeAdShop_example,
  } satisfies ApiV1MarketplaceIdGetRequest;

  try {
    const data = await api.apiV1MarketplaceIdGet(body);
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
| **id** | `number` | Site id from GET /api/v1/marketplace. | [Defaults to `undefined`] |
| **adtype** | `number` |  | [Optional] [Defaults to `undefined`] |
| **format** | `number` |  | [Optional] [Defaults to `undefined`] |
| **adzoneType** | `number` |  | [Optional] [Defaults to `undefined`] |
| **countries** | `Array<string>` |  | [Optional] |
| **deviceType** | `number` |  | [Optional] [Defaults to `undefined`] |
| **os** | `Array<number>` |  | [Optional] |
| **browser** | `Array<number>` |  | [Optional] |
| **includeAdShop** | `1` |  | [Optional] [Defaults to `undefined`] [Enum: 1] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Zones. |  -  |
| **400** | &#x60;invalid_id&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Site not in the marketplace. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

