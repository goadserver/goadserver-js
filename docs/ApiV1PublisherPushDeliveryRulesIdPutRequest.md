
# ApiV1PublisherPushDeliveryRulesIdPutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`segmentId` | number
`cadenceHours` | number
`freqCapHours` | number
`maxPerRun` | number
`isActive` | boolean

## Example

```typescript
import type { ApiV1PublisherPushDeliveryRulesIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Daily re-engagement,
  "segmentId": 7,
  "cadenceHours": 24,
  "freqCapHours": 12,
  "maxPerRun": 0,
  "isActive": false,
} satisfies ApiV1PublisherPushDeliveryRulesIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherPushDeliveryRulesIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


