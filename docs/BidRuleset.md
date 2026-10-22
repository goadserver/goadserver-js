
# BidRuleset

Full ruleset record. Returned by the show / create / update / clone endpoints. The `rules` array is pre-sorted by `priority` ASC. 

## Properties

Name | Type
------------ | -------------
`id` | number
`userid` | number
`name` | string
`paytype` | string
`defaultTz` | string
`rules` | [Array&lt;BidRule&gt;](BidRule.md)
`isDeleted` | boolean
`created` | number
`updated` | number
`campaignCount` | number

## Example

```typescript
import type { BidRuleset } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userid": null,
  "name": null,
  "paytype": null,
  "defaultTz": null,
  "rules": null,
  "isDeleted": null,
  "created": null,
  "updated": null,
  "campaignCount": null,
} satisfies BidRuleset

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BidRuleset
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


