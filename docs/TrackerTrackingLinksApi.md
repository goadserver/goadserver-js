# TrackerTrackingLinksApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerTrackingLinksBulkPost**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksbulkpostoperation) | **POST** /api/v1/tracker/tracking-links/bulk | Delete many tracking links. |
| [**apiV1TrackerTrackingLinksGet**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksget) | **GET** /api/v1/tracker/tracking-links | List tracking links. |
| [**apiV1TrackerTrackingLinksIdBlocklistGet**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidblocklistget) | **GET** /api/v1/tracker/tracking-links/{id}/blocklist | List zones blocked on one link. |
| [**apiV1TrackerTrackingLinksIdBlocklistPost**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidblocklistpostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/blocklist | Block a zone on one link. |
| [**apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidblocklistzoneiddelete) | **DELETE** /api/v1/tracker/tracking-links/{id}/blocklist/{zoneId} | Unblock a zone on one link. |
| [**apiV1TrackerTrackingLinksIdDelete**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksiddelete) | **DELETE** /api/v1/tracker/tracking-links/{id} | Delete a tracking link. |
| [**apiV1TrackerTrackingLinksIdNetworkBindingDelete**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidnetworkbindingdelete) | **DELETE** /api/v1/tracker/tracking-links/{id}/network-binding | Unbind a tracking link from its ad-network campaign. |
| [**apiV1TrackerTrackingLinksIdNetworkBindingPut**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidnetworkbindingputoperation) | **PUT** /api/v1/tracker/tracking-links/{id}/network-binding | Bind a tracking link to an ad-network campaign. |
| [**apiV1TrackerTrackingLinksIdPut**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidputoperation) | **PUT** /api/v1/tracker/tracking-links/{id} | Update a tracking link. |
| [**apiV1TrackerTrackingLinksIdToggleActivePost**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidtoggleactivepost) | **POST** /api/v1/tracker/tracking-links/{id}/toggle-active | Pause or resume the bound network campaign. |
| [**apiV1TrackerTrackingLinksIdZoneCostsGet**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidzonecostsget) | **GET** /api/v1/tracker/tracking-links/{id}/zone-costs | Per-zone cost and performance for one link. |
| [**apiV1TrackerTrackingLinksPost**](TrackerTrackingLinksApi.md#apiv1trackertrackinglinkspostoperation) | **POST** /api/v1/tracker/tracking-links | Create a tracking link. |



## apiV1TrackerTrackingLinksBulkPost

> ApiV1PublisherPushSubscribersActionPost200Response apiV1TrackerTrackingLinksBulkPost(apiV1TrackerTrackingLinksBulkPostRequest)

Delete many tracking links.

The tracking-link twin of &#x60;/offers/bulk&#x60;, but delete-only. A link\&#39;s on/off state is set one at a time through &#x60;POST /tracking-links/{id}/toggle-active&#x60; — pausing a link a live traffic source is still sending to is a decision worth making per link, not per batch. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksBulkPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // ApiV1TrackerTrackingLinksBulkPostRequest
    apiV1TrackerTrackingLinksBulkPostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksBulkPostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksBulkPost(body);
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
| **apiV1TrackerTrackingLinksBulkPostRequest** | [ApiV1TrackerTrackingLinksBulkPostRequest](ApiV1TrackerTrackingLinksBulkPostRequest.md) |  | |

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


## apiV1TrackerTrackingLinksGet

> ApiV1TrackerTrackingLinksGet200Response apiV1TrackerTrackingLinksGet()

List tracking links.

Each link is a &#x60;publisher_adzones&#x60; row under a hidden source site. A link bound to one offer redirects straight to it; a smartlink carries several &#x60;offer_ids&#x60; and lets targeting and eCPM pick the winner per click. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  try {
    const data = await api.apiV1TrackerTrackingLinksGet();
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

[**ApiV1TrackerTrackingLinksGet200Response**](ApiV1TrackerTrackingLinksGet200Response.md)

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


## apiV1TrackerTrackingLinksIdBlocklistGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerTrackingLinksIdBlocklistGet(id)

List zones blocked on one link.

The placements this link refuses to buy. 404 while the link is not bound to an ad network — there are no placements to block until it is. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdBlocklistGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdBlocklistGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdBlocklistGet(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |

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


## apiV1TrackerTrackingLinksIdBlocklistPost

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerTrackingLinksIdBlocklistPost(id, apiV1TrackerTrackingLinksIdBlocklistPostRequest)

Block a zone on one link.

Adds a placement to the link\&#39;s block list; the traffic source stops being bought on that zone. 404 while the link is not bound to an ad network. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdBlocklistPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
    // ApiV1TrackerTrackingLinksIdBlocklistPostRequest
    apiV1TrackerTrackingLinksIdBlocklistPostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdBlocklistPostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdBlocklistPost(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdBlocklistPostRequest** | [ApiV1TrackerTrackingLinksIdBlocklistPostRequest](ApiV1TrackerTrackingLinksIdBlocklistPostRequest.md) |  | |

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


## apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete(id, zoneId)

Unblock a zone on one link.

Removes the placement from the block list. 404 while the link is not bound to an ad network. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
    // string | Zone / placement id.
    zoneId: zoneId_example,
  } satisfies ApiV1TrackerTrackingLinksIdBlocklistZoneIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |
| **zoneId** | `string` | Zone / placement id. | [Defaults to `undefined`] |

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


## apiV1TrackerTrackingLinksIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerTrackingLinksIdDelete(id)

Delete a tracking link.

Soft delete — the link stops serving, its click history stays. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdDelete(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |

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


## apiV1TrackerTrackingLinksIdNetworkBindingDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerTrackingLinksIdNetworkBindingDelete(id)

Unbind a tracking link from its ad-network campaign.

Cost stops being attributed to the link. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdNetworkBindingDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdNetworkBindingDeleteRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdNetworkBindingDelete(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |

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


## apiV1TrackerTrackingLinksIdNetworkBindingPut

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerTrackingLinksIdNetworkBindingPut(id, apiV1TrackerTrackingLinksIdNetworkBindingPutRequest)

Bind a tracking link to an ad-network campaign.

Ties the link to a campaign on the buying side, so spend pulled from that network lands against this link\&#39;s revenue. &#x60;auto_api&#x60; lets rules push pause / bid changes back to the network. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdNetworkBindingPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
    // ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest
    apiV1TrackerTrackingLinksIdNetworkBindingPutRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdNetworkBindingPutOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdNetworkBindingPut(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdNetworkBindingPutRequest** | [ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest](ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest.md) |  | |

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


## apiV1TrackerTrackingLinksIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerTrackingLinksIdPut(id, apiV1TrackerTrackingLinksIdPutRequest)

Update a tracking link.

Partial update — omitted fields keep their current value. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link (adzone) ID.
    id: 56,
    // ApiV1TrackerTrackingLinksIdPutRequest
    apiV1TrackerTrackingLinksIdPutRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdPut(body);
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
| **id** | `number` | Tracking link (adzone) ID. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdPutRequest** | [ApiV1TrackerTrackingLinksIdPutRequest](ApiV1TrackerTrackingLinksIdPutRequest.md) |  | |

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


## apiV1TrackerTrackingLinksIdToggleActivePost

> ApiV1TrackerTrackingLinksIdToggleActivePost200Response apiV1TrackerTrackingLinksIdToggleActivePost(id, apiV1CampaignsTypeIdActivePatchRequest)

Pause or resume the bound network campaign.

**This reaches out to the traffic source.** It does not flip a local flag: it calls the bound ad network\&#39;s API to pause or resume the campaign this link is bound to, and writes the outcome back to &#x60;adnetwork_state&#x60;.  The binding is required — an unbound link answers 400 &#x60;no_binding&#x60;.  Day to day you do not need this: goadserver\&#39;s &#x60;UpdateFromAdzones&#x60; cron already mirrors local offer state to the remote campaign every tick. It exists for \&quot;pause the source right now\&quot; without waiting for the next tick, and for reporting-only bindings (&#x60;auto_api&#x60; false) where the cron never acts. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdToggleActivePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdToggleActivePostRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdToggleActivePost(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1TrackerTrackingLinksIdToggleActivePost200Response**](ApiV1TrackerTrackingLinksIdToggleActivePost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **400** | no_binding — the link is not bound to an ad network; or invalid_body. |  -  |
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdZoneCostsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerTrackingLinksIdZoneCostsGet(id, days)

Per-zone cost and performance for one link.

Placement-level spend and result for the link\&#39;s bound traffic source, the input a placement rule blocks on. See docs/TRACKER_ZONE_BLOCKING.md.  Placement data comes from the bound ad network, so a link with no binding answers 404 — bind it with &#x60;PUT /tracking-links/{id}/network-binding&#x60; first. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdZoneCostsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // number | Tracking link ID.
    id: 56,
    // number | Trailing window in days. (optional)
    days: 56,
  } satisfies ApiV1TrackerTrackingLinksIdZoneCostsGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdZoneCostsGet(body);
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
| **id** | `number` | Tracking link ID. | [Defaults to `undefined`] |
| **days** | `number` | Trailing window in days. | [Optional] [Defaults to `7`] |

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


## apiV1TrackerTrackingLinksPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerTrackingLinksPost(apiV1TrackerTrackingLinksPostRequest)

Create a tracking link.

Pass &#x60;offer_id&#x60; for a single-offer link, or &#x60;offer_ids&#x60; (optionally with matching &#x60;weights&#x60;) for a smartlink. &#x60;tokens&#x60; names the macro slots the click URL should carry. 

### Example

```ts
import {
  Configuration,
  TrackerTrackingLinksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerTrackingLinksApi(config);

  const body = {
    // ApiV1TrackerTrackingLinksPostRequest
    apiV1TrackerTrackingLinksPostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksPostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksPost(body);
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
| **apiV1TrackerTrackingLinksPostRequest** | [ApiV1TrackerTrackingLinksPostRequest](ApiV1TrackerTrackingLinksPostRequest.md) |  | |

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

