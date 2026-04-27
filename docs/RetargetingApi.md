# RetargetingApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1RetargetingPixelsGet**](RetargetingApi.md#apiv1retargetingpixelsget) | **GET** /api/v1/retargeting/pixels | List the caller\&#39;s retargeting pixels. |
| [**apiV1RetargetingPixelsIdActivePatch**](RetargetingApi.md#apiv1retargetingpixelsidactivepatch) | **PATCH** /api/v1/retargeting/pixels/{id}/active | Activate or deactivate a retargeting pixel. |
| [**apiV1RetargetingPixelsIdDelete**](RetargetingApi.md#apiv1retargetingpixelsiddelete) | **DELETE** /api/v1/retargeting/pixels/{id} | Soft-delete a retargeting pixel and clear its captured visitors. |
| [**apiV1RetargetingPixelsIdGet**](RetargetingApi.md#apiv1retargetingpixelsidget) | **GET** /api/v1/retargeting/pixels/{id} | Get one retargeting pixel. |
| [**apiV1RetargetingPixelsIdPut**](RetargetingApi.md#apiv1retargetingpixelsidputoperation) | **PUT** /api/v1/retargeting/pixels/{id} | Rename a retargeting pixel. |
| [**apiV1RetargetingPixelsPost**](RetargetingApi.md#apiv1retargetingpixelspostoperation) | **POST** /api/v1/retargeting/pixels | Create a retargeting pixel. |



## apiV1RetargetingPixelsGet

> ApiV1RetargetingPixelsGet200Response apiV1RetargetingPixelsGet()

List the caller\&#39;s retargeting pixels.

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  try {
    const data = await api.apiV1RetargetingPixelsGet();
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

[**ApiV1RetargetingPixelsGet200Response**](ApiV1RetargetingPixelsGet200Response.md)

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


## apiV1RetargetingPixelsIdActivePatch

> ApiV1RetargetingPixelsIdActivePatch200Response apiV1RetargetingPixelsIdActivePatch(id, apiV1CampaignsTypeIdActivePatchRequest)

Activate or deactivate a retargeting pixel.

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsIdActivePatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1RetargetingPixelsIdActivePatchRequest;

  try {
    const data = await api.apiV1RetargetingPixelsIdActivePatch(body);
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
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1RetargetingPixelsIdActivePatch200Response**](ApiV1RetargetingPixelsIdActivePatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New state |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RetargetingPixelsIdDelete

> apiV1RetargetingPixelsIdDelete(id)

Soft-delete a retargeting pixel and clear its captured visitors.

Sets &#x60;isdeleted&#x3D;1&#x60; in MySQL and asynchronously deletes the pixel\&#39;s rows from ClickHouse &#x60;rt_final&#x60;. Captured visitor IDs are gone — re-creating with the same name will start fresh. 

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1RetargetingPixelsIdDeleteRequest;

  try {
    const data = await api.apiV1RetargetingPixelsIdDelete(body);
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


## apiV1RetargetingPixelsIdGet

> RetargetingPixel apiV1RetargetingPixelsIdGet(id)

Get one retargeting pixel.

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1RetargetingPixelsIdGetRequest;

  try {
    const data = await api.apiV1RetargetingPixelsIdGet(body);
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

[**RetargetingPixel**](RetargetingPixel.md)

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


## apiV1RetargetingPixelsIdPut

> apiV1RetargetingPixelsIdPut(id, apiV1RetargetingPixelsIdPutRequest)

Rename a retargeting pixel.

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1RetargetingPixelsIdPutRequest
    apiV1RetargetingPixelsIdPutRequest: ...,
  } satisfies ApiV1RetargetingPixelsIdPutOperationRequest;

  try {
    const data = await api.apiV1RetargetingPixelsIdPut(body);
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
| **apiV1RetargetingPixelsIdPutRequest** | [ApiV1RetargetingPixelsIdPutRequest](ApiV1RetargetingPixelsIdPutRequest.md) |  | |

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
| **200** | Updated |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RetargetingPixelsPost

> RetargetingPixel apiV1RetargetingPixelsPost(apiV1RetargetingPixelsPostRequest)

Create a retargeting pixel.

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  const body = {
    // ApiV1RetargetingPixelsPostRequest
    apiV1RetargetingPixelsPostRequest: ...,
  } satisfies ApiV1RetargetingPixelsPostOperationRequest;

  try {
    const data = await api.apiV1RetargetingPixelsPost(body);
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
| **apiV1RetargetingPixelsPostRequest** | [ApiV1RetargetingPixelsPostRequest](ApiV1RetargetingPixelsPostRequest.md) |  | |

### Return type

[**RetargetingPixel**](RetargetingPixel.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

