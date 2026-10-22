
# MediaBuyingPolicy

The buying policy of one ad zone (docs/MEDIA_BUYING.md). On PUT every field is optional: a field left out keeps its stored value; out-of-range values are clamped. Nothing scheduled acts on the zone until `enabled` is true.

## Properties

Name | Type
------------ | -------------
`enabled` | boolean
`mode` | string
`zoneSlot` | string
`revenueMetric` | string
`windowDays` | number
`minSpend` | number
`minVolume` | number
`targetMarginPct` | number
`maxCpa` | number
`maxBlocksPerDay` | number
`judging` | string
`confidencePct` | number
`pooling` | string
`poolStrength` | number
`ipPreblockMode` | string
`ipPreblockHosting` | boolean
`ipPreblockMax` | number
`ipPreblockTtlDays` | number
`attribution` | string
`report` | string
`minDeliveryPct` | number
`minNetworkCount` | number
`maxOffgeoPct` | number
`minGeoVolume` | number
`budgetReservePct` | number
`minSwitchMinutes` | number
`maxDailySourceSpend` | number
`stopLoss` | number
`bidMode` | string
`bidStepPct` | number
`bidBandPct` | number
`bidMinSpend` | number
`minBid` | number
`maxBid` | number
`bidCooldownHours` | number
`agentMode` | string
`agentEveryHours` | number
`agentEveryMinutes` | number
`agentIntervalAuto` | boolean
`agentMaxActions` | number
`agentNotes` | string
`controlFor` | number
`startPreset` | string
`testPhase` | [MediaBuyingPolicyTestPhase](MediaBuyingPolicyTestPhase.md)
`budgetMode` | string
`budgetHeadroomPct` | number
`minNetworkBudget` | number
`maxNetworkBudget` | number
`budgetPaceHours` | number
`segmentMode` | string
`segmentMinSpend` | number
`segmentWindowDays` | number
`mirrorAdvertiserBlocks` | boolean
`zoneBidMode` | string
`zoneBidStepPct` | number
`zoneBidBandPct` | number
`zoneBidFloorPct` | number
`zoneBidCeilingPct` | number
`inheritBlocks` | object

## Example

```typescript
import type { MediaBuyingPolicy } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "enabled": null,
  "mode": null,
  "zoneSlot": null,
  "revenueMetric": null,
  "windowDays": null,
  "minSpend": null,
  "minVolume": null,
  "targetMarginPct": null,
  "maxCpa": null,
  "maxBlocksPerDay": null,
  "judging": null,
  "confidencePct": null,
  "pooling": null,
  "poolStrength": null,
  "ipPreblockMode": null,
  "ipPreblockHosting": null,
  "ipPreblockMax": null,
  "ipPreblockTtlDays": null,
  "attribution": null,
  "report": null,
  "minDeliveryPct": null,
  "minNetworkCount": null,
  "maxOffgeoPct": null,
  "minGeoVolume": null,
  "budgetReservePct": null,
  "minSwitchMinutes": null,
  "maxDailySourceSpend": null,
  "stopLoss": null,
  "bidMode": null,
  "bidStepPct": null,
  "bidBandPct": null,
  "bidMinSpend": null,
  "minBid": null,
  "maxBid": null,
  "bidCooldownHours": null,
  "agentMode": null,
  "agentEveryHours": null,
  "agentEveryMinutes": null,
  "agentIntervalAuto": null,
  "agentMaxActions": null,
  "agentNotes": null,
  "controlFor": null,
  "startPreset": null,
  "testPhase": null,
  "budgetMode": null,
  "budgetHeadroomPct": null,
  "minNetworkBudget": null,
  "maxNetworkBudget": null,
  "budgetPaceHours": null,
  "segmentMode": null,
  "segmentMinSpend": null,
  "segmentWindowDays": null,
  "mirrorAdvertiserBlocks": null,
  "zoneBidMode": null,
  "zoneBidStepPct": null,
  "zoneBidBandPct": null,
  "zoneBidFloorPct": null,
  "zoneBidCeilingPct": null,
  "inheritBlocks": null,
} satisfies MediaBuyingPolicy

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaBuyingPolicy
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


