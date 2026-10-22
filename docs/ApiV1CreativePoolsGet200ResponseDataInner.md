
# ApiV1CreativePoolsGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`title` | string
`type` | string
`sortType` | string
`orientation` | string
`convType` | number
`tags` | string
`tagids` | Array&lt;string&gt;
`itemsCount` | number
`totalSizes` | number

## Example

```typescript
import type { ApiV1CreativePoolsGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "type": null,
  "sortType": null,
  "orientation": null,
  "convType": null,
  "tags": null,
  "tagids": null,
  "itemsCount": null,
  "totalSizes": null,
} satisfies ApiV1CreativePoolsGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CreativePoolsGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


