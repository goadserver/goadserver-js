# goadserver-sdk@1.0.0

> Official JavaScript/TypeScript client for the REST API of [GoAdserver](https://www.goadserver.com), the hosted ad server. API documentation and how to create an API key: [GoAdserver API docs](https://www.goadserver.com/docs/api-keys/).

A TypeScript SDK client for the GoAdserver REST API.

## Usage

First, install the SDK from npm.

```bash
npm install goadserver-sdk --save
```

Next, try it out.


```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```


## Documentation

### API Endpoints

All URIs are relative to *https://up.go-adserver.com*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*AccountApi* | [**apiV1AccountGet**](docs/AccountApi.md#apiv1accountget) | **GET** /api/v1/account | Identity check — returns the authenticated user + scopes of the calling key.
*AdspacesApi* | [**apiV1AdspacesGet**](docs/AdspacesApi.md#apiv1adspacesget) | **GET** /api/v1/adspaces | List ad zones owned by the caller.
*AdspacesApi* | [**apiV1AdspacesIdGet**](docs/AdspacesApi.md#apiv1adspacesidget) | **GET** /api/v1/adspaces/{id} | Get a single adspace.
*CampaignsApi* | [**apiV1CampaignsGet**](docs/CampaignsApi.md#apiv1campaignsget) | **GET** /api/v1/campaigns | List the caller\&#39;s campaigns across all types (or one type).
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsget) | **GET** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | List per-zone bid overrides for a RON ad.
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsputoperation) | **PUT** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | Replace the per-zone bid overrides on a RON ad.
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidszoneiddelete) | **DELETE** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/{zoneId} | Clear a single per-zone bid override.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidactivepatch) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/active | Pause or unpause a single ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidbidpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bid | Set a single ad\&#39;s bid.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdClonePost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidclonepost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/clone | Clone a single ad within a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdDelete**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadiddelete) | **DELETE** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Soft-delete an ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Show one ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Update an ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads | List ads on a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsPost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadspostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads | Create an ad on a campaign (smart-default, JSON-only).
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdSchemaAdsGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidschemaadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/_schema/ads | Field metadata for ad creation, scoped to a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdActivePatch**](docs/CampaignsApi.md#apiv1campaignstypeidactivepatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/active | Pause or unpause a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdBidsPatch**](docs/CampaignsApi.md#apiv1campaignstypeidbidspatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/bids | Mass update bids on every ad in a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdClonePost**](docs/CampaignsApi.md#apiv1campaignstypeidclonepostoperation) | **POST** /api/v1/campaigns/{type}/{id}/clone | Clone a campaign and all its ads.
*CampaignsApi* | [**apiV1CampaignsTypeIdDelete**](docs/CampaignsApi.md#apiv1campaignstypeiddelete) | **DELETE** /api/v1/campaigns/{type}/{id} | Soft-delete a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete**](docs/CampaignsApi.md#apiv1campaignstypeidfiltersfiltertypefilteriddelete) | **DELETE** /api/v1/campaigns/{type}/{id}/filters/{filter_type}/{filter_id} | Detach a filter from this campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdFiltersGet**](docs/CampaignsApi.md#apiv1campaignstypeidfiltersget) | **GET** /api/v1/campaigns/{type}/{id}/filters | List filters attached to this campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdFiltersPost**](docs/CampaignsApi.md#apiv1campaignstypeidfilterspostoperation) | **POST** /api/v1/campaigns/{type}/{id}/filters | Attach a filter to this campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdGet**](docs/CampaignsApi.md#apiv1campaignstypeidget) | **GET** /api/v1/campaigns/{type}/{id} | Get a single campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdMinBidGet**](docs/CampaignsApi.md#apiv1campaignstypeidminbidget) | **GET** /api/v1/campaigns/{type}/{id}/min-bid | Get the campaign\&#39;s minimum acceptable CPC bid.
*CampaignsApi* | [**apiV1CampaignsTypePost**](docs/CampaignsApi.md#apiv1campaignstypepostoperation) | **POST** /api/v1/campaigns/{type} | Create a new campaign (smart-default).
*CampaignsApi* | [**apiV1CampaignsTypeSchemaAdsGet**](docs/CampaignsApi.md#apiv1campaignstypeschemaadsget) | **GET** /api/v1/campaigns/{type}/_schema/ads | Field metadata for ad creation.
*CampaignsApi* | [**apiV1CampaignsTypeSchemaGet**](docs/CampaignsApi.md#apiv1campaignstypeschemaget) | **GET** /api/v1/campaigns/{type}/_schema | Field metadata for create/update.
*CreativePoolsApi* | [**apiV1CreativePoolsGet**](docs/CreativePoolsApi.md#apiv1creativepoolsget) | **GET** /api/v1/creative-pools | List creative pools.
*CreativePoolsApi* | [**apiV1CreativePoolsIdClonePost**](docs/CreativePoolsApi.md#apiv1creativepoolsidclonepost) | **POST** /api/v1/creative-pools/{id}/clone | Clone a creative pool with all its items.
*CreativePoolsApi* | [**apiV1CreativePoolsIdDelete**](docs/CreativePoolsApi.md#apiv1creativepoolsiddelete) | **DELETE** /api/v1/creative-pools/{id} | Soft-delete a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdGet**](docs/CreativePoolsApi.md#apiv1creativepoolsidget) | **GET** /api/v1/creative-pools/{id} | Show a single creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsGet**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsget) | **GET** /api/v1/creative-pools/{id}/items | List items in a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsItemIdDelete**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsitemiddelete) | **DELETE** /api/v1/creative-pools/{id}/items/{itemId} | Soft-delete a single pool item.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsItemIdPut**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsitemidputoperation) | **PUT** /api/v1/creative-pools/{id}/items/{itemId} | Update a single pool item.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsItemIdTogglePut**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsitemidtoggleput) | **PUT** /api/v1/creative-pools/{id}/items/{itemId}/toggle | Toggle a pool item on / off.
*CreativePoolsApi* | [**apiV1CreativePoolsIdPut**](docs/CreativePoolsApi.md#apiv1creativepoolsidputoperation) | **PUT** /api/v1/creative-pools/{id} | Update creative pool meta.
*CreativePoolsApi* | [**apiV1CreativePoolsIdUsedInGet**](docs/CreativePoolsApi.md#apiv1creativepoolsidusedinget) | **GET** /api/v1/creative-pools/{id}/used-in | List campaigns / ads that reference this pool.
*CreativePoolsApi* | [**apiV1CreativePoolsPost**](docs/CreativePoolsApi.md#apiv1creativepoolspostoperation) | **POST** /api/v1/creative-pools | Create a creative pool.
*FiltersApi* | [**apiV1FiltersGet**](docs/FiltersApi.md#apiv1filtersget) | **GET** /api/v1/filters | List all filters across types.
*FiltersApi* | [**apiV1FiltersPost**](docs/FiltersApi.md#apiv1filterspostoperation) | **POST** /api/v1/filters | Create a filter and populate it with items.
*FiltersApi* | [**apiV1FiltersTypeIdActivePatch**](docs/FiltersApi.md#apiv1filterstypeidactivepatch) | **PATCH** /api/v1/filters/{type}/{id}/active | Activate or deactivate a filter (exclusion types only).
*FiltersApi* | [**apiV1FiltersTypeIdDelete**](docs/FiltersApi.md#apiv1filterstypeiddelete) | **DELETE** /api/v1/filters/{type}/{id} | Delete a filter (and its items, for IP pools).
*FiltersApi* | [**apiV1FiltersTypeIdGet**](docs/FiltersApi.md#apiv1filterstypeidget) | **GET** /api/v1/filters/{type}/{id} | Get a single filter with its items.
*FiltersApi* | [**apiV1FiltersTypeIdItemsItemDelete**](docs/FiltersApi.md#apiv1filterstypeiditemsitemdelete) | **DELETE** /api/v1/filters/{type}/{id}/items/{item} | Remove a single item from a filter.
*FiltersApi* | [**apiV1FiltersTypeIdItemsPost**](docs/FiltersApi.md#apiv1filterstypeiditemspostoperation) | **POST** /api/v1/filters/{type}/{id}/items | Add items to an existing filter.
*FundsApi* | [**apiV1FundsGet**](docs/FundsApi.md#apiv1fundsget) | **GET** /api/v1/funds | Current advertiser balance + pending deposits.
*PublicApi* | [**apiPublicOpenapiJsonGet**](docs/PublicApi.md#apipublicopenapijsonget) | **GET** /api/public/openapi.json | OpenAPI spec as JSON.
*PublicApi* | [**apiPublicOpenapiYamlGet**](docs/PublicApi.md#apipublicopenapiyamlget) | **GET** /api/public/openapi.yaml | Raw OpenAPI spec (this document).
*PublicApi* | [**apiPublicRoutesTxtGet**](docs/PublicApi.md#apipublicroutestxtget) | **GET** /api/public/routes.txt | Flat list of public routes — agent-friendly.
*RetargetingApi* | [**apiV1RetargetingPixelsGet**](docs/RetargetingApi.md#apiv1retargetingpixelsget) | **GET** /api/v1/retargeting/pixels | List the caller\&#39;s retargeting pixels.
*RetargetingApi* | [**apiV1RetargetingPixelsIdActivePatch**](docs/RetargetingApi.md#apiv1retargetingpixelsidactivepatch) | **PATCH** /api/v1/retargeting/pixels/{id}/active | Activate or deactivate a retargeting pixel.
*RetargetingApi* | [**apiV1RetargetingPixelsIdDelete**](docs/RetargetingApi.md#apiv1retargetingpixelsiddelete) | **DELETE** /api/v1/retargeting/pixels/{id} | Soft-delete a retargeting pixel and clear its captured visitors.
*RetargetingApi* | [**apiV1RetargetingPixelsIdGet**](docs/RetargetingApi.md#apiv1retargetingpixelsidget) | **GET** /api/v1/retargeting/pixels/{id} | Get one retargeting pixel.
*RetargetingApi* | [**apiV1RetargetingPixelsIdPut**](docs/RetargetingApi.md#apiv1retargetingpixelsidputoperation) | **PUT** /api/v1/retargeting/pixels/{id} | Rename a retargeting pixel.
*RetargetingApi* | [**apiV1RetargetingPixelsPost**](docs/RetargetingApi.md#apiv1retargetingpixelspostoperation) | **POST** /api/v1/retargeting/pixels | Create a retargeting pixel.
*SitesApi* | [**apiV1SitesGet**](docs/SitesApi.md#apiv1sitesget) | **GET** /api/v1/sites | List the caller\&#39;s websites.
*StatsAdvertiserApi* | [**apiV1AdvertiserStatsGet**](docs/StatsAdvertiserApi.md#apiv1advertiserstatsget) | **GET** /api/v1/advertiser/stats | Display, native and CPM/RON campaign stats.
*StatsAdvertiserOffersApi* | [**apiV1AdvertiserOffersStatsGet**](docs/StatsAdvertiserOffersApi.md#apiv1advertiseroffersstatsget) | **GET** /api/v1/advertiser/offers/stats | CPA / affiliate offer performance — advertiser side.
*StatsAdvertiserRTBApi* | [**apiV1AdvertiserRtbStatsGet**](docs/StatsAdvertiserRTBApi.md#apiv1advertiserrtbstatsget) | **GET** /api/v1/advertiser/rtb/stats | DSP / RTB-side stats.
*StatsAffiliateApi* | [**apiV1PublisherOffersStatsGet**](docs/StatsAffiliateApi.md#apiv1publisheroffersstatsget) | **GET** /api/v1/publisher/offers/stats | Affiliate / smartlink offer performance — publisher side.
*StatsPublisherApi* | [**apiV1PublisherStatsGet**](docs/StatsPublisherApi.md#apiv1publisherstatsget) | **GET** /api/v1/publisher/stats | Publisher earnings (sites / adzones).
*StatsPublisherSSPApi* | [**apiV1PublisherSspStatsGet**](docs/StatsPublisherSSPApi.md#apiv1publishersspstatsget) | **GET** /api/v1/publisher/ssp/stats | SSP / smart-campaign earnings.
*StatsPublisherSmartZonesApi* | [**apiV1PublisherSmartzonesStatsGet**](docs/StatsPublisherSmartZonesApi.md#apiv1publishersmartzonesstatsget) | **GET** /api/v1/publisher/smartzones/stats | SmartZone (waterfall) earnings.
*TrackingApi* | [**apiV1TrackingConversionTypesGet**](docs/TrackingApi.md#apiv1trackingconversiontypesget) | **GET** /api/v1/tracking/conversion-types | Available conversion types for the caller\&#39;s account.
*TrackingApi* | [**apiV1TrackingPixelsGet**](docs/TrackingApi.md#apiv1trackingpixelsget) | **GET** /api/v1/tracking/pixels | List the caller\&#39;s conversion-tracking pixels.
*TrackingApi* | [**apiV1TrackingPixelsIdDelete**](docs/TrackingApi.md#apiv1trackingpixelsiddelete) | **DELETE** /api/v1/tracking/pixels/{id} | Delete a pixel.
*TrackingApi* | [**apiV1TrackingPixelsIdGet**](docs/TrackingApi.md#apiv1trackingpixelsidget) | **GET** /api/v1/tracking/pixels/{id} | Get one pixel.
*TrackingApi* | [**apiV1TrackingPixelsIdPut**](docs/TrackingApi.md#apiv1trackingpixelsidputoperation) | **PUT** /api/v1/tracking/pixels/{id} | Update a pixel\&#39;s name or conversion type.
*TrackingApi* | [**apiV1TrackingPixelsPost**](docs/TrackingApi.md#apiv1trackingpixelspostoperation) | **POST** /api/v1/tracking/pixels | Create a new tracking pixel.
*URLPoolsApi* | [**apiV1UrlPoolsGet**](docs/URLPoolsApi.md#apiv1urlpoolsget) | **GET** /api/v1/url-pools | List URL pools.
*URLPoolsApi* | [**apiV1UrlPoolsIdClonePost**](docs/URLPoolsApi.md#apiv1urlpoolsidclonepost) | **POST** /api/v1/url-pools/{id}/clone | Clone a URL pool with all its URLs.
*URLPoolsApi* | [**apiV1UrlPoolsIdDelete**](docs/URLPoolsApi.md#apiv1urlpoolsiddelete) | **DELETE** /api/v1/url-pools/{id} | Soft-delete a URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdGet**](docs/URLPoolsApi.md#apiv1urlpoolsidget) | **GET** /api/v1/url-pools/{id} | Show one URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdPut**](docs/URLPoolsApi.md#apiv1urlpoolsidputoperation) | **PUT** /api/v1/url-pools/{id} | Update URL pool meta.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsGet**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsget) | **GET** /api/v1/url-pools/{id}/urls | List URLs in a pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsPost**](docs/URLPoolsApi.md#apiv1urlpoolsidurlspostoperation) | **POST** /api/v1/url-pools/{id}/urls | Add a URL to a pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdClonePost**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidclonepost) | **POST** /api/v1/url-pools/{id}/urls/{urlId}/clone | Clone a single URL within the same pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdDelete**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurliddelete) | **DELETE** /api/v1/url-pools/{id}/urls/{urlId} | Soft-delete a single URL.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdGet**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidget) | **GET** /api/v1/url-pools/{id}/urls/{urlId} | Show a single URL.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdPut**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidputoperation) | **PUT** /api/v1/url-pools/{id}/urls/{urlId} | Update a single URL.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdTogglePut**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidtoggleput) | **PUT** /api/v1/url-pools/{id}/urls/{urlId}/toggle | Toggle a URL on / off.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdWeightPut**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidweightputoperation) | **PUT** /api/v1/url-pools/{id}/urls/{urlId}/weight | Set a URL\&#39;s rotation weight.
*URLPoolsApi* | [**apiV1UrlPoolsIdUsedInGet**](docs/URLPoolsApi.md#apiv1urlpoolsidusedinget) | **GET** /api/v1/url-pools/{id}/used-in | List campaigns / ads that reference this URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsPost**](docs/URLPoolsApi.md#apiv1urlpoolspostoperation) | **POST** /api/v1/url-pools | Create a URL pool.


### Models

- [ApiKeyDetails](docs/ApiKeyDetails.md)
- [ApiKeyDetailsCreated](docs/ApiKeyDetailsCreated.md)
- [ApiV1AccountGet200Response](docs/ApiV1AccountGet200Response.md)
- [ApiV1AccountGet200ResponseApiKey](docs/ApiV1AccountGet200ResponseApiKey.md)
- [ApiV1AdspacesGet200Response](docs/ApiV1AdspacesGet200Response.md)
- [ApiV1AdspacesGet200ResponseDataInner](docs/ApiV1AdspacesGet200ResponseDataInner.md)
- [ApiV1AdspacesGet200ResponseDataInnerSite](docs/ApiV1AdspacesGet200ResponseDataInnerSite.md)
- [ApiV1CampaignsGet200Response](docs/ApiV1CampaignsGet200Response.md)
- [ApiV1CampaignsGet200ResponseDataInner](docs/ApiV1CampaignsGet200ResponseDataInner.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseZoneBidsInner](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseZoneBidsInner.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestZoneBidsInner](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestZoneBidsInner.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsGet200Response](docs/ApiV1CampaignsTypeCampaignIdAdsGet200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsPostRequest](docs/ApiV1CampaignsTypeCampaignIdAdsPostRequest.md)
- [ApiV1CampaignsTypeIdActivePatch200Response](docs/ApiV1CampaignsTypeIdActivePatch200Response.md)
- [ApiV1CampaignsTypeIdActivePatchRequest](docs/ApiV1CampaignsTypeIdActivePatchRequest.md)
- [ApiV1CampaignsTypeIdBidsPatch200Response](docs/ApiV1CampaignsTypeIdBidsPatch200Response.md)
- [ApiV1CampaignsTypeIdBidsPatchRequest](docs/ApiV1CampaignsTypeIdBidsPatchRequest.md)
- [ApiV1CampaignsTypeIdClonePost201Response](docs/ApiV1CampaignsTypeIdClonePost201Response.md)
- [ApiV1CampaignsTypeIdClonePostRequest](docs/ApiV1CampaignsTypeIdClonePostRequest.md)
- [ApiV1CampaignsTypeIdDelete200Response](docs/ApiV1CampaignsTypeIdDelete200Response.md)
- [ApiV1CampaignsTypeIdFiltersGet200Response](docs/ApiV1CampaignsTypeIdFiltersGet200Response.md)
- [ApiV1CampaignsTypeIdFiltersGet200ResponseFiltersInner](docs/ApiV1CampaignsTypeIdFiltersGet200ResponseFiltersInner.md)
- [ApiV1CampaignsTypeIdFiltersPost200Response](docs/ApiV1CampaignsTypeIdFiltersPost200Response.md)
- [ApiV1CampaignsTypeIdFiltersPostRequest](docs/ApiV1CampaignsTypeIdFiltersPostRequest.md)
- [ApiV1CampaignsTypeIdMinBidGet200Response](docs/ApiV1CampaignsTypeIdMinBidGet200Response.md)
- [ApiV1CampaignsTypePostRequest](docs/ApiV1CampaignsTypePostRequest.md)
- [ApiV1CampaignsTypeSchemaAdsGet200Response](docs/ApiV1CampaignsTypeSchemaAdsGet200Response.md)
- [ApiV1CampaignsTypeSchemaGet200Response](docs/ApiV1CampaignsTypeSchemaGet200Response.md)
- [ApiV1CampaignsTypeSchemaGet200ResponseFieldsInner](docs/ApiV1CampaignsTypeSchemaGet200ResponseFieldsInner.md)
- [ApiV1CreativePoolsGet200Response](docs/ApiV1CreativePoolsGet200Response.md)
- [ApiV1CreativePoolsGet200ResponseDataInner](docs/ApiV1CreativePoolsGet200ResponseDataInner.md)
- [ApiV1CreativePoolsIdClonePost201Response](docs/ApiV1CreativePoolsIdClonePost201Response.md)
- [ApiV1CreativePoolsIdDelete200Response](docs/ApiV1CreativePoolsIdDelete200Response.md)
- [ApiV1CreativePoolsIdDelete409Response](docs/ApiV1CreativePoolsIdDelete409Response.md)
- [ApiV1CreativePoolsIdGet200Response](docs/ApiV1CreativePoolsIdGet200Response.md)
- [ApiV1CreativePoolsIdItemsItemIdPutRequest](docs/ApiV1CreativePoolsIdItemsItemIdPutRequest.md)
- [ApiV1CreativePoolsIdPutRequest](docs/ApiV1CreativePoolsIdPutRequest.md)
- [ApiV1CreativePoolsIdUsedInGet200Response](docs/ApiV1CreativePoolsIdUsedInGet200Response.md)
- [ApiV1CreativePoolsPostRequest](docs/ApiV1CreativePoolsPostRequest.md)
- [ApiV1FiltersGet200Response](docs/ApiV1FiltersGet200Response.md)
- [ApiV1FiltersPostRequest](docs/ApiV1FiltersPostRequest.md)
- [ApiV1FiltersTypeIdActivePatch200Response](docs/ApiV1FiltersTypeIdActivePatch200Response.md)
- [ApiV1FiltersTypeIdItemsItemDelete200Response](docs/ApiV1FiltersTypeIdItemsItemDelete200Response.md)
- [ApiV1FiltersTypeIdItemsPost200Response](docs/ApiV1FiltersTypeIdItemsPost200Response.md)
- [ApiV1FiltersTypeIdItemsPostRequest](docs/ApiV1FiltersTypeIdItemsPostRequest.md)
- [ApiV1FundsGet200Response](docs/ApiV1FundsGet200Response.md)
- [ApiV1RetargetingPixelsGet200Response](docs/ApiV1RetargetingPixelsGet200Response.md)
- [ApiV1RetargetingPixelsIdActivePatch200Response](docs/ApiV1RetargetingPixelsIdActivePatch200Response.md)
- [ApiV1RetargetingPixelsIdPutRequest](docs/ApiV1RetargetingPixelsIdPutRequest.md)
- [ApiV1RetargetingPixelsPostRequest](docs/ApiV1RetargetingPixelsPostRequest.md)
- [ApiV1SitesGet200Response](docs/ApiV1SitesGet200Response.md)
- [ApiV1SitesGet200ResponseDataInner](docs/ApiV1SitesGet200ResponseDataInner.md)
- [ApiV1TrackingConversionTypesGet200Response](docs/ApiV1TrackingConversionTypesGet200Response.md)
- [ApiV1TrackingPixelsGet200Response](docs/ApiV1TrackingPixelsGet200Response.md)
- [ApiV1TrackingPixelsIdPutRequest](docs/ApiV1TrackingPixelsIdPutRequest.md)
- [ApiV1TrackingPixelsPostRequest](docs/ApiV1TrackingPixelsPostRequest.md)
- [ApiV1UrlPoolsIdPutRequest](docs/ApiV1UrlPoolsIdPutRequest.md)
- [ApiV1UrlPoolsIdUrlsPostRequest](docs/ApiV1UrlPoolsIdUrlsPostRequest.md)
- [ApiV1UrlPoolsIdUrlsUrlIdPutRequest](docs/ApiV1UrlPoolsIdUrlsUrlIdPutRequest.md)
- [ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest](docs/ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest.md)
- [ApiV1UrlPoolsPostRequest](docs/ApiV1UrlPoolsPostRequest.md)
- [FilterDetail](docs/FilterDetail.md)
- [FilterDetailAllOfRanges](docs/FilterDetailAllOfRanges.md)
- [FilterSummary](docs/FilterSummary.md)
- [ModelError](docs/ModelError.md)
- [ResourceFilter](docs/ResourceFilter.md)
- [RetargetingPixel](docs/RetargetingPixel.md)
- [StatsResponse](docs/StatsResponse.md)
- [TrackingPixel](docs/TrackingPixel.md)

### Authorization


Authentication schemes defined for the API:
<a id="apiKey"></a>
#### apiKey


- **Type**: HTTP Bearer Token authentication (gas_live_<32 chars>)

## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0`
- Package version: `1.0.0`
- Generator version: `7.21.0`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system


## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

### Publishing

Once you've built the package, you can publish it to npm:

```bash
npm publish
```

## License

[]()
