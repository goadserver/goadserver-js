
# ApiV1AdspacesGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`site` | [ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner](ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner.md)
`siteid` | number
`adspaceType` | string
`adzoneTypeid` | number
`adtypeId` | number
`adType` | number
`adsizeid` | number
`isActive` | boolean
`dateAdded` | Date
`timeChanged` | number
`isDeleted` | boolean
`parentid` | number

## Example

```typescript
import type { ApiV1AdspacesGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "site": null,
  "siteid": null,
  "adspaceType": null,
  "adzoneTypeid": null,
  "adtypeId": null,
  "adType": null,
  "adsizeid": null,
  "isActive": null,
  "dateAdded": null,
  "timeChanged": null,
  "isDeleted": null,
  "parentid": null,
} satisfies ApiV1AdspacesGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


