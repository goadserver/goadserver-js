
# ApiV1CampaignsTypeIdPatchRequest


## Properties

Name | Type
------------ | -------------
`groupid` | string
`displayOptions` | string
`minRank` | number
`fxRating` | number
`mailCampaignBudget` | boolean
`useDynamicCosts` | boolean
`dynamicCostsIncrease` | number
`conversionCapping` | [CampaignPanelFieldsConversionCapping](CampaignPanelFieldsConversionCapping.md)
`fixCpa` | number
`fixCpaConvTypes` | string
`booster` | boolean
`boosterSettings` | [CampaignPanelFieldsBoosterSettings](CampaignPanelFieldsBoosterSettings.md)
`defaultBidType` | number
`sortType` | number
`asFailover` | boolean
`dayParting` | [CampaignPanelFieldsDayParting](CampaignPanelFieldsDayParting.md)
`screens` | [CampaignPanelFieldsScreens](CampaignPanelFieldsScreens.md)
`displayTimes` | string
`displayDays` | string
`siteLanguages` | string
`connectionTypes` | string
`carrierIds` | string
`ratingId` | number
`orientation` | string
`siteMode` | number
`onlyTaggedZones` | boolean
`skipLowQuality` | number
`ipWhitelist` | string
`ipBlacklist` | string
`avCheck` | [CampaignPanelFieldsAvCheck](CampaignPanelFieldsAvCheck.md)
`emailType` | number
`useSubscriptionAge` | boolean
`subscriptionAge` | number
`instantImpression` | boolean
`subidList` | string
`subidListMode` | string
`sourceOptimizerIds` | string
`wlZoneIds` | string
`feedId` | number
`feedSettings` | [CampaignPanelFieldsFeedSettings](CampaignPanelFieldsFeedSettings.md)
`priority` | [ApiV1CampaignsTypePostRequestAllOfPriority](ApiV1CampaignsTypePostRequestAllOfPriority.md)
`suggestions` | [CampaignPanelFieldsSuggestions](CampaignPanelFieldsSuggestions.md)
`hideReferrer` | boolean
`logConvAsPaid` | boolean
`aboutSettings` | [CampaignPanelFieldsAboutSettings](CampaignPanelFieldsAboutSettings.md)
`useLiveFeed` | boolean
`liveFeedParentId` | number
`liveFeedSettings` | { [key: string]: any; }
`offerTypeId` | number
`description` | string
`destinationUrl` | string
`previewUrl` | string
`rtbNetworkId` | number
`rtbType` | string
`useType` | number
`zoneUrls` | Array&lt;object&gt;
`bidAction` | number
`useQps` | boolean
`qps` | number
`rtbCategories` | string
`useApi` | boolean
`apiData` | { [key: string]: any; }
`logSkipped` | boolean
`domainMask` | [CampaignPanelFieldsDomainMask](CampaignPanelFieldsDomainMask.md)
`rtbXmlMarkup` | boolean
`name` | string
`requestUrl` | string
`bannerSizeIds` | [ApiV1CampaignsTypeIdPatchRequestAllOfBannerSizeIds](ApiV1CampaignsTypeIdPatchRequestAllOfBannerSizeIds.md)
`dailyBudget` | number
`totalBudget` | number
`useCampaignBudget` | boolean
`sellingType` | number
`useDailyBudget` | boolean
`useBudgetSpreading` | boolean
`useMaxdayImpressions` | boolean
`maxdayImpressions` | number
`useMaxtotalImpressions` | boolean
`maxtotalImpressions` | number
`selectPct` | number
`useStartDate` | boolean
`startDate` | Date
`useEndDate` | boolean
`endDate` | Date
`locationIds` | string
`webview` | number
`adblock` | number
`useKeywords` | boolean
`keywords` | string
`languages` | string
`categories` | string
`mainCatid` | number
`deviceTypeIds` | string
`browserIds` | string
`osIds` | string
`ispIds` | string
`siteTypes` | string
`regions` | string
`useCapping` | boolean
`cappingHours` | number
`cappingMinutes` | number
`cappingVisitors` | number
`capType` | number
`cappingType` | number
`cappingLevel` | number
`domainFilterId` | number
`whitelistId` | number
`rtIncludeId` | number
`rtExcludeId` | number
`ipPoolId` | number
`fxMinprice` | number
`isPaused` | boolean
`bidrulesetId` | number

