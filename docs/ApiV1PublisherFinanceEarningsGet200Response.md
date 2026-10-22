
# ApiV1PublisherFinanceEarningsGet200Response


## Properties

Name | Type
------------ | -------------
`earnings` | [Array&lt;ApiV1PublisherFinanceEarningsGet200ResponseEarningsInner&gt;](ApiV1PublisherFinanceEarningsGet200ResponseEarningsInner.md)
`period` | [ApiV1PublisherFinanceEarningsGet200ResponsePeriod](ApiV1PublisherFinanceEarningsGet200ResponsePeriod.md)
`summary` | [ApiV1PublisherFinanceEarningsGet200ResponseSummary](ApiV1PublisherFinanceEarningsGet200ResponseSummary.md)

## Example

```typescript
import type { ApiV1PublisherFinanceEarningsGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "earnings": null,
  "period": null,
  "summary": null,
} satisfies ApiV1PublisherFinanceEarningsGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFinanceEarningsGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


