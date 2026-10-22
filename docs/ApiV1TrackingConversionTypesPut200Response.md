
# ApiV1TrackingConversionTypesPut200Response


## Properties

Name | Type
------------ | -------------
`message` | string
`conversionTypes` | [Array&lt;ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner&gt;](ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner.md)
`skipDedup` | Array&lt;number&gt;

## Example

```typescript
import type { ApiV1TrackingConversionTypesPut200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "message": null,
  "conversionTypes": null,
  "skipDedup": null,
} satisfies ApiV1TrackingConversionTypesPut200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackingConversionTypesPut200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


