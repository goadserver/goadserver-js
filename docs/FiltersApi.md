# FiltersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1FiltersGet**](FiltersApi.md#apiv1filtersget) | **GET** /api/v1/filters | List all filters across types. |
| [**apiV1FiltersIpIdRangesRangeIdDelete**](FiltersApi.md#apiv1filtersipidrangesrangeiddelete) | **DELETE** /api/v1/filters/ip/{id}/ranges/{rangeId} | Delete one range from an IP pool. |
| [**apiV1FiltersIpIdRangesRangeIdTogglePut**](FiltersApi.md#apiv1filtersipidrangesrangeidtoggleput) | **PUT** /api/v1/filters/ip/{id}/ranges/{rangeId}/toggle | Pause / resume one range of an IP pool. |
| [**apiV1FiltersMassActionPost**](FiltersApi.md#apiv1filtersmassactionpostoperation) | **POST** /api/v1/filters/mass-action | Activate, deactivate or delete many filters. |
| [**apiV1FiltersPost**](FiltersApi.md#apiv1filterspostoperation) | **POST** /api/v1/filters | Create a filter and populate it with items. |
| [**apiV1FiltersTypeIdActivePatch**](FiltersApi.md#apiv1filterstypeidactivepatch) | **PATCH** /api/v1/filters/{type}/{id}/active | Activate or deactivate a filter (exclusion types only). |
| [**apiV1FiltersTypeIdDelete**](FiltersApi.md#apiv1filterstypeiddelete) | **DELETE** /api/v1/filters/{type}/{id} | Delete a filter (and its items, for IP pools). |
| [**apiV1FiltersTypeIdGet**](FiltersApi.md#apiv1filterstypeidget) | **GET** /api/v1/filters/{type}/{id} | Get a single filter with its items. |
| [**apiV1FiltersTypeIdItemsItemDelete**](FiltersApi.md#apiv1filterstypeiditemsitemdelete) | **DELETE** /api/v1/filters/{type}/{id}/items/{item} | Remove a single item from a filter. |
| [**apiV1FiltersTypeIdItemsPost**](FiltersApi.md#apiv1filterstypeiditemspostoperation) | **POST** /api/v1/filters/{type}/{id}/items | Add items to an existing filter. |
| [**apiV1FiltersTypeIdPut**](FiltersApi.md#apiv1filterstypeidputoperation) | **PUT** /api/v1/filters/{type}/{id} | Edit a filter (rename, replace items, change scope). |



## apiV1FiltersGet

> ApiV1FiltersGet200Response apiV1FiltersGet(type, search)

List all filters across types.

Each filter has a **type** and may apply globally or to specific campaigns. Types:  | type          | meaning                          | toggleable | |---------------|----------------------------------|:----------:| | &#x60;domain_excl&#x60; | Block these domains              | yes | | &#x60;domain_incl&#x60; | Only allow these domains         | no | | &#x60;adzone_excl&#x60; | Block these ad zones             | yes | | &#x60;adzone_incl&#x60; | Only allow these ad zones        | no | | &#x60;isp_excl&#x60;    | Block these ISPs                 | yes | | &#x60;subid_excl&#x60;  | Block these SubIDs               | yes | | &#x60;subid_incl&#x60;  | Only allow these SubIDs          | no | | &#x60;publisher_excl&#x60; | Block every ad zone of these publishers, including zones they add later | yes | | &#x60;ip&#x60;          | IP-pool blocking                 | no |  Unpaginated: &#x60;{data, total_rows}&#x60;. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType | Filter to one type. (optional)
    type: ...,
    // string | Name contains. (optional)
    search: search_example,
  } satisfies ApiV1FiltersGetRequest;

  try {
    const data = await api.apiV1FiltersGet(body);
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
| **type** | `FilterType` | Filter to one type. | [Optional] [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **search** | `string` | Name contains. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1FiltersGet200Response**](ApiV1FiltersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Filter list across types |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersIpIdRangesRangeIdDelete

> apiV1FiltersIpIdRangesRangeIdDelete(id, rangeId)

Delete one range from an IP pool.

Same as &#x60;DELETE /api/v1/filters/ip/{id}/items/{rangeId}&#x60;; the panel\&#39;s own route.

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersIpIdRangesRangeIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // number
    id: 56,
    // number
    rangeId: 56,
  } satisfies ApiV1FiltersIpIdRangesRangeIdDeleteRequest;

  try {
    const data = await api.apiV1FiltersIpIdRangesRangeIdDelete(body);
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
| **rangeId** | `number` |  | [Defaults to `undefined`] |

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
| **404** | IP pool or range not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersIpIdRangesRangeIdTogglePut

> apiV1FiltersIpIdRangesRangeIdTogglePut(id, rangeId)

Pause / resume one range of an IP pool.

Flips one range\&#39;s active state (an inactive range stops matching). &#x60;rangeId&#x60; is &#x60;ranges[].id&#x60; from GET /api/v1/filters/ip/{id}. Same handler as the panel; logged on the pool\&#39;s history.

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersIpIdRangesRangeIdTogglePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // number
    id: 56,
    // number
    rangeId: 56,
  } satisfies ApiV1FiltersIpIdRangesRangeIdTogglePutRequest;

  try {
    const data = await api.apiV1FiltersIpIdRangesRangeIdTogglePut(body);
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
| **rangeId** | `number` |  | [Defaults to `undefined`] |

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
| **404** | IP pool or range not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersMassActionPost

> apiV1FiltersMassActionPost(apiV1FiltersMassActionPostRequest)

Activate, deactivate or delete many filters.

Each entry names a filter by &#x60;type&#x60; + &#x60;id&#x60; (as in &#x60;GET /filters&#x60;). &#x60;delete&#x60; runs the single-delete path for each (audit snapshot, IP list cascade, and campaigns linked to an allow-list / IP pool are unlinked). Activate / deactivate only applies to the types that have an on/off state; others are skipped. Filters that are not yours are skipped. &#x60;affected&#x60; counts what changed. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersMassActionPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // ApiV1FiltersMassActionPostRequest
    apiV1FiltersMassActionPostRequest: {"action":"deactivate","filters":[{"id":1201,"type":"domain_excl"},{"id":88,"type":"isp_excl"}]},
  } satisfies ApiV1FiltersMassActionPostOperationRequest;

  try {
    const data = await api.apiV1FiltersMassActionPost(body);
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
| **apiV1FiltersMassActionPostRequest** | [ApiV1FiltersMassActionPostRequest](ApiV1FiltersMassActionPostRequest.md) |  | |

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
| **200** | Done. |  -  |
| **400** | &#x60;no_filters&#x60;, &#x60;invalid_action&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersPost

> FilterDetail apiV1FiltersPost(apiV1FiltersPostRequest)

Create a filter and populate it with items.

Saved through the panel\&#39;s own create path (same rows, campaign links and Action Log entries as the Filters page).  For &#x60;domain_excl&#x60; / &#x60;domain_incl&#x60;: items can be domain URLs (&#x60;\&quot;https://evil.com/x\&quot;&#x60;) — automatically resolved to internal domain IDs — or numeric domain IDs as strings. For &#x60;adzone_excl&#x60; / &#x60;adzone_incl&#x60; / &#x60;isp_excl&#x60;: items must be numeric IDs (find them with /api/v1/lookups/adzones and /api/v1/lookups/isps). For &#x60;publisher_excl&#x60;: publisher user ids (find them with /api/v1/lookups/publishers). Ids that are not a publisher on your network are dropped. For &#x60;subid_excl&#x60; / &#x60;subid_incl&#x60;: SubID strings (the encoded form when the account has SubID encoding on — stored decoded). For &#x60;ip&#x60;: ranges in &#x60;ip_list&#x60; (one per line: an IP, &#x60;a - b&#x60; or a CIDR) and/or &#x60;items&#x60;; &#x60;campaign_ids&#x60; is not accepted (link a pool from the campaign side).  **Campaign scope** (&#x60;campaign_ids&#x60;): * Block lists (&#x60;*_excl&#x60;) — &#x60;ad_type&#x60; 0 blocks across every campaign,   so campaign_ids needs &#x60;ad_type &gt; 0&#x60; (422 otherwise). Each id must   be one of your live campaigns of that ad type and of   &#x60;campaign_type&#x60; (&#x60;ron&#x60; default; &#x60;rtb&#x60; for DSP campaigns; omitted   with &#x60;ad_type&#x60; 14 means rtb). Empty &#x3D; every campaign of that ad   type. * Allow-lists (&#x60;*_incl&#x60;) — each id must be one of your live RON   campaigns; the filter becomes that campaign\&#39;s allow-list   (replacing the one it had). Ids outside the key\&#39;s campaign pin are a 403. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // ApiV1FiltersPostRequest
    apiV1FiltersPostRequest: ...,
  } satisfies ApiV1FiltersPostOperationRequest;

  try {
    const data = await api.apiV1FiltersPost(body);
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
| **apiV1FiltersPostRequest** | [ApiV1FiltersPostRequest](ApiV1FiltersPostRequest.md) |  | |

### Return type

[**FilterDetail**](FilterDetail.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Filter created — the same FilterDetail GET returns (type&#x3D;ip adds &#x60;imported&#x60;). |  -  |
| **403** | A campaign id outside the key\&#39;s campaign pin (&#x60;forbidden_resource&#x60;). |  -  |
| **422** | Validation error, &#x60;duplicate_name&#x60;, unknown field, or invalid campaign_ids. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdActivePatch

> ApiV1FiltersTypeIdActivePatch200Response apiV1FiltersTypeIdActivePatch(type, id, apiV1CampaignsTypeIdActivePatchRequest)

Activate or deactivate a filter (exclusion types only).

Only &#x60;*_excl&#x60; filters have an active/inactive state. Inclusion filters and IP pools always apply when a campaign references them — disable by removing the reference instead. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdActivePatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType
    type: ...,
    // number
    id: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1FiltersTypeIdActivePatchRequest;

  try {
    const data = await api.apiV1FiltersTypeIdActivePatch(body);
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
| **type** | `FilterType` |  | [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1FiltersTypeIdActivePatch200Response**](ApiV1FiltersTypeIdActivePatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New state |  -  |
| **422** | Filter type not toggleable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdDelete

> apiV1FiltersTypeIdDelete(type, id)

Delete a filter (and its items, for IP pools).

Campaigns that use the filter as their allow-list or IP pool are unlinked (set back to none), the same as deleting it in the panel. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType
    type: ...,
    // number
    id: 56,
  } satisfies ApiV1FiltersTypeIdDeleteRequest;

  try {
    const data = await api.apiV1FiltersTypeIdDelete(body);
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
| **type** | `FilterType` |  | [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Deleted |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdGet

> FilterDetail apiV1FiltersTypeIdGet(type, id)

Get a single filter with its items.

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType
    type: ...,
    // number
    id: 56,
  } satisfies ApiV1FiltersTypeIdGetRequest;

  try {
    const data = await api.apiV1FiltersTypeIdGet(body);
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
| **type** | `FilterType` |  | [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**FilterDetail**](FilterDetail.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Filter details |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdItemsItemDelete

> ApiV1FiltersTypeIdItemsItemDelete200Response apiV1FiltersTypeIdItemsItemDelete(type, id, item)

Remove a single item from a filter.

&#x60;{item}&#x60; is the stored value — domain ID (or the hostname it was added with), adzone ID, ISP ID, or SubID string (encoded form when SubID encoding is on). For &#x60;ip&#x60; it is the range id (&#x60;ranges[].id&#x60;). URL-encode special characters.

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdItemsItemDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType
    type: ...,
    // number
    id: 56,
    // string
    item: item_example,
  } satisfies ApiV1FiltersTypeIdItemsItemDeleteRequest;

  try {
    const data = await api.apiV1FiltersTypeIdItemsItemDelete(body);
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
| **type** | `FilterType` |  | [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **item** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ApiV1FiltersTypeIdItemsItemDelete200Response**](ApiV1FiltersTypeIdItemsItemDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Removed |  -  |
| **404** | Item not present in this filter |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdItemsPost

> ApiV1FiltersTypeIdItemsPost200Response apiV1FiltersTypeIdItemsPost(type, id, apiV1FiltersTypeIdItemsPostRequest)

Add items to an existing filter.

Same input format as creating a filter — domain URLs are auto-resolved to IDs for domain filters, numeric IDs required for adzone/ISP filters, SubID strings for SubID filters. Already-present items are deduplicated silently. For &#x60;ip&#x60; each item is one range line (IP, &#x60;a - b&#x60; or CIDR) and the answer is the pool\&#39;s FilterDetail with &#x60;imported&#x60;. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdItemsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType
    type: ...,
    // number
    id: 56,
    // ApiV1FiltersTypeIdItemsPostRequest
    apiV1FiltersTypeIdItemsPostRequest: ...,
  } satisfies ApiV1FiltersTypeIdItemsPostOperationRequest;

  try {
    const data = await api.apiV1FiltersTypeIdItemsPost(body);
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
| **type** | `FilterType` |  | [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1FiltersTypeIdItemsPostRequest** | [ApiV1FiltersTypeIdItemsPostRequest](ApiV1FiltersTypeIdItemsPostRequest.md) |  | |

### Return type

[**ApiV1FiltersTypeIdItemsPost200Response**](ApiV1FiltersTypeIdItemsPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New item set |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1FiltersTypeIdPut

> FilterDetail apiV1FiltersTypeIdPut(type, id, apiV1FiltersTypeIdPutRequest)

Edit a filter (rename, replace items, change scope).

Partial edit: every field you leave out keeps its current value, then the filter is saved through the panel\&#39;s own edit path (same rows, campaign links and Action Log entries as the Filters page).  * &#x60;items&#x60; **replaces** the whole item list (same input format as   create). To add or remove single items use the &#x60;/items&#x60; routes. * &#x60;campaign_ids&#x60; replaces the campaign scope and is validated like   on create (needs &#x60;ad_type &gt; 0&#x60; on block lists; campaigns must be   yours, of that ad type, and of &#x60;campaign_type&#x60;). Sending &#x60;[]&#x60;   makes a block list cover every campaign of its ad type, and   unlinks every campaign from an allow-list. * &#x60;ad_type&#x60; / &#x60;campaign_type&#x60; re-validate the kept campaign list. * &#x60;type&#x3D;ip&#x60;: &#x60;name&#x60;, &#x60;ip_list&#x60; (ranges to import, one per line) and   &#x60;replace_ip_ranges&#x60; (true &#x3D; drop the existing ranges first) only. 

### Example

```ts
import {
  Configuration,
  FiltersApi,
} from 'goadserver-sdk';
import type { ApiV1FiltersTypeIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FiltersApi(config);

  const body = {
    // FilterType
    type: ...,
    // number
    id: 56,
    // ApiV1FiltersTypeIdPutRequest
    apiV1FiltersTypeIdPutRequest: {"name":"Fraud domains (Q4)"},
  } satisfies ApiV1FiltersTypeIdPutOperationRequest;

  try {
    const data = await api.apiV1FiltersTypeIdPut(body);
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
| **type** | `FilterType` |  | [Defaults to `undefined`] [Enum: domain_excl, domain_incl, adzone_excl, adzone_incl, isp_excl, subid_excl, subid_incl, publisher_excl, ip] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **apiV1FiltersTypeIdPutRequest** | [ApiV1FiltersTypeIdPutRequest](ApiV1FiltersTypeIdPutRequest.md) |  | |

### Return type

[**FilterDetail**](FilterDetail.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The saved filter (same shape as GET). |  -  |
| **403** | A campaign id outside the key\&#39;s campaign pin (&#x60;forbidden_resource&#x60;). |  -  |
| **404** | Not found |  -  |
| **422** | Unknown field, unknown type, empty name / items, invalid campaign_ids, or a field the type does not store. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

