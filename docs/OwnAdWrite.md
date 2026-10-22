
# OwnAdWrite

An adzone\'s own (house) ad. On multipart uploads the same fields go as form fields next to the image file.

## Properties

Name | Type
------------ | -------------
`title` | string
`bannertype` | number
`bannerurl` | string
`bannercode` | string
`weight` | number
`isactive` | number
`countries` | string
`layerformat` | string
`bigimageurl` | string
`smallimageurl` | string
`width` | number
`height` | number
`displayurl` | string
`description` | string

## Example

```typescript
import type { OwnAdWrite } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "bannertype": null,
  "bannerurl": null,
  "bannercode": null,
  "weight": null,
  "isactive": null,
  "countries": null,
  "layerformat": null,
  "bigimageurl": null,
  "smallimageurl": null,
  "width": null,
  "height": null,
  "displayurl": null,
  "description": null,
} satisfies OwnAdWrite

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OwnAdWrite
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


