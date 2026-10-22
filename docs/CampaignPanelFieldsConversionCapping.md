
# CampaignPanelFieldsConversionCapping

ron/cpm: stop after `max` conversions of `conv_type` per day or in total.

## Properties

Name | Type
------------ | -------------
`inuse` | boolean
`convType` | number
`capType` | string
`max` | number

## Example

```typescript
import type { CampaignPanelFieldsConversionCapping } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "inuse": null,
  "convType": null,
  "capType": null,
  "max": null,
} satisfies CampaignPanelFieldsConversionCapping

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CampaignPanelFieldsConversionCapping
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


