# DirectDealsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CampaignsDirectdealIdCancelPut**](DirectDealsApi.md#apiv1campaignsdirectdealidcancelput) | **PUT** /api/v1/campaigns/directdeal/{id}/cancel | Cancel a direct deal. |
| [**apiV1DirectDealsAdzonesGet**](DirectDealsApi.md#apiv1directdealsadzonesget) | **GET** /api/v1/direct-deals/adzones | Ad zones a direct deal can be booked on. |
| [**apiV1DirectDealsGet**](DirectDealsApi.md#apiv1directdealsget) | **GET** /api/v1/direct-deals | List direct deals with their derived status. |



## apiV1CampaignsDirectdealIdCancelPut

> apiV1CampaignsDirectdealIdCancelPut(id)

Cancel a direct deal.

The panel\&#39;s Cancel button: sets &#x60;iscancelled &#x3D; 1&#x60;, which stops the deal for good — unlike &#x60;PATCH …/active&#x60; (pause), it cannot be resumed; book a new deal (or clone this one) instead. The row stays listed with &#x60;status: cancelled&#x60;. Pinned keys may only cancel a pinned campaign; an own-scoped member only a deal they manage. No body. 

### Example

```ts
import {
  Configuration,
  DirectDealsApi,
} from 'goadserver-sdk';
import type { ApiV1CampaignsDirectdealIdCancelPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DirectDealsApi(config);

  const body = {
    // number | The direct deal (campaign) id.
    id: 56,
  } satisfies ApiV1CampaignsDirectdealIdCancelPutRequest;

  try {
    const data = await api.apiV1CampaignsDirectdealIdCancelPut(body);
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
| **id** | `number` | The direct deal (campaign) id. | [Defaults to `undefined`] |

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
| **200** | Cancelled. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | &#x60;deal_not_found&#x60; — no direct deal with this id on the account, or (own-scoped team member) not one they manage. A team member with read-only campaign access gets 403 &#x60;forbidden&#x60;. |  -  |
| **422** | &#x60;already_cancelled&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DirectDealsAdzonesGet

> apiV1DirectDealsAdzonesGet(websiteId)

Ad zones a direct deal can be booked on.

The account\&#39;s own, non-deleted publisher ad zones (offer sites excluded) — the picker behind &#x60;ad_space_id&#x60; on &#x60;POST /api/v1/campaigns/directdeal&#x60;. A deal takes its ad type from the zone, so there is no ad-type filter. A team member limited to their own ad zones sees only those (directly or via the website), and can only book a deal on them. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  DirectDealsApi,
} from 'goadserver-sdk';
import type { ApiV1DirectDealsAdzonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DirectDealsApi(config);

  const body = {
    // number | Only zones on this site. (optional)
    websiteId: 56,
  } satisfies ApiV1DirectDealsAdzonesGetRequest;

  try {
    const data = await api.apiV1DirectDealsAdzonesGet(body);
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
| **websiteId** | `number` | Only zones on this site. | [Optional] [Defaults to `undefined`] |

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
| **200** | Zones, by name. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DirectDealsGet

> apiV1DirectDealsGet(page, perPage, status, websiteIds, adType, tagIds, filterName, sortBy, sortDir)

List direct deals with their derived status.

The panel\&#39;s Direct Deals listing (&#x60;flatratecampaigns&#x60; rows with &#x60;isdirectdeal &#x3D; 1&#x60;, deleted rows excluded), newest first. Unlike &#x60;GET /api/v1/campaigns?type&#x3D;directdeal&#x60; each row carries the derived &#x60;status&#x60; and the booked zone / site names. Same handler as the panel.  &#x60;status&#x60; is derived in this order: &#x60;cancelled&#x60; (cancel button) → &#x60;completed&#x60; → &#x60;paused&#x60; → &#x60;active&#x60; (state 1) → &#x60;pending&#x60; (state 0) → &#x60;rejected&#x60; (state -1) → &#x60;ended&#x60; (state 2).  &#x60;totalbudget&#x60; is in the account\&#39;s currency units. Account-wide, so a key pinned to campaigns gets 403 &#x60;forbidden_resource&#x60; — use &#x60;GET /api/v1/campaigns?type&#x3D;directdeal&#x60; (pin-filtered) instead. For a team member whose campaign access is limited to their own campaigns, only the deals they manage (created, assigned, or filed under a campaign group they manage) are listed and counted. 

### Example

```ts
import {
  Configuration,
  DirectDealsApi,
} from 'goadserver-sdk';
import type { ApiV1DirectDealsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DirectDealsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // string | CSV of active, paused, pending, completed, ended, cancelled, rejected. (optional)
    status: status_example,
    // string | CSV of site ids (the booked zone\'s site). (optional)
    websiteIds: websiteIds_example,
    // string | CSV of ad type ids. (optional)
    adType: adType_example,
    // string | CSV of tag ids; a folder tag also matches its sub-tags. (optional)
    tagIds: tagIds_example,
    // string | Name substring. (optional)
    filterName: filterName_example,
    // 'id' | 'name' | 'totalbudget' | 'firstdatestart' | 'dayend' | 'dateadded' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
  } satisfies ApiV1DirectDealsGetRequest;

  try {
    const data = await api.apiV1DirectDealsGet(body);
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
| **status** | `string` | CSV of active, paused, pending, completed, ended, cancelled, rejected. | [Optional] [Defaults to `undefined`] |
| **websiteIds** | `string` | CSV of site ids (the booked zone\&#39;s site). | [Optional] [Defaults to `undefined`] |
| **adType** | `string` | CSV of ad type ids. | [Optional] [Defaults to `undefined`] |
| **tagIds** | `string` | CSV of tag ids; a folder tag also matches its sub-tags. | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` | Name substring. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `name`, `totalbudget`, `firstdatestart`, `dayend`, `dateadded` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, name, totalbudget, firstdatestart, dayend, dateadded] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

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
| **200** | One page of deals. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

