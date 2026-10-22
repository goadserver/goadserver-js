
# Site

Full site record returned by `GET /api/v1/sites/{id}`. Body shape is round-trippable with `SiteCreate` plus read-only fields (`id`, `domainid`, `is_verified`, `is_deleted`, `date_added`, and the review state `sitestate` / `sitestate_name` / `isvalid` / `rejectedreason`, which only staff change). 

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`url` | string
`description` | string
`typeid` | number
`mainCatid` | number
`categories` | Array&lt;number&gt;
`sitelanguages` | Array&lt;string&gt;
`postbacks` | any
`adDomainid` | number
`domainid` | number
`isVerified` | boolean
`isDeleted` | boolean
`dateAdded` | Date
`tags` | Array&lt;number&gt;
`sitestate` | number
`sitestateName` | string
`isvalid` | boolean
`rejectedreason` | string
`isapp` | boolean
`appBundle` | string
`appStoreUrl` | string
`appPlatform` | string
`verifyCode` | string
`verifyTagPrefix` | string
`verifyMetaTag` | string

## Example

```typescript
import type { Site } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "url": null,
  "description": null,
  "typeid": null,
  "mainCatid": null,
  "categories": null,
  "sitelanguages": null,
  "postbacks": null,
  "adDomainid": null,
  "domainid": null,
  "isVerified": null,
  "isDeleted": null,
  "dateAdded": null,
  "tags": null,
  "sitestate": null,
  "sitestateName": null,
  "isvalid": null,
  "rejectedreason": null,
  "isapp": null,
  "appBundle": null,
  "appStoreUrl": null,
  "appPlatform": null,
  "verifyCode": null,
  "verifyTagPrefix": null,
  "verifyMetaTag": null,
} satisfies Site

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Site
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


