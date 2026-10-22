
# ApiV1TrackerAdNetworksPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`networkid` | number
`currency` | string
`apikey` | string
`apiData` | string
`lowBalanceThreshold` | number

## Example

```typescript
import type { ApiV1TrackerAdNetworksPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "networkid": null,
  "currency": null,
  "apikey": null,
  "apiData": null,
  "lowBalanceThreshold": null,
} satisfies ApiV1TrackerAdNetworksPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TrackerAdNetworksPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


