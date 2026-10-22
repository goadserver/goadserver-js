
# SiteCreate

Site (publisher_sites) create body. Required: `name` + `url`. Module-gated fields become required when their module is active on the tenant — see `GET /api/v1/sites/_schema`. 

## Properties

Name | Type
------------ | -------------
`name` | string
`url` | string
`description` | string
`mainCatid` | number
`typeid` | number
`categories` | Array&lt;number&gt;
`sitelanguages` | Array&lt;string&gt;
`postbacks` | Array&lt;{ [key: string]: any; }&gt;
`adDomainid` | number
`tags` | Array&lt;number&gt;
`isapp` | boolean
`appBundle` | string
`appStoreUrl` | string
`appPlatform` | string

## Example

```typescript
import type { SiteCreate } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": My Blog,
  "url": https://www.example.com,
  "description": null,
  "mainCatid": null,
  "typeid": null,
  "categories": null,
  "sitelanguages": null,
  "postbacks": null,
  "adDomainid": null,
  "tags": null,
  "isapp": null,
  "appBundle": com.example.game,
  "appStoreUrl": https://play.google.com/store/apps/details?id=com.example.game,
  "appPlatform": null,
} satisfies SiteCreate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SiteCreate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


