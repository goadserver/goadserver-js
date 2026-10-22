
# ApiV1FundsTransactionsGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`dateadded` | string
`date` | string
`money` | number
`amount` | number
`usedCurrency` | string
`paytype` | number
`ispayed` | number
`status` | string
`description` | string
`acceptsTxnHash` | boolean
`txnRefKind` | string
`paytypeKey` | string
`txnClaim` | [FundsTxnClaim](FundsTxnClaim.md)
`acceptsProof` | boolean
`proof` | [FundsDepositProof](FundsDepositProof.md)

## Example

```typescript
import type { ApiV1FundsTransactionsGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "dateadded": null,
  "date": null,
  "money": null,
  "amount": null,
  "usedCurrency": null,
  "paytype": null,
  "ispayed": null,
  "status": null,
  "description": null,
  "acceptsTxnHash": null,
  "txnRefKind": null,
  "paytypeKey": null,
  "txnClaim": null,
  "acceptsProof": null,
  "proof": null,
} satisfies ApiV1FundsTransactionsGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FundsTransactionsGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


