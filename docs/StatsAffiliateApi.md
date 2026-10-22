# StatsAffiliateApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherOffersPostbackLogGet**](StatsAffiliateApi.md#apiv1publisherofferspostbacklogget) | **GET** /api/v1/publisher/offers/postback-log | Postback log — the conversion postbacks fired to your URLs. |
| [**apiV1PublisherOffersStatsGet**](StatsAffiliateApi.md#apiv1publisheroffersstatsget) | **GET** /api/v1/publisher/offers/stats | Affiliate / smartlink offer performance — publisher side. |



## apiV1PublisherOffersPostbackLogGet

> ApiV1PublisherOffersPostbackLogGet200Response apiV1PublisherOffersPostbackLogGet(from, to, siteId)

Postback log — the conversion postbacks fired to your URLs.

The panel\&#39;s Offer Reports → Postback Log. One row per postback the platform fired to the publisher\&#39;s postback URL, newest first, capped at 1000 rows (no paging). &#x60;status&#x60; is &#x60;Success&#x60; for HTTP 200 (or an unrecorded state) and &#x60;Failed (&lt;state&gt;)&#x60; otherwise. Date params that are missing or not &#x60;YYYY-MM-DD&#x60; fall back to the last 7 days. 

### Example

```ts
import {
  Configuration,
  StatsAffiliateApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherOffersPostbackLogGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsAffiliateApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // number | Only postbacks for this site. (optional)
    siteId: 56,
  } satisfies ApiV1PublisherOffersPostbackLogGetRequest;

  try {
    const data = await api.apiV1PublisherOffersPostbackLogGet(body);
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
| **siteId** | `number` | Only postbacks for this site. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherOffersPostbackLogGet200Response**](ApiV1PublisherOffersPostbackLogGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Postback log rows (empty &#x60;data&#x60; on a query failure too). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherOffersStatsGet

> StatsResponse apiV1PublisherOffersStatsGet(from, to, interval, groupBy, metrics, filterOfferId, filterOfferTypeId, filterWebsite, filterAdzoneId, filterDevice, filterCountry, filterSubid, format, page, perPage, sort)

Affiliate / smartlink offer performance — publisher side.

Affiliate / smartlink offer performance for the publisher. &#x60;earned&#x60; and &#x60;epc&#x60; are in the account currency (currency units, not cents). 

### Example

```ts
import {
  Configuration,
  StatsAffiliateApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherOffersStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StatsAffiliateApi(config);

  const body = {
    // Date | ISO date — inclusive start. Defaults to 7 days ago. (optional)
    from: 2013-10-20,
    // Date | ISO date — inclusive end. Defaults to today. Max range 92 days. (optional)
    to: 2013-10-20,
    // 'day' | 'hour' | 'week' | 'month' | 'sum' (optional)
    interval: interval_example,
    // Array<'offer' | 'country' | 'device' | 'os' | 'browser' | 'domain' | 'subid' | 'website' | 'adzone' | 'sid1' | 'sid2' | 'sid3' | 'sid4' | 'sid5' | 'clickid'> | Dimensions to aggregate by. Multi-pick up to 8. High-cardinality dims (`subid`, `clickid`, `sid*`, `domain`) explode row count. `clickid` is the advertiser-side click id passed back on the conversion (the panel\'s ClickID tab) and comes back as plain text.  (optional)
    groupBy: ["offer","country"],
    // Array<'clicks' | 'conversions' | 'cr' | 'epc' | 'earned' | 'conv_a' | 'conv_b' | 'conv_c'> | Metrics to return. Multi-pick — leave empty for all. (optional)
    metrics: ...,
    // number | Offer ID. Look up via `GET /api/v1/offers`. (optional)
    filterOfferId: 56,
    // number | Offer-type ID. (optional)
    filterOfferTypeId: 56,
    // number | Site ID — look up via `GET /api/v1/sites`. (optional)
    filterWebsite: 56,
    // string | Adspace ID, or comma-separated list. Look up via `GET /api/v1/adspaces`. (optional)
    filterAdzoneId: 12345,12346,
    // 1 | 2 | 3 | 4 | 5 | 6 | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  (optional)
    filterDevice: 56,
    // string | ISO-3166 alpha-2 country code (e.g. `US`, `DE`, `BR`). (optional)
    filterCountry: US,
    // string | SubID (free-form publisher identifier). (optional)
    filterSubid: filterSubid_example,
    // 'json' | 'csv' (optional)
    format: format_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | Field name. Prefix with `-` for descending (e.g. `-views`). (optional)
    sort: sort_example,
  } satisfies ApiV1PublisherOffersStatsGetRequest;

  try {
    const data = await api.apiV1PublisherOffersStatsGet(body);
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
| **groupBy** | `offer`, `country`, `device`, `os`, `browser`, `domain`, `subid`, `website`, `adzone`, `sid1`, `sid2`, `sid3`, `sid4`, `sid5`, `clickid` | Dimensions to aggregate by. Multi-pick up to 8. High-cardinality dims (&#x60;subid&#x60;, &#x60;clickid&#x60;, &#x60;sid*&#x60;, &#x60;domain&#x60;) explode row count. &#x60;clickid&#x60; is the advertiser-side click id passed back on the conversion (the panel\&#39;s ClickID tab) and comes back as plain text.  | [Optional] [Enum: offer, country, device, os, browser, domain, subid, website, adzone, sid1, sid2, sid3, sid4, sid5, clickid] |
| **metrics** | `clicks`, `conversions`, `cr`, `epc`, `earned`, `conv_a`, `conv_b`, `conv_c` | Metrics to return. Multi-pick — leave empty for all. | [Optional] [Enum: clicks, conversions, cr, epc, earned, conv_a, conv_b, conv_c] |
| **filterOfferId** | `number` | Offer ID. Look up via &#x60;GET /api/v1/offers&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterOfferTypeId** | `number` | Offer-type ID. | [Optional] [Defaults to `undefined`] |
| **filterWebsite** | `number` | Site ID — look up via &#x60;GET /api/v1/sites&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterAdzoneId** | `string` | Adspace ID, or comma-separated list. Look up via &#x60;GET /api/v1/adspaces&#x60;. | [Optional] [Defaults to `undefined`] |
| **filterDevice** | `1`, `2`, `3`, `4`, `5`, `6` | Device type:  | ID | Device | |----|--------| | 1  | Computer | | 2  | Tablet | | 3  | Phone | | 4  | Console | | 5  | Wearable | | 6  | TV |  | [Optional] [Defaults to `undefined`] [Enum: 1, 2, 3, 4, 5, 6] |
| **filterCountry** | `string` | ISO-3166 alpha-2 country code (e.g. &#x60;US&#x60;, &#x60;DE&#x60;, &#x60;BR&#x60;). | [Optional] [Defaults to `undefined`] |
| **filterSubid** | `string` | SubID (free-form publisher identifier). | [Optional] [Defaults to `undefined`] |
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

