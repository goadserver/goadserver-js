
# BidRulesetListItem

Lightweight ruleset row returned by `GET /api/v1/bid-rulesets`. Same identity / metadata as `BidRuleset` minus the `rules` array — the list endpoint is meant for picker UIs and library views; load the full record via `GET /api/v1/bid-rulesets/{id}` when you need rule rows. 

## Properties

Name | Type
------------ | -------------
`id` | number
`userid` | number
`name` | string
`paytype` | string
`defaultTz` | string
`ruleCount` | number
`campaignCount` | number
`updated` | number
`created` | number
`isDeleted` | boolean

## Example

```typescript
import type { BidRulesetListItem } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userid": null,
  "name": null,
  "paytype": null,
  "defaultTz": null,
  "ruleCount": null,
  "campaignCount": null,
  "updated": null,
  "created": null,
  "isDeleted": null,
} satisfies BidRulesetListItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BidRulesetListItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


