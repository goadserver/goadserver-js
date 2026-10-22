
# ApiV1FundsGet200Response


## Properties

Name | Type
------------ | -------------
`currency` | string
`balance` | number
`pending` | number
`pendingCount` | number
`minBalance` | number
`lowBalance` | boolean
`lastDeposit` | Date

## Example

```typescript
import type { ApiV1FundsGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "currency": eur,
  "balance": 123.45,
  "pending": 50.0,
  "pendingCount": 1,
  "minBalance": 10.0,
  "lowBalance": false,
  "lastDeposit": 2026-10-01,
} satisfies ApiV1FundsGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FundsGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


