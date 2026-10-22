
# ApiV1PublisherFinancePayoutRequestPost201ResponsePayout


## Properties

Name | Type
------------ | -------------
`id` | number
`amount` | number
`fee` | number
`netAmount` | number
`paidCurrency` | string
`ispayed` | number

## Example

```typescript
import type { ApiV1PublisherFinancePayoutRequestPost201ResponsePayout } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "amount": null,
  "fee": null,
  "netAmount": null,
  "paidCurrency": null,
  "ispayed": null,
} satisfies ApiV1PublisherFinancePayoutRequestPost201ResponsePayout

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFinancePayoutRequestPost201ResponsePayout
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


