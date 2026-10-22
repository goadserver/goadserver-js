
# ApiV1PublisherPushStatsGet200ResponseData


## Properties

Name | Type
------------ | -------------
`windowDays` | number
`summary` | [ApiV1PublisherPushStatsGet200ResponseDataSummary](ApiV1PublisherPushStatsGet200ResponseDataSummary.md)
`daily` | [Array&lt;ApiV1PublisherPushStatsGet200ResponseDataDailyInner&gt;](ApiV1PublisherPushStatsGet200ResponseDataDailyInner.md)
`growth` | [Array&lt;ApiV1PublisherPushStatsGet200ResponseDataGrowthInner&gt;](ApiV1PublisherPushStatsGet200ResponseDataGrowthInner.md)

## Example

```typescript
import type { ApiV1PublisherPushStatsGet200ResponseData } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "windowDays": null,
  "summary": null,
  "daily": null,
  "growth": null,
} satisfies ApiV1PublisherPushStatsGet200ResponseData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherPushStatsGet200ResponseData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


