
# ApiPublicDemoGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`slug` | string
`title` | string
`blurb` | string
`formats` | string

## Example

```typescript
import type { ApiPublicDemoGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "slug": native,
  "title": Native ads,
  "blurb": null,
  "formats": native · native bar,
} satisfies ApiPublicDemoGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiPublicDemoGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


