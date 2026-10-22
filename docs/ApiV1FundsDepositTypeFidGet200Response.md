
# ApiV1FundsDepositTypeFidGet200Response


## Properties

Name | Type
------------ | -------------
`view` | string
`url` | string
`depositId` | number
`transactionId` | number
`money` | number
`totalmoney` | number
`usedCurrency` | string
`bankDetails` | Array&lt;string&gt;
`payee` | string
`walletId` | string
`walletNetwork` | string
`acceptsTxnHash` | boolean
`txnRefKind` | string
`acceptsProof` | boolean
`proof` | [FundsDepositProof](FundsDepositProof.md)
`txnClaim` | [FundsTxnClaim](FundsTxnClaim.md)
`invoicePaid` | boolean
`invoiceInProgress` | boolean
`unknownInvoice` | boolean

## Example

```typescript
import type { ApiV1FundsDepositTypeFidGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "view": mollie,
  "url": null,
  "depositId": null,
  "transactionId": null,
  "money": null,
  "totalmoney": null,
  "usedCurrency": null,
  "bankDetails": null,
  "payee": null,
  "walletId": null,
  "walletNetwork": null,
  "acceptsTxnHash": null,
  "txnRefKind": null,
  "acceptsProof": null,
  "proof": null,
  "txnClaim": null,
  "invoicePaid": null,
  "invoiceInProgress": null,
  "unknownInvoice": null,
} satisfies ApiV1FundsDepositTypeFidGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FundsDepositTypeFidGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


