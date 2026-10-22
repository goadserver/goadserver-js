
# ApiV1AdScannerIdManualItemsPostRequest


## Properties

Name | Type
------------ | -------------
`id` | number
`value` | string
`type` | string
`description` | string
`adWidth` | number
`adHeight` | number
`isactive` | number
`referrer` | string

## Example

```typescript
import type { ApiV1AdScannerIdManualItemsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "value": null,
  "type": null,
  "description": null,
  "adWidth": null,
  "adHeight": null,
  "isactive": null,
  "referrer": null,
} satisfies ApiV1AdScannerIdManualItemsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdScannerIdManualItemsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


