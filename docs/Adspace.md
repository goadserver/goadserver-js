
# Adspace

Full adspace record returned by `GET /api/v1/adspaces/{id}` and the create/update endpoints. Shape mirrors `AdspaceCreate` so round-trips work without translation, plus a few read-only identity fields (`id`, `uniq_name`, `adspace_type`, `is_active`, `date_added`, `time_changed`) and the parsed `json_settings`. 

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`description` | string
`uniqName` | string
`site` | [AdspaceSite](AdspaceSite.md)
`siteid` | number
`adspaceType` | string
`adzoneTypeid` | number
`adtypeId` | number
`adType` | number
`adsizeid` | number
`displayType` | number
`ratingid` | number
`mainCatid` | number
`catid` | number
`locationid` | number
`qualityRank` | number
`isActive` | boolean
`autoapprove` | boolean
`isvisible` | boolean
`sendmails` | boolean
`useownbanners` | boolean
`usealtbanner` | boolean
`usecpmbuys` | boolean
`allowIframes` | boolean
`allowAnimation` | boolean
`runRtbAfterSmartzone` | boolean
`usePixelLog` | boolean
`showAbout` | boolean
`skipRonIfCpm` | boolean
`noPromotion` | boolean
`hidecopy` | boolean
`useSubidList` | boolean
`subidList` | string
`useDomainList` | boolean
`domainList` | Array&lt;string&gt;
`useCosts` | boolean
`costsData` | { [key: string]: any; }
`useDynamicCosts` | boolean
`useFixedPayouts` | boolean
`fixedPayoutData` | { [key: string]: any; }
`useFallbackCampaign` | boolean
`fallbackCampaignid` | number
`exclCatids` | string
`exclproperties` | string
`tags` | Array&lt;number&gt;
`rtbName` | string
`dateAdded` | Date
`timeChanged` | number
`useflatbuys` | boolean
`onlyWlCampaigns` | boolean
`onlyTaggedCampaigns` | boolean
`forceWlTargeting` | boolean
`skipRtbWhenWl` | boolean
`parentid` | number
`newZoneid` | number
`networkBinding` | [AdspaceNetworkBinding](AdspaceNetworkBinding.md)
`jsonSettings` | { [key: string]: any; }

## Example

```typescript
import type { Adspace } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "uniqName": null,
  "site": null,
  "siteid": null,
  "adspaceType": null,
  "adzoneTypeid": null,
  "adtypeId": null,
  "adType": null,
  "adsizeid": null,
  "displayType": null,
  "ratingid": null,
  "mainCatid": null,
  "catid": null,
  "locationid": null,
  "qualityRank": null,
  "isActive": null,
  "autoapprove": null,
  "isvisible": null,
  "sendmails": null,
  "useownbanners": null,
  "usealtbanner": null,
  "usecpmbuys": null,
  "allowIframes": null,
  "allowAnimation": null,
  "runRtbAfterSmartzone": null,
  "usePixelLog": null,
  "showAbout": null,
  "skipRonIfCpm": null,
  "noPromotion": null,
  "hidecopy": null,
  "useSubidList": null,
  "subidList": null,
  "useDomainList": null,
  "domainList": null,
  "useCosts": null,
  "costsData": null,
  "useDynamicCosts": null,
  "useFixedPayouts": null,
  "fixedPayoutData": null,
  "useFallbackCampaign": null,
  "fallbackCampaignid": null,
  "exclCatids": null,
  "exclproperties": null,
  "tags": null,
  "rtbName": null,
  "dateAdded": null,
  "timeChanged": null,
  "useflatbuys": null,
  "onlyWlCampaigns": null,
  "onlyTaggedCampaigns": null,
  "forceWlTargeting": null,
  "skipRtbWhenWl": null,
  "parentid": null,
  "newZoneid": null,
  "networkBinding": null,
  "jsonSettings": null,
} satisfies Adspace

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Adspace
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


