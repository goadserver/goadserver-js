
# ApiV1FundsPayTypesGet200ResponsePayTypesInner


## Properties

Name | Type
------------ | -------------
`key` | string
`id` | string
`name` | string
`paytypeId` | number
`initiatesPayment` | boolean
`minAmount` | number
`feeTerms` | { [key: string]: any; }
`order` | number

## Example

```typescript
import type { ApiV1FundsPayTypesGet200ResponsePayTypesInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "key": null,
  "id": null,
  "name": null,
  "paytypeId": null,
  "initiatesPayment": null,
  "minAmount": null,
  "feeTerms": null,
  "order": null,
} satisfies ApiV1FundsPayTypesGet200ResponsePayTypesInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FundsPayTypesGet200ResponsePayTypesInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


