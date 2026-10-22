
# ApiV1TrackerOffersPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`destinationUrl` | string
`urls` | [Array&lt;ApiV1TrackerOffersPostRequestUrlsInner&gt;](ApiV1TrackerOffersPostRequestUrlsInner.md)
`payout` | number
`revsharePct` | number
`paytype` | string
`convType` | string
`country` | string
`affiliateNetworkId` | number
`failoverOfferId` | number
`dailyCap` | number
`totalCap` | number
`notes` | string
`paused` | boolean
`asFailover` | boolean
`tags` | string
`offertypeid` | number
`regionids` | Array&lt;number&gt;
`deviceTypeIds` | Array&lt;number&gt;
`osids` | Array&lt;number&gt;
`browserids` | Array&lt;number&gt;
`carrierids` | Array&lt;number&gt;
`ispids` | Array&lt;number&gt;

## Example

```typescript
import type { ApiV1TrackerOffersPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": CrakRevenue — Dating US,
  "destinationUrl": https://partner.example.com/lp?clickid={clickid},
  "urls": null,
  "payout": 2.5,
  "revsharePct": null,
  "paytype": null,
  "convType": null,
  "country": US,CA,
  "affiliateNetworkId": null,
  "failoverOfferId": null,
  "dailyCap": null,
  "totalCap": null,
  "notes": null,
  "paused": null,
  "asFailover": null,
  "tags": null,
  "offertypeid": null,
  "regionids": null,
  "deviceTypeIds": null,
  "osids": null,
  "browserids": null,
  "carrierids": null,
  "ispids": null,
} satisfies ApiV1TrackerOffersPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerOffersPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


