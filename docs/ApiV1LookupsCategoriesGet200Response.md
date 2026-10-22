
# ApiV1LookupsCategoriesGet200Response


## Properties

Name | Type
------------ | -------------
`count` | number
`mainCatid` | number
`note` | string
`items` | [Array&lt;ApiV1LookupsCategoriesGet200ResponseItemsInner&gt;](ApiV1LookupsCategoriesGet200ResponseItemsInner.md)

## Example

```typescript
import type { ApiV1LookupsCategoriesGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "count": null,
  "mainCatid": null,
  "note": null,
  "items": null,
} satisfies ApiV1LookupsCategoriesGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1LookupsCategoriesGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


