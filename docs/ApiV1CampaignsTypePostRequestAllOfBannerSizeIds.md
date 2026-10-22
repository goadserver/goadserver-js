
# ApiV1CampaignsTypePostRequestAllOfBannerSizeIds

`type=rtb` only: the banner sizes the campaign bids on — comma-separated banner size ids, or a JSON array of ids. **Required for banner rtb campaigns (`ad_type: 2`)**; ignored for the other ad types.

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { ApiV1CampaignsTypePostRequestAllOfBannerSizeIds } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies ApiV1CampaignsTypePostRequestAllOfBannerSizeIds

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypePostRequestAllOfBannerSizeIds
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


