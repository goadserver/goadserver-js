
# ApiV1AdspacesIdWlCampaignsPutRequest


## Properties

Name | Type
------------ | -------------
`campaigns` | [Array&lt;ApiV1AdspacesIdWlCampaignsPutRequestCampaignsInner&gt;](ApiV1AdspacesIdWlCampaignsPutRequestCampaignsInner.md)
`forceWlTargeting` | boolean
`skipRtbWhenWl` | boolean

## Example

```typescript
import type { ApiV1AdspacesIdWlCampaignsPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "campaigns": null,
  "forceWlTargeting": null,
  "skipRtbWhenWl": null,
} satisfies ApiV1AdspacesIdWlCampaignsPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesIdWlCampaignsPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


