
# AdspaceTypeItem

One entry returned by GET /api/v1/lookups/adspace-types.

## Properties

Name | Type
------------ | -------------
`id` | number
`key` | string
`name` | string
`adtypeId` | number
`settingsKey` | string
`sellingTypes` | Array&lt;string&gt;
`useMinPrice` | boolean
`useSmartzone` | boolean
`hasOwnAds` | boolean
`hasPreview` | boolean
`right` | string
`options` | [Array&lt;AdspaceTypeOption&gt;](AdspaceTypeOption.md)

## Example

```typescript
import type { AdspaceTypeItem } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": 2,
  "key": bannerads,
  "name": Bannerads,
  "adtypeId": 2,
  "settingsKey": banner_settings,
  "sellingTypes": [cpm, flatrate, ron],
  "useMinPrice": null,
  "useSmartzone": null,
  "hasOwnAds": null,
  "hasPreview": null,
  "right": publish_bannerads,
  "options": null,
} satisfies AdspaceTypeItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceTypeItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


