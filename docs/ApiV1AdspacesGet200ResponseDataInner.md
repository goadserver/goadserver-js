
# ApiV1AdspacesGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`site` | [ApiV1AdspacesGet200ResponseDataInnerSite](ApiV1AdspacesGet200ResponseDataInnerSite.md)
`adType` | number
`isActive` | boolean

## Example

```typescript
import type { ApiV1AdspacesGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "site": null,
  "adType": null,
  "isActive": null,
} satisfies ApiV1AdspacesGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


