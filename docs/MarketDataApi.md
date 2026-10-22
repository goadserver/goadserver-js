# MarketDataApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PricingFiltersGet**](MarketDataApi.md#apiv1pricingfiltersget) | **GET** /api/v1/pricing/filters | Labels for the pricing table\&#39;s ids. |
| [**apiV1PricingGet**](MarketDataApi.md#apiv1pricingget) | **GET** /api/v1/pricing | Network floor prices (minimum bids). |
| [**apiV1SmartNetworksGet**](MarketDataApi.md#apiv1smartnetworksget) | **GET** /api/v1/smart-networks | List the network\&#39;s active smart networks. |
| [**apiV1SmartNetworksIdGet**](MarketDataApi.md#apiv1smartnetworksidget) | **GET** /api/v1/smart-networks/{id} | One smart network. |
| [**apiV1VolumesFiltersGet**](MarketDataApi.md#apiv1volumesfiltersget) | **GET** /api/v1/volumes/filters | Option lists for the volume query. |
| [**apiV1VolumesGet**](MarketDataApi.md#apiv1volumesget) | **GET** /api/v1/volumes | Available traffic volume per country (traffic estimate). |



## apiV1PricingFiltersGet

> apiV1PricingFiltersGet()

Labels for the pricing table\&#39;s ids.

Ad types (with the pay types each sells), countries, device / connection types, languages, ISPs, ad zone types and locations. Same handler as the panel.

### Example

```ts
import {
  Configuration,
  MarketDataApi,
} from 'goadserver-sdk';
import type { ApiV1PricingFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketDataApi(config);

  try {
    const data = await api.apiV1PricingFiltersGet();
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
| **200** | Option lists. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PricingGet

> apiV1PricingGet()

Network floor prices (minimum bids).

Every &#x60;min_prices_ron&#x60; row of the network — the minimum bid per ad type × pay type × device × connection × country × language × ISP × display type × ad zone location. Unfiltered (the panel filters client-side). &#x60;price&#x60; is returned as stored, in the network\&#39;s main currency units, exactly as the panel\&#39;s Pricing page shows it. &#x60;paytype&#x60;: 0 CPC, 1 CPM. 404 when the tenant\&#39;s pricing page module is off. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  MarketDataApi,
} from 'goadserver-sdk';
import type { ApiV1PricingGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketDataApi(config);

  try {
    const data = await api.apiV1PricingGet();
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
| **200** | Floors. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SmartNetworksGet

> apiV1SmartNetworksGet(search, filterId, filterName, sort, page, perPage)

List the network\&#39;s active smart networks.

The &#x60;rtb_networks&#x60; partners SmartAds campaigns buy through (active, not deleted) — the ids behind &#x60;smart_network_id&#x60; on ads. Same handler as the panel.

### Example

```ts
import {
  Configuration,
  MarketDataApi,
} from 'goadserver-sdk';
import type { ApiV1SmartNetworksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketDataApi(config);

  const body = {
    // string (optional)
    search: search_example,
    // number (optional)
    filterId: 56,
    // string (optional)
    filterName: filterName_example,
    // 'id' | 'name' (optional)
    sort: sort_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1SmartNetworksGetRequest;

  try {
    const data = await api.apiV1SmartNetworksGet(body);
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
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sort** | `id`, `name` |  | [Optional] [Defaults to `undefined`] [Enum: id, name] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `undefined`] |

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
| **200** | Networks. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SmartNetworksIdGet

> apiV1SmartNetworksIdGet(id)

One smart network.

&#x60;endpoint&#x60; and &#x60;bid_type&#x60; are always empty (kept for shape compatibility). Same handler as the panel.

### Example

```ts
import {
  Configuration,
  MarketDataApi,
} from 'goadserver-sdk';
import type { ApiV1SmartNetworksIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketDataApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SmartNetworksIdGetRequest;

  try {
    const data = await api.apiV1SmartNetworksIdGet(body);
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
| **200** | Network. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VolumesFiltersGet

> apiV1VolumesFiltersGet()

Option lists for the volume query.

Ad types (in the network\&#39;s own ad type order), device types, connection types (and whether the network filters by them) and the pay types the network has volume rows for. Same handler as the panel.

### Example

```ts
import {
  Configuration,
  MarketDataApi,
} from 'goadserver-sdk';
import type { ApiV1VolumesFiltersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketDataApi(config);

  try {
    const data = await api.apiV1VolumesFiltersGet();
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
| **200** | Option lists. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1VolumesGet

> apiV1VolumesGet(adtypeid, deviceTypeid, connectionTypeid, paytype)

Available traffic volume per country (traffic estimate).

The network\&#39;s quoted traffic volume (&#x60;volume_data&#x60;) for one ad type × device type × connection type, summed per country, largest first. Without &#x60;paytype&#x60; CPC and CPM rows are summed. Same handler as the panel\&#39;s Volumes page; 404 when its module is off. 

### Example

```ts
import {
  Configuration,
  MarketDataApi,
} from 'goadserver-sdk';
import type { ApiV1VolumesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MarketDataApi(config);

  const body = {
    // number
    adtypeid: 56,
    // number
    deviceTypeid: 56,
    // number
    connectionTypeid: 56,
    // 0 | 1 | 0 CPC, 1 CPM (GET /api/v1/volumes/filters → pay_types). (optional)
    paytype: 56,
  } satisfies ApiV1VolumesGetRequest;

  try {
    const data = await api.apiV1VolumesGet(body);
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
| **adtypeid** | `number` |  | [Defaults to `undefined`] |
| **deviceTypeid** | `number` |  | [Defaults to `undefined`] |
| **connectionTypeid** | `number` |  | [Defaults to `undefined`] |
| **paytype** | `0`, `1` | 0 CPC, 1 CPM (GET /api/v1/volumes/filters → pay_types). | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **200** | Volume per country. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |
| **422** | paytype is not 0 or 1. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

