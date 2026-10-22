
# TrackingPixel

Deprecated. A stored name + code per conversion type. Nothing in ad serving, postback handling or the panel reads these rows — a conversion is attributed by its click id and conversion-type slot (see GET /api/v1/tracking/conversion-types), not by `pixel_code`. 

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`conversionTypeId` | number
`pixelCode` | string

## Example

```typescript
import type { TrackingPixel } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "conversionTypeId": null,
  "pixelCode": null,
} satisfies TrackingPixel

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackingPixel
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


