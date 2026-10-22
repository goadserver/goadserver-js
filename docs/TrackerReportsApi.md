# TrackerReportsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerCostSummaryGet**](TrackerReportsApi.md#apiv1trackercostsummaryget) | **GET** /api/v1/tracker/cost-summary | Spend against revenue. |
| [**apiV1TrackerDailyStatsGet**](TrackerReportsApi.md#apiv1trackerdailystatsget) | **GET** /api/v1/tracker/daily-stats | Daily performance, filtered. |
| [**apiV1TrackerInlineStatsGet**](TrackerReportsApi.md#apiv1trackerinlinestatsget) | **GET** /api/v1/tracker/inline-stats | Per-row performance for a listing. |
| [**apiV1TrackerPlayerLtvGet**](TrackerReportsApi.md#apiv1trackerplayerltvget) | **GET** /api/v1/tracker/player-ltv | Lifetime value by cohort. |
| [**apiV1TrackerPostbacksStatsGet**](TrackerReportsApi.md#apiv1trackerpostbacksstatsget) | **GET** /api/v1/tracker/postbacks/stats | Outbound postback firing log. |
| [**apiV1TrackerRecentClicksGet**](TrackerReportsApi.md#apiv1trackerrecentclicksget) | **GET** /api/v1/tracker/recent-clicks | The most recent clicks. |



## apiV1TrackerCostSummaryGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerCostSummaryGet(from, to)

Spend against revenue.

Imported ad-account spend joined to tracker revenue — the ROI view. Only as complete as the last cost pull; see /source-accounts for sync state. 

### Example

```ts
import {
  Configuration,
  TrackerReportsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerCostSummaryGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerReportsApi(config);

  const body = {
    // string | Start date, YYYY-MM-DD. (optional)
    from: from_example,
    // string | End date, YYYY-MM-DD. (optional)
    to: to_example,
  } satisfies ApiV1TrackerCostSummaryGetRequest;

  try {
    const data = await api.apiV1TrackerCostSummaryGet(body);
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
| **from** | `string` | Start date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **to** | `string` | End date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerDailyStatsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerDailyStatsGet(from, to, offerIds, linkIds, sourceIds, countries, deviceIds)

Daily performance, filtered.

Clicks, conversions, revenue and cost per day for the caller\&#39;s tracker traffic. Every filter is repeatable and ANDs with the rest. 

### Example

```ts
import {
  Configuration,
  TrackerReportsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerDailyStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerReportsApi(config);

  const body = {
    // string | Start date, YYYY-MM-DD. (optional)
    from: from_example,
    // string | End date, YYYY-MM-DD. (optional)
    to: to_example,
    // string | Comma-separated offer ids. (optional)
    offerIds: offerIds_example,
    // string | Comma-separated tracking-link ids. (optional)
    linkIds: linkIds_example,
    // string | Comma-separated source ids. (optional)
    sourceIds: sourceIds_example,
    // string | Comma-separated country codes. (optional)
    countries: countries_example,
    // string | Comma-separated device-type ids. (optional)
    deviceIds: deviceIds_example,
  } satisfies ApiV1TrackerDailyStatsGetRequest;

  try {
    const data = await api.apiV1TrackerDailyStatsGet(body);
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
| **from** | `string` | Start date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **to** | `string` | End date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **offerIds** | `string` | Comma-separated offer ids. | [Optional] [Defaults to `undefined`] |
| **linkIds** | `string` | Comma-separated tracking-link ids. | [Optional] [Defaults to `undefined`] |
| **sourceIds** | `string` | Comma-separated source ids. | [Optional] [Defaults to `undefined`] |
| **countries** | `string` | Comma-separated country codes. | [Optional] [Defaults to `undefined`] |
| **deviceIds** | `string` | Comma-separated device-type ids. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerInlineStatsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerInlineStatsGet(from, to, type)

Per-row performance for a listing.

The numbers the offer and tracking-link listings show inline, so an integration can render the same table without a stats query per row. 

### Example

```ts
import {
  Configuration,
  TrackerReportsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerInlineStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerReportsApi(config);

  const body = {
    // string | Start date, YYYY-MM-DD. (optional)
    from: from_example,
    // string | End date, YYYY-MM-DD. (optional)
    to: to_example,
    // 'offers' | 'links' | Which listing to size. (optional)
    type: type_example,
  } satisfies ApiV1TrackerInlineStatsGetRequest;

  try {
    const data = await api.apiV1TrackerInlineStatsGet(body);
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
| **from** | `string` | Start date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **to** | `string` | End date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **type** | `offers`, `links` | Which listing to size. | [Optional] [Defaults to `undefined`] [Enum: offers, links] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerPlayerLtvGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerPlayerLtvGet(days)

Lifetime value by cohort.

Revenue per acquired user over time, for offers that keep paying after the first conversion. 

### Example

```ts
import {
  Configuration,
  TrackerReportsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerPlayerLtvGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerReportsApi(config);

  const body = {
    // number | Cohort window in days. (optional)
    days: 56,
  } satisfies ApiV1TrackerPlayerLtvGetRequest;

  try {
    const data = await api.apiV1TrackerPlayerLtvGet(body);
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
| **days** | `number` | Cohort window in days. | [Optional] [Defaults to `30`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerPostbacksStatsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerPostbacksStatsGet(datestart, dateend, siteid, convType)

Outbound postback firing log.

Every postback the tracker sent upstream and how the receiver answered — the evidence when a network says it never heard from you. 

### Example

```ts
import {
  Configuration,
  TrackerReportsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerPostbacksStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerReportsApi(config);

  const body = {
    // string | Start date, YYYY-MM-DD. (optional)
    datestart: datestart_example,
    // string | End date, YYYY-MM-DD. (optional)
    dateend: dateend_example,
    // number | Narrow to one traffic source. (optional)
    siteid: 56,
    // string | Narrow to one conversion-type letter. (optional)
    convType: convType_example,
  } satisfies ApiV1TrackerPostbacksStatsGetRequest;

  try {
    const data = await api.apiV1TrackerPostbacksStatsGet(body);
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
| **datestart** | `string` | Start date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **dateend** | `string` | End date, YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **siteid** | `number` | Narrow to one traffic source. | [Optional] [Defaults to `undefined`] |
| **convType** | `string` | Narrow to one conversion-type letter. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerRecentClicksGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerRecentClicksGet(limit)

The most recent clicks.

A live tail of the click stream with the macro values each click carried — what you read while checking that a new link fires correctly. 

### Example

```ts
import {
  Configuration,
  TrackerReportsApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRecentClicksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerReportsApi(config);

  const body = {
    // number | Rows to return. (optional)
    limit: 56,
  } satisfies ApiV1TrackerRecentClicksGetRequest;

  try {
    const data = await api.apiV1TrackerRecentClicksGet(body);
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
| **limit** | `number` | Rows to return. | [Optional] [Defaults to `100`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

