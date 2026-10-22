
# AdspaceSettingsBlock

Per-type settings block descriptor — the key on the request body the type-specific config goes under (e.g. `banner_settings`, `pop_settings`, `native_settings`). 

## Properties

Name | Type
------------ | -------------
`name` | string
`required` | boolean
`description` | string
`fields` | [Array&lt;AdspaceFieldMeta&gt;](AdspaceFieldMeta.md)

## Example

```typescript
import type { AdspaceSettingsBlock } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": banner_settings,
  "required": null,
  "description": null,
  "fields": null,
} satisfies AdspaceSettingsBlock

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceSettingsBlock
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


