
# FilterDetail

One filter. GET, create (201), PUT and POST …/items all answer with this shape. SubIDs are shown ENCODED when the account has SubID encoding on (send them back the same way). 

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
`campaignType` | string
`appliesTo` | string
`ranges` | [Array&lt;FilterDetailAllOfRanges&gt;](FilterDetailAllOfRanges.md)
`imported` | number

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
  "campaignType": null,
  "appliesTo": null,
  "ranges": null,
  "imported": null,
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


