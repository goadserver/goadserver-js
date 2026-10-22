
# SharedReportBodySettings


## Properties

Name | Type
------------ | -------------
`adTypes` | Array&lt;number&gt;
`sellingTypes` | Array&lt;number&gt;
`deviceTypes` | Array&lt;number&gt;
`countries` | Array&lt;string&gt;
`visibleMetrics` | Array&lt;string&gt;
`visibleConvTypes` | Array&lt;number&gt;
`allowedGroupby` | Array&lt;string&gt;
`defaultGroupby` | string
`allowedViewtypes` | Array&lt;string&gt;
`viewerFilters` | Array&lt;string&gt;
`followGroups` | boolean
`showNames` | boolean

## Example

```typescript
import type { SharedReportBodySettings } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adTypes": null,
  "sellingTypes": null,
  "deviceTypes": null,
  "countries": null,
  "visibleMetrics": null,
  "visibleConvTypes": null,
  "allowedGroupby": null,
  "defaultGroupby": null,
  "allowedViewtypes": null,
  "viewerFilters": null,
  "followGroups": null,
  "showNames": null,
} satisfies SharedReportBodySettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SharedReportBodySettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


