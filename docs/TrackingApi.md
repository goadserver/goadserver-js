# TrackingApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackingConversionTypesGet**](TrackingApi.md#apiv1trackingconversiontypesget) | **GET** /api/v1/tracking/conversion-types | Available conversion types for the caller\&#39;s account. |
| [**apiV1TrackingPixelsGet**](TrackingApi.md#apiv1trackingpixelsget) | **GET** /api/v1/tracking/pixels | List the caller\&#39;s conversion-tracking pixels. |
| [**apiV1TrackingPixelsIdDelete**](TrackingApi.md#apiv1trackingpixelsiddelete) | **DELETE** /api/v1/tracking/pixels/{id} | Delete a pixel. |
| [**apiV1TrackingPixelsIdGet**](TrackingApi.md#apiv1trackingpixelsidget) | **GET** /api/v1/tracking/pixels/{id} | Get one pixel. |
| [**apiV1TrackingPixelsIdPut**](TrackingApi.md#apiv1trackingpixelsidputoperation) | **PUT** /api/v1/tracking/pixels/{id} | Update a pixel\&#39;s name or conversion type. |
| [**apiV1TrackingPixelsPost**](TrackingApi.md#apiv1trackingpixelspostoperation) | **POST** /api/v1/tracking/pixels | Create a new tracking pixel. |



## apiV1TrackingConversionTypesGet

> ApiV1TrackingConversionTypesGet200Response apiV1TrackingConversionTypesGet()

Available conversion types for the caller\&#39;s account.

Use to discover valid &#x60;conversion_type_id&#x60; values for new pixels, plus the network\&#39;s ad-domain and the configured tracking variable name (needed to construct the actual tracking URL). 

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingConversionTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  try {
    const data = await api.apiV1TrackingConversionTypesGet();
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

[**ApiV1TrackingConversionTypesGet200Response**](ApiV1TrackingConversionTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Conversion types + tracking config |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackingPixelsGet

> ApiV1TrackingPixelsGet200Response apiV1TrackingPixelsGet(conversionTypeId, name, page, perPage)

List the caller\&#39;s conversion-tracking pixels.

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingPixelsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  const body = {
    // number | Filter by conversion type. (optional)
    conversionTypeId: 56,
    // string | Substring search on name. (optional)
    name: name_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1TrackingPixelsGetRequest;

  try {
    const data = await api.apiV1TrackingPixelsGet(body);
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
| **conversionTypeId** | `number` | Filter by conversion type. | [Optional] [Defaults to `undefined`] |
| **name** | `string` | Substring search on name. | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `100`] |

### Return type

[**ApiV1TrackingPixelsGet200Response**](ApiV1TrackingPixelsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pixel list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackingPixelsIdDelete

> apiV1TrackingPixelsIdDelete(id)

Delete a pixel.

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingPixelsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TrackingPixelsIdDeleteRequest;

  try {
    const data = await api.apiV1TrackingPixelsIdDelete(body);
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
| **200** | Deleted |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackingPixelsIdGet

> TrackingPixel apiV1TrackingPixelsIdGet(id)

Get one pixel.

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingPixelsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1TrackingPixelsIdGetRequest;

  try {
    const data = await api.apiV1TrackingPixelsIdGet(body);
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

[**TrackingPixel**](TrackingPixel.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pixel |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackingPixelsIdPut

> TrackingPixel apiV1TrackingPixelsIdPut(id, apiV1TrackingPixelsIdPutRequest)

Update a pixel\&#39;s name or conversion type.

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingPixelsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1TrackingPixelsIdPutRequest
    apiV1TrackingPixelsIdPutRequest: ...,
  } satisfies ApiV1TrackingPixelsIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackingPixelsIdPut(body);
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
| **apiV1TrackingPixelsIdPutRequest** | [ApiV1TrackingPixelsIdPutRequest](ApiV1TrackingPixelsIdPutRequest.md) |  | |

### Return type

[**TrackingPixel**](TrackingPixel.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackingPixelsPost

> TrackingPixel apiV1TrackingPixelsPost(apiV1TrackingPixelsPostRequest)

Create a new tracking pixel.

&#x60;pixel_code&#x60; is generated server-side (32 random hex chars) and returned in the response. Use it in the conversion URL the advertiser embeds on the post-conversion page. 

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingPixelsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  const body = {
    // ApiV1TrackingPixelsPostRequest
    apiV1TrackingPixelsPostRequest: ...,
  } satisfies ApiV1TrackingPixelsPostOperationRequest;

  try {
    const data = await api.apiV1TrackingPixelsPost(body);
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
| **apiV1TrackingPixelsPostRequest** | [ApiV1TrackingPixelsPostRequest](ApiV1TrackingPixelsPostRequest.md) |  | |

### Return type

[**TrackingPixel**](TrackingPixel.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **422** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

