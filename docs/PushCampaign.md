
# PushCampaign


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`title` | string
`body` | string
`icon` | string
`image` | string
`url` | string
`status` | string
`targetCount` | number
`sentCount` | number
`failCount` | number
`createdAt` | string
`sentAt` | string

## Example

```typescript
import type { PushCampaign } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "title": null,
  "body": null,
  "icon": null,
  "image": null,
  "url": null,
  "status": null,
  "targetCount": null,
  "sentCount": null,
  "failCount": null,
  "createdAt": null,
  "sentAt": null,
} satisfies PushCampaign

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PushCampaign
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


