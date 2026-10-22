# AccountNotificationsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AccountNotificationDestinationsGet**](AccountNotificationsApi.md#apiv1accountnotificationdestinationsget) | **GET** /api/v1/account/notification-destinations | The account\&#39;s notification destinations. |
| [**apiV1AccountNotificationDestinationsIdDelete**](AccountNotificationsApi.md#apiv1accountnotificationdestinationsiddelete) | **DELETE** /api/v1/account/notification-destinations/{id} | Delete a notification destination. |
| [**apiV1AccountNotificationDestinationsIdStatusGet**](AccountNotificationsApi.md#apiv1accountnotificationdestinationsidstatusget) | **GET** /api/v1/account/notification-destinations/{id}/status | Whether a destination is linked. |
| [**apiV1AccountNotificationDestinationsIdTestPost**](AccountNotificationsApi.md#apiv1accountnotificationdestinationsidtestpost) | **POST** /api/v1/account/notification-destinations/{id}/test | Send a test message to a destination. |
| [**apiV1AccountNotificationDestinationsPost**](AccountNotificationsApi.md#apiv1accountnotificationdestinationspostoperation) | **POST** /api/v1/account/notification-destinations | Add a notification destination. |
| [**apiV1AccountNotificationPreferencesGet**](AccountNotificationsApi.md#apiv1accountnotificationpreferencesget) | **GET** /api/v1/account/notification-preferences | Per-event channel preferences. |
| [**apiV1AccountNotificationPreferencesPut**](AccountNotificationsApi.md#apiv1accountnotificationpreferencesputoperation) | **PUT** /api/v1/account/notification-preferences | Save channel preferences. |
| [**apiV1AccountNotificationsGet**](AccountNotificationsApi.md#apiv1accountnotificationsget) | **GET** /api/v1/account/notifications | The in-app notification feed. |
| [**apiV1AccountNotificationsReadPost**](AccountNotificationsApi.md#apiv1accountnotificationsreadpostoperation) | **POST** /api/v1/account/notifications/read | Mark notifications read. |
| [**apiV1AccountNotificationsUnreadCountGet**](AccountNotificationsApi.md#apiv1accountnotificationsunreadcountget) | **GET** /api/v1/account/notifications/unread-count | Unread notification count. |



## apiV1AccountNotificationDestinationsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationDestinationsGet()

The account\&#39;s notification destinations.

User-created Telegram bots and Slack webhooks notifications can route to. Secrets are never returned — only the kind, label and whether the channel is linked. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationDestinationsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  try {
    const data = await api.apiV1AccountNotificationDestinationsGet();
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


## apiV1AccountNotificationDestinationsIdDelete

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationDestinationsIdDelete(id)

Delete a notification destination.

Events routed to it fall back to email. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationDestinationsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // number | Destination ID.
    id: 56,
  } satisfies ApiV1AccountNotificationDestinationsIdDeleteRequest;

  try {
    const data = await api.apiV1AccountNotificationDestinationsIdDelete(body);
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
| **id** | `number` | Destination ID. | [Defaults to `undefined`] |

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


## apiV1AccountNotificationDestinationsIdStatusGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationDestinationsIdStatusGet(id)

Whether a destination is linked.

A Telegram bot is only usable once the user has started a chat with it; this reports whether that has happened. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationDestinationsIdStatusGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // number | Destination ID.
    id: 56,
  } satisfies ApiV1AccountNotificationDestinationsIdStatusGetRequest;

  try {
    const data = await api.apiV1AccountNotificationDestinationsIdStatusGet(body);
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
| **id** | `number` | Destination ID. | [Defaults to `undefined`] |

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


## apiV1AccountNotificationDestinationsIdTestPost

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationDestinationsIdTestPost(id)

Send a test message to a destination.

**Sends a real message** to the linked chat or channel. Use it to prove a destination works; it is not a dry run. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationDestinationsIdTestPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // number | Destination ID.
    id: 56,
  } satisfies ApiV1AccountNotificationDestinationsIdTestPostRequest;

  try {
    const data = await api.apiV1AccountNotificationDestinationsIdTestPost(body);
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
| **id** | `number` | Destination ID. | [Defaults to `undefined`] |

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


## apiV1AccountNotificationDestinationsPost

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationDestinationsPost(apiV1AccountNotificationDestinationsPostRequest)

Add a notification destination.

A Telegram bot (&#x60;token&#x60;) or a Slack incoming webhook (&#x60;url&#x60;). The secret is stored write-only and never read back.  **Creating a destination contacts it.** A Slack webhook is posted a \&quot;destination connected\&quot; message and a Telegram token is checked against Telegram\&#39;s API, both before the row is written — so a destination that exists is one that has been proven to work. A URL that is well-formed but dead answers 400 &#x60;unreachable&#x60;; one that is not webhook-shaped answers 400 &#x60;invalid_url&#x60;; a rejected bot token answers 400 &#x60;invalid_token&#x60;.  There is no way to register a destination without that round-trip, which is deliberate: a silently broken notification channel is worse than a create that fails loudly. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationDestinationsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // ApiV1AccountNotificationDestinationsPostRequest
    apiV1AccountNotificationDestinationsPostRequest: ...,
  } satisfies ApiV1AccountNotificationDestinationsPostOperationRequest;

  try {
    const data = await api.apiV1AccountNotificationDestinationsPost(body);
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
| **apiV1AccountNotificationDestinationsPostRequest** | [ApiV1AccountNotificationDestinationsPostRequest](ApiV1AccountNotificationDestinationsPostRequest.md) |  | |

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
| **400** | invalid_kind, invalid_url, invalid_token, or unreachable — see the description. |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountNotificationPreferencesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationPreferencesGet()

Per-event channel preferences.

The full catalogue of notifiable events with, for each, whether email and in-app are on, which destination it routes to, and whether it is mandatory (mandatory &#x3D; a security notice: on by default and always sent immediately, never folded into a digest; it can still be switched off). 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationPreferencesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  try {
    const data = await api.apiV1AccountNotificationPreferencesGet();
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


## apiV1AccountNotificationPreferencesPut

> ApiV1WebhooksIdDelete200Response apiV1AccountNotificationPreferencesPut(apiV1AccountNotificationPreferencesPutRequest)

Save channel preferences.

Bulk save of the per-event grid. Every visible event, mandatory ones included, takes the sent value; unknown or hidden keys are ignored, so a client can send the whole catalogue back unchanged. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationPreferencesPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // ApiV1AccountNotificationPreferencesPutRequest
    apiV1AccountNotificationPreferencesPutRequest: ...,
  } satisfies ApiV1AccountNotificationPreferencesPutOperationRequest;

  try {
    const data = await api.apiV1AccountNotificationPreferencesPut(body);
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
| **apiV1AccountNotificationPreferencesPutRequest** | [ApiV1AccountNotificationPreferencesPutRequest](ApiV1AccountNotificationPreferencesPutRequest.md) |  | |

### Return type

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

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


## apiV1AccountNotificationsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationsGet(limit, unread)

The in-app notification feed.

Newest first, each item carrying the event key, its rendered title and body, a deep link into the panel, and whether it has been read. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // number | Rows to return. (optional)
    limit: 56,
    // string | Pass 1 to return only unread items. (optional)
    unread: unread_example,
  } satisfies ApiV1AccountNotificationsGetRequest;

  try {
    const data = await api.apiV1AccountNotificationsGet(body);
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
| **limit** | `number` | Rows to return. | [Optional] [Defaults to `undefined`] |
| **unread** | `string` | Pass 1 to return only unread items. | [Optional] [Defaults to `undefined`] |

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


## apiV1AccountNotificationsReadPost

> ApiV1WebhooksIdDelete200Response apiV1AccountNotificationsReadPost(apiV1AccountNotificationsReadPostRequest)

Mark notifications read.

Pass &#x60;ids&#x60; for specific items, or &#x60;all&#x60; to clear the feed. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationsReadPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  const body = {
    // ApiV1AccountNotificationsReadPostRequest
    apiV1AccountNotificationsReadPostRequest: ...,
  } satisfies ApiV1AccountNotificationsReadPostOperationRequest;

  try {
    const data = await api.apiV1AccountNotificationsReadPost(body);
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
| **apiV1AccountNotificationsReadPostRequest** | [ApiV1AccountNotificationsReadPostRequest](ApiV1AccountNotificationsReadPostRequest.md) |  | |

### Return type

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

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


## apiV1AccountNotificationsUnreadCountGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNotificationsUnreadCountGet()

Unread notification count.

Just the number — the cheap poll behind the bell badge. 

### Example

```ts
import {
  Configuration,
  AccountNotificationsApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNotificationsUnreadCountGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountNotificationsApi(config);

  try {
    const data = await api.apiV1AccountNotificationsUnreadCountGet();
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

