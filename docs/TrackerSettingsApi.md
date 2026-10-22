# TrackerSettingsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerCountriesGet**](TrackerSettingsApi.md#apiv1trackercountriesget) | **GET** /api/v1/tracker/countries | List countries seen in the caller\&#39;s traffic. |
| [**apiV1TrackerCustomParamsGet**](TrackerSettingsApi.md#apiv1trackercustomparamsget) | **GET** /api/v1/tracker/custom-params | Get the custom-parameter slots. |
| [**apiV1TrackerCustomParamsPut**](TrackerSettingsApi.md#apiv1trackercustomparamsputoperation) | **PUT** /api/v1/tracker/custom-params | Name the custom-parameter slots. |
| [**apiV1TrackerSettingsGet**](TrackerSettingsApi.md#apiv1trackersettingsget) | **GET** /api/v1/tracker/settings | Tracker settings for this account. |
| [**apiV1TrackerSourceTemplatesGet**](TrackerSettingsApi.md#apiv1trackersourcetemplatesget) | **GET** /api/v1/tracker/source-templates | List traffic-source templates. |
| [**apiV1TrackerTokensGet**](TrackerSettingsApi.md#apiv1trackertokensget) | **GET** /api/v1/tracker/tokens | List the macro tokens. |



## apiV1TrackerCountriesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerCountriesGet()

List countries seen in the caller\&#39;s traffic.

Only the countries this account actually has clicks from, so a filter dropdown built from it has no dead entries. 

### Example

```ts
import {
  Configuration,
  TrackerSettingsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerCountriesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSettingsApi(config);

  try {
    const data = await api.apiV1TrackerCountriesGet();
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


## apiV1TrackerCustomParamsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerCustomParamsGet()

Get the custom-parameter slots.

All 11 passthrough slots (subid plus sid1–sid10), named or not. These are the names that appear as &#x60;sid1&#x60;–&#x60;sid5&#x60; dimensions on the stats endpoints. 

### Example

```ts
import {
  Configuration,
  TrackerSettingsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerCustomParamsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSettingsApi(config);

  try {
    const data = await api.apiV1TrackerCustomParamsGet();
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


## apiV1TrackerCustomParamsPut

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerCustomParamsPut(apiV1TrackerCustomParamsPutRequest)

Name the custom-parameter slots.

Bulk upsert of the whole grid — send every slot you want to keep. 

### Example

```ts
import {
  Configuration,
  TrackerSettingsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerCustomParamsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSettingsApi(config);

  const body = {
    // ApiV1TrackerCustomParamsPutRequest
    apiV1TrackerCustomParamsPutRequest: ...,
  } satisfies ApiV1TrackerCustomParamsPutOperationRequest;

  try {
    const data = await api.apiV1TrackerCustomParamsPut(body);
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
| **apiV1TrackerCustomParamsPutRequest** | [ApiV1TrackerCustomParamsPutRequest](ApiV1TrackerCustomParamsPutRequest.md) |  | |

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


## apiV1TrackerSettingsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerSettingsGet()

Tracker settings for this account.

The tracker-relevant slice of tenant configuration — which sub-modules are live and what the click pipeline expects. 

### Example

```ts
import {
  Configuration,
  TrackerSettingsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSettingsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSettingsApi(config);

  try {
    const data = await api.apiV1TrackerSettingsGet();
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


## apiV1TrackerSourceTemplatesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerSourceTemplatesGet()

List traffic-source templates.

The macro presets a source can be built from — the valid &#x60;template_slug&#x60; values. 

### Example

```ts
import {
  Configuration,
  TrackerSettingsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceTemplatesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSettingsApi(config);

  try {
    const data = await api.apiV1TrackerSourceTemplatesGet();
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


## apiV1TrackerTokensGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerTokensGet()

List the macro tokens.

The placeholder registry a click URL can carry — &#x60;{clickid}&#x60;, &#x60;{country}&#x60;, &#x60;{source_id}&#x60; and the rest. The valid values for a link\&#39;s &#x60;tokens&#x60;. 

### Example

```ts
import {
  Configuration,
  TrackerSettingsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTokensGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSettingsApi(config);

  try {
    const data = await api.apiV1TrackerTokensGet();
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

