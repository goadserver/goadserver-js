
# ApiV1CampaignsGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`campaignType` | string
`adType` | number
`sellingType` | number
`isPaused` | boolean
`isActive` | boolean
`isDeleted` | boolean

## Example

```typescript
import type { ApiV1CampaignsGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "campaignType": null,
  "adType": null,
  "sellingType": null,
  "isPaused": null,
  "isActive": null,
  "isDeleted": null,
} satisfies ApiV1CampaignsGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


