
# ApiV1PublisherSmartzonesImportPostRequest


## Properties

Name | Type
------------ | -------------
`smartNetworkId` | number
`networkId` | number
`networkSiteid` | string
`siteid` | number
`selectType` | number
`selectPct` | number
`settings` | object
`zones` | [Array&lt;ApiV1PublisherSmartzonesImportPostRequestZonesInner&gt;](ApiV1PublisherSmartzonesImportPostRequestZonesInner.md)

## Example

```typescript
import type { ApiV1PublisherSmartzonesImportPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "smartNetworkId": null,
  "networkId": null,
  "networkSiteid": null,
  "siteid": null,
  "selectType": null,
  "selectPct": null,
  "settings": null,
  "zones": null,
} satisfies ApiV1PublisherSmartzonesImportPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherSmartzonesImportPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


