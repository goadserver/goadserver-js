
# ApiV1CampaignsSaveCategoriesPutRequest


## Properties

Name | Type
------------ | -------------
`ids` | Array&lt;number&gt;
`type` | string
`categories` | Array&lt;number&gt;
`overwrite` | boolean

## Example

```typescript
import type { ApiV1CampaignsSaveCategoriesPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "ids": null,
  "type": null,
  "categories": null,
  "overwrite": null,
} satisfies ApiV1CampaignsSaveCategoriesPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsSaveCategoriesPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


