# EventLogApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1EventLogExportsGet**](EventLogApi.md#apiv1eventlogexportsget) | **GET** /api/v1/event-log/exports | Your event log exports, newest first. |
| [**apiV1EventLogExportsIdDownloadGet**](EventLogApi.md#apiv1eventlogexportsiddownloadget) | **GET** /api/v1/event-log/exports/{id}/download | Download a finished export (.csv.gz). |
| [**apiV1EventLogExportsPost**](EventLogApi.md#apiv1eventlogexportspostoperation) | **POST** /api/v1/event-log/exports | Queue a CSV export of your events. |
| [**apiV1EventLogGet**](EventLogApi.md#apiv1eventlogget) | **GET** /api/v1/event-log | Your raw events — impressions and clicks with IP and user agent (90 days). |



## apiV1EventLogExportsGet

> apiV1EventLogExportsGet()

Your event log exports, newest first.

### Example

```ts
import {
  Configuration,
  EventLogApi,
} from 'goadserver-sdk';
import type { ApiV1EventLogExportsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new EventLogApi(config);

  try {
    const data = await api.apiV1EventLogExportsGet();
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
| **200** | OK |  -  |
| **403** | The event log is not enabled for this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1EventLogExportsIdDownloadGet

> apiV1EventLogExportsIdDownloadGet(id)

Download a finished export (.csv.gz).

### Example

```ts
import {
  Configuration,
  EventLogApi,
} from 'goadserver-sdk';
import type { ApiV1EventLogExportsIdDownloadGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new EventLogApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1EventLogExportsIdDownloadGetRequest;

  try {
    const data = await api.apiV1EventLogExportsIdDownloadGet(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/gzip`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The gzip-compressed CSV. |  -  |
| **404** | Not your export. |  -  |
| **409** | Not finished yet (queued, running, failed). |  -  |
| **410** | Expired — files are kept 7 days. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1EventLogExportsPost

> apiV1EventLogExportsPost(apiV1EventLogExportsPostRequest)

Queue a CSV export of your events.

Queues a CSV export; it is built in the background, one export at a time, and the 202 answer is the export row (&#x60;status: queued&#x60;). Follow it on the exports list; the file is a gzip-compressed CSV with the same columns as the preview, at most 31 days and 20,000,000 rows (&#x60;truncated: true&#x60; when the cap was hit), kept 7 days. At most 3 exports may wait per requester (429 &#x60;too_many_exports&#x60;). You are notified (in-app / email, per your notification settings) when it is ready. 

### Example

```ts
import {
  Configuration,
  EventLogApi,
} from 'goadserver-sdk';
import type { ApiV1EventLogExportsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new EventLogApi(config);

  const body = {
    // ApiV1EventLogExportsPostRequest
    apiV1EventLogExportsPostRequest: {"date_from":"2026-10-22","date_to":"2026-10-28","ad_id":3891355,"event":"click"},
  } satisfies ApiV1EventLogExportsPostOperationRequest;

  try {
    const data = await api.apiV1EventLogExportsPost(body);
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
| **apiV1EventLogExportsPostRequest** | [ApiV1EventLogExportsPostRequest](ApiV1EventLogExportsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Queued |  -  |
| **403** | The event log is not enabled for this account. |  -  |
| **422** | Invalid filter. |  -  |
| **429** | Three exports already waiting. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1EventLogGet

> apiV1EventLogGet(dateFrom, dateTo, side, campaignId, adId, siteId, zoneId, event, country, ip, page, perPage)

Your raw events — impressions and clicks with IP and user agent (90 days).

Only for accounts the network enabled the event log for (user right &#x60;raw_event_log&#x60;, off by default; 403 otherwise). Not available on ad networks, where the event log is for the network\&#39;s administrators only (403). Every event where you are the advertiser or the publisher, kept 90 days from the day the right was switched on: &#x60;time&#x60; (network timezone), &#x60;time_utc&#x60;, &#x60;event&#x60;, the campaign / ad / publisher / site / zone ids, &#x60;ip&#x60;, &#x60;user_agent&#x60;, &#x60;country&#x60; and device / os / browser / isp ids. No money columns. Newest first, 100 rows a page at most; &#x60;total&#x60; is the full match count. For more than a screenful, queue an export. Same handler as the panel\&#39;s Event Log page. 

### Example

```ts
import {
  Configuration,
  EventLogApi,
} from 'goadserver-sdk';
import type { ApiV1EventLogGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new EventLogApi(config);

  const body = {
    // Date | First day (YYYY-MM-DD, network timezone). Default date_to. Events are kept 90 days; older dates are a 422. (optional)
    dateFrom: 2013-10-20,
    // Date | Last day. Default today. (optional)
    dateTo: 2013-10-20,
    // 'advertiser' | 'publisher' | Only events where the account is the advertiser, or the publisher. Omit for both. (optional)
    side: side_example,
    // number (optional)
    campaignId: 56,
    // number (optional)
    adId: 56,
    // number (optional)
    siteId: 56,
    // number (optional)
    zoneId: 56,
    // 'impression' | 'click' | 'conversion' | 'no_ad' (optional)
    event: event_example,
    // string | Two-letter country code. (optional)
    country: NL,
    // string | Exact visitor IP. (optional)
    ip: ip_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1EventLogGetRequest;

  try {
    const data = await api.apiV1EventLogGet(body);
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
| **dateFrom** | `Date` | First day (YYYY-MM-DD, network timezone). Default date_to. Events are kept 90 days; older dates are a 422. | [Optional] [Defaults to `undefined`] |
| **dateTo** | `Date` | Last day. Default today. | [Optional] [Defaults to `undefined`] |
| **side** | `advertiser`, `publisher` | Only events where the account is the advertiser, or the publisher. Omit for both. | [Optional] [Defaults to `undefined`] [Enum: advertiser, publisher] |
| **campaignId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **adId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **siteId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **event** | `impression`, `click`, `conversion`, `no_ad` |  | [Optional] [Defaults to `undefined`] [Enum: impression, click, conversion, no_ad] |
| **country** | `string` | Two-letter country code. | [Optional] [Defaults to `undefined`] |
| **ip** | `string` | Exact visitor IP. | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `50`] |

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
| **200** | OK |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | The event log is not enabled for this account. |  -  |
| **422** | Invalid filter (e.g. a date older than 90 days). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

