
# CampaignPanelFields

Campaign-form fields for `ron` / `cpm` / `rtb` campaigns, writable on `POST /api/v1/campaigns/{type}` and `PATCH /api/v1/campaigns/{type}/{id}` and returned by list / show (option fields when stored). Which of them a campaign takes depends on its type, the network\'s modules, its ad type and its pay type — `GET /api/v1/campaigns/{type}/_schema` lists exactly the ones available to you (`?ad_type=` narrows it), with `ad_types` / `selling_types` restrictions. Sending one that is not available is a `422` naming the field (for example `\"orientation applies only to ad type(s) 3, 22.\"`), not a silent drop. Object fields merge on PATCH: keys you omit keep their stored value. Money is in main currency units (not cents). 

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
`priority` | [CampaignPanelFieldsPriority](CampaignPanelFieldsPriority.md)
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

## Example

```typescript
import type { CampaignPanelFields } from 'goadserver-sdk'

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
} satisfies CampaignPanelFields

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CampaignPanelFields
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


