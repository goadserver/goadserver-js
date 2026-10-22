# PushCampaignsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherPushCampaignsGet**](PushCampaignsApi.md#apiv1publisherpushcampaignsget) | **GET** /api/v1/publisher/push-campaigns | List the caller\&#39;s push campaigns. |
| [**apiV1PublisherPushCampaignsIdDelete**](PushCampaignsApi.md#apiv1publisherpushcampaignsiddelete) | **DELETE** /api/v1/publisher/push-campaigns/{id} | Delete a push campaign. |
| [**apiV1PublisherPushCampaignsIdPut**](PushCampaignsApi.md#apiv1publisherpushcampaignsidput) | **PUT** /api/v1/publisher/push-campaigns/{id} | Update a push campaign\&#39;s notification content. |
| [**apiV1PublisherPushCampaignsIdSendPost**](PushCampaignsApi.md#apiv1publisherpushcampaignsidsendpost) | **POST** /api/v1/publisher/push-campaigns/{id}/send | Queue a push campaign for delivery. |
| [**apiV1PublisherPushCampaignsPost**](PushCampaignsApi.md#apiv1publisherpushcampaignspostoperation) | **POST** /api/v1/publisher/push-campaigns | Create a push campaign. |



## apiV1PublisherPushCampaignsGet

> ApiV1PublisherPushCampaignsGet200Response apiV1PublisherPushCampaignsGet()

List the caller\&#39;s push campaigns.

Returns the most recent 200 push campaigns owned by the caller, newest first, with their delivery counts.  Web-push is a publisher capability, so all push endpoints live under &#x60;/api/v1/publisher/push-*&#x60;. The former &#x60;/api/v1/tracker/push-*&#x60; paths remain mounted as **deprecated aliases** (same handlers, same scopes) for back-compat — prefer the &#x60;publisher&#x60; prefix in new integrations. 

### Example

```ts
import {
  Configuration,
  PushCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushCampaignsApi(config);

  try {
    const data = await api.apiV1PublisherPushCampaignsGet();
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

[**ApiV1PublisherPushCampaignsGet200Response**](ApiV1PublisherPushCampaignsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Campaign list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushCampaignsIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1PublisherPushCampaignsIdDelete(id)

Delete a push campaign.

Deletes the campaign. A campaign currently &#x60;sending&#x60; cannot be deleted (it would vanish under the sender) and returns 404. 

### Example

```ts
import {
  Configuration,
  PushCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushCampaignsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushCampaignsApi(config);

  const body = {
    // number | Campaign ID.
    id: 56,
  } satisfies ApiV1PublisherPushCampaignsIdDeleteRequest;

  try {
    const data = await api.apiV1PublisherPushCampaignsIdDelete(body);
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
| **id** | `number` | Campaign ID. | [Defaults to `undefined`] |

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
| **200** | Deleted |  -  |
| **404** | Campaign not found, or it is currently sending. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushCampaignsIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1PublisherPushCampaignsIdPut(id, apiV1PublisherPushCampaignsPostRequest)

Update a push campaign\&#39;s notification content.

Replaces the notification fields. Counters, status, audience and timestamps belong to the sender and are not writable here. Only a campaign at rest (&#x60;draft&#x60;, &#x60;sent&#x60;, &#x60;failed&#x60;) is editable — one that is &#x60;queued&#x60; or &#x60;sending&#x60; returns 409. 

### Example

```ts
import {
  Configuration,
  PushCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushCampaignsIdPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushCampaignsApi(config);

  const body = {
    // number | Campaign ID.
    id: 56,
    // ApiV1PublisherPushCampaignsPostRequest
    apiV1PublisherPushCampaignsPostRequest: ...,
  } satisfies ApiV1PublisherPushCampaignsIdPutRequest;

  try {
    const data = await api.apiV1PublisherPushCampaignsIdPut(body);
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
| **id** | `number` | Campaign ID. | [Defaults to `undefined`] |
| **apiV1PublisherPushCampaignsPostRequest** | [ApiV1PublisherPushCampaignsPostRequest](ApiV1PublisherPushCampaignsPostRequest.md) |  | |

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
| **200** | Updated |  -  |
| **400** | Validation error — invalid_id, title_required. |  -  |
| **409** | not_editable — campaign not found, or currently queued / sending. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushCampaignsIdSendPost

> ApiV1PublisherPushCampaignsIdSendPost200Response apiV1PublisherPushCampaignsIdSendPost(id)

Queue a push campaign for delivery.

Flips the campaign to &#x60;queued&#x60;; the push sender picks it up within ~60s and delivers it to every active web-push subscriber of the network. Only campaigns at rest (&#x60;draft&#x60;, &#x60;sent&#x60;, &#x60;failed&#x60;) can be queued — a campaign already &#x60;queued&#x60; or &#x60;sending&#x60; returns 409. 

### Example

```ts
import {
  Configuration,
  PushCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushCampaignsIdSendPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushCampaignsApi(config);

  const body = {
    // number | Campaign ID.
    id: 56,
  } satisfies ApiV1PublisherPushCampaignsIdSendPostRequest;

  try {
    const data = await api.apiV1PublisherPushCampaignsIdSendPost(body);
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
| **id** | `number` | Campaign ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherPushCampaignsIdSendPost200Response**](ApiV1PublisherPushCampaignsIdSendPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Queued |  -  |
| **409** | Not sendable — campaign not found, or already queued / sending. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushCampaignsPost

> ApiV1PublisherPushCampaignsPost200Response apiV1PublisherPushCampaignsPost(apiV1PublisherPushCampaignsPostRequest)

Create a push campaign.

Creates the campaign in &#x60;draft&#x60; status — it is not delivered until you queue it with &#x60;POST /api/v1/publisher/push-campaigns/{id}/send&#x60;. Only &#x60;title&#x60; is required. 

### Example

```ts
import {
  Configuration,
  PushCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushCampaignsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushCampaignsApi(config);

  const body = {
    // ApiV1PublisherPushCampaignsPostRequest
    apiV1PublisherPushCampaignsPostRequest: ...,
  } satisfies ApiV1PublisherPushCampaignsPostOperationRequest;

  try {
    const data = await api.apiV1PublisherPushCampaignsPost(body);
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
| **apiV1PublisherPushCampaignsPostRequest** | [ApiV1PublisherPushCampaignsPostRequest](ApiV1PublisherPushCampaignsPostRequest.md) |  | |

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
| **200** | Created — returns the new campaign id. |  -  |
| **400** | Validation error — title_required. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

