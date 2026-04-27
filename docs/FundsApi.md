# FundsApi

All URIs are relative to *https://up.goadserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1FundsGet**](FundsApi.md#apiv1fundsget) | **GET** /api/v1/funds | Current advertiser balance + pending deposits. |



## apiV1FundsGet

> ApiV1FundsGet200Response apiV1FundsGet()

Current advertiser balance + pending deposits.

Use this before deciding to launch or pause a campaign — &#x60;low_balance&#x60; is true when current balance is below the user-configured minimum. 

### Example

```ts
import {
  Configuration,
  FundsApi,
} from 'goadserver-sdk';
import type { ApiV1FundsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FundsApi(config);

  try {
    const data = await api.apiV1FundsGet();
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

[**ApiV1FundsGet200Response**](ApiV1FundsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Balance snapshot |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

