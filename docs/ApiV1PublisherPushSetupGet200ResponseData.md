
# ApiV1PublisherPushSetupGet200ResponseData


## Properties

Name | Type
------------ | -------------
`adDomain` | string
`swPath` | string
`subscriberTotal` | number
`subscriberActive` | number
`adzones` | [Array&lt;ApiV1PublisherPushSetupGet200ResponseDataAdzonesInner&gt;](ApiV1PublisherPushSetupGet200ResponseDataAdzonesInner.md)

## Example

```typescript
import type { ApiV1PublisherPushSetupGet200ResponseData } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "adDomain": null,
  "swPath": /push-subscriber-sw.js,
  "subscriberTotal": null,
  "subscriberActive": null,
  "adzones": null,
} satisfies ApiV1PublisherPushSetupGet200ResponseData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherPushSetupGet200ResponseData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


