
# BidRuleConditions

Structured per-rule match conditions. Every field is an independent include/exclude filter on one request dimension — missing or empty = \"no filter on this dimension\" (i.e. matches every value). A rule fires when **all** populated dimensions match the incoming RTB request.  Notes on specific dimensions:  - `regionids` is matched against the visitor\'s full geo lineage   (continent → country → region → region2 → city) — selecting   \"US\" (the country row from `/api/v1/lookups/regions`) at the   editor therefore fires for every US visitor regardless of   state / city. Send leaf ids when you want a tighter window. - `zone` / `domainids` are include-lists; `zone_block` /   `domainids_block` are exclude-lists. You can mix include +   exclude on the same rule — they\'re independent. - `domainids` / `domainids_block` reference the global   `bigdata.domains` catalogue (same id-space `xref.DomainId`   uses at serve time). The catalogue is far too large for a   list picker — IDs come from advertiser reports. - Daypart: `hour_start` and `hour_end` are integers 0..23   (inclusive), evaluated in the rule\'s `tz` (or the ruleset\'s   `default_tz` when the rule has `tz=\"\"`). When   `hour_end < hour_start` the window wraps past midnight —   e.g. `hour_start=18, hour_end=3` = 18:00 through 03:00 next   morning. - `conn_type` matches the visitor\'s connection class. Pair   `conn_type=[\"cellular\"]` with `carrier_id` for per-carrier   mobile targeting. 

## Properties

Name | Type
------------ | -------------
`regionids` | Array&lt;number&gt;
`osId` | Array&lt;number&gt;
`browserId` | Array&lt;number&gt;
`deviceId` | Array&lt;number&gt;
`zone` | Array&lt;number&gt;
`domainids` | Array&lt;number&gt;
`zoneBlock` | Array&lt;number&gt;
`domainidsBlock` | Array&lt;number&gt;
`carrierId` | Array&lt;number&gt;
`connType` | Array&lt;string&gt;
`lang` | Array&lt;string&gt;
`hourStart` | number
`hourEnd` | number

## Example

```typescript
import type { BidRuleConditions } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "regionids": null,
  "osId": null,
  "browserId": null,
  "deviceId": null,
  "zone": null,
  "domainids": null,
  "zoneBlock": null,
  "domainidsBlock": null,
  "carrierId": null,
  "connType": null,
  "lang": null,
  "hourStart": null,
  "hourEnd": null,
} satisfies BidRuleConditions

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BidRuleConditions
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


