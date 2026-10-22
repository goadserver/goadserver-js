
# ApiV1FundsDepositTypePostRequest


## Properties

Name | Type
------------ | -------------
`amount` | number
`bonus` | string
`code` | string
`connectedUsers` | number
`whitebitMode` | string
`whitebitTicker` | string
`whitebitNetwork` | string

## Example

```typescript
import type { ApiV1FundsDepositTypePostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "bonus": null,
  "code": null,
  "connectedUsers": null,
  "whitebitMode": null,
  "whitebitTicker": null,
  "whitebitNetwork": null,
} satisfies ApiV1FundsDepositTypePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FundsDepositTypePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


