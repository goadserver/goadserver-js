
# ApiV1PublisherPushCampaignsPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`title` | string
`body` | string
`icon` | string
`image` | string
`url` | string

## Example

```typescript
import type { ApiV1PublisherPushCampaignsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Weekend promo,
  "title": New offers just dropped,
  "body": Tap to see this week's top campaigns.,
  "icon": https://cdn.example.com/icon-192.png,
  "image": https://cdn.example.com/hero.jpg,
  "url": https://example.com/offers,
} satisfies ApiV1PublisherPushCampaignsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherPushCampaignsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


