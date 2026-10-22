
# ApiV1CampaignsTypePostRequestAllOfPriority

**Priority Mode** (ron only, not offers; on networks that offer it — see `_schema`). When `on`, the campaign is served ahead of every non-priority campaign wherever it is eligible, regardless of eCPM or bid; among priority campaigns the lower `order` goes first. Either key may be sent alone — the other keeps its stored value. Not the same as `min_rank`, which is a minimum ad zone quality rank. Returned on list/show for ron campaigns.

## Properties

Name | Type
------------ | -------------
`_true` | boolean
`order` | number

## Example

```typescript
import type { ApiV1CampaignsTypePostRequestAllOfPriority } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "_true": null,
  "order": null,
} satisfies ApiV1CampaignsTypePostRequestAllOfPriority

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypePostRequestAllOfPriority
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


