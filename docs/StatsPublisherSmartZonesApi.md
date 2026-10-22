# StatsPublisherSmartZonesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherSmartzonesStatsFiltersGet**](StatsPublisherSmartZonesApi.md#apiv1publishersmartzonesstatsfiltersget) | **GET** /api/v1/publisher/smartzones/stats/filters | Filter values for smart-zone stats. |
| [**apiV1PublisherSmartzonesStatsGet**](StatsPublisherSmartZonesApi.md#apiv1publishersmartzonesstatsget) | **GET** /api/v1/publisher/smartzones/stats | SmartZone (waterfall) earnings. |



## apiV1PublisherSmartzonesStatsFiltersGet

> apiV1PublisherSmartzonesStatsFiltersGet()

Filter values for smart-zone stats.

Your websites, ad zones and smart network accounts, as &#x60;{id, name}&#x60; lists for the &#x60;filter[…]&#x60; parameters of &#x60;GET /api/v1/publisher/smartzones/stats&#x60;.

### Example

```ts
import {
  Configuration,
  StatsPublisherSmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesStatsFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherSmartZonesApi(config);

  try {
    const data = await api.apiV1PublisherSmartzonesStatsFiltersGet();
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
| **200** | Filter values. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesStatsGet

> StatsResponse apiV1PublisherSmartzonesStatsGet(from, to, interval, groupBy, metrics, filterWebsite, filterAdzoneId, filterAdType, filterDevice, filterCountry, filterSmartNetworkId, format, page, perPage, sort)

SmartZone (waterfall) earnings.

SmartZone (waterfall) earnings.  SmartZone earnings are recorded per day, so &#x60;interval&#x3D;hour&#x60; is not supported on this endpoint and returns a validation error. The other intervals (&#x60;day&#x60;, &#x60;week&#x60;, &#x60;month&#x60;, &#x60;sum&#x60;) all apply. 

### Example

```ts
import {
  Configuration,
  StatsPublisherSmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsPublisherSmartZonesApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' (optional)
    interval: interval_example,
    // Array<'website' | 'adzone' | 'zone' | 'country' | 'device'> | Dimensions to aggregate by. Multi-pick up to 8. (optional)
    groupBy: ["website","adzone"],
    // Array<'views' | 'clicks' | 'ctr' | 'ecpm' | 'earned'> | Metrics to return. Multi-pick — leave empty for all. (optional)
    metrics: ...,
    // number | Site ID — look up via `GET /api/v1/sites`. (optional)
    filterWebsite: 56,
    // string | Adspace ID, or comma-separated list. Look up via `GET /api/v1/adspaces`. (optional)
    filterAdzoneId: 12345,12346,
    // number | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  (optional)
    filterAdType: 56,
    // 1 | 2 | 3 | 4 | 5 | 6 | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  (optional)
    filterDevice: 56,
    // string | ISO-3166 alpha-2 country code (e.g. `US`, `DE`, `BR`). (optional)
    filterCountry: US,
    // number | SmartZone network ID. (optional)
    filterSmartNetworkId: 56,
    // 'json' | 'csv' (optional)
    format: format_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Field name. Prefix with `-` for descending (e.g. `-views`). (optional)
    sort: sort_example,
  } satisfies ApiV1PublisherSmartzonesStatsGetRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesStatsGet(body);
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
| **groupBy** | `website`, `adzone`, `zone`, `country`, `device` | Dimensions to aggregate by. Multi-pick up to 8. | [Optional] [Enum: website, adzone, zone, country, device] |
| **metrics** | `views`, `clicks`, `ctr`, `ecpm`, `earned` | Metrics to return. Multi-pick — leave empty for all. | [Optional] [Enum: views, clicks, ctr, ecpm, earned] |
| **filterWebsite** | `number` | Site ID — look up via &#x60;GET /api/v1/sites&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterAdzoneId** | `string` | Adspace ID, or comma-separated list. Look up via &#x60;GET /api/v1/adspaces&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterAdType** | `number` | Ad-type ID. Available types are tenant-specific (banner, popunder, native, video, push, …); the dropdown shows the types active on your system.  | [Optional] [Defaults to `undefined`] |
| **filterDevice** | `1`, `2`, `3`, `4`, `5`, `6` | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5, 6] |
| **filterCountry** | `string` | ISO-3166 alpha-2 country code (e.g. &#x60;US&#x60;, &#x60;DE&#x60;, &#x60;BR&#x60;). | [Optional] [Defaults to `undefined`] |
| **filterSmartNetworkId** | `number` | SmartZone network ID. | [Optional] [Defaults to `undefined`] |
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

