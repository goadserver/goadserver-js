
# ApiV1AdspacesIdClonePostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`copyCampaigns` | boolean
`copyOwnAds` | boolean
`copySettings` | boolean
`startActive` | boolean
`copyBuyingPolicy` | boolean
`inheritBlocks` | string

## Example

```typescript
import type { ApiV1AdspacesIdClonePostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "copyCampaigns": null,
  "copyOwnAds": null,
  "copySettings": null,
  "startActive": null,
  "copyBuyingPolicy": null,
  "inheritBlocks": null,
} satisfies ApiV1AdspacesIdClonePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesIdClonePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


