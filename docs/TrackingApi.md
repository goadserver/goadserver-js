# TrackingApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackingConversionTypesGet**](TrackingApi.md#apiv1trackingconversiontypesget) | **GET** /api/v1/tracking/conversion-types | Available conversion types for the caller\&#39;s account. |
| [**apiV1TrackingConversionTypesPut**](TrackingApi.md#apiv1trackingconversiontypesputoperation) | **PUT** /api/v1/tracking/conversion-types | Name conversion-type slots and set the click-id dedup opt-outs. |
| [**apiV1TrackingPixelsGet**](TrackingApi.md#apiv1trackingpixelsget) | **GET** /api/v1/tracking/pixels | Deprecated: List the caller\&#39;s conversion-tracking pixels. |
| [**apiV1TrackingPixelsIdDelete**](TrackingApi.md#apiv1trackingpixelsiddelete) | **DELETE** /api/v1/tracking/pixels/{id} | Deprecated: Delete a pixel. |
| [**apiV1TrackingPixelsIdGet**](TrackingApi.md#apiv1trackingpixelsidget) | **GET** /api/v1/tracking/pixels/{id} | Deprecated: Get one pixel. |
| [**apiV1TrackingPixelsIdPut**](TrackingApi.md#apiv1trackingpixelsidputoperation) | **PUT** /api/v1/tracking/pixels/{id} | Deprecated: Update a pixel\&#39;s name or conversion type. |
| [**apiV1TrackingPixelsPost**](TrackingApi.md#apiv1trackingpixelspostoperation) | **POST** /api/v1/tracking/pixels | Deprecated: Create a new tracking pixel. |



## apiV1TrackingConversionTypesGet

> ApiV1TrackingConversionTypesGet200Response apiV1TrackingConversionTypesGet()

Available conversion types for the caller\&#39;s account.

The account\&#39;s named conversion-type slots (0–25, sorted A–Z by name; unnamed slots are omitted), the slots opted out of click-id deduplication, the network\&#39;s ad-domain and the configured tracking variable name (needed to construct the postback URL). &#x60;id&#x60; is the slot a postback\&#39;s conversion type refers to. An account that has never saved its conversion types gets the defaults (0 &#x3D; Sign ups, 1 &#x3D; Conversions, 25 &#x3D; Refunds) — the same names the first PUT seeds; an account that switched every slot off gets &#x60;[]&#x60;. Same handler as the panel. Requires the tenant\&#39;s tracking module (&#x60;modules.advertiser.tracking&#x60;). 

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


## apiV1TrackingConversionTypesPut

> ApiV1TrackingConversionTypesPut200Response apiV1TrackingConversionTypesPut(apiV1TrackingConversionTypesPutRequest)

Name conversion-type slots and set the click-id dedup opt-outs.

Same handler as the panel\&#39;s Tracking page. Send either &#x60;types: [{id, name}]&#x60; or &#x60;conv_type_0&#x60;..&#x60;conv_type_25&#x60; keys to name slots (an empty name clears the slot; HTML tags are stripped), and/or &#x60;skip_dedup: [slot ids]&#x60; to replace the set of slots excluded from click-id deduplication (an empty array clears it). Slots outside 0–25 are ignored. Fields you don\&#39;t send are left alone. Unknown keys are a 422 for API callers. The first save creates the account\&#39;s row with the defaults Sign ups (0), Conversions (1), Refunds (25). 

### Example

```ts
import {
  Configuration,
  TrackingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackingConversionTypesPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackingApi(config);

  const body = {
    // ApiV1TrackingConversionTypesPutRequest
    apiV1TrackingConversionTypesPutRequest: {"types":[{"id":2,"name":"Deposit"},{"id":3,"name":"Rebill"}],"skip_dedup":[3]},
  } satisfies ApiV1TrackingConversionTypesPutOperationRequest;

  try {
    const data = await api.apiV1TrackingConversionTypesPut(body);
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
| **apiV1TrackingConversionTypesPutRequest** | [ApiV1TrackingConversionTypesPutRequest](ApiV1TrackingConversionTypesPutRequest.md) |  | |

### Return type

[**ApiV1TrackingConversionTypesPut200Response**](ApiV1TrackingConversionTypesPut200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Saved |  -  |
| **400** | No conversion types provided (&#x60;no_fields&#x60;). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Unknown field. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackingPixelsGet

> ApiV1TrackingPixelsGet200Response apiV1TrackingPixelsGet(conversionTypeId, name, page, perPage)

Deprecated: List the caller\&#39;s conversion-tracking pixels.

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

Deprecated: Delete a pixel.

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

Deprecated: Get one pixel.

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

Deprecated: Update a pixel\&#39;s name or conversion type.

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

Deprecated: Create a new tracking pixel.

Deprecated — the row is stored but nothing reads it. &#x60;pixel_code&#x60; is generated server-side (32 random hex chars) and returned in the response; putting it in a conversion URL has no effect. To track conversions, name a slot with PUT /api/v1/tracking/conversion-types and send postbacks with the click id and that slot. 

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

