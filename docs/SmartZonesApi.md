# SmartZonesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PublisherSmartzonesDistributionAdspacesIdGet**](SmartZonesApi.md#apiv1publishersmartzonesdistributionadspacesidget) | **GET** /api/v1/publisher/smartzones/distribution/adspaces/{id} | Network split for one ad zone. |
| [**apiV1PublisherSmartzonesDistributionPerSiteGet**](SmartZonesApi.md#apiv1publishersmartzonesdistributionpersiteget) | **GET** /api/v1/publisher/smartzones/distribution/per-site | Traffic and earnings split across networks for one site. |
| [**apiV1PublisherSmartzonesDistributionSitesGet**](SmartZonesApi.md#apiv1publishersmartzonesdistributionsitesget) | **GET** /api/v1/publisher/smartzones/distribution/sites | Sites that carry smart zones. |
| [**apiV1PublisherSmartzonesGet**](SmartZonesApi.md#apiv1publishersmartzonesget) | **GET** /api/v1/publisher/smartzones | List smart zones. |
| [**apiV1PublisherSmartzonesIdDelete**](SmartZonesApi.md#apiv1publishersmartzonesiddelete) | **DELETE** /api/v1/publisher/smartzones/{id} | Delete a smart zone. |
| [**apiV1PublisherSmartzonesIdGet**](SmartZonesApi.md#apiv1publishersmartzonesidget) | **GET** /api/v1/publisher/smartzones/{id} | Get one smart zone. |
| [**apiV1PublisherSmartzonesIdPut**](SmartZonesApi.md#apiv1publishersmartzonesidputoperation) | **PUT** /api/v1/publisher/smartzones/{id} | Update a smart zone. |
| [**apiV1PublisherSmartzonesImportPost**](SmartZonesApi.md#apiv1publishersmartzonesimportpostoperation) | **POST** /api/v1/publisher/smartzones/import | Bulk import smart zones. |
| [**apiV1PublisherSmartzonesNetworksGet**](SmartZonesApi.md#apiv1publishersmartzonesnetworksget) | **GET** /api/v1/publisher/smartzones/networks | List your smart network accounts. |
| [**apiV1PublisherSmartzonesNetworksIdDelete**](SmartZonesApi.md#apiv1publishersmartzonesnetworksiddelete) | **DELETE** /api/v1/publisher/smartzones/networks/{id} | Remove a smart network account. |
| [**apiV1PublisherSmartzonesNetworksPost**](SmartZonesApi.md#apiv1publishersmartzonesnetworkspostoperation) | **POST** /api/v1/publisher/smartzones/networks | Add or update a smart network account. |
| [**apiV1PublisherSmartzonesPost**](SmartZonesApi.md#apiv1publishersmartzonespostoperation) | **POST** /api/v1/publisher/smartzones | Create a smart zone. |
| [**apiV1PublisherSmartzonesSetupDataGet**](SmartZonesApi.md#apiv1publishersmartzonessetupdataget) | **GET** /api/v1/publisher/smartzones/setup-data | Lookups for the smart-zone form. |
| [**apiV1PublisherSmartzonesSspCampaignsGet**](SmartZonesApi.md#apiv1publishersmartzonessspcampaignsget) | **GET** /api/v1/publisher/smartzones/ssp-campaigns | SSP campaigns usable as a smart zone\&#39;s RTB feed. |



## apiV1PublisherSmartzonesDistributionAdspacesIdGet

> apiV1PublisherSmartzonesDistributionAdspacesIdGet(id, from, to, basis)

Network split for one ad zone.

Per-day share, eCPM and volume of each smart zone under one of your ad zones, which zone led each day, a country heat map and a summary. **Money is in currency units (not cents).** 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesDistributionAdspacesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number | Ad zone (adspace) id.
    id: 56,
    // Date (optional)
    from: 2013-10-20,
    // Date (optional)
    to: 2013-10-20,
    // 'imp' | 'earn' (optional)
    basis: basis_example,
  } satisfies ApiV1PublisherSmartzonesDistributionAdspacesIdGetRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesDistributionAdspacesIdGet(body);
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
| **id** | `number` | Ad zone (adspace) id. | [Defaults to `undefined`] |
| **from** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **to** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **basis** | `imp`, `earn` |  | [Optional] [Defaults to `&#39;imp&#39;`] [Enum: imp, earn] |

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
| **200** | Distribution. |  -  |
| **400** | &#x60;bad_request&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;adzone_not_found&#x60; — not one of your live ad zones. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesDistributionPerSiteGet

> apiV1PublisherSmartzonesDistributionPerSiteGet(siteid, from, to, basis)

Traffic and earnings split across networks for one site.

How one site\&#39;s smart-zone traffic and earnings are spread over the networks: daily series (revenue, impressions, clicks, share, eCPM with the prior window), KPIs against the prior window of the same length, and a per-ad-zone breakdown with a health hint. **Money is in currency units (not cents)**: &#x60;earned*&#x60;, &#x60;avg_ecpm&#x60;, &#x60;ecpm_*&#x60; and the revenue/eCPM series. Impressions count views + clicks (click-only ad types log as clicks). 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesDistributionPerSiteGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number
    siteid: 56,
    // Date | Inclusive start. Defaults to 6 days ago (both `from` and `to` must be sent to override). (optional)
    from: 2013-10-20,
    // Date | Inclusive end. Defaults to today. (optional)
    to: 2013-10-20,
    // 'imp' | 'earn' | Share basis — impressions or earnings. (optional)
    basis: basis_example,
  } satisfies ApiV1PublisherSmartzonesDistributionPerSiteGetRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesDistributionPerSiteGet(body);
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
| **siteid** | `number` |  | [Defaults to `undefined`] |
| **from** | `Date` | Inclusive start. Defaults to 6 days ago (both &#x60;from&#x60; and &#x60;to&#x60; must be sent to override). | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | Inclusive end. Defaults to today. | [Optional] [Defaults to `undefined`] |
| **basis** | `imp`, `earn` | Share basis — impressions or earnings. | [Optional] [Defaults to `&#39;imp&#39;`] [Enum: imp, earn] |

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
| **200** | Distribution. |  -  |
| **400** | &#x60;bad_request&#x60; — &#x60;siteid&#x60; missing. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesDistributionSitesGet

> apiV1PublisherSmartzonesDistributionSitesGet()

Sites that carry smart zones.

Your sites with at least one live smart zone on a network, with ad zone and zone counts — the picker for the per-site distribution view.

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesDistributionSitesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  try {
    const data = await api.apiV1PublisherSmartzonesDistributionSitesGet();
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
| **200** | Sites. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesGet

> apiV1PublisherSmartzonesGet(page, perPage, sortBy, sortDir, networkId, siteid, spaceid, selectType, adzoneTypeid, status, filterId, filterName, filterAdzoneName)

List smart zones.

Smart zones hang under one of your ad zones and send part of its traffic to an outside ad network (or, with &#x60;smart_networkid &#x3D; 0&#x60;, split your own inventory). The same list the panel\&#39;s Smart Zones page shows. Paginated with &#x60;page&#x60; / &#x60;per_page&#x60; (max 2000).  Keys pinned to &#x60;adzone_ids&#x60; or &#x60;site_ids&#x60; are refused with &#x60;403 forbidden_resource&#x60; on every smart-zone route: a smart zone, its network accounts and the import span zones the pin cannot follow. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // 'id' | 'name' | 'is_active' | 'smart_networkid' | 'siteid' | 'last_active_date' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number | Only zones on this smart network account (`smart_networkid`). (optional)
    networkId: 56,
    // number | Only zones under this site. `site_id` is accepted too. (optional)
    siteid: 56,
    // number | Only zones under this ad zone. (optional)
    spaceid: 56,
    // 0 | 1 | 2 | 3 | 0 = percentage, 1 = eCPM, 2 = RTB, 3 = eCPM + limit %. (optional)
    selectType: 56,
    // number | Only zones whose parent ad zone has this type id. (optional)
    adzoneTypeid: 56,
    // 'active' | 'inactive' (optional)
    status: status_example,
    // number (optional)
    filterId: 56,
    // string | Substring match on the zone name. (optional)
    filterName: filterName_example,
    // string | Substring match on the parent ad zone name. (optional)
    filterAdzoneName: filterAdzoneName_example,
  } satisfies ApiV1PublisherSmartzonesGetRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesGet(body);
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
| **sortBy** | `id`, `name`, `is_active`, `smart_networkid`, `siteid`, `last_active_date` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, name, is_active, smart_networkid, siteid, last_active_date] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **networkId** | `number` | Only zones on this smart network account (&#x60;smart_networkid&#x60;). | [Optional] [Defaults to `undefined`] |
| **siteid** | `number` | Only zones under this site. &#x60;site_id&#x60; is accepted too. | [Optional] [Defaults to `undefined`] |
| **spaceid** | `number` | Only zones under this ad zone. | [Optional] [Defaults to `undefined`] |
| **selectType** | `0`, `1`, `2`, `3` | 0 &#x3D; percentage, 1 &#x3D; eCPM, 2 &#x3D; RTB, 3 &#x3D; eCPM + limit %. | [Optional] [Defaults to `undefined`] [Enum: 0, 1, 2, 3] |
| **adzoneTypeid** | `number` | Only zones whose parent ad zone has this type id. | [Optional] [Defaults to `undefined`] |
| **status** | `active`, `inactive` |  | [Optional] [Defaults to `undefined`] [Enum: active, inactive] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` | Substring match on the zone name. | [Optional] [Defaults to `undefined`] |
| **filterAdzoneName** | `string` | Substring match on the parent ad zone name. | [Optional] [Defaults to `undefined`] |

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
| **200** | One page of smart zones. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesIdDelete

> apiV1PublisherSmartzonesIdDelete(id)

Delete a smart zone.

Soft delete (&#x60;isdeleted &#x3D; 1&#x60;). There is no recover route; recreate the zone instead.

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSmartzonesIdDeleteRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesIdDelete(body);
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
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;smart_zone_not_found&#x60; (also when already deleted). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesIdGet

> apiV1PublisherSmartzonesIdGet(id)

Get one smart zone.

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSmartzonesIdGetRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesIdGet(body);
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
| **200** | The zone. &#x60;creative&#x60; and &#x60;settings&#x60; are JSON-encoded strings, exactly as written. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;smart_zone_not_found&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesIdPut

> apiV1PublisherSmartzonesIdPut(id, apiV1PublisherSmartzonesIdPutRequest)

Update a smart zone.

Partial update: only the keys you send are written. Moving the zone to another ad zone (&#x60;spaceid&#x60;) is allowed; the new ad zone must be one of your live ones and &#x60;siteid&#x60; follows it (a bare &#x60;siteid&#x60; is ignored). Changing &#x60;smart_networkid&#x60; re-derives the catalogue &#x60;networkid&#x60;; both it and &#x60;ssp_campaignid&#x60; must be your own. Booleans may be sent as &#x60;true&#x60;/&#x60;false&#x60; or &#x60;1&#x60;/&#x60;0&#x60;.  Unknown body fields are refused with &#x60;422 unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1PublisherSmartzonesIdPutRequest
    apiV1PublisherSmartzonesIdPutRequest: {"is_active":false},
  } satisfies ApiV1PublisherSmartzonesIdPutOperationRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesIdPut(body);
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
| **apiV1PublisherSmartzonesIdPutRequest** | [ApiV1PublisherSmartzonesIdPutRequest](ApiV1PublisherSmartzonesIdPutRequest.md) |  | |

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
| **200** | Saved (also when nothing changed). |  -  |
| **400** | &#x60;invalid_json&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;smart_zone_not_found&#x60;, or &#x60;network_not_found&#x60; for a &#x60;smart_networkid&#x60; that is not yours. |  -  |
| **422** | &#x60;validation_error&#x60; (&#x60;select_type&#x60;, &#x60;spaceid&#x60;, &#x60;ssp_campaignid&#x60;) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesImportPost

> apiV1PublisherSmartzonesImportPost(apiV1PublisherSmartzonesImportPostRequest)

Bulk import smart zones.

Creates (or, when a zone with the same name already exists under the same ad zone, overwrites) one smart zone per &#x60;zones[]&#x60; entry, all on one network account. Entries without a &#x60;spaceid&#x60; or &#x60;url&#x60;, or whose ad zone is not one of your live ones, are skipped; &#x60;imported&#x60; counts the rows written. Each zone\&#39;s site is its ad zone\&#39;s site (the top-level &#x60;siteid&#x60; is ignored). Imported zones are active.  Unknown top-level body fields are refused with &#x60;422 unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesImportPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // ApiV1PublisherSmartzonesImportPostRequest
    apiV1PublisherSmartzonesImportPostRequest: {"smart_network_id":14,"network_id":3,"select_type":1,"select_pct":20,"settings":{"skip_when_stats":1},"zones":[{"spaceid":4471,"name":"Exo 728 DE","zoneid":"12345","url":"https://a.network.example/zone/12345","device_type_ids":[1]}]},
  } satisfies ApiV1PublisherSmartzonesImportPostOperationRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesImportPost(body);
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
| **apiV1PublisherSmartzonesImportPostRequest** | [ApiV1PublisherSmartzonesImportPostRequest](ApiV1PublisherSmartzonesImportPostRequest.md) |  | |

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
| **200** | Imported. |  -  |
| **400** | &#x60;invalid_network&#x60; (no &#x60;smart_network_id&#x60;), &#x60;no_zones&#x60;, &#x60;invalid_select_type&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;network_not_found&#x60;. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesNetworksGet

> apiV1PublisherSmartzonesNetworksGet()

List your smart network accounts.

Your accounts on outside ad networks (the \&quot;Networks\&quot; tab). &#x60;available_networks&#x60; lists the catalogue networks you can add, with the credential flags each needs.  **Credentials are masked on the API:** &#x60;apikey&#x60; and every string in &#x60;api_data&#x60; come back as &#x60;****&#x60; + their last 4 characters (&#x60;has_apikey&#x60; says whether a key is stored). Writing a masked value back through &#x60;POST .../networks&#x60; keeps the stored secret, so a read-modify-write round trip is safe; send the real value to change it. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesNetworksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  try {
    const data = await api.apiV1PublisherSmartzonesNetworksGet();
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
| **200** | Accounts. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesNetworksIdDelete

> apiV1PublisherSmartzonesNetworksIdDelete(id)

Remove a smart network account.

Hard delete. Refused while any live smart zone still uses the account.

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesNetworksIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1PublisherSmartzonesNetworksIdDeleteRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesNetworksIdDelete(body);
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
| **200** | Removed. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;network_not_found&#x60;. |  -  |
| **422** | &#x60;has_active_zones&#x60; — delete or move its smart zones first. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesNetworksPost

> apiV1PublisherSmartzonesNetworksPost(apiV1PublisherSmartzonesNetworksPostRequest)

Add or update a smart network account.

Without &#x60;id&#x60; (or &#x60;id: 0&#x60;) creates an account; with the &#x60;id&#x60; of one of yours updates it (every field is rewritten — send the full object). &#x60;name&#x60; + &#x60;prepend_name&#x60; must be unique among your accounts. Empty credential pairs are dropped from &#x60;api_data&#x60;, and a set &#x60;apikey&#x60; removes &#x60;username&#x60;/&#x60;userpass&#x60;.  Unknown body fields are refused with &#x60;422 unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesNetworksPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // ApiV1PublisherSmartzonesNetworksPostRequest
    apiV1PublisherSmartzonesNetworksPostRequest: {"name":"ExoClick main","networkid":3,"currency":"USD","is_active":1,"pullstats":1,"apikey":"xxxxxxxx","api_data":{"userid":"998877"}},
  } satisfies ApiV1PublisherSmartzonesNetworksPostOperationRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesNetworksPost(body);
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
| **apiV1PublisherSmartzonesNetworksPostRequest** | [ApiV1PublisherSmartzonesNetworksPostRequest](ApiV1PublisherSmartzonesNetworksPostRequest.md) |  | |

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
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; (&#x60;name&#x60; required or duplicate) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesPost

> apiV1PublisherSmartzonesPost(apiV1PublisherSmartzonesPostRequest)

Create a smart zone.

Creates a smart zone under one of your live ad zones. The zone\&#39;s &#x60;siteid&#x60; is always taken from the ad zone (a &#x60;siteid&#x60; in the body is ignored). With no network (&#x60;smart_networkid&#x60; 0 or omitted) the selection type is forced to percentage, because eCPM and RTB need an upstream network to rank against.  Unknown body fields are refused with &#x60;422 unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // ApiV1PublisherSmartzonesPostRequest
    apiV1PublisherSmartzonesPostRequest: {"name":"Exo backfill — DE mobile","spaceid":4471,"smart_networkid":14,"countries":"DE,AT","device_type_ids":"3","is_active":true,"select_type":1,"select_pct":30,"creative":"{\"creative\":{\"type\":\"url\",\"value\":\"https://a.network.example/zone/12345\"}}","settings":"{\"skip_when_stats\":1}","network_zoneid":12345},
  } satisfies ApiV1PublisherSmartzonesPostOperationRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesPost(body);
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
| **apiV1PublisherSmartzonesPostRequest** | [ApiV1PublisherSmartzonesPostRequest](ApiV1PublisherSmartzonesPostRequest.md) |  | |

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
| **400** | &#x60;invalid_json&#x60; — the body is not JSON or a field has the wrong JSON type. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;network_not_found&#x60; — &#x60;smart_networkid&#x60; is not one of your network accounts. |  -  |
| **422** | &#x60;validation_error&#x60; (&#x60;name&#x60;, &#x60;smart_networkid&#x60;, &#x60;select_type&#x60;, &#x60;spaceid&#x60; — not your live ad zone, &#x60;ssp_campaignid&#x60; — not your SSP campaign) or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesSetupDataGet

> apiV1PublisherSmartzonesSetupDataGet()

Lookups for the smart-zone form.

Everything the create/update body refers to: countries, device types (empty when device targeting is off for the tenant), your websites and live ad zones, the ad zone types you use, and the network catalogue (&#x60;smartzone_networks&#x60;) with the per-network flags that say which credentials and ids that network needs. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesSetupDataGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  try {
    const data = await api.apiV1PublisherSmartzonesSetupDataGet();
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
| **200** | Lookups. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PublisherSmartzonesSspCampaignsGet

> apiV1PublisherSmartzonesSspCampaignsGet(networkid, adtypeid)

SSP campaigns usable as a smart zone\&#39;s RTB feed.

Your active RTB-feed SSP campaigns (&#x60;ssptype &#x3D; ssp&#x60;, &#x60;use_type &#x3D; 2&#x60;) on the RTB network that matches the catalogue network &#x60;networkid&#x60;, optionally narrowed to one ad type. Empty when the network has no RTB twin. 

### Example

```ts
import {
  Configuration,
  SmartZonesApi,
} from 'goadserver-sdk';
import type { ApiV1PublisherSmartzonesSspCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SmartZonesApi(config);

  const body = {
    // number | Catalogue network id (setup-data `smartzone_networks[].id`).
    networkid: 56,
    // number | Ad type id of the parent ad zone. (optional)
    adtypeid: 56,
  } satisfies ApiV1PublisherSmartzonesSspCampaignsGetRequest;

  try {
    const data = await api.apiV1PublisherSmartzonesSspCampaignsGet(body);
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
| **networkid** | `number` | Catalogue network id (setup-data &#x60;smartzone_networks[].id&#x60;). | [Defaults to `undefined`] |
| **adtypeid** | `number` | Ad type id of the parent ad zone. | [Optional] [Defaults to `undefined`] |

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
| **200** | Candidates. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

