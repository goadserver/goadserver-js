
# ApiV1TrackerRulesPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`notes` | string
`scope` | string
`schedule` | string
`isActive` | boolean
`applyActions` | boolean
`conditions` | Array&lt;{ [key: string]: any; }&gt;
`action` | { [key: string]: any; }

## Example

```typescript
import type { ApiV1TrackerRulesPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Pause dead placements,
  "notes": null,
  "scope": null,
  "schedule": null,
  "isActive": null,
  "applyActions": null,
  "conditions": null,
  "action": null,
} satisfies ApiV1TrackerRulesPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerRulesPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


