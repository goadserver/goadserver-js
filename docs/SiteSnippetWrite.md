
# SiteSnippetWrite


## Properties

Name | Type
------------ | -------------
`snippetKey` | string
`tagType` | string
`position` | string
`enabled` | boolean
`attrs` | { [key: string]: string; }
`content` | string
`conditions` | [SiteSnippetWriteConditions](SiteSnippetWriteConditions.md)
`sortorder` | number

## Example

```typescript
import type { SiteSnippetWrite } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "snippetKey": null,
  "tagType": null,
  "position": null,
  "enabled": null,
  "attrs": null,
  "content": null,
  "conditions": null,
  "sortorder": null,
} satisfies SiteSnippetWrite

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SiteSnippetWrite
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


