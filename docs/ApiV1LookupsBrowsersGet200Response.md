
# ApiV1LookupsBrowsersGet200Response


## Properties

Name | Type
------------ | -------------
`deviceTypeIds` | Array&lt;number&gt;
`count` | number
`note` | string
`items` | [Array&lt;ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner&gt;](ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner.md)

## Example

```typescript
import type { ApiV1LookupsBrowsersGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "deviceTypeIds": null,
  "count": null,
  "note": null,
  "items": null,
} satisfies ApiV1LookupsBrowsersGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1LookupsBrowsersGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


