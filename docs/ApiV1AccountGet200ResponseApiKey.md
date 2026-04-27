
# ApiV1AccountGet200ResponseApiKey


## Properties

Name | Type
------------ | -------------
`id` | number
`scopes` | Array&lt;string&gt;
`resourceFilter` | [ResourceFilter](ResourceFilter.md)

## Example

```typescript
import type { ApiV1AccountGet200ResponseApiKey } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "scopes": null,
  "resourceFilter": null,
} satisfies ApiV1AccountGet200ResponseApiKey

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AccountGet200ResponseApiKey
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


