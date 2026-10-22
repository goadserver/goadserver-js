
# PushDeliveryRule

A standing, auction-driven send: every `cadence_hours` the worker picks an ad per subscriber in the target segment and delivers it. Distinct from a push campaign, which carries fixed creative content and is queued once. 

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`segmentId` | number
`segmentName` | string
`cadenceHours` | number
`freqCapHours` | number
`maxPerRun` | number
`isActive` | boolean
`lastRunAt` | string
`lastSentCount` | number
`lastFailedCount` | number
`lastNoAdsCount` | number
`createdAt` | string

## Example

```typescript
import type { PushDeliveryRule } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "segmentId": null,
  "segmentName": null,
  "cadenceHours": null,
  "freqCapHours": null,
  "maxPerRun": null,
  "isActive": null,
  "lastRunAt": null,
  "lastSentCount": null,
  "lastFailedCount": null,
  "lastNoAdsCount": null,
  "createdAt": null,
} satisfies PushDeliveryRule

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PushDeliveryRule
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


