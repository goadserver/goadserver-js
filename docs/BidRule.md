
# BidRule

One row in a ruleset\'s priority-ordered rule list. The first rule whose `conditions` match the incoming RTB request supplies the campaign\'s bid for that auction; lower `priority` = walked earlier. 

## Properties

Name | Type
------------ | -------------
`id` | number
`priority` | number
`bid` | number
`tz` | string
`conditions` | [BidRuleConditions](BidRuleConditions.md)

## Example

```typescript
import type { BidRule } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "priority": null,
  "bid": null,
  "tz": null,
  "conditions": null,
} satisfies BidRule

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BidRule
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


