# URLPoolsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1UrlPoolsGet**](URLPoolsApi.md#apiv1urlpoolsget) | **GET** /api/v1/url-pools | List URL pools. |
| [**apiV1UrlPoolsIdClonePost**](URLPoolsApi.md#apiv1urlpoolsidclonepost) | **POST** /api/v1/url-pools/{id}/clone | Clone a URL pool with all its URLs. |
| [**apiV1UrlPoolsIdDelete**](URLPoolsApi.md#apiv1urlpoolsiddelete) | **DELETE** /api/v1/url-pools/{id} | Soft-delete a URL pool. |
| [**apiV1UrlPoolsIdGet**](URLPoolsApi.md#apiv1urlpoolsidget) | **GET** /api/v1/url-pools/{id} | Show one URL pool. |
| [**apiV1UrlPoolsIdPut**](URLPoolsApi.md#apiv1urlpoolsidputoperation) | **PUT** /api/v1/url-pools/{id} | Update URL pool meta. |
| [**apiV1UrlPoolsIdRecoverPost**](URLPoolsApi.md#apiv1urlpoolsidrecoverpost) | **POST** /api/v1/url-pools/{id}/recover | Restore an archived url pool. |
| [**apiV1UrlPoolsIdUrlsGet**](URLPoolsApi.md#apiv1urlpoolsidurlsget) | **GET** /api/v1/url-pools/{id}/urls | List URLs in a pool. |
| [**apiV1UrlPoolsIdUrlsPost**](URLPoolsApi.md#apiv1urlpoolsidurlspostoperation) | **POST** /api/v1/url-pools/{id}/urls | Add a URL to a pool. |
| [**apiV1UrlPoolsIdUrlsUrlIdClonePost**](URLPoolsApi.md#apiv1urlpoolsidurlsurlidclonepost) | **POST** /api/v1/url-pools/{id}/urls/{urlId}/clone | Clone a single URL within the same pool. |
| [**apiV1UrlPoolsIdUrlsUrlIdDelete**](URLPoolsApi.md#apiv1urlpoolsidurlsurliddelete) | **DELETE** /api/v1/url-pools/{id}/urls/{urlId} | Soft-delete a single URL. |
| [**apiV1UrlPoolsIdUrlsUrlIdGet**](URLPoolsApi.md#apiv1urlpoolsidurlsurlidget) | **GET** /api/v1/url-pools/{id}/urls/{urlId} | Show a single URL. |
| [**apiV1UrlPoolsIdUrlsUrlIdPut**](URLPoolsApi.md#apiv1urlpoolsidurlsurlidputoperation) | **PUT** /api/v1/url-pools/{id}/urls/{urlId} | Update a single URL. |
| [**apiV1UrlPoolsIdUrlsUrlIdTogglePut**](URLPoolsApi.md#apiv1urlpoolsidurlsurlidtoggleput) | **PUT** /api/v1/url-pools/{id}/urls/{urlId}/toggle | Toggle a URL on / off. |
| [**apiV1UrlPoolsIdUrlsUrlIdWeightPut**](URLPoolsApi.md#apiv1urlpoolsidurlsurlidweightputoperation) | **PUT** /api/v1/url-pools/{id}/urls/{urlId}/weight | Set a URL\&#39;s rotation weight. |
| [**apiV1UrlPoolsIdUsedInGet**](URLPoolsApi.md#apiv1urlpoolsidusedinget) | **GET** /api/v1/url-pools/{id}/used-in | List campaigns / ads that reference this URL pool. |
| [**apiV1UrlPoolsPost**](URLPoolsApi.md#apiv1urlpoolspostoperation) | **POST** /api/v1/url-pools | Create a URL pool. |
| [**apiV1UrlPoolsReplaceUrlPut**](URLPoolsApi.md#apiv1urlpoolsreplaceurlputoperation) | **PUT** /api/v1/url-pools/replace-url | Search &amp; replace text across your URL-pool URLs. |



## apiV1UrlPoolsGet

> ApiV1CreativesGet200Response apiV1UrlPoolsGet(selectStats, from, to, page, perPage, filterId, filterTitle, filterName, state, search, sortBy, sortDir)

List URL pools.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // '1' | 1 = add clicks per pool for the from / to window (default the last 7 days). (optional)
    selectStats: selectStats_example,
    // Date | With select_stats=1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. (optional)
    from: 2013-10-20,
    // Date | With select_stats=1: last day of the stats window (YYYY-MM-DD). (optional)
    to: 2013-10-20,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // number (optional)
    filterId: 56,
    // string | Title contains. (optional)
    filterTitle: filterTitle_example,
    // string | Same as filter_title. (optional)
    filterName: filterName_example,
    // 'live' | 'deleted' | deleted = the archived pools (deleted from the pool page or archived from Cleanup), to restore with POST /{id}/recover. Purged pools are in neither list. (optional)
    state: state_example,
    // string | Title contains. (optional)
    search: search_example,
    // 'id' | 'title' | 'sort_type' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
  } satisfies ApiV1UrlPoolsGetRequest;

  try {
    const data = await api.apiV1UrlPoolsGet(body);
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
| **selectStats** | `1` | 1 &#x3D; add clicks per pool for the from / to window (default the last 7 days). | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **from** | `Date` | With select_stats&#x3D;1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | With select_stats&#x3D;1: last day of the stats window (YYYY-MM-DD). | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterTitle** | `string` | Title contains. | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` | Same as filter_title. | [Optional] [Defaults to `undefined`] |
| **state** | `live`, `deleted` | deleted &#x3D; the archived pools (deleted from the pool page or archived from Cleanup), to restore with POST /{id}/recover. Purged pools are in neither list. | [Optional] [Defaults to `&#39;live&#39;`] [Enum: live, deleted] |
| **search** | `string` | Title contains. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `title`, `sort_type` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, title, sort_type] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

### Return type

[**ApiV1CreativesGet200Response**](ApiV1CreativesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pools. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdClonePost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1UrlPoolsIdClonePost(id)

Clone a URL pool with all its URLs.

Duplicates the pool row and every URL in it (&#x60;isdeleted&#x3D;0&#x60;). New pool title is suffixed with \&quot; (Copy)\&quot;. 

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1UrlPoolsIdClonePostRequest;

  try {
    const data = await api.apiV1UrlPoolsIdClonePost(body);
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

[**ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdDelete

> apiV1UrlPoolsIdDelete(id)

Soft-delete a URL pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1UrlPoolsIdDeleteRequest;

  try {
    const data = await api.apiV1UrlPoolsIdDelete(body);
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
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdGet

> apiV1UrlPoolsIdGet(id)

Show one URL pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1UrlPoolsIdGetRequest;

  try {
    const data = await api.apiV1UrlPoolsIdGet(body);
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
| **200** | Pool detail. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdPut

> apiV1UrlPoolsIdPut(id, apiV1UrlPoolsIdPutRequest)

Update URL pool meta.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1UrlPoolsIdPutRequest
    apiV1UrlPoolsIdPutRequest: ...,
  } satisfies ApiV1UrlPoolsIdPutOperationRequest;

  try {
    const data = await api.apiV1UrlPoolsIdPut(body);
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
| **apiV1UrlPoolsIdPutRequest** | [ApiV1UrlPoolsIdPutRequest](ApiV1UrlPoolsIdPutRequest.md) |  | |

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
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdRecoverPost

> apiV1UrlPoolsIdRecoverPost(id)

Restore an archived url pool.

Reverses the soft delete of DELETE /url-pools/{id} (and of Cleanup\&#39;s Archive): the pool is listed and usable again. Its URLs were never removed, so they are all there. 404 when the pool does not exist, is not archived, or was purged. 

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdRecoverPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1UrlPoolsIdRecoverPostRequest;

  try {
    const data = await api.apiV1UrlPoolsIdRecoverPost(body);
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
| **200** | Restored. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found, not archived or purged. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsGet

> apiV1UrlPoolsIdUrlsGet(id, filterUrl, filterIsactive, search, sortBy, sortDir, page, perPage, selectStats, from, to)

List URLs in a pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // string | URL contains. (optional)
    filterUrl: filterUrl_example,
    // 0 | 1 (optional)
    filterIsactive: 56,
    // string | Matches URL, title or keywords. (optional)
    search: search_example,
    // 'id' | 'url' | 'title' | 'weight' | 'isactive' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // '1' | 1 = add stats per URL for the from / to window (default the last 7 days). (optional)
    selectStats: selectStats_example,
    // Date | With select_stats=1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. (optional)
    from: 2013-10-20,
    // Date | With select_stats=1: last day of the stats window (YYYY-MM-DD). (optional)
    to: 2013-10-20,
  } satisfies ApiV1UrlPoolsIdUrlsGetRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsGet(body);
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
| **filterUrl** | `string` | URL contains. | [Optional] [Defaults to `undefined`] |
| **filterIsactive** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **search** | `string` | Matches URL, title or keywords. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `url`, `title`, `weight`, `isactive` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, url, title, weight, isactive] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **selectStats** | `1` | 1 &#x3D; add stats per URL for the from / to window (default the last 7 days). | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **from** | `Date` | With select_stats&#x3D;1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | With select_stats&#x3D;1: last day of the stats window (YYYY-MM-DD). | [Optional] [Defaults to `undefined`] |

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
| **200** | URLs. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsPost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1UrlPoolsIdUrlsPost(id, apiV1UrlPoolsIdUrlsPostRequest)

Add a URL to a pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1UrlPoolsIdUrlsPostRequest
    apiV1UrlPoolsIdUrlsPostRequest: ...,
  } satisfies ApiV1UrlPoolsIdUrlsPostOperationRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsPost(body);
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
| **apiV1UrlPoolsIdUrlsPostRequest** | [ApiV1UrlPoolsIdUrlsPostRequest](ApiV1UrlPoolsIdUrlsPostRequest.md) |  | |

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
| **422** | Validation error — title / url, or &#x60;start_at&#x60; / &#x60;end_at&#x60; (bad format, end not after start). |  -  |
| **201** | URL added. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsUrlIdClonePost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1UrlPoolsIdUrlsUrlIdClonePost(id, urlId)

Clone a single URL within the same pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsUrlIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    urlId: 56,
  } satisfies ApiV1UrlPoolsIdUrlsUrlIdClonePostRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsUrlIdClonePost(body);
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
| **urlId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | URL cloned. |  -  |
| **404** | URL not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsUrlIdDelete

> apiV1UrlPoolsIdUrlsUrlIdDelete(id, urlId)

Soft-delete a single URL.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsUrlIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    urlId: 56,
  } satisfies ApiV1UrlPoolsIdUrlsUrlIdDeleteRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsUrlIdDelete(body);
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
| **urlId** | `number` |  | [Defaults to `undefined`] |

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
| **404** | URL not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsUrlIdGet

> apiV1UrlPoolsIdUrlsUrlIdGet(id, urlId)

Show a single URL.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsUrlIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    urlId: 56,
  } satisfies ApiV1UrlPoolsIdUrlsUrlIdGetRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsUrlIdGet(body);
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
| **urlId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | URL detail. |  -  |
| **404** | URL not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsUrlIdPut

> apiV1UrlPoolsIdUrlsUrlIdPut(id, urlId, apiV1UrlPoolsIdUrlsUrlIdPutRequest)

Update a single URL.

Editable fields — &#x60;url&#x60;, &#x60;title&#x60;, &#x60;weight&#x60;, &#x60;properties&#x60;, &#x60;keywords&#x60;, &#x60;is_fallback&#x60;, &#x60;start_at&#x60;, &#x60;end_at&#x60;.  **Scheduling.** &#x60;start_at&#x60; / &#x60;end_at&#x60; make the URL serve only inside &#x60;[start_at, end_at)&#x60;. Send unix seconds or an RFC 3339 time with its offset (&#x60;2026-10-20T09:00:00-04:00&#x60; &#x3D; 9:00 AM New York); &#x60;null&#x60;, &#x60;0&#x60; or &#x60;\&quot;\&quot;&#x60; clears that side. The ad servers pick up an edit within a minute and then switch on the exact second.  **Backup** (&#x60;is_fallback: true&#x60;): the URL is used only while no other URL of the pool is live — mark the regular lander as backup and schedule the promo lander; the regular one steps aside while the promo runs and returns when it ends. Keyword targeting then applies within whichever set is live. Not to be confused with a keyword *fallback* URL (one without keywords).  A change that would leave a pool still used by campaign ads with no URL to serve at some moment is refused with 409 &#x60;SCHEDULE_LEAVES_POOL_EMPTY&#x60; (&#x60;gap_at&#x60; &#x3D; first uncovered unix second). Pausing or deleting a URL runs the same check over the other URLs\&#39; schedules. 

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsUrlIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    urlId: 56,
    // ApiV1UrlPoolsIdUrlsUrlIdPutRequest
    apiV1UrlPoolsIdUrlsUrlIdPutRequest: {"is_fallback":false,"start_at":"2026-10-20T09:00:00-04:00","end_at":"2026-10-27T09:00:00-04:00"},
  } satisfies ApiV1UrlPoolsIdUrlsUrlIdPutOperationRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsUrlIdPut(body);
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
| **urlId** | `number` |  | [Defaults to `undefined`] |
| **apiV1UrlPoolsIdUrlsUrlIdPutRequest** | [ApiV1UrlPoolsIdUrlsUrlIdPutRequest](ApiV1UrlPoolsIdUrlsUrlIdPutRequest.md) |  | |

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
| **404** | URL not found. |  -  |
| **409** | &#x60;SCHEDULE_LEAVES_POOL_EMPTY&#x60; — the schedule would leave an in-use pool with no URL to serve. |  -  |
| **422** | Validation error on &#x60;url&#x60; / &#x60;title&#x60; / &#x60;start_at&#x60; / &#x60;end_at&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsUrlIdTogglePut

> apiV1UrlPoolsIdUrlsUrlIdTogglePut(id, urlId)

Toggle a URL on / off.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsUrlIdTogglePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    urlId: 56,
  } satisfies ApiV1UrlPoolsIdUrlsUrlIdTogglePutRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsUrlIdTogglePut(body);
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
| **urlId** | `number` |  | [Defaults to `undefined`] |

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
| **404** | URL not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUrlsUrlIdWeightPut

> apiV1UrlPoolsIdUrlsUrlIdWeightPut(id, urlId, apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest)

Set a URL\&#39;s rotation weight.

Higher weight &#x3D; more traffic share when &#x60;sort_type&#x3D;wr&#x60;. Has no effect for &#x60;rnd&#x60;, &#x60;ctr&#x60; and &#x60;cr&#x60; sort modes. 

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUrlsUrlIdWeightPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    urlId: 56,
    // ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest
    apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest: ...,
  } satisfies ApiV1UrlPoolsIdUrlsUrlIdWeightPutOperationRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUrlsUrlIdWeightPut(body);
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
| **urlId** | `number` |  | [Defaults to `undefined`] |
| **apiV1UrlPoolsIdUrlsUrlIdWeightPutRequest** | [ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest](ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest.md) |  | |

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
| **400** | &#x60;invalid_weight&#x60; — not a whole number 0–1000000. |  -  |
| **404** | URL not found. |  -  |
| **422** | &#x60;weight&#x60; missing. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsIdUsedInGet

> apiV1UrlPoolsIdUsedInGet(id)

List campaigns / ads that reference this URL pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsIdUsedInGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1UrlPoolsIdUsedInGetRequest;

  try {
    const data = await api.apiV1UrlPoolsIdUsedInGet(body);
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
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | References. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsPost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1UrlPoolsPost(apiV1UrlPoolsPostRequest)

Create a URL pool.

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // ApiV1UrlPoolsPostRequest
    apiV1UrlPoolsPostRequest: ...,
  } satisfies ApiV1UrlPoolsPostOperationRequest;

  try {
    const data = await api.apiV1UrlPoolsPost(body);
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
| **apiV1UrlPoolsPostRequest** | [ApiV1UrlPoolsPostRequest](ApiV1UrlPoolsPostRequest.md) |  | |

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

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UrlPoolsReplaceUrlPut

> apiV1UrlPoolsReplaceUrlPut(apiV1UrlPoolsReplaceUrlPutRequest)

Search &amp; replace text across your URL-pool URLs.

Replaces the first occurrence of &#x60;search&#x60; with &#x60;replace&#x60; in every matching URL of your URL pools — e.g. swap a tracker domain or an offer id. Narrow with &#x60;poolids&#x60; and/or &#x60;urlids&#x60;; both empty &#x3D; every URL of every pool you own. &#x60;dry_run: true&#x60; returns the matches (old → new) without writing — recommended first. Logged to the account\&#39;s action log. A key pinned to campaigns is refused (URL pools feed ads of any campaign). Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  URLPoolsApi,
} from 'goadserver-sdk';
import type { ApiV1UrlPoolsReplaceUrlPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new URLPoolsApi(config);

  const body = {
    // ApiV1UrlPoolsReplaceUrlPutRequest
    apiV1UrlPoolsReplaceUrlPutRequest: {"search":"old-tracker.com","replace":"new-tracker.com","dry_run":true},
  } satisfies ApiV1UrlPoolsReplaceUrlPutOperationRequest;

  try {
    const data = await api.apiV1UrlPoolsReplaceUrlPut(body);
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
| **apiV1UrlPoolsReplaceUrlPutRequest** | [ApiV1UrlPoolsReplaceUrlPutRequest](ApiV1UrlPoolsReplaceUrlPutRequest.md) |  | |

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
| **200** | Preview (dry_run) or result. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;search&#x60; missing, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

