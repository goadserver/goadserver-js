# StatsAdvertiserRTBApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdvertiserRtbStatsGet**](StatsAdvertiserRTBApi.md#apiv1advertiserrtbstatsget) | **GET** /api/v1/advertiser/rtb/stats | DSP / RTB-side stats. |



## apiV1AdvertiserRtbStatsGet

> StatsResponse apiV1AdvertiserRtbStatsGet(from, to, interval, groupBy, metrics, filterCampaignId, filterNetworkId, filterAdType, filterDevice, filterCountry, filterSpaceid, filterIspId, filterDomainId, filterSiteId, filterAdId, filterOs, filterBrowser, filterConnType, format, page, perPage, sort, strict)

DSP / RTB-side stats.

Bid-stream stats for the advertiser\&#39;s RTB campaigns — the panel\&#39;s RTB Stats report (&#x60;dspstats_stats&#x60; / &#x60;dspstats_stats_sum&#x60;), same sums and formulas.  **Money unit:** &#x60;paid&#x60; is in the account currency\&#39;s main unit (cents ÷ 100), rounded to 4 decimals. &#x60;avg_bidfloor&#x60; is the average floor per request in main units — a CPM for impression-billed ad types, a per-click price for click-billed ones. &#x60;ctr&#x60;, &#x60;wpr&#x60;, &#x60;win_pct&#x60; and &#x60;bid_rate&#x60; are percentages.  **Dates:** &#x60;from&#x60; and &#x60;to&#x60; are used only when both are given; otherwise the last 7 days. Max range 92 days. &#x60;interval&#x3D;hour&#x60; buckets on the bid timestamp (&#x60;YYYY-MM-DD HH:00&#x60;).  Not on this endpoint (panel-only): the per-error-code breakdown and the merge of externally pulled network counters (&#x60;nw_views&#x60;/&#x60;nw_clicks&#x60;/&#x60;nw_earned&#x60;). 

### Example

