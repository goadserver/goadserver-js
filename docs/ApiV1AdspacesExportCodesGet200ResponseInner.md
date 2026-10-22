
# ApiV1AdspacesExportCodesGet200ResponseInner


## Properties

Name | Type
------------ | -------------
`siteid` | number
`siteName` | string
`ctrlJs` | string
`ctrlJsFailover` | string
`ctrlName` | string
`codes` | [Array&lt;ApiV1AdspacesExportCodesGet200ResponseInnerCodesInner&gt;](ApiV1AdspacesExportCodesGet200ResponseInnerCodesInner.md)

## Example

```typescript
import type { ApiV1AdspacesExportCodesGet200ResponseInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "siteid": null,
  "siteName": null,
  "ctrlJs": null,
  "ctrlJsFailover": null,
  "ctrlName": null,
  "codes": null,
} satisfies ApiV1AdspacesExportCodesGet200ResponseInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesExportCodesGet200ResponseInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


