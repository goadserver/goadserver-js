
# TrackerRule


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`notes` | string
`scope` | string
`schedule` | string
`isActive` | boolean
`applyActions` | boolean
`lastRunAt` | string

## Example

```typescript
import type { TrackerRule } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "notes": null,
  "scope": null,
  "schedule": null,
  "isActive": null,
  "applyActions": null,
  "lastRunAt": null,
} satisfies TrackerRule

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerRule
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


