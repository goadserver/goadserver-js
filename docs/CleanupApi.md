# CleanupApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CleanupAdvertiserArchivedGet**](CleanupApi.md#apiv1cleanupadvertiserarchivedget) | **GET** /api/v1/cleanup/advertiser/archived | Archived advertiser items that can be purged. |
| [**apiV1CleanupAdvertiserExportGet**](CleanupApi.md#apiv1cleanupadvertiserexportget) | **GET** /api/v1/cleanup/advertiser/export | Download the advertiser cleanup candidates. |
| [**apiV1CleanupAdvertiserGet**](CleanupApi.md#apiv1cleanupadvertiserget) | **GET** /api/v1/cleanup/advertiser | List advertiser items that no longer serve. |
| [**apiV1CleanupAdvertiserLinkedGet**](CleanupApi.md#apiv1cleanupadvertiserlinkedget) | **GET** /api/v1/cleanup/advertiser/linked | What still uses advertiser cleanup rows. |
| [**apiV1CleanupAdvertiserPurgePost**](CleanupApi.md#apiv1cleanupadvertiserpurgepost) | **POST** /api/v1/cleanup/advertiser/purge | Purge archived advertiser items for good. |
| [**apiV1CleanupAdvertiserRunsGet**](CleanupApi.md#apiv1cleanupadvertiserrunsget) | **GET** /api/v1/cleanup/advertiser/runs | Recent advertiser cleanup runs. |
| [**apiV1CleanupAdvertiserRunsIdGet**](CleanupApi.md#apiv1cleanupadvertiserrunsidget) | **GET** /api/v1/cleanup/advertiser/runs/{id} | One advertiser cleanup run with its items. |
| [**apiV1CleanupAdvertiserRunsIdUndonePost**](CleanupApi.md#apiv1cleanupadvertiserrunsidundonepost) | **POST** /api/v1/cleanup/advertiser/runs/{id}/undone | Mark a advertiser cleanup run as undone. |
| [**apiV1CleanupAdvertiserRunsPost**](CleanupApi.md#apiv1cleanupadvertiserrunspost) | **POST** /api/v1/cleanup/advertiser/runs | Record a advertiser cleanup run. |
| [**apiV1CleanupAdvertiserSummaryGet**](CleanupApi.md#apiv1cleanupadvertisersummaryget) | **GET** /api/v1/cleanup/advertiser/summary | Count the advertiser cleanup candidates per kind. |
| [**apiV1CleanupPublisherArchivedGet**](CleanupApi.md#apiv1cleanuppublisherarchivedget) | **GET** /api/v1/cleanup/publisher/archived | Archived publisher items that can be purged. |
| [**apiV1CleanupPublisherExportGet**](CleanupApi.md#apiv1cleanuppublisherexportget) | **GET** /api/v1/cleanup/publisher/export | Download the publisher cleanup candidates. |
| [**apiV1CleanupPublisherGet**](CleanupApi.md#apiv1cleanuppublisherget) | **GET** /api/v1/cleanup/publisher | List publisher items that no longer serve. |
| [**apiV1CleanupPublisherLinkedGet**](CleanupApi.md#apiv1cleanuppublisherlinkedget) | **GET** /api/v1/cleanup/publisher/linked | What still uses publisher cleanup rows. |
| [**apiV1CleanupPublisherPurgePost**](CleanupApi.md#apiv1cleanuppublisherpurgepost) | **POST** /api/v1/cleanup/publisher/purge | Purge archived publisher items for good. |
| [**apiV1CleanupPublisherRunsGet**](CleanupApi.md#apiv1cleanuppublisherrunsget) | **GET** /api/v1/cleanup/publisher/runs | Recent publisher cleanup runs. |
| [**apiV1CleanupPublisherRunsIdGet**](CleanupApi.md#apiv1cleanuppublisherrunsidget) | **GET** /api/v1/cleanup/publisher/runs/{id} | One publisher cleanup run with its items. |
| [**apiV1CleanupPublisherRunsIdUndonePost**](CleanupApi.md#apiv1cleanuppublisherrunsidundonepost) | **POST** /api/v1/cleanup/publisher/runs/{id}/undone | Mark a publisher cleanup run as undone. |
| [**apiV1CleanupPublisherRunsPost**](CleanupApi.md#apiv1cleanuppublisherrunspost) | **POST** /api/v1/cleanup/publisher/runs | Record a publisher cleanup run. |
| [**apiV1CleanupPublisherSummaryGet**](CleanupApi.md#apiv1cleanuppublishersummaryget) | **GET** /api/v1/cleanup/publisher/summary | Count the publisher cleanup candidates per kind. |



## apiV1CleanupAdvertiserArchivedGet

> apiV1CleanupAdvertiserArchivedGet()

Archived advertiser items that can be purged.

Per kind the caller may read, how many archived (deleted) items are still restorable, i.e. not purged.

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserArchivedGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupAdvertiserArchivedGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;data&#x60; &#x3D; [{kind, archived}]. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserExportGet

> apiV1CleanupAdvertiserExportGet(format, kinds, inactiveDays, neverServed)

Download the advertiser cleanup candidates.

Every kind the caller may read (or the comma-separated &#x60;kinds&#x60;) with the same filter, as one xlsx workbook with a sheet per kind (default) or one csv where each kind starts with its own header row. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserExportGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // 'xlsx' | 'csv' (optional)
    format: format_example,
    // string | Comma-separated subset of: campaign,ad,creative,creative_pool,url_pool. (optional)
    kinds: kinds_example,
    // number (optional)
    inactiveDays: 56,
    // boolean (optional)
    neverServed: true,
  } satisfies ApiV1CleanupAdvertiserExportGetRequest;

  try {
    const data = await api.apiV1CleanupAdvertiserExportGet(body);
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
| **format** | `xlsx`, `csv` |  | [Optional] [Defaults to `&#39;xlsx&#39;`] [Enum: xlsx, csv] |
| **kinds** | `string` | Comma-separated subset of: campaign,ad,creative,creative_pool,url_pool. | [Optional] [Defaults to `undefined`] |
| **inactiveDays** | `number` |  | [Optional] [Defaults to `90`] |
| **neverServed** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/csv`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The file. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_enum&#x60; for an unknown format or kind. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserGet

> apiV1CleanupAdvertiserGet(kind, inactiveDays, neverServed, search, sort, dir, page, perPage)

List advertiser items that no longer serve.

One kind at a time (&#x60;campaign&#x60;, &#x60;ad&#x60;, &#x60;creative&#x60;, &#x60;creative_pool&#x60;, &#x60;url_pool&#x60; — campaigns and ads need &#x60;campaigns.read&#x60;, the rest &#x60;creatives.read&#x60;): every not-deleted row the account owns that has not served an impression for at least &#x60;inactive_days&#x60; days (default 90; &#x60;0&#x60; lists everything), or with &#x60;never_served&#x3D;1&#x60; only the rows that never served at all. Each row carries its first / last served date (&#x60;\&quot;\&quot;&#x60; &#x3D; never), &#x60;days_idle&#x60; (&#x60;-1&#x60; &#x3D; never served), lifetime impressions / clicks / spend in the account\&#39;s currency units, and a suggestion:  - &#x60;pause&#x60; — still switched on but idle (campaigns, ads). - &#x60;archive&#x60; — off or not switchable and nothing depends on it. - &#x60;review&#x60; — idle but still used (&#x60;used_by&#x60; live ads or pool   items for creatives and pools, live adzones for websites). - &#x60;keep&#x60; — served within the last 90 days; only appears with   &#x60;inactive_days&#x3D;0&#x60;, the full inventory.  Read-only: act through the kind\&#39;s own endpoints (pause a campaign or ad, mass-delete, delete a pool or site), which keep their own checks. History comes from the full stats history (2021 onward) and is cached for five minutes. RTB campaigns are not listed: their delivery is reported separately. Each kind also needs its own scope (campaigns.read, creatives.read); a kind the key or team member cannot read is 403. The panel\&#39;s Cleanup page uses the same handler. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // 'campaign' | 'ad' | 'creative' | 'creative_pool' | 'url_pool' (optional)
    kind: kind_example,
    // number (optional)
    inactiveDays: 56,
    // boolean (optional)
    neverServed: true,
    // string | Substring of the name. (optional)
    search: search_example,
    // 'last_served' | 'lifetime_impressions' | 'name' | 'id' | last_served ascending = never served first, then the longest idle. (optional)
    sort: sort_example,
    // 'asc' | 'desc' (optional)
    dir: dir_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1CleanupAdvertiserGetRequest;

  try {
    const data = await api.apiV1CleanupAdvertiserGet(body);
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
| **kind** | `campaign`, `ad`, `creative`, `creative_pool`, `url_pool` |  | [Optional] [Defaults to `undefined`] [Enum: campaign, ad, creative, creative_pool, url_pool] |
| **inactiveDays** | `number` |  | [Optional] [Defaults to `90`] |
| **neverServed** | `boolean` |  | [Optional] [Defaults to `false`] |
| **search** | `string` | Substring of the name. | [Optional] [Defaults to `undefined`] |
| **sort** | `last_served`, `lifetime_impressions`, `name`, `id` | last_served ascending &#x3D; never served first, then the longest idle. | [Optional] [Defaults to `&#39;last_served&#39;`] [Enum: last_served, lifetime_impressions, name, id] |
| **dir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;asc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `100`] |

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
| **200** | Candidates. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_enum&#x60; for an unknown kind. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserLinkedGet

> apiV1CleanupAdvertiserLinkedGet(kind, ids)

What still uses advertiser cleanup rows.

For rows suggested &#x60;review&#x60; (still in use): the live ads in live campaigns that use them (creatives, creative pools, URL pools), the campaigns those ads would leave without any live ad, the live pool items holding a creative, and the live ad zones on a website. Read only; the panel\&#39;s archive dialog archives these first when the user ticks \&quot;archive linked too\&quot; (ads, then emptied campaigns, then ad zones and pool items, then the rows). 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserLinkedGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // 'campaign' | 'ad' | 'creative' | 'creative_pool' | 'url_pool'
    kind: kind_example,
    // string | Comma-separated row ids, 1 to 5000.
    ids: ids_example,
  } satisfies ApiV1CleanupAdvertiserLinkedGetRequest;

  try {
    const data = await api.apiV1CleanupAdvertiserLinkedGet(body);
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
| **kind** | `campaign`, `ad`, `creative`, `creative_pool`, `url_pool` |  | [Defaults to `undefined`] [Enum: campaign, ad, creative, creative_pool, url_pool] |
| **ids** | `string` | Comma-separated row ids, 1 to 5000. | [Defaults to `undefined`] |

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
| **200** | &#x60;data&#x60; &#x3D; {ads: [{id, name, campaign_id, campaign_type, campaign_name, uses_id}], campaigns_emptied: [{id, type, name}], pool_items: [{id, pool_id, pool_name, uses_id, is_active}], adzones: [{id, name, uses_id}]}. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_enum&#x60; kind, or no / too many ids. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserPurgePost

> apiV1CleanupAdvertiserPurgePost()

Purge archived advertiser items for good.

Every archived item of the named kinds leaves the Deleted views and can no longer be restored (each kind\&#39;s recover / undelete route answers 404 for it). The rows stay archived in the database, so past statistics keep their names and serving is not affected. Cannot be undone; logged in GET /runs as a &#x60;purge&#x60; entry. Body &#x60;{kinds: [...], confirm: \&quot;PURGE\&quot;}&#x60; (campaign, ad, creative, creative_pool, url_pool). 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserPurgePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupAdvertiserPurgePost();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;purged&#x60; &#x3D; items per &#x60;purge:&lt;kind&gt;&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Missing confirm, no kinds, or an unknown kind. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserRunsGet

> apiV1CleanupAdvertiserRunsGet()

Recent advertiser cleanup runs.

Every pause / archive the Cleanup page (or an integration) recorded in the last 90 days, newest first, at most 50: &#x60;id&#x60;, &#x60;source&#x60; (selected | suggested | linked), &#x60;time&#x60;, &#x60;actor_userid&#x60;, &#x60;undone&#x60;, and &#x60;counts&#x60; keyed &#x60;&lt;op&gt;:&lt;kind&gt;&#x60;. Item lists come from GET /runs/{id}. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserRunsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupAdvertiserRunsGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;data&#x60; &#x3D; the runs. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserRunsIdGet

> apiV1CleanupAdvertiserRunsIdGet(id)

One advertiser cleanup run with its items.

What to call to undo it, action by action, newest action first: pause → resume (PUT /campaigns/mass-toggle pause false, PUT /campaigns/{type}/{campaignId}/ads/mass-toggle activate true); archive → restore (POST /campaigns/mass-undelete, POST /campaigns/{type}/{campaignId}/ads/mass-undelete, POST /creatives/bulk-undelete, POST /adspaces/mass-recover, POST /creative-pools/{id}/recover, POST /url-pools/{id}/recover, POST /sites/{id}/recover); remove_pool_item → POST /creative-pools/{id}/items/recover. Then POST /runs/{id}/undone. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserRunsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CleanupAdvertiserRunsIdGetRequest;

  try {
    const data = await api.apiV1CleanupAdvertiserRunsIdGet(body);
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
| **200** | &#x60;data&#x60; &#x3D; the run with &#x60;actions&#x60;. |  -  |
| **404** | Not this account\&#39;s run on this side. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserRunsIdUndonePost

> apiV1CleanupAdvertiserRunsIdUndonePost(id)

Mark a advertiser cleanup run as undone.

Call after restoring / resuming its items. 409 &#x60;already_undone&#x60; when it already was.

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserRunsIdUndonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CleanupAdvertiserRunsIdUndonePostRequest;

  try {
    const data = await api.apiV1CleanupAdvertiserRunsIdUndonePost(body);
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
| **200** | Marked. |  -  |
| **404** | Not found. |  -  |
| **409** | Already undone. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserRunsPost

> apiV1CleanupAdvertiserRunsPost()

Record a advertiser cleanup run.

Record what you just changed so it can be listed and undone. Body &#x60;{source, actions: [{op, kind, items: [{id, campaign_id, campaign_type, pool_id, was_active}]}]}&#x60;; &#x60;op&#x60; is &#x60;pause&#x60; (campaigns, ads), &#x60;archive&#x60; (any kind of this side) or &#x60;remove_pool_item&#x60; (kind &#x60;creative&#x60;; &#x60;pool_id&#x60;, &#x60;was_active&#x60;). Ads need &#x60;campaign_id&#x60; + &#x60;campaign_type&#x60;, campaigns &#x60;campaign_type&#x60;. At most 100000 items. Recording changes nothing by itself. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserRunsPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupAdvertiserRunsPost();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | &#x60;id&#x60; and &#x60;counts&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Unknown op or kind, nothing changed, or too many items. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupAdvertiserSummaryGet

> apiV1CleanupAdvertiserSummaryGet(inactiveDays, neverServed)

Count the advertiser cleanup candidates per kind.

For every kind the caller may read: how many rows match the same &#x60;inactive_days&#x60; / &#x60;never_served&#x60; filter, how many never served, and the split by suggestion. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupAdvertiserSummaryGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // number (optional)
    inactiveDays: 56,
    // boolean (optional)
    neverServed: true,
  } satisfies ApiV1CleanupAdvertiserSummaryGetRequest;

  try {
    const data = await api.apiV1CleanupAdvertiserSummaryGet(body);
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
| **inactiveDays** | `number` |  | [Optional] [Defaults to `90`] |
| **neverServed** | `boolean` |  | [Optional] [Defaults to `false`] |

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
| **200** | Per-kind counts. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherArchivedGet

> apiV1CleanupPublisherArchivedGet()

Archived publisher items that can be purged.

Per kind the caller may read, how many archived (deleted) items are still restorable, i.e. not purged.

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherArchivedGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupPublisherArchivedGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;data&#x60; &#x3D; [{kind, archived}]. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherExportGet

> apiV1CleanupPublisherExportGet(format, kinds, inactiveDays, neverServed)

Download the publisher cleanup candidates.

Every kind the caller may read (or the comma-separated &#x60;kinds&#x60;) with the same filter, as one xlsx workbook with a sheet per kind (default) or one csv where each kind starts with its own header row. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherExportGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // 'xlsx' | 'csv' (optional)
    format: format_example,
    // string | Comma-separated subset of: adzone,website. (optional)
    kinds: kinds_example,
    // number (optional)
    inactiveDays: 56,
    // boolean (optional)
    neverServed: true,
  } satisfies ApiV1CleanupPublisherExportGetRequest;

  try {
    const data = await api.apiV1CleanupPublisherExportGet(body);
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
| **format** | `xlsx`, `csv` |  | [Optional] [Defaults to `&#39;xlsx&#39;`] [Enum: xlsx, csv] |
| **kinds** | `string` | Comma-separated subset of: adzone,website. | [Optional] [Defaults to `undefined`] |
| **inactiveDays** | `number` |  | [Optional] [Defaults to `90`] |
| **neverServed** | `boolean` |  | [Optional] [Defaults to `false`] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/csv`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The file. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_enum&#x60; for an unknown format or kind. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherGet

> apiV1CleanupPublisherGet(kind, inactiveDays, neverServed, search, sort, dir, page, perPage)

List publisher items that no longer serve.

One kind at a time (&#x60;adzone&#x60; needs &#x60;adspaces.read&#x60;, &#x60;website&#x60; needs &#x60;sites.read&#x60;): every not-deleted row the account owns that has not served an impression for at least &#x60;inactive_days&#x60; days (default 90; &#x60;0&#x60; lists everything), or with &#x60;never_served&#x3D;1&#x60; only the rows that never served at all. Each row carries its first / last served date (&#x60;\&quot;\&quot;&#x60; &#x3D; never), &#x60;days_idle&#x60; (&#x60;-1&#x60; &#x3D; never served), lifetime impressions / clicks / earnings in the account\&#39;s currency units, and a suggestion:  - &#x60;pause&#x60; — still switched on but idle (campaigns, ads). - &#x60;archive&#x60; — off or not switchable and nothing depends on it. - &#x60;review&#x60; — idle but still used (&#x60;used_by&#x60; live ads or pool   items for creatives and pools, live adzones for websites). - &#x60;keep&#x60; — served within the last 90 days; only appears with   &#x60;inactive_days&#x3D;0&#x60;, the full inventory.  Read-only: act through the kind\&#39;s own endpoints (pause a campaign or ad, mass-delete, delete a pool or site), which keep their own checks. History comes from the full stats history (2021 onward) and is cached for five minutes. RTB campaigns are not listed: their delivery is reported separately. Each kind also needs its own scope (adspaces.read, sites.read); a kind the key or team member cannot read is 403. The panel\&#39;s Cleanup page uses the same handler. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // 'adzone' | 'website' (optional)
    kind: kind_example,
    // number (optional)
    inactiveDays: 56,
    // boolean (optional)
    neverServed: true,
    // string | Substring of the name. (optional)
    search: search_example,
    // 'last_served' | 'lifetime_impressions' | 'name' | 'id' | last_served ascending = never served first, then the longest idle. (optional)
    sort: sort_example,
    // 'asc' | 'desc' (optional)
    dir: dir_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1CleanupPublisherGetRequest;

  try {
    const data = await api.apiV1CleanupPublisherGet(body);
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
| **kind** | `adzone`, `website` |  | [Optional] [Defaults to `undefined`] [Enum: adzone, website] |
| **inactiveDays** | `number` |  | [Optional] [Defaults to `90`] |
| **neverServed** | `boolean` |  | [Optional] [Defaults to `false`] |
| **search** | `string` | Substring of the name. | [Optional] [Defaults to `undefined`] |
| **sort** | `last_served`, `lifetime_impressions`, `name`, `id` | last_served ascending &#x3D; never served first, then the longest idle. | [Optional] [Defaults to `&#39;last_served&#39;`] [Enum: last_served, lifetime_impressions, name, id] |
| **dir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;asc&#39;`] [Enum: asc, desc] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `100`] |

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
| **200** | Candidates. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_enum&#x60; for an unknown kind. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherLinkedGet

> apiV1CleanupPublisherLinkedGet(kind, ids)

What still uses publisher cleanup rows.

For rows suggested &#x60;review&#x60; (still in use): the live ads in live campaigns that use them (creatives, creative pools, URL pools), the campaigns those ads would leave without any live ad, the live pool items holding a creative, and the live ad zones on a website. Read only; the panel\&#39;s archive dialog archives these first when the user ticks \&quot;archive linked too\&quot; (ads, then emptied campaigns, then ad zones and pool items, then the rows). 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherLinkedGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // 'adzone' | 'website'
    kind: kind_example,
    // string | Comma-separated row ids, 1 to 5000.
    ids: ids_example,
  } satisfies ApiV1CleanupPublisherLinkedGetRequest;

  try {
    const data = await api.apiV1CleanupPublisherLinkedGet(body);
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
| **kind** | `adzone`, `website` |  | [Defaults to `undefined`] [Enum: adzone, website] |
| **ids** | `string` | Comma-separated row ids, 1 to 5000. | [Defaults to `undefined`] |

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
| **200** | &#x60;data&#x60; &#x3D; {ads: [{id, name, campaign_id, campaign_type, campaign_name, uses_id}], campaigns_emptied: [{id, type, name}], pool_items: [{id, pool_id, pool_name, uses_id, is_active}], adzones: [{id, name, uses_id}]}. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_enum&#x60; kind, or no / too many ids. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherPurgePost

> apiV1CleanupPublisherPurgePost()

Purge archived publisher items for good.

Every archived item of the named kinds leaves the Deleted views and can no longer be restored (each kind\&#39;s recover / undelete route answers 404 for it). The rows stay archived in the database, so past statistics keep their names and serving is not affected. Cannot be undone; logged in GET /runs as a &#x60;purge&#x60; entry. Body &#x60;{kinds: [...], confirm: \&quot;PURGE\&quot;}&#x60; (adzone, website). 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherPurgePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupPublisherPurgePost();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;purged&#x60; &#x3D; items per &#x60;purge:&lt;kind&gt;&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Missing confirm, no kinds, or an unknown kind. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherRunsGet

> apiV1CleanupPublisherRunsGet()

Recent publisher cleanup runs.

Every pause / archive the Cleanup page (or an integration) recorded in the last 90 days, newest first, at most 50: &#x60;id&#x60;, &#x60;source&#x60; (selected | suggested | linked), &#x60;time&#x60;, &#x60;actor_userid&#x60;, &#x60;undone&#x60;, and &#x60;counts&#x60; keyed &#x60;&lt;op&gt;:&lt;kind&gt;&#x60;. Item lists come from GET /runs/{id}. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherRunsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupPublisherRunsGet();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;data&#x60; &#x3D; the runs. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherRunsIdGet

> apiV1CleanupPublisherRunsIdGet(id)

One publisher cleanup run with its items.

What to call to undo it, action by action, newest action first: pause → resume (PUT /campaigns/mass-toggle pause false, PUT /campaigns/{type}/{campaignId}/ads/mass-toggle activate true); archive → restore (POST /campaigns/mass-undelete, POST /campaigns/{type}/{campaignId}/ads/mass-undelete, POST /creatives/bulk-undelete, POST /adspaces/mass-recover, POST /creative-pools/{id}/recover, POST /url-pools/{id}/recover, POST /sites/{id}/recover); remove_pool_item → POST /creative-pools/{id}/items/recover. Then POST /runs/{id}/undone. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherRunsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CleanupPublisherRunsIdGetRequest;

  try {
    const data = await api.apiV1CleanupPublisherRunsIdGet(body);
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
| **200** | &#x60;data&#x60; &#x3D; the run with &#x60;actions&#x60;. |  -  |
| **404** | Not this account\&#39;s run on this side. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherRunsIdUndonePost

> apiV1CleanupPublisherRunsIdUndonePost(id)

Mark a publisher cleanup run as undone.

Call after restoring / resuming its items. 409 &#x60;already_undone&#x60; when it already was.

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherRunsIdUndonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CleanupPublisherRunsIdUndonePostRequest;

  try {
    const data = await api.apiV1CleanupPublisherRunsIdUndonePost(body);
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
| **200** | Marked. |  -  |
| **404** | Not found. |  -  |
| **409** | Already undone. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherRunsPost

> apiV1CleanupPublisherRunsPost()

Record a publisher cleanup run.

Record what you just changed so it can be listed and undone. Body &#x60;{source, actions: [{op, kind, items: [{id, campaign_id, campaign_type, pool_id, was_active}]}]}&#x60;; &#x60;op&#x60; is &#x60;pause&#x60; (campaigns, ads), &#x60;archive&#x60; (any kind of this side) or &#x60;remove_pool_item&#x60; (kind &#x60;creative&#x60;; &#x60;pool_id&#x60;, &#x60;was_active&#x60;). Ads need &#x60;campaign_id&#x60; + &#x60;campaign_type&#x60;, campaigns &#x60;campaign_type&#x60;. At most 100000 items. Recording changes nothing by itself. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherRunsPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  try {
    const data = await api.apiV1CleanupPublisherRunsPost();
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

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | &#x60;id&#x60; and &#x60;counts&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Unknown op or kind, nothing changed, or too many items. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CleanupPublisherSummaryGet

> apiV1CleanupPublisherSummaryGet(inactiveDays, neverServed)

Count the publisher cleanup candidates per kind.

For every kind the caller may read: how many rows match the same &#x60;inactive_days&#x60; / &#x60;never_served&#x60; filter, how many never served, and the split by suggestion. 

### Example

```ts
import {
  Configuration,
  CleanupApi,
} from 'goadserver-sdk';
import type { ApiV1CleanupPublisherSummaryGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CleanupApi(config);

  const body = {
    // number (optional)
    inactiveDays: 56,
    // boolean (optional)
    neverServed: true,
  } satisfies ApiV1CleanupPublisherSummaryGetRequest;

  try {
    const data = await api.apiV1CleanupPublisherSummaryGet(body);
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
| **inactiveDays** | `number` |  | [Optional] [Defaults to `90`] |
| **neverServed** | `boolean` |  | [Optional] [Defaults to `false`] |

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
| **200** | Per-kind counts. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

