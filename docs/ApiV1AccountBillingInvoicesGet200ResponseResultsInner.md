
# ApiV1AccountBillingInvoicesGet200ResponseResultsInner


## Properties

Name | Type
------------ | -------------
`id` | number
`dateadded` | string
`paySubject` | string
`money` | number
`usedCurrency` | string
`ispayed` | boolean
`paytype` | number
`paytypeString` | string
`bandwidthCosts` | number
`creditState` | number
`datepayed` | string
`proAdearned` | number
`paystatusString` | string

## Example

```typescript
import type { ApiV1AccountBillingInvoicesGet200ResponseResultsInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "dateadded": null,
  "paySubject": null,
  "money": null,
  "usedCurrency": null,
  "ispayed": null,
  "paytype": null,
  "paytypeString": null,
  "bandwidthCosts": null,
  "creditState": null,
  "datepayed": null,
  "proAdearned": null,
  "paystatusString": null,
} satisfies ApiV1AccountBillingInvoicesGet200ResponseResultsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AccountBillingInvoicesGet200ResponseResultsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


