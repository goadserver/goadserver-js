
# ApiV1PublisherPushSubscribersActionPostRequest


## Properties

Name | Type
------------ | -------------
`ids` | Array&lt;number&gt;
`action` | string

## Example

```typescript
import type { ApiV1PublisherPushSubscribersActionPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "ids": [101,102,103],
  "action": deactivate,
} satisfies ApiV1PublisherPushSubscribersActionPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherPushSubscribersActionPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


