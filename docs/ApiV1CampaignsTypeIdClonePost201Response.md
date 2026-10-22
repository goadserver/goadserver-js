
# ApiV1CampaignsTypeIdClonePost201Response


## Properties

Name | Type
------------ | -------------
`id` | number
`clonedFrom` | number
`isActive` | boolean
`copied` | [ApiV1CampaignsTypeIdClonePost201ResponseCopied](ApiV1CampaignsTypeIdClonePost201ResponseCopied.md)

## Example

```typescript
import type { ApiV1CampaignsTypeIdClonePost201Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "clonedFrom": null,
  "isActive": null,
  "copied": null,
} satisfies ApiV1CampaignsTypeIdClonePost201Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeIdClonePost201Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


