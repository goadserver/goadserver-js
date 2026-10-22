# AgenticMediaBuyingApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingactionsactioniddecidepostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/actions/{actionId}/decide | Approve or reject a proposal. |
| [**apiV1AdspacesIdMediaBuyingActionsGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingactionsget) | **GET** /api/v1/adspaces/{id}/media-buying/actions | Activity log: every block, bid, budget and other change, and open proposals. |
| [**apiV1AdspacesIdMediaBuyingAgentRunPost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingagentrunpost) | **POST** /api/v1/adspaces/{id}/media-buying/agent/run | Run the buying agent now. |
| [**apiV1AdspacesIdMediaBuyingAgentRunsGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingagentrunsget) | **GET** /api/v1/adspaces/{id}/media-buying/agent/runs | The buying agent\&#39;s recent runs with their summaries and proposals. |
| [**apiV1AdspacesIdMediaBuyingBlockPost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingblockpostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/block | Block or unblock one source zone at the network. |
| [**apiV1AdspacesIdMediaBuyingCompareGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingcompareget) | **GET** /api/v1/adspaces/{id}/media-buying/compare | Compare with another buy (A/B, e.g. against a control left to the network\&#39;s own optimiser). |
| [**apiV1AdspacesIdMediaBuyingGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingget) | **GET** /api/v1/adspaces/{id}/media-buying | Overview: the connected network, what it supports, the policy and open proposals. |
| [**apiV1AdspacesIdMediaBuyingIpsGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingipsget) | **GET** /api/v1/adspaces/{id}/media-buying/ips | The IP preblock list: ranges on the network\&#39;s exclusion list and proposals. |
| [**apiV1AdspacesIdMediaBuyingIpsPost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingipspostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/ips | Change the IP preblock list. |
| [**apiV1AdspacesIdMediaBuyingLaunchGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyinglaunchget) | **GET** /api/v1/adspaces/{id}/media-buying/launch | What a new campaign can be launched with (unconnected ad zones). |
| [**apiV1AdspacesIdMediaBuyingLaunchPost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyinglaunchpostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/launch | Launch a new campaign at the network for this ad zone. |
| [**apiV1AdspacesIdMediaBuyingLaunchTemplatesGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyinglaunchtemplatesget) | **GET** /api/v1/adspaces/{id}/media-buying/launch/templates | Existing campaigns that can be cloned for a launch. |
| [**apiV1AdspacesIdMediaBuyingNetworkBudgetGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingnetworkbudgetget) | **GET** /api/v1/adspaces/{id}/media-buying/network-budget | The campaign\&#39;s daily budget at the network. |
| [**apiV1AdspacesIdMediaBuyingPolicyPut**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingpolicyput) | **PUT** /api/v1/adspaces/{id}/media-buying/policy | Save the buying policy (any subset of its fields). |
| [**apiV1AdspacesIdMediaBuyingPolicySuggestGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingpolicysuggestget) | **GET** /api/v1/adspaces/{id}/media-buying/policy/suggest | Suggested policy from the zone\&#39;s own traffic, with a reason per field. |
| [**apiV1AdspacesIdMediaBuyingReportPost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingreportpostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/report | Send the media buying report now. |
| [**apiV1AdspacesIdMediaBuyingSegmentsGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsegmentsget) | **GET** /api/v1/adspaces/{id}/media-buying/segments | Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language. |
| [**apiV1AdspacesIdMediaBuyingSourceBidGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsourcebidget) | **GET** /api/v1/adspaces/{id}/media-buying/source/bid | The campaign\&#39;s current bid at the network. |
| [**apiV1AdspacesIdMediaBuyingSourceBidPut**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsourcebidputoperation) | **PUT** /api/v1/adspaces/{id}/media-buying/source/bid | Set the campaign\&#39;s bid at the network. |
| [**apiV1AdspacesIdMediaBuyingSourceRetryPost**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsourceretrypost) | **POST** /api/v1/adspaces/{id}/media-buying/source/retry | Retry the connection to the source campaign. |
| [**apiV1AdspacesIdMediaBuyingTargetingGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtargetingget) | **GET** /api/v1/adspaces/{id}/media-buying/targeting | The campaign\&#39;s placement targeting (all, or an allow-list). |
| [**apiV1AdspacesIdMediaBuyingTargetingPut**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtargetingputoperation) | **PUT** /api/v1/adspaces/{id}/media-buying/targeting | Switch to / edit the allow-list, or back to all placements. |
| [**apiV1AdspacesIdMediaBuyingTargetingSuggestGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtargetingsuggestget) | **GET** /api/v1/adspaces/{id}/media-buying/targeting/suggest | Suggested allow-list: the profitable placements of the policy window. |
| [**apiV1AdspacesIdMediaBuyingTrackRecordGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtrackrecordget) | **GET** /api/v1/adspaces/{id}/media-buying/track-record | Track record: did each change do what it was meant to? |
| [**apiV1AdspacesIdMediaBuyingZonesGet**](AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingzonesget) | **GET** /api/v1/adspaces/{id}/media-buying/zones | Source-zone report: revenue against cost per placement. |
| [**apiV1MediaBuyingPortfolioGet**](AgenticMediaBuyingApi.md#apiv1mediabuyingportfolioget) | **GET** /api/v1/media-buying/portfolio | Every buy side by side: margin against target, spend, proposals, the agent\&#39;s latest summary. |
| [**apiV1TrackerMediaBuyingPortfolioGet**](AgenticMediaBuyingApi.md#apiv1trackermediabuyingportfolioget) | **GET** /api/v1/tracker/media-buying/portfolio | Every buy side by side (tracker accounts — the same overview): margin against target, spend, proposals, the agent\&#39;s latest summary. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingactionsactioniddecidepostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/actions/{actionId}/decide | Approve or reject a proposal. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingActionsGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingactionsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/actions | Activity log: every block, bid, budget and other change, and open proposals. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingagentrunpost) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/agent/run | Run the buying agent now. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingagentrunsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/agent/runs | The buying agent\&#39;s recent runs with their summaries and proposals. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingBlockPost**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingblockpostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/block | Block or unblock one source zone at the network. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingCompareGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingcompareget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/compare | Compare with another buy (A/B, e.g. against a control left to the network\&#39;s own optimiser). |
| [**apiV1TrackerTrackingLinksIdMediaBuyingGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying | Overview: the connected network, what it supports, the policy and open proposals. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingIpsGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingipsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/ips | The IP preblock list: ranges on the network\&#39;s exclusion list and proposals. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingIpsPost**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingipspostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/ips | Change the IP preblock list. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingnetworkbudgetget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/network-budget | The campaign\&#39;s daily budget at the network. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingpolicyput) | **PUT** /api/v1/tracker/tracking-links/{id}/media-buying/policy | Save the buying policy (any subset of its fields). |
| [**apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingpolicysuggestget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/policy/suggest | Suggested policy from the zone\&#39;s own traffic, with a reason per field. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingReportPost**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingreportpostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/report | Send the media buying report now. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsegmentsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/segments | Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsourcebidget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/source/bid | The campaign\&#39;s current bid at the network. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsourcebidputoperation) | **PUT** /api/v1/tracker/tracking-links/{id}/media-buying/source/bid | Set the campaign\&#39;s bid at the network. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsourceretrypost) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/source/retry | Retry the connection to the source campaign. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtargetingget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/targeting | The campaign\&#39;s placement targeting (all, or an allow-list). |
| [**apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtargetingputoperation) | **PUT** /api/v1/tracker/tracking-links/{id}/media-buying/targeting | Switch to / edit the allow-list, or back to all placements. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtargetingsuggestget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/targeting/suggest | Suggested allow-list: the profitable placements of the policy window. |
| [**apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtrackrecordget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/track-record | Track record: did each change do what it was meant to? |
| [**apiV1TrackerTrackingLinksIdMediaBuyingZonesGet**](AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingzonesget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/zones | Source-zone report: revenue against cost per placement. |



## apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost

> apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost(id, actionId, apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest)

Approve or reject a proposal.

Approving carries the proposal out at the network (a block, a bid, a budget, a segment exclusion). Approving an &#x60;expand_country&#x60; proposal (ad zones only) duplicates the ad zone — linked campaigns, own ads, settings, buying policy — and launches its own network campaign for that one country at the proposed bid and test budget, with the source zone\&#39;s quality blocks as its blacklist; answers &#x60;{id, action, status, zone_id, new_spaceid, launch}&#x60;; a failure removes the duplicate again (422).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // number | The proposal id from the activity log.
    actionId: 56,
    // ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest
    apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **actionId** | `number` | The proposal id from the activity log. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest** | [ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest](ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingActionsGet

> apiV1AdspacesIdMediaBuyingActionsGet(id, status, actor, action, zone, from, to, limit, format)

Activity log: every block, bid, budget and other change, and open proposals.

Newest first. A &#x60;bid_change&#x60; on a network with a bid per country carries &#x60;metrics.countries&#x60; [{country, pct, old, new, margin, cost, revenue}].

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingActionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // string | `proposed` | `applied` | `rejected` | `failed` | `expired`. (optional)
    status: status_example,
    // string | `policy` | `agent` | `advertiser` | `manual` | `inherited`. (optional)
    actor: actor_example,
    // string | e.g. `block`, `unblock`, `zone_bid`, `bid_change`, `net_budget`, `exclude_segment`, `expand_country`, `ip_block`, `report`. (optional)
    action: action_example,
    // string | One source zone id. (optional)
    zone: zone_example,
    // string | YYYY-MM-DD. (optional)
    from: from_example,
    // string | YYYY-MM-DD. (optional)
    to: to_example,
    // number | 1-1000, default 200. (optional)
    limit: 56,
    // string | `csv` for a CSV download (up to 5000 rows). (optional)
    format: format_example,
  } satisfies ApiV1AdspacesIdMediaBuyingActionsGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingActionsGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **status** | `string` | &#x60;proposed&#x60; | &#x60;applied&#x60; | &#x60;rejected&#x60; | &#x60;failed&#x60; | &#x60;expired&#x60;. | [Optional] [Defaults to `undefined`] |
| **actor** | `string` | &#x60;policy&#x60; | &#x60;agent&#x60; | &#x60;advertiser&#x60; | &#x60;manual&#x60; | &#x60;inherited&#x60;. | [Optional] [Defaults to `undefined`] |
| **action** | `string` | e.g. &#x60;block&#x60;, &#x60;unblock&#x60;, &#x60;zone_bid&#x60;, &#x60;bid_change&#x60;, &#x60;net_budget&#x60;, &#x60;exclude_segment&#x60;, &#x60;expand_country&#x60;, &#x60;ip_block&#x60;, &#x60;report&#x60;. | [Optional] [Defaults to `undefined`] |
| **zone** | `string` | One source zone id. | [Optional] [Defaults to `undefined`] |
| **from** | `string` | YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **to** | `string` | YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | 1-1000, default 200. | [Optional] [Defaults to `undefined`] |
| **format** | `string` | &#x60;csv&#x60; for a CSV download (up to 5000 rows). | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingAgentRunPost

> apiV1AdspacesIdMediaBuyingAgentRunPost(id, body)

Run the buying agent now.

At most once per 10 minutes per zone (429 &#x60;too_soon&#x60;). Refused while the zone is switched off. Returns the new run.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingAgentRunPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1AdspacesIdMediaBuyingAgentRunPostRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingAgentRunPost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingAgentRunsGet

> apiV1AdspacesIdMediaBuyingAgentRunsGet(id)

The buying agent\&#39;s recent runs with their summaries and proposals.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingAgentRunsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingAgentRunsGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingAgentRunsGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingBlockPost

> apiV1AdspacesIdMediaBuyingBlockPost(id, apiV1AdspacesIdMediaBuyingBlockPostRequest)

Block or unblock one source zone at the network.

Writes the change to the network campaign right away and logs it as a manual action. 502 when the network refuses.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingBlockPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // ApiV1AdspacesIdMediaBuyingBlockPostRequest
    apiV1AdspacesIdMediaBuyingBlockPostRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingBlockPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingBlockPost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingBlockPostRequest** | [ApiV1AdspacesIdMediaBuyingBlockPostRequest](ApiV1AdspacesIdMediaBuyingBlockPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingCompareGet

> apiV1AdspacesIdMediaBuyingCompareGet(id, _with, days)

Compare with another buy (A/B, e.g. against a control left to the network\&#39;s own optimiser).

This buy against another of yours over the same days (default: its control — policy &#x60;control_for&#x60; — or the buy it is the control of). Per buy: revenue, network cost, profit, margin, profit and volume per day, and each day\&#39;s figures. Verdict: a paired test on the daily margins — &#x60;a_better&#x60; / &#x60;b_better&#x60; (a &#x3D; this buy) only when the mean difference is at least twice its standard error over at least 5 days with revenue on both sides, else &#x60;too_close&#x60; or &#x60;too_little_data&#x60;; &#x60;note&#x60; says it in a sentence. Database only, no network call.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingCompareGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // number | The other buy (ad zone or tracking link id); default its control. (optional)
    _with: 56,
    // number | Full days, ending yesterday. (optional)
    days: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingCompareGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingCompareGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **_with** | `number` | The other buy (ad zone or tracking link id); default its control. | [Optional] [Defaults to `undefined`] |
| **days** | `number` | Full days, ending yesterday. | [Optional] [Defaults to `14`] |

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
| **200** | OK — &#x60;data&#x60; {days, from, to, currency, a, b, paired_days, margin_diff_pts, margin_diff_se, verdict, note}. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | No buy to compare with, not one of yours, or &#x60;days&#x60; outside 5-90. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingGet

> apiV1AdspacesIdMediaBuyingGet(id)

Overview: the connected network, what it supports, the policy and open proposals.

Everything the panel shows before the report: network and campaign, capability flags (&#x60;supports_*&#x60;; &#x60;supports_country_bids&#x60; &#x3D; the campaign bid is an absolute bid per country, judged and moved per country), the URL suffix that captures the source zone id (&#x60;capture&#x60;), the stored &#x60;policy&#x60;, &#x60;pending_proposals&#x60;, the source campaign state and &#x60;owner_gets_report&#x60;. 404 when the ad space is not connected to an external network campaign.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingIpsGet

> apiV1AdspacesIdMediaBuyingIpsGet(id)

The IP preblock list: ranges on the network\&#39;s exclusion list and proposals.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingIpsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingIpsGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingIpsGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingIpsPost

> apiV1AdspacesIdMediaBuyingIpsPost(id, apiV1AdspacesIdMediaBuyingIpsPostRequest)

Change the IP preblock list.

&#x60;add&#x60; blocks the given ranges now, &#x60;approve&#x60; / &#x60;reject&#x60; decide proposals, &#x60;remove&#x60; takes ranges off, &#x60;refresh&#x60; builds the list now (no &#x60;cidrs&#x60;).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingIpsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // ApiV1AdspacesIdMediaBuyingIpsPostRequest
    apiV1AdspacesIdMediaBuyingIpsPostRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingIpsPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingIpsPost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingIpsPostRequest** | [ApiV1AdspacesIdMediaBuyingIpsPostRequest](ApiV1AdspacesIdMediaBuyingIpsPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingLaunchGet

> apiV1AdspacesIdMediaBuyingLaunchGet(id, adnetworkId)

What a new campaign can be launched with (unconnected ad zones).

Without &#x60;adnetwork_id&#x60;: the network accounts that can launch. With it: that network\&#39;s launch options (formats, countries, minimum bids).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingLaunchGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // number | One of the owner\'s network accounts. (optional)
    adnetworkId: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingLaunchGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingLaunchGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **adnetworkId** | `number` | One of the owner\&#39;s network accounts. | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingLaunchPost

> apiV1AdspacesIdMediaBuyingLaunchPost(id, apiV1AdspacesIdMediaBuyingLaunchPostRequest)

Launch a new campaign at the network for this ad zone.

Files the create request; once the network approves it the campaign is connected to the zone (auto pause/activate on).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingLaunchPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // ApiV1AdspacesIdMediaBuyingLaunchPostRequest
    apiV1AdspacesIdMediaBuyingLaunchPostRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingLaunchPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingLaunchPost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingLaunchPostRequest** | [ApiV1AdspacesIdMediaBuyingLaunchPostRequest](ApiV1AdspacesIdMediaBuyingLaunchPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingLaunchTemplatesGet

> apiV1AdspacesIdMediaBuyingLaunchTemplatesGet(id, adnetworkId)

Existing campaigns that can be cloned for a launch.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // number | The network account. (optional)
    adnetworkId: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingLaunchTemplatesGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingLaunchTemplatesGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **adnetworkId** | `number` | The network account. | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;: &#x60;[{id, name, ad_type, ads}]&#x60;. &#x60;ads&#x60; is the campaign\&#39;s ad count, or -1 when the network was too slow to count them all. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingNetworkBudgetGet

> apiV1AdspacesIdMediaBuyingNetworkBudgetGet(id)

The campaign\&#39;s daily budget at the network.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingNetworkBudgetGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingNetworkBudgetGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingNetworkBudgetGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingPolicyPut

> apiV1AdspacesIdMediaBuyingPolicyPut(id, mediaBuyingPolicy)

Save the buying policy (any subset of its fields).

Fields left out keep their stored value. Returns the stored, normalized policy.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingPolicyPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // MediaBuyingPolicy
    mediaBuyingPolicy: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingPolicyPutRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingPolicyPut(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **mediaBuyingPolicy** | [MediaBuyingPolicy](MediaBuyingPolicy.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingPolicySuggestGet

> apiV1AdspacesIdMediaBuyingPolicySuggestGet(id, preset)

Suggested policy from the zone\&#39;s own traffic, with a reason per field.

Nothing is saved. &#x60;data.policy&#x60; is the full suggested policy; &#x60;data.suggestions&#x60; lists &#x60;{field, value, why}&#x60;; with &#x60;preset&#x60; the preset\&#39;s own changes follow, each with its reason.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingPolicySuggestGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // 'conservative' | 'balanced' | 'aggressive' | On top of the suggestion: conservative (every lever proposes, 95% certainty, twice the minimum cost and traffic, 5% bid steps, at most 20 changes a day), balanced (the suggestion as it is) or aggressive (placement blocks, bids per placement and segment exclusions in auto, the agent in auto, 80% certainty, 15% bid steps). No preset touches the network budget, the campaign bid or the IP preblock. Unknown value: 422. (optional)
    preset: preset_example,
  } satisfies ApiV1AdspacesIdMediaBuyingPolicySuggestGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingPolicySuggestGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **preset** | `conservative`, `balanced`, `aggressive` | On top of the suggestion: conservative (every lever proposes, 95% certainty, twice the minimum cost and traffic, 5% bid steps, at most 20 changes a day), balanced (the suggestion as it is) or aggressive (placement blocks, bids per placement and segment exclusions in auto, the agent in auto, 80% certainty, 15% bid steps). No preset touches the network budget, the campaign bid or the IP preblock. Unknown value: 422. | [Optional] [Defaults to `undefined`] [Enum: conservative, balanced, aggressive] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingReportPost

> apiV1AdspacesIdMediaBuyingReportPost(id, apiV1AdspacesIdMediaBuyingReportPostRequest)

Send the media buying report now.

The same report the daily / weekly schedule sends: to the admins\&#39; notification event and, where the owner runs the buy (admanager, tracking links), the owner\&#39;s email and the &#x60;media_buying.report&#x60; event. Returns the report and where it went.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingReportPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // ApiV1AdspacesIdMediaBuyingReportPostRequest
    apiV1AdspacesIdMediaBuyingReportPostRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingReportPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingReportPost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingReportPostRequest** | [ApiV1AdspacesIdMediaBuyingReportPostRequest](ApiV1AdspacesIdMediaBuyingReportPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingSegmentsGet

> apiV1AdspacesIdMediaBuyingSegmentsGet(id, dim, refresh)

Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.

&#x60;data.cost_basis&#x60;: &#x60;network&#x60; (country / os / hour: the network\&#39;s exact cost per segment; 400 &#x60;not_supported&#x60; when the network does not report it), &#x60;daily&#x60; (weekday: the network\&#39;s cost per day over 28 days, keys 1 &#x3D; Monday … 7 &#x3D; Sunday, &#x60;days&#x60; per row &#x3D; how many of that day were charged; judged from 3) or &#x60;estimated&#x60; (browser / region / carrier / language: the period\&#39;s cost split by each value\&#39;s share of the traffic, &#x60;cost_estimated: true&#x60;; a candidate needs twice &#x60;segment_min_spend&#x60;). On ExoClick browser and language are &#x60;network&#x60; (its own cost per value); a row keyed &#x60;n:&lt;name&gt;&#x60; is cost for a value our stats do not have and is never a candidate. The weekday and estimated dimensions work on every network and are always proposals (never written by &#x60;segment_mode&#x60; auto); approving a browser or language exclusion on ExoClick or TrafficStars writes it there (&#x60;writable: true&#x60;; TrafficStars only takes include lists, so it is refused on a campaign that targets every browser / language), every other one is applied by hand.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingSegmentsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // string | `country` (default where the network reports cost per segment) | `os` | `hour` | `weekday` (default otherwise) | `browser` | `region` | `carrier` | `language`. The overview\'s `segment_dims` lists the ones this zone has. (optional)
    dim: dim_example,
    // string | `1` re-reads the network instead of the cache. (optional)
    refresh: refresh_example,
  } satisfies ApiV1AdspacesIdMediaBuyingSegmentsGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingSegmentsGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **dim** | `string` | &#x60;country&#x60; (default where the network reports cost per segment) | &#x60;os&#x60; | &#x60;hour&#x60; | &#x60;weekday&#x60; (default otherwise) | &#x60;browser&#x60; | &#x60;region&#x60; | &#x60;carrier&#x60; | &#x60;language&#x60;. The overview\&#39;s &#x60;segment_dims&#x60; lists the ones this zone has. | [Optional] [Defaults to `undefined`] |
| **refresh** | `string` | &#x60;1&#x60; re-reads the network instead of the cache. | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingSourceBidGet

> apiV1AdspacesIdMediaBuyingSourceBidGet(id)

The campaign\&#39;s current bid at the network.

400 &#x60;not_supported&#x60; when the network does not report bids.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingSourceBidGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingSourceBidGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingSourceBidGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingSourceBidPut

> apiV1AdspacesIdMediaBuyingSourceBidPut(id, apiV1AdspacesIdMediaBuyingSourceBidPutRequest)

Set the campaign\&#39;s bid at the network.

In the network\&#39;s currency and bid unit.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingSourceBidPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // ApiV1AdspacesIdMediaBuyingSourceBidPutRequest
    apiV1AdspacesIdMediaBuyingSourceBidPutRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingSourceBidPutOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingSourceBidPut(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingSourceBidPutRequest** | [ApiV1AdspacesIdMediaBuyingSourceBidPutRequest](ApiV1AdspacesIdMediaBuyingSourceBidPutRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingSourceRetryPost

> apiV1AdspacesIdMediaBuyingSourceRetryPost(id, body)

Retry the connection to the source campaign.

Clears a failed pause/activate state so goadserver tries the network again.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingSourceRetryPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1AdspacesIdMediaBuyingSourceRetryPostRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingSourceRetryPost(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingTargetingGet

> apiV1AdspacesIdMediaBuyingTargetingGet(id)

The campaign\&#39;s placement targeting (all, or an allow-list).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingTargetingGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingTargetingGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingTargetingGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingTargetingPut

> apiV1AdspacesIdMediaBuyingTargetingPut(id, apiV1AdspacesIdMediaBuyingTargetingPutRequest)

Switch to / edit the allow-list, or back to all placements.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingTargetingPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // ApiV1AdspacesIdMediaBuyingTargetingPutRequest
    apiV1AdspacesIdMediaBuyingTargetingPutRequest: ...,
  } satisfies ApiV1AdspacesIdMediaBuyingTargetingPutOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingTargetingPut(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **apiV1AdspacesIdMediaBuyingTargetingPutRequest** | [ApiV1AdspacesIdMediaBuyingTargetingPutRequest](ApiV1AdspacesIdMediaBuyingTargetingPutRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingTargetingSuggestGet

> apiV1AdspacesIdMediaBuyingTargetingSuggestGet(id)

Suggested allow-list: the profitable placements of the policy window.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingTargetingSuggestGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingTargetingSuggestGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingTargetingSuggestGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingTrackRecordGet

> apiV1AdspacesIdMediaBuyingTrackRecordGet(id)

Track record: did each change do what it was meant to?

Every change of the last 60 days (blocks, bid per placement, campaign bid, network budget, segment exclusions…) measured on the money: the policy window of full days before the change against the same after it, per lever and actor (&#x60;policy&#x60; / &#x60;agent&#x60; / &#x60;manual&#x60;). Per lever: proposed / approved / rejected / expired / auto / failed counts, measured right / wrong (&#x60;no_data&#x60; under 0.05 cost a side, &#x60;pending&#x60; until the after-window is complete, &#x60;not_judged&#x60; for quality blocks), &#x60;right_pct&#x60;, &#x60;approval_pct&#x60;, &#x60;profit_per_day&#x60; (blocks: the loss stopped per day) and &#x60;ready_for_auto&#x60; (&gt;&#x3D; 10 measured and &gt;&#x3D; 70% right — a hint, no mode is switched); the 20 newest measured actions with their before / after. Cached 15 minutes.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingTrackRecordGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
  } satisfies ApiV1AdspacesIdMediaBuyingTrackRecordGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingTrackRecordGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdMediaBuyingZonesGet

> apiV1AdspacesIdMediaBuyingZonesGet(id, days, revenueMetric)

Source-zone report: revenue against cost per placement.

Per source zone (placement) of the connected campaign over the policy window: cost (exact from the network or estimated), revenue, margin, CPA, traffic, delivery, off-geo share, confidence fields and whether it is blocked.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdMediaBuyingZonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The ad space id.
    id: 56,
    // number | Days to report (1-30); default the policy window. (optional)
    days: 56,
    // string | `paid` or `earned`; default the policy\'s. (optional)
    revenueMetric: revenueMetric_example,
  } satisfies ApiV1AdspacesIdMediaBuyingZonesGetRequest;

  try {
    const data = await api.apiV1AdspacesIdMediaBuyingZonesGet(body);
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
| **id** | `number` | The ad space id. | [Defaults to `undefined`] |
| **days** | `number` | Days to report (1-30); default the policy window. | [Optional] [Defaults to `undefined`] |
| **revenueMetric** | `string` | &#x60;paid&#x60; or &#x60;earned&#x60;; default the policy\&#39;s. | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1MediaBuyingPortfolioGet

> apiV1MediaBuyingPortfolioGet(days)

Every buy side by side: margin against target, spend, proposals, the agent\&#39;s latest summary.

One row per ad zone or tracking link connected to a network campaign (&#x60;kind&#x60; adzone | tracking_link): network and campaign, the linked campaigns\&#39; countries, the policy\&#39;s modes and target, revenue / network cost / profit / margin over the last &#x60;days&#x60; full days, cost per day, today\&#39;s revenue and cost, &#x60;status&#x60; (losing | below_target | on_target | no_data — worst first), open proposals, last action and the agent\&#39;s latest summary; plus &#x60;totals&#x60;. Database only, no network call. A key pinned to ad spaces or sites sees only those.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1MediaBuyingPortfolioGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | Full days, ending yesterday. (optional)
    days: 56,
  } satisfies ApiV1MediaBuyingPortfolioGetRequest;

  try {
    const data = await api.apiV1MediaBuyingPortfolioGet(body);
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
| **days** | `number` | Full days, ending yesterday. | [Optional] [Defaults to `7`] |

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
| **200** | OK — &#x60;data&#x60; {days, from, to, currency, buys[], totals, generated}. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Media buying is not available on this account. |  -  |
| **422** | &#x60;days&#x60; outside 1-90. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerMediaBuyingPortfolioGet

> apiV1TrackerMediaBuyingPortfolioGet(days)

Every buy side by side (tracker accounts — the same overview): margin against target, spend, proposals, the agent\&#39;s latest summary.

One row per ad zone or tracking link connected to a network campaign (&#x60;kind&#x60; adzone | tracking_link): network and campaign, the linked campaigns\&#39; countries, the policy\&#39;s modes and target, revenue / network cost / profit / margin over the last &#x60;days&#x60; full days, cost per day, today\&#39;s revenue and cost, &#x60;status&#x60; (losing | below_target | on_target | no_data — worst first), open proposals, last action and the agent\&#39;s latest summary; plus &#x60;totals&#x60;. Database only, no network call. A key pinned to ad spaces or sites sees only those.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerMediaBuyingPortfolioGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | Full days, ending yesterday. (optional)
    days: 56,
  } satisfies ApiV1TrackerMediaBuyingPortfolioGetRequest;

  try {
    const data = await api.apiV1TrackerMediaBuyingPortfolioGet(body);
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
| **days** | `number` | Full days, ending yesterday. | [Optional] [Defaults to `7`] |

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
| **200** | OK — &#x60;data&#x60; {days, from, to, currency, buys[], totals, generated}. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Media buying is not available on this account. |  -  |
| **422** | &#x60;days&#x60; outside 1-90. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost

> apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost(id, actionId, apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest)

Approve or reject a proposal.

Approving carries the proposal out at the network (a block, a bid, a budget, a segment exclusion). Approving an &#x60;expand_country&#x60; proposal (ad zones only) duplicates the ad zone — linked campaigns, own ads, settings, buying policy — and launches its own network campaign for that one country at the proposed bid and test budget, with the source zone\&#39;s quality blocks as its blacklist; answers &#x60;{id, action, status, zone_id, new_spaceid, launch}&#x60;; a failure removes the duplicate again (422).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // number | The proposal id from the activity log.
    actionId: 56,
    // ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest
    apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **actionId** | `number` | The proposal id from the activity log. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest** | [ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest](ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingActionsGet

> apiV1TrackerTrackingLinksIdMediaBuyingActionsGet(id, status, actor, action, zone, from, to, limit, format)

Activity log: every block, bid, budget and other change, and open proposals.

Newest first. A &#x60;bid_change&#x60; on a network with a bid per country carries &#x60;metrics.countries&#x60; [{country, pct, old, new, margin, cost, revenue}].

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // string | `proposed` | `applied` | `rejected` | `failed` | `expired`. (optional)
    status: status_example,
    // string | `policy` | `agent` | `advertiser` | `manual` | `inherited`. (optional)
    actor: actor_example,
    // string | e.g. `block`, `unblock`, `zone_bid`, `bid_change`, `net_budget`, `exclude_segment`, `expand_country`, `ip_block`, `report`. (optional)
    action: action_example,
    // string | One source zone id. (optional)
    zone: zone_example,
    // string | YYYY-MM-DD. (optional)
    from: from_example,
    // string | YYYY-MM-DD. (optional)
    to: to_example,
    // number | 1-1000, default 200. (optional)
    limit: 56,
    // string | `csv` for a CSV download (up to 5000 rows). (optional)
    format: format_example,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingActionsGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingActionsGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **status** | `string` | &#x60;proposed&#x60; | &#x60;applied&#x60; | &#x60;rejected&#x60; | &#x60;failed&#x60; | &#x60;expired&#x60;. | [Optional] [Defaults to `undefined`] |
| **actor** | `string` | &#x60;policy&#x60; | &#x60;agent&#x60; | &#x60;advertiser&#x60; | &#x60;manual&#x60; | &#x60;inherited&#x60;. | [Optional] [Defaults to `undefined`] |
| **action** | `string` | e.g. &#x60;block&#x60;, &#x60;unblock&#x60;, &#x60;zone_bid&#x60;, &#x60;bid_change&#x60;, &#x60;net_budget&#x60;, &#x60;exclude_segment&#x60;, &#x60;expand_country&#x60;, &#x60;ip_block&#x60;, &#x60;report&#x60;. | [Optional] [Defaults to `undefined`] |
| **zone** | `string` | One source zone id. | [Optional] [Defaults to `undefined`] |
| **from** | `string` | YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **to** | `string` | YYYY-MM-DD. | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | 1-1000, default 200. | [Optional] [Defaults to `undefined`] |
| **format** | `string` | &#x60;csv&#x60; for a CSV download (up to 5000 rows). | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost

> apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost(id, body)

Run the buying agent now.

At most once per 10 minutes per zone (429 &#x60;too_soon&#x60;). Refused while the zone is switched off. Returns the new run.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunPostRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet

> apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet(id)

The buying agent\&#39;s recent runs with their summaries and proposals.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingBlockPost

> apiV1TrackerTrackingLinksIdMediaBuyingBlockPost(id, apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest)

Block or unblock one source zone at the network.

Writes the change to the network campaign right away and logs it as a manual action. 502 when the network refuses.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest
    apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingBlockPost(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest** | [ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest](ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingCompareGet

> apiV1TrackerTrackingLinksIdMediaBuyingCompareGet(id, _with, days)

Compare with another buy (A/B, e.g. against a control left to the network\&#39;s own optimiser).

This buy against another of yours over the same days (default: its control — policy &#x60;control_for&#x60; — or the buy it is the control of). Per buy: revenue, network cost, profit, margin, profit and volume per day, and each day\&#39;s figures. Verdict: a paired test on the daily margins — &#x60;a_better&#x60; / &#x60;b_better&#x60; (a &#x3D; this buy) only when the mean difference is at least twice its standard error over at least 5 days with revenue on both sides, else &#x60;too_close&#x60; or &#x60;too_little_data&#x60;; &#x60;note&#x60; says it in a sentence. Database only, no network call.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // number | The other buy (ad zone or tracking link id); default its control. (optional)
    _with: 56,
    // number | Full days, ending yesterday. (optional)
    days: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingCompareGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingCompareGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **_with** | `number` | The other buy (ad zone or tracking link id); default its control. | [Optional] [Defaults to `undefined`] |
| **days** | `number` | Full days, ending yesterday. | [Optional] [Defaults to `14`] |

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
| **200** | OK — &#x60;data&#x60; {days, from, to, currency, a, b, paired_days, margin_diff_pts, margin_diff_se, verdict, note}. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | No buy to compare with, not one of yours, or &#x60;days&#x60; outside 5-90. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingGet

> apiV1TrackerTrackingLinksIdMediaBuyingGet(id)

Overview: the connected network, what it supports, the policy and open proposals.

Everything the panel shows before the report: network and campaign, capability flags (&#x60;supports_*&#x60;; &#x60;supports_country_bids&#x60; &#x3D; the campaign bid is an absolute bid per country, judged and moved per country), the URL suffix that captures the source zone id (&#x60;capture&#x60;), the stored &#x60;policy&#x60;, &#x60;pending_proposals&#x60;, the source campaign state and &#x60;owner_gets_report&#x60;. 404 when the tracking link is not connected to an external network campaign.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingIpsGet

> apiV1TrackerTrackingLinksIdMediaBuyingIpsGet(id)

The IP preblock list: ranges on the network\&#39;s exclusion list and proposals.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingIpsGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingIpsGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingIpsPost

> apiV1TrackerTrackingLinksIdMediaBuyingIpsPost(id, apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest)

Change the IP preblock list.

&#x60;add&#x60; blocks the given ranges now, &#x60;approve&#x60; / &#x60;reject&#x60; decide proposals, &#x60;remove&#x60; takes ranges off, &#x60;refresh&#x60; builds the list now (no &#x60;cidrs&#x60;).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest
    apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingIpsPost(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest** | [ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest](ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet

> apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet(id)

The campaign\&#39;s daily budget at the network.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut

> apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut(id, mediaBuyingPolicy)

Save the buying policy (any subset of its fields).

Fields left out keep their stored value. Returns the stored, normalized policy.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // MediaBuyingPolicy
    mediaBuyingPolicy: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingPolicyPutRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **mediaBuyingPolicy** | [MediaBuyingPolicy](MediaBuyingPolicy.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet

> apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet(id, preset)

Suggested policy from the zone\&#39;s own traffic, with a reason per field.

Nothing is saved. &#x60;data.policy&#x60; is the full suggested policy; &#x60;data.suggestions&#x60; lists &#x60;{field, value, why}&#x60;; with &#x60;preset&#x60; the preset\&#39;s own changes follow, each with its reason.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // 'conservative' | 'balanced' | 'aggressive' | On top of the suggestion: conservative (every lever proposes, 95% certainty, twice the minimum cost and traffic, 5% bid steps, at most 20 changes a day), balanced (the suggestion as it is) or aggressive (placement blocks, bids per placement and segment exclusions in auto, the agent in auto, 80% certainty, 15% bid steps). No preset touches the network budget, the campaign bid or the IP preblock. Unknown value: 422. (optional)
    preset: preset_example,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **preset** | `conservative`, `balanced`, `aggressive` | On top of the suggestion: conservative (every lever proposes, 95% certainty, twice the minimum cost and traffic, 5% bid steps, at most 20 changes a day), balanced (the suggestion as it is) or aggressive (placement blocks, bids per placement and segment exclusions in auto, the agent in auto, 80% certainty, 15% bid steps). No preset touches the network budget, the campaign bid or the IP preblock. Unknown value: 422. | [Optional] [Defaults to `undefined`] [Enum: conservative, balanced, aggressive] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingReportPost

> apiV1TrackerTrackingLinksIdMediaBuyingReportPost(id, apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest)

Send the media buying report now.

The same report the daily / weekly schedule sends: to the admins\&#39; notification event and, where the owner runs the buy (admanager, tracking links), the owner\&#39;s email and the &#x60;media_buying.report&#x60; event. Returns the report and where it went.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingReportPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest
    apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingReportPostOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingReportPost(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest** | [ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest](ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet

> apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet(id, dim, refresh)

Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.

&#x60;data.cost_basis&#x60;: &#x60;network&#x60; (country / os / hour: the network\&#39;s exact cost per segment; 400 &#x60;not_supported&#x60; when the network does not report it), &#x60;daily&#x60; (weekday: the network\&#39;s cost per day over 28 days, keys 1 &#x3D; Monday … 7 &#x3D; Sunday, &#x60;days&#x60; per row &#x3D; how many of that day were charged; judged from 3) or &#x60;estimated&#x60; (browser / region / carrier / language: the period\&#39;s cost split by each value\&#39;s share of the traffic, &#x60;cost_estimated: true&#x60;; a candidate needs twice &#x60;segment_min_spend&#x60;). On ExoClick browser and language are &#x60;network&#x60; (its own cost per value); a row keyed &#x60;n:&lt;name&gt;&#x60; is cost for a value our stats do not have and is never a candidate. The weekday and estimated dimensions work on every network and are always proposals (never written by &#x60;segment_mode&#x60; auto); approving a browser or language exclusion on ExoClick or TrafficStars writes it there (&#x60;writable: true&#x60;; TrafficStars only takes include lists, so it is refused on a campaign that targets every browser / language), every other one is applied by hand.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // string | `country` (default where the network reports cost per segment) | `os` | `hour` | `weekday` (default otherwise) | `browser` | `region` | `carrier` | `language`. The overview\'s `segment_dims` lists the ones this zone has. (optional)
    dim: dim_example,
    // string | `1` re-reads the network instead of the cache. (optional)
    refresh: refresh_example,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingSegmentsGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **dim** | `string` | &#x60;country&#x60; (default where the network reports cost per segment) | &#x60;os&#x60; | &#x60;hour&#x60; | &#x60;weekday&#x60; (default otherwise) | &#x60;browser&#x60; | &#x60;region&#x60; | &#x60;carrier&#x60; | &#x60;language&#x60;. The overview\&#39;s &#x60;segment_dims&#x60; lists the ones this zone has. | [Optional] [Defaults to `undefined`] |
| **refresh** | `string` | &#x60;1&#x60; re-reads the network instead of the cache. | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet

> apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet(id)

The campaign\&#39;s current bid at the network.

400 &#x60;not_supported&#x60; when the network does not report bids.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut

> apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut(id, apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest)

Set the campaign\&#39;s bid at the network.

In the network\&#39;s currency and bid unit.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest
    apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest** | [ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest](ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost

> apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost(id, body)

Retry the connection to the source campaign.

Clears a failed pause/activate state so goadserver tries the network again.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // object (optional)
    body: Object,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPostRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **body** | `object` |  | [Optional] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet

> apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet(id)

The campaign\&#39;s placement targeting (all, or an allow-list).

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingTargetingGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut

> apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut(id, apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest)

Switch to / edit the allow-list, or back to all placements.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest
    apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest: ...,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutOperationRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **apiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest** | [ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest](ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest.md) |  | |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |
| **422** | Validation, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet

> apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet(id)

Suggested allow-list: the profitable placements of the policy window.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet

> apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet(id)

Track record: did each change do what it was meant to?

Every change of the last 60 days (blocks, bid per placement, campaign bid, network budget, segment exclusions…) measured on the money: the policy window of full days before the change against the same after it, per lever and actor (&#x60;policy&#x60; / &#x60;agent&#x60; / &#x60;manual&#x60;). Per lever: proposed / approved / rejected / expired / auto / failed counts, measured right / wrong (&#x60;no_data&#x60; under 0.05 cost a side, &#x60;pending&#x60; until the after-window is complete, &#x60;not_judged&#x60; for quality blocks), &#x60;right_pct&#x60;, &#x60;approval_pct&#x60;, &#x60;profit_per_day&#x60; (blocks: the loss stopped per day) and &#x60;ready_for_auto&#x60; (&gt;&#x3D; 10 measured and &gt;&#x3D; 70% right — a hint, no mode is switched); the 20 newest measured actions with their before / after. Cached 15 minutes.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1TrackerTrackingLinksIdMediaBuyingZonesGet

> apiV1TrackerTrackingLinksIdMediaBuyingZonesGet(id, days, revenueMetric)

Source-zone report: revenue against cost per placement.

Per source zone (placement) of the connected campaign over the policy window: cost (exact from the network or estimated), revenue, margin, CPA, traffic, delivery, off-geo share, confidence fields and whether it is blocked.

### Example

```ts
import {
  Configuration,
  AgenticMediaBuyingApi,
} from 'goadserver-sdk';
import type { ApiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AgenticMediaBuyingApi(config);

  const body = {
    // number | The tracking link id.
    id: 56,
    // number | Days to report (1-30); default the policy window. (optional)
    days: 56,
    // string | `paid` or `earned`; default the policy\'s. (optional)
    revenueMetric: revenueMetric_example,
  } satisfies ApiV1TrackerTrackingLinksIdMediaBuyingZonesGetRequest;

  try {
    const data = await api.apiV1TrackerTrackingLinksIdMediaBuyingZonesGet(body);
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
| **id** | `number` | The tracking link id. | [Defaults to `undefined`] |
| **days** | `number` | Days to report (1-30); default the policy window. | [Optional] [Defaults to `undefined`] |
| **revenueMetric** | `string` | &#x60;paid&#x60; or &#x60;earned&#x60;; default the policy\&#39;s. | [Optional] [Defaults to `undefined`] |

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
| **200** | OK — &#x60;data&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found: not yours, not connected to a network campaign, or media buying is not available on this account. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

