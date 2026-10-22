
# ApiV1PublisherSmartzonesIdPutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`spaceid` | number
`smartNetworkid` | number
`siteid` | number
`countries` | string
`deviceTypeIds` | string
`isActive` | [ApiV1PublisherSmartzonesIdPutRequestIsActive](ApiV1PublisherSmartzonesIdPutRequestIsActive.md)
`selectType` | number
`selectPct` | number
`notes` | string
`creative` | string
`settings` | string
`useAdblock` | number
`uniqueOnly` | [ApiV1PublisherSmartzonesIdPutRequestUniqueOnly](ApiV1PublisherSmartzonesIdPutRequestUniqueOnly.md)
`networkZoneid` | number
`networkSiteid` | number
`sspCampaignid` | number
`scanningEnabled` | [ApiV1PublisherSmartzonesIdPutRequestIsActive](ApiV1PublisherSmartzonesIdPutRequestIsActive.md)

## Example

```typescript
import type { ApiV1PublisherSmartzonesIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "spaceid": null,
  "smartNetworkid": null,
  "siteid": null,
  "countries": null,
  "deviceTypeIds": null,
  "isActive": null,
  "selectType": null,
  "selectPct": null,
  "notes": null,
  "creative": null,
  "settings": null,
  "useAdblock": null,
  "uniqueOnly": null,
  "networkZoneid": null,
  "networkSiteid": null,
  "sspCampaignid": null,
  "scanningEnabled": null,
} satisfies ApiV1PublisherSmartzonesIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherSmartzonesIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


