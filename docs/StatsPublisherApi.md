# StatsPublisherApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherStatsGet**](StatsPublisherApi.md#apiv1publisherstatsget) | **GET** /api/v1/publisher/stats | Publisher earnings (sites / adzones). |



## apiV1PublisherStatsGet

> StatsResponse apiV1PublisherStatsGet(from, to, interval, viewtype, groupBy, metrics, filterWebsite, filterAdzoneId, filterCountry, filterDevice, filterAdType, filterSellingType, filterTagId, filterAdzoneType, filterAdDomain, filterBots, min, max, format, page, perPage, sort)

Publisher earnings (sites / adzones).

Aggregated publisher earnings. Pick the dimensions to group by, the metrics you want returned, and any filters — the form below auto-builds the query.  **Money:** &#x60;earned&#x60; and &#x60;ecpm&#x60; are in the account currency (currency units, not cents), like the panel.  **Bot counters:** &#x60;bot_views&#x60; / &#x60;bot_clicks&#x60; and &#x60;filter[bots]&#x60; are available where the panel shows its Bot Info columns — admanager tenants, or accounts holding the &#x60;display_botinfo&#x60; right. Elsewhere the two metrics are not returned even when asked for, and &#x60;filter[bots]&#x60; is ignored.  **Conversion slots:** &#x60;conv_a&#x60; / &#x60;conv_b&#x60; / &#x60;conv_c&#x60; / &#x60;conv_d&#x60; / &#x60;conv_e&#x60; are conversion types 0 / 1 / 2 / 3 / 4. On admanager tenants they are your own slots, named on &#x60;GET /api/v1/tracking/conversion-types&#x60; (ids 0-4); the panel and its CSV exports head the columns with those names there. On an adnetwork they stay neutral letters.  **Costs and cost per conversion:** on admanager tenants (where the panel shows its Costs / CPA columns) &#x60;costs&#x60; is your traffic cost in the account currency and &#x60;cost_per_conv_a&#x60; … &#x60;cost_per_conv_e&#x60; is &#x60;costs&#x60; divided by that slot\&#39;s conversions (0 when the slot has none), rounded to 4 decimals, on every row and in &#x60;totals&#x60;. Pick the slot that is your acquisition: e.g. a cost per lead is &#x60;cost_per_conv_a&#x60; when slot 0 is your \&quot;Sign up / lead\&quot; type, a cost per join &#x60;cost_per_conv_e&#x60; when slot 4 is \&quot;Joins\&quot;. The panel\&#39;s &#x60;cpa&#x60; column is &#x60;cost_per_conv_a&#x60;. Elsewhere these metrics are not returned even when asked for. All six also sort (&#x60;sort&#x3D;-cost_per_conv_e&#x60;). 

### Example

