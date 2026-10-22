
# FundsTxnClaim

The transaction hash attached to a manual crypto deposit and its last blockchain check, or the transaction ID attached to a Payoneer deposit (status `submitted`, not checked; network / asset / amount empty). It never credits the balance — an admin approves the deposit.

## Properties

Name | Type
------------ | -------------
`txnHash` | string
`network` | string
`asset` | string
`status` | string
`reason` | string
`amount` | string
`confirmations` | number
`checkedAt` | number
`explorerUrl` | string

## Example

```typescript
import type { FundsTxnClaim } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "txnHash": null,
  "network": null,
  "asset": null,
  "status": null,
  "reason": null,
  "amount": null,
  "confirmations": null,
  "checkedAt": null,
  "explorerUrl": null,
} satisfies FundsTxnClaim

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FundsTxnClaim
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


