
# RtbTestRequest


## Properties

Name | Type
------------ | -------------
`adType` | string
`width` | number
`height` | number
`country` | string
`domain` | string
`pageUrl` | string
`bidfloor` | number
`tmax` | number
`currency` | string
`secure` | number
`userUa` | string
`userIp` | string
`overrideUrl` | string

## Example

```typescript
import type { RtbTestRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adType": null,
  "width": null,
  "height": null,
  "country": null,
  "domain": null,
  "pageUrl": null,
  "bidfloor": null,
  "tmax": null,
  "currency": null,
  "secure": null,
  "userUa": null,
  "userIp": null,
  "overrideUrl": null,
} satisfies RtbTestRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RtbTestRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


