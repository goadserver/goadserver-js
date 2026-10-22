# CampaignsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete**](CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceiddelete) | **DELETE** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId} | Remove an ad zone from a CPM campaign. |
| [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost**](CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceidpostoperation) | **POST** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId} | Add an ad zone to a CPM campaign (or re-price it). |
| [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut**](CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceidput) | **PUT** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId} | Switch a CPM campaign\&#39;s zone spot on or off. |
| [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut**](CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceidtypeputoperation) | **PUT** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId}/{type} | Set a CPM zone spot\&#39;s bid or state. |
| [**apiV1CampaignsGet**](CampaignsApi.md#apiv1campaignsget) | **GET** /api/v1/campaigns | List the caller\&#39;s campaigns across all types (or one type). |
| [**apiV1CampaignsMassDeletePost**](CampaignsApi.md#apiv1campaignsmassdeletepostoperation) | **POST** /api/v1/campaigns/mass-delete | Soft-delete many campaigns. |
| [**apiV1CampaignsMassTogglePut**](CampaignsApi.md#apiv1campaignsmasstoggleputoperation) | **PUT** /api/v1/campaigns/mass-toggle | Pause or resume many campaigns at once. |
| [**apiV1CampaignsMassUndeletePost**](CampaignsApi.md#apiv1campaignsmassundeletepost) | **POST** /api/v1/campaigns/mass-undelete | Restore soft-deleted campaigns. |
| [**apiV1CampaignsPurgePost**](CampaignsApi.md#apiv1campaignspurgepost) | **POST** /api/v1/campaigns/purge | Permanently delete soft-deleted campaigns and their ads. |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsget) | **GET** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | List per-zone bid overrides for a RON ad. |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsputoperation) | **PUT** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | Replace the per-zone bid overrides on a RON ad. |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidszoneiddelete) | **DELETE** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/{zoneId} | Clear a single per-zone bid override. |
| [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut**](CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidszonesonlyputoperation) | **PUT** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/zones-only | Switch \&quot;only these zones\&quot; mode for a RON ad\&#39;s per-zone bids. |
| [**apiV1CampaignsRonIdSiteListGet**](CampaignsApi.md#apiv1campaignsronidsitelistget) | **GET** /api/v1/campaigns/ron/{id}/site-list | The Premium-sites box of a RON campaign. |
| [**apiV1CampaignsRonIdSiteListSiteIdPut**](CampaignsApi.md#apiv1campaignsronidsitelistsiteidputoperation) | **PUT** /api/v1/campaigns/ron/{id}/site-list/{siteId} | Set one site of the Premium-sites box active or blocked. |
| [**apiV1CampaignsRonIdZonesGet**](CampaignsApi.md#apiv1campaignsronidzonesget) | **GET** /api/v1/campaigns/ron/{id}/zones | List the zones a RON campaign is linked to. |
| [**apiV1CampaignsRtbIdTestRtbGet**](CampaignsApi.md#apiv1campaignsrtbidtestrtbget) | **GET** /api/v1/campaigns/rtb/{id}/test-rtb | Context for testing an RTB campaign\&#39;s endpoint. |
| [**apiV1CampaignsRtbIdTestRtbPost**](CampaignsApi.md#apiv1campaignsrtbidtestrtbpost) | **POST** /api/v1/campaigns/rtb/{id}/test-rtb | Fire a test bid request at an RTB campaign\&#39;s endpoint. |
| [**apiV1CampaignsSaveCategoriesPut**](CampaignsApi.md#apiv1campaignssavecategoriesputoperation) | **PUT** /api/v1/campaigns/save-categories | Assign categories to many campaigns. |
| [**apiV1CampaignsSaveTagsPut**](CampaignsApi.md#apiv1campaignssavetagsputoperation) | **PUT** /api/v1/campaigns/save-tags | Assign tags (campaign groups) to many campaigns. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidactivepatch) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/active | Pause or unpause a single ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidbidpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bid | Set a single ad\&#39;s bid. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidbidspergeoputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bids-per-geo | Set per-country bids for a RON ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdClonePost**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidclonepost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/clone | Clone a single ad within a campaign. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidcountriesputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/countries | Set per-ad country targeting for a RON ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdDelete**](CampaignsApi.md#apiv1campaignstypecampaignidadsadiddelete) | **DELETE** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Soft-delete an ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdGet**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Show one ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidoverlaystatsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/overlay-stats | Shoppable video — shown and clicks per overlay. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Update an ad. |
| [**apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut**](CampaignsApi.md#apiv1campaignstypecampaignidadsadidrestoreput) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/restore | Restore a deleted RON ad. |
| [**apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet**](CampaignsApi.md#apiv1campaignstypecampaignidadscopytargetsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/copy-targets | Campaigns this campaign\&#39;s ads can be copied into. |
| [**apiV1CampaignsTypeCampaignIdAdsCsvImportPost**](CampaignsApi.md#apiv1campaignstypecampaignidadscsvimportpost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/csv-import | Import native ads from a CSV — one ad per row, or one ad per group. |
| [**apiV1CampaignsTypeCampaignIdAdsFromPoolPost**](CampaignsApi.md#apiv1campaignstypecampaignidadsfrompoolpostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/from-pool | Create ads from a creative pool. |
| [**apiV1CampaignsTypeCampaignIdAdsGet**](CampaignsApi.md#apiv1campaignstypecampaignidadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads | List ads on a campaign. |
| [**apiV1CampaignsTypeCampaignIdAdsMassClonePost**](CampaignsApi.md#apiv1campaignstypecampaignidadsmassclonepostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/mass-clone | Copy many ads of a campaign. |
| [**apiV1CampaignsTypeCampaignIdAdsMassDeletePost**](CampaignsApi.md#apiv1campaignstypecampaignidadsmassdeletepostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/mass-delete | Soft-delete many ads of a campaign. |
| [**apiV1CampaignsTypeCampaignIdAdsMassTogglePut**](CampaignsApi.md#apiv1campaignstypecampaignidadsmasstoggleputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/mass-toggle | Activate or pause many ads of a campaign at once. |
| [**apiV1CampaignsTypeCampaignIdAdsMultiUploadPost**](CampaignsApi.md#apiv1campaignstypecampaignidadsmultiuploadpost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/multi-upload | Bulk-upload ads — one ad per creative file. |
| [**apiV1CampaignsTypeCampaignIdAdsPost**](CampaignsApi.md#apiv1campaignstypecampaignidadspostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads | Create an ad on a campaign (smart-default). |
| [**apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsupdatepoolputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-pool | Point many ads at a different creative pool. |
| [**apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsupdateurlpoolputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-url-pool | Point many ads at a URL pool, or detach it. |
| [**apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsupdateurlputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-url | Rewrite the destination URL of many ads at once. |
| [**apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut**](CampaignsApi.md#apiv1campaignstypecampaignidadsupdateweightputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-weight | Set the rotation weight of one or more RON ads. |
| [**apiV1CampaignsTypeCampaignIdSchemaAdsGet**](CampaignsApi.md#apiv1campaignstypecampaignidschemaadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/_schema/ads | Field metadata for ad creation, scoped to a campaign. |
| [**apiV1CampaignsTypeIdActivePatch**](CampaignsApi.md#apiv1campaignstypeidactivepatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/active | Pause or unpause a campaign. |
| [**apiV1CampaignsTypeIdAvailableZonesGet**](CampaignsApi.md#apiv1campaignstypeidavailablezonesget) | **GET** /api/v1/campaigns/{type}/{id}/available-zones | List your ad zones that can be attached to a campaign. |
| [**apiV1CampaignsTypeIdBidsPatch**](CampaignsApi.md#apiv1campaignstypeidbidspatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/bids | Mass update bids on every ad in a campaign. |
| [**apiV1CampaignsTypeIdBudgetPatch**](CampaignsApi.md#apiv1campaignstypeidbudgetpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/budget | Update a campaign\&#39;s total and/or daily budget. |
| [**apiV1CampaignsTypeIdClonePost**](CampaignsApi.md#apiv1campaignstypeidclonepostoperation) | **POST** /api/v1/campaigns/{type}/{id}/clone | Clone a campaign — everything, or the parts you pick. |
| [**apiV1CampaignsTypeIdDelete**](CampaignsApi.md#apiv1campaignstypeiddelete) | **DELETE** /api/v1/campaigns/{type}/{id} | Soft-delete a campaign. |
| [**apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete**](CampaignsApi.md#apiv1campaignstypeidfiltersfiltertypefilteriddelete) | **DELETE** /api/v1/campaigns/{type}/{id}/filters/{filter_type}/{filter_id} | Detach a filter from this campaign. |
| [**apiV1CampaignsTypeIdFiltersGet**](CampaignsApi.md#apiv1campaignstypeidfiltersget) | **GET** /api/v1/campaigns/{type}/{id}/filters | List filters attached to this campaign. |
| [**apiV1CampaignsTypeIdFiltersPost**](CampaignsApi.md#apiv1campaignstypeidfilterspostoperation) | **POST** /api/v1/campaigns/{type}/{id}/filters | Attach a filter to this campaign. |
| [**apiV1CampaignsTypeIdGet**](CampaignsApi.md#apiv1campaignstypeidget) | **GET** /api/v1/campaigns/{type}/{id} | Get a single campaign. |
| [**apiV1CampaignsTypeIdMinBidGet**](CampaignsApi.md#apiv1campaignstypeidminbidget) | **GET** /api/v1/campaigns/{type}/{id}/min-bid | Get the campaign\&#39;s minimum acceptable CPC bid. |
| [**apiV1CampaignsTypeIdPatch**](CampaignsApi.md#apiv1campaignstypeidpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id} | Partially update a campaign. |
| [**apiV1CampaignsTypeIdResetMaxBudgetPut**](CampaignsApi.md#apiv1campaignstypeidresetmaxbudgetput) | **PUT** /api/v1/campaigns/{type}/{id}/reset-max-budget | Reset a campaign\&#39;s lifetime-budget spend. |
| [**apiV1CampaignsTypeIdSitesGet**](CampaignsApi.md#apiv1campaignstypeidsitesget) | **GET** /api/v1/campaigns/{type}/{id}/sites | Your sites that have zones attachable to a campaign. |
| [**apiV1CampaignsTypeIdWhitelistZonesGet**](CampaignsApi.md#apiv1campaignstypeidwhitelistzonesget) | **GET** /api/v1/campaigns/{type}/{id}/whitelist-zones | List the ad zones attached to a campaign. |
| [**apiV1CampaignsTypeIdZonesPost**](CampaignsApi.md#apiv1campaignstypeidzonespostoperation) | **POST** /api/v1/campaigns/{type}/{id}/zones | Attach ad zones to a campaign. |
| [**apiV1CampaignsTypeIdZonesZoneIdDelete**](CampaignsApi.md#apiv1campaignstypeidzoneszoneiddelete) | **DELETE** /api/v1/campaigns/{type}/{id}/zones/{zoneId} | Detach an ad zone from a campaign. |
| [**apiV1CampaignsTypeIdZonesZoneIdWeightPut**](CampaignsApi.md#apiv1campaignstypeidzoneszoneidweightputoperation) | **PUT** /api/v1/campaigns/{type}/{id}/zones/{zoneId}/weight | Set an attached zone\&#39;s weight for this campaign. |
| [**apiV1CampaignsTypePost**](CampaignsApi.md#apiv1campaignstypepostoperation) | **POST** /api/v1/campaigns/{type} | Create a new campaign (smart-default). |
| [**apiV1CampaignsTypeSchemaAdsGet**](CampaignsApi.md#apiv1campaignstypeschemaadsget) | **GET** /api/v1/campaigns/{type}/_schema/ads | Field metadata for ad creation. |
| [**apiV1CampaignsTypeSchemaGet**](CampaignsApi.md#apiv1campaignstypeschemaget) | **GET** /api/v1/campaigns/{type}/_schema | Field metadata for create/update. |
| [**apiV1RtbTestRtbContextGet**](CampaignsApi.md#apiv1rtbtestrtbcontextget) | **GET** /api/v1/rtb/test-rtb/context | Context for testing an endpoint before the campaign exists. |
| [**apiV1RtbTestRtbPost**](CampaignsApi.md#apiv1rtbtestrtbpostoperation) | **POST** /api/v1/rtb/test-rtb | Fire a test bid request at any endpoint URL. |
| [**apiV1ToolsReplaceDomainPut**](CampaignsApi.md#apiv1toolsreplacedomainputoperation) | **PUT** /api/v1/tools/replace-domain | Replace the landing domain across your RON ads. |



## apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete

> apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete(campaignId, spaceId)

Remove an ad zone from a CPM campaign.

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequest } from 'goadserver-sdk';

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
    spaceId: 56,
  } satisfies ApiV1CampaignsCpmCampaignIdSpotsSpaceIdDeleteRequest;

  try {
    const data = await api.apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete(body);
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
| **spaceId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Removed. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found, or &#x60;spot_not_found&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost

> apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost(campaignId, spaceId, apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest)

Add an ad zone to a CPM campaign (or re-price it).

Adds the zone as a spot of the campaign, or updates the bid when it is already one. &#x60;cpm&#x60; 0 / omitted takes the zone\&#39;s minimum CPM; a &#x60;cpm&#x60; under the minimum is raised to it; a Mini Network peer zone is also raised to the floor its publisher set for you. The zone must be yours or shared with you through an accepted Mini Network pair. Spot activity is recalculated from the campaign\&#39;s ads. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostOperationRequest } from 'goadserver-sdk';

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
    // number | Ad zone id.
    spaceId: 56,
    // ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest (optional)
    apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest: {"cpm":250,"bid_type":0},
  } satisfies ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostOperationRequest;

  try {
    const data = await api.apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost(body);
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
| **spaceId** | `number` | Ad zone id. | [Defaults to `undefined`] |
| **apiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest** | [ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest](ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest.md) |  | [Optional] |

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
| **201** | Spot saved (&#x60;cpm&#x60; is the stored, possibly raised, value). |  -  |
| **400** | &#x60;invalid_campaign_id&#x60; / &#x60;invalid_space_id&#x60;. |  -  |
| **403** | &#x60;forbidden&#x60; — the zone is not shared with you; or a pinned key. |  -  |
| **404** | Campaign (not a CPM / flat-request campaign of yours) or zone not found. |  -  |
| **500** | The Mini Network floor could not be read — retry. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut

> apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut(campaignId, spaceId)

Switch a CPM campaign\&#39;s zone spot on or off.

Without a sub-path this toggles the spot\&#39;s &#x60;isinuse&#x60;. Use &#x60;PUT …/spots/{spaceId}/bidding&#x60; to set the bid and &#x60;…/state&#x60; to set state explicitly. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequest } from 'goadserver-sdk';

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
    spaceId: 56,
  } satisfies ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPutRequest;

  try {
    const data = await api.apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut(body);
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
| **spaceId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Toggled. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found, or &#x60;zone_not_found&#x60; — not a spot of this campaign. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut

> apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut(campaignId, spaceId, type, apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest)

Set a CPM zone spot\&#39;s bid or state.

&#x60;type&#x3D;bidding&#x60;: &#x60;cpm&#x60; (cents CPM) &gt; 0 sets the bid, raised to the zone\&#39;s minimum and any Mini Network floor; &#x60;user_bid&#x60; defaults to &#x60;cpm&#x60;. &#x60;bid_type&#x60; (1 &#x3D; smart bidding) and &#x60;isinuse&#x60; (1 on, 0 off) change only when sent.  &#x60;type&#x3D;state&#x60;: &#x60;state&#x60; (-1, 0 or 1) and/or &#x60;isinuse&#x60;, each only when sent. The state is recalculated from the campaign\&#39;s ads right after, so it mostly reflects ad availability.  Any other &#x60;type&#x60; toggles &#x60;isinuse&#x60; like the plain PUT. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationRequest } from 'goadserver-sdk';

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
    spaceId: 56,
    // 'bidding' | 'state'
    type: type_example,
    // ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest
    apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest: {"cpm":320},
  } satisfies ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutOperationRequest;

  try {
    const data = await api.apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut(body);
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
| **spaceId** | `number` |  | [Defaults to `undefined`] |
| **type** | `bidding`, `state` |  | [Defaults to `undefined`] [Enum: bidding, state] |
| **apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest** | [ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest](ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest.md) |  | |

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
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found, or &#x60;zone_not_found&#x60; — not a spot of this campaign. |  -  |
| **500** | The Mini Network floor could not be read — retry. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsGet

> ApiV1CampaignsGet200Response apiV1CampaignsGet(type, deleted, page, perPage, fields)

List the caller\&#39;s campaigns across all types (or one type).

Returns the caller\&#39;s campaigns. By default each row carries a rich-but-bounded projection: identity (&#x60;id&#x60;, &#x60;name&#x60;, &#x60;campaign_type&#x60;, &#x60;ad_type&#x60; + &#x60;ad_type_label&#x60;, &#x60;selling_type&#x60;), lifecycle (&#x60;is_paused&#x60;, &#x60;is_active&#x60;, &#x60;is_deleted&#x60;, &#x60;is_complete&#x60;, &#x60;pending_state&#x60;), budget in main currency units (&#x60;daily_budget&#x60;, &#x60;total_budget&#x60;, &#x60;total_spent&#x60;, &#x60;use_campaign_budget&#x60;), impression limits (&#x60;use_maxday_impressions&#x60; / &#x60;maxday_impressions&#x60; per day and &#x60;use_maxtotal_impressions&#x60; / &#x60;maxtotal_impressions&#x60; for the campaign\&#39;s lifetime), targeting summary (&#x60;countries&#x60;, &#x60;languages&#x60;, &#x60;categories&#x60;, &#x60;device_type_ids&#x60;, …), capping, schedule (&#x60;use_start_date&#x60; / &#x60;start_date&#x60;, &#x60;use_end_date&#x60; / &#x60;end_date&#x60;), linked filter/pool ids, the campaign-form fields of &#x60;CampaignPanelFields&#x60; the row carries, and timestamps. The list does not read the options column, so option fields other than &#x60;priority&#x60; (&#x60;day_parting&#x60;, &#x60;av_check&#x60;, …) are returned by &#x60;GET /api/v1/campaigns/{type}/{id}&#x60; only. Spend per day and ad bids are not part of the campaign row — use &#x60;/api/v1/stats&#x60; and the ad endpoints.  Use &#x60;?fields&#x3D;&#x60; to opt in or out of fields:    - &#x60;?fields&#x3D;*&#x60; — return **every** column on the underlying     campaign row (70+ fields, type-dependent). Convenient for     AI agents that want the full picture in one call.   - &#x60;?fields&#x3D;name,daily_budget,countries&#x60; — narrow to just     those fields. &#x60;id&#x60; is always included.   - (omitted) — default rich projection above. 

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
    // boolean | true / 1 = list the soft-deleted campaigns instead (the panel\'s Deleted view); restore them with POST /api/v1/campaigns/mass-undelete. (optional)
    deleted: true,
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
| **deleted** | `boolean` | true / 1 &#x3D; list the soft-deleted campaigns instead (the panel\&#39;s Deleted view); restore them with POST /api/v1/campaigns/mass-undelete. | [Optional] [Defaults to `undefined`] |
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


## apiV1CampaignsMassDeletePost

> apiV1CampaignsMassDeletePost(apiV1CampaignsMassDeletePostRequest)

Soft-delete many campaigns.

Marks every listed campaign you own deleted (&#x60;isdeleted &#x3D; 1&#x60;; flat deals and direct deals: &#x60;iscancelled &#x3D; 1&#x60;). Their live ads are soft-deleted with them (marked as deleted-with-the-campaign), and &#x60;POST /api/v1/campaigns/mass-undelete&#x60; brings the campaigns and those ads back exactly as they were. A ron flat campaign\&#39;s pending marketplace flat-deal request is cancelled. Unlike the single &#x60;DELETE /api/v1/campaigns/{type}/{id}&#x60; this does not refuse a flat campaign with a live deal. Same handler as the panel. On a network that reviews campaign deletes, live ron campaigns go to Pending Delete instead and keep running until approved: &#x60;affected&#x60; counts what was deleted, &#x60;pending_review&#x60; what was sent for approval. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsMassDeletePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1CampaignsMassDeletePostRequest
    apiV1CampaignsMassDeletePostRequest: {"ids":[445071,445072],"type":"ron"},
  } satisfies ApiV1CampaignsMassDeletePostOperationRequest;

  try {
    const data = await api.apiV1CampaignsMassDeletePost(body);
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
| **apiV1CampaignsMassDeletePostRequest** | [ApiV1CampaignsMassDeletePostRequest](ApiV1CampaignsMassDeletePostRequest.md) |  | |

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
| **400** | &#x60;no_ids&#x60; / &#x60;invalid_type&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsMassTogglePut

> apiV1CampaignsMassTogglePut(apiV1CampaignsMassTogglePutRequest)

Pause or resume many campaigns at once.

Writes &#x60;ispaused&#x60; for every listed campaign you own. Same handler as the panel\&#39;s bulk Pause / Resume buttons, and like them it skips the per-campaign checks &#x60;PATCH …/{id}/active&#x60; makes (flat-deal rules, lifetime-budget cap): a campaign resumed here that is at its budget cap pauses itself again within about a minute. Use &#x60;PATCH /api/v1/campaigns/{type}/{id}/active&#x60; when you want those checks. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsMassTogglePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1CampaignsMassTogglePutRequest
    apiV1CampaignsMassTogglePutRequest: {"ids":[445071,445072],"type":"ron","pause":true},
  } satisfies ApiV1CampaignsMassTogglePutOperationRequest;

  try {
    const data = await api.apiV1CampaignsMassTogglePut(body);
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
| **apiV1CampaignsMassTogglePutRequest** | [ApiV1CampaignsMassTogglePutRequest](ApiV1CampaignsMassTogglePutRequest.md) |  | |

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
| **200** | Done. &#x60;affected&#x60; counts rows whose state changed; &#x60;pending&#x60; how many of those went to an admin for approval (Pending Pause / Pending Active) because the network validates campaign changes. |  -  |
| **400** | &#x60;no_ids&#x60; — empty &#x60;ids&#x60;; &#x60;invalid_type&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsMassUndeletePost

> apiV1CampaignsMassUndeletePost(apiV1CampaignsMassDeletePostRequest)

Restore soft-deleted campaigns.

Undoes a delete: &#x60;isdeleted &#x3D; 0&#x60; (flat / direct deals: &#x60;iscancelled &#x3D; 0&#x60;) for every listed campaign you own that is currently deleted. This is how a &#x60;DELETE /api/v1/campaigns/{type}/{id}&#x60; or a &#x60;mass-delete&#x60; is reversed. Find deleted campaigns with &#x60;GET /api/v1/campaigns?deleted&#x3D;1&#x60;.  The ads the delete took down with the campaign come back too; ads you had deleted one by one before stay deleted. A ron / cpm / rtb campaign returns paused or running as it was before the delete; a flat / direct deal deleted with the single &#x60;DELETE&#x60; comes back paused (resume it with &#x60;PATCH …/{id}/active&#x60;). Ads deleted together with a campaign before 2026-10-13 cannot be told apart from ones deleted individually and stay deleted — bring RON ads back with &#x60;PUT /api/v1/campaigns/ron/{campaignId}/ads/{adId}/restore&#x60; (list them with &#x60;GET …/ads?ad_state&#x3D;3&#x60;). A purged campaign cannot be restored. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsMassUndeletePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1CampaignsMassDeletePostRequest
    apiV1CampaignsMassDeletePostRequest: {"ids":[445071],"type":"ron"},
  } satisfies ApiV1CampaignsMassUndeletePostRequest;

  try {
    const data = await api.apiV1CampaignsMassUndeletePost(body);
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
| **apiV1CampaignsMassDeletePostRequest** | [ApiV1CampaignsMassDeletePostRequest](ApiV1CampaignsMassDeletePostRequest.md) |  | |

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
| **200** | Done. Ids that were not deleted are not counted. |  -  |
| **400** | &#x60;no_ids&#x60; / &#x60;invalid_type&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsPurgePost

> apiV1CampaignsPurgePost(apiV1CampaignsMassDeletePostRequest)

Permanently delete soft-deleted campaigns and their ads.

Hard-deletes listed campaigns that are already soft-deleted, with their ads. Irreversible — the rows are snapshotted into the action log first, but nothing can restore them. Ids that are not deleted (or not yours) are skipped. Same handler as the panel\&#39;s Purge. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsPurgePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1CampaignsMassDeletePostRequest
    apiV1CampaignsMassDeletePostRequest: {ids=[445071], type=ron},
  } satisfies ApiV1CampaignsPurgePostRequest;

  try {
    const data = await api.apiV1CampaignsPurgePost(body);
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
| **apiV1CampaignsMassDeletePostRequest** | [ApiV1CampaignsMassDeletePostRequest](ApiV1CampaignsMassDeletePostRequest.md) |  | |

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
| **200** | Done. &#x60;affected&#x60; &#x3D; rows removed (0 when no listed id was deleted). |  -  |
| **400** | &#x60;no_ids&#x60; / &#x60;invalid_type&#x60;. |  -  |
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


## apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut

> apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut(campaignId, adId, apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest)

Switch \&quot;only these zones\&quot; mode for a RON ad\&#39;s per-zone bids.

When on, the ad serves **only** on the zones listed in its per-zone bid map (&#x60;GET/PUT …/zone-bids&#x60;) — the panel\&#39;s \&quot;only these zones\&quot; switch on the Bids per zone tab. When off (default) the zone bids are overrides and every other zone uses the ad bid. Same write as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest
    apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest: {"bids_per_zone_only":true},
  } satisfies ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut(body);
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
| **apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest** | [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest](ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest.md) |  | |

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
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found on this campaign. |  -  |
| **422** | &#x60;bids_per_zone_only&#x60; missing, or an unknown field. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRonIdSiteListGet

> apiV1CampaignsRonIdSiteListGet(id, mainCatid, catids)

The Premium-sites box of a RON campaign.

The tenant\&#39;s site list filtered to the campaign\&#39;s categories, each with this campaign\&#39;s status (1 active, 0 blocked). Shown only when the tenant switched the Sites box on for your account or for all users; otherwise &#x60;visible: false&#x60; and an empty &#x60;data&#x60;. &#x60;editable&#x60; is false when an admin made this campaign\&#39;s list read only. Optional &#x60;main_catid&#x60; + &#x60;catids&#x60; filter on categories other than the saved ones. Display only — the ad server does not read it. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonIdSiteListGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    id: 56,
    // number (optional)
    mainCatid: 56,
    // string | Comma-separated category ids, with main_catid. (optional)
    catids: catids_example,
  } satisfies ApiV1CampaignsRonIdSiteListGetRequest;

  try {
    const data = await api.apiV1CampaignsRonIdSiteListGet(body);
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
| **mainCatid** | `number` |  | [Optional] [Defaults to `undefined`] |
| **catids** | `string` | Comma-separated category ids, with main_catid. | [Optional] [Defaults to `undefined`] |

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
| **200** | Sites box. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRonIdSiteListSiteIdPut

> apiV1CampaignsRonIdSiteListSiteIdPut(id, siteId, apiV1CampaignsRonIdSiteListSiteIdPutRequest)

Set one site of the Premium-sites box active or blocked.

&#x60;status&#x60; 1 &#x3D; active, 0 &#x3D; blocked. Refused (403) when the Sites box is not on for you or the campaign\&#39;s list is read only. Setting a site active needs the tenant\&#39;s minimum balance for Premium sites (422 with code &#x60;premium_sites_min_balance&#x60; and &#x60;amount&#x60;); blocking is always allowed. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonIdSiteListSiteIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    id: 56,
    // number
    siteId: 56,
    // ApiV1CampaignsRonIdSiteListSiteIdPutRequest
    apiV1CampaignsRonIdSiteListSiteIdPutRequest: {"status":0},
  } satisfies ApiV1CampaignsRonIdSiteListSiteIdPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsRonIdSiteListSiteIdPut(body);
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
| **siteId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsRonIdSiteListSiteIdPutRequest** | [ApiV1CampaignsRonIdSiteListSiteIdPutRequest](ApiV1CampaignsRonIdSiteListSiteIdPutRequest.md) |  | |

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
| **403** | &#x60;forbidden&#x60; — the box is not on for you or is read only; or a pinned key. |  -  |
| **404** | Campaign or site not found. |  -  |
| **422** | &#x60;validation_error&#x60; — status not 0/1; or the Premium-sites minimum balance. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRonIdZonesGet

> ApiV1CampaignsRonIdZonesGet200Response apiV1CampaignsRonIdZonesGet(id)

List the zones a RON campaign is linked to.

The campaign\&#39;s whitelist zones, the same list the panel shows on the campaign\&#39;s Ad Zones step: zone id, zone name, site and the campaign\&#39;s weight on that zone. The raw id list is also available as &#x60;wl_zoneids&#x60; on &#x60;GET /api/v1/campaigns/ron/{id}?fields&#x3D;*&#x60;. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRonIdZonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CampaignsRonIdZonesGetRequest;

  try {
    const data = await api.apiV1CampaignsRonIdZonesGet(body);
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

[**ApiV1CampaignsRonIdZonesGet200Response**](ApiV1CampaignsRonIdZonesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Linked zones (empty &#x60;data&#x60; when the campaign has none). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRtbIdTestRtbGet

> apiV1CampaignsRtbIdTestRtbGet(id)

Context for testing an RTB campaign\&#39;s endpoint.

The campaign\&#39;s &#x60;request_url&#x60;, &#x60;rtbtype&#x60; and ad type, the network\&#39;s common banner sizes, and the caller\&#39;s IP / user agent (the defaults the test sends). Same handler as the panel.

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRtbIdTestRtbGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CampaignsRtbIdTestRtbGetRequest;

  try {
    const data = await api.apiV1CampaignsRtbIdTestRtbGet(body);
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
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found (or the RTB module is off). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsRtbIdTestRtbPost

> RtbTestResult apiV1CampaignsRtbIdTestRtbPost(id, rtbTestRequest)

Fire a test bid request at an RTB campaign\&#39;s endpoint.

Sends one bid-style request to the campaign\&#39;s &#x60;request_url&#x60; (or &#x60;override_url&#x60;) the way the ad server would — OpenRTB 2.6 POST for &#x60;openrtb&#x60;, GET with macros for &#x60;json&#x60; / &#x60;json_bidder&#x60; / &#x60;xml&#x60; — and returns what was sent, what came back and a &#x60;verdict&#x60;: &#x60;ok&#x60; (a bid), &#x60;no_bid&#x60;, &#x60;http_error&#x60;, &#x60;network_error&#x60;. Only public hosts are reached (private / loopback / metadata addresses are refused with &#x60;error_category: blocked_url&#x60;). &#x60;bidfloor&#x60; and &#x60;best_price&#x60; are in the request\&#39;s currency units (&#x60;currency&#x60;, default USD). Nothing is stored. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsRtbIdTestRtbPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    id: 56,
    // RtbTestRequest (optional)
    rtbTestRequest: {"width":300,"height":250,"country":"US","domain":"example.com","bidfloor":0.5},
  } satisfies ApiV1CampaignsRtbIdTestRtbPostRequest;

  try {
    const data = await api.apiV1CampaignsRtbIdTestRtbPost(body);
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
| **rtbTestRequest** | [RtbTestRequest](RtbTestRequest.md) |  | [Optional] |

### Return type

[**RtbTestResult**](RtbTestResult.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Test result (also for a failed endpoint — see verdict). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found (or the RTB module is off). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsSaveCategoriesPut

> apiV1CampaignsSaveCategoriesPut(apiV1CampaignsSaveCategoriesPutRequest)

Assign categories to many campaigns.

Adds the category ids in &#x60;categories&#x60; (GET /api/v1/lookups/categories) to every listed campaign; &#x60;overwrite: true&#x60; replaces the campaigns\&#39; categories instead. Unknown category ids are dropped; none left → 400 &#x60;no_categories&#x60;. Same handler as the panel\&#39;s bulk Categories. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsSaveCategoriesPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1CampaignsSaveCategoriesPutRequest
    apiV1CampaignsSaveCategoriesPutRequest: {"ids":[445071],"type":"ron","categories":[3,7],"overwrite":true},
  } satisfies ApiV1CampaignsSaveCategoriesPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsSaveCategoriesPut(body);
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
| **apiV1CampaignsSaveCategoriesPutRequest** | [ApiV1CampaignsSaveCategoriesPutRequest](ApiV1CampaignsSaveCategoriesPutRequest.md) |  | |

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
| **400** | &#x60;no_ids&#x60;, &#x60;invalid_type&#x60;, or &#x60;no_categories&#x60; (no valid category id). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsSaveTagsPut

> apiV1CampaignsSaveTagsPut(apiV1CampaignsSaveTagsPutRequest)

Assign tags (campaign groups) to many campaigns.

Adds the tag ids in &#x60;tags&#x60; to every listed campaign (&#x60;groupid&#x60;); with &#x60;clear: true&#x60; the campaigns\&#39; tags are replaced by &#x60;tags&#x60; (an empty &#x60;tags&#x60; + &#x60;clear: true&#x60; removes all). Tag ids come from the campaign tags list. Same handler as the panel\&#39;s bulk Tags. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsSaveTagsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1CampaignsSaveTagsPutRequest
    apiV1CampaignsSaveTagsPutRequest: {"ids":[445071,445072],"type":"ron","tags":[12],"clear":false},
  } satisfies ApiV1CampaignsSaveTagsPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsSaveTagsPut(body);
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
| **apiV1CampaignsSaveTagsPutRequest** | [ApiV1CampaignsSaveTagsPutRequest](ApiV1CampaignsSaveTagsPutRequest.md) |  | |

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
| **400** | &#x60;no_ids&#x60; / &#x60;invalid_type&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch

> ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch(type, campaignId, adId, apiV1CampaignsTypeIdActivePatchRequest)

Pause or unpause a single ad.

Idempotent set. &#x60;active&#x3D;true&#x60; activates the ad, &#x60;active&#x3D;false&#x60; pauses it. Useful for granular pause/resume from an optimiser without touching the campaign-level pause state.  Same effect as the panel\&#39;s ad toggle: the pause/activate notification is sent, CPM zone states are recomputed, and on networks that validate changes to whitelist-zone RON campaigns the change is queued for approval — &#x60;pending_validation: true&#x60; in the response. 

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

[**ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response.md)

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

Updates one ad\&#39;s bid.  Bids are in **currency units of your account\&#39;s currency** (&#x60;0.05&#x60; &#x3D; 0.05), the same as the panel, and must be at least &#x60;GET /api/v1/campaigns/{type}/{id}/min-bid&#x60; (422 otherwise; &#x60;0&#x60; is allowed and stops the ad bidding). Reads return the bid as &#x60;bid_amount&#x60; in the same unit; &#x60;user_bid&#x60; / &#x60;bid&#x60; are the stored values in cents (your currency / the network\&#39;s main currency). Keys that wrote bids before 2026-10-12 keep the old raw-cents contract; every bid write echoes &#x60;bid_unit&#x60; (&#x60;currency&#x60; or &#x60;raw_cents&#x60;). 

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
    // 'ron' | 'cpm'
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
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


## apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut

> apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut(type, campaignId, adId, apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest)

Set per-country bids for a RON ad.

Replaces the ad\&#39;s whole per-country bid map (&#x60;ronads.bids_per_geo&#x60;) — send every country you want to keep; &#x60;[]&#x60; clears it. A bid of 0 removes that country. On CPC / CPM campaigns the ad server uses the visitor country\&#39;s bid in place of the ad bid (and skips smart bidding for that impression).  **Unit** — the same contract as the ad &#x60;bid&#x60; writes, echoed as &#x60;bid_unit&#x60;:  - &#x60;currency&#x60; (every key minted normally): the bid is in the   advertiser\&#39;s own currency, e.g. &#x60;0.08&#x60;. Stored as sent — this   column is kept in currency units (the ad server multiplies by 100   and converts to the network currency when it loads the ad), the   same as the panel\&#39;s Bids per country tab. - &#x60;raw_cents&#x60; (keys on the grandfathered raw-bid contract): send   cents, as for that key\&#39;s ad bids (&#x60;8&#x60; &#x3D; 0.08); divided by 100   before storage.  Per-country bids are not held to the ad format\&#39;s minimum bid (the panel does not check it either). Codes are two-letter country codes (case-insensitive, stored lowercase). Unknown fields → 422. RON campaigns only (&#x60;type&#x60; must be &#x60;ron&#x60;, else 400 &#x60;invalid_type&#x60;). 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest
    apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest: {"geo_bids":[{"code":"US","bid":0.08},{"code":"DE","bid":0.05}]},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut(body);
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
| **type** | `ron` |  | [Defaults to `undefined`] [Enum: ron] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest](ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest.md) |  | |

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
| **200** | Saved. &#x60;bids_per_geo&#x60; is the stored map in the caller\&#39;s unit. |  -  |
| **400** | &#x60;invalid_type&#x60; — not a RON campaign; &#x60;invalid_id&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found on this campaign. |  -  |
| **422** | Malformed body / unknown field, &#x60;geo_bids&#x60; missing, bad country code or negative bid. |  -  |

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


## apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut

> apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut(type, campaignId, adId, apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest)

Set per-ad country targeting for a RON ad.

Narrows one ad to a subset of countries (&#x60;ronads.countries&#x60;). An empty list means the ad runs wherever the campaign runs (the default). Codes are lowercased, de-duplicated and checked against the country table; unknown codes are dropped. The stored list is capped at 255 characters (~85 countries) → 422. Applies to every paytype. Same handler as the panel. RON campaigns only. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest
    apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest: {"countries":["us","ca"]},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut(body);
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
| **type** | `ron` |  | [Defaults to `undefined`] [Enum: ron] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest](ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest.md) |  | |

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
| **400** | &#x60;invalid_type&#x60; — not a RON campaign. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found on this campaign. |  -  |
| **422** | Too many countries. |  -  |

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


## apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet

> apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet(type, campaignId, adId, from, to)

Shoppable video — shown and clicks per overlay.

Per overlay of the ad\&#39;s video_overlays (index &#x3D; position in the list): how often it came on screen and how often it was clicked, with the click-through rate in percent. &#x60;from&#x60; / &#x60;to&#x60; (YYYY-MM-DD, UTC days, default the last 30 days, at most a year). Overlays removed from the ad since keep their numbers as type &#x60;removed&#x60;. The clicks are also the ad\&#39;s own clicks in the normal stats. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
    // Date (optional)
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet(body);
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
| **type** | `ron` |  | [Defaults to `undefined`] [Enum: ron] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |
| **from** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |

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
| **200** | &#x60;data&#x60; &#x3D; rows &#x60;{overlay, type, name, shown, clicks, ctr}&#x60;, plus &#x60;from&#x60; / &#x60;to&#x60;. |  -  |
| **404** | Ad not found (or not a ron ad). |  -  |
| **422** | &#x60;validation_error&#x60;: from / to. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdPut

> apiV1CampaignsTypeCampaignIdAdsAdIdPut(type, campaignId, adId, apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest)

Update an ad.

Partial update — the same handler the panel\&#39;s ad form saves through, with the same validation (per-format minimum bid, destination-URL rules, SmartAds &#x60;{spaceid}&#x60;, html video zones, native SmartAd html-only, creator pool orientation). Send only the fields to change. Accepts JSON or &#x60;multipart/form-data&#x60; (multipart adds the file inputs &#x60;banner_file&#x60;, &#x60;icon_file&#x60;, &#x60;image_file&#x60;, &#x60;video_file&#x60;, which replace that creative slot).  Field names are the ad\&#39;s column names. The create-style names &#x60;destination_url&#x60;, &#x60;display_url&#x60;, &#x60;preview_url&#x60;, &#x60;is_active&#x60;, &#x60;url_pool_id&#x60; are accepted as aliases (the column name wins if both are sent), so a create payload can be reused here.  Which columns exist depends on the campaign type: ron / cpm ads take every field below; flatrate / directdeal ads have no bid / sort / keyword / imptracking / icon / SmartAds columns, and those keys are dropped there. Unknown keys are ignored (not an error). &#x60;bansizeid&#x60; is locked after create and ignored.  Changing the destination URL (or rebuilding the creative) sends the ad back to review unless your account is auto-validated.  **Creative inputs** (rebuild the &#x60;creatives&#x60; blob, panel vocabulary): &#x60;banner_type&#x60; (&#x60;creative&#x60; / &#x60;pool&#x60; / &#x60;hotlink_image&#x60; / &#x60;hotlink_video&#x60; / &#x60;iframe&#x60; / &#x60;html&#x60;) with &#x60;creative_id&#x60; / &#x60;banner_pool_id&#x60; / &#x60;banner_url&#x60; / &#x60;banner_iframe_url&#x60; / &#x60;banner_html&#x60;; &#x60;image_type&#x60; (&#x60;creative&#x60; / &#x60;pool&#x60; / &#x60;html&#x60; / &#x60;none&#x60;) with &#x60;creative_id&#x60; / &#x60;image_pool_id&#x60; / &#x60;image_url&#x60; / &#x60;html_code&#x60; + &#x60;html_total_items&#x60; (&#x60;none&#x60; &#x3D; native text-only ad); &#x60;video_type&#x60; (&#x60;url&#x60; / &#x60;xml&#x60; / &#x60;html&#x60; / &#x60;creative&#x60; / &#x60;pool&#x60;) with &#x60;video_url&#x60; / &#x60;html_code&#x60; / &#x60;creative_id&#x60; / &#x60;video_pool_id&#x60;; &#x60;icon_type: creative&#x60; + &#x60;icon_id&#x60; (push icon). Or send &#x60;creatives&#x60; itself (object, as GET returns it, or a JSON string) to write the blob verbatim. 

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
    apiV1CampaignsTypeCampaignIdAdsAdIdPutRequest: {"bid":0.06,"destination_url":"https://example.com/new-lander?cid={clickid}"},
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **400** | &#x60;no_fields&#x60; — nothing to update. |  -  |
| **404** | Ad not found. |  -  |
| **413** | &#x60;payload_too_large&#x60;. |  -  |
| **422** | Validation error (bid floor, URL, SmartAds macro, creative mode). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut

> apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut(type, campaignId, adId)

Restore a deleted RON ad.

Undoes a soft delete (&#x60;is_deleted &#x3D; 0&#x60;, &#x60;pending_state &#x3D; 0&#x60;). The ad comes back in the state it was deleted in. List deleted ads with &#x60;GET …/ads?ad_state&#x3D;3&#x60;. Same handler as the panel. RON campaigns only. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron'
    type: type_example,
    // number
    campaignId: 56,
    // number
    adId: 56,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdRestorePutRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut(body);
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
| **type** | `ron` |  | [Defaults to `undefined`] [Enum: ron] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **adId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Restored. |  -  |
| **400** | &#x60;invalid_type&#x60; — not a RON campaign. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad not found on this campaign. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet

> apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet(type, campaignId)

Campaigns this campaign\&#39;s ads can be copied into.

Your live campaigns (other than this one) whose ads share this campaign\&#39;s ad format: RON and CPM, flat deals and direct deals, RTB alone. Use an &#x60;id&#x60; as &#x60;target_campaign_id&#x60; on &#x60;…/ads/mass-clone&#x60;. Narrowed to a key\&#39;s campaign pin. Same handler as the panel\&#39;s Copy to campaign… picker. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1CampaignsTypeCampaignIdAdsCopyTargetsGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Candidate campaigns, newest first per type. |  -  |
| **400** | &#x60;invalid_campaign_type&#x60;, &#x60;invalid_id&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsCsvImportPost

> ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response apiV1CampaignsTypeCampaignIdAdsCsvImportPost(type, campaignId, file, imageColumn, urlColumn, nameColumn, groupColumn, groups, folderId, folderName, folderPerGroup, namePrefix, squareMode, padColor, cropSquare, setActive, bid)

Import native ads from a CSV — one ad per row, or one ad per group.

&#x60;multipart/form-data&#x60;. Field &#x60;file&#x60; is a CSV (comma, semicolon or tab separated) with a header row. Each row names an image URL, a destination URL and optionally an ad name; the server fetches the image (public http/https only, max 20 MB), centre-crops it to 1:1 — by default PADDING the whole image onto a square canvas rather than cropping it, since a centre crop on a wide video still routinely removes the subject (&#x60;square_mode&#x60;) — and creates one native ad. Columns are chosen by header name via &#x60;image_column&#x60; / &#x60;url_column&#x60; / &#x60;name_column&#x60;, or guessed from common names (&#x60;image_url&#x60;, &#x60;thumbnail_url&#x60;, &#x60;destination_url&#x60;, &#x60;url&#x60;, &#x60;name&#x60;, ...). At most 100 rows per request; rows not started within 180s are reported as not attempted. Native campaigns only.  With &#x60;group_column&#x60; set the import switches to GROUPED mode: rows sharing that column\&#39;s value become ONE ad whose creatives live in a creative pool of their own, each pool item carrying its row\&#39;s destination URL tail in &#x60;url_prefix&#x60; so the image and its page stay paired. The ad\&#39;s destination URL is the group\&#39;s common base, cut back to the last &#x60;/&#x60;; rows of a group whose URL shares no base with the rest get their own pool + ad, named &#x60;&lt;group&gt; (2)&#x60;. Answer &#x60;groups&#x60; must be echoed back in the next request\&#39;s &#x60;groups&#x60; field when a group spans several requests, or it gets a second ad instead of reusing the first. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsCsvImportPostRequest } from 'goadserver-sdk';

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
    // Blob
    file: BINARY_DATA_HERE,
    // string (optional)
    imageColumn: imageColumn_example,
    // string (optional)
    urlColumn: urlColumn_example,
    // string (optional)
    nameColumn: nameColumn_example,
    // string | Header to group rows by. Omit for one ad per row. Never guessed. (optional)
    groupColumn: groupColumn_example,
    // string | The previous request\\\'s `groups` answer, verbatim, when a group spans requests. (optional)
    groups: groups_example,
    // number | Existing media-bank folder to file the creatives into. 0/absent = unfiled. (optional)
    folderId: 56,
    // string | Create-or-reuse a folder of this name under folder_id and file into it. (optional)
    folderName: folderName_example,
    // string | Grouped mode only: a subfolder per group that has more than one creative. A one-image group stays in the parent. (optional)
    folderPerGroup: folderPerGroup_example,
    // string | Prepended to every ad name, separated by a space. (optional)
    namePrefix: namePrefix_example,
    // string | How each image is squared. pad keeps the whole image and adds bars; crop keeps the centre square; none leaves it alone. (optional)
    squareMode: squareMode_example,
    // string | Bar colour for pad on a source with no alpha. PNG/GIF sources pad transparent instead. (optional)
    padColor: padColor_example,
    // string | Legacy: 0 = none, anything else = crop. square_mode takes precedence. (optional)
    cropSquare: cropSquare_example,
    // string (optional)
    setActive: setActive_example,
    // number (optional)
    bid: 8.14,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsCsvImportPostRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsCsvImportPost(body);
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
| **file** | `Blob` |  | [Defaults to `undefined`] |
| **imageColumn** | `string` |  | [Optional] [Defaults to `undefined`] |
| **urlColumn** | `string` |  | [Optional] [Defaults to `undefined`] |
| **nameColumn** | `string` |  | [Optional] [Defaults to `undefined`] |
| **groupColumn** | `string` | Header to group rows by. Omit for one ad per row. Never guessed. | [Optional] [Defaults to `undefined`] |
| **groups** | `string` | The previous request\\\&#39;s &#x60;groups&#x60; answer, verbatim, when a group spans requests. | [Optional] [Defaults to `undefined`] |
| **folderId** | `number` | Existing media-bank folder to file the creatives into. 0/absent &#x3D; unfiled. | [Optional] [Defaults to `undefined`] |
| **folderName** | `string` | Create-or-reuse a folder of this name under folder_id and file into it. | [Optional] [Defaults to `undefined`] |
| **folderPerGroup** | `0`, `1` | Grouped mode only: a subfolder per group that has more than one creative. A one-image group stays in the parent. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **namePrefix** | `string` | Prepended to every ad name, separated by a space. | [Optional] [Defaults to `undefined`] |
| **squareMode** | `pad`, `crop`, `none` | How each image is squared. pad keeps the whole image and adds bars; crop keeps the centre square; none leaves it alone. | [Optional] [Defaults to `&#39;pad&#39;`] [Enum: pad, crop, none] |
| **padColor** | `string` | Bar colour for pad on a source with no alpha. PNG/GIF sources pad transparent instead. | [Optional] [Defaults to `&#39;#FFFFFF&#39;`] |
| **cropSquare** | `0`, `1` | Legacy: 0 &#x3D; none, anything else &#x3D; crop. square_mode takes precedence. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **setActive** | `0`, `1` |  | [Optional] [Defaults to `&#39;1&#39;`] [Enum: 0, 1] |
| **bid** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response**](ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Per-row report. &#x60;rows[]&#x60; carries &#x60;row&#x60; (line in the file, header &#x3D; 1), &#x60;name&#x60;, &#x60;image_url&#x60;, &#x60;destination_url&#x60;, &#x60;status&#x60; (&#x60;created&#x60; / &#x60;failed&#x60;), &#x60;ad_id&#x60; + &#x60;creative_id&#x60; when created, &#x60;error&#x60; when failed. In grouped mode each row also carries &#x60;group&#x60;, &#x60;pool_id&#x60; and &#x60;pool_item_id&#x60;, the body carries &#x60;ad_count&#x60;, and &#x60;groups&#x60; maps each group to the &#x60;pool_id&#x60; / &#x60;ad_id&#x60; / &#x60;base&#x60; / &#x60;folder_id&#x60; to echo into the next request. The body\&#39;s &#x60;folder_id&#x60; is the parent the import filed into.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsFromPoolPost

> apiV1CampaignsTypeCampaignIdAdsFromPoolPost(type, campaignId, apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest)

Create ads from a creative pool.

A banner pool yields one ad per banner size it holds; a native / creator / video pool yields one ad referencing the whole pool. The pool must be yours and of a flavour the campaign\&#39;s ad type renders (422 otherwise), and for creator campaigns it must hold creatives of the campaign\&#39;s orientation.  &#x60;bid&#x60; uses the same unit contract as the other ad bid writes: **currency units** (the advertiser\&#39;s currency, e.g. &#x60;0.05&#x60;), checked against the ad format\&#39;s minimum bid and converted to the stored cents; keys on the grandfathered raw-bid contract write raw cents. Omit it (or 0) to leave the bid empty. &#x60;destinationurl&#x60; passes the single-ad checks (format, blocked domains). New ads start unvalidated unless the account is auto-validated. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest
    apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest: {"pool_id":812,"destinationurl":"https://example.com/lp?cid={clickid}","bid":0.05,"set_active":true},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsFromPoolPostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsFromPoolPost(body);
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
| **apiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest** | [ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest](ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest.md) |  | |

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
| **201** | Ads created. |  -  |
| **400** | &#x60;empty_pool&#x60;, &#x60;invalid_campaign_type&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Creative pool or campaign not found. |  -  |
| **422** | &#x60;pool_id&#x60; missing / wrong flavour / orientation misfit, invalid or blocked &#x60;destinationurl&#x60;, &#x60;bid&#x60; under the minimum, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsGet

> ApiV1CampaignsTypeCampaignIdAdsGet200Response apiV1CampaignsTypeCampaignIdAdsGet(type, campaignId, adState, search, sortBy, sortDir, page, perPage)

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
    // '1' | '2' | '3' | 1 = active only, 2 = inactive only, 3 = deleted only. Omit for every ad that isn\'t deleted. (optional)
    adState: adState_example,
    // string | Matches the ad id (exact, when numeric), title, destination URL and display URL. (optional)
    search: search_example,
    // 'id' | 'title' | 'bid' | 'user_bid' | 'isactive' | 'sort_weight' | 'position' | Omit for the panel\'s order: active first, then by position. (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
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
| **adState** | `1`, `2`, `3` | 1 &#x3D; active only, 2 &#x3D; inactive only, 3 &#x3D; deleted only. Omit for every ad that isn\&#39;t deleted. | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3] |
| **search** | `string` | Matches the ad id (exact, when numeric), title, destination URL and display URL. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `title`, `bid`, `user_bid`, `isactive`, `sort_weight`, `position` | Omit for the panel\&#39;s order: active first, then by position. | [Optional] [Defaults to `undefined`] [Enum: id, title, bid, user_bid, isactive, sort_weight, position] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |

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


## apiV1CampaignsTypeCampaignIdAdsMassClonePost

> apiV1CampaignsTypeCampaignIdAdsMassClonePost(type, campaignId, apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest)

Copy many ads of a campaign.

Bulk form of &#x60;POST …/ads/{adId}/clone&#x60;: each copy keeps every column of its source (including the active state) and starts unvalidated. At most 50 ids per call. An id that fails to copy (not in this campaign, deleted meanwhile) is listed in &#x60;failed&#x60;; the call fails only when nothing was copied. Same handler as the panel.  &#x60;target_campaign_id&#x60; copies into another of your campaigns instead (the panel\&#39;s Mass Actions → Copy to campaign…). The target must be live and take the same ads: RON ↔ CPM, flat deal ↔ direct deal, RTB → RTB — list them with &#x60;GET …/ads/copy-targets&#x60;. Copies into another campaign keep their title; all copies start unvalidated. A key pinned to campaigns needs the target on its pin too. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest
    apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest: {"ids":[3692752,3692753],"target_campaign_id":455210},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsMassClonePostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsMassClonePost(body);
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
| **apiV1CampaignsTypeCampaignIdAdsMassClonePostRequest** | [ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest](ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest.md) |  | |

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
| **200** | Copied. &#x60;target_campaign_id&#x60; / &#x60;target_type&#x60; name where the copies landed. |  -  |
| **400** | &#x60;no_ids&#x60;, &#x60;too_many_ids&#x60; (&gt; 50), &#x60;invalid_campaign_type&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;target_not_found&#x60; — not your live campaign, or its ads cannot take this campaign\&#39;s ads. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |
| **500** | &#x60;mass_clone_failed&#x60; — none of the ids could be copied. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsMassDeletePost

> apiV1CampaignsTypeCampaignIdAdsMassDeletePost(type, campaignId, apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest)

Soft-delete many ads of a campaign.

Soft delete (&#x60;is_deleted &#x3D; 1&#x60;); restore one with &#x60;PUT …/ads/{adId}/restore&#x60;. Ids outside the campaign are ignored. On tenants that validate connect-campaign changes the deletion is queued for publisher approval; a CPM campaign\&#39;s zone states are recomputed. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest
    apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest: {"ids":[3692752,3692753]},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsMassDeletePostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsMassDeletePost(body);
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
| **apiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest** | [ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest](ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest.md) |  | |

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
| **200** | Deleted. |  -  |
| **400** | &#x60;no_ids&#x60;, &#x60;invalid_campaign_type&#x60;, &#x60;invalid_id&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsMassTogglePut

> apiV1CampaignsTypeCampaignIdAdsMassTogglePut(type, campaignId, apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest)

Activate or pause many ads of a campaign at once.

The panel\&#39;s Mass Actions → Activate / Deactivate. &#x60;ids&#x60; selects ads of this campaign; an empty or missing list means **every** live ad of the campaign. Runs the same steps as the single toggle (&#x60;PATCH …/ads/{adId}/active&#x60;): on tenants that validate connect-campaign changes the ads are queued for publisher approval, one pause/activate notification is sent for the whole action, and a CPM campaign\&#39;s zone states are recomputed. Ids outside the campaign are ignored (not counted in &#x60;affected&#x60;). Same handler as the panel. Unknown body fields → 422 &#x60;unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest
    apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest: {"activate":false,"ids":[3692752,3692753]},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsMassTogglePutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsMassTogglePut(body);
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
| **apiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest** | [ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest](ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest.md) |  | |

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
| **400** | &#x60;invalid_campaign_type&#x60; / &#x60;invalid_id&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsMultiUploadPost

> apiV1CampaignsTypeCampaignIdAdsMultiUploadPost(type, campaignId, files, title, description, useOverlays, clonePerOverlay, overlay, overlaysZip)

Bulk-upload ads — one ad per creative file.

&#x60;multipart/form-data&#x60; upload of multiple creative files; the server creates one ad per file on the campaign. Field &#x60;files&#x60; (repeatable) carries the uploads. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequest } from 'goadserver-sdk';

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
    // Array<Blob> | One creative file per ad (also accepted as files[]).
    files: /path/to/file.txt,
    // string | Native campaigns only: headline for every ad in the batch. Empty = each file name. (optional)
    title: title_example,
    // string | Native campaigns only: description for every ad in the batch. (optional)
    description: description_example,
    // string | 1 = composite the PNG overlays sent on `overlay` / `overlays_zip` onto the uploaded images. (optional)
    useOverlays: useOverlays_example,
    // string | With use_overlays=1: create one variant per overlay instead of rotating the overlays across the files. (optional)
    clonePerOverlay: clonePerOverlay_example,
    // Array<Blob> | Overlay PNGs (repeatable, also accepted as overlay[]). Order sets the rotation. (optional)
    overlay: /path/to/file.txt,
    // Array<Blob> | ZIP archives of overlay PNGs (repeatable, also overlays_zip[]); entries are used in name order after the loose overlays. (optional)
    overlaysZip: /path/to/file.txt,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsMultiUploadPostRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsMultiUploadPost(body);
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
| **files** | `Array<Blob>` | One creative file per ad (also accepted as files[]). | |
| **title** | `string` | Native campaigns only: headline for every ad in the batch. Empty &#x3D; each file name. | [Optional] [Defaults to `undefined`] |
| **description** | `string` | Native campaigns only: description for every ad in the batch. | [Optional] [Defaults to `undefined`] |
| **useOverlays** | `0`, `1` | 1 &#x3D; composite the PNG overlays sent on &#x60;overlay&#x60; / &#x60;overlays_zip&#x60; onto the uploaded images. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **clonePerOverlay** | `0`, `1` | With use_overlays&#x3D;1: create one variant per overlay instead of rotating the overlays across the files. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **overlay** | `Array<Blob>` | Overlay PNGs (repeatable, also accepted as overlay[]). Order sets the rotation. | [Optional] |
| **overlaysZip** | `Array<Blob>` | ZIP archives of overlay PNGs (repeatable, also overlays_zip[]); entries are used in name order after the loose overlays. | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Per-file create results. |  -  |
| **201** | Ads created. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsPost

> apiV1CampaignsTypeCampaignIdAdsPost(type, campaignId, apiV1CampaignsTypeCampaignIdAdsPostRequest, dryRun, strict)

Create an ad on a campaign (smart-default).

Creates a new ad attached to the campaign. Two request modes, selected by &#x60;Content-Type&#x60;:  - **&#x60;application/json&#x60;** — reference an existing creative   (banner pool, single creative, URL, HTML or a native image);   no file upload. - **&#x60;multipart/form-data&#x60;** — upload a real creative file   directly: &#x60;banner_file&#x60; (banner image / HTML5 zip),   &#x60;icon_file&#x60;, &#x60;image_file&#x60; (native), or &#x60;video_file&#x60;,   alongside the text fields (&#x60;title&#x60;, &#x60;bid&#x60;,   &#x60;destination_url&#x60;, …). The server stores the file, creates   the creative row and attaches it — no pre-uploaded   &#x60;creative_id&#x60; needed.  Required (JSON mode): &#x60;title&#x60; + &#x60;bid&#x60; + exactly **one** creative reference (&#x60;banner_pool_id&#x60; / &#x60;creative_id&#x60; / &#x60;banner_url&#x60; / &#x60;banner_html&#x60; / &#x60;banner_iframe_url&#x60; / &#x60;video_url&#x60; / &#x60;video_pool_id&#x60; / &#x60;native_image_url&#x60; / &#x60;image_pool_id&#x60; / &#x60;html_code&#x60;). Push ads add their icon with &#x60;icon_id&#x60; on top of the image reference. &#x60;destination_url&#x60; is required unless the creative carries its own URL (popunder/JS, VAST, html video) or you set &#x60;url_pool_id&#x60;. In multipart mode the uploaded file *is* the creative reference.  **Same validation as the panel.** Both modes run the panel\&#39;s create checks: the per-format minimum bid, the destination-URL rules (format, blocked domains), the SmartAds &#x60;{spaceid}&#x60; macro requirement (paytype 4 campaigns), the html-video zone rule (an &#x60;html_code&#x60; video ad needs a Video Slider / In-page Video zone in the campaign whitelist), native SmartAds html-only, and the creator-pool orientation fit (&#x60;image_pool_id&#x60; on adtype 22). CPM campaigns get their zone states recomputed after the insert. &#x60;creative_id&#x60; / &#x60;icon_id&#x60; must be creatives from your own library.  **Field names.** The create names (&#x60;destination_url&#x60;, &#x60;display_url&#x60;, &#x60;preview_url&#x60;, &#x60;is_active&#x60;, &#x60;url_pool_id&#x60;) and the panel / PUT column names (&#x60;destinationurl&#x60;, &#x60;displayurl&#x60;, &#x60;previewurl&#x60;, &#x60;isactive&#x60;, &#x60;url_poolid&#x60;) are both accepted on create and on PUT, so one payload works for both. When both spellings are sent the create name wins here and the column name wins on PUT.  **Native ads (uploading a native creative by URL):**  The canonical field is &#x60;native_image_url&#x60; — a direct image URL. The native headline/body are taken from &#x60;title&#x60; + &#x60;description&#x60;, and &#x60;destination_url&#x60; is the click target; no creative pool needed. The server saves &#x60;creatives &#x3D; {\&quot;image\&quot;: {\&quot;type\&quot;: \&quot;url\&quot;, \&quot;url\&quot;: \&quot;…\&quot;}}&#x60;, which is the only shape the panel preview and the goadserver native-ad poll render.  Convenience for callers that don\&#39;t know the campaign\&#39;s ad type: on a native campaign (adtypeid 3 / 21 / 22 / 42) a &#x60;banner_url&#x60;, &#x60;banner_pool_id&#x60; or &#x60;creative_id&#x60; is **auto-routed** into &#x60;creatives.image.*&#x60; using the matching shape — i.e. &#x60;banner_url&#x60; becomes &#x60;{image:{type:url,url:…}}&#x60;, &#x60;banner_pool_id&#x60; becomes &#x60;{image:{type:pool,poolid:…}}&#x60;, &#x60;creative_id&#x60; becomes &#x60;{image:{type:creative,creative_id:…}}&#x60;. Banner-only shapes that have no native equivalent (&#x60;banner_html&#x60;, &#x60;banner_iframe_url&#x60;, &#x60;video_url&#x60;, &#x60;video_pool_id&#x60;) are rejected with a 422 on native campaigns rather than persisted as an unrenderable row.  New integrations should still send &#x60;native_image_url&#x60; explicitly — it\&#39;s the unambiguous, type-correct path.  **Modes:**   - &#x60;?dry_run&#x3D;1&#x60; — return the resolved field map + computed     &#x60;creatives&#x60; JSON without inserting.   - &#x60;?strict&#x3D;1&#x60; / &#x60;?strict&#x3D;0&#x60; — reject / ignore unknown field names     (default: the key\&#39;s setting, strict for keys created from 2026-10-12). 

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
    apiV1CampaignsTypeCampaignIdAdsPostRequest: {"title":"Flash sale","bid":0.03,"native_image_url":"https://cdn.example.com/push/sale.png","icon_id":1080977,"display_url":"example.com","description":"Ends tonight.","destination_url":"https://example.com/sale?cid={clickid}"},
    // '1' (optional)
    dryRun: dryRun_example,
    // '0' | '1' | `1` rejects unknown body fields (422 `unknown_fields`), `0` ignores them, for this request only. Omitted: the key\'s `strict_fields` setting (strict for keys created from 2026-10-12).  (optional)
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
| **strict** | `0`, `1` | &#x60;1&#x60; rejects unknown body fields (422 &#x60;unknown_fields&#x60;), &#x60;0&#x60; ignores them, for this request only. Omitted: the key\&#39;s &#x60;strict_fields&#x60; setting (strict for keys created from 2026-10-12).  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`, `multipart/form-data`
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


## apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut

> apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut(type, campaignId, apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest)

Point many ads at a different creative pool.

The panel\&#39;s bulk \&quot;Change creative pool\&quot;. &#x60;ids&#x60; selects ads (max 200; empty &#x3D; every ad of the campaign). Give either one &#x60;pool_id&#x60; for the whole selection or &#x60;pool_by_size&#x60; (&#x60;{bansizeid: poolid}&#x60;) for a banner selection running several sizes (it wins when both are sent). Only ads with a pool-shaped slot are touched; &#x60;include_unpooled: true&#x60; also converts ads that carry their own uploaded / hotlinked creative (that creative reference is replaced). Every target pool must be yours; native / creator pools must fit the campaign\&#39;s orientation (422 names the mismatch). List the pools a selection can take with the panel picker rules described on the ad schema. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest
    apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest: {"ids":[3692752,3692753],"pool_id":812},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut(body);
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
| **apiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest](ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest.md) |  | |

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
| **200** | Result counts. |  -  |
| **400** | &#x60;too_many_ads&#x60;, &#x60;no_pool_ads&#x60; (none of the selection takes a pool). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Creative pool not found. |  -  |
| **422** | &#x60;pool_id&#x60; missing, pool does not fit the ads / the campaign orientation, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut

> apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut(type, campaignId, apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest)

Point many ads at a URL pool, or detach it.

The panel\&#39;s bulk \&quot;Change URL pool\&quot;. &#x60;pool_id&#x60; &gt; 0 attaches that URL pool (it must be yours and hold at least one active URL); &#x60;pool_id: 0&#x60; detaches, so each ad falls back to its own destination URL — an ad with none stays on its pool and is counted in &#x60;no_fallback&#x60;. Ads whose creative links itself (html / iframe / VAST / phone) are &#x60;skipped&#x60;. &#x60;ids&#x60; max 200, empty &#x3D; every ad. Changed ads go back to review unless the account is auto-validated. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest
    apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest: {"ids":[3692752],"pool_id":44},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut(body);
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
| **apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest](ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest.md) |  | |

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
| **200** | Result counts. |  -  |
| **400** | &#x60;too_many_ads&#x60;, &#x60;no_url_pool_ads&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | URL pool not found, or &#x60;ads_not_found&#x60; — the selected ads no longer exist. |  -  |
| **422** | &#x60;pool_id&#x60; missing / negative, pool has no active URLs, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut

> apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut(type, campaignId, apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest)

Rewrite the destination URL of many ads at once.

The panel\&#39;s bulk \&quot;Change URL\&quot; action. Two modes:  - &#x60;set&#x60; (default) — write &#x60;url&#x60; onto every selected ad. - &#x60;replace&#x60; — substring find/replace (&#x60;find&#x60; → &#x60;replace&#x60;) inside   each ad\&#39;s own URL, e.g. to move a campaign to a new domain or   tracker id while per-ad paths and macros differ.  &#x60;ids&#x60; selects ads (max 200); empty &#x3D; every ad of the campaign. Only ads whose click target is their own destination URL are touched — ads on a URL pool, with a self-linking creative (html / iframe / VAST) or a phone number are reported as &#x60;skipped&#x60;. Every new URL passes the single-ad checks first (format, blocked domains); one bad URL fails the whole call before anything is written. Changed ads go back to review unless the account is auto-validated. Legacy shape &#x60;{adids, destinationurl}&#x60; is also accepted. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest
    apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest: {"mode":"replace","find":"old-lander.com","replace":"new-lander.com"},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut(body);
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
| **apiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest](ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest.md) |  | |

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
| **200** | Result counts. |  -  |
| **400** | &#x60;too_many_ads&#x60;, &#x60;invalid_mode&#x60;, or &#x60;no_ads_with_url&#x60; (every selected ad is on a URL pool / self-linking). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Missing &#x60;url&#x60; / &#x60;find&#x60;, or a resulting URL failed validation (message names the ad). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut

> apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut(type, campaignId, apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest)

Set the rotation weight of one or more RON ads.

Writes &#x60;sort_weight&#x60; on every listed ad of this campaign (the relative share an ad gets when the campaign rotates its ads by weight). Same handler as the panel. RON only. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron'
    type: type_example,
    // number
    campaignId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest
    apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest: {"adid":[3692752,3692753],"sort_weight":5},
  } satisfies ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut(body);
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
| **type** | `ron` |  | [Defaults to `undefined`] [Enum: ron] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest** | [ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest](ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest.md) |  | |

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
| **400** | &#x60;invalid_type&#x60; — not a RON campaign. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | No &#x60;adid&#x60;, or &#x60;unknown_fields&#x60;. |  -  |

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


## apiV1CampaignsTypeIdAvailableZonesGet

> apiV1CampaignsTypeIdAvailableZonesGet(type, id, page, perPage, search, siteId, excludeIds, onlyUsedSizes)

List your ad zones that can be attached to a campaign.

Your own, non-deleted ad zones matching the campaign\&#39;s ad type (and main category / native orientation where they apply), newest first, with &#x60;is_whitelisted&#x60; for the ones already attached. Paginated (&#x60;per_page&#x60; default 50, max 200). Same handler as the panel\&#39;s zone picker. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdAvailableZonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Matches zone name, site name or zone id. (optional)
    search: search_example,
    // number | Only zones of this site (GET …/sites). (optional)
    siteId: 56,
    // string | Comma-separated zone ids to leave out. (optional)
    excludeIds: excludeIds_example,
    // boolean | Banner campaigns: only zones whose size one of the campaign\'s live ads has. (optional)
    onlyUsedSizes: true,
  } satisfies ApiV1CampaignsTypeIdAvailableZonesGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdAvailableZonesGet(body);
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |
| **search** | `string` | Matches zone name, site name or zone id. | [Optional] [Defaults to `undefined`] |
| **siteId** | `number` | Only zones of this site (GET …/sites). | [Optional] [Defaults to `undefined`] |
| **excludeIds** | `string` | Comma-separated zone ids to leave out. | [Optional] [Defaults to `undefined`] |
| **onlyUsedSizes** | `boolean` | Banner campaigns: only zones whose size one of the campaign\&#39;s live ads has. | [Optional] [Defaults to `undefined`] |

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
| **200** | Zones. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | &#x60;validation_error&#x60; — type other than ron / cpm. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdBidsPatch

> ApiV1CampaignsTypeIdBidsPatch200Response apiV1CampaignsTypeIdBidsPatch(type, id, apiV1CampaignsTypeIdBidsPatchRequest)

Mass update bids on every ad in a campaign.

Update every (or a subset of) ad\&#39;s bid in one call. Three modes:    - &#x60;set&#x60;     — overwrite each target ad\&#39;s bid with &#x60;value&#x60;.   - &#x60;pct_inc&#x60; — raise each target ad\&#39;s bid by &#x60;pct&#x60; percent.   - &#x60;pct_dec&#x60; — lower each target ad\&#39;s bid by &#x60;pct&#x60; percent.  Optional &#x60;ad_ids&#x60; narrows the update to a subset (omit or empty list &#x3D; every non-deleted ad on the campaign). Bids are clamped at 0 — anything that would resolve below 0 is set to 0.  Bids are in **currency units of your account\&#39;s currency** (&#x60;0.05&#x60; &#x3D; 0.05), the same as the panel, and must be at least &#x60;GET /api/v1/campaigns/{type}/{id}/min-bid&#x60; (422 otherwise; &#x60;0&#x60; is allowed and stops the ad bidding). Reads return the bid as &#x60;bid_amount&#x60; in the same unit; &#x60;user_bid&#x60; / &#x60;bid&#x60; are the stored values in cents (your currency / the network\&#39;s main currency). Keys that wrote bids before 2026-10-12 keep the old raw-cents contract; every bid write echoes &#x60;bid_unit&#x60; (&#x60;currency&#x60; or &#x60;raw_cents&#x60;).  &#x60;pct_inc&#x60; / &#x60;pct_dec&#x60; scale the stored bid and user_bid alike. 

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
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdBidsPatchRequest
    apiV1CampaignsTypeIdBidsPatchRequest: {"mode":"set","value":0.05},
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
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


## apiV1CampaignsTypeIdBudgetPatch

> ApiV1CampaignsTypeIdBudgetPatch200Response apiV1CampaignsTypeIdBudgetPatch(type, id, apiV1CampaignsTypeIdBudgetPatchRequest)

Update a campaign\&#39;s total and/or daily budget.

Sets the campaign (total) budget and/or the max daily budget, plus the flags that enable each cap. All four fields are optional — send only the ones you want to change. Amounts are in the account currency. Documented in audit_20260723_1117 (was implemented but unspecified).  &#x60;max_day_budget&#x60; is corrected upward to the ad type\&#39;s configured minimum daily budget rather than rejected, matching every other write path. The stored amount is returned as &#x60;max_day_budget&#x60; in the response — read it back instead of assuming the value you sent. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdBudgetPatchOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeIdBudgetPatchRequest
    apiV1CampaignsTypeIdBudgetPatchRequest: ...,
  } satisfies ApiV1CampaignsTypeIdBudgetPatchOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdBudgetPatch(body);
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
| **apiV1CampaignsTypeIdBudgetPatchRequest** | [ApiV1CampaignsTypeIdBudgetPatchRequest](ApiV1CampaignsTypeIdBudgetPatchRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeIdBudgetPatch200Response**](ApiV1CampaignsTypeIdBudgetPatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated budget state |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |
| **422** | Invalid campaign id/type or body, or &#x60;budget_not_supported&#x60; — a flat deal or direct deal carries no budget columns. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdClonePost

> ApiV1CampaignsTypeIdClonePost201Response apiV1CampaignsTypeIdClonePost(type, id, strict, apiV1CampaignsTypeIdClonePostRequest)

Clone a campaign — everything, or the parts you pick.

Same core as the panel\&#39;s Duplicate button. The clone lands paused (&#x60;is_active&#x3D;false&#x60;; a network can make ron clones start active, and one that reviews new campaigns puts them in Pending Created) and named \&quot;&lt;original&gt; Copy\&quot; unless &#x60;name&#x60; is sent. By default every part is copied; the four &#x60;copy_*&#x60; switches (the Duplicate dialog\&#39;s choices, each default &#x60;true&#x60;) leave a part out, in which case the clone gets the table defaults for it:  - &#x60;copy_ads&#x60; — the campaign\&#39;s ads and creatives. - &#x60;copy_targeting&#x60; — countries/regions, categories, devices,   browsers, OS, languages, location, connection / carrier / ISP,   keywords, webview / adblock, orientation and the linked domain /   IP / retargeting filters. - &#x60;copy_budget&#x60; — total and daily budget, impression limits,   frequency capping, conversion capping. - &#x60;copy_schedule&#x60; — day/time parting and the start / end dates.  Bookkeeping (&#x60;num_ads&#x60;, &#x60;pending_state&#x60;, &#x60;dateadded&#x60;, &#x60;wl_zoneids&#x60;) is always reset. A RON clone also drops any flat-deal records, copies offer screenshots, and goes to review when the network validates campaigns. A flat campaign (paytype 5) can only be cloned by an administrator → 403 for API keys.  &#x60;copied&#x60; in the response echoes which parts were copied. Unknown body keys are ignored, or a 422 with &#x60;?strict&#x3D;1&#x60;. 

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
    // 0 | 1 | 1 = reject unknown body keys (422). (optional)
    strict: 56,
    // ApiV1CampaignsTypeIdClonePostRequest (optional)
    apiV1CampaignsTypeIdClonePostRequest: {"name":"Spring test B","copy_ads":false},
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
| **strict** | `0`, `1` | 1 &#x3D; reject unknown body keys (422). | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
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
| **403** | &#x60;forbidden&#x60; — a flat (paytype 5) campaign; or &#x60;forbidden_resource&#x60; (pinned key). |  -  |
| **404** | Source campaign not found or not owned by caller. |  -  |
| **422** | Invalid body (malformed JSON, or an unknown key with ?strict&#x3D;1), or the clone failed. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdDelete

> ApiV1CampaignsTypeIdDelete200Response apiV1CampaignsTypeIdDelete(type, id)

Soft-delete a campaign.

Sets &#x60;isdeleted&#x3D;1&#x60;, &#x60;dayactive&#x3D;0&#x60; (flatrate / directdeal: &#x60;iscancelled&#x3D;1&#x60;, &#x60;ispaused&#x3D;1&#x60;, &#x60;dayactive&#x3D;0&#x60;). The campaign and its history remain in the database for billing/stats reconciliation but stop serving immediately. Idempotent — deleting an already-deleted campaign returns 404. The campaign\&#39;s live ads are soft-deleted with it (marked as deleted-with-the-campaign; ads you had deleted yourself before stay as they were).  Undo with &#x60;POST /api/v1/campaigns/mass-undelete&#x60; &#x60;{ids:[id], type}&#x60;: the ads the delete took down come back, and a ron / cpm / rtb campaign returns paused or running as it was before the delete (a flat / direct deal comes back paused). Find deleted campaigns with &#x60;GET /api/v1/campaigns?deleted&#x3D;1&#x60;.  On a network that reviews campaign deletes, a live ron campaign (not a flat one) is not deleted: the answer is &#x60;deleted: false, pending_review: true&#x60;, the campaign keeps running with &#x60;pending_state: 2&#x60; (Pending Delete), and an admin\&#39;s approval deletes it. 

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

Block list: removes the campaign from the filter\&#39;s campaign list. Refused with 409 when that would widen the filter instead — &#x60;last_campaign&#x60; (it is the only listed campaign; an empty list means every campaign of the ad type) or &#x60;filter_not_campaign_scoped&#x60; (the filter covers every campaign anyway). Deactivate, delete or re-scope the filter (PUT /api/v1/filters/{type}/{id}) instead. Allow-list / &#x60;ip&#x60;: clears the campaign\&#39;s FK column only if it currently points to this filter; otherwise returns 404. 

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
    // 'ron' | 'cpm' | 'rtb'
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
| **type** | `ron`, `cpm`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, rtb] |
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
| **409** | &#x60;last_campaign&#x60; or &#x60;filter_not_campaign_scoped&#x60; — detaching would widen the filter. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdFiltersGet

> ApiV1CampaignsTypeIdFiltersGet200Response apiV1CampaignsTypeIdFiltersGet(type, id)

List filters attached to this campaign.

Returns every filter that reaches this campaign: allow-lists and the IP pool via the campaign\&#39;s FK columns, and block lists that either list it (&#x60;applies_to: listed_campaigns&#x60;, matching campaign_type) or cover it without a list (&#x60;all_campaigns&#x60; &#x3D; ad_type 0; &#x60;all_campaigns_of_ad_type&#x60; &#x3D; same ad type, empty list). &#x60;ron&#x60;, &#x60;cpm&#x60; and &#x60;rtb&#x60; campaigns support filter linkage. A cpm campaign takes &#x60;subid_incl&#x60;, &#x60;subid_excl&#x60;, &#x60;ip&#x60; and the domain / adzone / ISP block lists (block lists hold it as a &#x60;ron&#x60; campaign); &#x60;domain_incl&#x60; / &#x60;adzone_incl&#x60; are ron / rtb only → 422 &#x60;validation_error&#x60;. Any other type → 422 \&quot;Filter linking is only supported for campaign types: ron, cpm, rtb.\&quot; 

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
    // 'ron' | 'cpm' | 'rtb'
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
| **type** | `ron`, `cpm`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, rtb] |
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

Block lists (&#x60;*_excl&#x60;): adds the campaign to the filter\&#39;s campaign list. A filter that already covers the campaign (ad_type 0, or an empty list of the campaign\&#39;s ad type) is left alone — &#x60;changed: false&#x60; + &#x60;applies_to&#x60; — instead of being narrowed to this one campaign. Refused with 422 when the filter\&#39;s ad type differs from the campaign\&#39;s (the block would never apply) or when its list holds the other campaign kind (ron vs rtb). Allow-lists (&#x60;*_incl&#x60;) and &#x60;ip&#x60;: sets the campaign\&#39;s FK column to this filter (replacing any previous one of the same kind). 

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
    // 'ron' | 'cpm' | 'rtb'
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
| **type** | `ron`, `cpm`, `rtb` |  | [Defaults to `undefined`] [Enum: ron, cpm, rtb] |
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
| **422** | Unsupported filter_type / campaign type, or an ad_type / campaign-kind mismatch. |  -  |

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
    // 'ron' | 'cpm'
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
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
| **422** | &#x60;min_bid_not_supported&#x60; — flat deals are priced by the deal and RTB bids are set by the bidder, so neither has a per-click floor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdPatch

> apiV1CampaignsTypeIdPatch(type, id, apiV1CampaignsTypeIdPatchRequest, dryRun, strict)

Partially update a campaign.

Updates one or more writable fields on an existing campaign. Send only the fields you want to change — anything you omit is left alone. Field names are the public ones from &#x60;GET /api/v1/campaigns/{type}/_schema&#x60; (&#x60;daily_budget&#x60;, &#x60;regions&#x60;, &#x60;device_type_ids&#x60;, …).  **Region targeting (&#x60;regions&#x60;):** the server defensively trims any ancestor id whose descendant is also in the list, at any depth (continent → country → state → sub-region → city). If you send a higher-level id alongside one of its descendants, the higher-level id is dropped — sending both would otherwise broaden targeting back up to the whole subtree and undo the leaf pick. Use &#x60;GET /api/v1/lookups/regions&#x60; to walk the geo tree and pick the leaf id you actually want.  **&#x60;directdeal&#x60; / &#x60;flatrate&#x60;** take their own field set: &#x60;name&#x60;, &#x60;is_paused&#x60;, &#x60;start_date&#x60;, &#x60;total_days&#x60; (either alone — the other keeps its stored value; the end date is recomputed), &#x60;deal_type&#x60;, &#x60;total_budget&#x60;, &#x60;regions&#x60; (or legacy &#x60;countries&#x60;), &#x60;languages&#x60;, &#x60;device_type_ids&#x60;, &#x60;os_ids&#x60;, &#x60;browser_ids&#x60;, &#x60;max_impressions&#x60;, &#x60;percentage&#x60; (0-100), &#x60;use_keywords&#x60;, &#x60;keywords&#x60;, &#x60;keywords_exclude&#x60;. Any other field — including &#x60;ad_space_id&#x60;, which is fixed at create — answers &#x60;422 unsupported_fields&#x60; with the list, rather than being ignored.  Some fields cannot be changed via this endpoint:   - &#x60;ad_type&#x60; — the ads table layout differs per type, change     requires recreating the campaign.   - &#x60;id&#x60;, &#x60;userid&#x60;, &#x60;systemid&#x60;, &#x60;isdeleted&#x60;, &#x60;dateadded&#x60;, audit     stamps — system-managed.   - Read-only projection fields — &#x60;total_spent&#x60;, &#x60;sites_locked&#x60;,     &#x60;pending_state&#x60;, &#x60;num_ads&#x60;, &#x60;is_deleted&#x60;, &#x60;is_complete&#x60;,     &#x60;created_at&#x60;, &#x60;started_at&#x60;, &#x60;ended_at&#x60;, &#x60;last_paid_at&#x60; — are     ignored (rejected in strict mode).   - &#x60;selling_type&#x60; — a change is refused with 409; change it in     the panel.  The same save rules as the panel apply: &#x60;daily_budget&#x60; is raised to the system minimum, &#x60;total_budget&#x60; must be &gt; 0 while &#x60;use_campaign_budget&#x60; is true, an impression limit that is switched on needs a value &gt; 0, and &#x60;start_date&#x60; / &#x60;end_date&#x60; must be YYYY-MM-DD. Every campaign-form field of &#x60;CampaignPanelFields&#x60; is writable here too, with the same gates as on create (a field that does not apply is a &#x60;422&#x60;); object fields (&#x60;day_parting&#x60;, &#x60;conversion_capping&#x60;, …) merge with the stored value, and the other option keys are kept. &#x60;banner_size_ids&#x60; (rtb banner) replaces the size set. The change is recorded in the campaign history and mailed like a panel save.  **Modes:**   - &#x60;?dry_run&#x3D;1&#x60; — return the resolved field map without writing.   - &#x60;?strict&#x3D;1&#x60; / &#x60;?strict&#x3D;0&#x60; — reject / ignore unknown field names     (default: the key\&#39;s setting, strict for keys created from 2026-10-12). 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdPatchOperationRequest } from 'goadserver-sdk';

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
    // ApiV1CampaignsTypeIdPatchRequest
    apiV1CampaignsTypeIdPatchRequest: {"name":"Holiday banners — v2"},
    // '1' (optional)
    dryRun: dryRun_example,
    // '0' | '1' | `1` rejects unknown body fields (422 `unknown_fields`), `0` ignores them, for this request only. Omitted: the key\'s `strict_fields` setting (strict for keys created from 2026-10-12).  (optional)
    strict: strict_example,
  } satisfies ApiV1CampaignsTypeIdPatchOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdPatch(body);
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
| **apiV1CampaignsTypeIdPatchRequest** | [ApiV1CampaignsTypeIdPatchRequest](ApiV1CampaignsTypeIdPatchRequest.md) |  | |
| **dryRun** | `1` |  | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **strict** | `0`, `1` | &#x60;1&#x60; rejects unknown body fields (422 &#x60;unknown_fields&#x60;), &#x60;0&#x60; ignores them, for this request only. Omitted: the key\&#39;s &#x60;strict_fields&#x60; setting (strict for keys created from 2026-10-12).  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **200** | Updated. Body is the freshly-updated campaign in the public projection (same shape as &#x60;GET /api/v1/campaigns/{type}/{id}&#x60;). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | Validation error (empty body, no updatable fields, or unknown field in strict mode). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdResetMaxBudgetPut

> apiV1CampaignsTypeIdResetMaxBudgetPut(type, id)

Reset a campaign\&#39;s lifetime-budget spend.

Zeroes the spend counted against the campaign\&#39;s total budget (&#x60;campaignbudget&#x60;) and re-arms the \&quot;budget reached\&quot; email, so a campaign stopped by its lifetime budget can spend it again. The budget value itself is unchanged. Not for flatrate / directdeal (422 &#x60;budget_reset_not_supported&#x60;). Same handler as the panel\&#39;s Reset button. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdResetMaxBudgetPutRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1CampaignsTypeIdResetMaxBudgetPutRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdResetMaxBudgetPut(body);
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
| **200** | Reset. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | &#x60;validation_error&#x60; (unknown type) or &#x60;budget_reset_not_supported&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdSitesGet

> apiV1CampaignsTypeIdSitesGet(type, id, excludeIds)

Your sites that have zones attachable to a campaign.

Your own sites with the number of their zones that match the campaign (same rules as available-zones); sites with none are left out. Use a site\&#39;s &#x60;id&#x60; as &#x60;site_id&#x60; on available-zones. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdSitesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
    // string | Comma-separated zone ids to leave out of the counts. (optional)
    excludeIds: excludeIds_example,
  } satisfies ApiV1CampaignsTypeIdSitesGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdSitesGet(body);
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **excludeIds** | `string` | Comma-separated zone ids to leave out of the counts. | [Optional] [Defaults to `undefined`] |

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
| **200** | Sites. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | &#x60;validation_error&#x60; — type other than ron / cpm. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdWhitelistZonesGet

> apiV1CampaignsTypeIdWhitelistZonesGet(type, id)

List the ad zones attached to a campaign.

The campaign\&#39;s zone allow-list with each zone\&#39;s weight for this campaign (0–100, default 100). Only zones you own are returned. &#x60;owned&#x60; is false for a zone that is deleted. On an Ad Shop campaign the zone name is masked (\&quot;Space #N\&quot;) and &#x60;site&#x60; / &#x60;siteid&#x60; are left out unless you hold the source-names right. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdWhitelistZonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
  } satisfies ApiV1CampaignsTypeIdWhitelistZonesGetRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdWhitelistZonesGet(body);
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
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
| **200** | Attached zones. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | &#x60;validation_error&#x60; — type other than ron / cpm. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdZonesPost

> apiV1CampaignsTypeIdZonesPost(type, id, apiV1CampaignsTypeIdZonesPostRequest)

Attach ad zones to a campaign.

Adds zones to the campaign\&#39;s allow-list (kept ones stay) and connects each zone to the campaign at weight 100. Ids that are not yours, deleted, or don\&#39;t match the campaign\&#39;s ad type / main category / orientation are dropped; when none is left → 403 &#x60;not_allowed&#x60;. An empty list is a no-op 200. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdZonesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdZonesPostRequest
    apiV1CampaignsTypeIdZonesPostRequest: {"spaceids":[81234,81235]},
  } satisfies ApiV1CampaignsTypeIdZonesPostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdZonesPost(body);
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdZonesPostRequest** | [ApiV1CampaignsTypeIdZonesPostRequest](ApiV1CampaignsTypeIdZonesPostRequest.md) |  | |

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
| **200** | Attached. &#x60;added&#x60; &#x3D; zones that passed the checks. |  -  |
| **403** | &#x60;not_allowed&#x60; — no listed zone may be attached; or &#x60;forbidden_resource&#x60; (pinned key). |  -  |
| **404** | Campaign not found. |  -  |
| **422** | &#x60;validation_error&#x60; — type other than ron / cpm. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdZonesZoneIdDelete

> apiV1CampaignsTypeIdZonesZoneIdDelete(type, id, zoneId)

Detach an ad zone from a campaign.

Removes the zone from the allow-list and the campaign from the zone\&#39;s connected campaigns. Removing the last zone stores &#x60;0&#x60; (no allow-list). Detaching a zone that isn\&#39;t attached is a 200 no-op. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdZonesZoneIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
    // number
    zoneId: 56,
  } satisfies ApiV1CampaignsTypeIdZonesZoneIdDeleteRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdZonesZoneIdDelete(body);
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Detached. |  -  |
| **400** | &#x60;invalid_id&#x60; — bad zone id. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign not found. |  -  |
| **422** | &#x60;validation_error&#x60; — type other than ron / cpm. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeIdZonesZoneIdWeightPut

> apiV1CampaignsTypeIdZonesZoneIdWeightPut(type, id, zoneId, apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest)

Set an attached zone\&#39;s weight for this campaign.

The share of the zone\&#39;s traffic this campaign gets relative to the zone\&#39;s other connected campaigns, 0–100 (values outside are clamped). The zone must be yours and connected to the campaign. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // 'ron' | 'cpm'
    type: type_example,
    // number
    id: 56,
    // number
    zoneId: 56,
    // ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest
    apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest: {"weight":60},
  } satisfies ApiV1CampaignsTypeIdZonesZoneIdWeightPutOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeIdZonesZoneIdWeightPut(body);
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
| **type** | `ron`, `cpm` |  | [Defaults to `undefined`] [Enum: ron, cpm] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdZonesZoneIdWeightPutRequest** | [ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest](ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest.md) |  | |

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
| **200** | Saved (the clamped weight is echoed). |  -  |
| **400** | &#x60;invalid_id&#x60;, or &#x60;not_connected&#x60; — the zone is not attached to this campaign. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Campaign or zone not found. |  -  |
| **422** | &#x60;validation_error&#x60; — type other than ron / cpm. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypePost

> apiV1CampaignsTypePost(type, apiV1CampaignsTypePostRequest, dryRun, strict)

Create a new campaign (smart-default).

Creates a new campaign with sensible defaults applied for any field you don\&#39;t send. Everything not supplied defaults to \&quot;all/none\&quot; — see &#x60;GET /api/v1/campaigns/{type}/_schema&#x60; for the exact field list, which **differs by &#x60;type&#x60;**.  **Per campaign type:**   - &#x60;ron&#x60; / &#x60;cpm&#x60; / &#x60;rtb&#x60; — required &#x60;name&#x60; + &#x60;ad_type&#x60;; the     request body documented below applies.   - &#x60;directdeal&#x60; — books one of your own ad zones for a date     range. Required &#x60;name&#x60; + &#x60;ad_space_id&#x60; + &#x60;start_date&#x60; +     &#x60;total_days&#x60;; &#x60;ad_type&#x60; is taken from the zone and is not     accepted. Geo targeting takes &#x60;regions&#x60; (region ids from     &#x60;/api/v1/lookups/regions&#x60;, states and cities included), the     same as the other types; the legacy &#x60;countries&#x60; codes are     still accepted when &#x60;regions&#x60; is not sent. See     &#x60;GET /api/v1/campaigns/directdeal/_schema&#x60;.   - &#x60;rtb&#x60; — also requires &#x60;request_url&#x60; (unless &#x60;use_type: 1&#x60;, a     URL per zone in &#x60;zone_urls&#x60;), and for banner campaigns     (&#x60;ad_type: 2&#x60;) &#x60;banner_size_ids&#x60;. The daily cap applies only     with &#x60;use_daily_budget: true&#x60;; there is no total budget     (exchange-paced). A user locked to one RTB network always     lands on it.  Every campaign-form field is accepted (&#x60;CampaignPanelFields&#x60;: day parting and the other options, language / connection / carrier / IP / SubID targeting, pricing extras, RTB config, offers) with the panel\&#39;s own rules: the minimum daily budget, IP list syntax, source-optimizer ownership, and — on create — a real ad zone location for ron banner (2), ron/rtb link (6) and ron reel (20) campaigns where the network defines locations, link types or reel types (&#x60;location_ids&#x60; empty or &#x60;\&quot;0\&quot;&#x60; is a &#x60;422&#x60; there, as in the panel).   - &#x60;flatrate&#x60; — **not creatable through the public API** (the     legacy self-service ad-space buy is heading EOL). A POST     returns &#x60;422 unsupported_type&#x60;.  The campaign starts paused (&#x60;is_paused&#x3D;true&#x60;) so you can attach ads via &#x60;POST /api/v1/campaigns/{type}/{id}/ads&#x60; and verify before activating — unless you send &#x60;is_paused&#x60;, or the network has new ron campaigns start active. On a network that reviews new campaigns, a new ron campaign also shows &#x60;pending_state: 5&#x60; (Pending Created) until an admin approves it. Flip the active flag when ready via &#x60;PATCH /api/v1/campaigns/{type}/{id}/active&#x60;.  **Modes:**   - &#x60;?dry_run&#x3D;1&#x60; — validate and return the resolved field map     without inserting. Useful for previewing what an LLM would     create before charging it.   - &#x60;?strict&#x3D;1&#x60; / &#x60;?strict&#x3D;0&#x60; — reject / ignore unknown field names     for this request (422 &#x60;unknown_fields&#x60; listing them). Without     it the key\&#39;s default applies: keys created from 2026-10-12 are     strict, older keys ignore unknown fields. 

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
    apiV1CampaignsTypePostRequest: {"name":"My first API campaign","ad_type":11},
    // '1' (optional)
    dryRun: dryRun_example,
    // '0' | '1' | `1` rejects unknown body fields (422 `unknown_fields`), `0` ignores them, for this request only. Omitted: the key\'s `strict_fields` setting (strict for keys created from 2026-10-12).  (optional)
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
| **strict** | `0`, `1` | &#x60;1&#x60; rejects unknown body fields (422 &#x60;unknown_fields&#x60;), &#x60;0&#x60; ignores them, for this request only. Omitted: the key\&#39;s &#x60;strict_fields&#x60; setting (strict for keys created from 2026-10-12).  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **422** | Validation error (missing required, unknown field in strict mode (key default or &#x60;?strict&#x3D;1&#x60;), a field that does not apply to this campaign, …). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CampaignsTypeSchemaAdsGet

> ApiV1CampaignsTypeSchemaAdsGet200Response apiV1CampaignsTypeSchemaAdsGet(type)

Field metadata for ad creation.

Discovery endpoint mirroring &#x60;/_schema&#x60; for campaigns, scoped to ads. Lists every public field a &#x60;POST /campaigns/{type}/{campaignId}/ads&#x60; accepts, with type, required-flag, default, example, and description. Also returns a &#x60;creative_choice&#x60; block reminding the caller that exactly one of &#x60;banner_pool_id&#x60; / &#x60;creative_id&#x60; / &#x60;banner_url&#x60; / &#x60;banner_html&#x60; / &#x60;video_pool_id&#x60; must be set.  Use the campaign-scoped variant &#x60;/api/v1/campaigns/{type}/{campaignId}/_schema/ads&#x60; to get the same payload narrowed to fields that apply to that specific campaign\&#39;s ad type (returns &#x60;campaign_ad_type&#x60; so AI agents know which creative shape is appropriate). For native ad types (&#x60;campaign_ad_type&#x60; 3 / 21 / 22) the canonical URL field is &#x60;native_image_url&#x60;; &#x60;banner_url&#x60; works too because the server auto-routes it to &#x60;creatives.image&#x60; on a native campaign. 

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

> ApiV1CampaignsTypeSchemaGet200Response apiV1CampaignsTypeSchemaGet(type, adType)

Field metadata for create/update.

Discovery endpoint for AI agents and integrators. Returns the canonical list of public field names a &#x60;POST /api/v1/campaigns/{type}&#x60; accepts, with type, required-flag, default value, an example, and a one-line description. &#x60;ad_type&#x60; enumerates the active ad-type ids on the caller\&#39;s tenant.  The field set differs by &#x60;type&#x60; — &#x60;directdeal&#x60; returns its own ad-zone-booking fields (&#x60;ad_space_id&#x60;, &#x60;start_date&#x60;, &#x60;total_days&#x60;, …), not the RON-shaped targeting fields. &#x60;flatrate&#x60; is not creatable through the public API: its &#x60;_schema&#x60; returns &#x60;{creatable: false}&#x60; instead of a field list.  For &#x60;ron&#x60; / &#x60;cpm&#x60; / &#x60;rtb&#x60; the list is built from the campaign table\&#39;s real columns and the network\&#39;s modules: a field the type cannot store (keywords or schedule dates on rtb, total budget on rtb) or the network does not offer is not listed. It is exactly the set &#x60;?strict&#x3D;1&#x60; accepts on **both** &#x60;POST&#x60; and &#x60;PATCH&#x60;. &#x60;ad_types&#x60; / &#x60;selling_types&#x60; / &#x60;not_selling_types&#x60; on a field mean it only applies to those ad types / pay types; sending it to any other campaign is a &#x60;422&#x60;. &#x60;?ad_type&#x3D;&lt;id&gt;&#x60; narrows the list to one ad type.  Use this to drive form UIs, validate agent-generated payloads client-side, or feed into a function-calling LLM. 

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
    // number | Only list the fields that apply to this ad type. (optional)
    adType: 56,
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
| **adType** | `number` | Only list the fields that apply to this ad type. | [Optional] [Defaults to `undefined`] |

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


## apiV1RtbTestRtbContextGet

> apiV1RtbTestRtbContextGet(adtypeid, rtbtype)

Context for testing an endpoint before the campaign exists.

Same as the per-campaign context, for an unsaved endpoint — resolves &#x60;adtypeid&#x60; to the bid-request ad type. Same handler as the panel.

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1RtbTestRtbContextGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number (optional)
    adtypeid: 56,
    // 'openrtb' | 'json' | 'json_bidder' | 'xml' (optional)
    rtbtype: rtbtype_example,
  } satisfies ApiV1RtbTestRtbContextGetRequest;

  try {
    const data = await api.apiV1RtbTestRtbContextGet(body);
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
| **adtypeid** | `number` |  | [Optional] [Defaults to `1`] |
| **rtbtype** | `openrtb`, `json`, `json_bidder`, `xml` |  | [Optional] [Defaults to `&#39;openrtb&#39;`] [Enum: openrtb, json, json_bidder, xml] |

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
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1RtbTestRtbPost

> RtbTestResult apiV1RtbTestRtbPost(apiV1RtbTestRtbPostRequest)

Fire a test bid request at any endpoint URL.

The tester for an endpoint you are about to save on an RTB campaign: &#x60;url&#x60; (or &#x60;override_url&#x60;) + &#x60;rtbtype&#x60; + &#x60;adtypeid&#x60; come from the body instead of a campaign. Same safety rules and result as &#x60;POST /api/v1/campaigns/rtb/{id}/test-rtb&#x60;. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1RtbTestRtbPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1RtbTestRtbPostRequest
    apiV1RtbTestRtbPostRequest: {"url":"https://dsp.example.com/bid","rtbtype":"openrtb","adtypeid":1,"width":300,"height":250,"country":"US"},
  } satisfies ApiV1RtbTestRtbPostOperationRequest;

  try {
    const data = await api.apiV1RtbTestRtbPost(body);
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
| **apiV1RtbTestRtbPostRequest** | [ApiV1RtbTestRtbPostRequest](ApiV1RtbTestRtbPostRequest.md) |  | |

### Return type

[**RtbTestResult**](RtbTestResult.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Test result. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **422** | &#x60;url&#x60; missing. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ToolsReplaceDomainPut

> apiV1ToolsReplaceDomainPut(apiV1ToolsReplaceDomainPutRequest)

Replace the landing domain across your RON ads.

The panel\&#39;s Tools → Replace domain: in every live RON ad whose destination URL contains &#x60;search&#x60;, the first occurrence is replaced with &#x60;replace&#x60; (a domain). &#x60;campaignids&#x60; narrows it to those campaigns; empty &#x3D; every RON ad of the account. A key pinned to campaigns must list &#x60;campaignids&#x60;, all within its pin (403 &#x60;forbidden_resource&#x60; otherwise).  Same safeguards as a single-ad save: a resulting URL on a blocked domain fails the whole call before anything is written, and the changed ads go back to review unless the account is auto-validated. 

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from 'goadserver-sdk';
import type { ApiV1ToolsReplaceDomainPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // ApiV1ToolsReplaceDomainPutRequest
    apiV1ToolsReplaceDomainPutRequest: {"search":"old-lander.com","replace":"new-lander.com","campaignids":[451360]},
  } satisfies ApiV1ToolsReplaceDomainPutOperationRequest;

  try {
    const data = await api.apiV1ToolsReplaceDomainPut(body);
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
| **apiV1ToolsReplaceDomainPutRequest** | [ApiV1ToolsReplaceDomainPutRequest](ApiV1ToolsReplaceDomainPutRequest.md) |  | |

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
| **400** | &#x60;invalid_domain&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;search&#x60; / &#x60;replace&#x60; missing, blocked replacement domain, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

