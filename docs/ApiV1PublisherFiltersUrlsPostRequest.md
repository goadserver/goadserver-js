
# ApiV1PublisherFiltersUrlsPostRequest


## Properties

Name | Type
------------ | -------------
`url` | string
`urls` | Array&lt;string&gt;

## Example

```typescript
import type { ApiV1PublisherFiltersUrlsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "url": spam-site.example,
  "urls": ["a.example","b.example"],
} satisfies ApiV1PublisherFiltersUrlsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFiltersUrlsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


