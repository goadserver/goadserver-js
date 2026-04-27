# AccountApi

All URIs are relative to *https://up.goadserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AccountGet**](AccountApi.md#apiv1accountget) | **GET** /api/v1/account | Identity check — returns the authenticated user + scopes of the calling key. |



## apiV1AccountGet

> ApiV1AccountGet200Response apiV1AccountGet()

Identity check — returns the authenticated user + scopes of the calling key.

Minimal identity payload. Use this to verify a key is alive, discover which user it belongs to, and inspect what scopes the key was granted. No PII beyond name/email/company.  Key management (create/list/revoke) is **not** exposed via the public API — it requires a browser session. Visit MyAccount → API access in the panel. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountGet();
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

[**ApiV1AccountGet200Response**](ApiV1AccountGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Current user identity (and key context if authenticated by API key) |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

