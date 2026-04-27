
# ApiV1CreativePoolsIdDelete409Response


## Properties

Name | Type
------------ | -------------
`success` | boolean
`totalItems` | number
`deleted` | number
`error` | string

## Example

```typescript
import type { ApiV1CreativePoolsIdDelete409Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "success": null,
  "totalItems": null,
  "deleted": null,
  "error": delete_creative_items_in_use,
} satisfies ApiV1CreativePoolsIdDelete409Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CreativePoolsIdDelete409Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