## Example

```typescript
import type { ApiV1CampaignsTypeIdPatchRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "groupid": 3,7,
  "displayOptions": 7,
  "minRank": null,
  "fxRating": null,
  "mailCampaignBudget": null,
  "useDynamicCosts": null,
  "dynamicCostsIncrease": null,
  "conversionCapping": null,
  "fixCpa": null,
  "fixCpaConvTypes": 0,2,
  "booster": null,
  "boosterSettings": null,
  "defaultBidType": null,
  "sortType": null,
  "asFailover": null,
  "dayParting": null,
  "screens": null,
  "displayTimes": 08:00-12:00|14:00-18:00,
  "displayDays": 1,2,3,4,5,
  "siteLanguages": en,de,
  "connectionTypes": 2,
  "carrierIds": 15,22,
  "ratingId": null,
  "orientation": null,
  "siteMode": null,
  "onlyTaggedZones": null,
  "skipLowQuality": null,
  "ipWhitelist": null,
  "ipBlacklist": null,
  "avCheck": null,
  "emailType": null,
  "useSubscriptionAge": null,
  "subscriptionAge": null,
  "instantImpression": null,
  "subidList": 1001
1002,
  "subidListMode": null,
  "sourceOptimizerIds": 12,15,
  "wlZoneIds": 1024,2048,
  "feedId": null,
  "feedSettings": null,
  "priority": null,
  "suggestions": null,
  "hideReferrer": null,
  "logConvAsPaid": null,
  "aboutSettings": null,
  "useLiveFeed": null,
  "liveFeedParentId": null,
  "liveFeedSettings": null,
  "offerTypeId": null,
  "description": null,
  "destinationUrl": null,
  "previewUrl": null,
  "rtbNetworkId": null,
  "rtbType": null,
  "useType": null,
  "zoneUrls": null,
  "bidAction": null,
  "useQps": null,
  "qps": null,
  "rtbCategories": IAB1,IAB9-30,
  "useApi": null,
  "apiData": null,
  "logSkipped": null,
  "domainMask": null,
  "rtbXmlMarkup": null,
  "name": null,
  "requestUrl": null,
  "bannerSizeIds": null,
  "dailyBudget": null,
  "totalBudget": null,
  "useCampaignBudget": null,
  "sellingType": null,
  "useDailyBudget": null,
  "useBudgetSpreading": null,
  "useMaxdayImpressions": null,
  "maxdayImpressions": 100000,
  "useMaxtotalImpressions": null,
  "maxtotalImpressions": 1000000,
  "selectPct": 50,
  "useStartDate": null,
  "startDate": 2026-11-01,
  "useEndDate": null,
  "endDate": 2026-11-30,
  "locationIds": 1,3,
  "webview": null,
  "adblock": null,
  "useKeywords": null,
  "keywords": casino,poker,
  "languages": 1,2,5,
  "categories": 17,42,
  "mainCatid": null,
  "deviceTypeIds": 1,2,
  "browserIds": 1,3,
  "osIds": 1,5,
  "ispIds": 12,34,
  "siteTypes": 1,4,
  "regions": 528006,840001,
  "useCapping": null,
  "cappingHours": null,
  "cappingMinutes": null,
  "cappingVisitors": null,
  "capType": null,
  "cappingType": null,
  "cappingLevel": null,
  "domainFilterId": null,
  "whitelistId": null,
  "rtIncludeId": null,
  "rtExcludeId": null,
  "ipPoolId": null,
  "fxMinprice": null,
  "isPaused": null,
  "bidrulesetId": null,
} satisfies ApiV1CampaignsTypeIdPatchRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeIdPatchRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


