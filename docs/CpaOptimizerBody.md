
# CpaOptimizerBody

CPA optimizer (target_cpa). Money in the account currency; stored as cents. `id` / `type` are accepted and ignored. 

## Properties

Name | Type
------------ | -------------
`title` | string
`filterType` | string
`maxCpa` | number
`maxDays` | number
`startDate` | Date
`targetCpa` | { [key: string]: number; }
`minMargin` | { [key: string]: number; }
`minCtr` | number
`minCtrImps` | number
`maxCtr` | number
`maxCtrImps` | number
`bounceId` | number
`bounceMinImps` | number
`bounceMaxPerc` | number
`bounceCheckType` | string
`cpaAction` | string
`keepSpotsBlocked` | number
`id` | number
`type` | string

## Example

```typescript
import type { CpaOptimizerBody } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "filterType": null,
  "maxCpa": null,
  "maxDays": null,
  "startDate": null,
  "targetCpa": null,
  "minMargin": null,
  "minCtr": null,
  "minCtrImps": null,
  "maxCtr": null,
  "maxCtrImps": null,
  "bounceId": null,
  "bounceMinImps": null,
  "bounceMaxPerc": null,
  "bounceCheckType": null,
  "cpaAction": null,
  "keepSpotsBlocked": null,
  "id": null,
  "type": null,
} satisfies CpaOptimizerBody

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CpaOptimizerBody
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


