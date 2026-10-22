
# TrackerSourceAccount

A credentialed ad account spend is pulled from. Credentials are never returned.

## Properties

Name | Type
------------ | -------------
`id` | number
`driver` | string
`driverName` | string
`driverImplemented` | boolean
`label` | string
`currency` | string
`sourceId` | number
`isActive` | boolean
`lastSyncAt` | string
`lastSyncStatus` | string
`lastSyncError` | string

## Example

```typescript
import type { TrackerSourceAccount } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "driver": null,
  "driverName": null,
  "driverImplemented": null,
  "label": null,
  "currency": null,
  "sourceId": null,
  "isActive": null,
  "lastSyncAt": null,
  "lastSyncStatus": null,
  "lastSyncError": null,
} satisfies TrackerSourceAccount

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerSourceAccount
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


