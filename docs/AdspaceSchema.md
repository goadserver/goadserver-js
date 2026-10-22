
# AdspaceSchema

Full per-type schema for adspace create/update. `fields` are the common top-level body fields; `settings_block` is the type-specific nested object; `options` are the config flag bag (booleans, selects, numbers) the type exposes — pass them at body top level. 

## Properties

Name | Type
------------ | -------------
`adspaceType` | string
`id` | number
`adtypeId` | number
`sellingTypes` | Array&lt;string&gt;
`fields` | [Array&lt;AdspaceFieldMeta&gt;](AdspaceFieldMeta.md)
`settingsBlock` | [AdspaceSettingsBlock](AdspaceSettingsBlock.md)
`options` | [Array&lt;AdspaceTypeOption&gt;](AdspaceTypeOption.md)
`notes` | Array&lt;string&gt;

## Example

```typescript
import type { AdspaceSchema } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adspaceType": bannerads,
  "id": 2,
  "adtypeId": 2,
  "sellingTypes": null,
  "fields": null,
  "settingsBlock": null,
  "options": null,
  "notes": null,
} satisfies AdspaceSchema

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceSchema
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


