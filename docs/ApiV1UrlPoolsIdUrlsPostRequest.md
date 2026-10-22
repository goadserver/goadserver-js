
# ApiV1UrlPoolsIdUrlsPostRequest


## Properties

Name | Type
------------ | -------------
`url` | string
`title` | string
`weight` | number
`properties` | string
`keywords` | string
`isFallback` | boolean
`startAt` | [ApiV1CreativePoolsIdItemsItemIdPutRequestStartAt](ApiV1CreativePoolsIdItemsItemIdPutRequestStartAt.md)
`endAt` | [ApiV1CreativePoolsIdItemsItemIdPutRequestEndAt](ApiV1CreativePoolsIdItemsItemIdPutRequestEndAt.md)

## Example

```typescript
import type { ApiV1UrlPoolsIdUrlsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "url": https://example.com/lander?src={subid},
  "title": null,
  "weight": null,
  "properties": null,
  "keywords": null,
  "isFallback": null,
  "startAt": null,
  "endAt": null,
} satisfies ApiV1UrlPoolsIdUrlsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1UrlPoolsIdUrlsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


