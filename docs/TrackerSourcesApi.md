# TrackerSourcesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerCostDriversGet**](TrackerSourcesApi.md#apiv1trackercostdriversget) | **GET** /api/v1/tracker/cost-drivers | List available cost drivers. |
| [**apiV1TrackerSourceAccountsGet**](TrackerSourcesApi.md#apiv1trackersourceaccountsget) | **GET** /api/v1/tracker/source-accounts | List connected ad accounts. |
| [**apiV1TrackerSourceAccountsIdCampaignsGet**](TrackerSourcesApi.md#apiv1trackersourceaccountsidcampaignsget) | **GET** /api/v1/tracker/source-accounts/{id}/campaigns | Campaigns visible in a connected ad account. |
| [**apiV1TrackerSourceAccountsIdDelete**](TrackerSourcesApi.md#apiv1trackersourceaccountsiddelete) | **DELETE** /api/v1/tracker/source-accounts/{id} | Disconnect an ad account. |
| [**apiV1TrackerSourceAccountsIdGet**](TrackerSourcesApi.md#apiv1trackersourceaccountsidget) | **GET** /api/v1/tracker/source-accounts/{id} | Get one connected ad account. |
| [**apiV1TrackerSourceAccountsIdPut**](TrackerSourcesApi.md#apiv1trackersourceaccountsidputoperation) | **PUT** /api/v1/tracker/source-accounts/{id} | Update a connected ad account. |
| [**apiV1TrackerSourceAccountsIdSyncPost**](TrackerSourcesApi.md#apiv1trackersourceaccountsidsyncpost) | **POST** /api/v1/tracker/source-accounts/{id}/sync | Pull spend from a connected ad account now. |
| [**apiV1TrackerSourceAccountsPost**](TrackerSourcesApi.md#apiv1trackersourceaccountspostoperation) | **POST** /api/v1/tracker/source-accounts | Connect an ad account. |
| [**apiV1TrackerSourcesGet**](TrackerSourcesApi.md#apiv1trackersourcesget) | **GET** /api/v1/tracker/sources | List traffic sources. |
| [**apiV1TrackerSourcesIdDelete**](TrackerSourcesApi.md#apiv1trackersourcesiddelete) | **DELETE** /api/v1/tracker/sources/{id} | Delete a traffic source. |
| [**apiV1TrackerSourcesIdPut**](TrackerSourcesApi.md#apiv1trackersourcesidputoperation) | **PUT** /api/v1/tracker/sources/{id} | Update a traffic source. |
| [**apiV1TrackerSourcesPost**](TrackerSourcesApi.md#apiv1trackersourcespostoperation) | **POST** /api/v1/tracker/sources | Create a traffic source. |
| [**apiV1TrackerSourcesSiteidCampaignsGet**](TrackerSourcesApi.md#apiv1trackersourcessiteidcampaignsget) | **GET** /api/v1/tracker/sources/{siteid}/campaigns | Campaigns reported by a source\&#39;s connected ad account. |



## apiV1TrackerCostDriversGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerCostDriversGet()

List available cost drivers.

The traffic-source APIs this build can pull spend from, and which are actually implemented — the valid values for &#x60;driver&#x60; above. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerCostDriversGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  try {
    const data = await api.apiV1TrackerCostDriversGet();
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


## apiV1TrackerSourceAccountsGet

> ApiV1TrackerSourceAccountsGet200Response apiV1TrackerSourceAccountsGet()

List connected ad accounts.

The credentialed ad accounts a scheduler pulls spend from, each with the outcome of its last sync. Credentials are never returned. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  try {
    const data = await api.apiV1TrackerSourceAccountsGet();
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

[**ApiV1TrackerSourceAccountsGet200Response**](ApiV1TrackerSourceAccountsGet200Response.md)

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


## apiV1TrackerSourceAccountsIdCampaignsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerSourceAccountsIdCampaignsGet(id)

Campaigns visible in a connected ad account.

Used to bind a tracking link to a campaign on the buying side. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsIdCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source account ID.
    id: 56,
  } satisfies ApiV1TrackerSourceAccountsIdCampaignsGetRequest;

  try {
    const data = await api.apiV1TrackerSourceAccountsIdCampaignsGet(body);
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
| **id** | `number` | Source account ID. | [Defaults to `undefined`] |

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


## apiV1TrackerSourceAccountsIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerSourceAccountsIdDelete(id)

Disconnect an ad account.

Stops the spend pull. Already-imported cost stays. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source account ID.
    id: 56,
  } satisfies ApiV1TrackerSourceAccountsIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerSourceAccountsIdDelete(body);
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
| **id** | `number` | Source account ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherPushCampaignsIdDelete200Response**](ApiV1PublisherPushCampaignsIdDelete200Response.md)

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


## apiV1TrackerSourceAccountsIdGet

> ApiV1TrackerSourceAccountsIdGet200Response apiV1TrackerSourceAccountsIdGet(id)

Get one connected ad account.

Credentials are omitted. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source account ID.
    id: 56,
  } satisfies ApiV1TrackerSourceAccountsIdGetRequest;

  try {
    const data = await api.apiV1TrackerSourceAccountsIdGet(body);
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
| **id** | `number` | Source account ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerSourceAccountsIdGet200Response**](ApiV1TrackerSourceAccountsIdGet200Response.md)

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


## apiV1TrackerSourceAccountsIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerSourceAccountsIdPut(id, apiV1TrackerSourceAccountsIdPutRequest)

Update a connected ad account.

Omit &#x60;credentials&#x60; to leave the stored secrets untouched. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source account ID.
    id: 56,
    // ApiV1TrackerSourceAccountsIdPutRequest
    apiV1TrackerSourceAccountsIdPutRequest: ...,
  } satisfies ApiV1TrackerSourceAccountsIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerSourceAccountsIdPut(body);
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
| **id** | `number` | Source account ID. | [Defaults to `undefined`] |
| **apiV1TrackerSourceAccountsIdPutRequest** | [ApiV1TrackerSourceAccountsIdPutRequest](ApiV1TrackerSourceAccountsIdPutRequest.md) |  | |

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


## apiV1TrackerSourceAccountsIdSyncPost

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerSourceAccountsIdSyncPost(id)

Pull spend from a connected ad account now.

Runs the driver immediately instead of waiting for the daily schedule. Returns what the run imported, or the driver\&#39;s error. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsIdSyncPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source account ID.
    id: 56,
  } satisfies ApiV1TrackerSourceAccountsIdSyncPostRequest;

  try {
    const data = await api.apiV1TrackerSourceAccountsIdSyncPost(body);
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
| **id** | `number` | Source account ID. | [Defaults to `undefined`] |

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


## apiV1TrackerSourceAccountsPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerSourceAccountsPost(apiV1TrackerSourceAccountsPostRequest)

Connect an ad account.

&#x60;driver&#x60; names the traffic source\&#39;s API (see /cost-drivers). &#x60;credentials&#x60; is encrypted at rest and never read back. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourceAccountsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // ApiV1TrackerSourceAccountsPostRequest
    apiV1TrackerSourceAccountsPostRequest: ...,
  } satisfies ApiV1TrackerSourceAccountsPostOperationRequest;

  try {
    const data = await api.apiV1TrackerSourceAccountsPost(body);
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
| **apiV1TrackerSourceAccountsPostRequest** | [ApiV1TrackerSourceAccountsPostRequest](ApiV1TrackerSourceAccountsPostRequest.md) |  | |

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


## apiV1TrackerSourcesGet

> ApiV1TrackerSourcesGet200Response apiV1TrackerSourcesGet()

List traffic sources.

One row per traffic origin (an ad account, a network). A source carries the macro template its click URLs are built from and its own outbound postback configuration, and is the unit member access is delegated by. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourcesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  try {
    const data = await api.apiV1TrackerSourcesGet();
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

[**ApiV1TrackerSourcesGet200Response**](ApiV1TrackerSourcesGet200Response.md)

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


## apiV1TrackerSourcesIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerSourcesIdDelete(id)

Delete a traffic source.

Refused while live tracking links still hang off the source — they would orphan. Delete or move the links first. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourcesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source ID.
    id: 56,
  } satisfies ApiV1TrackerSourcesIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerSourcesIdDelete(body);
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
| **id** | `number` | Source ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherPushCampaignsIdDelete200Response**](ApiV1PublisherPushCampaignsIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **409** | Source still has live tracking links. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerSourcesIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerSourcesIdPut(id, apiV1TrackerSourcesIdPutRequest)

Update a traffic source.

Partial update. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourcesIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source ID.
    id: 56,
    // ApiV1TrackerSourcesIdPutRequest
    apiV1TrackerSourcesIdPutRequest: ...,
  } satisfies ApiV1TrackerSourcesIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerSourcesIdPut(body);
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
| **id** | `number` | Source ID. | [Defaults to `undefined`] |
| **apiV1TrackerSourcesIdPutRequest** | [ApiV1TrackerSourcesIdPutRequest](ApiV1TrackerSourcesIdPutRequest.md) |  | |

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


## apiV1TrackerSourcesPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerSourcesPost(apiV1TrackerSourcesPostRequest)

Create a traffic source.

&#x60;template_slug&#x60; picks the macro set (see /source-templates); it decides which placeholders the generated click URLs carry. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourcesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // ApiV1TrackerSourcesPostRequest
    apiV1TrackerSourcesPostRequest: ...,
  } satisfies ApiV1TrackerSourcesPostOperationRequest;

  try {
    const data = await api.apiV1TrackerSourcesPost(body);
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
| **apiV1TrackerSourcesPostRequest** | [ApiV1TrackerSourcesPostRequest](ApiV1TrackerSourcesPostRequest.md) |  | |

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


## apiV1TrackerSourcesSiteidCampaignsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerSourcesSiteidCampaignsGet(siteid)

Campaigns reported by a source\&#39;s connected ad account.

What the buying side calls its campaigns, for binding tracking links to. 

### Example

```ts
import {
  Configuration,
  TrackerSourcesApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerSourcesSiteidCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerSourcesApi(config);

  const body = {
    // number | Source ID.
    siteid: 56,
  } satisfies ApiV1TrackerSourcesSiteidCampaignsGetRequest;

  try {
    const data = await api.apiV1TrackerSourcesSiteidCampaignsGet(body);
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
| **siteid** | `number` | Source ID. | [Defaults to `undefined`] |

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

