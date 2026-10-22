# AdsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CampaignsTypeCampaignIdAdsMassUndeletePost**](AdsApi.md#apiv1campaignstypecampaignidadsmassundeletepostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/mass-undelete | Restore archived ads of a campaign. |



## apiV1CampaignsTypeCampaignIdAdsMassUndeletePost

> apiV1CampaignsTypeCampaignIdAdsMassUndeletePost(type, campaignId, apiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest)

Restore archived ads of a campaign.

The undo of POST …/ads/mass-delete, for every campaign type except rtb (the single PUT …/ads/{adId}/restore is RON-only). Only ads at is_deleted &#x3D; 1 move; on a tenant that validates RON ads they go back through validation. At most 200 ids. 

### Example

```ts
import {
  Configuration,
  AdsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdsApi(config);

  const body = {
    // 'ron' | 'cpm' | 'flatrate' | 'directdeal'
    type: type_example,
    // number
    campaignId: 56,
    // ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest
    apiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest: ...,
  } satisfies ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostOperationRequest;

  try {
    const data = await api.apiV1CampaignsTypeCampaignIdAdsMassUndeletePost(body);
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
| **type** | `ron`, `cpm`, `flatrate`, `directdeal` |  | [Defaults to `undefined`] [Enum: ron, cpm, flatrate, directdeal] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest** | [ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest](ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest.md) |  | |

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
| **200** | &#x60;affected&#x60; &#x3D; ads restored. |  -  |
| **400** | No ids, or more than 200. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

