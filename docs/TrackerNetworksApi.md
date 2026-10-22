# TrackerNetworksApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1TrackerAdNetworksDeleteReportsPut**](TrackerNetworksApi.md#apiv1trackeradnetworksdeletereportsputoperation) | **PUT** /api/v1/tracker/ad-networks/delete-reports | Delete pulled spend reports. |
| [**apiV1TrackerAdNetworksGet**](TrackerNetworksApi.md#apiv1trackeradnetworksget) | **GET** /api/v1/tracker/ad-networks | List ad networks. |
| [**apiV1TrackerAdNetworksIdCampaignsGet**](TrackerNetworksApi.md#apiv1trackeradnetworksidcampaignsget) | **GET** /api/v1/tracker/ad-networks/{id}/campaigns | Campaigns known on one ad network. |
| [**apiV1TrackerAdNetworksIdDelete**](TrackerNetworksApi.md#apiv1trackeradnetworksiddelete) | **DELETE** /api/v1/tracker/ad-networks/{id} | Delete an ad network. |
| [**apiV1TrackerAdNetworksIdGet**](TrackerNetworksApi.md#apiv1trackeradnetworksidget) | **GET** /api/v1/tracker/ad-networks/{id} | Get one ad network. |
| [**apiV1TrackerAdNetworksIdPut**](TrackerNetworksApi.md#apiv1trackeradnetworksidputoperation) | **PUT** /api/v1/tracker/ad-networks/{id} | Update an ad network. |
| [**apiV1TrackerAdNetworksPost**](TrackerNetworksApi.md#apiv1trackeradnetworkspostoperation) | **POST** /api/v1/tracker/ad-networks | Create an ad network. |
| [**apiV1TrackerAdNetworksReportsGet**](TrackerNetworksApi.md#apiv1trackeradnetworksreportsget) | **GET** /api/v1/tracker/ad-networks/reports | Spend reports pulled from the ad networks. |
| [**apiV1TrackerAffiliateNetworkTemplatesGet**](TrackerNetworksApi.md#apiv1trackeraffiliatenetworktemplatesget) | **GET** /api/v1/tracker/affiliate-network-templates | List affiliate-network templates. |
| [**apiV1TrackerAffiliateNetworksGet**](TrackerNetworksApi.md#apiv1trackeraffiliatenetworksget) | **GET** /api/v1/tracker/affiliate-networks | List affiliate networks. |
| [**apiV1TrackerAffiliateNetworksIdDelete**](TrackerNetworksApi.md#apiv1trackeraffiliatenetworksiddelete) | **DELETE** /api/v1/tracker/affiliate-networks/{id} | Delete an affiliate network. |
| [**apiV1TrackerAffiliateNetworksIdPut**](TrackerNetworksApi.md#apiv1trackeraffiliatenetworksidputoperation) | **PUT** /api/v1/tracker/affiliate-networks/{id} | Update an affiliate network. |
| [**apiV1TrackerAffiliateNetworksPost**](TrackerNetworksApi.md#apiv1trackeraffiliatenetworkspostoperation) | **POST** /api/v1/tracker/affiliate-networks | Create an affiliate network. |



## apiV1TrackerAdNetworksDeleteReportsPut

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerAdNetworksDeleteReportsPut(apiV1TrackerAdNetworksDeleteReportsPutRequest)

Delete pulled spend reports.

Clears imported spend rows so a re-pull can replace them — the fix for a driver that imported a bad day. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksDeleteReportsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // ApiV1TrackerAdNetworksDeleteReportsPutRequest
    apiV1TrackerAdNetworksDeleteReportsPutRequest: ...,
  } satisfies ApiV1TrackerAdNetworksDeleteReportsPutOperationRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksDeleteReportsPut(body);
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
| **apiV1TrackerAdNetworksDeleteReportsPutRequest** | [ApiV1TrackerAdNetworksDeleteReportsPutRequest](ApiV1TrackerAdNetworksDeleteReportsPutRequest.md) |  | |

### Return type

[**ApiV1PublisherPushCampaignsIdDelete200Response**](ApiV1PublisherPushCampaignsIdDelete200Response.md)

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


## apiV1TrackerAdNetworksGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerAdNetworksGet(status, filterId, filterName, sortBy, sortDir, page, perPage)

List ad networks.

The buying side — traffic sources spend is pulled from and campaigns are bound to. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // 'active' | 'inactive' (optional)
    status: status_example,
    // number (optional)
    filterId: 56,
    // string | Name contains. (optional)
    filterName: filterName_example,
    // 'id' | 'name' | 'networkid' | 'currency' | 'is_active' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1TrackerAdNetworksGetRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksGet(body);
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
| **status** | `active`, `inactive` |  | [Optional] [Defaults to `undefined`] [Enum: active, inactive] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` | Name contains. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `name`, `networkid`, `currency`, `is_active` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, name, networkid, currency, is_active] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |

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


## apiV1TrackerAdNetworksIdCampaignsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerAdNetworksIdCampaignsGet(id)

Campaigns known on one ad network.

The bindable campaigns for tracking links on this network. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksIdCampaignsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number | Ad network ID.
    id: 56,
  } satisfies ApiV1TrackerAdNetworksIdCampaignsGetRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksIdCampaignsGet(body);
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
| **id** | `number` | Ad network ID. | [Defaults to `undefined`] |

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


## apiV1TrackerAdNetworksIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerAdNetworksIdDelete(id)

Delete an ad network.

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number | Ad network ID.
    id: 56,
  } satisfies ApiV1TrackerAdNetworksIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksIdDelete(body);
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
| **id** | `number` | Ad network ID. | [Defaults to `undefined`] |

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


## apiV1TrackerAdNetworksIdGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerAdNetworksIdGet(id)

Get one ad network.

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number | Ad network ID.
    id: 56,
  } satisfies ApiV1TrackerAdNetworksIdGetRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksIdGet(body);
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
| **id** | `number` | Ad network ID. | [Defaults to `undefined`] |

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


## apiV1TrackerAdNetworksIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerAdNetworksIdPut(id, apiV1TrackerAdNetworksIdPutRequest)

Update an ad network.

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number | Ad network ID.
    id: 56,
    // ApiV1TrackerAdNetworksIdPutRequest
    apiV1TrackerAdNetworksIdPutRequest: ...,
  } satisfies ApiV1TrackerAdNetworksIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksIdPut(body);
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
| **id** | `number` | Ad network ID. | [Defaults to `undefined`] |
| **apiV1TrackerAdNetworksIdPutRequest** | [ApiV1TrackerAdNetworksIdPutRequest](ApiV1TrackerAdNetworksIdPutRequest.md) |  | |

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


## apiV1TrackerAdNetworksPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerAdNetworksPost(apiV1TrackerAdNetworksPostRequest)

Create an ad network.

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // ApiV1TrackerAdNetworksPostRequest
    apiV1TrackerAdNetworksPostRequest: ...,
  } satisfies ApiV1TrackerAdNetworksPostOperationRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksPost(body);
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
| **apiV1TrackerAdNetworksPostRequest** | [ApiV1TrackerAdNetworksPostRequest](ApiV1TrackerAdNetworksPostRequest.md) |  | |

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


## apiV1TrackerAdNetworksReportsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerAdNetworksReportsGet(filterId, filterAdNetworkid, filterState, sortBy, sortDir, page, perPage)

Spend reports pulled from the ad networks.

What the cost pull has imported per network, the raw material behind /cost-summary. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAdNetworksReportsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number (optional)
    filterId: 56,
    // number | Reports for one ad network. (optional)
    filterAdNetworkid: 56,
    // number (optional)
    filterState: 56,
    // 'r.id' | 'r.timeadded' | 'r.state' | 'r.ad_networkid' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1TrackerAdNetworksReportsGetRequest;

  try {
    const data = await api.apiV1TrackerAdNetworksReportsGet(body);
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
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterAdNetworkid** | `number` | Reports for one ad network. | [Optional] [Defaults to `undefined`] |
| **filterState** | `number` |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `r.id`, `r.timeadded`, `r.state`, `r.ad_networkid` |  | [Optional] [Defaults to `&#39;r.id&#39;`] [Enum: r.id, r.timeadded, r.state, r.ad_networkid] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |

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


## apiV1TrackerAffiliateNetworkTemplatesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1TrackerAffiliateNetworkTemplatesGet()

List affiliate-network templates.

Known networks with their postback token mapping preset. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAffiliateNetworkTemplatesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  try {
    const data = await api.apiV1TrackerAffiliateNetworkTemplatesGet();
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


## apiV1TrackerAffiliateNetworksGet

> ApiV1TrackerAffiliateNetworksGet200Response apiV1TrackerAffiliateNetworksGet()

List affiliate networks.

Where offers come from, with their postback token mapping. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAffiliateNetworksGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  try {
    const data = await api.apiV1TrackerAffiliateNetworksGet();
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

[**ApiV1TrackerAffiliateNetworksGet200Response**](ApiV1TrackerAffiliateNetworksGet200Response.md)

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


## apiV1TrackerAffiliateNetworksIdDelete

> ApiV1PublisherPushCampaignsIdDelete200Response apiV1TrackerAffiliateNetworksIdDelete(id)

Delete an affiliate network.

Hard delete — the table carries no soft-delete flag. Offers pointing at it keep their &#x60;affiliate_network_id&#x60; and simply resolve to no name. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAffiliateNetworksIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number | Affiliate network ID.
    id: 56,
  } satisfies ApiV1TrackerAffiliateNetworksIdDeleteRequest;

  try {
    const data = await api.apiV1TrackerAffiliateNetworksIdDelete(body);
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
| **id** | `number` | Affiliate network ID. | [Defaults to `undefined`] |

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


## apiV1TrackerAffiliateNetworksIdPut

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerAffiliateNetworksIdPut(id, apiV1TrackerAffiliateNetworksIdPutRequest)

Update an affiliate network.

Partial update. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAffiliateNetworksIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // number | Affiliate network ID.
    id: 56,
    // ApiV1TrackerAffiliateNetworksIdPutRequest
    apiV1TrackerAffiliateNetworksIdPutRequest: ...,
  } satisfies ApiV1TrackerAffiliateNetworksIdPutOperationRequest;

  try {
    const data = await api.apiV1TrackerAffiliateNetworksIdPut(body);
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
| **id** | `number` | Affiliate network ID. | [Defaults to `undefined`] |
| **apiV1TrackerAffiliateNetworksIdPutRequest** | [ApiV1TrackerAffiliateNetworksIdPutRequest](ApiV1TrackerAffiliateNetworksIdPutRequest.md) |  | |

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


## apiV1TrackerAffiliateNetworksPost

> ApiV1PublisherPushCampaignsPost200Response apiV1TrackerAffiliateNetworksPost(apiV1TrackerAffiliateNetworksPostRequest)

Create an affiliate network.

&#x60;template_slug&#x60; preloads a known network\&#39;s token mapping — see /affiliate-network-templates. 

### Example

```ts
import {
  Configuration,
  TrackerNetworksApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerAffiliateNetworksPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TrackerNetworksApi(config);

  const body = {
    // ApiV1TrackerAffiliateNetworksPostRequest
    apiV1TrackerAffiliateNetworksPostRequest: ...,
  } satisfies ApiV1TrackerAffiliateNetworksPostOperationRequest;

  try {
    const data = await api.apiV1TrackerAffiliateNetworksPost(body);
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
| **apiV1TrackerAffiliateNetworksPostRequest** | [ApiV1TrackerAffiliateNetworksPostRequest](ApiV1TrackerAffiliateNetworksPostRequest.md) |  | |

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

