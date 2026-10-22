
# ApiV1AdspacesIdCodeGet200ResponseScreen

Screen zones (45): the web player, the playlist (JSON / VAST) and the screen key the player sends.

## Properties

Name | Type
------------ | -------------
`player` | string
`playlist` | string
`vast` | string
`screenKey` | string

## Example

```typescript
import type { ApiV1AdspacesIdCodeGet200ResponseScreen } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "player": null,
  "playlist": null,
  "vast": null,
  "screenKey": null,
} satisfies ApiV1AdspacesIdCodeGet200ResponseScreen

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesIdCodeGet200ResponseScreen
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


