
# ApiV1TrackerSourcesPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`templateSlug` | string
`postbacks` | { [key: string]: any; }

## Example

```typescript
import type { ApiV1TrackerSourcesPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Facebook — account A,
  "templateSlug": facebook,
  "postbacks": null,
} satisfies ApiV1TrackerSourcesPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerSourcesPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


