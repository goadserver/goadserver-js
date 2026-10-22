# AdspacesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AdspacesAddMultiplePost**](AdspacesApi.md#apiv1adspacesaddmultiplepostoperation) | **POST** /api/v1/adspaces/add-multiple | Create several ad zones of one type on one site. |
| [**apiV1AdspacesExportCodesGet**](AdspacesApi.md#apiv1adspacesexportcodesget) | **GET** /api/v1/adspaces/export-codes | Embed codes for many ad zones at once, grouped by site. |
| [**apiV1AdspacesGet**](AdspacesApi.md#apiv1adspacesget) | **GET** /api/v1/adspaces | List ad zones owned by the caller. |
| [**apiV1AdspacesIdBlockedAdvertisersGet**](AdspacesApi.md#apiv1adspacesidblockedadvertisersget) | **GET** /api/v1/adspaces/{id}/blocked-advertisers | Advertiser block filters that exclude this ad zone. |
| [**apiV1AdspacesIdChildrenGet**](AdspacesApi.md#apiv1adspacesidchildrenget) | **GET** /api/v1/adspaces/{id}/children | List an ad zone\&#39;s child zones. |
| [**apiV1AdspacesIdClonePost**](AdspacesApi.md#apiv1adspacesidclonepostoperation) | **POST** /api/v1/adspaces/{id}/clone | Duplicate an ad zone. |
| [**apiV1AdspacesIdCodeGet**](AdspacesApi.md#apiv1adspacesidcodeget) | **GET** /api/v1/adspaces/{id}/code | Embed-code snippets for an adspace. |
| [**apiV1AdspacesIdDelete**](AdspacesApi.md#apiv1adspacesiddelete) | **DELETE** /api/v1/adspaces/{id} | Soft-delete an adspace. |
| [**apiV1AdspacesIdGet**](AdspacesApi.md#apiv1adspacesidget) | **GET** /api/v1/adspaces/{id} | Get a single adspace. |
| [**apiV1AdspacesIdNetworkBindingDelete**](AdspacesApi.md#apiv1adspacesidnetworkbindingdelete) | **DELETE** /api/v1/adspaces/{id}/network-binding | Remove the zone\&#39;s network binding. |
| [**apiV1AdspacesIdNetworkBindingPut**](AdspacesApi.md#apiv1adspacesidnetworkbindingputoperation) | **PUT** /api/v1/adspaces/{id}/network-binding | Bind the zone to a campaign on an external ad network (the Source tab). |
| [**apiV1AdspacesIdOwnAdsAdIdDelete**](AdspacesApi.md#apiv1adspacesidownadsadiddelete) | **DELETE** /api/v1/adspaces/{id}/own-ads/{adId} | Delete an own ad. |
| [**apiV1AdspacesIdOwnAdsAdIdGet**](AdspacesApi.md#apiv1adspacesidownadsadidget) | **GET** /api/v1/adspaces/{id}/own-ads/{adId} | Get one own ad. |
| [**apiV1AdspacesIdOwnAdsAdIdPut**](AdspacesApi.md#apiv1adspacesidownadsadidput) | **PUT** /api/v1/adspaces/{id}/own-ads/{adId} | Update an own ad. |
| [**apiV1AdspacesIdOwnAdsAdIdTogglePut**](AdspacesApi.md#apiv1adspacesidownadsadidtoggleput) | **PUT** /api/v1/adspaces/{id}/own-ads/{adId}/toggle | Switch an own ad on/off. |
| [**apiV1AdspacesIdOwnAdsGet**](AdspacesApi.md#apiv1adspacesidownadsget) | **GET** /api/v1/adspaces/{id}/own-ads | List the zone\&#39;s own (house / fallback) ads. |
| [**apiV1AdspacesIdOwnAdsMassActionPost**](AdspacesApi.md#apiv1adspacesidownadsmassactionpostoperation) | **POST** /api/v1/adspaces/{id}/own-ads/mass-action | Activate, deactivate or delete several own ads. |
| [**apiV1AdspacesIdOwnAdsPost**](AdspacesApi.md#apiv1adspacesidownadspost) | **POST** /api/v1/adspaces/{id}/own-ads | Add an own ad. |
| [**apiV1AdspacesIdPatch**](AdspacesApi.md#apiv1adspacesidpatch) | **PATCH** /api/v1/adspaces/{id} | Update an existing adspace. |
| [**apiV1AdspacesIdPricesTypeGet**](AdspacesApi.md#apiv1adspacesidpricestypeget) | **GET** /api/v1/adspaces/{id}/prices/{type} | Minimum (floor) prices per country for one device type. |
| [**apiV1AdspacesIdPricesTypePost**](AdspacesApi.md#apiv1adspacesidpricestypepostoperation) | **POST** /api/v1/adspaces/{id}/prices/{type} | Replace the floor prices for one device type. |
| [**apiV1AdspacesIdRecoverPost**](AdspacesApi.md#apiv1adspacesidrecoverpost) | **POST** /api/v1/adspaces/{id}/recover | Reverse a soft-delete on an adspace. |
| [**apiV1AdspacesIdWlCampaignsGet**](AdspacesApi.md#apiv1adspacesidwlcampaignsget) | **GET** /api/v1/adspaces/{id}/wl-campaigns | Campaigns that can be whitelisted on this zone, and the current whitelist. |
| [**apiV1AdspacesIdWlCampaignsPut**](AdspacesApi.md#apiv1adspacesidwlcampaignsputoperation) | **PUT** /api/v1/adspaces/{id}/wl-campaigns | Replace the zone\&#39;s whitelisted campaigns. |
| [**apiV1AdspacesMassDeletePost**](AdspacesApi.md#apiv1adspacesmassdeletepostoperation) | **POST** /api/v1/adspaces/mass-delete | Soft-delete several ad zones. |
| [**apiV1AdspacesMassRecoverPost**](AdspacesApi.md#apiv1adspacesmassrecoverpostoperation) | **POST** /api/v1/adspaces/mass-recover | Recover several soft-deleted ad zones. |
| [**apiV1AdspacesTemplatesGet**](AdspacesApi.md#apiv1adspacestemplatesget) | **GET** /api/v1/adspaces/templates | List your saved ad zone templates. |
| [**apiV1AdspacesTemplatesIdDelete**](AdspacesApi.md#apiv1adspacestemplatesiddelete) | **DELETE** /api/v1/adspaces/templates/{id} | Delete a template. |
| [**apiV1AdspacesTemplatesIdPut**](AdspacesApi.md#apiv1adspacestemplatesidputoperation) | **PUT** /api/v1/adspaces/templates/{id} | Replace a template\&#39;s data. |
| [**apiV1AdspacesTemplatesPost**](AdspacesApi.md#apiv1adspacestemplatespostoperation) | **POST** /api/v1/adspaces/templates | Save an ad zone template. |
| [**apiV1AdspacesTypePost**](AdspacesApi.md#apiv1adspacestypepost) | **POST** /api/v1/adspaces/{type} | Create a new adspace. |
| [**apiV1AdspacesTypeSchemaGet**](AdspacesApi.md#apiv1adspacestypeschemaget) | **GET** /api/v1/adspaces/{type}/_schema | Field metadata for create/update of one adspace type. |



## apiV1AdspacesAddMultiplePost

> Array&lt;number&gt; apiV1AdspacesAddMultiplePost(apiV1AdspacesAddMultiplePostRequest)

Create several ad zones of one type on one site.

The panel\&#39;s \&quot;Add multiple\&quot;. Each item is created exactly as &#x60;POST /api/v1/adspaces/{type}&#x60; would create it (same validation, same defaults), with the type\&#39;s default settings block and, for banner types, &#x60;sizeid&#x60; as the banner size. Up to 100 items.  Items are created in order. The first refusal stops the run: the response is that item\&#39;s error (e.g. 422 &#x60;validation_error&#x60; for a duplicate name) plus &#x60;failed_item&#x60; (index into &#x60;items&#x60;) and &#x60;created_ids&#x60; (what was created before it). Items with an empty name are skipped.  The type must be active, its module on and its right held; for an API key it must also be exposed to the API (&#x60;in_api&#x60;) — same gate and errors as &#x60;POST /api/v1/adspaces/{type}&#x60; (404 &#x60;unknown_adspace_type&#x60;, 403 &#x60;module_disabled&#x60; / &#x60;missing_right&#x60;). Keys pinned to &#x60;adzone_ids&#x60; / &#x60;site_ids&#x60; are refused. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesAddMultiplePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // ApiV1AdspacesAddMultiplePostRequest
    apiV1AdspacesAddMultiplePostRequest: {"siteid":30067,"adzone_typeid":2,"sizeid":1,"items":[{"name":"Header 728x90"},{"name":"Footer 728x90"}]},
  } satisfies ApiV1AdspacesAddMultiplePostOperationRequest;

  try {
    const data = await api.apiV1AdspacesAddMultiplePost(body);
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
| **apiV1AdspacesAddMultiplePostRequest** | [ApiV1AdspacesAddMultiplePostRequest](ApiV1AdspacesAddMultiplePostRequest.md) |  | |

### Return type

**Array<number>**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ids of the created zones, in item order. |  -  |
| **400** | &#x60;invalid_request&#x60; (siteid or items missing) or &#x60;too_many_items&#x60; (more than 100). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Site not found, or &#x60;unknown_adspace_type&#x60;. |  -  |
| **422** | &#x60;unknown_fields&#x60; (API keys: a body key this endpoint does not read), or an item\&#39;s &#x60;validation_error&#x60; with &#x60;failed_item&#x60; and &#x60;created_ids&#x60; added.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesExportCodesGet

> Array&lt;ApiV1AdspacesExportCodesGet200ResponseInner&gt; apiV1AdspacesExportCodesGet(siteid, all, sids)

Embed codes for many ad zones at once, grouped by site.

The panel\&#39;s bulk \&quot;Export codes\&quot;. Returns one entry per site with the site\&#39;s controller tag (&#x60;ctrl_js&#x60;, paste once per page) and the per-zone snippets. Without &#x60;sids&#x60; (or with &#x60;all&#x3D;1&#x60;) every live zone of the account is included; narrow with &#x60;siteid&#x60; or a &#x60;sids&#x60; list. For one zone use &#x60;GET /api/v1/adspaces/{id}/code&#x60;.  Keys pinned to &#x60;adzone_ids&#x60; / &#x60;site_ids&#x60; are refused (&#x60;403 forbidden_resource&#x60;) — the export spans the whole account. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesExportCodesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // number | Only this site\'s zones. (optional)
    siteid: 56,
    // 0 | 1 | 1 = every zone; 0 = only the zones in `sids`. (optional)
    all: 56,
    // string | Comma-separated ad zone ids (used with all=0). (optional)
    sids: 11865993,11865986,
  } satisfies ApiV1AdspacesExportCodesGetRequest;

  try {
    const data = await api.apiV1AdspacesExportCodesGet(body);
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
| **siteid** | `number` | Only this site\&#39;s zones. | [Optional] [Defaults to `undefined`] |
| **all** | `0`, `1` | 1 &#x3D; every zone; 0 &#x3D; only the zones in &#x60;sids&#x60;. | [Optional] [Defaults to `1`] [Enum: 0, 1] |
| **sids** | `string` | Comma-separated ad zone ids (used with all&#x3D;0). | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;ApiV1AdspacesExportCodesGet200ResponseInner&gt;**](ApiV1AdspacesExportCodesGet200ResponseInner.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Codes grouped by site. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesGet

> ApiV1AdspacesGet200Response apiV1AdspacesGet(siteId, state, type, parentId, search, sort, page, perPage)

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
    // 'live' | 'deleted' | 'all' | `deleted` lists soft-deleted zones (for recover / mass-recover). (optional)
    state: state_example,
    // string | Adspace type key (e.g. `popads`) or numeric adzone_typeid. Unknown key → 422. (optional)
    type: type_example,
    // number | Children of this zone; 0 = top-level zones only. (optional)
    parentId: 56,
    // string | Substring of the name, or an exact zone id. (optional)
    search: search_example,
    // 'id' | '-id' | 'name' | '-name' | 'date_added' | '-date_added' | 'time_changed' | '-time_changed' (optional)
    sort: sort_example,
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
| **state** | `live`, `deleted`, `all` | &#x60;deleted&#x60; lists soft-deleted zones (for recover / mass-recover). | [Optional] [Defaults to `&#39;live&#39;`] [Enum: live, deleted, all] |
| **type** | `string` | Adspace type key (e.g. &#x60;popads&#x60;) or numeric adzone_typeid. Unknown key → 422. | [Optional] [Defaults to `undefined`] |
| **parentId** | `number` | Children of this zone; 0 &#x3D; top-level zones only. | [Optional] [Defaults to `undefined`] |
| **search** | `string` | Substring of the name, or an exact zone id. | [Optional] [Defaults to `undefined`] |
| **sort** | `id`, `-id`, `name`, `-name`, `date_added`, `-date_added`, `time_changed`, `-time_changed` |  | [Optional] [Defaults to `&#39;-id&#39;`] [Enum: id, -id, name, -name, date_added, -date_added, time_changed, -time_changed] |
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


## apiV1AdspacesIdBlockedAdvertisersGet

> apiV1AdspacesIdBlockedAdvertisersGet(id)

Advertiser block filters that exclude this ad zone.

Read-only. The advertiser-side block lists (not hidden ones) that name this zone. &#x60;campaignids&#x60; is the comma-separated campaigns the filter applies to. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdBlockedAdvertisersGetRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesIdBlockedAdvertisersGetRequest;

  try {
    const data = await api.apiV1AdspacesIdBlockedAdvertisersGet(body);
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
| **200** | Filters (empty array when none, or the zone is not yours). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdChildrenGet

> apiV1AdspacesIdChildrenGet(id)

List an ad zone\&#39;s child zones.

Live zones whose &#x60;parentid&#x60; is this zone — the in-video sub-zones under a player zone. Rows are the stored zone records (all &#x60;publisher_adzones&#x60; columns) plus &#x60;website_name&#x60;. Same data as &#x60;GET /api/v1/adspaces?parent_id&#x3D;{id}&#x60; in the list shape. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdChildrenGetRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesIdChildrenGetRequest;

  try {
    const data = await api.apiV1AdspacesIdChildrenGet(body);
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
| **200** | Child zones. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdClonePost

> apiV1AdspacesIdClonePost(id, apiV1AdspacesIdClonePostRequest)

Duplicate an ad zone.

Copies the zone (type, site, settings) under a new name. Options choose what comes along. &#x60;copy_campaigns&#x60; copies the whitelisted campaigns only where the account may manage them (see &#x60;PUT /api/v1/adspaces/{id}/wl-campaigns&#x60;); otherwise the zone is still duplicated and &#x60;campaigns_skipped&#x60; is true. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdClonePostOperationRequest } from 'goadserver-sdk';

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
    // ApiV1AdspacesIdClonePostRequest
    apiV1AdspacesIdClonePostRequest: {"name":"Homepage 300x250 (copy)","copy_campaigns":true,"copy_own_ads":true,"copy_settings":true},
  } satisfies ApiV1AdspacesIdClonePostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdClonePost(body);
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
| **apiV1AdspacesIdClonePostRequest** | [ApiV1AdspacesIdClonePostRequest](ApiV1AdspacesIdClonePostRequest.md) |  | |

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
| **201** | Duplicated. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |
| **422** | &#x60;validation_error&#x60; (name required) or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdCodeGet

> ApiV1AdspacesIdCodeGet200Response apiV1AdspacesIdCodeGet(id, layout)

Embed-code snippets for an adspace.

Returns the JS embed snippets a publisher pastes into their site — the natural last step of the create flow.  Three pieces, all server-rendered with the tenant\&#39;s ad domain, the publisher\&#39;s user id, EaCtrl name, banner dimensions, and per-type plugin call resolved:  - &#x60;site.ctrl_js&#x60; — controller &#x60;&lt;script&gt;&#x60; tag. Paste it once per   page, before the per-zone snippets (typically in &#x60;&lt;head&gt;&#x60;). - &#x60;site.ctrl_js_failover&#x60; — an alternative to &#x60;ctrl_js&#x60;, pasted   instead of it: an inline loader that tries several ad domains in   turn (the zone\&#39;s own, the publisher\&#39;s own, then the network\&#39;s   that are not on a block list) and uses the first one an ad   blocker lets through; it queues the zones\&#39; &#x60;add()&#x60; calls until   the controller is there. Empty when fewer than two usable ad   domains are available. - &#x60;js_code&#x60; — per-zone JavaScript call (wrap in &#x60;&lt;script&gt;&#x60; tags).   This is what goes at each ad slot. - &#x60;ad_tag&#x60; — &#x60;&lt;iframe src&#x3D;\&quot;…\&quot;&gt;&#x60; alternative for callers that   can\&#39;t run JS. - &#x60;alternative&#x60; — no-JS fallback &#x60;&lt;a&gt;&lt;img&gt;&lt;/a&gt;&#x60; snippet.  Native zones (nativeads, type 3) take &#x60;?layout&#x3D;&lt;key&gt;&#x60;: a ready-made design, so a publisher does not have to write the templates. The response then carries the layout\&#39;s &#x60;tpl_body&#x60; / &#x60;tpl_row&#x60; / &#x60;tpl_item&#x60; in &#x60;js_code&#x60; and a &#x60;&lt;style&gt;&#x60; block scoped to the zone (&#x60;#id_&lt;adspace_id&gt;&#x60;) in front of the placement in &#x60;ad_tag&#x60;. Keys: &#x60;default&#x60; (the stock template), &#x60;cards&#x60;, &#x60;list&#x60; (sidebar list), &#x60;tiles&#x60; (image tiles), &#x60;feed&#x60;, &#x60;links&#x60; (text-only sponsored links); the response of a native zone lists them in &#x60;layouts&#x60;. The same layouts are the picker in the panel\&#39;s Code tab. Creator widget zones (creator_widget, type 34) take their own keys: &#x60;default&#x60; (the example template), &#x60;caption&#x60; (avatar and text under the clip), &#x60;overlay&#x60; (text on the clip), &#x60;card&#x60;, &#x60;clip&#x60; (clip only); the template is &#x60;tpl_item&#x60; (the plugin has no body/row templates) and the &#x60;&lt;style&gt;&#x60; block is scoped the same way. An unknown key for the zone\&#39;s type is refused with 422 (&#x60;layout&#x60;); other zone types ignore the parameter.  Banner, native, reel and creator widget zones (types 2, 3, 31, 34) also carry &#x60;amp&#x60;: the code for AMP pages and Web Stories, which cannot run the controller. AMP fetches the ad itself through &#x60;amp-list&#x60; + &#x60;amp-mustache&#x60; from goadserver\&#39;s &#x60;/ampad.go?spaceid&#x3D;&lt;id&gt;&#x60; (JSON, AMP CORS; AMP removed &#x60;amp-ad type&#x3D;\&quot;custom\&quot;&#x60; in 2025). The story code is a sponsored &#x60;&lt;amp-story-page&gt;&#x60; to paste between the story\&#39;s own pages (image ads; a video ad shows its poster). Image and video ads only — HTML / iframe creatives are skipped. Impressions are counted by a 1×1 pixel the template loads when the ad renders.  Resource-pinned keys (&#x60;resource_filter.adzone_ids&#x60; / &#x60;resource_filter.site_ids&#x60;) reject reads outside the allow-list with &#x60;403 forbidden_resource&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdCodeGetRequest } from 'goadserver-sdk';

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
    // 'default' | 'cards' | 'list' | 'tiles' | 'feed' | 'links' | 'caption' | 'overlay' | 'card' | 'clip' | Native (cards…links) and creator widget (caption…clip) zones: ready-made layout to render the code with (see above). (optional)
    layout: layout_example,
  } satisfies ApiV1AdspacesIdCodeGetRequest;

  try {
    const data = await api.apiV1AdspacesIdCodeGet(body);
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
| **layout** | `default`, `cards`, `list`, `tiles`, `feed`, `links`, `caption`, `overlay`, `card`, `clip` | Native (cards…links) and creator widget (caption…clip) zones: ready-made layout to render the code with (see above). | [Optional] [Defaults to `undefined`] [Enum: default, cards, list, tiles, feed, links, caption, overlay, card, clip] |

### Return type

[**ApiV1AdspacesIdCodeGet200Response**](ApiV1AdspacesIdCodeGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Code snippets for the adspace. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Adspace not found or no code generated. |  -  |
| **422** | Unknown layout (field &#x60;layout&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdDelete

> apiV1AdspacesIdDelete(id, confirmSmartZones)

Soft-delete an adspace.

Sets &#x60;is_deleted &#x3D; 1&#x60; — the row is hidden from listings but kept for reporting joins. Undo with &#x60;POST /api/v1/adspaces/{id}/recover&#x60;.  Refused with **409 &#x60;has_flatrate_campaigns&#x60;** while a running or pending flat-rate deal is booked on the zone. A zone with smart zones attached answers **409 &#x60;has_smart_zones&#x60;** (with their count) until you repeat the call with &#x60;?confirm_smart_zones&#x3D;1&#x60;; those smart zones are then closed with the zone and come back on recover. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdDeleteRequest } from 'goadserver-sdk';

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
    // 0 | 1 | 1 = also close the zone\'s smart zones. (optional)
    confirmSmartZones: 56,
  } satisfies ApiV1AdspacesIdDeleteRequest;

  try {
    const data = await api.apiV1AdspacesIdDelete(body);
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
| **confirmSmartZones** | `0`, `1` | 1 &#x3D; also close the zone\&#39;s smart zones. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |

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
| **200** | Deleted. &#x60;smart_zones&#x60; &#x3D; smart zones closed with it. |  -  |
| **409** | &#x60;has_flatrate_campaigns&#x60;, or &#x60;has_smart_zones&#x60; (retry with &#x60;?confirm_smart_zones&#x3D;1&#x60;). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdGet

> Adspace apiV1AdspacesIdGet(id)

Get a single adspace.

Returns the full adspace record. Body shape matches what &#x60;POST /api/v1/adspaces/{type}&#x60; accepts, so a create-then-fetch loop or an update round-trip works without translation:  - Common top-level fields (&#x60;name&#x60;, &#x60;siteid&#x60;, &#x60;autoapprove&#x60;,   &#x60;isvisible&#x60;, …) — matching the create body - &#x60;adspace_type&#x60; — the type config key (e.g. &#x60;bannerads&#x60;) - &#x60;adzone_typeid&#x60; / &#x60;adtype_id&#x60; / &#x60;adsizeid&#x60; — numeric ids - The type-specific settings block hoisted to top level   (e.g. &#x60;banner_settings&#x60;, &#x60;pop_settings&#x60;, &#x60;native_settings&#x60;) - &#x60;json_settings&#x60; — the raw assembled blob for inspection - The Campaigns-tab switches (&#x60;only_wl_campaigns&#x60;,   &#x60;only_tagged_campaigns&#x60;, &#x60;force_wl_targeting&#x60;,   &#x60;skip_rtb_when_wl&#x60;), &#x60;useflatbuys&#x60;, &#x60;parentid&#x60;, &#x60;new_zoneid&#x60;,   and the Source tab\&#39;s &#x60;network_binding&#x60;  Keys pinned to &#x60;adzone_ids&#x60;, or to &#x60;site_ids&#x60; (checked against the zone\&#39;s site), get &#x60;403 forbidden_resource&#x60; for other zones. 

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

[**Adspace**](Adspace.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Adspace. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdNetworkBindingDelete

> apiV1AdspacesIdNetworkBindingDelete(id)

Remove the zone\&#39;s network binding.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdNetworkBindingDeleteRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesIdNetworkBindingDeleteRequest;

  try {
    const data = await api.apiV1AdspacesIdNetworkBindingDelete(body);
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
| **200** | Unbound. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdNetworkBindingPut

> apiV1AdspacesIdNetworkBindingPut(id, apiV1AdspacesIdNetworkBindingPutRequest)

Bind the zone to a campaign on an external ad network (the Source tab).

Records that this zone\&#39;s traffic is bought from a campaign on one of your ad networks (&#x60;GET /api/v1/tracker/ad-networks&#x60;). The network\&#39;s cost import then attributes cost to the zone and, with &#x60;auto_api&#x60;, the campaign is paused/activated through the network\&#39;s API. The current binding is &#x60;network_binding&#x60; on &#x60;GET /api/v1/adspaces/{id}&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdNetworkBindingPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1AdspacesIdNetworkBindingPutRequest
    apiV1AdspacesIdNetworkBindingPutRequest: {"adnetwork_id":77,"adnetwork_campaignid":5512309,"auto_api":true},
  } satisfies ApiV1AdspacesIdNetworkBindingPutOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdNetworkBindingPut(body);
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
| **apiV1AdspacesIdNetworkBindingPutRequest** | [ApiV1AdspacesIdNetworkBindingPutRequest](ApiV1AdspacesIdNetworkBindingPutRequest.md) |  | |

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
| **200** | Bound. |  -  |
| **400** | &#x60;invalid_body&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found, or &#x60;network_not_found&#x60;. |  -  |
| **422** | &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsAdIdDelete

> apiV1AdspacesIdOwnAdsAdIdDelete(id, adId)

Delete an own ad.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsAdIdDeleteRequest } from 'goadserver-sdk';

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
    // number
    adId: 56,
  } satisfies ApiV1AdspacesIdOwnAdsAdIdDeleteRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsAdIdDelete(body);
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
| **adId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Deleted. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsAdIdGet

> apiV1AdspacesIdOwnAdsAdIdGet(id, adId)

Get one own ad.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsAdIdGetRequest } from 'goadserver-sdk';

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
    // number
    adId: 56,
  } satisfies ApiV1AdspacesIdOwnAdsAdIdGetRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsAdIdGet(body);
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
| **adId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | &#x60;{data: &lt;stored record&gt;}&#x60; — same fields as the list rows. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsAdIdPut

> apiV1AdspacesIdOwnAdsAdIdPut(id, adId, ownAdWrite)

Update an own ad.

Same fields as create; send the ones to change.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsAdIdPutRequest } from 'goadserver-sdk';

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
    // number
    adId: 56,
    // OwnAdWrite
    ownAdWrite: ...,
  } satisfies ApiV1AdspacesIdOwnAdsAdIdPutRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsAdIdPut(body);
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
| **adId** | `number` |  | [Defaults to `undefined`] |
| **ownAdWrite** | [OwnAdWrite](OwnAdWrite.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60; (API keys, JSON bodies). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsAdIdTogglePut

> apiV1AdspacesIdOwnAdsAdIdTogglePut(id, adId)

Switch an own ad on/off.

Flips &#x60;isactive&#x60;. No body.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsAdIdTogglePutRequest } from 'goadserver-sdk';

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
    // number
    adId: 56,
  } satisfies ApiV1AdspacesIdOwnAdsAdIdTogglePutRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsAdIdTogglePut(body);
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
| **adId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Toggled. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsGet

> apiV1AdspacesIdOwnAdsGet(id)

List the zone\&#39;s own (house / fallback) ads.

Ads the publisher runs on the zone itself (the panel\&#39;s Own ads tab), served when &#x60;useownbanners&#x60; is on. Rows are the stored records. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsGetRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesIdOwnAdsGetRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsGet(body);
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
| **200** | Own ads. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsMassActionPost

> apiV1AdspacesIdOwnAdsMassActionPost(id, apiV1AdspacesIdOwnAdsMassActionPostRequest)

Activate, deactivate or delete several own ads.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsMassActionPostOperationRequest } from 'goadserver-sdk';

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
    // ApiV1AdspacesIdOwnAdsMassActionPostRequest
    apiV1AdspacesIdOwnAdsMassActionPostRequest: {"action":"deactivate","ids":[3301,3302]},
  } satisfies ApiV1AdspacesIdOwnAdsMassActionPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsMassActionPost(body);
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
| **apiV1AdspacesIdOwnAdsMassActionPostRequest** | [ApiV1AdspacesIdOwnAdsMassActionPostRequest](ApiV1AdspacesIdOwnAdsMassActionPostRequest.md) |  | |

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
| **200** | Done. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; (ids / action) or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdOwnAdsPost

> apiV1AdspacesIdOwnAdsPost(id, ownAdWrite)

Add an own ad.

JSON body, or &#x60;multipart/form-data&#x60; with the same fields plus an image file (max 32 MB form). Unknown-field checking applies to JSON bodies only. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdOwnAdsPostRequest } from 'goadserver-sdk';

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
    // OwnAdWrite
    ownAdWrite: {"title":"House promo","bannertype":1,"bannerurl":"https://example.com/promo","weight":10,"isactive":1,"width":300,"height":250},
  } satisfies ApiV1AdspacesIdOwnAdsPostRequest;

  try {
    const data = await api.apiV1AdspacesIdOwnAdsPost(body);
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
| **ownAdWrite** | [OwnAdWrite](OwnAdWrite.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |
| **413** | &#x60;payload_too_large&#x60;. |  -  |
| **422** | &#x60;validation_error&#x60; (title required, …) or &#x60;unknown_fields&#x60; (API keys, JSON bodies). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdPatch

> ApiV1AdspacesIdPatch200Response apiV1AdspacesIdPatch(id, requestBody)

Update an existing adspace.

Update fields on an existing adspace. Send only the keys you want to change — omitted fields keep their current value. The &#x60;adzone_typeid&#x60; is immutable; once an adspace is created its type cannot be switched.  Use &#x60;GET /api/v1/adspaces/{type}/_schema&#x60; to enumerate the legal field set for the type. The same body shape that creates an adspace works for update.  **Settings blocks merge.** A &#x60;*_settings&#x60; block is merged into the stored one: other blocks are kept, and keys of the block you do not send are kept (one level deep — nested objects such as &#x60;closepop&#x60; or &#x60;css&#x60; are replaced whole). Send a block as &#x60;null&#x60; to remove it. So &#x60;{\&quot;banner_settings\&quot;: {\&quot;sizeid\&quot;: 7}}&#x60; changes only the size.  &#x60;parentid&#x60; must be another live zone of yours (0 detaches); &#x60;siteid&#x60; moves the zone to another of your sites (historical stats stay on the old site; a site-pinned key may only move it within its pin). Whitelisted campaigns are set with &#x60;PUT /api/v1/adspaces/{id}/wl-campaigns&#x60;, floor prices with &#x60;POST /api/v1/adspaces/{id}/prices/{type}&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdPatchRequest } from 'goadserver-sdk';

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
    // { [key: string]: any; }
    requestBody: {"name":"Homepage 300x250 (renamed)","autoapprove":true,"banner_settings":{"sizeid":7}},
  } satisfies ApiV1AdspacesIdPatchRequest;

  try {
    const data = await api.apiV1AdspacesIdPatch(body);
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
| **requestBody** | `{ [key: string]: any; }` |  | |

### Return type

[**ApiV1AdspacesIdPatch200Response**](ApiV1AdspacesIdPatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. &#x60;data&#x60; is the stored adspace after the update (same object as &#x60;GET /api/v1/adspaces/{id}&#x60;). |  -  |
| **400** | &#x60;invalid_id&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |
| **422** | &#x60;validation_error&#x60; — banner size not valid for the type, unknown rating, bad colour in native css, &#x60;parentid&#x60; / &#x60;siteid&#x60; not one of yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdPricesTypeGet

> apiV1AdspacesIdPricesTypeGet(id, type, deviceTypeid)

Minimum (floor) prices per country for one device type.

The panel\&#39;s Prices tab. &#x60;{type}&#x60; &#x3D; &#x60;cpm&#x60; (CPM buys) or &#x60;flatrate&#x60; (flat-rate bookings). Prices are **currency units** (the account\&#39;s currency) per 1000 impressions; country &#x60;\&quot;0\&quot;&#x60; &#x3D; all countries.  Shapes differ by type, as in the panel: &#x60;cpm&#x60; returns an array of &#x60;{country, cpm}&#x60;, &#x60;flatrate&#x60; an object &#x60;{country: price}&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdPricesTypeGetRequest } from 'goadserver-sdk';

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
    // 'cpm' | 'flatrate'
    type: type_example,
    // number | Device type (see /api/v1/lookups/device-types); 0 = all devices. (optional)
    deviceTypeid: 56,
  } satisfies ApiV1AdspacesIdPricesTypeGetRequest;

  try {
    const data = await api.apiV1AdspacesIdPricesTypeGet(body);
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
| **type** | `cpm`, `flatrate` |  | [Defaults to `undefined`] [Enum: cpm, flatrate] |
| **deviceTypeid** | `number` | Device type (see /api/v1/lookups/device-types); 0 &#x3D; all devices. | [Optional] [Defaults to `0`] |

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
| **200** | Prices. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |
| **422** | Invalid &#x60;{type}&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdPricesTypePost

> apiV1AdspacesIdPricesTypePost(id, type, apiV1AdspacesIdPricesTypePostRequest)

Replace the floor prices for one device type.

Replaces every price of this zone + &#x60;{type}&#x60; + &#x60;device_typeid&#x60; with &#x60;cpm_price&#x60; (send &#x60;[]&#x60; to clear). Prices in **currency units** per 1000 impressions (flat-rate prices are stored in cents internally; the API takes and returns currency units). Country &#x60;\&quot;\&quot;&#x60; or &#x60;\&quot;0\&quot;&#x60; &#x3D; all countries. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdPricesTypePostOperationRequest } from 'goadserver-sdk';

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
    // 'cpm' | 'flatrate'
    type: type_example,
    // ApiV1AdspacesIdPricesTypePostRequest
    apiV1AdspacesIdPricesTypePostRequest: {"device_typeid":0,"cpm_price":[{"country":"0","cpm":0.5},{"country":"US","cpm":1.2}]},
  } satisfies ApiV1AdspacesIdPricesTypePostOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdPricesTypePost(body);
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
| **type** | `cpm`, `flatrate` |  | [Defaults to `undefined`] [Enum: cpm, flatrate] |
| **apiV1AdspacesIdPricesTypePostRequest** | [ApiV1AdspacesIdPricesTypePostRequest](ApiV1AdspacesIdPricesTypePostRequest.md) |  | |

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
| **201** | Saved. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |
| **422** | Invalid &#x60;{type}&#x60;, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdRecoverPost

> apiV1AdspacesIdRecoverPost(id)

Reverse a soft-delete on an adspace.

Sets &#x60;is_deleted &#x3D; 0&#x60; so the adspace appears in listings again, and restores the smart zones that were closed with it. Returns 404 if the adspace doesn\&#39;t exist or isn\&#39;t currently deleted. Find deleted zones with &#x60;GET /api/v1/adspaces?state&#x3D;deleted&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdRecoverPostRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesIdRecoverPostRequest;

  try {
    const data = await api.apiV1AdspacesIdRecoverPost(body);
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
| **200** | Recovered. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found or not deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdWlCampaignsGet

> apiV1AdspacesIdWlCampaignsGet(id)

Campaigns that can be whitelisted on this zone, and the current whitelist.

The panel\&#39;s Campaigns tab. &#x60;data&#x60; lists the RON campaigns of this zone\&#39;s ad type (&#x60;connected&#x60; true for the whitelisted ones, with their &#x60;weight&#x60;); &#x60;connected&#x60; is the stored whitelist &#x60;{campaign_id: weight}&#x60;. &#x60;force_wl_targeting&#x60; and &#x60;skip_rtb_when_wl&#x60; are on &#x60;GET /api/v1/adspaces/{id}&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdWlCampaignsGetRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesIdWlCampaignsGetRequest;

  try {
    const data = await api.apiV1AdspacesIdWlCampaignsGet(body);
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
| **200** | Candidates + current whitelist. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ad zone not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesIdWlCampaignsPut

> apiV1AdspacesIdWlCampaignsPut(id, apiV1AdspacesIdWlCampaignsPutRequest)

Replace the zone\&#39;s whitelisted campaigns.

Replaces the whitelist with &#x60;campaigns&#x60; (send &#x60;[]&#x60; to clear it) and sets the two related switches. Weights are clamped to 0-100. Campaign ids outside your network are dropped. &#x60;force_wl_targeting&#x60; is only stored when at least one campaign remains.  Gated like the panel: the tenant\&#39;s &#x60;connect_campaigns&#x60; module must be on (else **403 &#x60;feature_disabled&#x60;**), and on a non-Ad-Manager tenant only an administrator may manage it (**403 &#x60;forbidden&#x60;**). 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesIdWlCampaignsPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1AdspacesIdWlCampaignsPutRequest
    apiV1AdspacesIdWlCampaignsPutRequest: {"campaigns":[{"id":1201,"weight":60},{"id":1207,"weight":40}],"force_wl_targeting":false,"skip_rtb_when_wl":true},
  } satisfies ApiV1AdspacesIdWlCampaignsPutOperationRequest;

  try {
    const data = await api.apiV1AdspacesIdWlCampaignsPut(body);
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
| **apiV1AdspacesIdWlCampaignsPutRequest** | [ApiV1AdspacesIdWlCampaignsPutRequest](ApiV1AdspacesIdWlCampaignsPutRequest.md) |  | |

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
| **200** | Saved. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | &#x60;missing_scope&#x60;, &#x60;forbidden_resource&#x60;, &#x60;feature_disabled&#x60; or &#x60;forbidden&#x60; (see above). |  -  |
| **404** | Ad zone not found. |  -  |
| **422** | &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesMassDeletePost

> apiV1AdspacesMassDeletePost(apiV1AdspacesMassDeletePostRequest)

Soft-delete several ad zones.

Soft-deletes every listed zone you own (&#x60;is_deleted &#x3D; 1&#x60;); ids that are not yours or already deleted are ignored.  Refused with **409 &#x60;has_flatrate_campaigns&#x60;** when any of them carries a running or pending flat-rate deal. Zones with smart zones attached answer **409 &#x60;has_smart_zones&#x60;** (with the count) until you repeat the call with &#x60;confirm_smart_zones: true&#x60; — the smart zones are then closed with their zone and come back on recover. Recover with &#x60;POST /api/v1/adspaces/mass-recover&#x60; (list deleted zones with &#x60;GET /api/v1/adspaces?state&#x3D;deleted&#x60;).  Keys pinned to &#x60;adzone_ids&#x60; / &#x60;site_ids&#x60; are refused. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesMassDeletePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // ApiV1AdspacesMassDeletePostRequest
    apiV1AdspacesMassDeletePostRequest: {"ids":[11865993,11865986],"confirm_smart_zones":true},
  } satisfies ApiV1AdspacesMassDeletePostOperationRequest;

  try {
    const data = await api.apiV1AdspacesMassDeletePost(body);
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
| **apiV1AdspacesMassDeletePostRequest** | [ApiV1AdspacesMassDeletePostRequest](ApiV1AdspacesMassDeletePostRequest.md) |  | |

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
| **200** | Deleted. &#x60;smart_zones&#x60; &#x3D; smart zones closed with them. |  -  |
| **400** | &#x60;no_ids&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **409** | &#x60;has_flatrate_campaigns&#x60;, or &#x60;has_smart_zones&#x60; (send &#x60;confirm_smart_zones: true&#x60;). |  -  |
| **422** | &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesMassRecoverPost

> apiV1AdspacesMassRecoverPost(apiV1AdspacesMassRecoverPostRequest)

Recover several soft-deleted ad zones.

Reverses &#x60;mass-delete&#x60; / &#x60;DELETE /api/v1/adspaces/{id}&#x60; for every listed zone you own; the smart zones closed with them come back too. Keys pinned to &#x60;adzone_ids&#x60; / &#x60;site_ids&#x60; are refused. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesMassRecoverPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // ApiV1AdspacesMassRecoverPostRequest
    apiV1AdspacesMassRecoverPostRequest: {"ids":[11865993]},
  } satisfies ApiV1AdspacesMassRecoverPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesMassRecoverPost(body);
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
| **apiV1AdspacesMassRecoverPostRequest** | [ApiV1AdspacesMassRecoverPostRequest](ApiV1AdspacesMassRecoverPostRequest.md) |  | |

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
| **200** | Recovered. &#x60;smart_zones&#x60; &#x3D; smart zones restored. |  -  |
| **400** | &#x60;no_ids&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesTemplatesGet

> Array&lt;ApiV1AdspacesTemplatesGet200ResponseInner&gt; apiV1AdspacesTemplatesGet()

List your saved ad zone templates.

Templates are the panel\&#39;s saved \&quot;Add multiple\&quot; presets: a name plus an opaque &#x60;data&#x60; object the panel stores and replays. The server does not interpret &#x60;data&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesTemplatesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  try {
    const data = await api.apiV1AdspacesTemplatesGet();
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

[**Array&lt;ApiV1AdspacesTemplatesGet200ResponseInner&gt;**](ApiV1AdspacesTemplatesGet200ResponseInner.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Templates. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesTemplatesIdDelete

> apiV1AdspacesTemplatesIdDelete(id)

Delete a template.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesTemplatesIdDeleteRequest } from 'goadserver-sdk';

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
  } satisfies ApiV1AdspacesTemplatesIdDeleteRequest;

  try {
    const data = await api.apiV1AdspacesTemplatesIdDelete(body);
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
| **200** | Deleted. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesTemplatesIdPut

> apiV1AdspacesTemplatesIdPut(id, apiV1AdspacesTemplatesIdPutRequest)

Replace a template\&#39;s data.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesTemplatesIdPutOperationRequest } from 'goadserver-sdk';

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
    // ApiV1AdspacesTemplatesIdPutRequest
    apiV1AdspacesTemplatesIdPutRequest: ...,
  } satisfies ApiV1AdspacesTemplatesIdPutOperationRequest;

  try {
    const data = await api.apiV1AdspacesTemplatesIdPut(body);
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
| **apiV1AdspacesTemplatesIdPutRequest** | [ApiV1AdspacesTemplatesIdPutRequest](ApiV1AdspacesTemplatesIdPutRequest.md) |  | |

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
| **200** | Updated. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |
| **422** | &#x60;data is required&#x60;, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesTemplatesPost

> apiV1AdspacesTemplatesPost(apiV1AdspacesTemplatesPostRequest)

Save an ad zone template.

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesTemplatesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // ApiV1AdspacesTemplatesPostRequest
    apiV1AdspacesTemplatesPostRequest: {"name":"Blog layout","data":{"adzone_typeid":2,"sizeid":1,"items":[{"name":"Header"}]}},
  } satisfies ApiV1AdspacesTemplatesPostOperationRequest;

  try {
    const data = await api.apiV1AdspacesTemplatesPost(body);
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
| **apiV1AdspacesTemplatesPostRequest** | [ApiV1AdspacesTemplatesPostRequest](ApiV1AdspacesTemplatesPostRequest.md) |  | |

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
| **201** | Saved. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;name and data are required&#x60;, or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesTypePost

> ApiV1AdspacesIdPatch200Response apiV1AdspacesTypePost(type, adspaceCreate)

Create a new adspace.

Create an adspace of the given &#x60;{type}&#x60;. Required: &#x60;name&#x60; + &#x60;siteid&#x60; (and &#x60;adsizeid&#x60; or &#x60;banner_settings.sizeid&#x60; for banner-flavored types). Everything else has a sensible default.  **Type identity comes from the path, not the body.** The server resolves the &#x60;{type}&#x60; path param to its &#x60;adzone_typeid&#x60; and &#x60;adtype_id&#x60; and injects them server-side — you do **not** need to pass &#x60;adzone_typeid&#x60; or &#x60;adtype_id&#x60; in the body. Any value sent for those keys is overwritten.  The full per-type field list is at &#x60;GET /api/v1/adspaces/{type}/_schema&#x60; — pass that schema\&#39;s body shape here. The type-specific settings go under the body key named in &#x60;settings_block.name&#x60; (e.g. &#x60;banner_settings&#x60;, &#x60;pop_settings&#x60;, &#x60;native_settings&#x60;).  Discovery flow: 1. &#x60;GET /api/v1/lookups/adspace-types&#x60; — find the &#x60;{type}&#x60; keys    the tenant exposes and their per-type &#x60;options&#x60; flags. 2. &#x60;GET /api/v1/sites&#x60; — pick a &#x60;siteid&#x60;. 3. &#x60;GET /api/v1/lookups/banner-sizes&#x60; — pick a banner size when    creating banner-flavored zones. 4. &#x60;GET /api/v1/adspaces/{type}/_schema&#x60; — enumerate all fields. 5. &#x60;POST /api/v1/adspaces/{type}&#x60; with the body.  Resource-pinned keys (&#x60;resource_filter.site_ids&#x60;) reject creates outside the allow-list with &#x60;403 forbidden_resource&#x60;. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesTypePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // 'bannerads' | 'bot_ads' | 'creator_widget' | 'dyn_iframes' | 'email_display' | 'fixim_banner' | 'footer_codes' | 'fullpageads' | 'hardlinks1' | 'hardlinks2' | 'hardlinks3' | 'hardlinks4' | 'hardlinks5' | 'impopup' | 'inpage_video' | 'interstitial_banner' | 'interstitial_native' | 'interstitial_video' | 'interstitialads' | 'invideo_banner' | 'invideo_plugin' | 'mailclicks' | 'native_bar' | 'native_clicks' | 'native_webpush' | 'nativeads' | 'popads' | 'push_clicks' | 'pushads' | 'redirects' | 'reels' | 'screens' | 'search_ads' | 'skinads' | 'smart_links' | 'tabs' | 'textads' | 'video_carousel' | 'videoads' | 'videoslider' | 'web_push'
    type: type_example,
    // AdspaceCreate
    adspaceCreate: ...,
  } satisfies ApiV1AdspacesTypePostRequest;

  try {
    const data = await api.apiV1AdspacesTypePost(body);
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
| **type** | `bannerads`, `bot_ads`, `creator_widget`, `dyn_iframes`, `email_display`, `fixim_banner`, `footer_codes`, `fullpageads`, `hardlinks1`, `hardlinks2`, `hardlinks3`, `hardlinks4`, `hardlinks5`, `impopup`, `inpage_video`, `interstitial_banner`, `interstitial_native`, `interstitial_video`, `interstitialads`, `invideo_banner`, `invideo_plugin`, `mailclicks`, `native_bar`, `native_clicks`, `native_webpush`, `nativeads`, `popads`, `push_clicks`, `pushads`, `redirects`, `reels`, `screens`, `search_ads`, `skinads`, `smart_links`, `tabs`, `textads`, `video_carousel`, `videoads`, `videoslider`, `web_push` |  | [Defaults to `undefined`] [Enum: bannerads, bot_ads, creator_widget, dyn_iframes, email_display, fixim_banner, footer_codes, fullpageads, hardlinks1, hardlinks2, hardlinks3, hardlinks4, hardlinks5, impopup, inpage_video, interstitial_banner, interstitial_native, interstitial_video, interstitialads, invideo_banner, invideo_plugin, mailclicks, native_bar, native_clicks, native_webpush, nativeads, popads, push_clicks, pushads, redirects, reels, screens, search_ads, skinads, smart_links, tabs, textads, video_carousel, videoads, videoslider, web_push] |
| **adspaceCreate** | [AdspaceCreate](AdspaceCreate.md) |  | |

### Return type

[**ApiV1AdspacesIdPatch200Response**](ApiV1AdspacesIdPatch200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created. &#x60;data&#x60; is the stored adspace (same object as &#x60;GET /api/v1/adspaces/{id}&#x60;, so &#x60;data.id&#x60; is the new id). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Adspace type not exposable on this tenant. |  -  |
| **422** | &#x60;validation_error&#x60; (name taken for this site + type, banner size missing/invalid, unknown rating, bad colour, &#x60;parentid&#x60; not yours) or &#x60;invalid_site&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AdspacesTypeSchemaGet

> AdspaceSchema apiV1AdspacesTypeSchemaGet(type)

Field metadata for create/update of one adspace type.

Discovery endpoint mirroring &#x60;GET /api/v1/campaigns/{type}/_schema&#x60;. Returns the canonical list of public field names a &#x60;POST /api/v1/adspaces/{type}&#x60; accepts, with type, required-flag, default value, an example, and a one-line description.  Adspaces are polymorphic — each type carries its own type-specific block (e.g. &#x60;banner_settings&#x60; for &#x60;bannerads&#x60;, &#x60;pop_settings&#x60; for &#x60;popads&#x60;, &#x60;native_settings&#x60; for &#x60;nativeads&#x60;). The &#x60;settings_block&#x60; field of the response describes that block; send it under the body key &#x60;settings_block.name&#x60;.  Use &#x60;GET /api/v1/lookups/adspace-types&#x60; to discover which &#x60;{type}&#x60; values are exposable on the calling tenant. 

### Example

```ts
import {
  Configuration,
  AdspacesApi,
} from 'goadserver-sdk';
import type { ApiV1AdspacesTypeSchemaGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdspacesApi(config);

  const body = {
    // 'bannerads' | 'bot_ads' | 'creator_widget' | 'dyn_iframes' | 'email_display' | 'fixim_banner' | 'footer_codes' | 'fullpageads' | 'hardlinks1' | 'hardlinks2' | 'hardlinks3' | 'hardlinks4' | 'hardlinks5' | 'impopup' | 'inpage_video' | 'interstitial_banner' | 'interstitial_native' | 'interstitial_video' | 'interstitialads' | 'invideo_banner' | 'invideo_plugin' | 'mailclicks' | 'native_bar' | 'native_clicks' | 'native_webpush' | 'nativeads' | 'popads' | 'push_clicks' | 'pushads' | 'redirects' | 'reels' | 'screens' | 'search_ads' | 'skinads' | 'smart_links' | 'tabs' | 'textads' | 'video_carousel' | 'videoads' | 'videoslider' | 'web_push' | Adspace type config key — see `GET /api/v1/lookups/adspace-types`.
    type: type_example,
  } satisfies ApiV1AdspacesTypeSchemaGetRequest;

  try {
    const data = await api.apiV1AdspacesTypeSchemaGet(body);
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
| **type** | `bannerads`, `bot_ads`, `creator_widget`, `dyn_iframes`, `email_display`, `fixim_banner`, `footer_codes`, `fullpageads`, `hardlinks1`, `hardlinks2`, `hardlinks3`, `hardlinks4`, `hardlinks5`, `impopup`, `inpage_video`, `interstitial_banner`, `interstitial_native`, `interstitial_video`, `interstitialads`, `invideo_banner`, `invideo_plugin`, `mailclicks`, `native_bar`, `native_clicks`, `native_webpush`, `nativeads`, `popads`, `push_clicks`, `pushads`, `redirects`, `reels`, `screens`, `search_ads`, `skinads`, `smart_links`, `tabs`, `textads`, `video_carousel`, `videoads`, `videoslider`, `web_push` | Adspace type config key — see &#x60;GET /api/v1/lookups/adspace-types&#x60;. | [Defaults to `undefined`] [Enum: bannerads, bot_ads, creator_widget, dyn_iframes, email_display, fixim_banner, footer_codes, fullpageads, hardlinks1, hardlinks2, hardlinks3, hardlinks4, hardlinks5, impopup, inpage_video, interstitial_banner, interstitial_native, interstitial_video, interstitialads, invideo_banner, invideo_plugin, mailclicks, native_bar, native_clicks, native_webpush, nativeads, popads, push_clicks, pushads, redirects, reels, screens, search_ads, skinads, smart_links, tabs, textads, video_carousel, videoads, videoslider, web_push] |

### Return type

[**AdspaceSchema**](AdspaceSchema.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Schema for the adspace type. |  -  |
| **404** | Type not exposable on this tenant. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

