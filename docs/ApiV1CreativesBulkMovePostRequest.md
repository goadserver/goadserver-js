
# ApiV1CreativesBulkMovePostRequest


## Properties

Name | Type
------------ | -------------
`folderId` | number
`ids` | Array&lt;number&gt;
`filter` | { [key: string]: string; }

## Example

```typescript
import type { ApiV1CreativesBulkMovePostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "folderId": null,
  "ids": null,
  "filter": null,
} satisfies ApiV1CreativesBulkMovePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CreativesBulkMovePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


