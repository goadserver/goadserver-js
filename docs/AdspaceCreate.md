
# AdspaceCreate

Adspace create body. The fields below are the common top-level keys every type accepts; the type-specific settings block goes under the body key returned in `settings_block.name` from `GET /api/v1/adspaces/{type}/_schema` (e.g. `banner_settings`, `pop_settings`, `native_settings`, `player_settings`).  Per-type details — including which `*_settings` block to send and the legal fields inside it — live at the runtime `_schema` endpoint, since they vary by tenant config. 

## Properties

Name | Type
------------ | -------------
`name` | string
`siteid` | number
`description` | string
`ratingid` | number
`mainCatid` | number
`catid` | number
`locationid` | number
`adsizeid` | number
`autoapprove` | boolean
`isvisible` | boolean
`sendmails` | boolean
`useownbanners` | boolean
`usealtbanner` | boolean
`usecpmbuys` | boolean
`allowIframes` | boolean
`allowAnimation` | boolean
`skipRonIfCpm` | boolean
`noPromotion` | boolean
`runRtbAfterSmartzone` | boolean
`usePixelLog` | boolean
`showAbout` | boolean
`hidecopy` | boolean
`hideadsby` | boolean
`useflatbuys` | boolean
`parentid` | number
`displayType` | number
`newZoneid` | number
`onlyWlCampaigns` | boolean
`onlyTaggedCampaigns` | boolean
`forceWlTargeting` | boolean
`skipRtbWhenWl` | boolean
`useFixedPayouts` | boolean
`fixedPayouts` | boolean
`fixedPayoutData` | { [key: string]: any; }
`rtbName` | string
`tags` | Array&lt;number&gt;
`exclCatids` | string
`exclproperties` | string
`useSubidList` | boolean
`subidList` | string
`useDomainList` | boolean
`domainList` | Array&lt;string&gt;
`useCosts` | boolean
`costsData` | { [key: string]: any; }
`useDynamicCosts` | boolean
`useFallbackCampaign` | boolean
`fallbackCampaignid` | number
`qualityRank` | number
`bannerSettings` | [AdspaceCreateBannerSettings](AdspaceCreateBannerSettings.md)
`nativeSettings` | { [key: string]: any; }
`searchSettings` | [AdspaceCreateSearchSettings](AdspaceCreateSearchSettings.md)
`emailSettings` | [AdspaceCreateEmailSettings](AdspaceCreateEmailSettings.md)
`botSettings` | [AdspaceCreateBotSettings](AdspaceCreateBotSettings.md)
`screenSettings` | [AdspaceCreateScreenSettings](AdspaceCreateScreenSettings.md)
`playerSettings` | { [key: string]: any; }
`popSettings` | { [key: string]: any; }
`fpaSettings` | { [key: string]: any; }
`redirectSettings` | { [key: string]: any; }
`imSettings` | { [key: string]: any; }
`fiximBannerSettings` | { [key: string]: any; }
`nativeBarSettings` | { [key: string]: any; }
`nativeWebpushSettings` | { [key: string]: any; }
`textSettings` | { [key: string]: any; }
`floaterSettings` | { [key: string]: any; }
`videosliderSettings` | { [key: string]: any; }
`invideoSettings` | { [key: string]: any; }
`dynAdsettings` | { [key: string]: any; }
`inpageVideosettings` | { [key: string]: any; }
`carouselVideosettings` | { [key: string]: any; }

## Example

```typescript
import type { AdspaceCreate } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Homepage 300x250,
  "siteid": 30067,
  "description": null,
  "ratingid": null,
  "mainCatid": null,
  "catid": null,
  "locationid": null,
  "adsizeid": null,
  "autoapprove": null,
  "isvisible": null,
  "sendmails": null,
  "useownbanners": null,
  "usealtbanner": null,
  "usecpmbuys": null,
  "allowIframes": null,
  "allowAnimation": null,
  "skipRonIfCpm": null,
  "noPromotion": null,
  "runRtbAfterSmartzone": null,
  "usePixelLog": null,
  "showAbout": null,
  "hidecopy": null,
  "hideadsby": null,
  "useflatbuys": null,
  "parentid": null,
  "displayType": null,
  "newZoneid": null,
  "onlyWlCampaigns": null,
  "onlyTaggedCampaigns": null,
  "forceWlTargeting": null,
  "skipRtbWhenWl": null,
  "useFixedPayouts": null,
  "fixedPayouts": null,
  "fixedPayoutData": null,
  "rtbName": null,
  "tags": null,
  "exclCatids": null,
  "exclproperties": null,
  "useSubidList": null,
  "subidList": null,
  "useDomainList": null,
  "domainList": null,
  "useCosts": null,
  "costsData": null,
  "useDynamicCosts": null,
  "useFallbackCampaign": null,
  "fallbackCampaignid": null,
  "qualityRank": null,
  "bannerSettings": null,
  "nativeSettings": null,
  "searchSettings": null,
  "emailSettings": null,
  "botSettings": null,
  "screenSettings": null,
  "playerSettings": null,
  "popSettings": null,
  "fpaSettings": null,
  "redirectSettings": null,
  "imSettings": null,
  "fiximBannerSettings": null,
  "nativeBarSettings": null,
  "nativeWebpushSettings": null,
  "textSettings": null,
  "floaterSettings": null,
  "videosliderSettings": null,
  "invideoSettings": null,
  "dynAdsettings": null,
  "inpageVideosettings": null,
  "carouselVideosettings": null,
} satisfies AdspaceCreate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceCreate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


