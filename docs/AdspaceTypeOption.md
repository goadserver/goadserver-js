
# AdspaceTypeOption

One entry from a config adspacetype\'s options bag.

## Properties

Name | Type
------------ | -------------
`key` | string
`type` | string
`_default` | any
`multiple` | boolean
`listItems` | string
`label` | string
`min` | number
`max` | number
`modEnabled` | string
`items` | { [key: string]: any; }
`subOptions` | [Array&lt;AdspaceTypeOption&gt;](AdspaceTypeOption.md)

## Example

```typescript
import type { AdspaceTypeOption } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "key": use_fixed_capping,
  "type": null,
  "_default": null,
  "multiple": null,
  "listItems": null,
  "label": null,
  "min": null,
  "max": null,
  "modEnabled": null,
  "items": null,
  "subOptions": null,
} satisfies AdspaceTypeOption

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceTypeOption
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


