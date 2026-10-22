
# ApiV1FundsTransactionsGet200Response


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;ApiV1FundsTransactionsGet200ResponseDataInner&gt;](ApiV1FundsTransactionsGet200ResponseDataInner.md)
`meta` | [ApiV1PublisherFinancePayoutsGet200ResponseMeta](ApiV1PublisherFinancePayoutsGet200ResponseMeta.md)
`paymentMethods` | [Array&lt;ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner&gt;](ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner.md)

## Example

```typescript
import type { ApiV1FundsTransactionsGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "meta": null,
  "paymentMethods": null,
} satisfies ApiV1FundsTransactionsGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FundsTransactionsGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


