
# PushSubscriber


## Properties

Name | Type
------------ | -------------
`id` | number
`captured` | string
`lastSeen` | string
`spaceid` | number
`sourceName` | string
`clickid` | string
`lang` | string
`ip` | string
`isActive` | boolean

## Example

```typescript
import type { PushSubscriber } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "captured": null,
  "lastSeen": null,
  "spaceid": null,
  "sourceName": null,
  "clickid": null,
  "lang": null,
  "ip": null,
  "isActive": null,
} satisfies PushSubscriber

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PushSubscriber
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


