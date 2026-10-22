# AdShopApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdShopCartGet**](AdShopApi.md#apiv1adshopcartget) | **GET** /api/v1/ad-shop/cart | Read the draft cart. |
| [**apiV1AdShopCartPost**](AdShopApi.md#apiv1adshopcartpostoperation) | **POST** /api/v1/ad-shop/cart | Replace the draft cart. |
| [**apiV1AdShopConfirmPost**](AdShopApi.md#apiv1adshopconfirmpostoperation) | **POST** /api/v1/ad-shop/confirm | Check out the cart — creates the campaigns. |
| [**apiV1AdShopFilterOptionsGet**](AdShopApi.md#apiv1adshopfilteroptionsget) | **GET** /api/v1/ad-shop/filter-options | Filter values present in the current snapshot. |
| [**apiV1AdShopGroupSummaryPost**](AdShopApi.md#apiv1adshopgroupsummarypostoperation) | **POST** /api/v1/ad-shop/group-summary | Group the catalog by targeting dimensions. |
| [**apiV1AdShopOpportunitiesGet**](AdShopApi.md#apiv1adshopopportunitiesget) | **GET** /api/v1/ad-shop/opportunities | Browse Ad Shop opportunities. |
| [**apiV1AdShopPlanGet**](AdShopApi.md#apiv1adshopplanget) | **GET** /api/v1/ad-shop/plan | Preview how the cart becomes campaigns. |



## apiV1AdShopCartGet

> apiV1AdShopCartGet()

Read the draft cart.

The current draft cart of the person acting (one for the account owner, and a separate one for each team member, so nobody confirms items someone else picked). Same handler as the panel.

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopCartGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  try {
    const data = await api.apiV1AdShopCartGet();
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
| **200** | Cart (empty when none). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdShopCartPost

> apiV1AdShopCartPost(apiV1AdShopCartPostRequest)

Replace the draft cart.

Stores the full list of picked opportunity ids for a snapshot (replaces, not appends). Same handler as the panel.

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopCartPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  const body = {
    // ApiV1AdShopCartPostRequest
    apiV1AdShopCartPostRequest: {"snapshot_id":"20261012-0400","opportunity_ids":[77120,77121]},
  } satisfies ApiV1AdShopCartPostOperationRequest;

  try {
    const data = await api.apiV1AdShopCartPost(body);
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
| **apiV1AdShopCartPostRequest** | [ApiV1AdShopCartPostRequest](ApiV1AdShopCartPostRequest.md) |  | |

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
| **200** | Saved cart. |  -  |
| **400** | &#x60;bad_request&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdShopConfirmPost

> apiV1AdShopConfirmPost(apiV1AdShopConfirmPostRequest)

Check out the cart — creates the campaigns.

Creates the RON campaigns of the plan (live and able to spend once they have ads) and records an order. &#x60;idempotency_key&#x60; is required: a retry with the same key returns the first order (&#x60;reused: true&#x60;) instead of buying twice; keys are per account. Lines that need manual sourcing go to the network\&#39;s fulfilment queue and the admins are alerted. With a flat window, a zone already booked in it fails the whole order (422). Keys pinned to campaigns cannot confirm (403): the new campaigns would be outside the pin. A team member with read-only campaign access gets 403 &#x60;forbidden&#x60; (also on &#x60;POST /api/v1/ad-shop/cart&#x60;). The campaigns are recorded as created by, and managed by, whoever confirms, so a team member limited to their own campaigns can open them afterwards. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopConfirmPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  const body = {
    // ApiV1AdShopConfirmPostRequest
    apiV1AdShopConfirmPostRequest: {"idempotency_key":"9b2f1c3e-order-1"},
  } satisfies ApiV1AdShopConfirmPostOperationRequest;

  try {
    const data = await api.apiV1AdShopConfirmPost(body);
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
| **apiV1AdShopConfirmPostRequest** | [ApiV1AdShopConfirmPostRequest](ApiV1AdShopConfirmPostRequest.md) |  | |

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
| **200** | Order. |  -  |
| **400** | &#x60;bad_request&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **422** | &#x60;confirm_failed&#x60; — missing key, empty cart, inventory gone, or flat window already booked (message says which). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdShopFilterOptionsGet

> apiV1AdShopFilterOptionsGet()

Filter values present in the current snapshot.

Formats, pay types, countries, devices and categories that occur in the latest snapshot. Same handler as the panel.

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopFilterOptionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  try {
    const data = await api.apiV1AdShopFilterOptionsGet();
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
| **200** | Option lists (empty arrays when there is no snapshot). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdShopGroupSummaryPost

> apiV1AdShopGroupSummaryPost(apiV1AdShopGroupSummaryPostRequest)

Group the catalog by targeting dimensions.

Read-only (POST only because the filter set is large). Nests the filtered snapshot by up to 4 of &#x60;format&#x60;, &#x60;country&#x60;, &#x60;device&#x60;, &#x60;category&#x60;, &#x60;paytype&#x60;, with available views / clicks per group and, for &#x60;selected_ids&#x60;, the selected totals. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopGroupSummaryPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  const body = {
    // ApiV1AdShopGroupSummaryPostRequest
    apiV1AdShopGroupSummaryPostRequest: {"groups":["country","format"],"filters":{"payTypes":[1]},"selected_ids":[77120]},
  } satisfies ApiV1AdShopGroupSummaryPostOperationRequest;

  try {
    const data = await api.apiV1AdShopGroupSummaryPost(body);
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
| **apiV1AdShopGroupSummaryPostRequest** | [ApiV1AdShopGroupSummaryPostRequest](ApiV1AdShopGroupSummaryPostRequest.md) |  | |

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
| **200** | Group tree. |  -  |
| **400** | &#x60;bad_request&#x60; — body is not JSON. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **422** | &#x60;bad_group&#x60; — no or more than 4 dimensions, or an unknown one. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdShopOpportunitiesGet

> apiV1AdShopOpportunitiesGet(formats, payTypes, categories, devices, countries, search, sort, direction, page, perPage)

Browse Ad Shop opportunities.

Inventory lines from the tenant\&#39;s latest opportunity snapshot, shopped by targeting (format × country × device × category × pay type) — never by site or zone. &#x60;rate&#x60; is the advertiser rate in **currency units** (per click for CPC, per 1000 views for CPM); &#x60;flat_price&#x60; (currency units) applies to flat lines. &#x60;availability_status&#x60;: available, reserved, manual_confirmation, auction, unavailable, expired. Same handler as the panel. 404 when the tenant\&#39;s Ad Shop module is off. 

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopOpportunitiesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  const body = {
    // Array<number> | Ad zone type or ad type ids (GET …/filter-options → formats). (optional)
    formats: ...,
    // Array<number> | 0 CPC, 1 CPM, 5 flat. (optional)
    payTypes: ...,
    // Array<number> (optional)
    categories: ...,
    // Array<number> (optional)
    devices: ...,
    // Array<string> (optional)
    countries: ...,
    // string (optional)
    search: search_example,
    // 'status' | 'format' | 'country' | 'device' | 'views' | 'clicks' | 'rate' (optional)
    sort: sort_example,
    // 'asc' | 'desc' | 'hot' | `hot` with sort=status puts hot lines first. (optional)
    direction: direction_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1AdShopOpportunitiesGetRequest;

  try {
    const data = await api.apiV1AdShopOpportunitiesGet(body);
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
| **formats** | `Array<number>` | Ad zone type or ad type ids (GET …/filter-options → formats). | [Optional] |
| **payTypes** | `Array<number>` | 0 CPC, 1 CPM, 5 flat. | [Optional] |
| **categories** | `Array<number>` |  | [Optional] |
| **devices** | `Array<number>` |  | [Optional] |
| **countries** | `Array<string>` |  | [Optional] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sort** | `status`, `format`, `country`, `device`, `views`, `clicks`, `rate` |  | [Optional] [Defaults to `undefined`] [Enum: status, format, country, device, views, clicks, rate] |
| **direction** | `asc`, `desc`, `hot` | &#x60;hot&#x60; with sort&#x3D;status puts hot lines first. | [Optional] [Defaults to `undefined`] [Enum: asc, desc, hot] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |

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
| **200** | Lines of the current snapshot. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdShopPlanGet

> apiV1AdShopPlanGet(flatStart, flatEnd)

Preview how the cart becomes campaigns.

No writes. Splits the cart into the campaigns confirm would create (one per format × pay type …). &#x60;bid&#x60; and &#x60;flat_price&#x60; are in currency units. With a flat window (&#x60;flat_start&#x60; + &#x60;flat_end&#x60;) the lines are priced as flat bookings and &#x60;conflicts&#x60; lists zones already booked in that window. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  AdShopApi,
} from 'goadserver-sdk';
import type { ApiV1AdShopPlanGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdShopApi(config);

  const body = {
    // Date (optional)
    flatStart: 2013-10-20,
    // Date (optional)
    flatEnd: 2013-10-20,
  } satisfies ApiV1AdShopPlanGetRequest;

  try {
    const data = await api.apiV1AdShopPlanGet(body);
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
| **flatStart** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **flatEnd** | `Date` |  | [Optional] [Defaults to `undefined`] |

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
| **200** | Plan. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **422** | &#x60;plan_failed&#x60; (message says why, e.g. empty cart). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

