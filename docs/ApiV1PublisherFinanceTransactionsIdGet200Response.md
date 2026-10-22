
# ApiV1PublisherFinanceTransactionsIdGet200Response


## Properties

Name | Type
------------ | -------------
`id` | number
`transactionid` | number
`transacttype` | number
`dateadded` | string
`money` | number
`ispaid` | number
`datepaid` | string
`isunpayable` | number
`txt` | string
`refundNote` | string
`paidCurrency` | string
`companyid` | number
`description` | string

## Example

```typescript
import type { ApiV1PublisherFinanceTransactionsIdGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "transactionid": null,
  "transacttype": null,
  "dateadded": null,
  "money": null,
  "ispaid": null,
  "datepaid": null,
  "isunpayable": null,
  "txt": null,
  "refundNote": null,
  "paidCurrency": null,
  "companyid": null,
  "description": null,
} satisfies ApiV1PublisherFinanceTransactionsIdGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFinanceTransactionsIdGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


