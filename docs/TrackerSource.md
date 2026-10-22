
# TrackerSource


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`templateSlug` | string
`adzoneCount` | number
`postbacks` | { [key: string]: any; }

## Example

```typescript
import type { TrackerSource } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "templateSlug": null,
  "adzoneCount": null,
  "postbacks": null,
} satisfies TrackerSource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerSource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


