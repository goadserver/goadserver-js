
# ApiV1ProductFeedsPreviewPostRequest


## Properties

Name | Type
------------ | -------------
`template` | string
`templateHtml` | string
`cta` | string
`accent` | string
`bansizeid` | number
`product` | [ApiV1ProductFeedsPreviewPostRequestProduct](ApiV1ProductFeedsPreviewPostRequestProduct.md)

## Example

```typescript
import type { ApiV1ProductFeedsPreviewPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "template": null,
  "templateHtml": null,
  "cta": null,
  "accent": null,
  "bansizeid": null,
  "product": null,
} satisfies ApiV1ProductFeedsPreviewPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1ProductFeedsPreviewPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


