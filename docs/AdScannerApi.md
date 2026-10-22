# AdScannerApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdScannerGet**](AdScannerApi.md#apiv1adscannerget) | **GET** /api/v1/ad-scanner | List scan tasks. |
| [**apiV1AdScannerIdDelete**](AdScannerApi.md#apiv1adscanneriddelete) | **DELETE** /api/v1/ad-scanner/{id} | Delete a scan task. |
| [**apiV1AdScannerIdIgnoreDomainPut**](AdScannerApi.md#apiv1adscanneridignoredomainputoperation) | **PUT** /api/v1/ad-scanner/{id}/ignore-domain | Ignore (or un-ignore) a flagged domain on a task. |
| [**apiV1AdScannerIdManualItemsGet**](AdScannerApi.md#apiv1adscanneridmanualitemsget) | **GET** /api/v1/ad-scanner/{id}/manual-items | List a manual task\&#39;s items. |
| [**apiV1AdScannerIdManualItemsItemIdStatePut**](AdScannerApi.md#apiv1adscanneridmanualitemsitemidstateputoperation) | **PUT** /api/v1/ad-scanner/{id}/manual-items/{itemId}/state | Pause, resume or delete a manual item. |
| [**apiV1AdScannerIdManualItemsPost**](AdScannerApi.md#apiv1adscanneridmanualitemspostoperation) | **POST** /api/v1/ad-scanner/{id}/manual-items | Add or edit a manual item. |
| [**apiV1AdScannerIdPut**](AdScannerApi.md#apiv1adscanneridputoperation) | **PUT** /api/v1/ad-scanner/{id} | Replace a task\&#39;s name, tags and config. |
| [**apiV1AdScannerIdToggleActivePut**](AdScannerApi.md#apiv1adscanneridtoggleactiveputoperation) | **PUT** /api/v1/ad-scanner/{id}/toggle-active | Start or stop a scan task. |
| [**apiV1AdScannerPost**](AdScannerApi.md#apiv1adscannerpostoperation) | **POST** /api/v1/ad-scanner | Create a scan task. |
| [**apiV1AdScannerReportHashGet**](AdScannerApi.md#apiv1adscannerreporthashget) | **GET** /api/v1/ad-scanner/report/{hash} | One scan\&#39;s full report. |
| [**apiV1AdScannerReportsGet**](AdScannerApi.md#apiv1adscannerreportsget) | **GET** /api/v1/ad-scanner/reports | List scan results. |
| [**apiV1AdScannerStatsGet**](AdScannerApi.md#apiv1adscannerstatsget) | **GET** /api/v1/ad-scanner/stats | Scan volume and proxy bandwidth. |
| [**apiV1AdScannerTagsGet**](AdScannerApi.md#apiv1adscannertagsget) | **GET** /api/v1/ad-scanner/tags | Tags used on the account\&#39;s scan tasks. |



## apiV1AdScannerGet

> apiV1AdScannerGet()

List scan tasks.

A bare array; &#x60;config&#x60; decoded, &#x60;tags&#x60; split into an array.  &#x60;coverage&#x60; — what the task\&#39;s next run would scan, &#x60;{count, reason}&#x60; (&#x60;null&#x60; for &#x60;campaigns&#x60; targets). When &#x60;count&#x60; is 0 the task produces no reports, and &#x60;reason&#x60; says why: &#x60;no_smart_zones&#x60;, &#x60;scanning_off&#x60; (no smart zone the task covers has Scanning on), &#x60;no_matching_zones&#x60; (no zone of an ad type this scan type covers, or none in the chosen networks), &#x60;no_recent_traffic&#x60; (no matching zone served in the last 5 days), &#x60;no_items&#x60; (manual task without active items) or &#x60;no_matching_items&#x60; (manual items of the wrong type for this scan type). &#x60;reason&#x60; is empty when &#x60;count&#x60; &gt; 0. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  try {
    const data = await api.apiV1AdScannerGet();
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
| **200** | Tasks. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdDelete

> apiV1AdScannerIdDelete(id)

Delete a scan task.

Soft delete; the task stops scanning.

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1AdScannerIdDeleteRequest;

  try {
    const data = await api.apiV1AdScannerIdDelete(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted. |  -  |
| **404** | Task not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdIgnoreDomainPut

> apiV1AdScannerIdIgnoreDomainPut(id, apiV1AdScannerIdIgnoreDomainPutRequest)

Ignore (or un-ignore) a flagged domain on a task.

Toggles &#x60;value&#x60; in the task\&#39;s &#x60;config.detection.domains.ignored&#x60; list: added when absent, removed when present. &#x60;type&#x60; must be &#x60;detection.domains.ignore&#x60;. Answers 200 &#x60;{success: false}&#x60; when the type / value is wrong or the task is not the caller\&#39;s. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdIgnoreDomainPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1AdScannerIdIgnoreDomainPutRequest
    apiV1AdScannerIdIgnoreDomainPutRequest: {"type":"detection.domains.ignore","value":"cdn.example.net"},
  } satisfies ApiV1AdScannerIdIgnoreDomainPutOperationRequest;

  try {
    const data = await api.apiV1AdScannerIdIgnoreDomainPut(body);
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
| **apiV1AdScannerIdIgnoreDomainPutRequest** | [ApiV1AdScannerIdIgnoreDomainPutRequest](ApiV1AdScannerIdIgnoreDomainPutRequest.md) |  | |

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
| **200** | Result. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdManualItemsGet

> apiV1AdScannerIdManualItemsGet(id)

List a manual task\&#39;s items.

The URLs / tags a &#x60;target: manual&#x60; task scans. Bare array (empty for an unknown task).

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdManualItemsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1AdScannerIdManualItemsGetRequest;

  try {
    const data = await api.apiV1AdScannerIdManualItemsGet(body);
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
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Items. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdManualItemsItemIdStatePut

> apiV1AdScannerIdManualItemsItemIdStatePut(id, itemId, apiV1AdScannerIdManualItemsItemIdStatePutRequest)

Pause, resume or delete a manual item.

&#x60;fld&#x60; &#x3D; &#x60;isactive&#x60; (default) or &#x60;isdeleted&#x60;; &#x60;value&#x60; 0 / 1. Deleting also deactivates. 200 &#x60;{success: false}&#x60; when the item is not the caller\&#39;s. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdManualItemsItemIdStatePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
    // ApiV1AdScannerIdManualItemsItemIdStatePutRequest
    apiV1AdScannerIdManualItemsItemIdStatePutRequest: {"fld":"isdeleted","value":1},
  } satisfies ApiV1AdScannerIdManualItemsItemIdStatePutOperationRequest;

  try {
    const data = await api.apiV1AdScannerIdManualItemsItemIdStatePut(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |
| **apiV1AdScannerIdManualItemsItemIdStatePutRequest** | [ApiV1AdScannerIdManualItemsItemIdStatePutRequest](ApiV1AdScannerIdManualItemsItemIdStatePutRequest.md) |  | |

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
| **200** | Result. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdManualItemsPost

> apiV1AdScannerIdManualItemsPost(id, apiV1AdScannerIdManualItemsPostRequest)

Add or edit a manual item.

Without &#x60;id&#x60; adds an item; with &#x60;id&#x60; edits that item. &#x60;type&#x60; &#x3D; url (default), html, iframe or vast_url; &#x60;value&#x60; is required. Failures (no value, task not the caller\&#39;s) answer 200 &#x60;{success: false}&#x60;. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdManualItemsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1AdScannerIdManualItemsPostRequest
    apiV1AdScannerIdManualItemsPostRequest: {"value":"https://lander.example.com/","type":"url","description":"Main lander","isactive":1},
  } satisfies ApiV1AdScannerIdManualItemsPostOperationRequest;

  try {
    const data = await api.apiV1AdScannerIdManualItemsPost(body);
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
| **apiV1AdScannerIdManualItemsPostRequest** | [ApiV1AdScannerIdManualItemsPostRequest](ApiV1AdScannerIdManualItemsPostRequest.md) |  | |

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
| **200** | Result. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdPut

> apiV1AdScannerIdPut(id, apiV1AdScannerIdPutRequest)

Replace a task\&#39;s name, tags and config.

Full replace of these three: a &#x60;config&#x60; or &#x60;tags&#x60; left out is cleared, so send the whole task. &#x60;target&#x60; / &#x60;scan_type&#x60; / &#x60;adtypeid&#x60; are fixed at create. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1AdScannerIdPutRequest
    apiV1AdScannerIdPutRequest: {"name":"Landing pages","tags":["daily"],"config":{"interval":{"type":"daily","amount":1}}},
  } satisfies ApiV1AdScannerIdPutOperationRequest;

  try {
    const data = await api.apiV1AdScannerIdPut(body);
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
| **apiV1AdScannerIdPutRequest** | [ApiV1AdScannerIdPutRequest](ApiV1AdScannerIdPutRequest.md) |  | |

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
| **200** | Saved. |  -  |
| **404** | Task not found. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerIdToggleActivePut

> apiV1AdScannerIdToggleActivePut(id, apiV1AdScannerIdToggleActivePutRequest)

Start or stop a scan task.

&#x60;is_active&#x60; &gt; 0 starts it; 0 or no body stops it.

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerIdToggleActivePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1AdScannerIdToggleActivePutRequest (optional)
    apiV1AdScannerIdToggleActivePutRequest: {"is_active":1},
  } satisfies ApiV1AdScannerIdToggleActivePutOperationRequest;

  try {
    const data = await api.apiV1AdScannerIdToggleActivePut(body);
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
| **apiV1AdScannerIdToggleActivePutRequest** | [ApiV1AdScannerIdToggleActivePutRequest](ApiV1AdScannerIdToggleActivePutRequest.md) |  | [Optional] |

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
| **200** | Saved. |  -  |
| **404** | Task not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerPost

> apiV1AdScannerPost(apiV1AdScannerPostRequest)

Create a scan task.

- &#x60;target&#x60; — &#x60;campaigns&#x60; (your own campaigns\&#39; ads), &#x60;smartzones&#x60;   (default) or &#x60;manual&#x60; (items you add under   …/{id}/manual-items). Unknown values become &#x60;smartzones&#x60;. - &#x60;scan_type&#x60; — &#x60;ad_scan&#x60; (default), &#x60;url_scan&#x60; or &#x60;vast_scan&#x60;. - &#x60;config&#x60; — only these keys are kept: &#x60;smartzone_networks&#x60;,   &#x60;device_types&#x60;, &#x60;browsers&#x60; &#x60;{items, random}&#x60;, &#x60;interval&#x60;   &#x60;{type: minutely|hourly|daily, amount}&#x60;, &#x60;detection&#x60; (push,   alerts, popups, cookies, crypto_miners, &#x60;domains&#x60; &#x60;{on, malicious,   suspicious, ignored[], ignore_dates}&#x60;, &#x60;suspicious_dom&#x60;,   &#x60;fingerprinting&#x60;, &#x60;obfuscated_js&#x60;, &#x60;permission&#x60;,   &#x60;scan_landing_ads&#x60;, &#x60;max_landing_ad_scans&#x60;), &#x60;proxy&#x60; &#x60;{on,   locations[]}&#x60;, &#x60;notify&#x60; &#x60;{enabled, level: all|serious, dest}&#x60;. - &#x60;tags&#x60; — a CSV string or an array of strings.  &#x60;target&#x60;, &#x60;scan_type&#x60; and &#x60;adtypeid&#x60; cannot change later. The task starts active. Proxy scans use metered bandwidth. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // ApiV1AdScannerPostRequest
    apiV1AdScannerPostRequest: {"name":"Landing pages","target":"campaigns","scan_type":"url_scan","tags":["daily"],"config":{"interval":{"type":"hourly","amount":1},"detection":{"push":true,"popups":true,"domains":{"true":true,"malicious":true,"suspicious":true}},"notify":{"enabled":true,"level":"serious","dest":0}}},
  } satisfies ApiV1AdScannerPostOperationRequest;

  try {
    const data = await api.apiV1AdScannerPost(body);
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
| **apiV1AdScannerPostRequest** | [ApiV1AdScannerPostRequest](ApiV1AdScannerPostRequest.md) |  | |

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
| **201** | Created. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; (name missing) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerReportHashGet

> apiV1AdScannerReportHashGet(hash)

One scan\&#39;s full report.

The browser report of a single scan (&#x60;uid&#x60; from the results list): events, redirects, requests, findings, plus the task config. Only the caller\&#39;s own scans — another account\&#39;s uid is 404. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerReportHashGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // string
    hash: hash_example,
  } satisfies ApiV1AdScannerReportHashGetRequest;

  try {
    const data = await api.apiV1AdScannerReportHashGet(body);
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
| **hash** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Report. |  -  |
| **404** | &#x60;HASH_DOES_NOT_EXIST&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerReportsGet

> apiV1AdScannerReportsGet(datestart, dateend, scanType, scanTarget, scanState, page)

List scan results.

One row per scan, 2500 per page (&#x60;page&#x60;). Defaults to today. &#x60;scan_state&#x60; 1 &#x3D; scans that found something, 0 &#x3D; clean. Rows carry &#x60;uid&#x60; (open the full report with GET …/report/{uid}), &#x60;task_name&#x60; and &#x60;scanned_item&#x60;. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerReportsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // Date (optional)
    datestart: 2013-10-20,
    // Date (optional)
    dateend: 2013-10-20,
    // 'ad_scan' | 'url_scan' | 'vast_scan' (optional)
    scanType: scanType_example,
    // 'smartzones' | 'campaigns' | 'manual' (optional)
    scanTarget: scanTarget_example,
    // 0 | 1 (optional)
    scanState: 56,
    // number (optional)
    page: 56,
  } satisfies ApiV1AdScannerReportsGetRequest;

  try {
    const data = await api.apiV1AdScannerReportsGet(body);
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
| **datestart** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **dateend** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **scanType** | `ad_scan`, `url_scan`, `vast_scan` |  | [Optional] [Defaults to `undefined`] [Enum: ad_scan, url_scan, vast_scan] |
| **scanTarget** | `smartzones`, `campaigns`, `manual` |  | [Optional] [Defaults to `undefined`] [Enum: smartzones, campaigns, manual] |
| **scanState** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |

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
| **200** | Results. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerStatsGet

> apiV1AdScannerStatsGet(datestart, dateend, statsSelcols, configId, country, proxyUsed)

Scan volume and proxy bandwidth.

Totals grouped by &#x60;stats_selcols&#x60; (CSV of scandate, config_id, country; default scandate). &#x60;bandwidth&#x60; is proxy bytes used. 

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerStatsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  const body = {
    // Date (optional)
    datestart: 2013-10-20,
    // Date (optional)
    dateend: 2013-10-20,
    // string (optional)
    statsSelcols: scandate,config_id,
    // number (optional)
    configId: 56,
    // string (optional)
    country: country_example,
    // 0 | 1 (optional)
    proxyUsed: 56,
  } satisfies ApiV1AdScannerStatsGetRequest;

  try {
    const data = await api.apiV1AdScannerStatsGet(body);
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
| **datestart** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **dateend** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **statsSelcols** | `string` |  | [Optional] [Defaults to `undefined`] |
| **configId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **country** | `string` |  | [Optional] [Defaults to `undefined`] |
| **proxyUsed** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **500** | Stats store unavailable. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdScannerTagsGet

> apiV1AdScannerTagsGet()

Tags used on the account\&#39;s scan tasks.

### Example

```ts
import {
  Configuration,
  AdScannerApi,
} from 'goadserver-sdk';
import type { ApiV1AdScannerTagsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdScannerApi(config);

  try {
    const data = await api.apiV1AdScannerTagsGet();
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
| **200** | Sorted distinct tags. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

