
# ApiV1DomainsPostRequest


## Properties

Name | Type
------------ | -------------
`domain` | string
`type` | string
`notes` | string
`skipSsl` | boolean

## Example

```typescript
import type { ApiV1DomainsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "domain": ads.example.com,
  "type": null,
  "notes": null,
  "skipSsl": null,
} satisfies ApiV1DomainsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1DomainsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


