
# ApiV1TrackingPixelsGet200Response


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;TrackingPixel&gt;](TrackingPixel.md)
`page` | number
`perPage` | number
`totalRows` | number

## Example

```typescript
import type { ApiV1TrackingPixelsGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "page": null,
  "perPage": null,
  "totalRows": null,
} satisfies ApiV1TrackingPixelsGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackingPixelsGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


