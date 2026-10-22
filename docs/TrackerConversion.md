
# TrackerConversion


## Properties

Name | Type
------------ | -------------
`id` | number
`datetime` | string
`clickid` | string
`offerId` | number
`offerName` | string
`linkId` | number
`linkName` | string
`payout` | number
`state` | number
`status` | string
`reasonId` | number
`reason` | string
`convType` | number
`convTypeLetter` | string
`convTypeName` | string
`subid` | string
`ipaddress` | string

## Example

```typescript
import type { TrackerConversion } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "datetime": null,
  "clickid": null,
  "offerId": null,
  "offerName": null,
  "linkId": null,
  "linkName": null,
  "payout": null,
  "state": null,
  "status": null,
  "reasonId": null,
  "reason": null,
  "convType": null,
  "convTypeLetter": null,
  "convTypeName": null,
  "subid": null,
  "ipaddress": null,
} satisfies TrackerConversion

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerConversion
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