```ts
import {
  Configuration,
  StatsAdvertiserRTBApi,
} from 'goadserver-sdk';
import type { ApiV1AdvertiserRtbStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsAdvertiserRTBApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' (optional)
    interval: interval_example,
    // Array<'campaign' | 'network' | 'ad_type' | 'device' | 'country' | 'isp' | 'domain' | 'spaceid' | 'site' | 'os' | 'browser' | 'conn_type' | 'ad'> | Dimensions to aggregate by. Multi-pick up to 8; unknown → 422. Each comes back as `{id, name}` (`country`: `{id: \"US\", name}`); `ad` and `site` carry the id as name. Without the `stats_source_names` right `name` equals the id.  | Dim | Meaning | |---|---| | `campaign` | RTB campaign | | `network` | RTB network (SSP) the request came from | | `ad_type` | ad type | | `device` | device type | | `country` | country | | `isp` | ISP / ASN | | `domain` | domain | | `spaceid` | publisher adzone id | | `site` | publisher site id | | `os` | operating system | | `browser` | browser | | `conn_type` | connection type | | `ad` | ad id |  (optional)
    groupBy: ["campaign","country"],
    // Array<'all' | 'requests' | 'bids' | 'wins' | 'noresult' | 'errors' | 'views' | 'clicks' | 'ctr' | 'wpr' | 'paid' | 'timeouts' | 'skipnobids' | 'skiptimeouts' | 'win_pct' | 'bid_rate' | 'avg_bidfloor' | 'avg_time'> | Metrics to return (comma-separated). Empty → the default set `requests, bids, wins, noresult, errors, views, clicks, ctr, wpr, paid`; `all` → every metric. Opt-in: `timeouts`, `skipnobids`, `skiptimeouts`, `win_pct` (wins / bids × 100), `bid_rate` (bids / requests × 100), `avg_bidfloor`, `avg_time` (average response time per request). `wpr` is wins / requests × 100. An unknown name is ignored and echoed in `ignored_metrics`; with `strict=1` it is a 422.  (optional)
    metrics: ...,
    // string | RTB campaign ID, or a comma-separated list. (optional)
    filterCampaignId: filterCampaignId_example,
    // number | RTB network ID. (optional)
    filterNetworkId: 56,
    // number | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  (optional)
    filterAdType: 56,
    // 1 | 2 | 3 | 4 | 5 | 6 | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  (optional)
    filterDevice: 56,
    // string | ISO-3166 alpha-2 country code (e.g. `US`, `DE`, `BR`). (optional)
    filterCountry: US,
    // number | Adspace ID. (optional)
    filterSpaceid: 56,
    // string | ISP / ASN id, or a comma-separated list. (optional)
    filterIspId: filterIspId_example,
    // string | Domain id, or a comma-separated list. (optional)
    filterDomainId: filterDomainId_example,
    // string | Publisher site id, or a comma-separated list. (optional)
    filterSiteId: filterSiteId_example,
    // string | Ad id, or a comma-separated list. (optional)
    filterAdId: filterAdId_example,
    // string | Operating-system id (`GET /api/v1/lookups/operating-systems`), or a comma-separated list. (optional)
    filterOs: filterOs_example,
    // string | Browser id (`GET /api/v1/lookups/browsers`), or a comma-separated list. (optional)
    filterBrowser: filterBrowser_example,
    // string | Connection-type id, or a comma-separated list. (optional)
    filterConnType: filterConnType_example,
    // 'json' | 'csv' (optional)
    format: format_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Sort key, `-` prefix for descending: `requests`, `bids`, `wins`, `noresult`, `errors`, `views`, `clicks`, `paid`, `timeouts`, `skipnobids`, `skiptimeouts`, `ctr`, `wpr`, `win_pct`, `bid_rate`, `date` (non-`sum` interval only). Any other value falls back to `-paid`.  (optional)
    sort: sort_example,
    // '0' | '1' | `1` turns an unknown metric name into a 422 instead of ignoring it. (optional)
    strict: strict_example,
  } satisfies ApiV1AdvertiserRtbStatsGetRequest;

  try {
    const data = await api.apiV1AdvertiserRtbStatsGet(body);
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
| **groupBy** | `campaign`, `network`, `ad_type`, `device`, `country`, `isp`, `domain`, `spaceid`, `site`, `os`, `browser`, `conn_type`, `ad` | Dimensions to aggregate by. Multi-pick up to 8; unknown → 422. Each comes back as &#x60;{id, name}&#x60; (&#x60;country&#x60;: &#x60;{id: \&quot;US\&quot;, name}&#x60;); &#x60;ad&#x60; and &#x60;site&#x60; carry the id as name. Without the &#x60;stats_source_names&#x60; right &#x60;name&#x60; equals the id.  | Dim | Meaning | |---|---| | &#x60;campaign&#x60; | RTB campaign | | &#x60;network&#x60; | RTB network (SSP) the request came from | | &#x60;ad_type&#x60; | ad type | | &#x60;device&#x60; | device type | | &#x60;country&#x60; | country | | &#x60;isp&#x60; | ISP / ASN | | &#x60;domain&#x60; | domain | | &#x60;spaceid&#x60; | publisher adzone id | | &#x60;site&#x60; | publisher site id | | &#x60;os&#x60; | operating system | | &#x60;browser&#x60; | browser | | &#x60;conn_type&#x60; | connection type | | &#x60;ad&#x60; | ad id |  | [Optional] [Enum: campaign, network, ad_type, device, country, isp, domain, spaceid, site, os, browser, conn_type, ad] |
| **metrics** | `all`, `requests`, `bids`, `wins`, `noresult`, `errors`, `views`, `clicks`, `ctr`, `wpr`, `paid`, `timeouts`, `skipnobids`, `skiptimeouts`, `win_pct`, `bid_rate`, `avg_bidfloor`, `avg_time` | Metrics to return (comma-separated). Empty → the default set &#x60;requests, bids, wins, noresult, errors, views, clicks, ctr, wpr, paid&#x60;; &#x60;all&#x60; → every metric. Opt-in: &#x60;timeouts&#x60;, &#x60;skipnobids&#x60;, &#x60;skiptimeouts&#x60;, &#x60;win_pct&#x60; (wins / bids × 100), &#x60;bid_rate&#x60; (bids / requests × 100), &#x60;avg_bidfloor&#x60;, &#x60;avg_time&#x60; (average response time per request). &#x60;wpr&#x60; is wins / requests × 100. An unknown name is ignored and echoed in &#x60;ignored_metrics&#x60;; with &#x60;strict&#x3D;1&#x60; it is a 422.  | [Optional] [Enum: all, requests, bids, wins, noresult, errors, views, clicks, ctr, wpr, paid, timeouts, skipnobids, skiptimeouts, win_pct, bid_rate, avg_bidfloor, avg_time] |
| **filterCampaignId** | `string` | RTB campaign ID, or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterNetworkId** | `number` | RTB network ID. | [Optional] [Defaults to `undefined`] |
| **filterAdType** | `number` | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  | [Optional] [Defaults to `undefined`] |
| **filterDevice** | `1`, `2`, `3`, `4`, `5`, `6` | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5, 6] |
| **filterCountry** | `string` | ISO-3166 alpha-2 country code (e.g. &#x60;US&#x60;, &#x60;DE&#x60;, &#x60;BR&#x60;). | [Optional] [Defaults to `undefined`] |
| **filterSpaceid** | `number` | Adspace ID. | [Optional] [Defaults to `undefined`] |
| **filterIspId** | `string` | ISP / ASN id, or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterDomainId** | `string` | Domain id, or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterSiteId** | `string` | Publisher site id, or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterAdId** | `string` | Ad id, or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterOs** | `string` | Operating-system id (&#x60;GET /api/v1/lookups/operating-systems&#x60;), or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterBrowser** | `string` | Browser id (&#x60;GET /api/v1/lookups/browsers&#x60;), or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **filterConnType** | `string` | Connection-type id, or a comma-separated list. | [Optional] [Defaults to `undefined`] |
| **format** | `json`, `csv` |  | [Optional] [Defaults to `&#39;json&#39;`] [Enum: json, csv] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `100`] |
| **sort** | `string` | Sort key, &#x60;-&#x60; prefix for descending: &#x60;requests&#x60;, &#x60;bids&#x60;, &#x60;wins&#x60;, &#x60;noresult&#x60;, &#x60;errors&#x60;, &#x60;views&#x60;, &#x60;clicks&#x60;, &#x60;paid&#x60;, &#x60;timeouts&#x60;, &#x60;skipnobids&#x60;, &#x60;skiptimeouts&#x60;, &#x60;ctr&#x60;, &#x60;wpr&#x60;, &#x60;win_pct&#x60;, &#x60;bid_rate&#x60;, &#x60;date&#x60; (non-&#x60;sum&#x60; interval only). Any other value falls back to &#x60;-paid&#x60;.  | [Optional] [Defaults to `&#39;-paid&#39;`] |
| **strict** | `0`, `1` | &#x60;1&#x60; turns an unknown metric name into a 422 instead of ignoring it. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Bad date range, unknown &#x60;group_by&#x60; / &#x60;interval&#x60;, or (with &#x60;strict&#x3D;1&#x60;) an unknown metric. |  -  |
| **429** | Per-key rate limit exceeded (default 60 rpm). Retry after &#x60;Retry-After&#x60; seconds. |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * Retry-After -  <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

