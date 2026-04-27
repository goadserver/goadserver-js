
# FilterDetail


## Properties

Name | Type
------------ | -------------
`type` | string
`id` | number
`name` | string
`isActive` | boolean
`adType` | number
`itemCount` | number
`items` | Array&lt;string&gt;
`campaignIds` | Array&lt;string&gt;
`ranges` | [Array&lt;FilterDetailAllOfRanges&gt;](FilterDetailAllOfRanges.md)

## Example

```typescript
import type { FilterDetail } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "id": null,
  "name": null,
  "isActive": null,
  "adType": null,
  "itemCount": null,
  "items": null,
  "campaignIds": null,
  "ranges": null,
} satisfies FilterDetail

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FilterDetail
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


