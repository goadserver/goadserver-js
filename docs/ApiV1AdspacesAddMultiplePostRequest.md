
# ApiV1AdspacesAddMultiplePostRequest


## Properties

Name | Type
------------ | -------------
`siteid` | number
`adzoneTypeid` | number
`sizeid` | number
`items` | [Array&lt;ApiV1CreativesIdNamePutRequest&gt;](ApiV1CreativesIdNamePutRequest.md)

## Example

```typescript
import type { ApiV1AdspacesAddMultiplePostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "siteid": null,
  "adzoneTypeid": null,
  "sizeid": null,
  "items": null,
} satisfies ApiV1AdspacesAddMultiplePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesAddMultiplePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


