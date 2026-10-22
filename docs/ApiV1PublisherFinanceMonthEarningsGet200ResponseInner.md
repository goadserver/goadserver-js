
# ApiV1PublisherFinanceMonthEarningsGet200ResponseInner


## Properties

Name | Type
------------ | -------------
`id` | number
`yearmonth` | string
`earned` | number
`proEarned` | number
`adEarned` | number
`totalEarned` | number
`ispaid` | boolean

## Example

```typescript
import type { ApiV1PublisherFinanceMonthEarningsGet200ResponseInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "yearmonth": 202609,
  "earned": null,
  "proEarned": null,
  "adEarned": null,
  "totalEarned": null,
  "ispaid": null,
} satisfies ApiV1PublisherFinanceMonthEarningsGet200ResponseInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFinanceMonthEarningsGet200ResponseInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


