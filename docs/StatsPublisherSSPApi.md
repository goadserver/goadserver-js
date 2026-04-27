# StatsPublisherSSPApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherSspStatsGet**](StatsPublisherSSPApi.md#apiv1publishersspstatsget) | **GET** /api/v1/publisher/ssp/stats | SSP / smart-campaign earnings. |



## apiV1PublisherSspStatsGet

> StatsResponse apiV1PublisherSspStatsGet(from, to, interval, groupBy, metrics, format, page, perPage, sort)

SSP / smart-campaign earnings.

**group_by:** &#x60;campaign&#x60;, &#x60;country&#x60;, &#x60;website&#x60;, &#x60;adzone&#x60;, &#x60;network&#x60;.  **Metrics:** &#x60;requests&#x60;, &#x60;wins&#x60;, &#x60;views&#x60;, &#x60;clicks&#x60;, &#x60;ctr&#x60;, &#x60;ecpm&#x60;, &#x60;earned&#x60;, &#x60;errors&#x60;.  **Scoping (priority order):** - &#x60;filter[feed_id]&#x3D;&lt;hash&gt;&#x60; — the SSP feed hash from the campaign row   (the same identifier you give to ad networks). Limits results to   one campaign without needing the internal numeric ID. - &#x60;filter[campaign_id]&#x3D;&lt;id&gt;&#x60; — internal numeric ID. - (default) every SSP campaign owned by the caller, optionally   narrowed with &#x60;filter[ssptype]&#x60;. 

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
    // string | Comma-separated dimensions to aggregate by, in priority order. Max 4 dimensions. Available dimensions vary per endpoint — see the per-endpoint description.  (optional)
    groupBy: groupBy_example,
    // string | Optional comma-separated metric whitelist. When omitted, all metrics for the endpoint are returned.  (optional)
    metrics: metrics_example,
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
| **groupBy** | `string` | Comma-separated dimensions to aggregate by, in priority order. Max 4 dimensions. Available dimensions vary per endpoint — see the per-endpoint description.  | [Optional] [Defaults to `undefined`] |
| **metrics** | `string` | Optional comma-separated metric whitelist. When omitted, all metrics for the endpoint are returned.  | [Optional] [Defaults to `undefined`] |
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

