# CreativePoolsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CreativePoolsGet**](CreativePoolsApi.md#apiv1creativepoolsget) | **GET** /api/v1/creative-pools | List creative pools. |
| [**apiV1CreativePoolsIdClonePost**](CreativePoolsApi.md#apiv1creativepoolsidclonepost) | **POST** /api/v1/creative-pools/{id}/clone | Clone a creative pool with all its items. |
| [**apiV1CreativePoolsIdDelete**](CreativePoolsApi.md#apiv1creativepoolsiddelete) | **DELETE** /api/v1/creative-pools/{id} | Soft-delete a creative pool. |
| [**apiV1CreativePoolsIdGet**](CreativePoolsApi.md#apiv1creativepoolsidget) | **GET** /api/v1/creative-pools/{id} | Show a single creative pool. |
| [**apiV1CreativePoolsIdItemsGet**](CreativePoolsApi.md#apiv1creativepoolsiditemsget) | **GET** /api/v1/creative-pools/{id}/items | List items in a creative pool. |
| [**apiV1CreativePoolsIdItemsItemIdDelete**](CreativePoolsApi.md#apiv1creativepoolsiditemsitemiddelete) | **DELETE** /api/v1/creative-pools/{id}/items/{itemId} | Soft-delete a single pool item. |
| [**apiV1CreativePoolsIdItemsItemIdPut**](CreativePoolsApi.md#apiv1creativepoolsiditemsitemidputoperation) | **PUT** /api/v1/creative-pools/{id}/items/{itemId} | Update a single pool item. |
| [**apiV1CreativePoolsIdItemsItemIdTogglePut**](CreativePoolsApi.md#apiv1creativepoolsiditemsitemidtoggleput) | **PUT** /api/v1/creative-pools/{id}/items/{itemId}/toggle | Toggle a pool item on / off. |
| [**apiV1CreativePoolsIdPut**](CreativePoolsApi.md#apiv1creativepoolsidputoperation) | **PUT** /api/v1/creative-pools/{id} | Update creative pool meta. |
| [**apiV1CreativePoolsIdUsedInGet**](CreativePoolsApi.md#apiv1creativepoolsidusedinget) | **GET** /api/v1/creative-pools/{id}/used-in | List campaigns / ads that reference this pool. |
| [**apiV1CreativePoolsPost**](CreativePoolsApi.md#apiv1creativepoolspostoperation) | **POST** /api/v1/creative-pools | Create a creative pool. |



## apiV1CreativePoolsGet

> ApiV1CreativePoolsGet200Response apiV1CreativePoolsGet(type, title, page, perPage, sort)

List creative pools.

Returns every creative pool owned by the caller. Each row carries &#x60;items_count&#x60; (live items, &#x60;is_deleted&#x3D;0&#x60;) and &#x60;total_sizes&#x60; (count of distinct banner sizes). Tags are returned both as the raw CSV string (&#x60;tags&#x60;) and as an array (&#x60;tagids&#x60;).  Supports &#x60;name&#x60;/&#x60;title&#x60;/&#x60;type&#x60;/&#x60;id&#x60; filter params plus the standard &#x60;page&#x60;, &#x60;per_page&#x60;, &#x60;sort&#x60;, &#x60;direction&#x60;, &#x60;q&#x60; search. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // 'banner' | 'video' | 'reel' | 'native' | 'image' (optional)
    type: type_example,
    // string (optional)
    title: title_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // 'id' | 'title' | 'type' | 'sort_type' (optional)
    sort: sort_example,
  } satisfies ApiV1CreativePoolsGetRequest;

  try {
    const data = await api.apiV1CreativePoolsGet(body);
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
| **type** | `banner`, `video`, `reel`, `native`, `image` |  | [Optional] [Defaults to `undefined`] [Enum: banner, video, reel, native, image] |
| **title** | `string` |  | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |
| **sort** | `id`, `title`, `type`, `sort_type` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, title, type, sort_type] |

### Return type

[**ApiV1CreativePoolsGet200Response**](ApiV1CreativePoolsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pools. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdClonePost

> ApiV1CreativePoolsIdClonePost201Response apiV1CreativePoolsIdClonePost(id)

Clone a creative pool with all its items.

Duplicates the pool row and every live item (&#x60;is_deleted&#x3D;0&#x60;). Cloned items share the same underlying &#x60;creative_id&#x60;, so the binary creative file is not re-uploaded — both pools reference the same row in the &#x60;creatives&#x60; table. The new pool\&#39;s title is suffixed with \&quot; (Copy)\&quot;. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdClonePostRequest;

  try {
    const data = await api.apiV1CreativePoolsIdClonePost(body);
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

[**ApiV1CreativePoolsIdClonePost201Response**](ApiV1CreativePoolsIdClonePost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Pool cloned. |  -  |
| **404** | Source pool not found. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdDelete

> ApiV1CreativePoolsIdDelete200Response apiV1CreativePoolsIdDelete(id)

Soft-delete a creative pool.

Deletes the pool **and** every item that is not currently used by an ad. If any items are still referenced by live ads the call returns 409 with the per-item count and the pool itself is left intact — unhook the ads first, then retry. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdDeleteRequest;

  try {
    const data = await api.apiV1CreativePoolsIdDelete(body);
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

[**ApiV1CreativePoolsIdDelete200Response**](ApiV1CreativePoolsIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pool deleted. |  -  |
| **409** | Some items are still in use; pool not deleted. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdGet

> ApiV1CreativePoolsIdGet200Response apiV1CreativePoolsIdGet(id)

Show a single creative pool.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdGet(body);
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

[**ApiV1CreativePoolsIdGet200Response**](ApiV1CreativePoolsIdGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pool detail. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsGet

> ApiV1CampaignsTypeCampaignIdAdsGet200Response apiV1CreativePoolsIdItemsGet(id, page, perPage)

List items in a creative pool.

Returns every banner / video / native item in the pool with size, creative metadata and lifetime stats (views, clicks, ctr, conv). 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1CreativePoolsIdItemsGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsGet200Response**](ApiV1CampaignsTypeCampaignIdAdsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Items. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsItemIdDelete

> apiV1CreativePoolsIdItemsItemIdDelete(id, itemId)

Soft-delete a single pool item.

Refuses if the item is still referenced by a live ad — unhook the ad first. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsItemIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
  } satisfies ApiV1CreativePoolsIdItemsItemIdDeleteRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsItemIdDelete(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Deleted. |  -  |
| **409** | Item still used in a live ad. |  -  |
| **404** | Item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsItemIdPut

> apiV1CreativePoolsIdItemsItemIdPut(id, itemId, apiV1CreativePoolsIdItemsItemIdPutRequest)

Update a single pool item.

Editable fields: &#x60;title&#x60;, &#x60;lang&#x60;, &#x60;properties&#x60;, &#x60;ratingid&#x60;, &#x60;url_prefix&#x60;. Active state is toggled via the &#x60;/toggle&#x60; endpoint below. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsItemIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
    // ApiV1CreativePoolsIdItemsItemIdPutRequest
    apiV1CreativePoolsIdItemsItemIdPutRequest: ...,
  } satisfies ApiV1CreativePoolsIdItemsItemIdPutOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsItemIdPut(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CreativePoolsIdItemsItemIdPutRequest** | [ApiV1CreativePoolsIdItemsItemIdPutRequest](ApiV1CreativePoolsIdItemsItemIdPutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **404** | Item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsItemIdTogglePut

> apiV1CreativePoolsIdItemsItemIdTogglePut(id, itemId)

Toggle a pool item on / off.

Flips &#x60;isactive&#x60; between 0 and 1. Inactive items are skipped by the ad-server when picking a creative from the pool. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsItemIdTogglePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
  } satisfies ApiV1CreativePoolsIdItemsItemIdTogglePutRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsItemIdTogglePut(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Toggled. |  -  |
| **404** | Item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdPut

> apiV1CreativePoolsIdPut(id, apiV1CreativePoolsIdPutRequest)

Update creative pool meta.

Updates &#x60;title&#x60;, &#x60;sort_type&#x60;, &#x60;conv_type&#x60;, &#x60;tags&#x60;, or &#x60;type&#x60;.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdPutRequest
    apiV1CreativePoolsIdPutRequest: ...,
  } satisfies ApiV1CreativePoolsIdPutOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdPut(body);
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
| **apiV1CreativePoolsIdPutRequest** | [ApiV1CreativePoolsIdPutRequest](ApiV1CreativePoolsIdPutRequest.md) |  | |

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
| **200** | Updated. |  -  |
| **404** | Pool not found. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdUsedInGet

> ApiV1CreativePoolsIdUsedInGet200Response apiV1CreativePoolsIdUsedInGet(id)

List campaigns / ads that reference this pool.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdUsedInGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdUsedInGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdUsedInGet(body);
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

[**ApiV1CreativePoolsIdUsedInGet200Response**](ApiV1CreativePoolsIdUsedInGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | References. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsPost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1CreativePoolsPost(apiV1CreativePoolsPostRequest)

Create a creative pool.

Creates an empty pool. Add items via the panel uploader (not yet exposed via API) or import-by-id endpoints once available. Title collisions are auto-suffixed with &#x60;_&lt;unix&gt;&#x60;. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // ApiV1CreativePoolsPostRequest
    apiV1CreativePoolsPostRequest: ...,
  } satisfies ApiV1CreativePoolsPostOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsPost(body);
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
| **apiV1CreativePoolsPostRequest** | [ApiV1CreativePoolsPostRequest](ApiV1CreativePoolsPostRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)

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
| **422** | Validation error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

