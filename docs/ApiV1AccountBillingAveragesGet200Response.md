
# ApiV1AccountBillingAveragesGet200Response


## Properties

Name | Type
------------ | -------------
`costs` | number
`overcharges` | [{ [key: string]: ApiV1AccountBillingAveragesGet200ResponseOverchargesValue; }](ApiV1AccountBillingAveragesGet200ResponseOverchargesValue.md)
`modules` | [Array&lt;ApiV1AccountBillingAveragesGet200ResponseModulesInner&gt;](ApiV1AccountBillingAveragesGet200ResponseModulesInner.md)

## Example

```typescript
import type { ApiV1AccountBillingAveragesGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "costs": null,
  "overcharges": null,
  "modules": null,
} satisfies ApiV1AccountBillingAveragesGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AccountBillingAveragesGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


