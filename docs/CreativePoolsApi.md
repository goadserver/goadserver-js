# CreativePoolsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CreativePoolsGet**](CreativePoolsApi.md#apiv1creativepoolsget) | **GET** /api/v1/creative-pools | List creative pools. |
| [**apiV1CreativePoolsIdAddCreativesPost**](CreativePoolsApi.md#apiv1creativepoolsidaddcreativespostoperation) | **POST** /api/v1/creative-pools/{id}/add-creatives | Add media-bank creatives to a pool. |
| [**apiV1CreativePoolsIdAddUrlsPost**](CreativePoolsApi.md#apiv1creativepoolsidaddurlspostoperation) | **POST** /api/v1/creative-pools/{id}/add-urls | Add hotlinked image / video / HTML URLs to a pool. |
| [**apiV1CreativePoolsIdClonePost**](CreativePoolsApi.md#apiv1creativepoolsidclonepost) | **POST** /api/v1/creative-pools/{id}/clone | Clone a creative pool with all its items. |
| [**apiV1CreativePoolsIdDelete**](CreativePoolsApi.md#apiv1creativepoolsiddelete) | **DELETE** /api/v1/creative-pools/{id} | Soft-delete a creative pool. |
| [**apiV1CreativePoolsIdGet**](CreativePoolsApi.md#apiv1creativepoolsidget) | **GET** /api/v1/creative-pools/{id} | Show a single creative pool. |
| [**apiV1CreativePoolsIdItemsExportGet**](CreativePoolsApi.md#apiv1creativepoolsiditemsexportget) | **GET** /api/v1/creative-pools/{id}/items/export | Download pool items\&#39; creative files as a ZIP. |
| [**apiV1CreativePoolsIdItemsGet**](CreativePoolsApi.md#apiv1creativepoolsiditemsget) | **GET** /api/v1/creative-pools/{id}/items | List items in a creative pool. |
| [**apiV1CreativePoolsIdItemsItemIdDelete**](CreativePoolsApi.md#apiv1creativepoolsiditemsitemiddelete) | **DELETE** /api/v1/creative-pools/{id}/items/{itemId} | Soft-delete a single pool item. |
| [**apiV1CreativePoolsIdItemsItemIdPut**](CreativePoolsApi.md#apiv1creativepoolsiditemsitemidputoperation) | **PUT** /api/v1/creative-pools/{id}/items/{itemId} | Update a single pool item. |
| [**apiV1CreativePoolsIdItemsItemIdTogglePut**](CreativePoolsApi.md#apiv1creativepoolsiditemsitemidtoggleput) | **PUT** /api/v1/creative-pools/{id}/items/{itemId}/toggle | Toggle a pool item on / off. |
| [**apiV1CreativePoolsIdItemsMassActionPut**](CreativePoolsApi.md#apiv1creativepoolsiditemsmassactionputoperation) | **PUT** /api/v1/creative-pools/{id}/items/mass-action | Bulk-change items of a creative pool. |
| [**apiV1CreativePoolsIdItemsPost**](CreativePoolsApi.md#apiv1creativepoolsiditemspostoperation) | **POST** /api/v1/creative-pools/{id}/items | Add an item to a creative pool. |
| [**apiV1CreativePoolsIdItemsRecoverPost**](CreativePoolsApi.md#apiv1creativepoolsiditemsrecoverpostoperation) | **POST** /api/v1/creative-pools/{id}/items/recover | Put removed items back into a creative pool. |
| [**apiV1CreativePoolsIdPut**](CreativePoolsApi.md#apiv1creativepoolsidputoperation) | **PUT** /api/v1/creative-pools/{id} | Update creative pool meta. |
| [**apiV1CreativePoolsIdRecoverPost**](CreativePoolsApi.md#apiv1creativepoolsidrecoverpost) | **POST** /api/v1/creative-pools/{id}/recover | Restore an archived creative pool. |
| [**apiV1CreativePoolsIdUsedInGet**](CreativePoolsApi.md#apiv1creativepoolsidusedinget) | **GET** /api/v1/creative-pools/{id}/used-in | List campaigns / ads that reference this pool. |
| [**apiV1CreativePoolsPost**](CreativePoolsApi.md#apiv1creativepoolspostoperation) | **POST** /api/v1/creative-pools | Create a creative pool. |
| [**apiV1CreativesBulkDeletePost**](CreativePoolsApi.md#apiv1creativesbulkdeletepostoperation) | **POST** /api/v1/creatives/bulk-delete | Soft-delete many media-bank creatives. |
| [**apiV1CreativesBulkUndeletePost**](CreativePoolsApi.md#apiv1creativesbulkundeletepostoperation) | **POST** /api/v1/creatives/bulk-undelete | Restore many deleted creatives. |
| [**apiV1CreativesIdUndeletePut**](CreativePoolsApi.md#apiv1creativesidundeleteput) | **PUT** /api/v1/creatives/{id}/undelete | Restore one deleted creative. |



## apiV1CreativePoolsGet

> ApiV1CreativePoolsGet200Response apiV1CreativePoolsGet(filterType, filterTypes, filterTitle, filterId, filterName, filterOrientation, state, search, fitOrientation, selectStats, from, to, page, perPage, sortBy, sortDir)

List creative pools.

Returns every creative pool owned by the caller. Each row carries &#x60;items_count&#x60; (live items, &#x60;is_deleted&#x3D;0&#x60;) and &#x60;total_sizes&#x60; (count of distinct banner sizes). Tags are returned both as the raw CSV string (&#x60;tags&#x60;) and as an array (&#x60;tagids&#x60;).  Filters use the &#x60;filter_&#x60; prefix (&#x60;filter_type&#x60;, &#x60;filter_title&#x60;, &#x60;filter_id&#x60;, &#x60;filter_orientation&#x60;); &#x60;search&#x60; matches the title. Sort with &#x60;sort_by&#x60; / &#x60;sort_dir&#x60;. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // 'banner' | 'video' | 'reel' | 'native' | 'image' | 'creator' (optional)
    filterType: filterType_example,
    // string | Comma-separated list of pool types (banner, video, reel, image, native, creator). (optional)
    filterTypes: native,creator,
    // string | Title contains. (optional)
    filterTitle: filterTitle_example,
    // number (optional)
    filterId: 56,
    // string | Same as filter_title. (optional)
    filterName: filterName_example,
    // 'landscape' | 'portrait' | 'square' | The pool\'s own orientation label — empty on most pools; fit_orientation looks at the creatives instead. (optional)
    filterOrientation: filterOrientation_example,
    // 'live' | 'deleted' | deleted = the archived pools (deleted from the pool page or archived from Cleanup), to restore with POST /{id}/recover. Purged pools are in neither list. (optional)
    state: state_example,
    // string | Title contains. (optional)
    search: search_example,
    // 'landscape' | 'portrait' | 'square' | Adds how many of each pool\'s servable creatives have this orientation, so a pool that would produce an unservable ad can be told apart. (optional)
    fitOrientation: fitOrientation_example,
    // '1' | 1 = add views, clicks and conversions per pool for the from / to window (default the last 7 days). (optional)
    selectStats: selectStats_example,
    // Date | With select_stats=1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. (optional)
    from: 2013-10-20,
    // Date | With select_stats=1: last day of the stats window (YYYY-MM-DD). (optional)
    to: 2013-10-20,
    // number (optional)
    page: 56,
    // ApiV1CreativePoolsGetPerPageParameter (optional)
    perPage: ...,
    // 'id' | 'title' | 'type' | 'sort_type' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
  } satisfies ApiV1CreativePoolsGetRequest;

  try {
    const data = await api.apiV1CreativePoolsGet(body);
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
| **filterType** | `banner`, `video`, `reel`, `native`, `image`, `creator` |  | [Optional] [Defaults to `undefined`] [Enum: banner, video, reel, native, image, creator] |
| **filterTypes** | `string` | Comma-separated list of pool types (banner, video, reel, image, native, creator). | [Optional] [Defaults to `undefined`] |
| **filterTitle** | `string` | Title contains. | [Optional] [Defaults to `undefined`] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterName** | `string` | Same as filter_title. | [Optional] [Defaults to `undefined`] |
| **filterOrientation** | `landscape`, `portrait`, `square` | The pool\&#39;s own orientation label — empty on most pools; fit_orientation looks at the creatives instead. | [Optional] [Defaults to `undefined`] [Enum: landscape, portrait, square] |
| **state** | `live`, `deleted` | deleted &#x3D; the archived pools (deleted from the pool page or archived from Cleanup), to restore with POST /{id}/recover. Purged pools are in neither list. | [Optional] [Defaults to `&#39;live&#39;`] [Enum: live, deleted] |
| **search** | `string` | Title contains. | [Optional] [Defaults to `undefined`] |
| **fitOrientation** | `landscape`, `portrait`, `square` | Adds how many of each pool\&#39;s servable creatives have this orientation, so a pool that would produce an unservable ad can be told apart. | [Optional] [Defaults to `undefined`] [Enum: landscape, portrait, square] |
| **selectStats** | `1` | 1 &#x3D; add views, clicks and conversions per pool for the from / to window (default the last 7 days). | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **from** | `Date` | With select_stats&#x3D;1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | With select_stats&#x3D;1: last day of the stats window (YYYY-MM-DD). | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | [](.md) |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `title`, `type`, `sort_type` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, title, type, sort_type] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

### Return type

[**ApiV1CreativePoolsGet200Response**](ApiV1CreativePoolsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pools. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdAddCreativesPost

> apiV1CreativePoolsIdAddCreativesPost(id, apiV1CreativePoolsIdAddCreativesPostRequest)

Add media-bank creatives to a pool.

Adds existing creatives (from &#x60;GET /api/v1/creatives&#x60; or &#x60;POST /api/v1/creatives/upload&#x60;) to the pool by id — the panel\&#39;s \&quot;Add from library\&quot;. Only creatives of the pool\&#39;s own type are added; ids that are not yours, not that type, or already in the pool are skipped silently (&#x60;total&#x60; counts what was added). New items need moderation unless the account auto-validates. A key pinned to &#x60;creative_ids&#x60; may only add creatives on its pin (403 otherwise). 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdAddCreativesPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdAddCreativesPostRequest
    apiV1CreativePoolsIdAddCreativesPostRequest: {"creative_ids":[1082426,1082427]},
  } satisfies ApiV1CreativePoolsIdAddCreativesPostOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdAddCreativesPost(body);
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
| **apiV1CreativePoolsIdAddCreativesPostRequest** | [ApiV1CreativePoolsIdAddCreativesPostRequest](ApiV1CreativePoolsIdAddCreativesPostRequest.md) |  | |

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
| **200** | Added. |  -  |
| **403** | A creative id outside the key\&#39;s creative pin (&#x60;forbidden_resource&#x60;). |  -  |
| **404** | Pool not found. |  -  |
| **422** | &#x60;creative_ids&#x60; empty. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdAddUrlsPost

> apiV1CreativePoolsIdAddUrlsPost(id, apiV1CreativePoolsIdAddUrlsPostRequest)

Add hotlinked image / video / HTML URLs to a pool.

Bulk import of hotlinked creatives — the panel\&#39;s \&quot;Add URLs\&quot;. One URL per line in &#x60;urls&#x60;; each becomes a media-bank creative plus a pool item. The protocol is normalised to https. The file extension decides the kind: jpg/jpeg/png/bmp/webp image, gif animated image, mp4 video; anything else (or an image into a video pool) is reported back in &#x60;err_data&#x60;. &#x60;type: html_url&#x60; hotlinks the URL as an iframe banner instead. Creator pools refuse URLs (422). Keys pinned to &#x60;creative_ids&#x60; cannot use this (it creates creatives). 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdAddUrlsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdAddUrlsPostRequest
    apiV1CreativePoolsIdAddUrlsPostRequest: {"urls":"https://cdn.example.com/a.jpg\nhttps://cdn.example.com/b.mp4","sizeid":71},
  } satisfies ApiV1CreativePoolsIdAddUrlsPostOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdAddUrlsPost(body);
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
| **apiV1CreativePoolsIdAddUrlsPostRequest** | [ApiV1CreativePoolsIdAddUrlsPostRequest](ApiV1CreativePoolsIdAddUrlsPostRequest.md) |  | |

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
| **200** | Imported (per-URL failures listed, not fatal). |  -  |
| **403** | Key pinned to creative_ids (&#x60;forbidden_resource&#x60;). |  -  |
| **404** | Pool not found. |  -  |
| **422** | &#x60;urls&#x60; empty, or a creator pool. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdClonePost

> ApiV1CreativePoolsIdClonePost201Response apiV1CreativePoolsIdClonePost(id)

Clone a creative pool with all its items.

Duplicates the pool row and every live item (&#x60;is_deleted&#x3D;0&#x60;). Cloned items share the same underlying &#x60;creative_id&#x60;, so the binary creative file is not re-uploaded — both pools reference the same row in the &#x60;creatives&#x60; table. The new pool\&#39;s title is suffixed with \&quot; (Copy)\&quot;. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdClonePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdClonePostRequest;

  try {
    const data = await api.apiV1CreativePoolsIdClonePost(body);
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

[**ApiV1CreativePoolsIdClonePost201Response**](ApiV1CreativePoolsIdClonePost201Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Pool cloned. |  -  |
| **404** | Source pool not found. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdDelete

> ApiV1CreativePoolsIdDelete200Response apiV1CreativePoolsIdDelete(id)

Soft-delete a creative pool.

Deletes the pool **and** its items. Inactive items always go; an active item is kept only when it is the last active item of its banner size / rating that campaign ads still use. If any item had to be kept the call returns 409 (&#x60;total_items&#x60;, &#x60;deleted&#x60;) and the pool itself stays — the deletable items ARE already gone. Note the 200 body spells the count &#x60;totalitems&#x60;, the 409 body &#x60;total_items&#x60;. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdDeleteRequest;

  try {
    const data = await api.apiV1CreativePoolsIdDelete(body);
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

[**ApiV1CreativePoolsIdDelete200Response**](ApiV1CreativePoolsIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pool deleted. |  -  |
| **409** | Some items are still in use; pool not deleted. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdGet

> ApiV1CreativePoolsIdGet200Response apiV1CreativePoolsIdGet(id)

Show a single creative pool.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdGet(body);
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

[**ApiV1CreativePoolsIdGet200Response**](ApiV1CreativePoolsIdGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pool detail. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsExportGet

> Blob apiV1CreativePoolsIdItemsExportGet(id, ids)

Download pool items\&#39; creative files as a ZIP.

Returns &#x60;application/zip&#x60; (&#x60;Content-Disposition: attachment; filename&#x3D;\&quot;pool-{id}-export.zip\&quot;&#x60;) with one file per item plus a &#x60;_manifest.txt&#x60; listing which items were exported, skipped (no exportable source) or failed. Hotlinked items are fetched server-side (public addresses only). Max 500 items. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsExportGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // string | Comma-separated item ids, e.g. `55120,55121`.
    ids: ids_example,
  } satisfies ApiV1CreativePoolsIdItemsExportGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsExportGet(body);
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
| **ids** | `string` | Comma-separated item ids, e.g. &#x60;55120,55121&#x60;. | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/zip`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | ZIP archive. |  -  |
| **400** | &#x60;no_ids&#x60;, &#x60;too_many_ids&#x60; (&gt; 500). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Pool not found, or none of the ids is an exportable item. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsGet

> ApiV1CreativesGet200Response apiV1CreativePoolsIdItemsGet(id, includeSizes, selectStats, from, to, page, perPage, filterBansizeid, filterIsactive, sortBy, sortDir)

List items in a creative pool.

Returns every banner / video / native item in the pool with size, creative metadata and lifetime stats (views, clicks, ctr, conv), plus its schedule: &#x60;start_at&#x60; / &#x60;end_at&#x60; (unix seconds, 0 &#x3D; no limit) and &#x60;is_fallback&#x60; (0/1) — see the item update endpoint. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // '1' | Banner pools: 1 = also return the pool\'s banner sizes with an item count each, saving a second request. (optional)
    includeSizes: includeSizes_example,
    // '1' | 1 = add stats per item for the from / to window (default the last 7 days). (optional)
    selectStats: selectStats_example,
    // Date | With select_stats=1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. (optional)
    from: 2013-10-20,
    // Date | With select_stats=1: last day of the stats window (YYYY-MM-DD). (optional)
    to: 2013-10-20,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
    // number | Banner size id. (optional)
    filterBansizeid: 56,
    // 0 | 1 (optional)
    filterIsactive: 56,
    // 'id' | 'title' | 'bansizeid' | 'isactive' | 'ctr' | 'weight' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
  } satisfies ApiV1CreativePoolsIdItemsGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsGet(body);
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
| **includeSizes** | `1` | Banner pools: 1 &#x3D; also return the pool\&#39;s banner sizes with an item count each, saving a second request. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **selectStats** | `1` | 1 &#x3D; add stats per item for the from / to window (default the last 7 days). | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **from** | `Date` | With select_stats&#x3D;1: first day of the stats window (YYYY-MM-DD). Both from and to are needed; otherwise the last 7 days. | [Optional] [Defaults to `undefined`] |
| **to** | `Date` | With select_stats&#x3D;1: last day of the stats window (YYYY-MM-DD). | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `20`] |
| **filterBansizeid** | `number` | Banner size id. | [Optional] [Defaults to `undefined`] |
| **filterIsactive** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **sortBy** | `id`, `title`, `bansizeid`, `isactive`, `ctr`, `weight` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, title, bansizeid, isactive, ctr, weight] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

### Return type

[**ApiV1CreativesGet200Response**](ApiV1CreativesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Items. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsItemIdDelete

> apiV1CreativePoolsIdItemsItemIdDelete(id, itemId)

Soft-delete a single pool item.

Refuses if the item is still referenced by a live ad — unhook the ad first. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsItemIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
  } satisfies ApiV1CreativePoolsIdItemsItemIdDeleteRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsItemIdDelete(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |

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
| **200** | Deleted. |  -  |
| **409** | Item still used in a live ad. |  -  |
| **404** | Item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsItemIdPut

> apiV1CreativePoolsIdItemsItemIdPut(id, itemId, apiV1CreativePoolsIdItemsItemIdPutRequest)

Update a single pool item.

Editable fields: &#x60;title&#x60;, &#x60;lang&#x60;, &#x60;properties&#x60;, &#x60;ratingid&#x60;, &#x60;url_prefix&#x60;, &#x60;weight&#x60; (whole number 0–1000000; drives &#x60;sort_type: wr&#x60; rotation — 400 &#x60;invalid_weight&#x60; otherwise), &#x60;is_fallback&#x60;, &#x60;start_at&#x60;, &#x60;end_at&#x60;. Active state is toggled via the &#x60;/toggle&#x60; endpoint below.  **Scheduling.** &#x60;start_at&#x60; / &#x60;end_at&#x60; make the item serve only inside &#x60;[start_at, end_at)&#x60;. Send unix seconds or an RFC 3339 time with its offset (&#x60;2026-10-20T09:00:00-04:00&#x60; &#x3D; 9:00 AM New York); &#x60;null&#x60;, &#x60;0&#x60; or &#x60;\&quot;\&quot;&#x60; clears that side. The list endpoint returns both as unix seconds (0 &#x3D; no limit). The ad servers pick up an edit within 5 minutes and then switch on the exact second, so save a schedule a few minutes ahead of its start.  **Fallback.** &#x60;is_fallback: true&#x60; makes the item serve only while no other item of the same pool and size is live. Typical promo swap: mark the regular creative as fallback and give the promo a &#x60;start_at&#x60; (and &#x60;end_at&#x60;); the regular one steps aside while the promo runs and returns when it ends.  A change that would leave a size still used by campaign ads with nothing to serve at some moment is refused with 409 &#x60;SCHEDULE_LEAVES_POOL_EMPTY&#x60;; &#x60;gap_at&#x60; is the first uncovered unix second. Pausing or deleting an item runs the same check over the other items\&#39; schedules. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsItemIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
    // ApiV1CreativePoolsIdItemsItemIdPutRequest
    apiV1CreativePoolsIdItemsItemIdPutRequest: {"is_fallback":false,"start_at":"2026-10-20T09:00:00-04:00","end_at":"2026-10-27T09:00:00-04:00"},
  } satisfies ApiV1CreativePoolsIdItemsItemIdPutOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsItemIdPut(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |
| **apiV1CreativePoolsIdItemsItemIdPutRequest** | [ApiV1CreativePoolsIdItemsItemIdPutRequest](ApiV1CreativePoolsIdItemsItemIdPutRequest.md) |  | |

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
| **400** | &#x60;invalid_weight&#x60;. |  -  |
| **404** | Item not found. |  -  |
| **409** | &#x60;SCHEDULE_LEAVES_POOL_EMPTY&#x60; — the schedule would leave a size still used by campaign ads with nothing to serve. |  -  |
| **422** | Validation error on &#x60;start_at&#x60; / &#x60;end_at&#x60; (bad format, or end not after start). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsItemIdTogglePut

> apiV1CreativePoolsIdItemsItemIdTogglePut(id, itemId)

Toggle a pool item on / off.

Flips &#x60;isactive&#x60; between 0 and 1. Inactive items are skipped by the ad-server when picking a creative from the pool. Pausing the last active item of a format that campaign ads still use is refused (409). 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsItemIdTogglePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // number
    itemId: 56,
  } satisfies ApiV1CreativePoolsIdItemsItemIdTogglePutRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsItemIdTogglePut(body);
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
| **itemId** | `number` |  | [Defaults to `undefined`] |

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
| **404** | Item not found. |  -  |
| **409** | &#x60;THIS_AD_CAN_NOT_BE_PAUSED_BECAUSE_IT_IS_THE_ONLY_ONE_OF_THIS_FORMAT_AND_ITS_STILL_USED_IN_ONE_OR_MORE_ADS&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsMassActionPut

> apiV1CreativePoolsIdItemsMassActionPut(id, apiV1CreativePoolsIdItemsMassActionPutRequest)

Bulk-change items of a creative pool.

&#x60;action&#x60;:  - &#x60;activate&#x60; / &#x60;deactivate&#x60; — set &#x60;isactive&#x60;. - &#x60;delete&#x60; — soft-delete the items. - &#x60;url_prefix&#x60; — set each item\&#39;s &#x60;url_prefix&#x60; to &#x60;url_prefix&#x60;. - &#x60;language&#x60; — set each item\&#39;s &#x60;lang&#x60; to &#x60;lang&#x60;.  Deactivate and delete refuse (409, nothing written) when an item is the last active one of its size / rating still used by a campaign ad — &#x60;blocked_ids&#x60; lists them, the same rule as the single-item toggle / delete. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsMassActionPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdItemsMassActionPutRequest
    apiV1CreativePoolsIdItemsMassActionPutRequest: {"action":"deactivate","ids":[55120,55121]},
  } satisfies ApiV1CreativePoolsIdItemsMassActionPutOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsMassActionPut(body);
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
| **apiV1CreativePoolsIdItemsMassActionPutRequest** | [ApiV1CreativePoolsIdItemsMassActionPutRequest](ApiV1CreativePoolsIdItemsMassActionPutRequest.md) |  | |

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
| **400** | &#x60;invalid_action&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Creative pool not found. |  -  |
| **409** | Some items are the last of their format still used in ads. |  -  |
| **422** | No &#x60;ids&#x60;, or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsPost

> apiV1CreativePoolsIdItemsPost(id, apiV1CreativePoolsIdItemsPostRequest)

Add an item to a creative pool.

Adds one creative to the pool. Reference an uploaded creative by &#x60;creative_id&#x60; (from &#x60;POST /api/v1/creatives/upload&#x60;; must be yours, and on the key\&#39;s creative pin if it has one) or supply a hotlink &#x60;banner_url&#x60;. The pool\&#39;s &#x60;type&#x60; decides the creative slot (banner / video / image). To add many library creatives at once use &#x60;POST …/{id}/add-creatives&#x60;. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdItemsPostRequest
    apiV1CreativePoolsIdItemsPostRequest: {"creative_id":1082426,"title":"Q3 banner"},
  } satisfies ApiV1CreativePoolsIdItemsPostOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsPost(body);
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
| **apiV1CreativePoolsIdItemsPostRequest** | [ApiV1CreativePoolsIdItemsPostRequest](ApiV1CreativePoolsIdItemsPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Item added — body is {id, message}. |  -  |
| **422** | Neither creative_id nor banner_url supplied. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdItemsRecoverPost

> apiV1CreativePoolsIdItemsRecoverPost(id, apiV1CreativePoolsIdItemsRecoverPostRequest)

Put removed items back into a creative pool.

The undo of DELETE /creative-pools/{id}/items/{itemId} (removing an item also switches it off). &#x60;active_ids&#x60; are switched back on. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdItemsRecoverPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdItemsRecoverPostRequest
    apiV1CreativePoolsIdItemsRecoverPostRequest: ...,
  } satisfies ApiV1CreativePoolsIdItemsRecoverPostOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdItemsRecoverPost(body);
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
| **apiV1CreativePoolsIdItemsRecoverPostRequest** | [ApiV1CreativePoolsIdItemsRecoverPostRequest](ApiV1CreativePoolsIdItemsRecoverPostRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;restored&#x60; &#x3D; items back. |  -  |
| **404** | Pool not found or archived. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdPut

> apiV1CreativePoolsIdPut(id, apiV1CreativePoolsIdPutRequest)

Update creative pool meta.

Updates any of &#x60;title&#x60; (alias &#x60;name&#x60;), &#x60;sort_type&#x60;, &#x60;conv_type&#x60;, &#x60;tags&#x60;, &#x60;type&#x60;, &#x60;orientation&#x60;. &#x60;sort_type: wr&#x60; (weighted rotation on item &#x60;weight&#x60;) needs the tenant\&#39;s weighted-rotation option — 400 &#x60;weighted_rotation_disabled&#x60; otherwise. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativePoolsIdPutRequest
    apiV1CreativePoolsIdPutRequest: ...,
  } satisfies ApiV1CreativePoolsIdPutOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsIdPut(body);
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
| **apiV1CreativePoolsIdPutRequest** | [ApiV1CreativePoolsIdPutRequest](ApiV1CreativePoolsIdPutRequest.md) |  | |

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
| **400** | &#x60;no_fields&#x60;, &#x60;invalid_sort_type&#x60;, &#x60;weighted_rotation_disabled&#x60; or &#x60;invalid_type&#x60;. |  -  |
| **404** | Pool not found. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdRecoverPost

> apiV1CreativePoolsIdRecoverPost(id)

Restore an archived creative pool.

Reverses the soft delete of DELETE /creative-pools/{id} (and of Cleanup\&#39;s Archive): the pool is listed and usable again. The items the delete took down come back as they were; for a pool deleted before 2026-10-16 every deleted item comes back paused (&#x60;items_paused: true&#x60;). 404 when the pool does not exist, is not archived, or was purged. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdRecoverPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdRecoverPostRequest;

  try {
    const data = await api.apiV1CreativePoolsIdRecoverPost(body);
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
| **200** | Restored. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found, not archived or purged. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsIdUsedInGet

> ApiV1CreativePoolsIdUsedInGet200Response apiV1CreativePoolsIdUsedInGet(id)

List campaigns / ads that reference this pool.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsIdUsedInGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativePoolsIdUsedInGetRequest;

  try {
    const data = await api.apiV1CreativePoolsIdUsedInGet(body);
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

[**ApiV1CreativePoolsIdUsedInGet200Response**](ApiV1CreativePoolsIdUsedInGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | References. |  -  |
| **404** | Pool not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativePoolsPost

> ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response apiV1CreativePoolsPost(apiV1CreativePoolsPostRequest)

Create a creative pool.

Creates an empty pool. Fill it with &#x60;POST …/{id}/add-creatives&#x60; (media-bank ids), &#x60;POST …/{id}/add-urls&#x60; (hotlinks) or &#x60;POST …/{id}/items&#x60; (one creative). Title collisions are auto-suffixed with &#x60;_&lt;unix&gt;&#x60;. An unknown &#x60;type&#x60; is a 400 &#x60;invalid_type&#x60; (it used to fall back to banner). 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativePoolsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // ApiV1CreativePoolsPostRequest
    apiV1CreativePoolsPostRequest: ...,
  } satisfies ApiV1CreativePoolsPostOperationRequest;

  try {
    const data = await api.apiV1CreativePoolsPost(body);
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
| **apiV1CreativePoolsPostRequest** | [ApiV1CreativePoolsPostRequest](ApiV1CreativePoolsPostRequest.md) |  | |

### Return type

[**ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response**](ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created. |  -  |
| **400** | &#x60;invalid_type&#x60; — type not one of banner, video, native, creator. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Title missing. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesBulkDeletePost

> apiV1CreativesBulkDeletePost(apiV1CreativesBulkDeletePostRequest)

Soft-delete many media-bank creatives.

Sets &#x60;isdeleted &#x3D; 1&#x60; on up to 500 of your creatives. Ads and pool items already pointing at them keep working; deleted creatives just leave the library. Restore with &#x60;POST /creatives/bulk-undelete&#x60; or &#x60;PUT /creatives/{id}/undelete&#x60;. A key pinned to &#x60;creative_ids&#x60; may only name pinned ids (403 &#x60;forbidden_resource&#x60;). Account members with own-scoped creative rights only affect creatives they manage. Same handler as the panel. 

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesBulkDeletePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // ApiV1CreativesBulkDeletePostRequest
    apiV1CreativesBulkDeletePostRequest: {"ids":[99102,99103]},
  } satisfies ApiV1CreativesBulkDeletePostOperationRequest;

  try {
    const data = await api.apiV1CreativesBulkDeletePost(body);
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
| **apiV1CreativesBulkDeletePostRequest** | [ApiV1CreativesBulkDeletePostRequest](ApiV1CreativesBulkDeletePostRequest.md) |  | |

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
| **200** | Number of creatives deleted. |  -  |
| **400** | &#x60;no_ids&#x60;, &#x60;too_many_ids&#x60; (&gt; 500). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesBulkUndeletePost

> apiV1CreativesBulkUndeletePost(apiV1CreativesBulkUndeletePostRequest)

Restore many deleted creatives.

Inverse of &#x60;POST /creatives/bulk-delete&#x60; — same limits, pin and member rules.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesBulkUndeletePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // ApiV1CreativesBulkUndeletePostRequest
    apiV1CreativesBulkUndeletePostRequest: {ids=[99102, 99103]},
  } satisfies ApiV1CreativesBulkUndeletePostOperationRequest;

  try {
    const data = await api.apiV1CreativesBulkUndeletePost(body);
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
| **apiV1CreativesBulkUndeletePostRequest** | [ApiV1CreativesBulkUndeletePostRequest](ApiV1CreativesBulkUndeletePostRequest.md) |  | |

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
| **200** | Number of creatives restored. |  -  |
| **400** | &#x60;no_ids&#x60;, &#x60;too_many_ids&#x60; (&gt; 500). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdUndeletePut

> apiV1CreativesIdUndeletePut(id)

Restore one deleted creative.

Undoes &#x60;DELETE /creatives/{id}&#x60;. Same handler as the panel. No body.

### Example

```ts
import {
  Configuration,
  CreativePoolsApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdUndeletePutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativePoolsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativesIdUndeletePutRequest;

  try {
    const data = await api.apiV1CreativesIdUndeletePut(body);
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
| **200** | Restored. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Creative not found, or not deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

