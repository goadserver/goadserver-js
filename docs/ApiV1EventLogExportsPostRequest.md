
# ApiV1EventLogExportsPostRequest


## Properties

Name | Type
------------ | -------------
`dateFrom` | Date
`dateTo` | Date
`side` | string
`campaignId` | number
`adId` | number
`siteId` | number
`zoneId` | number
`event` | string
`country` | string
`ip` | string

## Example

```typescript
import type { ApiV1EventLogExportsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "dateFrom": null,
  "dateTo": null,
  "side": null,
  "campaignId": null,
  "adId": null,
  "siteId": null,
  "zoneId": null,
  "event": null,
  "country": null,
  "ip": null,
} satisfies ApiV1EventLogExportsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1EventLogExportsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


