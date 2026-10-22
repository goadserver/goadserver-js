
# ApiV1TrackerSourceAccountsPostRequest


## Properties

Name | Type
------------ | -------------
`driver` | string
`label` | string
`currency` | string
`sourceId` | number
`isActive` | boolean
`credentials` | { [key: string]: string; }

## Example

```typescript
import type { ApiV1TrackerSourceAccountsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "driver": facebook,
  "label": FB — account A,
  "currency": USD,
  "sourceId": null,
  "isActive": null,
  "credentials": null,
} satisfies ApiV1TrackerSourceAccountsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerSourceAccountsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


