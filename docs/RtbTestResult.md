
# RtbTestResult


## Properties

Name | Type
------------ | -------------
`verdict` | string
`httpStatus` | number
`latencyMs` | number
`requestUrl` | string
`requestMethod` | string
`requestHeaders` | { [key: string]: string; }
`requestBody` | string
`responseHeaders` | { [key: string]: string; }
`responseBody` | string
`responseBodyTruncated` | boolean
`errorCategory` | string
`errorMessage` | string
`hints` | Array&lt;string&gt;
`bidCount` | number
`bestPrice` | number

## Example

```typescript
import type { RtbTestResult } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "verdict": null,
  "httpStatus": null,
  "latencyMs": null,
  "requestUrl": null,
  "requestMethod": null,
  "requestHeaders": null,
  "requestBody": null,
  "responseHeaders": null,
  "responseBody": null,
  "responseBodyTruncated": null,
  "errorCategory": null,
  "errorMessage": null,
  "hints": null,
  "bidCount": null,
  "bestPrice": null,
} satisfies RtbTestResult

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RtbTestResult
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


