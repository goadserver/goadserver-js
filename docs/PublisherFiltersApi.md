# PublisherFiltersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherFiltersGet**](PublisherFiltersApi.md#apiv1publisherfiltersget) | **GET** /api/v1/publisher/filters | List the publisher\&#39;s URL block list. |
| [**apiV1PublisherFiltersUrlsDelete**](PublisherFiltersApi.md#apiv1publisherfiltersurlsdeleteoperation) | **DELETE** /api/v1/publisher/filters/urls | Remove one or more URLs from the block list. |
| [**apiV1PublisherFiltersUrlsPost**](PublisherFiltersApi.md#apiv1publisherfiltersurlspostoperation) | **POST** /api/v1/publisher/filters/urls | Add one or more URLs to the block list. |



## apiV1PublisherFiltersGet

> ApiV1PublisherFiltersGet200Response apiV1PublisherFiltersGet()

List the publisher\&#39;s URL block list.

**URLs** — global block list applied to every adspace this publisher owns. Stored as a CSV in &#x60;usersettings.excldomains&#x60;. Returned as a flat array of &#x60;{url, type}&#x60; entries.  **&#x60;categories&#x60; is deprecated and always empty.** Category filters were retired, along with the four &#x60;/filters/categories&#x60; endpoints that managed them. The key is still returned so existing callers keep parsing the response unchanged; do not build against it. 

### Example

```ts
import {
  Configuration,
  PublisherFiltersApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PublisherFiltersApi(config);

  try {
    const data = await api.apiV1PublisherFiltersGet();
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

[**ApiV1PublisherFiltersGet200Response**](ApiV1PublisherFiltersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Both filter flavors. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFiltersUrlsDelete

> ApiV1PublisherFiltersUrlsDelete200Response apiV1PublisherFiltersUrlsDelete(apiV1PublisherFiltersUrlsDeleteRequest)

Remove one or more URLs from the block list.

Body accepts &#x60;url&#x60; (single) or &#x60;urls&#x60; (array). Matching is case-insensitive. Unknown URLs are silently ignored. 

### Example

```ts
import {
  Configuration,
  PublisherFiltersApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFiltersUrlsDeleteOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PublisherFiltersApi(config);

  const body = {
    // ApiV1PublisherFiltersUrlsDeleteRequest
    apiV1PublisherFiltersUrlsDeleteRequest: ...,
  } satisfies ApiV1PublisherFiltersUrlsDeleteOperationRequest;

  try {
    const data = await api.apiV1PublisherFiltersUrlsDelete(body);
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
| **apiV1PublisherFiltersUrlsDeleteRequest** | [ApiV1PublisherFiltersUrlsDeleteRequest](ApiV1PublisherFiltersUrlsDeleteRequest.md) |  | |

### Return type

[**ApiV1PublisherFiltersUrlsDelete200Response**](ApiV1PublisherFiltersUrlsDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. Body has the slice that was actually removed and the new total. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherFiltersUrlsPost

> ApiV1PublisherFiltersUrlsPost201Response apiV1PublisherFiltersUrlsPost(apiV1PublisherFiltersUrlsPostRequest)

Add one or more URLs to the block list.

Adds URLs to &#x60;usersettings.excldomains&#x60; (deduped). Body accepts either &#x60;url&#x60; (single) or &#x60;urls&#x60; (array). Existing entries stay. 

### Example

```ts
import {
  Configuration,
  PublisherFiltersApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherFiltersUrlsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PublisherFiltersApi(config);

  const body = {
    // ApiV1PublisherFiltersUrlsPostRequest
    apiV1PublisherFiltersUrlsPostRequest: ...,
  } satisfies ApiV1PublisherFiltersUrlsPostOperationRequest;

  try {
    const data = await api.apiV1PublisherFiltersUrlsPost(body);
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
| **apiV1PublisherFiltersUrlsPostRequest** | [ApiV1PublisherFiltersUrlsPostRequest](ApiV1PublisherFiltersUrlsPostRequest.md) |  | |

### Return type

[**ApiV1PublisherFiltersUrlsPost201Response**](ApiV1PublisherFiltersUrlsPost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Updated. Body has the slice that was newly added and the new total. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **409** | Validation error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

