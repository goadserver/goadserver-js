
# CampaignPanelFieldsScreens

Banner (ad type 2) ron campaigns on networks with DOOH screens, stored in the campaign options: run on digital screens (adzone type 45). Screens play only campaigns with `on`; `only` keeps the campaign off every other zone; `venues` (empty = any) and a geo-fence (`radius_km` around `lat`/`lon`, 0 = anywhere) narrow the screens. A play is billed as the CPM bid × the screen\'s audience_per_play, so use CPM and a creative in the screen\'s size. Keys you omit on PATCH keep their stored value. Not offered elsewhere (422).

## Properties

Name | Type
------------ | -------------
`_true` | boolean
`only` | boolean
`venues` | Array&lt;string&gt;
`lat` | number
`lon` | number
`radiusKm` | number

## Example

```typescript
import type { CampaignPanelFieldsScreens } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "_true": null,
  "only": null,
  "venues": null,
  "lat": null,
  "lon": null,
  "radiusKm": null,
} satisfies CampaignPanelFieldsScreens

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CampaignPanelFieldsScreens
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


