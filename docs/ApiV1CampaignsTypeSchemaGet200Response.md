
# ApiV1CampaignsTypeSchemaGet200Response


## Properties

Name | Type
------------ | -------------
`campaignType` | string
`fields` | [Array&lt;ApiV1CampaignsTypeSchemaGet200ResponseFieldsInner&gt;](ApiV1CampaignsTypeSchemaGet200ResponseFieldsInner.md)
`notes` | Array&lt;string&gt;

## Example

```typescript
import type { ApiV1CampaignsTypeSchemaGet200Response } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "campaignType": null,
  "fields": null,
  "notes": null,
} satisfies ApiV1CampaignsTypeSchemaGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeSchemaGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


