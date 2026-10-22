# StatsAdvertiserOffersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdvertiserOffersStatsGet**](StatsAdvertiserOffersApi.md#apiv1advertiseroffersstatsget) | **GET** /api/v1/advertiser/offers/stats | CPA / affiliate offer performance — advertiser side. |



## apiV1AdvertiserOffersStatsGet

> StatsResponse apiV1AdvertiserOffersStatsGet(from, to, interval, groupBy, metrics, filterOfferId, filterOfferTypeId, filterDevice, filterCountry, format, page, perPage, sort)

CPA / affiliate offer performance — advertiser side.

Performance for the advertiser\&#39;s CPA / affiliate offers. 

### Example

```ts
import {
  Configuration,
  StatsAdvertiserOffersApi,
} from 'goadserver-sdk';
import type { ApiV1AdvertiserOffersStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsAdvertiserOffersApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' (optional)
    interval: interval_example,
    // Array<'offer' | 'country' | 'device' | 'os' | 'browser'> | Dimensions to aggregate by. Multi-pick up to 8. (optional)
    groupBy: ["offer","country"],
    // Array<'clicks' | 'conversions' | 'cr' | 'cpa' | 'cost' | 'conv_a' | 'conv_b' | 'conv_c'> | Metrics to return. Multi-pick — leave empty for all. (optional)
    metrics: ...,
    // number | Offer ID. Look up via `GET /api/v1/offers`. (optional)
    filterOfferId: 56,
    // number | Offer-type ID. (optional)
    filterOfferTypeId: 56,
    // 1 | 2 | 3 | 4 | 5 | 6 | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  (optional)
    filterDevice: 56,
    // string | ISO-3166 alpha-2 country code (e.g. `US`, `DE`, `BR`). (optional)
    filterCountry: US,
    // 'json' | 'csv' (optional)
    format: format_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Field name. Prefix with `-` for descending (e.g. `-views`). (optional)
    sort: sort_example,
  } satisfies ApiV1AdvertiserOffersStatsGetRequest;

  try {
    const data = await api.apiV1AdvertiserOffersStatsGet(body);
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
| **groupBy** | `offer`, `country`, `device`, `os`, `browser` | Dimensions to aggregate by. Multi-pick up to 8. | [Optional] [Enum: offer, country, device, os, browser] |
| **metrics** | `clicks`, `conversions`, `cr`, `cpa`, `cost`, `conv_a`, `conv_b`, `conv_c` | Metrics to return. Multi-pick — leave empty for all. | [Optional] [Enum: clicks, conversions, cr, cpa, cost, conv_a, conv_b, conv_c] |
| **filterOfferId** | `number` | Offer ID. Look up via &#x60;GET /api/v1/offers&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterOfferTypeId** | `number` | Offer-type ID. | [Optional] [Defaults to `undefined`] |
| **filterDevice** | `1`, `2`, `3`, `4`, `5`, `6` | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5, 6] |
| **filterCountry** | `string` | ISO-3166 alpha-2 country code (e.g. &#x60;US&#x60;, &#x60;DE&#x60;, &#x60;BR&#x60;). | [Optional] [Defaults to `undefined`] |
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

