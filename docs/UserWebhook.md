
# UserWebhook


## Properties

Name | Type
------------ | -------------
`id` | number
`url` | string
`events` | Array&lt;string&gt;
`description` | string
`status` | string
`pausedReason` | string
`failCount` | number
`credential` | string
`apiKeyId` | number
`apiKeyName` | string
`appId` | number
`appName` | string
`credentialActive` | boolean
`keyId` | string
`previousKeyId` | string
`previousValidUntil` | Date
`waiting` | number
`createdAt` | Date
`updatedAt` | Date
`secret` | string

## Example

```typescript
import type { UserWebhook } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "url": null,
  "events": null,
  "description": null,
  "status": null,
  "pausedReason": null,
  "failCount": null,
  "credential": null,
  "apiKeyId": null,
  "apiKeyName": null,
  "appId": null,
  "appName": null,
  "credentialActive": null,
  "keyId": v1,
  "previousKeyId": null,
  "previousValidUntil": null,
  "waiting": null,
  "createdAt": null,
  "updatedAt": null,
  "secret": null,
} satisfies UserWebhook

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserWebhook
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


