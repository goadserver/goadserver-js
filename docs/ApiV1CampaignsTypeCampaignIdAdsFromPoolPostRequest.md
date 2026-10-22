
# ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest


## Properties

Name | Type
------------ | -------------
`poolId` | number
`destinationurl` | string
`bid` | number
`setActive` | boolean
`useImptracking` | boolean
`imptrackingurl` | string

## Example

```typescript
import type { ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "poolId": null,
  "destinationurl": null,
  "bid": null,
  "setActive": null,
  "useImptracking": null,
  "imptrackingurl": null,
} satisfies ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


