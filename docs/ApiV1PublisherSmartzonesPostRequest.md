
# ApiV1PublisherSmartzonesPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`spaceid` | number
`smartNetworkid` | number
`siteid` | number
`countries` | string
`deviceTypeIds` | string
`isActive` | boolean
`selectType` | number
`selectPct` | number
`notes` | string
`creative` | string
`settings` | string
`useAdblock` | number
`networkZoneid` | number
`networkSiteid` | number
`sspCampaignid` | number
`scanningEnabled` | number

## Example

```typescript
import type { ApiV1PublisherSmartzonesPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "spaceid": null,
  "smartNetworkid": null,
  "siteid": null,
  "countries": DE,AT,
  "deviceTypeIds": 1,3,
  "isActive": null,
  "selectType": null,
  "selectPct": null,
  "notes": null,
  "creative": null,
  "settings": null,
  "useAdblock": null,
  "networkZoneid": null,
  "networkSiteid": null,
  "sspCampaignid": null,
  "scanningEnabled": null,
} satisfies ApiV1PublisherSmartzonesPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherSmartzonesPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


