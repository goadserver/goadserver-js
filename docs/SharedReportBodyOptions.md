
# SharedReportBodyOptions

Stats adjustment shown to viewers; dropped unless the account holds adjust_stats.

## Properties

Name | Type
------------ | -------------
`on` | boolean
`impressions` | [SharedReportAdjust](SharedReportAdjust.md)
`clicks` | [SharedReportAdjust](SharedReportAdjust.md)
`paid` | [SharedReportAdjust](SharedReportAdjust.md)

## Example

```typescript
import type { SharedReportBodyOptions } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "on": null,
  "impressions": null,
  "clicks": null,
  "paid": null,
} satisfies SharedReportBodyOptions

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SharedReportBodyOptions
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


