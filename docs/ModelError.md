
# ModelError

Every non-2xx response. See \"Errors\" in the API description for the code list.

## Properties

Name | Type
------------ | -------------
`error` | string
`message` | string
`errors` | { [key: string]: Array&lt;string&gt;; }
`scope` | string
`unknownFields` | Array&lt;string&gt;
`currentEtag` | string

## Example

```typescript
import type { ModelError } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "error": missing_scope,
  "message": null,
  "errors": null,
  "scope": null,
  "unknownFields": null,
  "currentEtag": null,
} satisfies ModelError

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelError
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


