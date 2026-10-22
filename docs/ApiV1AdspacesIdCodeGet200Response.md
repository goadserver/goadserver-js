
# ApiV1AdspacesIdCodeGet200Response


## Properties

Name | Type
------------ | -------------
`adspaceId` | number
`site` | [ApiV1AdspacesIdCodeGet200ResponseSite](ApiV1AdspacesIdCodeGet200ResponseSite.md)
`spaceName` | string
`jsCode` | string
`adTag` | string
`alternative` | string
`note` | string
`amp` | [ApiV1AdspacesIdCodeGet200ResponseAmp](ApiV1AdspacesIdCodeGet200ResponseAmp.md)
`screen` | [ApiV1AdspacesIdCodeGet200ResponseScreen](ApiV1AdspacesIdCodeGet200ResponseScreen.md)
`ctv` | [ApiV1AdspacesIdCodeGet200ResponseCtv](ApiV1AdspacesIdCodeGet200ResponseCtv.md)
`layout` | string
`layouts` | [Array&lt;ApiV1AdspacesIdCodeGet200ResponseLayoutsInner&gt;](ApiV1AdspacesIdCodeGet200ResponseLayoutsInner.md)

## Example

```typescript
import type { ApiV1AdspacesIdCodeGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adspaceId": null,
  "site": null,
  "spaceName": null,
  "jsCode": null,
  "adTag": null,
  "alternative": null,
  "note": null,
  "amp": null,
  "screen": null,
  "ctv": null,
  "layout": null,
  "layouts": null,
} satisfies ApiV1AdspacesIdCodeGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesIdCodeGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


