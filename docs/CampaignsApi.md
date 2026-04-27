# CampaignsApi

All URIs are relative to *https://up.goadserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CampaignsGet**](CampaignsApi.md#apiv1campaignsget) | **GET** /api/v1/campaigns | List the caller\&#39;s campaigns across all types (or one type). |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsget) | **GET** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | List per-zone bid overrides for a RON ad. |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsputoperation) | **PUT** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | Replace the per-zone bid overrides on a RON ad. |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidszoneiddelete) | **DELETE** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/{zoneId} | Clear a single per-zone bid override. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidactivepatch) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/active | Pause or unpause a single ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidbidpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bid | Set a single ad\&#39;s bid. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdClonePost**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidclonepost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/clone | Clone a single ad within a campaign. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdDelete**](CampaignsApi.md#apiv1campaignstypecampaignidadsadiddelete) | **DELETE** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Soft-delete an ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdGet**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Show one ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Update an ad. |
| [**apiV1CampaignsTypeCampaignIdAdsGet**](CampaignsApi.md#apiv1campaignstypecampaignidadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads | List ads on a campaign. |
| [**apiV1CampaignsTypeCampaignIdAdsPost**](CampaignsApi.md#apiv1campaignstypecampaignidadspostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads | Create an ad on a campaign (smart-default, JSON-only). |
| [**apiV1CampaignsTypeCampaignIdSchemaAdsGet**](CampaignsApi.md#apiv1campaignstypecampaignidschemaadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/_schema/ads | Field metadata for ad creation, scoped to a campaign. |
| [**apiV1CampaignsTypeIdActivePatch**](CampaignsApi.md#apiv1campaignstypeidactivepatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/active | Pause or unpause a campaign. |
| [**apiV1CampaignsTypeIdBidsPatch**](CampaignsApi.md#apiv1campaignstypeidbidspatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/bids | Mass update bids on every ad in a campaign. |
| [**apiV1CampaignsTypeIdClonePost**](CampaignsApi.md#apiv1campaignstypeidclonepostoperation) | **POST** /api/v1/campaigns/{type}/{id}/clone | Clone a campaign and all its ads. |
| [**apiV1CampaignsTypeIdDelete**](CampaignsApi.md#apiv1campaignstypeiddelete) | **DELETE** /api/v1/campaigns/{type}/{id} | Soft-delete a campaign. |
| [**apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete**](CampaignsApi.md#apiv1campaignstypeidfiltersfiltertypefilteriddelete) | **DELETE** /api/v1/campaigns/{type}/{id}/filters/{filter_type}/{filter_id} | Detach a filter from this campaign. |
| [**apiV1CampaignsTypeIdFiltersGet**](CampaignsApi.md#apiv1campaignstypeidfiltersget) | **GET** /api/v1/campaigns/{type}/{id}/filters | List filters attached to this campaign. |
| [**apiV1CampaignsTypeIdFiltersPost**](CampaignsApi.md#apiv1campaignstypeidfilterspostoperation) | **POST** /api/v1/campaigns/{type}/{id}/filters | Attach a filter to this campaign. |
| [**apiV1CampaignsTypeIdGet**](CampaignsApi.md#apiv1campaignstypeidget) | **GET** /api/v1/campaigns/{type}/{id} | Get a single campaign. |
| [**apiV1CampaignsTypeIdMinBidGet**](CampaignsApi.md#apiv1campaignstypeidminbidget) | **GET** /api/v1/campaigns/{type}/{id}/min-bid | Get the campaign\&#39;s minimum acceptable CPC bid. |
| [**apiV1CampaignsTypePost**](CampaignsApi.md#apiv1campaignstypepostoperation) | **POST** /api/v1/campaigns/{type} | Create a new campaign (smart-default). |
| [**apiV1CampaignsTypeSchemaAdsGet**](CampaignsApi.md#apiv1campaignstypeschemaadsget) | **GET** /api/v1/campaigns/{type}/_schema/ads | Field metadata for ad creation. |
| [**apiV1CampaignsTypeSchemaGet**](CampaignsApi.md#apiv1campaignstypeschemaget) | **GET** /api/v1/campaigns/{type}/_schema | Field metadata for create/update. |



## apiV1CampaignsGet

> ApiV1CampaignsGet200Response apiV1CampaignsGet(type, page, perPage, fields)

List the caller\&#39;s campaigns across all types (or one type).

Returns the caller\&#39;s campaigns. By default each row carries a rich-but-bounded projection: identity (&#x60;id&#x60;, &#x60;name&#x60;, &#x60;campaign_type&#x60;, &#x60;ad_type&#x60; + &#x60;ad_type_label&#x60;, &#x60;selling_type&#x60;), lifecycle (&#x60;is_paused&#x60;, &#x60;is_active&#x60;, &#x60;is_deleted&#x60;, &#x60;is_complete&#x60;, &#x60;pending_state&#x60;), budget (&#x60;daily_budget&#x60;, &#x60;daily_spent&#x60;, &#x60;total_budget&#x60;, &#x60;total_spent&#x60;, &#x60;use_campaign_budget&#x60;), bidding (&#x60;bid_default&#x60;, &#x60;min_bid&#x60;), targeting summary (&#x60;countries&#x60;, &#x60;languages&#x60;, &#x60;categories&#x60;, &#x60;device_type_ids&#x60;, …), capping, schedule, linked filter/pool ids, and timestamps.  Use &#x60;?fields&#x3D;&#x60; to opt in or out of fields:    - &#x60;?fields&#x3D;*&#x60; — return **every** column on the underlying     campaign row (70+ fields, type-dependent). Convenient for     AI agents that want the full picture in one call.   - &#x60;?fields&#x3D;name,daily_budget,countries&#x60; — narrow to just     those fields. &#x60;id&#x60; is always included.   - (omitted) — default rich projection above. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'all' | 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb' (optional)
    type: type_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | CSV of fields to return; `*` returns everything available. (optional)
    fields: fields_example,
  } satisfies ApiV1CampaignsGetRequest;

  try {
    const data = await api.apiV1CampaignsGet(body);
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
| **type** | `all`, `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Optional] [Defaults to `&#39;all&#39;`] [Enum: all, ron, cpm, flatrate, directdeal, rtb] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |
| **fields** | `string` | CSV of fields to return; &#x60;*&#x60; returns everything available. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsGet200Response**](ApiV1CampaignsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated campaign list (projected to a stable subset of fields). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet

> ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet(campaignId, adId)

List per-zone bid overrides for a RON ad.

RON ads carry a per-adzone bid map (&#x60;bids_per_zone&#x60; JSON), letting an advertiser bid different amounts on different publisher zones. This endpoint returns each override enriched with the zone + site names, so an auto-optimiser can correlate ids ↔ human labels in one call.  Empty list if the ad has no overrides — the global ad bid applies to every zone. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    adId: 56,
  } satisfies ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGetRequest;

  try {
    const data = await api.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet(body);
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
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response**](ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Zone bid map. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut

> ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut(campaignId, adId, apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest)

Replace the per-zone bid overrides on a RON ad.

Full-replace semantics — any zone NOT in the request body has its override cleared. If you only want to update a few zones, pass the complete current set merged with your changes. Auto-optimisers usually recompute the full bid sheet per cycle so this fits the common loop.  Negative or zero &#x60;zone_id&#x60; and negative &#x60;bid&#x60; entries are silently dropped. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    adId: 56,
    // ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest
    apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest: {"zone_bids":[{"zone_id":12,"bid":0.002},{"zone_id":19,"bid":8.0E-4}]},
  } satisfies ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut(body);
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
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest** | [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest](ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest.md) |  | |

### Return type

[**ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response**](ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Replaced. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete

> ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete(campaignId, adId, zoneId)

Clear a single per-zone bid override.

Removes the override for one zone. The global ad bid takes over again for that zone. Returns 404 if no override exists for the given zone. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    adId: 56,
    // number
    zoneId: 56,
  } satisfies ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDeleteRequest;

  try {
    const data = await api.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete(body);
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
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response**](ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Override cleared. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found, or no override for that zone. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch

> ApiV1CampaignsTypeIdActivePatch200Response apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch(type, campaignId, adId, apiV1CampaignsTypeIdActivePatchRequest)

Pause or unpause a single ad.

Idempotent set. &#x60;active&#x3D;true&#x60; activates the ad, &#x60;active&#x3D;false&#x60; pauses it. Useful for granular pause/resume from an optimiser without touching the campaign-level pause state. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatchRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeIdActivePatch200Response**](ApiV1CampaignsTypeIdActivePatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New state. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found. |  -  |
| **422** | Validation error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch

> ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch(type, campaignId, adId, apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest)

Set a single ad\&#39;s bid.

Updates one ad\&#39;s bid. Value is in main-currency units (the same scale &#x60;bid&#x60; is stored in). For the legal floor on the parent campaign, query &#x60;GET /campaigns/{type}/{id}/min-bid&#x60; first. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest
    apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest: ...,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest** | [ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest](ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Bid updated. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found. |  -  |
| **422** | Validation error (negative bid, missing field). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdClonePost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1CampaignsTypeCampaignIdAdsAdIdClonePost(type, campaignId, adId)

Clone a single ad within a campaign.

Duplicates one ad. The clone is attached to the same campaign as the source. Useful for A/B-testing creative variants without rebuilding the whole record from scratch. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdClonePostRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdClonePost(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ad cloned. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Source ad not found or not owned by caller. |  -  |
| **422** | Clone failed. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdDelete

> apiV1CampaignsTypeCampaignIdAdsAdIdDelete(type, campaignId, adId)

Soft-delete an ad.

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdDeleteRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdDelete(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted. |  -  |
| **404** | Ad not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdGet

> apiV1CampaignsTypeCampaignIdAdsAdIdGet(type, campaignId, adId)

Show one ad.

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ad detail. |  -  |
| **404** | Ad not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdPut

> apiV1CampaignsTypeCampaignIdAdsAdIdPut(type, campaignId, adId, apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest)

Update an ad.

Editable fields depend on ad type. Common fields: &#x60;bid&#x60;, &#x60;isactive&#x60;, &#x60;creatives&#x60; (banner/video/native blob). 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
    apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest: ...,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdPut(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest](ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **404** | Ad not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsGet

> ApiV1CampaignsTypeCampaignIdAdsGet200Response apiV1CampaignsTypeCampaignIdAdsGet(type, campaignId, page, perPage)

List ads on a campaign.

Returns every ad attached to the campaign (paginated). Each row carries &#x60;id&#x60;, &#x60;bid&#x60;, &#x60;isactive&#x60;, &#x60;bansizeid&#x60;, the underlying &#x60;creatives&#x60; JSON (banner/video/native, with file paths and creative_id refs), and lifetime stats from the campaign-side rollup. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsGet200Response**](ApiV1CampaignsTypeCampaignIdAdsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ads. |  -  |
| **404** | Campaign not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsPost

> apiV1CampaignsTypeCampaignIdAdsPost(type, campaignId, apiV1CampaignsTypeCampaignIdAdsPostRequest, dryRun, strict)

Create an ad on a campaign (smart-default, JSON-only).

Creates a new ad attached to the campaign. JSON-only — agents reference an existing creative (banner pool, single creative, URL or HTML) instead of uploading files. The panel handler at the same path still accepts &#x60;multipart/form-data&#x60; for file uploads — this docs entry covers the JSON path only.  Required: &#x60;title&#x60; + &#x60;bid&#x60; + exactly **one** creative reference (&#x60;banner_pool_id&#x60; / &#x60;creative_id&#x60; / &#x60;banner_url&#x60; / &#x60;banner_html&#x60; / &#x60;video_pool_id&#x60;). &#x60;destination_url&#x60; is required unless the creative carries its own URL (popunder/JS) or you set &#x60;url_pool_id&#x60;.  **Modes:**   - &#x60;?dry_run&#x3D;1&#x60; — return the resolved field map + computed     &#x60;creatives&#x60; JSON without inserting.   - &#x60;?strict&#x3D;1&#x60; — reject unknown field names with a 422. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsPostRequest
    apiV1CampaignsTypeCampaignIdAdsPostRequest: {"title":"My banner ad","bid":0.0042,"banner_pool_id":129481,"destination_url":"https://example.com/lander"},
    // '1' (optional)
    dryRun: dryRun_example,
    // '1' (optional)
    strict: strict_example,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsPostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsPost(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsPostRequest** | [ApiV1CampaignsTypeCampaignIdAdsPostRequest](ApiV1CampaignsTypeCampaignIdAdsPostRequest.md) |  | |
| **dryRun** | `1` |  | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **strict** | `1` |  | [Optional] [Defaults to `undefined`] [Enum: 1] |

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
| **201** | Created. Body is the freshly-created ad in the same shape as &#x60;GET /campaigns/{type}/{campaignId}/ads/{adId}&#x60;. |  -  |
| **200** | When &#x60;?dry_run&#x3D;1&#x60; — body is &#x60;{ dry_run: true, resolved: ..., creatives: ..., would_insert: ... }&#x60;. |  -  |
| **422** | Validation error. |  -  |
| **404** | Campaign not found. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdSchemaAdsGet

> apiV1CampaignsTypeCampaignIdSchemaAdsGet(type, campaignId)

Field metadata for ad creation, scoped to a campaign.

Same as &#x60;/_schema/ads&#x60; above, but uses the campaign\&#39;s ad type to return only the fields that apply (e.g. video pools omitted for a banner-only campaign). Sets &#x60;campaign_ad_type&#x60; in the response. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdSchemaAdsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    campaignId: 56,
  } satisfies ApiV1CampaignsTypeCampaignIdSchemaAdsGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdSchemaAdsGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ad-create field metadata, narrowed to the campaign\&#39;s ad type. |  -  |
| **404** | Campaign not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdActivePatch

> ApiV1CampaignsTypeIdActivePatch200Response apiV1CampaignsTypeIdActivePatch(type, id, apiV1CampaignsTypeIdActivePatchRequest)

Pause or unpause a campaign.

Idempotent. &#x60;active&#x3D;true&#x60; unpauses, &#x60;active&#x3D;false&#x60; pauses. Reuses the same panel-side guards: flat-rate campaigns with running deals cannot be paused; offer campaigns require &gt;&#x3D; 5 ads to be unpaused.  This is the endpoint behind the **\&quot;On / off only\&quot;** key preset. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdActivePatchOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1CampaignsTypeIdActivePatchOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdActivePatch(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeIdActivePatch200Response**](ApiV1CampaignsTypeIdActivePatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New state |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |
| **422** | Toggle blocked by a business rule (e.g. flat-rate running deals, offer min-ads). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdBidsPatch

> ApiV1CampaignsTypeIdBidsPatch200Response apiV1CampaignsTypeIdBidsPatch(type, id, apiV1CampaignsTypeIdBidsPatchRequest)

Mass update bids on every ad in a campaign.

Update every (or a subset of) ad\&#39;s bid in one call. Three modes:    - &#x60;set&#x60;     — overwrite each target ad\&#39;s bid with &#x60;value&#x60;.   - &#x60;pct_inc&#x60; — raise each target ad\&#39;s bid by &#x60;pct&#x60; percent.   - &#x60;pct_dec&#x60; — lower each target ad\&#39;s bid by &#x60;pct&#x60; percent.  Optional &#x60;ad_ids&#x60; narrows the update to a subset (omit or empty list &#x3D; every non-deleted ad on the campaign). Bids are clamped at 0 — anything that would resolve below 0 is set to 0.  Bid values are in main-currency units (the same scale &#x60;bid&#x60; is stored in). For minimum-acceptable-bid floors call &#x60;GET /api/v1/campaigns/{type}/{id}/min-bid&#x60; first. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdBidsPatchOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'rtb'
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdBidsPatchRequest
    apiV1CampaignsTypeIdBidsPatchRequest: {"mode":"set","value":0.0042},
  } satisfies ApiV1CampaignsTypeIdBidsPatchOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdBidsPatch(body);
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
| **type** | `ron`, `cpm`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdBidsPatchRequest** | [ApiV1CampaignsTypeIdBidsPatchRequest](ApiV1CampaignsTypeIdBidsPatchRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeIdBidsPatch200Response**](ApiV1CampaignsTypeIdBidsPatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | Validation error (invalid mode / value / pct). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdClonePost

> ApiV1CampaignsTypeIdClonePost201Response apiV1CampaignsTypeIdClonePost(type, id, apiV1CampaignsTypeIdClonePostRequest)

Clone a campaign and all its ads.

Duplicates the campaign row and every ad attached to it. The clone lands paused (&#x60;is_active&#x3D;false&#x60;) so you can review and tweak it before activating. Targeting filters, bids, daily caps and budget settings are all carried over verbatim — only &#x60;name&#x60; (suffix \&quot; Copy\&quot; by default, overridable via the body) and reset bookkeeping fields (&#x60;num_ads&#x60;, &#x60;pending_state&#x60;, &#x60;dateadded&#x60;, &#x60;wl_zoneids&#x60;) differ from the original.  For &#x60;ron&#x60; campaigns the clone also strips any flat-rate deals (the new campaign starts with no running placements) and copies offer screenshot files from the original so the cloned offer-mode campaign retains its preview imagery. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdClonePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdClonePostRequest (optional)
    apiV1CampaignsTypeIdClonePostRequest: ...,
  } satisfies ApiV1CampaignsTypeIdClonePostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdClonePost(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdClonePostRequest** | [ApiV1CampaignsTypeIdClonePostRequest](ApiV1CampaignsTypeIdClonePostRequest.md) |  | [Optional] |

### Return type

[**ApiV1CampaignsTypeIdClonePost201Response**](ApiV1CampaignsTypeIdClonePost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Clone created. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Source campaign not found or not owned by caller. |  -  |
| **422** | Clone failed (invalid type, schema mismatch, etc.). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdDelete

> ApiV1CampaignsTypeIdDelete200Response apiV1CampaignsTypeIdDelete(type, id)

Soft-delete a campaign.

Sets &#x60;isdeleted&#x3D;1&#x60;, &#x60;ispaused&#x3D;1&#x60;, &#x60;dayactive&#x3D;0&#x60;. The campaign and its history remain in the database for billing/stats reconciliation but stop serving immediately. Idempotent — deleting an already- deleted campaign returns 404. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1CampaignsTypeIdDeleteRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdDelete(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsTypeIdDelete200Response**](ApiV1CampaignsTypeIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found or already deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete

> apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete(type, id, filterType, filterId)

Detach a filter from this campaign.

Exclusion filter: removes the campaign id from the filter\&#39;s &#x60;campaignids&#x60; CSV (if the CSV becomes empty, falls back to \&quot;0\&quot; meaning \&quot;applies to all campaigns\&quot; — same legacy sentinel). Inclusion filter: clears the campaign\&#39;s FK column only if it currently points to this filter; otherwise returns 404. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'rtb'
    type: type_example,
    // number
    id: 56,
    // string
    filterType: filterType_example,
    // number
    filterId: 56,
  } satisfies ApiV1CampaignsTypeIdFiltersFilterTypeFilterIdDeleteRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete(body);
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
| **type** | `ron`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **filterType** | `string` |  | [Defaults to `undefined`] |
| **filterId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Detached |  -  |
| **404** | Not attached / campaign not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdFiltersGet

> ApiV1CampaignsTypeIdFiltersGet200Response apiV1CampaignsTypeIdFiltersGet(type, id)

List filters attached to this campaign.

Returns every filter (exclusion via &#x60;campaignids&#x60; membership, inclusion via FK columns) currently linked to this campaign. Only &#x60;ron&#x60; and &#x60;rtb&#x60; campaign types support filter linkage. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'rtb'
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1CampaignsTypeIdFiltersGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdFiltersGet(body);
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
| **type** | `ron`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsTypeIdFiltersGet200Response**](ApiV1CampaignsTypeIdFiltersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Linked filters |  -  |
| **404** | Campaign not found |  -  |
| **422** | Unsupported campaign type |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdFiltersPost

> ApiV1CampaignsTypeIdFiltersPost200Response apiV1CampaignsTypeIdFiltersPost(type, id, apiV1CampaignsTypeIdFiltersPostRequest)

Attach a filter to this campaign.

For exclusion filters, appends the campaign id to the filter\&#39;s &#x60;campaignids&#x60; CSV. For inclusion filters, sets the campaign\&#39;s FK column to this filter (replacing any previous inclusion filter of the same kind). 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdFiltersPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'rtb'
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdFiltersPostRequest
    apiV1CampaignsTypeIdFiltersPostRequest: ...,
  } satisfies ApiV1CampaignsTypeIdFiltersPostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdFiltersPost(body);
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
| **type** | `ron`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdFiltersPostRequest** | [ApiV1CampaignsTypeIdFiltersPostRequest](ApiV1CampaignsTypeIdFiltersPostRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeIdFiltersPost200Response**](ApiV1CampaignsTypeIdFiltersPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Attached |  -  |
| **404** | Campaign or filter not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdGet

> object apiV1CampaignsTypeIdGet(type, id)

Get a single campaign.

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1CampaignsTypeIdGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

**object**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Campaign |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdMinBidGet

> ApiV1CampaignsTypeIdMinBidGet200Response apiV1CampaignsTypeIdMinBidGet(type, id)

Get the campaign\&#39;s minimum acceptable CPC bid.

Returns the floor the platform will accept for this campaign, derived from the same logic the panel uses (admanager → effectively zero, custom &#x60;fx_minprice&#x60;, or the &#x60;min_prices_ron&#x60; table matched against the campaign\&#39;s targeting). Use this before bulk-updating bids so the optimiser doesn\&#39;t push values below the floor and have them clamped or rejected. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdMinBidGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1CampaignsTypeIdMinBidGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdMinBidGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsTypeIdMinBidGet200Response**](ApiV1CampaignsTypeIdMinBidGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Minimum bid. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypePost

> apiV1CampaignsTypePost(type, apiV1CampaignsTypePostRequest, dryRun, strict)

Create a new campaign (smart-default).

Creates a new campaign with sensible defaults applied for any field you don\&#39;t send. Required: &#x60;name&#x60; + &#x60;ad_type&#x60;. Everything else (targeting, capping, schedule, …) defaults to \&quot;all/none\&quot; unless explicitly supplied — see &#x60;GET /api/v1/campaigns/{type}/_schema&#x60; for the full field list.  The campaign always starts paused (&#x60;is_paused&#x3D;true&#x60;) so you can attach ads via &#x60;POST /api/v1/campaigns/{type}/{id}/ads&#x60; and verify before activating. Flip the active flag when ready via &#x60;PATCH /api/v1/campaigns/{type}/{id}/active&#x60;.  **Modes:**   - &#x60;?dry_run&#x3D;1&#x60; — validate and return the resolved field map     without inserting. Useful for previewing what an LLM would     create before charging it.   - &#x60;?strict&#x3D;1&#x60; — reject unknown field names with a 422 listing     them. Without this, unknown keys are silently ignored. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
    // ApiV1CampaignsTypePostRequest
    apiV1CampaignsTypePostRequest: {"name":"My first API campaign","ad_type":2},
    // '1' (optional)
    dryRun: dryRun_example,
    // '1' (optional)
    strict: strict_example,
  } satisfies ApiV1CampaignsTypePostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypePost(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |
| **apiV1CampaignsTypePostRequest** | [ApiV1CampaignsTypePostRequest](ApiV1CampaignsTypePostRequest.md) |  | |
| **dryRun** | `1` |  | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **strict** | `1` |  | [Optional] [Defaults to `undefined`] [Enum: 1] |

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
| **201** | Created. Body is the freshly-created campaign in the public projection (same shape as &#x60;GET /api/v1/campaigns/{type}/{id}&#x60;). |  -  |
| **200** | When &#x60;?dry_run&#x3D;1&#x60; — body is &#x60;{ dry_run: true, resolved: ..., would_insert: ... }&#x60;. |  -  |
| **422** | Validation error (missing required, unknown field with &#x60;?strict&#x3D;1&#x60;, …). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeSchemaAdsGet

> ApiV1CampaignsTypeSchemaAdsGet200Response apiV1CampaignsTypeSchemaAdsGet(type)

Field metadata for ad creation.

Discovery endpoint mirroring &#x60;/_schema&#x60; for campaigns, scoped to ads. Lists every public field a &#x60;POST /campaigns/{type}/{campaignId}/ads&#x60; accepts, with type, required-flag, default, example, and description. Also returns a &#x60;creative_choice&#x60; block reminding the caller that exactly one of &#x60;banner_pool_id&#x60; / &#x60;creative_id&#x60; / &#x60;banner_url&#x60; / &#x60;banner_html&#x60; / &#x60;video_pool_id&#x60; must be set.  Use the campaign-scoped variant &#x60;/api/v1/campaigns/{type}/{campaignId}/_schema/ads&#x60; to get the same payload narrowed to fields that apply to that specific campaign\&#39;s ad type (returns &#x60;campaign_ad_type&#x60; so AI agents know which creative shape is appropriate). 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeSchemaAdsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
  } satisfies ApiV1CampaignsTypeSchemaAdsGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeSchemaAdsGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |

### Return type

[**ApiV1CampaignsTypeSchemaAdsGet200Response**](ApiV1CampaignsTypeSchemaAdsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ad-create field metadata. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeSchemaGet

> ApiV1CampaignsTypeSchemaGet200Response apiV1CampaignsTypeSchemaGet(type)

Field metadata for create/update.

Discovery endpoint for AI agents and integrators. Returns the canonical list of public field names a &#x60;POST /api/v1/campaigns/{type}&#x60; accepts, with type, required-flag, default value, an example, and a one-line description. &#x60;ad_type&#x60; enumerates the active ad-type ids on the caller\&#39;s tenant.  Use this to drive form UIs, validate agent-generated payloads client-side, or feed into a function-calling LLM. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeSchemaGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal' | 'rtb'
    type: type_example,
  } satisfies ApiV1CampaignsTypeSchemaGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeSchemaGet(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal, rtb] |

### Return type

[**ApiV1CampaignsTypeSchemaGet200Response**](ApiV1CampaignsTypeSchemaGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schema. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

