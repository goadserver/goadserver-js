
# CpmOptimizerBody

CPM optimizer settings (the panel\'s Source Optimizer → CPM form). Money in the account currency, as entered. `id`, `type`, `userid` are accepted and ignored so a fetched record can be sent back. 

## Properties

Name | Type
------------ | -------------
`title` | string
`optType` | string
`minSpendings` | number
`minImpressions` | number
`maxDays` | number
`startDate` | Date
`convType` | string
`optimiseWith` | string
`maxCpa` | number
`allowedMargin` | number
`useBidoptimiser` | number
`increaseBids` | number
`increaseBidPerc` | number
`increaseBidCap` | number
`decreaseBids` | number
`decreaseBidPerc` | number
`decreaseBidCap` | number
`minCtr` | number
`minCtrImps` | number
`maxCtr` | number
`maxCtrImps` | number
`id` | number
`type` | string
`userid` | number

## Example

```typescript
import type { CpmOptimizerBody } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "optType": null,
  "minSpendings": null,
  "minImpressions": null,
  "maxDays": null,
  "startDate": null,
  "convType": null,
  "optimiseWith": null,
  "maxCpa": null,
  "allowedMargin": null,
  "useBidoptimiser": null,
  "increaseBids": null,
  "increaseBidPerc": null,
  "increaseBidCap": null,
  "decreaseBids": null,
  "decreaseBidPerc": null,
  "decreaseBidCap": null,
  "minCtr": null,
  "minCtrImps": null,
  "maxCtr": null,
  "maxCtrImps": null,
  "id": null,
  "type": null,
  "userid": null,
} satisfies CpmOptimizerBody

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CpmOptimizerBody
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


