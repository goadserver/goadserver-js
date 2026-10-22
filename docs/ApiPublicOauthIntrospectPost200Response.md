
# ApiPublicOauthIntrospectPost200Response


## Properties

Name | Type
------------ | -------------
`active` | boolean
`scope` | string
`clientId` | string
`tokenType` | string
`exp` | number
`sub` | string

## Example

```typescript
import type { ApiPublicOauthIntrospectPost200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "active": null,
  "scope": null,
  "clientId": null,
  "tokenType": null,
  "exp": null,
  "sub": null,
} satisfies ApiPublicOauthIntrospectPost200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiPublicOauthIntrospectPost200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


