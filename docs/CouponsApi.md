# CouponsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CouponsSetsGet**](CouponsApi.md#apiv1couponssetsget) | **GET** /api/v1/coupons/sets | List coupon sets. |
| [**apiV1CouponsSetsIdDelete**](CouponsApi.md#apiv1couponssetsiddelete) | **DELETE** /api/v1/coupons/sets/{id} | Delete a set and all its codes. |
| [**apiV1CouponsSetsIdExportGet**](CouponsApi.md#apiv1couponssetsidexportget) | **GET** /api/v1/coupons/sets/{id}/export | Export a set\&#39;s codes as CSV. |
| [**apiV1CouponsSetsIdGeneratePost**](CouponsApi.md#apiv1couponssetsidgeneratepostoperation) | **POST** /api/v1/coupons/sets/{id}/generate | Generate codes in a set. |
| [**apiV1CouponsSetsIdPut**](CouponsApi.md#apiv1couponssetsidputoperation) | **PUT** /api/v1/coupons/sets/{id} | Rename a set or move its end date. |
| [**apiV1CouponsSetsPost**](CouponsApi.md#apiv1couponssetspostoperation) | **POST** /api/v1/coupons/sets | Create a coupon set. |
| [**apiV1CouponsSetsSetIdCouponsGet**](CouponsApi.md#apiv1couponssetssetidcouponsget) | **GET** /api/v1/coupons/sets/{setId}/coupons | List the codes in a set. |



## apiV1CouponsSetsGet

> apiV1CouponsSetsGet(page, perPage, search, sortBy)

List coupon sets.

Each set carries &#x60;coupon_count&#x60; (non-deleted codes). &#x60;search&#x60; matches the name.

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string (optional)
    search: search_example,
    // 'id' | 'name' | 'end_date' (optional)
    sortBy: sortBy_example,
  } satisfies ApiV1CouponsSetsGetRequest;

  try {
    const data = await api.apiV1CouponsSetsGet(body);
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
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `name`, `end_date` |  | [Optional] [Defaults to `undefined`] [Enum: id, name, end_date] |

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
| **200** | Sets. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CouponsSetsIdDelete

> apiV1CouponsSetsIdDelete(id)

Delete a set and all its codes.

Soft delete of the set and every code in it.

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CouponsSetsIdDeleteRequest;

  try {
    const data = await api.apiV1CouponsSetsIdDelete(body);
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
| **200** | Deleted. |  -  |
| **404** | Set not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CouponsSetsIdExportGet

> apiV1CouponsSetsIdExportGet(id)

Export a set\&#39;s codes as CSV.

&#x60;text/csv&#x60; attachment &#x60;coupons-&lt;id&gt;.csv&#x60;, no header row; one line per code: &#x60;code,amount,end_date&#x60;. 

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsIdExportGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CouponsSetsIdExportGetRequest;

  try {
    const data = await api.apiV1CouponsSetsIdExportGet(body);
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
- **Accept**: `text/csv`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | CSV. |  -  |
| **404** | Set not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CouponsSetsIdGeneratePost

> apiV1CouponsSetsIdGeneratePost(id, apiV1CouponsSetsIdGeneratePostRequest)

Generate codes in a set.

Adds &#x60;count&#x60; new random codes (capped at 10000 per call), each worth &#x60;amount&#x60;. &#x60;amount&#x60; is a whole number stored as given — the panel shows it raw, so use the unit your redemption flow expects. 

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsIdGeneratePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CouponsSetsIdGeneratePostRequest
    apiV1CouponsSetsIdGeneratePostRequest: {"count":100,"amount":10},
  } satisfies ApiV1CouponsSetsIdGeneratePostOperationRequest;

  try {
    const data = await api.apiV1CouponsSetsIdGeneratePost(body);
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
| **apiV1CouponsSetsIdGeneratePostRequest** | [ApiV1CouponsSetsIdGeneratePostRequest](ApiV1CouponsSetsIdGeneratePostRequest.md) |  | |

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
| **200** | Generated. |  -  |
| **404** | Set not found. |  -  |
| **422** | &#x60;INVALID_QUANTITY&#x60; (errors.quantity), &#x60;INVALID_AMOUNT&#x60;, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CouponsSetsIdPut

> apiV1CouponsSetsIdPut(id, apiV1CouponsSetsIdPutRequest)

Rename a set or move its end date.

Partial — send &#x60;name&#x60;, &#x60;end_date&#x60; or both (empty values are ignored).

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CouponsSetsIdPutRequest
    apiV1CouponsSetsIdPutRequest: {"end_date":"2027-01-31"},
  } satisfies ApiV1CouponsSetsIdPutOperationRequest;

  try {
    const data = await api.apiV1CouponsSetsIdPut(body);
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
| **apiV1CouponsSetsIdPutRequest** | [ApiV1CouponsSetsIdPutRequest](ApiV1CouponsSetsIdPutRequest.md) |  | |

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
| **400** | &#x60;no_fields&#x60;. |  -  |
| **404** | Set not found. |  -  |
| **422** | &#x60;INVALID_ENDDATE_GIVEN&#x60; or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CouponsSetsPost

> apiV1CouponsSetsPost(apiV1CouponsSetsPostRequest)

Create a coupon set.

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // ApiV1CouponsSetsPostRequest
    apiV1CouponsSetsPostRequest: {"name":"Autumn promo","end_date":"2026-12-31"},
  } satisfies ApiV1CouponsSetsPostOperationRequest;

  try {
    const data = await api.apiV1CouponsSetsPost(body);
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
| **apiV1CouponsSetsPostRequest** | [ApiV1CouponsSetsPostRequest](ApiV1CouponsSetsPostRequest.md) |  | |

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
| **201** | Created. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; (&#x60;NO_NAME_GIVEN&#x60;, &#x60;INVALID_ENDDATE_GIVEN&#x60;) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CouponsSetsSetIdCouponsGet

> apiV1CouponsSetsSetIdCouponsGet(setId, page, perPage, filterIsUsed)

List the codes in a set.

&#x60;filter_is_used&#x60; &#x3D; 0 / 1, &#x60;filter_code&#x60; / &#x60;search&#x60; match the code; &#x60;sort_by&#x60; &#x3D; id / code / amount / is_used / date_used. 

### Example

```ts
import {
  Configuration,
  CouponsApi,
} from 'goadserver-sdk';
import type { ApiV1CouponsSetsSetIdCouponsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CouponsApi(config);

  const body = {
    // number
    setId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // 0 | 1 (optional)
    filterIsUsed: 56,
  } satisfies ApiV1CouponsSetsSetIdCouponsGetRequest;

  try {
    const data = await api.apiV1CouponsSetsSetIdCouponsGet(body);
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
| **setId** | `number` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **filterIsUsed** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **200** | Codes. |  -  |
| **404** | Set not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

