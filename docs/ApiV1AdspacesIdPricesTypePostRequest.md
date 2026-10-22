
# ApiV1AdspacesIdPricesTypePostRequest


## Properties

Name | Type
------------ | -------------
`deviceTypeid` | number
`cpmPrice` | [Array&lt;ApiV1AdspacesIdPricesTypePostRequestCpmPriceInner&gt;](ApiV1AdspacesIdPricesTypePostRequestCpmPriceInner.md)

## Example

```typescript
import type { ApiV1AdspacesIdPricesTypePostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "deviceTypeid": null,
  "cpmPrice": null,
} satisfies ApiV1AdspacesIdPricesTypePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesIdPricesTypePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


