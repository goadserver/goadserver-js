# TrackerConversionsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerConversionLoggingGet**](TrackerConversionsApi.md#apiv1trackerconversionloggingget) | **GET** /api/v1/tracker/conversion-logging | Get conversion-logging settings. |
| [**apiV1TrackerConversionLoggingPut**](TrackerConversionsApi.md#apiv1trackerconversionloggingputoperation) | **PUT** /api/v1/tracker/conversion-logging | Change conversion-logging settings. |
| [**apiV1TrackerConversionTypesGet**](TrackerConversionsApi.md#apiv1trackerconversiontypesget) | **GET** /api/v1/tracker/conversion-types | Get the conversion-type labels. |
| [**apiV1TrackerConversionTypesPut**](TrackerConversionsApi.md#apiv1trackerconversiontypesputoperation) | **PUT** /api/v1/tracker/conversion-types | Rename the conversion types. |
| [**apiV1TrackerConversionsClickidPostbacksGet**](TrackerConversionsApi.md#apiv1trackerconversionsclickidpostbacksget) | **GET** /api/v1/tracker/conversions/{clickid}/postbacks | Outbound postbacks fired for one conversion. |
| [**apiV1TrackerConversionsGet**](TrackerConversionsApi.md#apiv1trackerconversionsget) | **GET** /api/v1/tracker/conversions | List incoming conversions. |
| [**apiV1TrackerConversionsIdStatePut**](TrackerConversionsApi.md#apiv1trackerconversionsidstateputoperation) | **PUT** /api/v1/tracker/conversions/{id}/state | Approve or reject one conversion. |
| [**apiV1TrackerConversionsRejectedGet**](TrackerConversionsApi.md#apiv1trackerconversionsrejectedget) | **GET** /api/v1/tracker/conversions/rejected | List refused inbound postbacks. |



## apiV1TrackerConversionLoggingGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerConversionLoggingGet()

Get conversion-logging settings.

Whether incoming conversions are logged, and whether they land pending review rather than settled. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionLoggingGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  try {
    const data = await api.apiV1TrackerConversionLoggingGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionLoggingPut

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerConversionLoggingPut(apiV1TrackerConversionLoggingPutRequest)

Change conversion-logging settings.

Turning &#x60;pend_conversions&#x60; on routes new conversions to the pending queue instead of settling them on arrival. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionLoggingPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  const body = {
    // ApiV1TrackerConversionLoggingPutRequest
    apiV1TrackerConversionLoggingPutRequest: ...,
  } satisfies ApiV1TrackerConversionLoggingPutOperationRequest;

  try {
    const data = await api.apiV1TrackerConversionLoggingPut(body);
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
| **apiV1TrackerConversionLoggingPutRequest** | [ApiV1TrackerConversionLoggingPutRequest](ApiV1TrackerConversionLoggingPutRequest.md) |  | |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionTypesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerConversionTypesGet()

Get the conversion-type labels.

The caller\&#39;s A–Z map — which event each conversion-type letter means. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  try {
    const data = await api.apiV1TrackerConversionTypesGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionTypesPut

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerConversionTypesPut(apiV1TrackerConversionTypesPutRequest)

Rename the conversion types.

Bulk replace of the letter → label map. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionTypesPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  const body = {
    // ApiV1TrackerConversionTypesPutRequest
    apiV1TrackerConversionTypesPutRequest: ...,
  } satisfies ApiV1TrackerConversionTypesPutOperationRequest;

  try {
    const data = await api.apiV1TrackerConversionTypesPut(body);
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
| **apiV1TrackerConversionTypesPutRequest** | [ApiV1TrackerConversionTypesPutRequest](ApiV1TrackerConversionTypesPutRequest.md) |  | |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionsClickidPostbacksGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerConversionsClickidPostbacksGet(clickid, convType)

Outbound postbacks fired for one conversion.

Joined by clickid — what was forwarded upstream, when, and how it answered. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionsClickidPostbacksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  const body = {
    // string | The conversion\'s click id.
    clickid: clickid_example,
    // string | Narrow to one conversion type letter. (optional)
    convType: convType_example,
  } satisfies ApiV1TrackerConversionsClickidPostbacksGetRequest;

  try {
    const data = await api.apiV1TrackerConversionsClickidPostbacksGet(body);
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
| **clickid** | `string` | The conversion\&#39;s click id. | [Defaults to `undefined`] |
| **convType** | `string` | Narrow to one conversion type letter. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionsGet

> ApiV1TrackerConversionsGet200Response apiV1TrackerConversionsGet(startDate, endDate, state, reasonId, search, sortBy, sortDir, limit)

List incoming conversions.

Conversions logged against the caller\&#39;s offers, with the summary counts (clean / on hold / approved / rejected) the settlement view sums. Requires conversion logging to be on — see /conversion-logging. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  const body = {
    // string | Start of the window, YYYY-MM-DD. (optional)
    startDate: startDate_example,
    // string | End of the window, YYYY-MM-DD. (optional)
    endDate: endDate_example,
    // number | Filter by settlement state. (optional)
    state: 56,
    // number | Filter by hold/reject reason. (optional)
    reasonId: 56,
    // string | Match against clickid, offer or link name. (optional)
    search: search_example,
    // string | Column to sort on. (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' | asc or desc. (optional)
    sortDir: sortDir_example,
    // number | Maximum rows to return. (optional)
    limit: 56,
  } satisfies ApiV1TrackerConversionsGetRequest;

  try {
    const data = await api.apiV1TrackerConversionsGet(body);
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
| **startDate** | `string` | Start of the window, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **endDate** | `string` | End of the window, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **state** | `number` | Filter by settlement state. | [Optional] [Defaults to `undefined`] |
| **reasonId** | `number` | Filter by hold/reject reason. | [Optional] [Defaults to `undefined`] |
| **search** | `string` | Match against clickid, offer or link name. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `string` | Column to sort on. | [Optional] [Defaults to `undefined`] |
| **sortDir** | `asc`, `desc` | asc or desc. | [Optional] [Defaults to `undefined`] [Enum: asc, desc] |
| **limit** | `number` | Maximum rows to return. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerConversionsGet200Response**](ApiV1TrackerConversionsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionsIdStatePut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerConversionsIdStatePut(id, apiV1TrackerConversionsIdStatePutRequest)

Approve or reject one conversion.

Settles a pending conversion. This is the one tracker write that moves money-bearing state, which is why it carries its own scope rather than riding on tracker.write. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionsIdStatePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  const body = {
    // number | Conversion ID.
    id: 56,
    // ApiV1TrackerConversionsIdStatePutRequest
    apiV1TrackerConversionsIdStatePutRequest: ...,
  } satisfies ApiV1TrackerConversionsIdStatePutOperationRequest;

  try {
    const data = await api.apiV1TrackerConversionsIdStatePut(body);
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
| **id** | `number` | Conversion ID. | [Defaults to `undefined`] |
| **apiV1TrackerConversionsIdStatePutRequest** | [ApiV1TrackerConversionsIdStatePutRequest](ApiV1TrackerConversionsIdStatePutRequest.md) |  | |

### Return type

[**ApiV1PublisherPushCampaignsPost200Response**](ApiV1PublisherPushCampaignsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerConversionsRejectedGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerConversionsRejectedGet()

List refused inbound postbacks.

The other half of the inbound stream: postbacks that never became a conversion, with the reason each was refused. The first place to look when a partner insists they fired one. 

### Example

```ts
import {
  Configuration,
  TrackerConversionsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerConversionsRejectedGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerConversionsApi(config);

  try {
    const data = await api.apiV1TrackerConversionsRejectedGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

