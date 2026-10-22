
# ApiV1ProductFeedsPostRequest


## Properties

Name | Type
------------ | -------------
`campaignId` | number
`url` | string
`name` | string
`format` | string
`refreshHours` | number
`maxItems` | number
`priceInTitle` | boolean
`bid` | number
`template` | string
`templateHtml` | string
`cta` | string
`accent` | string
`bansizeid` | number
`retarget` | boolean

## Example

```typescript
import type { ApiV1ProductFeedsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "campaignId": null,
  "url": null,
  "name": null,
  "format": null,
  "refreshHours": null,
  "maxItems": null,
  "priceInTitle": null,
  "bid": null,
  "template": null,
  "templateHtml": null,
  "cta": null,
  "accent": null,
  "bansizeid": null,
  "retarget": null,
} satisfies ApiV1ProductFeedsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1ProductFeedsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


