
# ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest


## Properties

Name | Type
------------ | -------------
`ids` | Array&lt;number&gt;
`poolId` | number
`poolBySize` | { [key: string]: number; }
`includeUnpooled` | boolean

## Example

```typescript
import type { ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "ids": null,
  "poolId": null,
  "poolBySize": null,
  "includeUnpooled": null,
} satisfies ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


