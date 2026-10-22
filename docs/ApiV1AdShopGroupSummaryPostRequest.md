
# ApiV1AdShopGroupSummaryPostRequest


## Properties

Name | Type
------------ | -------------
`groups` | Array&lt;string&gt;
`group` | string
`selectedIds` | Array&lt;number&gt;
`filters` | [ApiV1AdShopGroupSummaryPostRequestFilters](ApiV1AdShopGroupSummaryPostRequestFilters.md)

## Example

```typescript
import type { ApiV1AdShopGroupSummaryPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "groups": null,
  "group": null,
  "selectedIds": null,
  "filters": null,
} satisfies ApiV1AdShopGroupSummaryPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdShopGroupSummaryPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


