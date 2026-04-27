# URLPoolsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1UrlPoolsGet**](URLPoolsApi.md#apiv1urlpoolsget) | **GET** /api/v1/url-pools | List URL pools. |
| [**apiV1UrlPoolsIdClonePost**](URLPoolsApi.md#apiv1urlpoolsidclonepost) | **POST** /api/v1/url-pools/{id}/clone | Clone a URL pool with all its URLs. |
| [**apiV1UrlPoolsIdDelete**](URLPoolsApi.md#apiv1urlpoolsiddelete) | **DELETE** /api/v1/url-pools/{id} | Soft-delete a URL pool. |
| [**apiV1UrlPoolsIdGet**](URLPoolsApi.md#apiv1urlpoolsidget) | **GET** /api/v1/url-pools/{id} | Show one URL pool. |
| [**apiV1UrlPoolsIdPut**](URLPoolsApi.md#apiv1urlpoolsidputoperation) | **PUT** /api/v1/url-pools/{id} | Update URL pool meta. |
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



## apiV1UrlPoolsGet

> ApiV1CampaignsTypeCampaignIdAdsGet200Response apiV1UrlPoolsGet(page, perPage)

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
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
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


## apiV1UrlPoolsIdUrlsGet

> apiV1UrlPoolsIdUrlsGet(id)

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

Editable fields — &#x60;url&#x60;, &#x60;title&#x60;, &#x60;weight&#x60;, &#x60;properties&#x60;.

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
    apiV1UrlPoolsIdUrlsUrlIdPutRequest: ...,
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
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **404** | URL not found. |  -  |

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
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **404** | URL not found. |  -  |

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

