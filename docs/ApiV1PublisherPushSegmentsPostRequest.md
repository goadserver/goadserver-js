
# ApiV1PublisherPushSegmentsPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`sourceSpaceid` | number
`domainid` | number
`clickidOnly` | boolean
`ageMinDays` | number
`ageMaxDays` | number
`activeOnly` | boolean

## Example

```typescript
import type { ApiV1PublisherPushSegmentsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Recent EU opt-ins,
  "sourceSpaceid": 0,
  "domainid": 0,
  "clickidOnly": false,
  "ageMinDays": 0,
  "ageMaxDays": 30,
  "activeOnly": true,
} satisfies ApiV1PublisherPushSegmentsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherPushSegmentsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


