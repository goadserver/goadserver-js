
# TrackerOffer

An offer, stored as the `roncampaigns` row the click pipeline already uses (`adtypeid=21`). Field names are the storage names, unchanged — the same values the panel reads. 

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`paytype` | string
`fixCpa` | number
`countrys` | string
`affiliateNetworkId` | number
`networkName` | string
`failoverOfferId` | number
`failoverOfferName` | string
`asFailover` | boolean
`ispaused` | boolean
`dayactive` | number
`offertypeid` | number
`trackerTags` | string
`groupid` | string

## Example

```typescript
import type { TrackerOffer } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "paytype": null,
  "fixCpa": null,
  "countrys": null,
  "affiliateNetworkId": null,
  "networkName": null,
  "failoverOfferId": null,
  "failoverOfferName": null,
  "asFailover": null,
  "ispaused": null,
  "dayactive": null,
  "offertypeid": null,
  "trackerTags": null,
  "groupid": null,
} satisfies TrackerOffer

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerOffer
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


