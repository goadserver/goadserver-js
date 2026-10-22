
# ApiV1CampaignsMassTogglePutRequest


## Properties

Name | Type
------------ | -------------
`ids` | Array&lt;number&gt;
`type` | string
`pause` | boolean

## Example

```typescript
import type { ApiV1CampaignsMassTogglePutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "ids": null,
  "type": null,
  "pause": null,
} satisfies ApiV1CampaignsMassTogglePutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsMassTogglePutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


