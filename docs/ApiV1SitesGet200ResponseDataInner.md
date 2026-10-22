
# ApiV1SitesGet200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`url` | string
`isDeleted` | boolean
`sitestate` | number
`sitestateName` | string
`isVerified` | boolean
`typeid` | number
`mainCatid` | number
`tags` | Array&lt;number&gt;
`dateAdded` | string

## Example

```typescript
import type { ApiV1SitesGet200ResponseDataInner } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "url": null,
  "isDeleted": null,
  "sitestate": null,
  "sitestateName": null,
  "isVerified": null,
  "typeid": null,
  "mainCatid": null,
  "tags": null,
  "dateAdded": null,
} satisfies ApiV1SitesGet200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1SitesGet200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


