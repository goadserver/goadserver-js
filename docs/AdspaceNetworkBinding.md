
# AdspaceNetworkBinding

External network binding (PUT /api/v1/adspaces/{id}/network-binding). adnetwork_id 0 = not bound.

## Properties

Name | Type
------------ | -------------
`adnetworkId` | number
`adnetworkCampaignid` | number
`adnetworkCampaignKind` | string
`autoApi` | boolean

## Example

```typescript
import type { AdspaceNetworkBinding } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adnetworkId": null,
  "adnetworkCampaignid": null,
  "adnetworkCampaignKind": null,
  "autoApi": null,
} satisfies AdspaceNetworkBinding

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceNetworkBinding
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