```ts
import {
  Configuration,
  StatsPublisherApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' (optional)
    interval: interval_example,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' | The panel\'s name for `interval` (\"Display By\"). Used only when `interval` is absent.  (optional)
    viewtype: viewtype_example,
    // Array<'adzone' | 'website' | 'country' | 'os' | 'browser' | 'device' | 'domain' | 'subid' | 'clickid' | 'sid1' | 'sid2' | 'sid3' | 'sid4' | 'sid5' | 'network' | 'ad_type' | 'ad_domain'> | Dimensions to aggregate by, in priority order. Multi-pick up to 8. High-cardinality dims (`subid`, `clickid`, `sid*`, `domain`) explode row count — pair with `from`/`to`/pagination.  Each grouped dimension comes back as an `{id, name}` object, except `country`, `domain` and `subid`, which are plain strings. `ad_type` is the campaign ad type (name from the tenant\'s ad-type list); `ad_domain` is the ad-serving domain the impression was served from (`{id, name}` with the domain as name). On the free-text dims that do return an object (`clickid`, `sid1`–`sid5`) the `id` is always 0 and `name` carries the value.  (optional)
    groupBy: ["country","device"],
    // Array<'views' | 'clicks' | 'ctr' | 'ecpm' | 'earned' | 'un_views' | 'no_ads' | 'requests' | 'bot_views' | 'bot_clicks' | 'conv_a' | 'conv_b' | 'conv_c' | 'conv_d' | 'conv_e' | 'costs' | 'cost_per_conv_a' | 'cost_per_conv_b' | 'cost_per_conv_c' | 'cost_per_conv_d' | 'cost_per_conv_e'> | Metrics to return. Multi-pick — leave empty for all. Unknown names are ignored. `bot_views` / `bot_clicks` (views / clicks the ad server flagged as bot traffic, a subset of `views` / `clicks`) only where Bot Info is enabled, `costs` and `cost_per_conv_a` … `cost_per_conv_e` only on admanager tenants — see above.  (optional)
    metrics: ...,
    // number | Site ID — look up via `GET /api/v1/sites`. (optional)
    filterWebsite: 56,
    // string | Adspace ID, or comma-separated list. Look up via `GET /api/v1/adspaces`. (optional)
    filterAdzoneId: 12345,12346,
    // string | ISO-3166 alpha-2 country code (e.g. `US`, `DE`, `BR`). (optional)
    filterCountry: US,
    // 1 | 2 | 3 | 4 | 5 | 6 | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  (optional)
    filterDevice: 56,
    // number | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  (optional)
    filterAdType: 56,
    // 1 | 2 | 3 | 4 | 5 | Campaign selling type:  | ID | Selling type | |----|--------------| | 1  | RON (CPC) | | 2  | Flatrate | | 3  | CPM | | 4  | RTB | | 5  | SmartZone |  (optional)
    filterSellingType: 56,
    // string | Tag ID, or comma-separated list. Resolves to the bound adzones. (optional)
    filterTagId: filterTagId_example,
    // string | Adzone type id(s), comma-separated (the `id` of `GET /api/v1/lookups/adspace-types`).  (optional)
    filterAdzoneType: 2,11,
    // string | Ad-serving domain id(s), comma-separated — the `id` returned for `group_by=ad_domain`.  (optional)
    filterAdDomain: 14,
    // 1 | 2 | `1` = only traffic flagged as bots, `2` = exclude it. Ignored unless Bot Info is enabled for the account (see above).  (optional)
    filterBots: 56,
    // { [key: string]: number; } | Keep only rows whose metric is at least this value, as `min[<metric>]=<number>` — e.g. `min[cost_per_conv_a]=10`. Pair with `max[<metric>]` for a range (both ends inclusive). Any metric `metrics` accepts for this caller can be bounded, whether or not it is returned; several metrics combine with AND. A row with no value for the metric is dropped. Money in main currency units, `ctr` in percent. Same as the comparisons (`>10`, `<200`, `10-200`) in the panel\'s statistics details column search.  With a bound set, up to 10,000 grouped rows (in `sort` order) are tested and the survivors paginated; `total_rows` counts the survivors, `totals` stay over the whole selection, and `range_scan_truncated: true` says more rows existed than were tested. Unknown metric, non-number or min > max → 422.  (optional)
    min: {"cost_per_conv_a":10},
    // { [key: string]: number; } | Keep only rows whose metric is at most this value, as `max[<metric>]=<number>`. See `min`. (optional)
    max: {"cost_per_conv_a":200},
    // 'json' | 'csv' (optional)
    format: format_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Field name. Prefix with `-` for descending (e.g. `-views`). (optional)
    sort: sort_example,
  } satisfies ApiV1PublisherStatsGetRequest;

  try {
    const data = await api.apiV1PublisherStatsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **from** | `Date` | ISO date — inclusive start. Defaults to 7 days ago. | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | ISO date — inclusive end. Defaults to today. Max range 92 days. | [Optional] [Defaults to `undefined`] |
| **interval** | `day`, `hour`, `week`, `month`, `sum` |  | [Optional] [Defaults to `&#39;sum&#39;`] [Enum: day, hour, week, month, sum] |
| **viewtype** | `day`, `hour`, `week`, `month`, `sum` | The panel\&#39;s name for &#x60;interval&#x60; (\&quot;Display By\&quot;). Used only when &#x60;interval&#x60; is absent.  | [Optional] [Defaults to `undefined`] [Enum: day, hour, week, month, sum] |
| **groupBy** | `adzone`, `website`, `country`, `os`, `browser`, `device`, `domain`, `subid`, `clickid`, `sid1`, `sid2`, `sid3`, `sid4`, `sid5`, `network`, `ad_type`, `ad_domain` | Dimensions to aggregate by, in priority order. Multi-pick up to 8. High-cardinality dims (&#x60;subid&#x60;, &#x60;clickid&#x60;, &#x60;sid*&#x60;, &#x60;domain&#x60;) explode row count — pair with &#x60;from&#x60;/&#x60;to&#x60;/pagination.  Each grouped dimension comes back as an &#x60;{id, name}&#x60; object, except &#x60;country&#x60;, &#x60;domain&#x60; and &#x60;subid&#x60;, which are plain strings. &#x60;ad_type&#x60; is the campaign ad type (name from the tenant\&#39;s ad-type list); &#x60;ad_domain&#x60; is the ad-serving domain the impression was served from (&#x60;{id, name}&#x60; with the domain as name). On the free-text dims that do return an object (&#x60;clickid&#x60;, &#x60;sid1&#x60;–&#x60;sid5&#x60;) the &#x60;id&#x60; is always 0 and &#x60;name&#x60; carries the value.  | [Optional] [Enum: adzone, website, country, os, browser, device, domain, subid, clickid, sid1, sid2, sid3, sid4, sid5, network, ad_type, ad_domain] |
| **metrics** | `views`, `clicks`, `ctr`, `ecpm`, `earned`, `un_views`, `no_ads`, `requests`, `bot_views`, `bot_clicks`, `conv_a`, `conv_b`, `conv_c`, `conv_d`, `conv_e`, `costs`, `cost_per_conv_a`, `cost_per_conv_b`, `cost_per_conv_c`, `cost_per_conv_d`, `cost_per_conv_e` | Metrics to return. Multi-pick — leave empty for all. Unknown names are ignored. &#x60;bot_views&#x60; / &#x60;bot_clicks&#x60; (views / clicks the ad server flagged as bot traffic, a subset of &#x60;views&#x60; / &#x60;clicks&#x60;) only where Bot Info is enabled, &#x60;costs&#x60; and &#x60;cost_per_conv_a&#x60; … &#x60;cost_per_conv_e&#x60; only on admanager tenants — see above.  | [Optional] [Enum: views, clicks, ctr, ecpm, earned, un_views, no_ads, requests, bot_views, bot_clicks, conv_a, conv_b, conv_c, conv_d, conv_e, costs, cost_per_conv_a, cost_per_conv_b, cost_per_conv_c, cost_per_conv_d, cost_per_conv_e] |
| **filterWebsite** | `number` | Site ID — look up via &#x60;GET /api/v1/sites&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterAdzoneId** | `string` | Adspace ID, or comma-separated list. Look up via &#x60;GET /api/v1/adspaces&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterCountry** | `string` | ISO-3166 alpha-2 country code (e.g. &#x60;US&#x60;, &#x60;DE&#x60;, &#x60;BR&#x60;). | [Optional] [Defaults to `undefined`] |
| **filterDevice** | `1`, `2`, `3`, `4`, `5`, `6` | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5, 6] |
| **filterAdType** | `number` | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  | [Optional] [Defaults to `undefined`] |
| **filterSellingType** | `1`, `2`, `3`, `4`, `5` | Campaign selling type:  | ID | Selling type | |----|--------------| | 1  | RON (CPC) | | 2  | Flatrate | | 3  | CPM | | 4  | RTB | | 5  | SmartZone |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5] |
| **filterTagId** | `string` | Tag ID, or comma-separated list. Resolves to the bound adzones. | [Optional] [Defaults to `undefined`] |
| **filterAdzoneType** | `string` | Adzone type id(s), comma-separated (the &#x60;id&#x60; of &#x60;GET /api/v1/lookups/adspace-types&#x60;).  | [Optional] [Defaults to `undefined`] |
| **filterAdDomain** | `string` | Ad-serving domain id(s), comma-separated — the &#x60;id&#x60; returned for &#x60;group_by&#x3D;ad_domain&#x60;.  | [Optional] [Defaults to `undefined`] |
| **filterBots** | `1`, `2` | &#x60;1&#x60; &#x3D; only traffic flagged as bots, &#x60;2&#x60; &#x3D; exclude it. Ignored unless Bot Info is enabled for the account (see above).  | [Optional] [Defaults to `undefined`] [Enum: 1, 2] |
| **min** | `{ [key: string]: number; }` | Keep only rows whose metric is at least this value, as &#x60;min[&lt;metric&gt;]&#x3D;&lt;number&gt;&#x60; — e.g. &#x60;min[cost_per_conv_a]&#x3D;10&#x60;. Pair with &#x60;max[&lt;metric&gt;]&#x60; for a range (both ends inclusive). Any metric &#x60;metrics&#x60; accepts for this caller can be bounded, whether or not it is returned; several metrics combine with AND. A row with no value for the metric is dropped. Money in main currency units, &#x60;ctr&#x60; in percent. Same as the comparisons (&#x60;&gt;10&#x60;, &#x60;&lt;200&#x60;, &#x60;10-200&#x60;) in the panel\&#39;s statistics details column search.  With a bound set, up to 10,000 grouped rows (in &#x60;sort&#x60; order) are tested and the survivors paginated; &#x60;total_rows&#x60; counts the survivors, &#x60;totals&#x60; stay over the whole selection, and &#x60;range_scan_truncated: true&#x60; says more rows existed than were tested. Unknown metric, non-number or min &gt; max → 422.  | [Optional] |
| **max** | `{ [key: string]: number; }` | Keep only rows whose metric is at most this value, as &#x60;max[&lt;metric&gt;]&#x3D;&lt;number&gt;&#x60;. See &#x60;min&#x60;. | [Optional] |
| **format** | `json`, `csv` |  | [Optional] [Defaults to `&#39;json&#39;`] [Enum: json, csv] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `100`] |
| **sort** | `string` | Field name. Prefix with &#x60;-&#x60; for descending (e.g. &#x60;-views&#x60;). | [Optional] [Defaults to `undefined`] |

### Return type

[**StatsResponse**](StatsResponse.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Stats response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

