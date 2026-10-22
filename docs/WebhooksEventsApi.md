# WebhooksEventsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1EventsGet**](WebhooksEventsApi.md#apiv1eventsget) | **GET** /api/v1/events | Read the account\&#39;s event feed. |
| [**apiV1WebhooksGet**](WebhooksEventsApi.md#apiv1webhooksget) | **GET** /api/v1/webhooks | List webhooks. |
| [**apiV1WebhooksIdDelete**](WebhooksEventsApi.md#apiv1webhooksiddelete) | **DELETE** /api/v1/webhooks/{id} | Remove a webhook. |
| [**apiV1WebhooksIdDeliveriesDeliveryRedeliverPost**](WebhooksEventsApi.md#apiv1webhooksiddeliveriesdeliveryredeliverpost) | **POST** /api/v1/webhooks/{id}/deliveries/{delivery}/redeliver | Send a delivery again. |
| [**apiV1WebhooksIdDeliveriesGet**](WebhooksEventsApi.md#apiv1webhooksiddeliveriesget) | **GET** /api/v1/webhooks/{id}/deliveries | List a webhook\&#39;s deliveries. |
| [**apiV1WebhooksIdGet**](WebhooksEventsApi.md#apiv1webhooksidget) | **GET** /api/v1/webhooks/{id} | Get one webhook. |
| [**apiV1WebhooksIdPatch**](WebhooksEventsApi.md#apiv1webhooksidpatchoperation) | **PATCH** /api/v1/webhooks/{id} | Edit, pause or resume a webhook. |
| [**apiV1WebhooksIdRotateSecretPost**](WebhooksEventsApi.md#apiv1webhooksidrotatesecretpostoperation) | **POST** /api/v1/webhooks/{id}/rotate-secret | Issue a new signing secret. |
| [**apiV1WebhooksIdTestPost**](WebhooksEventsApi.md#apiv1webhooksidtestpost) | **POST** /api/v1/webhooks/{id}/test | Send a test ping. |
| [**apiV1WebhooksPost**](WebhooksEventsApi.md#apiv1webhookspostoperation) | **POST** /api/v1/webhooks | Create a webhook. |



## apiV1EventsGet

> ApiV1EventsGet200Response apiV1EventsGet(since, types, limit)

Read the account\&#39;s event feed.

The same events the webhooks carry, for agents that cannot receive webhooks. Oldest first, kept **7 days**. Page with the cursor: pass &#x60;next_cursor&#x60; from one answer as &#x60;since&#x60; in the next; &#x60;has_more&#x60; says whether to call again at once. &#x60;since&#x3D;now&#x60; returns no events, only the current cursor — the way to start following from now.  Only the events this credential may see are returned: each event needs the scope of what it is about (see the tag description), and a key pinned to campaigns, ad spaces or sites only sees events about those (and never the account-wide &#x60;conversion.summary&#x60;). The cursor moves past events you may not see, so a reader never stalls.  Events are recorded only for accounts that have a live API key, a connected app or a webhook. &#x60;conversion.received&#x60; is never in the feed (webhook opt-in only). 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1EventsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // string | Cursor from `next_cursor`, `now`, or omit for the whole 7 days. (optional)
    since: since_example,
    // string | Comma-separated event types to keep, e.g. `campaign.paused,ad.rejected`. (optional)
    types: types_example,
    // number (optional)
    limit: 56,
  } satisfies ApiV1EventsGetRequest;

  try {
    const data = await api.apiV1EventsGet(body);
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
| **since** | `string` | Cursor from &#x60;next_cursor&#x60;, &#x60;now&#x60;, or omit for the whole 7 days. | [Optional] [Defaults to `undefined`] |
| **types** | `string` | Comma-separated event types to keep, e.g. &#x60;campaign.paused,ad.rejected&#x60;. | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `100`] |

### Return type

[**ApiV1EventsGet200Response**](ApiV1EventsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **422** | &#x60;since&#x60; is not a cursor, &#x60;types&#x60; names an unknown event, or &#x60;limit&#x60; is out of range. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksGet

> ApiV1WebhooksGet200Response apiV1WebhooksGet()

List webhooks.

An API key or app sees the webhooks **it** created (the panel shows all of the account\&#39;s). &#x60;available_events&#x60; lists the events this credential may subscribe to; &#x60;limit&#x60; is the per-account cap (20). 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  try {
    const data = await api.apiV1WebhooksGet();
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

[**ApiV1WebhooksGet200Response**](ApiV1WebhooksGet200Response.md)

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


## apiV1WebhooksIdDelete

> ApiV1WebhooksIdDelete200Response apiV1WebhooksIdDelete(id)

Remove a webhook.

Deliveries still waiting for it are dropped and never sent.

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1WebhooksIdDeleteRequest;

  try {
    const data = await api.apiV1WebhooksIdDelete(body);
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

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not one of this credential\&#39;s webhooks. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksIdDeliveriesDeliveryRedeliverPost

> ApiV1WebhooksIdDelete200Response apiV1WebhooksIdDeliveriesDeliveryRedeliverPost(id, delivery)

Send a delivery again.

Delivered, failed or waiting — it is queued again with its original event id. The content comes from the 7-day event feed when the delivery itself no longer holds it (410 after that). 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
    // number
    delivery: 56,
  } satisfies ApiV1WebhooksIdDeliveriesDeliveryRedeliverPostRequest;

  try {
    const data = await api.apiV1WebhooksIdDeliveriesDeliveryRedeliverPost(body);
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
| **delivery** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Queued. |  -  |
| **404** | No such delivery on this webhook. |  -  |
| **409** | It is being sent right now. |  -  |
| **410** | &#x60;delivery_expired&#x60; — older than 7 days. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksIdDeliveriesGet

> ApiV1WebhooksIdDeliveriesGet200Response apiV1WebhooksIdDeliveriesGet(id, status, limit)

List a webhook\&#39;s deliveries.

The last 30 days, newest first.

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdDeliveriesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
    // 'pending' | 'sending' | 'delivered' | 'dead' (optional)
    status: status_example,
    // number (optional)
    limit: 56,
  } satisfies ApiV1WebhooksIdDeliveriesGetRequest;

  try {
    const data = await api.apiV1WebhooksIdDeliveriesGet(body);
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
| **status** | `pending`, `sending`, `delivered`, `dead` |  | [Optional] [Defaults to `undefined`] [Enum: pending, sending, delivered, dead] |
| **limit** | `number` |  | [Optional] [Defaults to `50`] |

### Return type

[**ApiV1WebhooksIdDeliveriesGet200Response**](ApiV1WebhooksIdDeliveriesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not one of this credential\&#39;s webhooks. |  -  |
| **422** | Unknown status. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksIdGet

> ApiV1WebhooksPost201Response apiV1WebhooksIdGet(id)

Get one webhook.

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1WebhooksIdGetRequest;

  try {
    const data = await api.apiV1WebhooksIdGet(body);
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

[**ApiV1WebhooksPost201Response**](ApiV1WebhooksPost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not one of this credential\&#39;s webhooks. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksIdPatch

> ApiV1WebhooksPost201Response apiV1WebhooksIdPatch(id, apiV1WebhooksIdPatchRequest)

Edit, pause or resume a webhook.

Omitted fields keep their value; the result is validated like a create. &#x60;status: paused&#x60; stops new events (read them from &#x60;/api/v1/events&#x60; meanwhile — kept 7 days) and holds what was already queued; &#x60;active&#x60; resumes and sends what was held. An event taken off the webhook drops its waiting deliveries. The secret stays. 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdPatchOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1WebhooksIdPatchRequest
    apiV1WebhooksIdPatchRequest: ...,
  } satisfies ApiV1WebhooksIdPatchOperationRequest;

  try {
    const data = await api.apiV1WebhooksIdPatch(body);
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
| **apiV1WebhooksIdPatchRequest** | [ApiV1WebhooksIdPatchRequest](ApiV1WebhooksIdPatchRequest.md) |  | |

### Return type

[**ApiV1WebhooksPost201Response**](ApiV1WebhooksPost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not one of this credential\&#39;s webhooks. |  -  |
| **422** | Validation error per field. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksIdRotateSecretPost

> ApiV1WebhooksPost201Response apiV1WebhooksIdRotateSecretPost(id, apiV1WebhooksIdRotateSecretPostRequest)

Issue a new signing secret.

For &#x60;overlap_hours&#x60; (0..168, default 24) the previous secret keeps signing too — two &#x60;v1&#x3D;&#x60; values — so you can switch whenever you like. &#x60;0&#x60; ends the old secret at once. The new &#x60;secret&#x60; is in the answer only. 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdRotateSecretPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1WebhooksIdRotateSecretPostRequest (optional)
    apiV1WebhooksIdRotateSecretPostRequest: ...,
  } satisfies ApiV1WebhooksIdRotateSecretPostOperationRequest;

  try {
    const data = await api.apiV1WebhooksIdRotateSecretPost(body);
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
| **apiV1WebhooksIdRotateSecretPostRequest** | [ApiV1WebhooksIdRotateSecretPostRequest](ApiV1WebhooksIdRotateSecretPostRequest.md) |  | [Optional] |

### Return type

[**ApiV1WebhooksPost201Response**](ApiV1WebhooksPost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not one of this credential\&#39;s webhooks. |  -  |
| **409** | Rotated by someone else at the same moment. |  -  |
| **422** | overlap_hours out of range. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksIdTestPost

> ApiV1WebhooksIdTestPost200Response apiV1WebhooksIdTestPost(id)

Send a test ping.

Sends a signed &#x60;webhook.test&#x60; event now and answers what the receiver said (&#x60;status&#x60; delivered / pending / dead, &#x60;http_status&#x60;, &#x60;error&#x60;). A paused webhook only queues it. 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksIdTestPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1WebhooksIdTestPostRequest;

  try {
    const data = await api.apiV1WebhooksIdTestPost(body);
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

[**ApiV1WebhooksIdTestPost200Response**](ApiV1WebhooksIdTestPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Not one of this credential\&#39;s webhooks. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1WebhooksPost

> ApiV1WebhooksPost201Response apiV1WebhooksPost(apiV1WebhooksPostRequest)

Create a webhook.

Returns the signing &#x60;secret&#x60; (&#x60;whsec_…&#x60;) **once**. Every delivery is a POST of the event envelope with &#x60;X-Integration-Event&#x60;, &#x60;X-Integration-Delivery&#x60; (the event id — dedupe on it, delivery is at-least-once), &#x60;X-Integration-Key-Id&#x60; and &#x60;X-Integration-Signature: t&#x3D;&lt;unix&gt;,v1&#x3D;&lt;hex HMAC-SHA256(secret, \&quot;&lt;t&gt;.&lt;body&gt;\&quot;)&gt;&#x60; (check every &#x60;v1&#x60;; during a secret rotation there are two). Answer 2xx within 10 s. Failures retry after 1 m, 5 m, 15 m, 1 h, 3 h, 6 h, 12 h, 24 h; a 4xx other than 408/429 is final; redirects are not followed. 20 failures in a row over a day pause the webhook (&#x60;paused_reason: auto_failing&#x60;). Events are queued within about a minute (state changes detected by the server\&#39;s checks within about two to five).  The URL must be a public &#x60;https://&#x60; address — private, loopback, link-local, metadata and reserved addresses are refused, when saved and again when sent. Each event must be one this credential may see (422 names the missing scope). Unknown body fields are refused. 

### Example

```ts
import {
  Configuration,
  WebhooksEventsApi,
} from 'goadserver-sdk';
import type { ApiV1WebhooksPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WebhooksEventsApi(config);

  const body = {
    // ApiV1WebhooksPostRequest
    apiV1WebhooksPostRequest: ...,
  } satisfies ApiV1WebhooksPostOperationRequest;

  try {
    const data = await api.apiV1WebhooksPost(body);
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
| **apiV1WebhooksPostRequest** | [ApiV1WebhooksPostRequest](ApiV1WebhooksPostRequest.md) |  | |

### Return type

[**ApiV1WebhooksPost201Response**](ApiV1WebhooksPost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created — the only answer that carries &#x60;secret&#x60;. |  -  |
| **409** | &#x60;webhook_limit&#x60; — the account has 20 webhooks. |  -  |
| **422** | Validation error per field (url, events, description) or an unknown field. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

