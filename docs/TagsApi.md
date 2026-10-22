# TagsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TagsGet**](TagsApi.md#apiv1tagsget) | **GET** /api/v1/tags | List tags. |
| [**apiV1TagsIdDelete**](TagsApi.md#apiv1tagsiddelete) | **DELETE** /api/v1/tags/{id} | Delete a tag. |
| [**apiV1TagsIdGet**](TagsApi.md#apiv1tagsidget) | **GET** /api/v1/tags/{id} | Show a tag. |
| [**apiV1TagsIdPut**](TagsApi.md#apiv1tagsidputoperation) | **PUT** /api/v1/tags/{id} | Rename or move a tag. |
| [**apiV1TagsMassDeletePost**](TagsApi.md#apiv1tagsmassdeletepostoperation) | **POST** /api/v1/tags/mass-delete | Delete several tags. |
| [**apiV1TagsPost**](TagsApi.md#apiv1tagspostoperation) | **POST** /api/v1/tags | Create a tag. |



## apiV1TagsGet

> apiV1TagsGet(page, perPage, search)

List tags.

The account\&#39;s tags with their parent (&#x60;pid&#x60;, 0 &#x3D; top level) and depth (&#x60;level&#x60;). &#x60;search&#x60; / &#x60;filter_name&#x60; match the name. Assign a tag to campaigns with &#x60;groupid&#x60; on PATCH /api/v1/campaigns/{type}/{id} or the bulk PUT /api/v1/campaigns/save-tags. 

### Example

```ts
import {
  Configuration,
  TagsApi,
} from 'goadserver-sdk';
import type { ApiV1TagsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TagsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // string | Max 100, or `all`. (optional)
    perPage: perPage_example,
    // string (optional)
    search: search_example,
  } satisfies ApiV1TagsGetRequest;

  try {
    const data = await api.apiV1TagsGet(body);
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
| **perPage** | `string` | Max 100, or &#x60;all&#x60;. | [Optional] [Defaults to `&#39;20&#39;`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |

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
| **200** | Tags. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TagsIdDelete

> apiV1TagsIdDelete(id)

Delete a tag.

Same clean-up as mass-delete. Refused for a campaign-pinned key.

### Example

```ts
import {
  Configuration,
  TagsApi,
} from 'goadserver-sdk';
import type { ApiV1TagsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TagsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TagsIdDeleteRequest;

  try {
    const data = await api.apiV1TagsIdDelete(body);
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
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Tag not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TagsIdGet

> apiV1TagsIdGet(id)

Show a tag.

### Example

```ts
import {
  Configuration,
  TagsApi,
} from 'goadserver-sdk';
import type { ApiV1TagsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TagsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TagsIdGetRequest;

  try {
    const data = await api.apiV1TagsIdGet(body);
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
| **200** | The tag. |  -  |
| **404** | Tag not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TagsIdPut

> apiV1TagsIdPut(id, apiV1TagsIdPutRequest)

Rename or move a tag.

&#x60;name&#x60; is required. Omit &#x60;pid&#x60; to keep the tag where it is; send it to move the tag (and its sub-tree) under another parent, 0 &#x3D; top level. A move that makes a cycle or exceeds three levels → 422. 

### Example

```ts
import {
  Configuration,
  TagsApi,
} from 'goadserver-sdk';
import type { ApiV1TagsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TagsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1TagsIdPutRequest
    apiV1TagsIdPutRequest: {"name":"Push campaigns","pid":0},
  } satisfies ApiV1TagsIdPutOperationRequest;

  try {
    const data = await api.apiV1TagsIdPut(body);
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
| **apiV1TagsIdPutRequest** | [ApiV1TagsIdPutRequest](ApiV1TagsIdPutRequest.md) |  | |

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
| **200** | Saved (&#x60;data&#x60; only when &#x60;pid&#x60; was sent). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Tag not found. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TagsMassDeletePost

> apiV1TagsMassDeletePost(apiV1TagsMassDeletePostRequest)

Delete several tags.

Removes the tags and strips their ids from every campaign / adzone that carried them (&#x60;refs_cleaned_up&#x60; counts the rewritten rows); sub-tags move up. Refused for a campaign-pinned key (it rewrites campaigns outside the pin). 

### Example

```ts
import {
  Configuration,
  TagsApi,
} from 'goadserver-sdk';
import type { ApiV1TagsMassDeletePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TagsApi(config);

  const body = {
    // ApiV1TagsMassDeletePostRequest
    apiV1TagsMassDeletePostRequest: {"ids":[6,7]},
  } satisfies ApiV1TagsMassDeletePostOperationRequest;

  try {
    const data = await api.apiV1TagsMassDeletePost(body);
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
| **apiV1TagsMassDeletePostRequest** | [ApiV1TagsMassDeletePostRequest](ApiV1TagsMassDeletePostRequest.md) |  | |

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
| **200** | Deleted. |  -  |
| **400** | &#x60;no_ids&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TagsPost

> apiV1TagsPost(apiV1TagsPostRequest)

Create a tag.

A name that already exists under the same parent is not duplicated: the existing tag comes back with 200 and &#x60;existing: true&#x60;. &#x60;pid&#x60; must be one of the caller\&#39;s tags and the tree may not exceed three levels (422). 

### Example

```ts
import {
  Configuration,
  TagsApi,
} from 'goadserver-sdk';
import type { ApiV1TagsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TagsApi(config);

  const body = {
    // ApiV1TagsPostRequest
    apiV1TagsPostRequest: {"name":"Push","pid":5},
  } satisfies ApiV1TagsPostOperationRequest;

  try {
    const data = await api.apiV1TagsPost(body);
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
| **apiV1TagsPostRequest** | [ApiV1TagsPostRequest](ApiV1TagsPostRequest.md) |  | |

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
| **200** | Already existed. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; (name missing, bad parent, too deep) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

