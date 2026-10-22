
# ApiV1EventsGet200Response


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;UserEvent&gt;](UserEvent.md)
`nextCursor` | string
`hasMore` | boolean
`retentionDays` | number

## Example

```typescript
import type { ApiV1EventsGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "nextCursor": null,
  "hasMore": null,
  "retentionDays": 7,
} satisfies ApiV1EventsGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1EventsGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


