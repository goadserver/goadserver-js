
# ApiV1CreativePoolsIdItemsItemIdPutRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`lang` | string
`properties` | string
`ratingid` | number
`urlPrefix` | string
`weight` | number
`isFallback` | boolean
`startAt` | [ApiV1CreativePoolsIdItemsItemIdPutRequestStartAt](ApiV1CreativePoolsIdItemsItemIdPutRequestStartAt.md)
`endAt` | [ApiV1CreativePoolsIdItemsItemIdPutRequestEndAt](ApiV1CreativePoolsIdItemsItemIdPutRequestEndAt.md)

## Example

```typescript
import type { ApiV1CreativePoolsIdItemsItemIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "lang": null,
  "properties": null,
  "ratingid": null,
  "urlPrefix": null,
  "weight": null,
  "isFallback": null,
  "startAt": null,
  "endAt": null,
} satisfies ApiV1CreativePoolsIdItemsItemIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CreativePoolsIdItemsItemIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


