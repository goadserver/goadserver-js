
# ApiV1TrackerOffersIdUrlsUrlIdPutRequest

Writes only the fields sent.

## Properties

Name | Type
------------ | -------------
`url` | string
`sortWeight` | number
`isActive` | boolean

## Example

```typescript
import type { ApiV1TrackerOffersIdUrlsUrlIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "url": null,
  "sortWeight": null,
  "isActive": null,
} satisfies ApiV1TrackerOffersIdUrlsUrlIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerOffersIdUrlsUrlIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


