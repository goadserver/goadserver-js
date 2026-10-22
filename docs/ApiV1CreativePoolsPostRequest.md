
# ApiV1CreativePoolsPostRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`type` | string
`orientation` | string
`tags` | string

## Example

```typescript
import type { ApiV1CreativePoolsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": 300x250 Promo Q3,
  "type": null,
  "orientation": null,
  "tags": 12,17,
} satisfies ApiV1CreativePoolsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CreativePoolsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


