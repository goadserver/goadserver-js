
# ApiV1AdShopGroupSummaryPostRequestFilters


## Properties

Name | Type
------------ | -------------
`formats` | Array&lt;number&gt;
`payTypes` | Array&lt;number&gt;
`categories` | Array&lt;number&gt;
`devices` | Array&lt;number&gt;
`countries` | Array&lt;string&gt;

## Example

```typescript
import type { ApiV1AdShopGroupSummaryPostRequestFilters } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "formats": null,
  "payTypes": null,
  "categories": null,
  "devices": null,
  "countries": null,
} satisfies ApiV1AdShopGroupSummaryPostRequestFilters

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdShopGroupSummaryPostRequestFilters
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


