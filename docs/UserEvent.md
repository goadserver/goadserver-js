
# UserEvent

One event (the feed entry and the webhook body are the same envelope; the feed adds `cursor`). Money is in **cents** — of the network currency for campaign, balance and conversion amounts, of `currency` where an event carries one. 

## Properties

Name | Type
------------ | -------------
`cursor` | string
`id` | string
`type` | string
`createdAt` | Date
`data` | { [key: string]: any; }

## Example

```typescript
import type { UserEvent } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "cursor": null,
  "id": evt_6f1c2a9b0d3e4f5a6b7c8d9e,
  "type": ad.rejected,
  "createdAt": null,
  "data": null,
} satisfies UserEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


