# RetargetingApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1RetargetingPixelsGet**](RetargetingApi.md#apiv1retargetingpixelsget) | **GET** /api/v1/retargeting/pixels | List the caller\&#39;s retargeting pixels. |
| [**apiV1RetargetingPixelsIdActivePatch**](RetargetingApi.md#apiv1retargetingpixelsidactivepatch) | **PATCH** /api/v1/retargeting/pixels/{id}/active | Activate or deactivate a retargeting pixel. |
| [**apiV1RetargetingPixelsIdDelete**](RetargetingApi.md#apiv1retargetingpixelsiddelete) | **DELETE** /api/v1/retargeting/pixels/{id} | Soft-delete a retargeting pixel and clear its captured visitors. |
| [**apiV1RetargetingPixelsIdGet**](RetargetingApi.md#apiv1retargetingpixelsidget) | **GET** /api/v1/retargeting/pixels/{id} | Get one retargeting pixel. |
| [**apiV1RetargetingPixelsIdPut**](RetargetingApi.md#apiv1retargetingpixelsidput) | **PUT** /api/v1/retargeting/pixels/{id} | Update a retargeting pixel (name and visitor windows). |
| [**apiV1RetargetingPixelsPost**](RetargetingApi.md#apiv1retargetingpixelspost) | **POST** /api/v1/retargeting/pixels | Create a retargeting pixel. |



## apiV1RetargetingPixelsGet

> ApiV1RetargetingPixelsGet200Response apiV1RetargetingPixelsGet()

List the caller\&#39;s retargeting pixels.

Every live list in one response — not paginated (&#x60;total_rows&#x60; is the count). Requires the tenant\&#39;s retargeting module (&#x60;modules.advertiser.retargetting&#x60;); 403 when it is off. 

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

> ApiV1RetargetingPixelsIdDelete200Response apiV1RetargetingPixelsIdDelete(id)

Soft-delete a retargeting pixel and clear its captured visitors.

Sets &#x60;isdeleted&#x3D;1&#x60; in MySQL and asynchronously deletes the pixel\&#39;s captured visitors (ClickHouse &#x60;rt_pixels&#x60;, the same cleanup the panel runs). Captured visitor IDs are gone — re-creating with the same name will start fresh. A campaign still pointing at the list (&#x60;rt_id&#x60; / &#x60;rt_exclude_id&#x60;) keeps the pointer. 

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

[**ApiV1RetargetingPixelsIdDelete200Response**](ApiV1RetargetingPixelsIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted |  -  |
| **404** | Not found (or already deleted) |  -  |

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

> RetargetingPixel apiV1RetargetingPixelsIdPut(id, retargetingPixelWrite)

Update a retargeting pixel (name and visitor windows).

Partial update: fields not sent keep their stored value. At least one editable field is required (422 \&quot;Nothing to update.\&quot; otherwise). Returns the updated record. 

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsIdPutRequest } from 'goadserver-sdk';

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
    // RetargetingPixelWrite
    retargetingPixelWrite: {"skipvisits":5},
  } satisfies ApiV1RetargetingPixelsIdPutRequest;

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
| **retargetingPixelWrite** | [RetargetingPixelWrite](RetargetingPixelWrite.md) |  | |

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
| **200** | Updated record |  -  |
| **404** | Not found |  -  |
| **422** | Validation error or nothing to update. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RetargetingPixelsPost

> RetargetingPixel apiV1RetargetingPixelsPost(retargetingPixelWrite)

Create a retargeting pixel.

Same write path and validation as the panel. Windows not sent are 0 (off). 

### Example

```ts
import {
  Configuration,
  RetargetingApi,
} from 'goadserver-sdk';
import type { ApiV1RetargetingPixelsPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RetargetingApi(config);

  const body = {
    // RetargetingPixelWrite
    retargetingPixelWrite: {"name":"Cart abandoners","rmdays":30,"skiphours":1},
  } satisfies ApiV1RetargetingPixelsPostRequest;

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
| **retargetingPixelWrite** | [RetargetingPixelWrite](RetargetingPixelWrite.md) |  | |

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
| **422** | Validation error — &#x60;errors&#x60; is keyed by the panel field names (&#x60;name&#x60;, &#x60;rmdays&#x60;, &#x60;skipdays&#x60;, &#x60;skiphours&#x60;, &#x60;skipvisits&#x60;), or an unknown key. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

