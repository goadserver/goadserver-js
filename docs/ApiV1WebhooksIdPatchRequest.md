
# ApiV1WebhooksIdPatchRequest


## Properties

Name | Type
------------ | -------------
`url` | string
`events` | Array&lt;string&gt;
`description` | string
`status` | string

## Example

```typescript
import type { ApiV1WebhooksIdPatchRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "url": null,
  "events": null,
  "description": null,
  "status": null,
} satisfies ApiV1WebhooksIdPatchRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1WebhooksIdPatchRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


