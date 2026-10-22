
# TrackerAffiliateNetwork


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`payoutCurrency` | string
`notes` | string
`trackParams` | { [key: string]: any; }
`options` | { [key: string]: any; }

## Example

```typescript
import type { TrackerAffiliateNetwork } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "payoutCurrency": null,
  "notes": null,
  "trackParams": null,
  "options": null,
} satisfies TrackerAffiliateNetwork

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TrackerAffiliateNetwork
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


