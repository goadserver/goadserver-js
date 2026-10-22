
# ApiV1TrackerTrackingLinksIdPutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`sourceId` | number
`offerIds` | Array&lt;number&gt;
`weights` | Array&lt;number&gt;
`tags` | string
`tokens` | Array&lt;string&gt;

## Example

```typescript
import type { ApiV1TrackerTrackingLinksIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "sourceId": null,
  "offerIds": null,
  "weights": null,
  "tags": null,
  "tokens": null,
} satisfies ApiV1TrackerTrackingLinksIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerTrackingLinksIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


