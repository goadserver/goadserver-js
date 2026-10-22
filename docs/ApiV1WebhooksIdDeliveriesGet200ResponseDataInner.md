
# ApiV1WebhooksIdDeliveriesGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`eventId` | string
`event` | string
`status` | string
`attempts` | number
`nextAttemptAt` | Date
`lastStatus` | number
`lastError` | string
`deliveredAt` | Date
`createdAt` | Date

## Example

```typescript
import type { ApiV1WebhooksIdDeliveriesGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "eventId": null,
  "event": null,
  "status": null,
  "attempts": null,
  "nextAttemptAt": null,
  "lastStatus": null,
  "lastError": null,
  "deliveredAt": null,
  "createdAt": null,
} satisfies ApiV1WebhooksIdDeliveriesGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1WebhooksIdDeliveriesGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


