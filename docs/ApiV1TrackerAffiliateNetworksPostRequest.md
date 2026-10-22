
# ApiV1TrackerAffiliateNetworksPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`templateSlug` | string
`payoutCurrency` | string
`notes` | string

## Example

```typescript
import type { ApiV1TrackerAffiliateNetworksPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": CrakRevenue,
  "templateSlug": null,
  "payoutCurrency": USD,
  "notes": null,
} satisfies ApiV1TrackerAffiliateNetworksPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerAffiliateNetworksPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


