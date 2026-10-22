# PushAudienceApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherPushDeliveryRulesGet**](PushAudienceApi.md#apiv1publisherpushdeliveryrulesget) | **GET** /api/v1/publisher/push-delivery-rules | List standing delivery rules. |
| [**apiV1PublisherPushDeliveryRulesIdDelete**](PushAudienceApi.md#apiv1publisherpushdeliveryrulesiddelete) | **DELETE** /api/v1/publisher/push-delivery-rules/{id} | Delete a delivery rule. |
| [**apiV1PublisherPushDeliveryRulesIdPut**](PushAudienceApi.md#apiv1publisherpushdeliveryrulesidputoperation) | **PUT** /api/v1/publisher/push-delivery-rules/{id} | Update a delivery rule. |
| [**apiV1PublisherPushDeliveryRulesPost**](PushAudienceApi.md#apiv1publisherpushdeliveryrulespostoperation) | **POST** /api/v1/publisher/push-delivery-rules | Create a delivery rule. |
| [**apiV1PublisherPushSegmentsGet**](PushAudienceApi.md#apiv1publisherpushsegmentsget) | **GET** /api/v1/publisher/push-segments | List saved audience segments. |
| [**apiV1PublisherPushSegmentsIdDelete**](PushAudienceApi.md#apiv1publisherpushsegmentsiddelete) | **DELETE** /api/v1/publisher/push-segments/{id} | Delete an audience segment. |
| [**apiV1PublisherPushSegmentsIdPut**](PushAudienceApi.md#apiv1publisherpushsegmentsidputoperation) | **PUT** /api/v1/publisher/push-segments/{id} | Update an audience segment. |
| [**apiV1PublisherPushSegmentsPost**](PushAudienceApi.md#apiv1publisherpushsegmentspostoperation) | **POST** /api/v1/publisher/push-segments | Create an audience segment. |
| [**apiV1PublisherPushSetupGet**](PushAudienceApi.md#apiv1publisherpushsetupget) | **GET** /api/v1/publisher/push-setup | Collector setup facts for the opt-in script. |
| [**apiV1PublisherPushStatsGet**](PushAudienceApi.md#apiv1publisherpushstatsget) | **GET** /api/v1/publisher/push-stats | Push delivery performance. |
| [**apiV1PublisherPushSubscribersActionPost**](PushAudienceApi.md#apiv1publisherpushsubscribersactionpostoperation) | **POST** /api/v1/publisher/push-subscribers/action | Activate, deactivate or delete subscribers in bulk. |
| [**apiV1PublisherPushSubscribersGet**](PushAudienceApi.md#apiv1publisherpushsubscribersget) | **GET** /api/v1/publisher/push-subscribers | List captured push subscribers. |



## apiV1PublisherPushDeliveryRulesGet

> ApiV1PublisherPushDeliveryRulesGet200Response apiV1PublisherPushDeliveryRulesGet()

List standing delivery rules.

Returns up to 200 rules, newest first, each with the outcome of its last run (sent / failed / no-ad counts). 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushDeliveryRulesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  try {
    const data = await api.apiV1PublisherPushDeliveryRulesGet();
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

[**ApiV1PublisherPushDeliveryRulesGet200Response**](ApiV1PublisherPushDeliveryRulesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rule list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushDeliveryRulesIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1PublisherPushDeliveryRulesIdDelete(id)

Delete a delivery rule.

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushDeliveryRulesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
  } satisfies ApiV1PublisherPushDeliveryRulesIdDeleteRequest;

  try {
    const data = await api.apiV1PublisherPushDeliveryRulesIdDelete(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |

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
| **404** | Delivery rule not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushDeliveryRulesIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1PublisherPushDeliveryRulesIdPut(id, apiV1PublisherPushDeliveryRulesIdPutRequest)

Update a delivery rule.

Full replace, including &#x60;is_active&#x60; — this is also how a rule is paused and resumed. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushDeliveryRulesIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
    // ApiV1PublisherPushDeliveryRulesIdPutRequest
    apiV1PublisherPushDeliveryRulesIdPutRequest: ...,
  } satisfies ApiV1PublisherPushDeliveryRulesIdPutOperationRequest;

  try {
    const data = await api.apiV1PublisherPushDeliveryRulesIdPut(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |
| **apiV1PublisherPushDeliveryRulesIdPutRequest** | [ApiV1PublisherPushDeliveryRulesIdPutRequest](ApiV1PublisherPushDeliveryRulesIdPutRequest.md) |  | |

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
| **400** | invalid_id, name_required, or invalid_segment. |  -  |
| **404** | Delivery rule not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushDeliveryRulesPost

> ApiV1PublisherPushCampaignsPost200Response apiV1PublisherPushDeliveryRulesPost(apiV1PublisherPushDeliveryRulesPostRequest)

Create a delivery rule.

&#x60;segment_id&#x60; must be a segment you own, or 0 for the whole active audience. &#x60;cadence_hours&#x60; below 1 is rejected into the 24h default; the other numeric knobs clamp to &gt;&#x3D; 0. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushDeliveryRulesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // ApiV1PublisherPushDeliveryRulesPostRequest
    apiV1PublisherPushDeliveryRulesPostRequest: ...,
  } satisfies ApiV1PublisherPushDeliveryRulesPostOperationRequest;

  try {
    const data = await api.apiV1PublisherPushDeliveryRulesPost(body);
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
| **apiV1PublisherPushDeliveryRulesPostRequest** | [ApiV1PublisherPushDeliveryRulesPostRequest](ApiV1PublisherPushDeliveryRulesPostRequest.md) |  | |

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
| **200** | Created — returns the new rule id. |  -  |
| **400** | name_required, or invalid_segment (segment not yours). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSegmentsGet

> ApiV1PublisherPushSegmentsGet200Response apiV1PublisherPushSegmentsGet()

List saved audience segments.

Returns up to 200 segments, newest first. Each carries &#x60;subscriber_count&#x60; — how many of the caller\&#39;s subscribers match the segment right now, counted live. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSegmentsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  try {
    const data = await api.apiV1PublisherPushSegmentsGet();
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

[**ApiV1PublisherPushSegmentsGet200Response**](ApiV1PublisherPushSegmentsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Segment list |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSegmentsIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1PublisherPushSegmentsIdDelete(id)

Delete an audience segment.

Deletes the segment. Delivery rules that referenced it keep running against the whole active audience. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSegmentsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // number | Segment ID.
    id: 56,
  } satisfies ApiV1PublisherPushSegmentsIdDeleteRequest;

  try {
    const data = await api.apiV1PublisherPushSegmentsIdDelete(body);
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
| **id** | `number` | Segment ID. | [Defaults to `undefined`] |

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
| **404** | Segment not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSegmentsIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1PublisherPushSegmentsIdPut(id, apiV1PublisherPushSegmentsIdPutRequest)

Update an audience segment.

Full replace — every omitted criterion resets to its zero value. Saving identical values is a no-op, not a 404. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSegmentsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // number | Segment ID.
    id: 56,
    // ApiV1PublisherPushSegmentsIdPutRequest
    apiV1PublisherPushSegmentsIdPutRequest: ...,
  } satisfies ApiV1PublisherPushSegmentsIdPutOperationRequest;

  try {
    const data = await api.apiV1PublisherPushSegmentsIdPut(body);
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
| **id** | `number` | Segment ID. | [Defaults to `undefined`] |
| **apiV1PublisherPushSegmentsIdPutRequest** | [ApiV1PublisherPushSegmentsIdPutRequest](ApiV1PublisherPushSegmentsIdPutRequest.md) |  | |

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
| **400** | invalid_id, or name_required. |  -  |
| **404** | Segment not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSegmentsPost

> ApiV1PublisherPushCampaignsPost200Response apiV1PublisherPushSegmentsPost(apiV1PublisherPushSegmentsPostRequest)

Create an audience segment.

Every criterion is optional and they AND together — a segment with no criteria set matches the whole audience. Only &#x60;name&#x60; is required. Numeric criteria are clamped to &gt;&#x3D; 0. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSegmentsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // ApiV1PublisherPushSegmentsPostRequest
    apiV1PublisherPushSegmentsPostRequest: ...,
  } satisfies ApiV1PublisherPushSegmentsPostOperationRequest;

  try {
    const data = await api.apiV1PublisherPushSegmentsPost(body);
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
| **apiV1PublisherPushSegmentsPostRequest** | [ApiV1PublisherPushSegmentsPostRequest](ApiV1PublisherPushSegmentsPostRequest.md) |  | |

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
| **200** | Created — returns the new segment id. |  -  |
| **400** | name_required. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSetupGet

> ApiV1PublisherPushSetupGet200Response apiV1PublisherPushSetupGet()

Collector setup facts for the opt-in script.

Everything needed to wire the web-push opt-in collector onto a landing page: the ad host the collector and service worker are served from, the service-worker path this network expects, and every pushads adzone you own with its ad domain, captured subscriber count and most recent opt-in. Read-only — nothing is generated or registered by calling it. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSetupGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  try {
    const data = await api.apiV1PublisherPushSetupGet();
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

[**ApiV1PublisherPushSetupGet200Response**](ApiV1PublisherPushSetupGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Setup facts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushStatsGet

> ApiV1PublisherPushStatsGet200Response apiV1PublisherPushStatsGet(days)

Push delivery performance.

Delivery, clicks and revenue for auctioned pushes served on the caller\&#39;s pushads adzones, paired with subscriber growth over the same window. Revenue is in the account currency. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // number | Trailing window in days. Default 30, capped at 365. (optional)
    days: 56,
  } satisfies ApiV1PublisherPushStatsGetRequest;

  try {
    const data = await api.apiV1PublisherPushStatsGet(body);
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
| **days** | `number` | Trailing window in days. Default 30, capped at 365. | [Optional] [Defaults to `30`] |

### Return type

[**ApiV1PublisherPushStatsGet200Response**](ApiV1PublisherPushStatsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Summary + daily series |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSubscribersActionPost

> ApiV1PublisherPushSubscribersActionPost200Response apiV1PublisherPushSubscribersActionPost(apiV1PublisherPushSubscribersActionPostRequest)

Activate, deactivate or delete subscribers in bulk.

One action over up to 5000 subscriber ids. Ids that are not the caller\&#39;s are silently skipped — &#x60;affected&#x60; reports how many rows actually changed. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSubscribersActionPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // ApiV1PublisherPushSubscribersActionPostRequest
    apiV1PublisherPushSubscribersActionPostRequest: ...,
  } satisfies ApiV1PublisherPushSubscribersActionPostOperationRequest;

  try {
    const data = await api.apiV1PublisherPushSubscribersActionPost(body);
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
| **apiV1PublisherPushSubscribersActionPostRequest** | [ApiV1PublisherPushSubscribersActionPostRequest](ApiV1PublisherPushSubscribersActionPostRequest.md) |  | |

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
| **200** | Applied |  -  |
| **400** | no_ids, too_many (&gt;5000), or invalid_action. |  -  |
| **403** | The key\&#39;s member scope does not reach these subscribers. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherPushSubscribersGet

> ApiV1PublisherPushSubscribersGet200Response apiV1PublisherPushSubscribersGet(days)

List captured push subscribers.

The caller\&#39;s opt-ins within the trailing window, newest first, capped at 1000 rows — alongside lifetime totals so you can size the audience without paging. Subscriber IPs are masked to a /24 (IPv4) or /48 (IPv6) prefix on the way out. 

### Example

```ts
import {
  Configuration,
  PushAudienceApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherPushSubscribersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PushAudienceApi(config);

  const body = {
    // number | Trailing window in days. Default 30, capped at 365. (optional)
    days: 56,
  } satisfies ApiV1PublisherPushSubscribersGetRequest;

  try {
    const data = await api.apiV1PublisherPushSubscribersGet(body);
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
| **days** | `number` | Trailing window in days. Default 30, capped at 365. | [Optional] [Defaults to `30`] |

### Return type

[**ApiV1PublisherPushSubscribersGet200Response**](ApiV1PublisherPushSubscribersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Subscriber list + audience totals |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

