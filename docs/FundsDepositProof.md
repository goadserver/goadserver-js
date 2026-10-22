
# FundsDepositProof

The proof of payment uploaded on a bank / Wise deposit (download: GET /api/v1/funds/deposits/{id}/proof). Null / absent when none.

## Properties

Name | Type
------------ | -------------
`type` | string
`size` | number
`uploadedAt` | number

## Example

```typescript
import type { FundsDepositProof } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "size": null,
  "uploadedAt": null,
} satisfies FundsDepositProof

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FundsDepositProof
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


