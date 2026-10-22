
# ApiV1FiltersTypeIdPutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`items` | Array&lt;string&gt;
`adType` | number
`campaignIds` | Array&lt;number&gt;
`campaignType` | string
`ipList` | string
`replaceIpRanges` | boolean

## Example

```typescript
import type { ApiV1FiltersTypeIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "items": null,
  "adType": null,
  "campaignIds": null,
  "campaignType": null,
  "ipList": null,
  "replaceIpRanges": null,
} satisfies ApiV1FiltersTypeIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1FiltersTypeIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


