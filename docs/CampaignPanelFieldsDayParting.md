
# CampaignPanelFieldsDayParting

ron/cpm (not flat), stored in the campaign options. `ranges` maps `\"<weekday 0-6>-<HH:MM>\"` to 1 and is replaced as a whole.

## Properties

Name | Type
------------ | -------------
`_true` | boolean
`halfHours` | boolean
`ranges` | { [key: string]: number; }

## Example

```typescript
import type { CampaignPanelFieldsDayParting } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "_true": null,
  "halfHours": null,
  "ranges": null,
} satisfies CampaignPanelFieldsDayParting

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CampaignPanelFieldsDayParting
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


