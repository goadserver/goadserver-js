
# TrackerReportSchedule


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`notes` | string
`reportType` | string
`cadence` | string
`dayOfWeek` | number
`dayOfMonth` | number
`hourOfDay` | number
`recipients` | Array&lt;string&gt;
`format` | string
`isActive` | boolean
`lastSentAt` | string

## Example

```typescript
import type { TrackerReportSchedule } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "notes": null,
  "reportType": null,
  "cadence": null,
  "dayOfWeek": null,
  "dayOfMonth": null,
  "hourOfDay": null,
  "recipients": null,
  "format": null,
  "isActive": null,
  "lastSentAt": null,
} satisfies TrackerReportSchedule

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerReportSchedule
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


