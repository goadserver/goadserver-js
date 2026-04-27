
# ApiV1AccountGet200Response


## Properties

Name | Type
------------ | -------------
`userId` | number
`systemId` | number
`email` | string
`name` | string
`company` | string
`apiKey` | [ApiV1AccountGet200ResponseApiKey](ApiV1AccountGet200ResponseApiKey.md)

## Example

```typescript
import type { ApiV1AccountGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "userId": null,
  "systemId": null,
  "email": null,
  "name": null,
  "company": null,
  "apiKey": null,
} satisfies ApiV1AccountGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AccountGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


