
# PushSegment

A saved audience filter over the network\'s captured push subscribers. Delivery rules reference one to decide who an auctioned send reaches. 

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`sourceSpaceid` | number
`domainid` | number
`clickidOnly` | boolean
`ageMinDays` | number
`ageMaxDays` | number
`activeOnly` | boolean
`subscriberCount` | number
`createdAt` | string

## Example

```typescript
import type { PushSegment } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "sourceSpaceid": null,
  "domainid": null,
  "clickidOnly": null,
  "ageMinDays": null,
  "ageMaxDays": null,
  "activeOnly": null,
  "subscriberCount": null,
  "createdAt": null,
} satisfies PushSegment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PushSegment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


