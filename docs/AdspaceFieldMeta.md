
# AdspaceFieldMeta

One field entry on the adspace schema response.

## Properties

Name | Type
------------ | -------------
`name` | string
`type` | string
`required` | boolean
`_default` | any
`example` | any
`description` | string
`_enum` | Array&lt;any&gt;
`fields` | [Array&lt;AdspaceFieldMeta&gt;](AdspaceFieldMeta.md)

## Example

```typescript
import type { AdspaceFieldMeta } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": name,
  "type": null,
  "required": null,
  "_default": null,
  "example": null,
  "description": null,
  "_enum": null,
  "fields": null,
} satisfies AdspaceFieldMeta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceFieldMeta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


