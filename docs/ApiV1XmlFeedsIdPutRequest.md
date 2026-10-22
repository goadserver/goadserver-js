
# ApiV1XmlFeedsIdPutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`url` | string
`itemspath` | string
`titlepath` | string
`descriptionpath` | string
`mediapath` | string
`linkpath` | string
`revisitminutes` | number
`isactive` | number

## Example

```typescript
import type { ApiV1XmlFeedsIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "url": null,
  "itemspath": null,
  "titlepath": null,
  "descriptionpath": null,
  "mediapath": null,
  "linkpath": null,
  "revisitminutes": null,
  "isactive": null,
} satisfies ApiV1XmlFeedsIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1XmlFeedsIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


