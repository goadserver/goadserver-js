# TrackerAutomationApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerExportTypeGet**](TrackerAutomationApi.md#apiv1trackerexporttypeget) | **GET** /api/v1/tracker/export/{type} | Export tracker entities as CSV. |
| [**apiV1TrackerImportTypePost**](TrackerAutomationApi.md#apiv1trackerimporttypepost) | **POST** /api/v1/tracker/import/{type} | Bulk-import offers from CSV. |
| [**apiV1TrackerReportSchedulesGet**](TrackerAutomationApi.md#apiv1trackerreportschedulesget) | **GET** /api/v1/tracker/report-schedules | List scheduled report deliveries. |
| [**apiV1TrackerReportSchedulesIdDelete**](TrackerAutomationApi.md#apiv1trackerreportschedulesiddelete) | **DELETE** /api/v1/tracker/report-schedules/{id} | Delete a report schedule. |
| [**apiV1TrackerReportSchedulesIdGet**](TrackerAutomationApi.md#apiv1trackerreportschedulesidget) | **GET** /api/v1/tracker/report-schedules/{id} | Get one report schedule. |
| [**apiV1TrackerReportSchedulesIdPut**](TrackerAutomationApi.md#apiv1trackerreportschedulesidputoperation) | **PUT** /api/v1/tracker/report-schedules/{id} | Update a report schedule. |
| [**apiV1TrackerReportSchedulesPost**](TrackerAutomationApi.md#apiv1trackerreportschedulespostoperation) | **POST** /api/v1/tracker/report-schedules | Schedule a recurring report. |
| [**apiV1TrackerRulesGet**](TrackerAutomationApi.md#apiv1trackerrulesget) | **GET** /api/v1/tracker/rules | List automation rules. |
| [**apiV1TrackerRulesIdDelete**](TrackerAutomationApi.md#apiv1trackerrulesiddelete) | **DELETE** /api/v1/tracker/rules/{id} | Delete a rule. |
| [**apiV1TrackerRulesIdExecutionsGet**](TrackerAutomationApi.md#apiv1trackerrulesidexecutionsget) | **GET** /api/v1/tracker/rules/{id}/executions | Execution history for one rule. |
| [**apiV1TrackerRulesIdGet**](TrackerAutomationApi.md#apiv1trackerrulesidget) | **GET** /api/v1/tracker/rules/{id} | Get one rule. |
| [**apiV1TrackerRulesIdPut**](TrackerAutomationApi.md#apiv1trackerrulesidputoperation) | **PUT** /api/v1/tracker/rules/{id} | Update a rule. |
| [**apiV1TrackerRulesIdRunPost**](TrackerAutomationApi.md#apiv1trackerrulesidrunpost) | **POST** /api/v1/tracker/rules/{id}/run | Run a rule now. |
| [**apiV1TrackerRulesPost**](TrackerAutomationApi.md#apiv1trackerrulespostoperation) | **POST** /api/v1/tracker/rules | Create an automation rule. |



## apiV1TrackerExportTypeGet

> string apiV1TrackerExportTypeGet(type)

Export tracker entities as CSV.

Returns &#x60;text/csv&#x60;, not JSON — the same file the scheduled reports mail. Scoped &#x60;tracker.read&#x60; rather than &#x60;stats.read&#x60;: this dumps configuration, not statistics. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerExportTypeGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // 'offers' | 'tracking-links' | 'rules' | What to export.
    type: type_example,
  } satisfies ApiV1TrackerExportTypeGetRequest;

  try {
    const data = await api.apiV1TrackerExportTypeGet(body);
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
| **type** | `offers`, `tracking-links`, `rules` | What to export. | [Defaults to `undefined`] [Enum: offers, tracking-links, rules] |

### Return type

**string**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/csv`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | CSV file |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerImportTypePost

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerImportTypePost(type, file, commit, overwrite)

Bulk-import offers from CSV.

&#x60;multipart/form-data&#x60; with the CSV as &#x60;file&#x60;. Two flags decide how far it goes: without &#x60;commit&#x60; the upload is validated and reported on but nothing is written, and without &#x60;overwrite&#x60; every row inserts and any &#x60;id&#x60; column is ignored, so a spreadsheet cannot clobber live rows by accident. An id that resolves to no row the caller owns is a row error, never a silent insert. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerImportTypePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // 'offers' | What to import.
    type: type_example,
    // Blob | The CSV, at most 10 MiB.
    file: BINARY_DATA_HERE,
    // string | \\\"true\\\" to write. Absent = validate and report only. (optional)
    commit: commit_example,
    // string | \\\"true\\\" to update rows whose id column matches one of the caller\\\'s own. (optional)
    overwrite: overwrite_example,
  } satisfies ApiV1TrackerImportTypePostRequest;

  try {
    const data = await api.apiV1TrackerImportTypePost(body);
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
| **type** | `offers` | What to import. | [Defaults to `undefined`] [Enum: offers] |
| **file** | `Blob` | The CSV, at most 10 MiB. | [Defaults to `undefined`] |
| **commit** | `string` | \\\&quot;true\\\&quot; to write. Absent &#x3D; validate and report only. | [Optional] [Defaults to `undefined`] |
| **overwrite** | `string` | \\\&quot;true\\\&quot; to update rows whose id column matches one of the caller\\\&#39;s own. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | bad_upload, or the CSV header does not match. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerReportSchedulesGet

> ApiV1TrackerReportSchedulesGet200Response apiV1TrackerReportSchedulesGet()

List scheduled report deliveries.

Recurring CSV exports mailed to a list of recipients. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerReportSchedulesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  try {
    const data = await api.apiV1TrackerReportSchedulesGet();
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

[**ApiV1TrackerReportSchedulesGet200Response**](ApiV1TrackerReportSchedulesGet200Response.md)

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


## apiV1TrackerReportSchedulesIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerReportSchedulesIdDelete(id)

Delete a report schedule.

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerReportSchedulesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Schedule ID.
    id: 56,
  } satisfies ApiV1TrackerReportSchedulesIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerReportSchedulesIdDelete(body);
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
| **id** | `number` | Schedule ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherPushCampaignsIdDelete200Response**](ApiV1PublisherPushCampaignsIdDelete200Response.md)

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


## apiV1TrackerReportSchedulesIdGet

> ApiV1TrackerReportSchedulesIdGet200Response apiV1TrackerReportSchedulesIdGet(id)

Get one report schedule.

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerReportSchedulesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Schedule ID.
    id: 56,
  } satisfies ApiV1TrackerReportSchedulesIdGetRequest;

  try {
    const data = await api.apiV1TrackerReportSchedulesIdGet(body);
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
| **id** | `number` | Schedule ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerReportSchedulesIdGet200Response**](ApiV1TrackerReportSchedulesIdGet200Response.md)

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


## apiV1TrackerReportSchedulesIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerReportSchedulesIdPut(id, apiV1TrackerReportSchedulesIdPutRequest)

Update a report schedule.

Partial update. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerReportSchedulesIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Schedule ID.
    id: 56,
    // ApiV1TrackerReportSchedulesIdPutRequest
    apiV1TrackerReportSchedulesIdPutRequest: ...,
  } satisfies ApiV1TrackerReportSchedulesIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerReportSchedulesIdPut(body);
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
| **id** | `number` | Schedule ID. | [Defaults to `undefined`] |
| **apiV1TrackerReportSchedulesIdPutRequest** | [ApiV1TrackerReportSchedulesIdPutRequest](ApiV1TrackerReportSchedulesIdPutRequest.md) |  | |

### Return type

[**ApiV1PublisherPushCampaignsPost200Response**](ApiV1PublisherPushCampaignsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerReportSchedulesPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerReportSchedulesPost(apiV1TrackerReportSchedulesPostRequest)

Schedule a recurring report.

&#x60;report_type&#x60; names the same three exports &#x60;/export/{type}&#x60; serves. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerReportSchedulesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // ApiV1TrackerReportSchedulesPostRequest
    apiV1TrackerReportSchedulesPostRequest: ...,
  } satisfies ApiV1TrackerReportSchedulesPostOperationRequest;

  try {
    const data = await api.apiV1TrackerReportSchedulesPost(body);
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
| **apiV1TrackerReportSchedulesPostRequest** | [ApiV1TrackerReportSchedulesPostRequest](ApiV1TrackerReportSchedulesPostRequest.md) |  | |

### Return type

[**ApiV1PublisherPushCampaignsPost200Response**](ApiV1PublisherPushCampaignsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerRulesGet

> ApiV1TrackerRulesGet200Response apiV1TrackerRulesGet()

List automation rules.

Standing rules that watch performance and act — pause an offer, block a placement, adjust a bid, or raise an alert. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  try {
    const data = await api.apiV1TrackerRulesGet();
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

[**ApiV1TrackerRulesGet200Response**](ApiV1TrackerRulesGet200Response.md)

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


## apiV1TrackerRulesIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerRulesIdDelete(id)

Delete a rule.

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
  } satisfies ApiV1TrackerRulesIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerRulesIdDelete(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1PublisherPushCampaignsIdDelete200Response**](ApiV1PublisherPushCampaignsIdDelete200Response.md)

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


## apiV1TrackerRulesIdExecutionsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerRulesIdExecutionsGet(id)

Execution history for one rule.

Every firing, what matched, and what the rule did — including the runs it only reported because &#x60;apply_actions&#x60; was off. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesIdExecutionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
  } satisfies ApiV1TrackerRulesIdExecutionsGetRequest;

  try {
    const data = await api.apiV1TrackerRulesIdExecutionsGet(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |

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


## apiV1TrackerRulesIdGet

> ApiV1TrackerRulesIdGet200Response apiV1TrackerRulesIdGet(id)

Get one rule.

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
  } satisfies ApiV1TrackerRulesIdGetRequest;

  try {
    const data = await api.apiV1TrackerRulesIdGet(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |

### Return type

[**ApiV1TrackerRulesIdGet200Response**](ApiV1TrackerRulesIdGet200Response.md)

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


## apiV1TrackerRulesIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerRulesIdPut(id, apiV1TrackerRulesIdPutRequest)

Update a rule.

Partial update. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
    // ApiV1TrackerRulesIdPutRequest
    apiV1TrackerRulesIdPutRequest: ...,
  } satisfies ApiV1TrackerRulesIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerRulesIdPut(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |
| **apiV1TrackerRulesIdPutRequest** | [ApiV1TrackerRulesIdPutRequest](ApiV1TrackerRulesIdPutRequest.md) |  | |

### Return type

[**ApiV1PublisherPushCampaignsPost200Response**](ApiV1PublisherPushCampaignsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerRulesIdRunPost

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerRulesIdRunPost(id, window)

Run a rule now.

Evaluates immediately instead of waiting for the schedule. Honours the rule\&#39;s own &#x60;apply_actions&#x60;, so a reporting-only rule stays harmless. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesIdRunPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // number | Rule ID.
    id: 56,
    // string | Override the evaluation window for this run. (optional)
    window: window_example,
  } satisfies ApiV1TrackerRulesIdRunPostRequest;

  try {
    const data = await api.apiV1TrackerRulesIdRunPost(body);
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
| **id** | `number` | Rule ID. | [Defaults to `undefined`] |
| **window** | `string` | Override the evaluation window for this run. | [Optional] [Defaults to `undefined`] |

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


## apiV1TrackerRulesPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerRulesPost(apiV1TrackerRulesPostRequest)

Create an automation rule.

&#x60;conditions&#x60; is the list the evaluator ANDs; &#x60;action&#x60; is what fires when they all hold. With &#x60;apply_actions&#x60; false the rule reports what it would have done without touching anything — the way to trust one before arming it. 

### Example

```ts
import {
  Configuration,
  TrackerAutomationApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerRulesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerAutomationApi(config);

  const body = {
    // ApiV1TrackerRulesPostRequest
    apiV1TrackerRulesPostRequest: ...,
  } satisfies ApiV1TrackerRulesPostOperationRequest;

  try {
    const data = await api.apiV1TrackerRulesPost(body);
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
| **apiV1TrackerRulesPostRequest** | [ApiV1TrackerRulesPostRequest](ApiV1TrackerRulesPostRequest.md) |  | |

### Return type

[**ApiV1PublisherPushCampaignsPost200Response**](ApiV1PublisherPushCampaignsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

