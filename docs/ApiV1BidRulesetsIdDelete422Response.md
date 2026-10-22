
# ApiV1BidRulesetsIdDelete422Response


## Properties

Name | Type
------------ | -------------
`error` | string
`message` | string

## Example

```typescript
import type { ApiV1BidRulesetsIdDelete422Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "error": validation_error,
  "message": ruleset is attached to 2 active campaign(s); detach first,
} satisfies ApiV1BidRulesetsIdDelete422Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1BidRulesetsIdDelete422Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


