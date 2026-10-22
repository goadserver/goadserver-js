
# ApiV1SharedReportsIdPutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`tagids` | string
`campaigns` | [Array&lt;ApiV1SharedReportsIdPutRequestCampaignsInner&gt;](ApiV1SharedReportsIdPutRequestCampaignsInner.md)
`sites` | [Array&lt;ApiV1SharedReportsIdPutRequestSitesInner&gt;](ApiV1SharedReportsIdPutRequestSitesInner.md)
`settings` | object
`options` | object

## Example

```typescript
import type { ApiV1SharedReportsIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "tagids": null,
  "campaigns": null,
  "sites": null,
  "settings": null,
  "options": null,
} satisfies ApiV1SharedReportsIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1SharedReportsIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


