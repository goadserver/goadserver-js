
# TrackingLink

A tracking link — a `publisher_adzones` row under a hidden source site. `is_smartlink` distinguishes the two shapes: a single-offer link redirects straight through, a smartlink carries several `offer_ids` and lets each offer\'s own targeting and eCPM pick the winner per click. 

## Properties

Name | Type
------------ | -------------
`adzoneId` | number
`name` | string
`siteid` | number
`sourceName` | string
`sourceDescription` | string
`sourceTemplate` | string
`urlPath` | string
`isSmartlink` | boolean
`offerId` | number
`offerName` | string
`offerIds` | Array&lt;number&gt;
`weights` | Array&lt;number&gt;
`tokens` | Array&lt;string&gt;
`tags` | string
`dateAdded` | string
`isDeleted` | boolean
`adnetworkId` | number
`adnetworkName` | string
`adnetworkCampaignid` | number
`adnetworkCampaignKind` | string
`adnetworkState` | string
`adnetworkAutoApi` | boolean

## Example

```typescript
import type { TrackingLink } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adzoneId": null,
  "name": null,
  "siteid": null,
  "sourceName": null,
  "sourceDescription": null,
  "sourceTemplate": null,
  "urlPath": null,
  "isSmartlink": null,
  "offerId": null,
  "offerName": null,
  "offerIds": null,
  "weights": null,
  "tokens": null,
  "tags": null,
  "dateAdded": null,
  "isDeleted": null,
  "adnetworkId": null,
  "adnetworkName": null,
  "adnetworkCampaignid": null,
  "adnetworkCampaignKind": null,
  "adnetworkState": null,
  "adnetworkAutoApi": null,
} satisfies TrackingLink

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackingLink
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


