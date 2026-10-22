
# ApiV1TrackerConversionTypesPutRequest


## Properties

Name | Type
------------ | -------------
`labels` | { [key: string]: string; }

## Example

```typescript
import type { ApiV1TrackerConversionTypesPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "labels": {"A":"Sign up","B":"Deposit"},
} satisfies ApiV1TrackerConversionTypesPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerConversionTypesPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


