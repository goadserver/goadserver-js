
# ApiV1AccountUiLayoutsScopePutRequestData

A PATCH LIST, not a full menu definition — the panel applies these on top of the menu it builds from the caller\'s rights and modules, so a patch cannot conjure a node the account may not see. 

## Properties

Name | Type
------------ | -------------
`patches` | [Array&lt;ApiV1AccountUiLayoutsScopePutRequestDataPatchesInner&gt;](ApiV1AccountUiLayoutsScopePutRequestDataPatchesInner.md)

## Example

```typescript
import type { ApiV1AccountUiLayoutsScopePutRequestData } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "patches": null,
} satisfies ApiV1AccountUiLayoutsScopePutRequestData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AccountUiLayoutsScopePutRequestData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


