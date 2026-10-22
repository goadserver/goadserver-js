# StatsPublisherSSPApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherSspStatsDetailsGet**](StatsPublisherSSPApi.md#apiv1publishersspstatsdetailsget) | **GET** /api/v1/publisher/ssp/stats/details | SSP report broken down by one dimension. |
| [**apiV1PublisherSspStatsFiltersGet**](StatsPublisherSSPApi.md#apiv1publishersspstatsfiltersget) | **GET** /api/v1/publisher/ssp/stats/filters | Filter values for the SSP reports. |
| [**apiV1PublisherSspStatsFlatGet**](StatsPublisherSSPApi.md#apiv1publishersspstatsflatget) | **GET** /api/v1/publisher/ssp/stats/flat | SSP report grouped by several dimensions. |
| [**apiV1PublisherSspStatsGet**](StatsPublisherSSPApi.md#apiv1publishersspstatsget) | **GET** /api/v1/publisher/ssp/stats | SSP / smart-campaign earnings. |



## apiV1PublisherSspStatsDetailsGet

> apiV1PublisherSspStatsDetailsGet(from, to, type, ssptype, campaignid, networkid, siteid, country, deviceType, adType, subid, filterBidType)

SSP report broken down by one dimension.

The panel\&#39;s SSP \&quot;details\&quot; console: one row per value of &#x60;type&#x60; (&#x60;campaign&#x60;, &#x60;country&#x60;, &#x60;website&#x60;, &#x60;adzone&#x60;, &#x60;network&#x60;, &#x60;bid_type&#x60;, &#x60;keyword&#x60;), with request/bid/win funnel, errors and timings. Defaults to every SSP campaign of yours (narrow with &#x60;ssptype&#x60; or &#x60;campaignid&#x60;). Capped rows report &#x60;truncated: true&#x60; + &#x60;row_cap&#x60;. **Money is in currency units (not cents)**: &#x60;paid&#x60;, &#x60;ecpm&#x60;, &#x60;avg_bidfloor&#x60;, &#x60;avg_cpm&#x60; (CPM) and &#x60;nw_earned&#x60;. &#x60;avg_resp_time&#x60; is seconds. For campaign/country rows, &#x60;nw_views&#x60; / &#x60;nw_clicks&#x60; / &#x60;nw_earned&#x60; carry what the partner\&#39;s own API reported. 

### Example

```ts
import {
  Configuration,
  StatsPublisherSSPApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspStatsDetailsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherSSPApi(config);

  const body = {
    // Date | Inclusive start. Defaults to 6 days ago (send both from and to). (optional)
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
    // 'campaign' | 'country' | 'website' | 'adzone' | 'network' | 'bid_type' | 'keyword' (optional)
    type: type_example,
    // 'ssp' | 'external' | 'exchange' (optional)
    ssptype: ssptype_example,
    // Array<number> | One or more SSP campaign ids (`campaignid=1&campaignid=2` or `campaignid[]=…`). (optional)
    campaignid: ...,
    // Array<number> (optional)
    networkid: ...,
    // Array<number> (optional)
    siteid: ...,
    // Array<string> | ISO-3166 alpha-2 codes. (optional)
    country: ...,
    // Array<number> (optional)
    deviceType: ...,
    // Array<number> (optional)
    adType: ...,
    // string (optional)
    subid: subid_example,
    // number | Only this bid type. (optional)
    filterBidType: 56,
  } satisfies ApiV1PublisherSspStatsDetailsGetRequest;

  try {
    const data = await api.apiV1PublisherSspStatsDetailsGet(body);
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
| **from** | `Date` | Inclusive start. Defaults to 6 days ago (send both from and to). | [Optional] [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **type** | `campaign`, `country`, `website`, `adzone`, `network`, `bid_type`, `keyword` |  | [Optional] [Defaults to `&#39;campaign&#39;`] [Enum: campaign, country, website, adzone, network, bid_type, keyword] |
| **ssptype** | `ssp`, `external`, `exchange` |  | [Optional] [Defaults to `undefined`] [Enum: ssp, external, exchange] |
| **campaignid** | `Array<number>` | One or more SSP campaign ids (&#x60;campaignid&#x3D;1&amp;campaignid&#x3D;2&#x60; or &#x60;campaignid[]&#x3D;…&#x60;). | [Optional] |
| **networkid** | `Array<number>` |  | [Optional] |
| **siteid** | `Array<number>` |  | [Optional] |
| **country** | `Array<string>` | ISO-3166 alpha-2 codes. | [Optional] |
| **deviceType** | `Array<number>` |  | [Optional] |
| **adType** | `Array<number>` |  | [Optional] |
| **subid** | `string` |  | [Optional] [Defaults to `undefined`] |
| **filterBidType** | `number` | Only this bid type. | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rows. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspStatsFiltersGet

> apiV1PublisherSspStatsFiltersGet()

Filter values for the SSP reports.

### Example

```ts
import {
  Configuration,
  StatsPublisherSSPApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspStatsFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherSSPApi(config);

  try {
    const data = await api.apiV1PublisherSspStatsFiltersGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;{id, name}&#x60; lists for the filter parameters. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspStatsFlatGet

> apiV1PublisherSspStatsFlatGet(from, to, group, viewtype, ssptype, campaignid, networkid, siteid, country, deviceType, adType, subid, filterBidType)

SSP report grouped by several dimensions.

The panel\&#39;s flat SSP table. &#x60;group&#x60; is a comma-separated list of &#x60;date&#x60;, &#x60;campaign&#x60;, &#x60;country&#x60;, &#x60;website&#x60;, &#x60;adzone&#x60;, &#x60;subid&#x60;, &#x60;domainid&#x60;, &#x60;bid_type&#x60;, &#x60;bid_advid&#x60;, &#x60;bid_cid&#x60;, &#x60;bid_adid&#x60;, &#x60;mxispid&#x60; (default &#x60;date&#x60;); each row carries the grouped values plus &#x60;&lt;dim&gt;_name&#x60; where a name exists, and &#x60;startdate&#x60;/&#x60;enddate&#x60; for the row\&#39;s period. &#x60;viewtype&#x60; sets the date bucket. At most 10,000 rows. Same filters and money units as &#x60;stats/details&#x60; (**currency units, not cents**). &#x60;totals&#x60; sums the whole result. 

### Example

```ts
import {
  Configuration,
  StatsPublisherSSPApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspStatsFlatGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherSSPApi(config);

  const body = {
    // Date (optional)
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
    // string (optional)
    group: date,campaign,
    // 'day' | 'week' | 'month' | 'year' | 'sum' (optional)
    viewtype: viewtype_example,
    // 'ssp' | 'external' | 'exchange' (optional)
    ssptype: ssptype_example,
    // Array<number> (optional)
    campaignid: ...,
    // Array<number> (optional)
    networkid: ...,
    // Array<number> (optional)
    siteid: ...,
    // Array<string> (optional)
    country: ...,
    // Array<number> (optional)
    deviceType: ...,
    // Array<number> (optional)
    adType: ...,
    // string (optional)
    subid: subid_example,
    // number (optional)
    filterBidType: 56,
  } satisfies ApiV1PublisherSspStatsFlatGetRequest;

  try {
    const data = await api.apiV1PublisherSspStatsFlatGet(body);
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
| **from** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **group** | `string` |  | [Optional] [Defaults to `&#39;date&#39;`] |
| **viewtype** | `day`, `week`, `month`, `year`, `sum` |  | [Optional] [Defaults to `&#39;day&#39;`] [Enum: day, week, month, year, sum] |
| **ssptype** | `ssp`, `external`, `exchange` |  | [Optional] [Defaults to `undefined`] [Enum: ssp, external, exchange] |
| **campaignid** | `Array<number>` |  | [Optional] |
| **networkid** | `Array<number>` |  | [Optional] |
| **siteid** | `Array<number>` |  | [Optional] |
| **country** | `Array<string>` |  | [Optional] |
| **deviceType** | `Array<number>` |  | [Optional] |
| **adType** | `Array<number>` |  | [Optional] |
| **subid** | `string` |  | [Optional] [Defaults to `undefined`] |
| **filterBidType** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rows + totals. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSspStatsGet

> StatsResponse apiV1PublisherSspStatsGet(from, to, interval, groupBy, metrics, filterFeedId, filterCampaignId, filterSsptype, filterCountry, filterDevice, filterAdType, filterNetworkId, filterAdzoneId, filterWebsite, format, page, perPage, sort)

SSP / smart-campaign earnings.

SSP / smart-campaign earnings.  **Scoping (priority order):** 1. &#x60;filter[feed_id]&#x60; — the SSP feed hash from the campaign row    (the public identifier you give to ad networks). Limits results    to one campaign without exposing the internal numeric ID. 2. &#x60;filter[campaign_id]&#x60; — internal numeric ID. 3. (default) every SSP campaign owned by the caller, optionally    narrowed with &#x60;filter[ssptype]&#x60;.  **Authentication — this endpoint accepts two credentials.** Either an account API key with the &#x60;stats.read&#x60; scope in the &#x60;Authorization&#x60; header, as everywhere else on this API, or the feed hash itself in &#x60;filter[feed_id]&#x60; (&#x60;token&#x60; is accepted as an alias, matching the legacy &#x60;/apitool/ssp_stats/&#x60; URL). The feed hash authenticates nothing but this report for that one feed, which is what makes the URL safe to hand to an ad network; an account key covers every feed on the account. When an &#x60;Authorization&#x60; header is present it is always used, so an invalid key is reported as such rather than falling back to the feed hash. 

### Example

```ts
import {
  Configuration,
  StatsPublisherSSPApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSspStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherSSPApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' (optional)
    interval: interval_example,
    // Array<'campaign' | 'country' | 'website' | 'adzone' | 'network'> | Dimensions to aggregate by. Multi-pick up to 8. (optional)
    groupBy: ["campaign","country"],
    // Array<'requests' | 'wins' | 'views' | 'clicks' | 'ctr' | 'ecpm' | 'earned' | 'errors'> | Metrics to return. Multi-pick — leave empty for all. (optional)
    metrics: ...,
    // string | SSP campaign feed hash (the public identifier given to ad networks). Pins results to one SSP campaign without exposing the internal numeric ID.  (optional)
    filterFeedId: filterFeedId_example,
    // number | Campaign ID. Look up via `GET /api/v1/campaigns`. (optional)
    filterCampaignId: 56,
    // string | SSP feed type filter. (optional)
    filterSsptype: filterSsptype_example,
    // string | ISO-3166 alpha-2 country code (e.g. `US`, `DE`, `BR`). (optional)
    filterCountry: US,
    // 1 | 2 | 3 | 4 | 5 | 6 | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  (optional)
    filterDevice: 56,
    // number | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  (optional)
    filterAdType: 56,
    // number | RTB network ID. (optional)
    filterNetworkId: 56,
    // number | One adspace id — look up via `GET /api/v1/adspaces`. (optional)
    filterAdzoneId: 56,
    // number | Site ID — look up via `GET /api/v1/sites`. (optional)
    filterWebsite: 56,
    // 'json' | 'csv' (optional)
    format: format_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Field name. Prefix with `-` for descending (e.g. `-views`). (optional)
    sort: sort_example,
  } satisfies ApiV1PublisherSspStatsGetRequest;

  try {
    const data = await api.apiV1PublisherSspStatsGet(body);
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
| **groupBy** | `campaign`, `country`, `website`, `adzone`, `network` | Dimensions to aggregate by. Multi-pick up to 8. | [Optional] [Enum: campaign, country, website, adzone, network] |
| **metrics** | `requests`, `wins`, `views`, `clicks`, `ctr`, `ecpm`, `earned`, `errors` | Metrics to return. Multi-pick — leave empty for all. | [Optional] [Enum: requests, wins, views, clicks, ctr, ecpm, earned, errors] |
| **filterFeedId** | `string` | SSP campaign feed hash (the public identifier given to ad networks). Pins results to one SSP campaign without exposing the internal numeric ID.  | [Optional] [Defaults to `undefined`] |
| **filterCampaignId** | `number` | Campaign ID. Look up via &#x60;GET /api/v1/campaigns&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterSsptype** | `string` | SSP feed type filter. | [Optional] [Defaults to `undefined`] |
| **filterCountry** | `string` | ISO-3166 alpha-2 country code (e.g. &#x60;US&#x60;, &#x60;DE&#x60;, &#x60;BR&#x60;). | [Optional] [Defaults to `undefined`] |
| **filterDevice** | `1`, `2`, `3`, `4`, `5`, `6` | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5, 6] |
| **filterAdType** | `number` | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  | [Optional] [Defaults to `undefined`] |
| **filterNetworkId** | `number` | RTB network ID. | [Optional] [Defaults to `undefined`] |
| **filterAdzoneId** | `number` | One adspace id — look up via &#x60;GET /api/v1/adspaces&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterWebsite** | `number` | Site ID — look up via &#x60;GET /api/v1/sites&#x60;. | [Optional] [Defaults to `undefined`] |
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

