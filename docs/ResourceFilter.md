
# ResourceFilter

Pin a key to specific resources. Empty/missing = no restriction. A call naming a resource outside the pin answers `403 forbidden_resource`; lists only return pinned resources.  - `campaign_ids` — campaigns and everything under   `/campaigns/{type}/{id}/…`, including its ads (list, show, create,   update, delete, clone, uploads, bids). - `site_ids` — sites and the adspaces on them; an adspace can\'t be   moved to a site outside the pin, and no new site can be created. - `adzone_ids` — adspaces. - `creative_ids` — the creatives library (list, show, used-in,   delete, bulk-move) and the creatives linked into a pool. A key   pinned to creatives can\'t upload new ones. 

## Properties

Name | Type
------------ | -------------
`campaignIds` | Array&lt;number&gt;
`adzoneIds` | Array&lt;number&gt;
`siteIds` | Array&lt;number&gt;
`creativeIds` | Array&lt;number&gt;

## Example

```typescript
import type { ResourceFilter } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "campaignIds": null,
  "adzoneIds": null,
  "siteIds": null,
  "creativeIds": null,
} satisfies ResourceFilter

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResourceFilter
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


