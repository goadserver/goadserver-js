
# MediaBuyingPolicyTestPhase

Launch test phase: the network budget is not raised before its verdict. Set by a launch (`test_days`, default 3); `null` ends it (also after a failed verdict, to let the budget rule raise again). `days` 1-14 (the only key to send to start one on a connected zone); read-only: `from` (first judged day, set the day the zone is first seen connected), `result` (empty = running | `passed` | `failed` — raises stay held | `no_data` — less than min_spend in 3 x the days), `margin_pct`, `cost`, `revenue`, `judged_on`.

## Properties

Name | Type
------------ | -------------
`days` | number
`from` | string
`result` | string
`marginPct` | number
`cost` | number
`revenue` | number
`judgedOn` | string

## Example

```typescript
import type { MediaBuyingPolicyTestPhase } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "days": null,
  "from": null,
  "result": null,
  "marginPct": null,
  "cost": null,
  "revenue": null,
  "judgedOn": null,
} satisfies MediaBuyingPolicyTestPhase

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaBuyingPolicyTestPhase
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


