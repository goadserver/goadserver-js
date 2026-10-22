# SharedReportsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1SharedReportsGet**](SharedReportsApi.md#apiv1sharedreportsget) | **GET** /api/v1/shared-reports | List shared reports. |
| [**apiV1SharedReportsIdDelete**](SharedReportsApi.md#apiv1sharedreportsiddelete) | **DELETE** /api/v1/shared-reports/{id} | Delete a shared report. |
| [**apiV1SharedReportsIdGet**](SharedReportsApi.md#apiv1sharedreportsidget) | **GET** /api/v1/shared-reports/{id} | Show a shared report. |
| [**apiV1SharedReportsIdPut**](SharedReportsApi.md#apiv1sharedreportsidputoperation) | **PUT** /api/v1/shared-reports/{id} | Update a shared report. |
| [**apiV1SharedReportsIdToggleActivePut**](SharedReportsApi.md#apiv1sharedreportsidtoggleactiveput) | **PUT** /api/v1/shared-reports/{id}/toggle-active | Switch a report\&#39;s link on or off. |
| [**apiV1SharedReportsPost**](SharedReportsApi.md#apiv1sharedreportspost) | **POST** /api/v1/shared-reports | Create a shared report. |
| [**apiV1SharedReportsSetupDataGet**](SharedReportsApi.md#apiv1sharedreportssetupdataget) | **GET** /api/v1/shared-reports/setup-data | Campaigns and sites a report can cover. |



## apiV1SharedReportsGet

> apiV1SharedReportsGet(page, perPage, search, filterIsactive)

List shared reports.

Advertiser / publisher / SSP / DSP reports (tracker reports are listed in the tracker section of the panel; they can still be read and changed here by id). Each row carries the public &#x60;url&#x60; and the DSA-transparency &#x60;dsa_url&#x60;. &#x60;filter_isactive&#x60; &#x3D; 0 / 1, &#x60;search&#x60; matches the name. 

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string (optional)
    search: search_example,
    // 0 | 1 (optional)
    filterIsactive: 56,
  } satisfies ApiV1SharedReportsGetRequest;

  try {
    const data = await api.apiV1SharedReportsGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **filterIsactive** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **200** | Reports. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SharedReportsIdDelete

> apiV1SharedReportsIdDelete(id)

Delete a shared report.

The link stops working immediately.

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SharedReportsIdDeleteRequest;

  try {
    const data = await api.apiV1SharedReportsIdDelete(body);
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
| **403** | Missing scope, or &#x60;forbidden_resource&#x60; (pinned key). |  -  |
| **404** | Report not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SharedReportsIdGet

> apiV1SharedReportsIdGet(id)

Show a shared report.

The stored row with &#x60;campaigns&#x60; / &#x60;sites&#x60; / &#x60;settings&#x60; / &#x60;options&#x60; decoded.

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SharedReportsIdGetRequest;

  try {
    const data = await api.apiV1SharedReportsIdGet(body);
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
| **200** | The report. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Report not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SharedReportsIdPut

> apiV1SharedReportsIdPut(id, apiV1SharedReportsIdPutRequest)

Update a shared report.

Partial: &#x60;name&#x60; (non-empty), &#x60;tagids&#x60; and each of &#x60;campaigns&#x60; / &#x60;sites&#x60; / &#x60;settings&#x60; / &#x60;options&#x60; replace the stored value when sent. &#x60;statstype&#x60; cannot change (create a new report) — sending it is 422 &#x60;unknown_fields&#x60;. The link (&#x60;hash&#x60;) stays the same. 

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1SharedReportsIdPutRequest
    apiV1SharedReportsIdPutRequest: {"campaigns":[{"id":812,"type":"ron"},{"id":813,"type":"ron"}]},
  } satisfies ApiV1SharedReportsIdPutOperationRequest;

  try {
    const data = await api.apiV1SharedReportsIdPut(body);
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
| **apiV1SharedReportsIdPutRequest** | [ApiV1SharedReportsIdPutRequest](ApiV1SharedReportsIdPutRequest.md) |  | |

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
| **400** | &#x60;no_fields&#x60;. |  -  |
| **403** | Missing scope, or &#x60;forbidden_resource&#x60; (pinned key). |  -  |
| **404** | Report not found. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SharedReportsIdToggleActivePut

> apiV1SharedReportsIdToggleActivePut(id)

Switch a report\&#39;s link on or off.

No body — flips &#x60;isactive&#x60;; an inactive link answers 404 to viewers.

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsIdToggleActivePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SharedReportsIdToggleActivePutRequest;

  try {
    const data = await api.apiV1SharedReportsIdToggleActivePut(body);
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
| **200** | New state. |  -  |
| **403** | Missing scope, or &#x60;forbidden_resource&#x60; (pinned key). |  -  |
| **404** | Report not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SharedReportsPost

> apiV1SharedReportsPost(sharedReportBody)

Create a shared report.

Mints a public link (&#x60;data.url&#x60;) that shows the chosen stats to anyone who has it, without a login. Scope:  - &#x60;statstype&#x60; — advertiser (default), publisher, ssp, dsp or tracker. - &#x60;campaigns&#x60; — &#x60;[{id, type}]&#x60; (type ron / cpm / flatrate /   directdeal); empty with no &#x60;settings&#x60; &#x3D; an empty report.   &#x60;settings.follow_groups: true&#x60; plus &#x60;tagids&#x60; adds every campaign   currently filed under those tags (advertiser reports only). - &#x60;sites&#x60; — &#x60;[{id}]&#x60; for publisher reports. - &#x60;settings&#x60; — viewer filters and layout: &#x60;ad_types&#x60;,   &#x60;selling_types&#x60;, &#x60;device_types&#x60; (id arrays), &#x60;countries&#x60; (codes),   &#x60;visible_metrics&#x60;, &#x60;visible_conv_types&#x60;, &#x60;allowed_groupby&#x60;,   &#x60;default_groupby&#x60; (default &#x60;period&#x60;), &#x60;allowed_viewtypes&#x60;,   &#x60;viewer_filters&#x60;, &#x60;follow_groups&#x60;, &#x60;show_names&#x60; (false hides   entity names). - &#x60;options&#x60; — stats adjustment shown to viewers   (&#x60;{on, impressions|clicks|paid: {on, type: increase|decrease, value}}&#x60;);   dropped unless the account holds the &#x60;adjust_stats&#x60; right.  Ids are only ever reported within the caller\&#39;s own stats. Unknown top-level fields → 422 &#x60;unknown_fields&#x60;. GET /api/v1/shared-reports/setup-data lists the pickable campaigns and sites. 

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  const body = {
    // SharedReportBody
    sharedReportBody: {"name":"Client A — weekly","statstype":"advertiser","campaigns":[{"id":812,"type":"ron"}],"settings":{"countries":["us"],"visible_metrics":["views","clicks","ctr","spent"],"follow_groups":true},"tagids":"5"},
  } satisfies ApiV1SharedReportsPostRequest;

  try {
    const data = await api.apiV1SharedReportsPost(body);
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
| **sharedReportBody** | [SharedReportBody](SharedReportBody.md) |  | |

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
| **403** | Missing scope, or &#x60;forbidden_resource&#x60; — the key is pinned to resources. |  -  |
| **422** | &#x60;validation_error&#x60; (name missing) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SharedReportsSetupDataGet

> apiV1SharedReportsSetupDataGet()

Campaigns and sites a report can cover.

The account\&#39;s live campaigns (&#x60;{id, name, type}&#x60;) and sites, the panel host the links are built on, and whether &#x60;options&#x60; (stats adjustment) is honoured for this account. 

### Example

```ts
import {
  Configuration,
  SharedReportsApi,
} from 'goadserver-sdk';
import type { ApiV1SharedReportsSetupDataGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SharedReportsApi(config);

  try {
    const data = await api.apiV1SharedReportsSetupDataGet();
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
| **200** | Pickers. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

