
# UserEventType


## Properties

Name | Type
------------ | -------------
`name` | string
`label` | string
`description` | string
`scope` | string
`role` | string
`optIn` | boolean
`accountWide` | boolean

## Example

```typescript
import type { UserEventType } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": campaign.paused,
  "label": null,
  "description": null,
  "scope": campaigns.read,
  "role": null,
  "optIn": null,
  "accountWide": null,
} satisfies UserEventType

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserEventType
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


