# AdspacesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdspacesGet**](AdspacesApi.md#apiv1adspacesget) | **GET** /api/v1/adspaces | List ad zones owned by the caller. |
| [**apiV1AdspacesIdActivePatch**](AdspacesApi.md#apiv1adspacesidactivepatch) | **PATCH** /api/v1/adspaces/{id}/active | Activate or deactivate an adspace. |
| [**apiV1AdspacesIdGet**](AdspacesApi.md#apiv1adspacesidget) | **GET** /api/v1/adspaces/{id} | Get a single adspace. |



## apiV1AdspacesGet

> ApiV1AdspacesGet200Response apiV1AdspacesGet(siteId, page, perPage)

List ad zones owned by the caller.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // number | Filter to one site. (optional)
    siteId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1AdspacesGetRequest;

  try {
    const data = await api.apiV1AdspacesGet(body);
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
| **siteId** | `number` | Filter to one site. | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `100`] |

### Return type

[**ApiV1AdspacesGet200Response**](ApiV1AdspacesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Adspace list (filtered by resource_filter.site_ids/adzone_ids when set). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdActivePatch

> ApiV1CampaignsTypeIdActivePatch200Response apiV1AdspacesIdActivePatch(id, apiV1CampaignsTypeIdActivePatchRequest)

Activate or deactivate an adspace.

Idempotent. &#x60;active&#x3D;true&#x60; activates, &#x60;active&#x3D;false&#x60; deactivates. This is the endpoint behind the **\&quot;On / off only\&quot;** key preset for publishers. Honors &#x60;resource_filter.adzone_ids&#x60; for per-key scoping to specific zones. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdActivePatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CampaignsTypeIdActivePatchRequest
    apiV1CampaignsTypeIdActivePatchRequest: ...,
  } satisfies ApiV1AdspacesIdActivePatchRequest;

  try {
    const data = await api.apiV1AdspacesIdActivePatch(body);
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
| **apiV1CampaignsTypeIdActivePatchRequest** | [ApiV1CampaignsTypeIdActivePatchRequest](ApiV1CampaignsTypeIdActivePatchRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeIdActivePatch200Response**](ApiV1CampaignsTypeIdActivePatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | New state |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdGet

> apiV1AdspacesIdGet(id)

Get a single adspace.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1AdspacesIdGetRequest;

  try {
    const data = await api.apiV1AdspacesIdGet(body);
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
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Adspace |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

