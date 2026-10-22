
# ApiV1AdScannerPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`target` | string
`scanType` | string
`adtypeid` | number
`tags` | [ApiV1AdScannerPostRequestTags](ApiV1AdScannerPostRequestTags.md)
`config` | object

## Example

```typescript
import type { ApiV1AdScannerPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "target": null,
  "scanType": null,
  "adtypeid": null,
  "tags": null,
  "config": null,
} satisfies ApiV1AdScannerPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdScannerPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


