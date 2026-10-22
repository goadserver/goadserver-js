# XMLFeedsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1XmlFeedsGet**](XMLFeedsApi.md#apiv1xmlfeedsget) | **GET** /api/v1/xml-feeds | List XML feeds. |
| [**apiV1XmlFeedsIdClonePost**](XMLFeedsApi.md#apiv1xmlfeedsidclonepost) | **POST** /api/v1/xml-feeds/{id}/clone | Clone an XML feed. |
| [**apiV1XmlFeedsIdDelete**](XMLFeedsApi.md#apiv1xmlfeedsiddelete) | **DELETE** /api/v1/xml-feeds/{id} | Delete an XML feed. |
| [**apiV1XmlFeedsIdGet**](XMLFeedsApi.md#apiv1xmlfeedsidget) | **GET** /api/v1/xml-feeds/{id} | Show an XML feed. |
| [**apiV1XmlFeedsIdPut**](XMLFeedsApi.md#apiv1xmlfeedsidputoperation) | **PUT** /api/v1/xml-feeds/{id} | Update an XML feed. |
| [**apiV1XmlFeedsIdTogglePut**](XMLFeedsApi.md#apiv1xmlfeedsidtoggleput) | **PUT** /api/v1/xml-feeds/{id}/toggle | Flip an XML feed active / paused. |
| [**apiV1XmlFeedsPost**](XMLFeedsApi.md#apiv1xmlfeedspostoperation) | **POST** /api/v1/xml-feeds | Create an XML feed. |



## apiV1XmlFeedsGet

> apiV1XmlFeedsGet(page, perPage, search, sortBy, sortDir)

List XML feeds.

The account\&#39;s product feeds. &#x60;lastvisit&#x60; / &#x60;nextvisit&#x60; are the last and next fetch times (null before the first fetch). &#x60;filter_name&#x60;, &#x60;filter_url&#x60; (substring), &#x60;filter_id&#x60; and &#x60;search&#x60; narrow the list; &#x60;sort_by&#x60; &#x3D; id / name / isactive, &#x60;sort_dir&#x60; &#x3D; asc / desc. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string (optional)
    search: search_example,
    // 'id' | 'name' | 'isactive' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
  } satisfies ApiV1XmlFeedsGetRequest;

  try {
    const data = await api.apiV1XmlFeedsGet(body);
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
| **sortBy** | `id`, `name`, `isactive` |  | [Optional] [Defaults to `undefined`] [Enum: id, name, isactive] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `undefined`] [Enum: asc, desc] |

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
| **200** | Feeds. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1XmlFeedsIdClonePost

> apiV1XmlFeedsIdClonePost(id)

Clone an XML feed.

Copies the feed as \&quot;&lt;name&gt; Copy\&quot;, paused. No body.

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1XmlFeedsIdClonePostRequest;

  try {
    const data = await api.apiV1XmlFeedsIdClonePost(body);
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
| **201** | Cloned. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Feed not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1XmlFeedsIdDelete

> apiV1XmlFeedsIdDelete(id)

Delete an XML feed.

Permanent (the row is removed, as in the panel). Refused with 422 &#x60;feed_in_use&#x60; while any of your non-deleted campaigns still uses the feed (&#x60;feedid&#x60;) — the response lists them (up to 50); take the feed off those campaigns (or delete them) first. Refused for a campaign-pinned key. 

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1XmlFeedsIdDeleteRequest;

  try {
    const data = await api.apiV1XmlFeedsIdDelete(body);
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
| **404** | Feed not found. |  -  |
| **422** | &#x60;feed_in_use&#x60; — campaigns still use this feed. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1XmlFeedsIdGet

> apiV1XmlFeedsIdGet(id)

Show an XML feed.

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1XmlFeedsIdGetRequest;

  try {
    const data = await api.apiV1XmlFeedsIdGet(body);
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
| **200** | The feed row. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Feed not found (or module off). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1XmlFeedsIdPut

> apiV1XmlFeedsIdPut(id, apiV1XmlFeedsIdPutRequest)

Update an XML feed.

Partial: only the fields sent change. &#x60;revisitminutes&#x60; is raised to 5 at least; &#x60;isactive&#x60; 0/1 pauses or resumes fetching. A feed is shared by every campaign that uses it, so a key pinned to campaigns gets 403 &#x60;forbidden_resource&#x60;. 

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1XmlFeedsIdPutRequest
    apiV1XmlFeedsIdPutRequest: {"revisitminutes":30},
  } satisfies ApiV1XmlFeedsIdPutOperationRequest;

  try {
    const data = await api.apiV1XmlFeedsIdPut(body);
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
| **apiV1XmlFeedsIdPutRequest** | [ApiV1XmlFeedsIdPutRequest](ApiV1XmlFeedsIdPutRequest.md) |  | |

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
| **400** | &#x60;no_fields&#x60; — nothing to update. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Feed not found. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1XmlFeedsIdTogglePut

> apiV1XmlFeedsIdTogglePut(id)

Flip an XML feed active / paused.

No body — flips &#x60;isactive&#x60;. Refused for a campaign-pinned key.

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsIdTogglePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1XmlFeedsIdTogglePutRequest;

  try {
    const data = await api.apiV1XmlFeedsIdTogglePut(body);
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
| **200** | Flipped. Read the feed to see the new state. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Feed not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1XmlFeedsPost

> apiV1XmlFeedsPost(apiV1XmlFeedsPostRequest)

Create an XML feed.

The paths are the XML element paths the fetcher reads per item. &#x60;revisitminutes&#x60; (how often the feed is re-fetched) is raised to the minimum of 5. The feed starts active. Unknown body fields → 422 &#x60;unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  XMLFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1XmlFeedsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new XMLFeedsApi(config);

  const body = {
    // ApiV1XmlFeedsPostRequest
    apiV1XmlFeedsPostRequest: {"name":"Shop feed","url":"https://shop.example.com/feed.xml","itemspath":"rss/channel/item","titlepath":"title","descriptionpath":"description","mediapath":"enclosure@url","linkpath":"link","revisitminutes":60},
  } satisfies ApiV1XmlFeedsPostOperationRequest;

  try {
    const data = await api.apiV1XmlFeedsPost(body);
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
| **apiV1XmlFeedsPostRequest** | [ApiV1XmlFeedsPostRequest](ApiV1XmlFeedsPostRequest.md) |  | |

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
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **422** | &#x60;validation_error&#x60; (name missing) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

