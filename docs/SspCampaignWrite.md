
# SspCampaignWrite


## Properties

Name | Type
------------ | -------------
`name` | string
`adtype` | number
`ssptype` | string
`rtbtype` | string
`headerBidding` | boolean
`rtbNetwork` | number
`sspPct` | number
`siteid` | number
`slots` | [Array&lt;SspCampaignWriteSlotsInner&gt;](SspCampaignWriteSlotsInner.md)
`requestUrl` | string
`useType` | number
`zoneurls` | [Array&lt;SspCampaignWriteZoneurlsInner&gt;](SspCampaignWriteZoneurlsInner.md)
`pType` | number
`admResponseType` | string
`rtbTplId` | number
`bidAction` | number
`deviceTypeIds` | Array&lt;number&gt;
`osids` | Array&lt;number&gt;
`browserids` | Array&lt;number&gt;
`regionids` | Array&lt;number&gt;
`browserlanguages` | Array&lt;string&gt;
`connectionTypes` | Array&lt;number&gt;
`sspIds` | Array&lt;number&gt;
`wlRonCampaignIds` | Array&lt;number&gt;
`rtbCategories` | Array&lt;string&gt;
`dspIds` | Array&lt;number&gt;
`displayoptions` | string
`logSkipped` | number
`useAdscan` | number
`billOnBurl` | number
`useOptimiser` | number
`optimiserData` | object
`useApi` | number
`apiData` | object

## Example

```typescript
import type { SspCampaignWrite } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "adtype": null,
  "ssptype": null,
  "rtbtype": null,
  "headerBidding": null,
  "rtbNetwork": null,
  "sspPct": null,
  "siteid": null,
  "slots": null,
  "requestUrl": null,
  "useType": null,
  "zoneurls": null,
  "pType": null,
  "admResponseType": null,
  "rtbTplId": null,
  "bidAction": null,
  "deviceTypeIds": null,
  "osids": null,
  "browserids": null,
  "regionids": null,
  "browserlanguages": null,
  "connectionTypes": null,
  "sspIds": null,
  "wlRonCampaignIds": null,
  "rtbCategories": null,
  "dspIds": null,
  "displayoptions": null,
  "logSkipped": null,
  "useAdscan": null,
  "billOnBurl": null,
  "useOptimiser": null,
  "optimiserData": null,
  "useApi": null,
  "apiData": null,
} satisfies SspCampaignWrite

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SspCampaignWrite
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


