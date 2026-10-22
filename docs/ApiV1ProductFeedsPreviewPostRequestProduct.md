
# ApiV1ProductFeedsPreviewPostRequestProduct

Sample product to render; a built-in sample without it.

## Properties

Name | Type
------------ | -------------
`title` | string
`price` | string
`imageLink` | string
`link` | string
`description` | string

## Example

```typescript
import type { ApiV1ProductFeedsPreviewPostRequestProduct } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "price": null,
  "imageLink": null,
  "link": null,
  "description": null,
} satisfies ApiV1ProductFeedsPreviewPostRequestProduct

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1ProductFeedsPreviewPostRequestProduct
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


