# FiltersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1FiltersGet**](FiltersApi.md#apiv1filtersget) | **GET** /api/v1/filters | List all filters across types. |
| [**apiV1FiltersPost**](FiltersApi.md#apiv1filterspostoperation) | **POST** /api/v1/filters | Create a filter and populate it with items. |
| [**apiV1FiltersTypeIdActivePatch**](FiltersApi.md#apiv1filterstypeidactivepatch) | **PATCH** /api/v1/filters/{type}/{id}/active | Activate or deactivate a filter (exclusion types only). |
| [**apiV1FiltersTypeIdDelete**](FiltersApi.md#apiv1filterstypeiddelete) | **DELETE** /api/v1/filters/{type}/{id} | Delete a filter (and its items, for IP pools). |
| [**apiV1FiltersTypeIdGet**](FiltersApi.md#apiv1filterstypeidget) | **GET** /api/v1/filters/{type}/{id} | Get a single filter with its items. |
| [**apiV1FiltersTypeIdItemsItemDelete**](FiltersApi.md#apiv1filterstypeiditemsitemdelete) | **DELETE** /api/v1/filters/{type}/{id}/items/{item} | Remove a single item from a filter. |
| [**apiV1FiltersTypeIdItemsPost**](FiltersApi.md#apiv1filterstypeiditemspostoperation) | **POST** /api/v1/filters/{type}/{id}/items | Add items to an existing filter. |



## apiV1FiltersGet

> ApiV1FiltersGet200Response apiV1FiltersGet(type)

List all filters across types.

Each filter has a **type** and may apply globally or to specific campaigns. Types:  | type          | meaning                          | toggleable | |---------------|----------------------------------|:----------:| | &#x60;domain_excl&#x60; | Block these domains              | yes | | &#x60;domain_incl&#x60; | Only allow these domains         | no | | &#x60;adzone_excl&#x60; | Block these ad zones             | yes | | &#x60;adzone_incl&#x60; | Only allow these ad zones        | no | | &#x60;isp_excl&#x60;    | Block these ISPs                 | yes | | &#x60;subid_excl&#x60;  | Block these SubIDs               | yes | | &#x60;subid_incl&#x60;  | Only allow these SubIDs          | no | | &#x60;ip&#x60;          | IP-pool blocking                 | no | 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // 'domain_excl' | 'domain_incl' | 'adzone_excl' | 'adzone_incl' | 'isp_excl' | 'subid_excl' | 'subid_incl' | 'ip' | Filter to one type. (optional)
    type: type_example,
  } satisfies ApiV1FiltersGetRequest;

  try {
    const data = await api.apiV1FiltersGet(body);
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
| **type** | `domain_excl`, `domain_incl`, `adzone_excl`, `adzone_incl`, `isp_excl`, `subid_excl`, `subid_incl`, `ip` | Filter to one type. | [Optional] [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, ip] |

### Return type

[**ApiV1FiltersGet200Response**](ApiV1FiltersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Filter list across types |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersPost

> FilterDetail apiV1FiltersPost(apiV1FiltersPostRequest)

Create a filter and populate it with items.

For &#x60;domain_excl&#x60; / &#x60;domain_incl&#x60;: items can be domain URLs (&#x60;\&quot;https://evil.com/x\&quot;&#x60;) — automatically resolved to internal domain IDs — or numeric domain IDs as strings. For &#x60;adzone_excl&#x60; / &#x60;adzone_incl&#x60; / &#x60;isp_excl&#x60;: items must be numeric IDs. For &#x60;subid_excl&#x60; / &#x60;subid_incl&#x60;: items are raw SubID strings. IP pool creation is not yet exposed via the public API. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // ApiV1FiltersPostRequest
    apiV1FiltersPostRequest: ...,
  } satisfies ApiV1FiltersPostOperationRequest;

  try {
    const data = await api.apiV1FiltersPost(body);
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
| **apiV1FiltersPostRequest** | [ApiV1FiltersPostRequest](ApiV1FiltersPostRequest.md) |  | |

### Return type

[**FilterDetail**](FilterDetail.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Filter created |  -  |
| **422** | Validation error / duplicate name |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdActivePatch

> ApiV1FiltersTypeIdActivePatch200Response apiV1FiltersTypeIdActivePatch(type, id, apiV1CampaignsTypeIdActivePatchRequest)

Activate or deactivate a filter (exclusion types only).

Only &#x60;*_excl&#x60; filters have an active/inactive state. Inclusion filters and IP pools always apply when a campaign references them — disable by removing the reference instead. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdActivePatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // string
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1FiltersTypeIdActivePatchRequest;

  try {
    const data = await api.apiV1FiltersTypeIdActivePatch(body);
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
| **type** | `string` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1FiltersTypeIdActivePatch200Response**](ApiV1FiltersTypeIdActivePatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New state |  -  |
| **422** | Filter type not toggleable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdDelete

> apiV1FiltersTypeIdDelete(type, id)

Delete a filter (and its items, for IP pools).

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // string
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1FiltersTypeIdDeleteRequest;

  try {
    const data = await api.apiV1FiltersTypeIdDelete(body);
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
| **type** | `string` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdGet

> FilterDetail apiV1FiltersTypeIdGet(type, id)

Get a single filter with its items.

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // string
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1FiltersTypeIdGetRequest;

  try {
    const data = await api.apiV1FiltersTypeIdGet(body);
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
| **type** | `string` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**FilterDetail**](FilterDetail.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Filter details |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdItemsItemDelete

> ApiV1FiltersTypeIdItemsItemDelete200Response apiV1FiltersTypeIdItemsItemDelete(type, id, item)

Remove a single item from a filter.

&#x60;{item}&#x60; is the stored value — domain ID, adzone ID, ISP ID, or SubID string. URL-encode special characters.

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdItemsItemDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // string
    type: type_example,
    // number
    id: 56,
    // string
    item: item_example,
  } satisfies ApiV1FiltersTypeIdItemsItemDeleteRequest;

  try {
    const data = await api.apiV1FiltersTypeIdItemsItemDelete(body);
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
| **type** | `string` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **item** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1FiltersTypeIdItemsItemDelete200Response**](ApiV1FiltersTypeIdItemsItemDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Removed |  -  |
| **404** | Item not present in this filter |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdItemsPost

> ApiV1FiltersTypeIdItemsPost200Response apiV1FiltersTypeIdItemsPost(type, id, apiV1FiltersTypeIdItemsPostRequest)

Add items to an existing filter.

Same input format as creating a filter — domain URLs are auto-resolved to IDs for domain filters, numeric IDs required for adzone/ISP filters, raw strings for SubID filters. Already-present items are deduplicated silently. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdItemsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // string
    type: type_example,
    // number
    id: 56,
    // ApiV1FiltersTypeIdItemsPostRequest
    apiV1FiltersTypeIdItemsPostRequest: ...,
  } satisfies ApiV1FiltersTypeIdItemsPostOperationRequest;

  try {
    const data = await api.apiV1FiltersTypeIdItemsPost(body);
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
| **type** | `string` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1FiltersTypeIdItemsPostRequest** | [ApiV1FiltersTypeIdItemsPostRequest](ApiV1FiltersTypeIdItemsPostRequest.md) |  | |

### Return type

[**ApiV1FiltersTypeIdItemsPost200Response**](ApiV1FiltersTypeIdItemsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New item set |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

