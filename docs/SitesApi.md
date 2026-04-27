# SitesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1SitesGet**](SitesApi.md#apiv1sitesget) | **GET** /api/v1/sites | List the caller\&#39;s websites. |



## apiV1SitesGet

> ApiV1SitesGet200Response apiV1SitesGet()

List the caller\&#39;s websites.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  try {
    const data = await api.apiV1SitesGet();
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

[**ApiV1SitesGet200Response**](ApiV1SitesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Site list (filtered by &#x60;resource_filter.site_ids&#x60; when set). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

