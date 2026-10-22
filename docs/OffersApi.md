# OffersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1OffersGet**](OffersApi.md#apiv1offersget) | **GET** /api/v1/offers | List available offers. |



## apiV1OffersGet

> ApiV1OffersGet200Response apiV1OffersGet(mainCatid, catids)

List available offers.

Returns the offer catalog visible to the authenticated publisher — offer-type campaigns the publisher is whitelisted for (and not blacklisted from), with the payout computed for this publisher. Documented in audit_20260723_1117 (was implemented but unspecified). 

### Example

```ts
import {
  Configuration,
  OffersApi,
} from 'goadserver-sdk';
import type { ApiV1OffersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OffersApi(config);

  const body = {
    // number | Filter by main category id. (optional)
    mainCatid: 56,
    // string | Comma-separated sub-category ids. (optional)
    catids: catids_example,
  } satisfies ApiV1OffersGetRequest;

  try {
    const data = await api.apiV1OffersGet(body);
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
| **mainCatid** | `number` | Filter by main category id. | [Optional] [Defaults to `undefined`] |
| **catids** | `string` | Comma-separated sub-category ids. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1OffersGet200Response**](ApiV1OffersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Offer list |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

