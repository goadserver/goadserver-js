
# SharedReportBody


## Properties

Name | Type
------------ | -------------
`name` | string
`statstype` | string
`campaigns` | [Array&lt;SharedReportBodyCampaignsInner&gt;](SharedReportBodyCampaignsInner.md)
`sites` | [Array&lt;ApiV1SharedReportsIdPutRequestSitesInner&gt;](ApiV1SharedReportsIdPutRequestSitesInner.md)
`settings` | [SharedReportBodySettings](SharedReportBodySettings.md)
`options` | [SharedReportBodyOptions](SharedReportBodyOptions.md)
`tagids` | string

## Example

```typescript
import type { SharedReportBody } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "statstype": null,
  "campaigns": null,
  "sites": null,
  "settings": null,
  "options": null,
  "tagids": null,
} satisfies SharedReportBody

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SharedReportBody
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


