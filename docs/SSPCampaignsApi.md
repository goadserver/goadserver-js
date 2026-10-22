# SSPCampaignsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherSspCampaignsGet**](SSPCampaignsApi.md#apiv1publishersspcampaignsget) | **GET** /api/v1/publisher/ssp/campaigns | List SSP campaigns (feeds). |
| [**apiV1PublisherSspCampaignsIdClonePost**](SSPCampaignsApi.md#apiv1publishersspcampaignsidclonepost) | **POST** /api/v1/publisher/ssp/campaigns/{id}/clone | Clone an SSP campaign. |
| [**apiV1PublisherSspCampaignsIdGet**](SSPCampaignsApi.md#apiv1publishersspcampaignsidget) | **GET** /api/v1/publisher/ssp/campaigns/{id} | Get one SSP campaign. |
| [**apiV1PublisherSspCampaignsIdPut**](SSPCampaignsApi.md#apiv1publishersspcampaignsidput) | **PUT** /api/v1/publisher/ssp/campaigns/{id} | Update an SSP campaign. |
| [**apiV1PublisherSspCampaignsIdTestRtbGet**](SSPCampaignsApi.md#apiv1publishersspcampaignsidtestrtbget) | **GET** /api/v1/publisher/ssp/campaigns/{id}/test-rtb | Context for an RTB test request. |
| [**apiV1PublisherSspCampaignsIdTestRtbPost**](SSPCampaignsApi.md#apiv1publishersspcampaignsidtestrtbpostoperation) | **POST** /api/v1/publisher/ssp/campaigns/{id}/test-rtb | Send one test bid request to the feed\&#39;s endpoint. |
| [**apiV1PublisherSspCampaignsIdToggleDeletePut**](SSPCampaignsApi.md#apiv1publishersspcampaignsidtoggledeleteputoperation) | **PUT** /api/v1/publisher/ssp/campaigns/{id}/toggle-delete | Delete or restore an SSP campaign. |
| [**apiV1PublisherSspCampaignsIdTogglePausePut**](SSPCampaignsApi.md#apiv1publishersspcampaignsidtogglepauseputoperation) | **PUT** /api/v1/publisher/ssp/campaigns/{id}/toggle-pause | Pause or resume an SSP campaign. |
| [**apiV1PublisherSspCampaignsIdWlRonCampaignsGet**](SSPCampaignsApi.md#apiv1publishersspcampaignsidwlroncampaignsget) | **GET** /api/v1/publisher/ssp/campaigns/{id}/wl-ron-campaigns | RON campaigns that can be whitelisted on a feed. |
| [**apiV1PublisherSspCampaignsPost**](SSPCampaignsApi.md#apiv1publishersspcampaignspost) | **POST** /api/v1/publisher/ssp/campaigns | Create an SSP campaign. |
| [**apiV1PublisherSspCampaignsSetupDataGet**](SSPCampaignsApi.md#apiv1publishersspcampaignssetupdataget) | **GET** /api/v1/publisher/ssp/campaigns/setup-data | Lookups for the SSP campaign form. |
| [**apiV1PublisherSspFiltersGet**](SSPCampaignsApi.md#apiv1publishersspfiltersget) | **GET** /api/v1/publisher/ssp/filters | Filter values for the SSP campaign list. |
| [**apiV1PublisherSspNetworksGet**](SSPCampaignsApi.md#apiv1publishersspnetworksget) | **GET** /api/v1/publisher/ssp/networks | RTB networks your SSP campaigns use. |
| [**apiV1PublisherSspSellerDisclosurePut**](SSPCampaignsApi.md#apiv1publishersspsellerdisclosureputoperation) | **PUT** /api/v1/publisher/ssp/seller-disclosure | Publish or hide your name in sellers.json. |
| [**apiV1PublisherSspSitesIdAdsTxtCheckPost**](SSPCampaignsApi.md#apiv1publishersspsitesidadstxtcheckpost) | **POST** /api/v1/publisher/ssp/sites/{id}/ads-txt-check | Re-check a site\&#39;s ads.txt now. |
| [**apiV1PublisherSspSitesIdAdsTxtStatusGet**](SSPCampaignsApi.md#apiv1publishersspsitesidadstxtstatusget) | **GET** /api/v1/publisher/ssp/sites/{id}/ads-txt-status | Last stored ads.txt check for a site. |



## apiV1PublisherSspCampaignsGet

> apiV1PublisherSspCampaignsGet()

List SSP campaigns (feeds).

Every SSP campaign of the account, newest first, including paused and deleted ones (&#x60;campaignstate&#x60;: 0 active, 1 paused, 2 deleted). An SSP campaign is a feed that sells your inventory to — or buys RTB traffic from — another platform. The response is a bare JSON array, not paginated.  All SSP routes need one of the SSP rights (&#x60;mod_ssp&#x60;, &#x60;ssp_external&#x60;, &#x60;ssp_networks&#x60;, &#x60;ssp_exchange&#x60;, &#x60;ssp_headerbidding&#x60;) and answer for publisher and advertiser (ad-manager) accounts alike. Keys pinned to &#x60;adzone_ids&#x60; or &#x60;site_ids&#x60; are refused with &#x60;403 forbidden_resource&#x60;: a feed spans sites and zones the pin cannot follow. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  try {
    const data = await api.apiV1PublisherSspCampaignsGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Campaigns. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdClonePost

> apiV1PublisherSspCampaignsIdClonePost(id)

Clone an SSP campaign.

Copies every column into a new campaign named &#x60;&lt;name&gt;(\&#39;Copy\&#39;)&#x60;. A clone of an external/exchange feed gets its own fresh &#x60;hash&#x60;. No request body. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSspCampaignsIdClonePostRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdClonePost(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Cloned. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;not_found&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdGet

> apiV1PublisherSspCampaignsIdGet(id)

Get one SSP campaign.

The full campaign as the edit form loads it. Targeting lists come back as string arrays (&#x60;\&quot;0\&quot;&#x60;/empty &#x3D; all). &#x60;json_zone_urls&#x60; is the stored &#x60;{zoneId: {url, active}}&#x60; map, &#x60;zone_urls&#x60; the same as an array with zone names. Note: the browser-language targeting is read back as &#x60;language&#x60; (comma-separated) but written as &#x60;browserlanguages&#x60;. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSspCampaignsIdGetRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdGet(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The campaign, wrapped in a one-element &#x60;campaigns&#x60; array. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdPut

> apiV1PublisherSspCampaignsIdPut(id, sspCampaignWrite)

Update an SSP campaign.

**Full replace, not a patch**: every column is rewritten from the body, so a missing targeting list resets to \&quot;all\&quot; and a missing scalar to its default. Read the campaign first and send it back whole. Exceptions: &#x60;header_bidding&#x60; is locked to its create-time value, &#x60;dsp_ids&#x60; is kept unless an admin sets it, and an absent &#x60;bill_on_burl&#x60; keeps the stored value. Same validation (409) and &#x60;unknown_fields&#x60; (422) as create. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
    // SspCampaignWrite
    sspCampaignWrite: ...,
  } satisfies ApiV1PublisherSspCampaignsIdPutRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdPut(body);
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
| **sspCampaignWrite** | [SspCampaignWrite](SspCampaignWrite.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Saved. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **409** | Validation failed. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |
| **500** | &#x60;save_failed&#x60; — also returned when the campaign is not yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdTestRtbGet

> apiV1PublisherSspCampaignsIdTestRtbGet(id)

Context for an RTB test request.

The resolved ad type, request URL and RTB type of the campaign, the tenant\&#39;s common banner sizes and the caller\&#39;s IP/UA, as defaults for the POST.

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdTestRtbGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSspCampaignsIdTestRtbGetRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdTestRtbGet(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Context. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found (or deleted). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdTestRtbPost

> apiV1PublisherSspCampaignsIdTestRtbPost(id, apiV1PublisherSspCampaignsIdTestRtbPostRequest)

Send one test bid request to the feed\&#39;s endpoint.

Builds a request the way the ad server would for this campaign, sends it (outbound to public addresses only) and classifies the answer. Every field is optional. **&#x60;bidfloor&#x60; and &#x60;best_price&#x60; are CPM in currency units.** 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdTestRtbPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1PublisherSspCampaignsIdTestRtbPostRequest (optional)
    apiV1PublisherSspCampaignsIdTestRtbPostRequest: {"ad_type":"banner","width":728,"height":90,"country":"DE","bidfloor":0.5},
  } satisfies ApiV1PublisherSspCampaignsIdTestRtbPostOperationRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdTestRtbPost(body);
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
| **apiV1PublisherSspCampaignsIdTestRtbPostRequest** | [ApiV1PublisherSspCampaignsIdTestRtbPostRequest](ApiV1PublisherSspCampaignsIdTestRtbPostRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Test result (also for a failed partner call — read &#x60;verdict&#x60;). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found (or deleted). |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdToggleDeletePut

> apiV1PublisherSspCampaignsIdToggleDeletePut(id, apiV1PublisherSspCampaignsIdToggleDeletePutRequest)

Delete or restore an SSP campaign.

Soft delete (&#x60;isdeleted&#x60;). &#x60;{status: 0}&#x60; restores it.

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdToggleDeletePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1PublisherSspCampaignsIdToggleDeletePutRequest
    apiV1PublisherSspCampaignsIdToggleDeletePutRequest: {"status":1},
  } satisfies ApiV1PublisherSspCampaignsIdToggleDeletePutOperationRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdToggleDeletePut(body);
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
| **apiV1PublisherSspCampaignsIdToggleDeletePutRequest** | [ApiV1PublisherSspCampaignsIdToggleDeletePutRequest](ApiV1PublisherSspCampaignsIdToggleDeletePutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Done. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;not_found&#x60; (also when the value was already set). |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdTogglePausePut

> apiV1PublisherSspCampaignsIdTogglePausePut(id, apiV1PublisherSspCampaignsIdTogglePausePutRequest)

Pause or resume an SSP campaign.

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdTogglePausePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1PublisherSspCampaignsIdTogglePausePutRequest
    apiV1PublisherSspCampaignsIdTogglePausePutRequest: {"status":0},
  } satisfies ApiV1PublisherSspCampaignsIdTogglePausePutOperationRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdTogglePausePut(body);
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
| **apiV1PublisherSspCampaignsIdTogglePausePutRequest** | [ApiV1PublisherSspCampaignsIdTogglePausePutRequest](ApiV1PublisherSspCampaignsIdTogglePausePutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Done. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;not_found&#x60; (also when the value was already set). |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsIdWlRonCampaignsGet

> apiV1PublisherSspCampaignsIdWlRonCampaignsGet(id, adtype, siteid, search, ids)

RON campaigns that can be whitelisted on a feed.

Candidates for &#x60;wl_ron_campaign_ids&#x60;: RON campaigns of the feed\&#39;s ad type (matching the site\&#39;s main category when that module is on). &#x60;available: false&#x60; means the picker is off for this tenant (the &#x60;modules.publisher.connect_campaigns&#x60; module, ad-manager tenants only) — not an error. Use &#x60;id &#x3D; 0&#x60; with &#x60;?adtype&#x3D;&#x60; for a campaign that is not saved yet. &#x60;ids&#x60; echoes the current selection. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsIdWlRonCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number | SSP campaign id, or 0.
    id: 56,
    // number | Ad type when `id` is 0. (optional)
    adtype: 56,
    // number | Override the site used for the category match (must be yours). (optional)
    siteid: 56,
    // string (optional)
    search: search_example,
    // string | Comma-separated currently-selected ids. (optional)
    ids: ids_example,
  } satisfies ApiV1PublisherSspCampaignsIdWlRonCampaignsGetRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsIdWlRonCampaignsGet(body);
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
| **id** | `number` | SSP campaign id, or 0. | [Defaults to `undefined`] |
| **adtype** | `number` | Ad type when &#x60;id&#x60; is 0. | [Optional] [Defaults to `undefined`] |
| **siteid** | `number` | Override the site used for the category match (must be yours). | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **ids** | `string` | Comma-separated currently-selected ids. | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Candidates. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsPost

> apiV1PublisherSspCampaignsPost(sspCampaignWrite)

Create an SSP campaign.

Same save path as the panel\&#39;s SSP campaign form. New campaigns start **paused** (&#x60;ispaused &#x3D; 1&#x60;); resume with &#x60;PUT /api/v1/publisher/ssp/campaigns/{id}/toggle-pause&#x60; &#x60;{status: 0}&#x60;. External and exchange campaigns get a fresh feed &#x60;hash&#x60; (their endpoint identity and the token for the SSP stats feed).  &#x60;ssptype&#x60;: - &#x60;ssp&#x60; — outgoing RTB to a network (&#x60;rtb_network&#x60; required).   &#x60;use_type&#x60;: 0 &#x3D; one request URL, 1 &#x3D; per-ad-zone URLs   (&#x60;zoneurls&#x60;), 2 &#x3D; smart-zone RTB feed. - &#x60;external&#x60; — an incoming feed a partner calls (&#x60;siteid&#x60; required). - &#x60;exchange&#x60; — incoming exchange feed (&#x60;ssp_pct&#x60; 1–100 required). - &#x60;header_bidding: true&#x60; (external/exchange only) collapses the   campaign to Prebid slots (&#x60;slots&#x60; required).  Validation failures answer **409** with &#x60;{\&quot;errors\&quot;: {\&quot;&lt;field&gt;\&quot;: \&quot;&lt;CODE&gt;\&quot;}}&#x60; (codes such as &#x60;EMPTY_NAME&#x60;, &#x60;NO_NETWORK_ID_GIVEN&#x60;, &#x60;NO_WEBSITE_SELECTED&#x60;, &#x60;WEBSITE_NOT_FOUND&#x60;, &#x60;SSP_EXCHANGE_PCT_ERROR&#x60;, &#x60;HB_SLOTS_REQUIRED&#x60;) — the panel\&#39;s shape, kept as is. Unknown body fields are refused with &#x60;422 unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // SspCampaignWrite
    sspCampaignWrite: {"name":"Exo RTB feed","adtype":2,"ssptype":"ssp","rtbtype":"openrtb","rtb_network":5,"use_type":0,"request_url":"https://rtb.network.example/bid?feed=abc","device_type_ids":[1,3],"regionids":[],"ssp_pct":80},
  } satisfies ApiV1PublisherSspCampaignsPostRequest;

  try {
    const data = await api.apiV1PublisherSspCampaignsPost(body);
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
| **sspCampaignWrite** | [SspCampaignWrite](SspCampaignWrite.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Created (paused). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **409** | Validation failed. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspCampaignsSetupDataGet

> apiV1PublisherSspCampaignsSetupDataGet()

Lookups for the SSP campaign form.

Ad types, RTB networks, your websites, targeting lists (device types, OS, browsers, connection types, languages, carriers, IP pools, RTB categories, tier country lists), your other SSP campaigns, enabled modules, display-option config, and the values a partner needs to integrate (&#x60;ad_domain&#x60;, &#x60;rtb_domain&#x60;, &#x60;hb_endpoint&#x60;, &#x60;openrtb2_endpoint&#x60;, &#x60;sellers_json_url&#x60;, &#x60;ads_txt_line&#x60;, &#x60;seller_id&#x60;, &#x60;public_seller_disclosure&#x60;). In-app (Prebid Mobile, docs/IN_APP.md): the SDK\&#39;s Prebid Server host is &#x60;openrtb2_endpoint&#x60;, its account id the campaign\&#39;s token (&#x60;hash&#x60;), and each ad unit\&#39;s config id names its adzone; apps send &#x60;app.bundle&#x60; instead of &#x60;site.page&#x60;, interstitial units &#x60;imp.instl&#x60;, rewarded ones &#x60;imp.rwdd&#x60; / &#x60;imp.ext.prebid.is_rewarded_inventory&#x60;. &#x60;ads_txt_line&#x60; goes in app-ads.txt on the app\&#39;s developer website. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspCampaignsSetupDataGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  try {
    const data = await api.apiV1PublisherSspCampaignsSetupDataGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Lookups. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspFiltersGet

> apiV1PublisherSspFiltersGet()

Filter values for the SSP campaign list.

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  try {
    const data = await api.apiV1PublisherSspFiltersGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ad types, active RTB networks and statuses. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspNetworksGet

> apiV1PublisherSspNetworksGet(page, perPage, sortBy, sortDir, filterId, filterName)

RTB networks your SSP campaigns use.

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspNetworksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // 'id' | 'name' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    filterId: 56,
    // string (optional)
    filterName: filterName_example,
  } satisfies ApiV1PublisherSspNetworksGetRequest;

  try {
    const data = await api.apiV1PublisherSspNetworksGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `id`, `name` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, name] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Networks. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspSellerDisclosurePut

> apiV1PublisherSspSellerDisclosurePut(apiV1PublisherSspSellerDisclosurePutRequest)

Publish or hide your name in sellers.json.

&#x60;true&#x60;: &#x60;/sellers.json&#x60; lists your company name and primary site domain. &#x60;false&#x60;: confidential, &#x60;seller_id&#x60; only (the default).

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspSellerDisclosurePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // ApiV1PublisherSspSellerDisclosurePutRequest
    apiV1PublisherSspSellerDisclosurePutRequest: {"enabled":true},
  } satisfies ApiV1PublisherSspSellerDisclosurePutOperationRequest;

  try {
    const data = await api.apiV1PublisherSspSellerDisclosurePut(body);
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
| **apiV1PublisherSspSellerDisclosurePutRequest** | [ApiV1PublisherSspSellerDisclosurePutRequest](ApiV1PublisherSspSellerDisclosurePutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Saved. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspSitesIdAdsTxtCheckPost

> apiV1PublisherSspSitesIdAdsTxtCheckPost(id)

Re-check a site\&#39;s ads.txt now.

Fetches &#x60;https://&lt;site&gt;/ads.txt&#x60;, looks for the network\&#39;s line (&#x60;ad_domain&#x60;, your &#x60;seller_id&#x60;, &#x60;DIRECT&#x60;), stores and returns the result. Within the fetch cooldown the stored result is returned without a new fetch. No request body. 

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspSitesIdAdsTxtCheckPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number | Your site id.
    id: 56,
  } satisfies ApiV1PublisherSspSitesIdAdsTxtCheckPostRequest;

  try {
    const data = await api.apiV1PublisherSspSitesIdAdsTxtCheckPost(body);
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
| **id** | `number` | Your site id. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Check result. |  -  |
| **400** | &#x60;invalid_site&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;not_found&#x60; — not one of your live sites. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspSitesIdAdsTxtStatusGet

> apiV1PublisherSspSitesIdAdsTxtStatusGet(id)

Last stored ads.txt check for a site.

No fetch. &#x60;checked:false&#x60; when the site was never checked.

### Example

```ts
import {
  Configuration,
  SSPCampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspSitesIdAdsTxtStatusGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SSPCampaignsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSspSitesIdAdsTxtStatusGetRequest;

  try {
    const data = await api.apiV1PublisherSspSitesIdAdsTxtStatusGet(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Status. |  -  |
| **400** | &#x60;invalid_site&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;not_found&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

