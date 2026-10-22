# TrackerOffersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerOffersBulkPost**](TrackerOffersApi.md#apiv1trackeroffersbulkpostoperation) | **POST** /api/v1/tracker/offers/bulk | Pause, activate or delete many offers. |
| [**apiV1TrackerOffersGet**](TrackerOffersApi.md#apiv1trackeroffersget) | **GET** /api/v1/tracker/offers | List tracker offers. |
| [**apiV1TrackerOffersIdDelete**](TrackerOffersApi.md#apiv1trackeroffersiddelete) | **DELETE** /api/v1/tracker/offers/{id} | Delete an offer. |
| [**apiV1TrackerOffersIdGet**](TrackerOffersApi.md#apiv1trackeroffersidget) | **GET** /api/v1/tracker/offers/{id} | Get one offer. |
| [**apiV1TrackerOffersIdPut**](TrackerOffersApi.md#apiv1trackeroffersidputoperation) | **PUT** /api/v1/tracker/offers/{id} | Update an offer. |
| [**apiV1TrackerOffersIdUrlsPost**](TrackerOffersApi.md#apiv1trackeroffersidurlspostoperation) | **POST** /api/v1/tracker/offers/{id}/urls | Add a landing URL to an offer. |
| [**apiV1TrackerOffersIdUrlsUrlIdDelete**](TrackerOffersApi.md#apiv1trackeroffersidurlsurliddelete) | **DELETE** /api/v1/tracker/offers/{id}/urls/{urlId} | Delete one landing URL. |
| [**apiV1TrackerOffersIdUrlsUrlIdPut**](TrackerOffersApi.md#apiv1trackeroffersidurlsurlidputoperation) | **PUT** /api/v1/tracker/offers/{id}/urls/{urlId} | Update one landing URL. |
| [**apiV1TrackerOffersPost**](TrackerOffersApi.md#apiv1trackerofferspostoperation) | **POST** /api/v1/tracker/offers | Create an offer. |



## apiV1TrackerOffersBulkPost

> ApiV1PublisherPushSubscribersActionPost200Response apiV1TrackerOffersBulkPost(apiV1TrackerOffersBulkPostRequest)

Pause, activate or delete many offers.

One action across a list of offer ids the caller owns. Ids that are not the caller\&#39;s are skipped rather than failing the batch. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersBulkPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // ApiV1TrackerOffersBulkPostRequest
    apiV1TrackerOffersBulkPostRequest: ...,
  } satisfies ApiV1TrackerOffersBulkPostOperationRequest;

  try {
    const data = await api.apiV1TrackerOffersBulkPost(body);
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
| **apiV1TrackerOffersBulkPostRequest** | [ApiV1TrackerOffersBulkPostRequest](ApiV1TrackerOffersBulkPostRequest.md) |  | |

### Return type

[**ApiV1PublisherPushSubscribersActionPost200Response**](ApiV1PublisherPushSubscribersActionPost200Response.md)

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


## apiV1TrackerOffersGet

> ApiV1TrackerOffersGet200Response apiV1TrackerOffersGet()

List tracker offers.

Every offer the caller owns. An offer is a &#x60;roncampaigns&#x60; row with &#x60;adtypeid&#x3D;21&#x60; — the same row the click pipeline, conversion settlement and stats already key off, so an offer created here is immediately servable through a tracking link. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  try {
    const data = await api.apiV1TrackerOffersGet();
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

[**ApiV1TrackerOffersGet200Response**](ApiV1TrackerOffersGet200Response.md)

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


## apiV1TrackerOffersIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerOffersIdDelete(id)

Delete an offer.

Soft delete (&#x60;isdeleted&#x3D;1&#x60;). Clicks, conversions and stats history stay intact and keep reporting under the offer\&#39;s name. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // number | Offer ID.
    id: 56,
  } satisfies ApiV1TrackerOffersIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerOffersIdDelete(body);
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
| **id** | `number` | Offer ID. | [Defaults to `undefined`] |

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
| **404** | Offer not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerOffersIdGet

> ApiV1TrackerOffersIdGet200Response apiV1TrackerOffersIdGet(id)

Get one offer.

The full offer including its landing URLs and targeting. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // number | Offer ID.
    id: 56,
  } satisfies ApiV1TrackerOffersIdGetRequest;

  try {
    const data = await api.apiV1TrackerOffersIdGet(body);
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
| **id** | `number` | Offer ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerOffersIdGet200Response**](ApiV1TrackerOffersIdGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Offer not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerOffersIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerOffersIdPut(id, apiV1TrackerOffersIdPutRequest)

Update an offer.

Partial update — only the fields present in the body are written, so a caller that knows about one field cannot blank the rest. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // number | Offer ID.
    id: 56,
    // ApiV1TrackerOffersIdPutRequest
    apiV1TrackerOffersIdPutRequest: ...,
  } satisfies ApiV1TrackerOffersIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerOffersIdPut(body);
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
| **id** | `number` | Offer ID. | [Defaults to `undefined`] |
| **apiV1TrackerOffersIdPutRequest** | [ApiV1TrackerOffersIdPutRequest](ApiV1TrackerOffersIdPutRequest.md) |  | |

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
| **404** | Offer not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerOffersIdUrlsPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerOffersIdUrlsPost(id, apiV1TrackerOffersIdUrlsPostRequest)

Add a landing URL to an offer.

Adds one rotator URL without round-tripping the whole offer. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersIdUrlsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // number | Offer ID.
    id: 56,
    // ApiV1TrackerOffersIdUrlsPostRequest
    apiV1TrackerOffersIdUrlsPostRequest: ...,
  } satisfies ApiV1TrackerOffersIdUrlsPostOperationRequest;

  try {
    const data = await api.apiV1TrackerOffersIdUrlsPost(body);
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
| **id** | `number` | Offer ID. | [Defaults to `undefined`] |
| **apiV1TrackerOffersIdUrlsPostRequest** | [ApiV1TrackerOffersIdUrlsPostRequest](ApiV1TrackerOffersIdUrlsPostRequest.md) |  | |

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


## apiV1TrackerOffersIdUrlsUrlIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerOffersIdUrlsUrlIdDelete(id, urlId)

Delete one landing URL.

Soft delete, so the URL\&#39;s click and conversion history survives. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersIdUrlsUrlIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // number | Offer ID.
    id: 56,
    // number | URL row ID.
    urlId: 56,
  } satisfies ApiV1TrackerOffersIdUrlsUrlIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerOffersIdUrlsUrlIdDelete(body);
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
| **id** | `number` | Offer ID. | [Defaults to `undefined`] |
| **urlId** | `number` | URL row ID. | [Defaults to `undefined`] |

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


## apiV1TrackerOffersIdUrlsUrlIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerOffersIdUrlsUrlIdPut(id, urlId, apiV1TrackerOffersIdUrlsUrlIdPutRequest)

Update one landing URL.

Writes only the columns the payload carries, so saving one row cannot clobber fields another editor changed. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersIdUrlsUrlIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // number | Offer ID.
    id: 56,
    // number | URL row ID.
    urlId: 56,
    // ApiV1TrackerOffersIdUrlsUrlIdPutRequest
    apiV1TrackerOffersIdUrlsUrlIdPutRequest: ...,
  } satisfies ApiV1TrackerOffersIdUrlsUrlIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerOffersIdUrlsUrlIdPut(body);
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
| **id** | `number` | Offer ID. | [Defaults to `undefined`] |
| **urlId** | `number` | URL row ID. | [Defaults to `undefined`] |
| **apiV1TrackerOffersIdUrlsUrlIdPutRequest** | [ApiV1TrackerOffersIdUrlsUrlIdPutRequest](ApiV1TrackerOffersIdUrlsUrlIdPutRequest.md) |  | |

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


## apiV1TrackerOffersPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerOffersPost(apiV1TrackerOffersPostRequest)

Create an offer.

Creates the offer and its first landing URL in one call. Give either &#x60;destination_url&#x60; for a single URL or &#x60;urls&#x60; for a weighted rotator. 

### Example

```ts
import {
  Configuration,
  TrackerOffersApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerOffersPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerOffersApi(config);

  const body = {
    // ApiV1TrackerOffersPostRequest
    apiV1TrackerOffersPostRequest: ...,
  } satisfies ApiV1TrackerOffersPostOperationRequest;

  try {
    const data = await api.apiV1TrackerOffersPost(body);
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
| **apiV1TrackerOffersPostRequest** | [ApiV1TrackerOffersPostRequest](ApiV1TrackerOffersPostRequest.md) |  | |

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
| **400** | Validation error — a required field is missing or a targeting id is unknown. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

