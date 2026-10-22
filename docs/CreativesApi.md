# CreativesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CreativeFoldersGet**](CreativesApi.md#apiv1creativefoldersget) | **GET** /api/v1/creative-folders | List media-bank folders. |
| [**apiV1CreativeFoldersIdDelete**](CreativesApi.md#apiv1creativefoldersiddelete) | **DELETE** /api/v1/creative-folders/{id} | Delete a folder. |
| [**apiV1CreativeFoldersIdPut**](CreativesApi.md#apiv1creativefoldersidputoperation) | **PUT** /api/v1/creative-folders/{id} | Rename or move a folder. |
| [**apiV1CreativeFoldersPost**](CreativesApi.md#apiv1creativefolderspostoperation) | **POST** /api/v1/creative-folders | Create a folder. |
| [**apiV1CreativesBulkMovePost**](CreativesApi.md#apiv1creativesbulkmovepostoperation) | **POST** /api/v1/creatives/bulk-move | File creatives into a folder. |
| [**apiV1CreativesGet**](CreativesApi.md#apiv1creativesget) | **GET** /api/v1/creatives | List the creative library. |
| [**apiV1CreativesIdDelete**](CreativesApi.md#apiv1creativesiddelete) | **DELETE** /api/v1/creatives/{id} | Delete a creative. |
| [**apiV1CreativesIdGet**](CreativesApi.md#apiv1creativesidget) | **GET** /api/v1/creatives/{id} | Show one creative. |
| [**apiV1CreativesIdNamePut**](CreativesApi.md#apiv1creativesidnameputoperation) | **PUT** /api/v1/creatives/{id}/name | Rename a creative (panel inline edit). |
| [**apiV1CreativesIdPut**](CreativesApi.md#apiv1creativesidputoperation) | **PUT** /api/v1/creatives/{id} | Rename and/or re-tag a creative. |
| [**apiV1CreativesIdTagsPut**](CreativesApi.md#apiv1creativesidtagsputoperation) | **PUT** /api/v1/creatives/{id}/tags | Replace a creative\&#39;s tags (panel inline edit). |
| [**apiV1CreativesIdUsedInGet**](CreativesApi.md#apiv1creativesidusedinget) | **GET** /api/v1/creatives/{id}/used-in | List ads / pools referencing this creative. |
| [**apiV1CreativesUploadPost**](CreativesApi.md#apiv1creativesuploadpost) | **POST** /api/v1/creatives/upload | Upload creative files. |



## apiV1CreativeFoldersGet

> apiV1CreativeFoldersGet(withCounts, creativeType)

List media-bank folders.

The account\&#39;s folder tree: &#x60;{id, name, pid, level}&#x60; rows, &#x60;pid&#x60; 0 for a root, nested at most 3 tiers deep. Folders are the media bank\&#39;s exclusive axis — one folder per creative — and are separate from the multi-valued groups on &#x60;creatives.tags&#x60;. 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativeFoldersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // '1' | Add `count` (live creatives) per folder plus meta.unfiled_count and meta.creative_count. (optional)
    withCounts: withCounts_example,
    // string | Narrow the counts to one creative type (comma-separated list accepted). (optional)
    creativeType: creativeType_example,
  } satisfies ApiV1CreativeFoldersGetRequest;

  try {
    const data = await api.apiV1CreativeFoldersGet(body);
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
| **withCounts** | `1` | Add &#x60;count&#x60; (live creatives) per folder plus meta.unfiled_count and meta.creative_count. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **creativeType** | `string` | Narrow the counts to one creative type (comma-separated list accepted). | [Optional] [Defaults to `undefined`] |

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
| **200** | {data: [{id, name, pid, level, count?}], meta}. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativeFoldersIdDelete

> apiV1CreativeFoldersIdDelete(id, moveTo)

Delete a folder.

Never deletes creatives. The folder\&#39;s creatives become unfiled — or move to &#x60;move_to&#x60; — and its subfolders are reparented to the deleted folder\&#39;s own parent. 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativeFoldersIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
    // number | File the folder\'s creatives here instead of unfiling them. (optional)
    moveTo: 56,
  } satisfies ApiV1CreativeFoldersIdDeleteRequest;

  try {
    const data = await api.apiV1CreativeFoldersIdDelete(body);
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
| **moveTo** | `number` | File the folder\&#39;s creatives here instead of unfiling them. | [Optional] [Defaults to `undefined`] |

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
| **200** | {creatives_moved, children_reparented}. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativeFoldersIdPut

> apiV1CreativeFoldersIdPut(id, apiV1CreativeFoldersIdPutRequest)

Rename or move a folder.

&#x60;name&#x60; is required. &#x60;pid&#x60; is optional — omitting it leaves the folder where it is; sending it reparents the folder and its whole subtree, which is refused if that would exceed the depth cap or form a cycle. 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativeFoldersIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativeFoldersIdPutRequest
    apiV1CreativeFoldersIdPutRequest: ...,
  } satisfies ApiV1CreativeFoldersIdPutOperationRequest;

  try {
    const data = await api.apiV1CreativeFoldersIdPut(body);
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
| **apiV1CreativeFoldersIdPutRequest** | [ApiV1CreativeFoldersIdPutRequest](ApiV1CreativeFoldersIdPutRequest.md) |  | |

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
| **200** | Updated. |  -  |
| **404** | Not found. |  -  |
| **422** | Invalid name or parent. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativeFoldersPost

> apiV1CreativeFoldersPost(apiV1CreativeFoldersPostRequest)

Create a folder.

A folder whose name already exists under the same parent is returned as-is with &#x60;existing: true&#x60; rather than duplicated, so this is safe to call as create-or-reuse. 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativeFoldersPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // ApiV1CreativeFoldersPostRequest
    apiV1CreativeFoldersPostRequest: ...,
  } satisfies ApiV1CreativeFoldersPostOperationRequest;

  try {
    const data = await api.apiV1CreativeFoldersPost(body);
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
| **apiV1CreativeFoldersPostRequest** | [ApiV1CreativeFoldersPostRequest](ApiV1CreativeFoldersPostRequest.md) |  | |

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
| **200** | Existing folder returned ({existing: true}). |  -  |
| **201** | The new folder. |  -  |
| **422** | Missing name, unknown parent, cycle, or past the 3-tier depth cap. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesBulkMovePost

> apiV1CreativesBulkMovePost(apiV1CreativesBulkMovePostRequest)

File creatives into a folder.

Moves creatives into one media-bank folder. A creative sits in exactly one folder, so this is an assignment: rows already filed elsewhere are moved, and &#x60;folder_id: 0&#x60; unfiles them.  Two mutually exclusive selections:    * &#x60;ids&#x60; — an explicit list (max 20000, applied in chunks).   * &#x60;filter&#x60; — every creative matching a listing filter, given as the     same query params &#x60;GET /api/v1/creatives&#x60; accepts     (&#x60;creative_type&#x60;, &#x60;sizeid&#x60;, &#x60;orientation&#x60;, &#x60;folder_id&#x60;,     &#x60;include_subfolders&#x60;, &#x60;deleted&#x60;/&#x60;all&#x60;). Use this to file a whole     library; it is applied in batches server-side.  Nothing outside the key\&#39;s own account can be reached by either form. 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesBulkMovePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // ApiV1CreativesBulkMovePostRequest
    apiV1CreativesBulkMovePostRequest: ...,
  } satisfies ApiV1CreativesBulkMovePostOperationRequest;

  try {
    const data = await api.apiV1CreativesBulkMovePost(body);
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
| **apiV1CreativesBulkMovePostRequest** | [ApiV1CreativesBulkMovePostRequest](ApiV1CreativesBulkMovePostRequest.md) |  | |

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
| **200** | {moved: N, folder_id}. |  -  |
| **400** | No selection given. |  -  |
| **422** | Unknown destination folder. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesGet

> ApiV1CreativesGet200Response apiV1CreativesGet(creativeType, sizeid, orientation, deleted, all, filterName, search, sortBy, sortDir, folderId, includeSubfolders, page, perPage, limit, offset, filterId, filterType, filterSizeid)

List the creative library.

Uploaded creatives (banner / icon / native / video / reel) owned by the key.

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // string | One creative type, or a comma-separated list: banner, icon, native, push, video, reel, image, creator. (A bare `type` parameter is not read.) (optional)
    creativeType: native,creator,
    // number | Banner size id. (optional)
    sizeid: 56,
    // 'landscape' | 'portrait' | 'square' (optional)
    orientation: orientation_example,
    // '1' | 1 = only deleted creatives. (optional)
    deleted: deleted_example,
    // '1' | 1 = live and deleted creatives together. (optional)
    all: all_example,
    // string | Name contains. (optional)
    filterName: filterName_example,
    // string | Name contains. (optional)
    search: search_example,
    // 'id' | 'name' | 'type' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDir: sortDir_example,
    // number | Media-bank folder id. 0 selects the unfiled creatives; omit for every folder. (optional)
    folderId: 56,
    // '0' | '1' | With folder_id, also return creatives filed in that folder\'s subfolders. (optional)
    includeSubfolders: includeSubfolders_example,
    // number (optional)
    page: 56,
    // ApiV1CreativesGetPerPageParameter | Page size (max 100), or `all` for the whole library in one page. (optional)
    perPage: ...,
    // number | Offset paging: page size (per_page wins when both are sent). (optional)
    limit: 56,
    // number | Offset paging: rows to skip. (optional)
    offset: 56,
    // number (optional)
    filterId: 56,
    // 'banner' | 'icon' | 'native' | 'push' | 'video' | 'reel' | 'image' | 'creator' | 'audio' | Exactly one type; creative_type also takes a list. (optional)
    filterType: filterType_example,
    // number | Same as sizeid. (optional)
    filterSizeid: 56,
  } satisfies ApiV1CreativesGetRequest;

  try {
    const data = await api.apiV1CreativesGet(body);
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
| **creativeType** | `string` | One creative type, or a comma-separated list: banner, icon, native, push, video, reel, image, creator. (A bare &#x60;type&#x60; parameter is not read.) | [Optional] [Defaults to `undefined`] |
| **sizeid** | `number` | Banner size id. | [Optional] [Defaults to `undefined`] |
| **orientation** | `landscape`, `portrait`, `square` |  | [Optional] [Defaults to `undefined`] [Enum: landscape, portrait, square] |
| **deleted** | `1` | 1 &#x3D; only deleted creatives. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **all** | `1` | 1 &#x3D; live and deleted creatives together. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **filterName** | `string` | Name contains. | [Optional] [Defaults to `undefined`] |
| **search** | `string` | Name contains. | [Optional] [Defaults to `undefined`] |
| **sortBy** | `id`, `name`, `type` |  | [Optional] [Defaults to `&#39;id&#39;`] [Enum: id, name, type] |
| **sortDir** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **folderId** | `number` | Media-bank folder id. 0 selects the unfiled creatives; omit for every folder. | [Optional] [Defaults to `undefined`] |
| **includeSubfolders** | `0`, `1` | With folder_id, also return creatives filed in that folder\&#39;s subfolders. | [Optional] [Defaults to `&#39;1&#39;`] [Enum: 0, 1] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | [](.md) | Page size (max 100), or &#x60;all&#x60; for the whole library in one page. | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Offset paging: page size (per_page wins when both are sent). | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | Offset paging: rows to skip. | [Optional] [Defaults to `undefined`] |
| **filterId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **filterType** | `banner`, `icon`, `native`, `push`, `video`, `reel`, `image`, `creator`, `audio` | Exactly one type; creative_type also takes a list. | [Optional] [Defaults to `undefined`] [Enum: banner, icon, native, push, video, reel, image, creator, audio] |
| **filterSizeid** | `number` | Same as sizeid. | [Optional] [Defaults to `undefined`] |

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
| **200** | Creatives. Each row carries folder_id (0 &#x3D; unfiled). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdDelete

> apiV1CreativesIdDelete(id)

Delete a creative.

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativesIdDeleteRequest;

  try {
    const data = await api.apiV1CreativesIdDelete(body);
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
| **200** | Deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdGet

> apiV1CreativesIdGet(id)

Show one creative.

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativesIdGetRequest;

  try {
    const data = await api.apiV1CreativesIdGet(body);
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
| **200** | The creative. |  -  |
| **404** | Not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdNamePut

> apiV1CreativesIdNamePut(id, apiV1CreativesIdNamePutRequest)

Rename a creative (panel inline edit).

The panel\&#39;s own rename call. Also retitles the pool items built from this creative. Prefer &#x60;PUT /api/v1/creatives/{id}&#x60; for new code. 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdNamePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativesIdNamePutRequest
    apiV1CreativesIdNamePutRequest: ...,
  } satisfies ApiV1CreativesIdNamePutOperationRequest;

  try {
    const data = await api.apiV1CreativesIdNamePut(body);
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
| **apiV1CreativesIdNamePutRequest** | [ApiV1CreativesIdNamePutRequest](ApiV1CreativesIdNamePutRequest.md) |  | |

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
| **200** | Renamed. |  -  |
| **403** | Key pinned to other creatives, or a read-only member role. |  -  |
| **404** | Creative not found. |  -  |
| **422** | &#x60;name&#x60; missing or empty. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdPut

> apiV1CreativesIdPut(id, apiV1CreativesIdPutRequest)

Rename and/or re-tag a creative.

The panel\&#39;s two inline creative edits in one strict call: &#x60;name&#x60; (also retitles every pool item built from this creative, like the panel rename) and &#x60;tags&#x60;. Send either or both; unknown fields are a 422. The creative\&#39;s file / content cannot be changed — upload a new creative instead. Same ownership and member-scope checks as the panel (an own-scoped team member can only edit creatives they made). 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativesIdPutRequest
    apiV1CreativesIdPutRequest: {"name":"Summer promo 300x250","tags":[12,17]},
  } satisfies ApiV1CreativesIdPutOperationRequest;

  try {
    const data = await api.apiV1CreativesIdPut(body);
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
| **apiV1CreativesIdPutRequest** | [ApiV1CreativesIdPutRequest](ApiV1CreativesIdPutRequest.md) |  | |

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
| **403** | Key pinned to other creatives (&#x60;forbidden_resource&#x60;), or a read-only member role. |  -  |
| **404** | Creative not found. |  -  |
| **422** | Unknown field, empty name, nothing to update, or malformed tags. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdTagsPut

> apiV1CreativesIdTagsPut(id, apiV1CreativesIdTagsPutRequest)

Replace a creative\&#39;s tags (panel inline edit).

The panel\&#39;s own tag edit. &#x60;tags&#x60; is an array of tenant tag ids; non-numeric entries are dropped and [] clears the tags.

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdTagsPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1CreativesIdTagsPutRequest
    apiV1CreativesIdTagsPutRequest: {"tags":[12,17]},
  } satisfies ApiV1CreativesIdTagsPutOperationRequest;

  try {
    const data = await api.apiV1CreativesIdTagsPut(body);
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
| **apiV1CreativesIdTagsPutRequest** | [ApiV1CreativesIdTagsPutRequest](ApiV1CreativesIdTagsPutRequest.md) |  | |

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
| **403** | Key pinned to other creatives, or a read-only member role. |  -  |
| **404** | Creative not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesIdUsedInGet

> apiV1CreativesIdUsedInGet(id)

List ads / pools referencing this creative.

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesIdUsedInGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CreativesIdUsedInGetRequest;

  try {
    const data = await api.apiV1CreativesIdUsedInGet(body);
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
| **200** | Usage list. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CreativesUploadPost

> apiV1CreativesUploadPost(files, type, bannerSize, tags, folderId, folderName, uploadZip, folderFromZip, folderFromZipPaths, zipfile, icontags, properties, skiperrors, useOverlays, clonePerOverlay, overlay, overlaysZip)

Upload creative files.

&#x60;multipart/form-data&#x60; upload of one or more real creative files. The server stores each file, creates a &#x60;creatives&#x60; row and returns the new ids — reference them later via &#x60;creative_id&#x60; on ad-create or pool-item-add. Field &#x60;files&#x60; (repeatable) carries the uploads (&#x60;files[]&#x60;, &#x60;files[0]&#x60;…, &#x60;image&#x60;, &#x60;image[]&#x60;, &#x60;image[0]&#x60;… and a singular &#x60;file&#x60; / &#x60;file[]&#x60; are accepted too); &#x60;type&#x60; selects the creative kind. &#x60;creator&#x60; takes a poster image paired with a hover video; &#x60;skin&#x60; a site-skin image; &#x60;html5&#x60; takes HTML5 rich-media banners — each file is one .zip with an index.html at the top (or inside one top folder), max 5 MB zipped / 20 MB unpacked / 300 files, only web file types (html, css, js, json, images, fonts, mp4/webm/mp3). The size is &#x60;banner_size&#x60; or the bundle\&#39;s &#x60;&lt;meta name&#x3D;\&quot;ad.size\&quot; content&#x3D;\&quot;width&#x3D;300,height&#x3D;250\&quot;&gt;&#x60;. It is created as a banner creative (content_type &#x60;html5&#x60;) and served as an iframe with the IAB &#x60;clickTag&#x60; query parameter (also &#x60;clickTAG&#x60;, &#x60;clicktag&#x60;) set to its click URL — open it from the creative\&#39;s click handler (&#x60;window.open(clickTag)&#x60;) so the click is counted. &#x60;upload_zip&#x3D;1&#x60; is refused for html5 (each zip is one banner). 

### Example

```ts
import {
  Configuration,
  CreativesApi,
} from 'goadserver-sdk';
import type { ApiV1CreativesUploadPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CreativesApi(config);

  const body = {
    // Array<Blob> | One or more creative files.
    files: /path/to/file.txt,
    // string | audio = audio-ad creatives (mp3, m4a, aac, ogg, opus or wav, 3-120 s): re-encoded to a 128 kbps mp3, stored as <id>.mp3, the duration measured. Use the id as creative_id with video_type=creative on an audio ad (adtype 43). (optional)
    type: type_example,
    // number | Banner size id; auto-derived from image dimensions when omitted. An image exactly 2x or 3x a size is kept at full resolution under that size (served at the size, sharp on high-density screens); pass the 1x size id when the 2x dimensions are a size of their own. (optional)
    bannerSize: 56,
    // string (optional)
    tags: tags_example,
    // number | File the batch into this existing media-bank folder. Omit or 0 for unfiled. (optional)
    folderId: 56,
    // string | Create-or-reuse a folder with this name under folder_id and file the batch there. (optional)
    folderName: folderName_example,
    // string | Send one archive as `zipfile` instead of `files`; the server extracts it. (optional)
    uploadZip: uploadZip_example,
    // string | ZIP uploads only: name the folder after the archive (extension dropped), under folder_id / folder_name. (optional)
    folderFromZip: folderFromZip_example,
    // string | ZIP uploads only: recreate the archive\\\'s own directories as subfolders, up to 3 tiers. (optional)
    folderFromZipPaths: folderFromZipPaths_example,
    // Blob | With upload_zip=1: the archive to extract. (optional)
    zipfile: BINARY_DATA_HERE,
    // string | type=icon only: tags for the icons; overrides `tags` when sent. (optional)
    icontags: icontags_example,
    // string | Comma-separated property ids stamped on every created creative. (optional)
    properties: properties_example,
    // string | 1 = keep going past a file that fails and report it in `errors`; 0 stops at the first failure. (optional)
    skiperrors: skiperrors_example,
    // string | 1 = composite the PNG overlays sent on `overlay` / `overlays_zip` onto the uploaded images. (optional)
    useOverlays: useOverlays_example,
    // string | With use_overlays=1: create one variant per overlay instead of rotating the overlays across the files. (optional)
    clonePerOverlay: clonePerOverlay_example,
    // Array<Blob> | Overlay PNGs (repeatable, also accepted as overlay[]). Order sets the rotation. (optional)
    overlay: /path/to/file.txt,
    // Array<Blob> | ZIP archives of overlay PNGs (repeatable, also overlays_zip[]); entries are used in name order after the loose overlays. (optional)
    overlaysZip: /path/to/file.txt,
  } satisfies ApiV1CreativesUploadPostRequest;

  try {
    const data = await api.apiV1CreativesUploadPost(body);
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
| **files** | `Array<Blob>` | One or more creative files. | |
| **type** | `banner`, `icon`, `native`, `push`, `video`, `reel`, `skin`, `creator`, `html5`, `audio` | audio &#x3D; audio-ad creatives (mp3, m4a, aac, ogg, opus or wav, 3-120 s): re-encoded to a 128 kbps mp3, stored as &lt;id&gt;.mp3, the duration measured. Use the id as creative_id with video_type&#x3D;creative on an audio ad (adtype 43). | [Optional] [Defaults to `&#39;banner&#39;`] [Enum: banner, icon, native, push, video, reel, skin, creator, html5, audio] |
| **bannerSize** | `number` | Banner size id; auto-derived from image dimensions when omitted. An image exactly 2x or 3x a size is kept at full resolution under that size (served at the size, sharp on high-density screens); pass the 1x size id when the 2x dimensions are a size of their own. | [Optional] [Defaults to `undefined`] |
| **tags** | `string` |  | [Optional] [Defaults to `undefined`] |
| **folderId** | `number` | File the batch into this existing media-bank folder. Omit or 0 for unfiled. | [Optional] [Defaults to `undefined`] |
| **folderName** | `string` | Create-or-reuse a folder with this name under folder_id and file the batch there. | [Optional] [Defaults to `undefined`] |
| **uploadZip** | `1` | Send one archive as &#x60;zipfile&#x60; instead of &#x60;files&#x60;; the server extracts it. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **folderFromZip** | `1` | ZIP uploads only: name the folder after the archive (extension dropped), under folder_id / folder_name. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **folderFromZipPaths** | `1` | ZIP uploads only: recreate the archive\\\&#39;s own directories as subfolders, up to 3 tiers. | [Optional] [Defaults to `undefined`] [Enum: 1] |
| **zipfile** | `Blob` | With upload_zip&#x3D;1: the archive to extract. | [Optional] [Defaults to `undefined`] |
| **icontags** | `string` | type&#x3D;icon only: tags for the icons; overrides &#x60;tags&#x60; when sent. | [Optional] [Defaults to `undefined`] |
| **properties** | `string` | Comma-separated property ids stamped on every created creative. | [Optional] [Defaults to `undefined`] |
| **skiperrors** | `0`, `1` | 1 &#x3D; keep going past a file that fails and report it in &#x60;errors&#x60;; 0 stops at the first failure. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **useOverlays** | `0`, `1` | 1 &#x3D; composite the PNG overlays sent on &#x60;overlay&#x60; / &#x60;overlays_zip&#x60; onto the uploaded images. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **clonePerOverlay** | `0`, `1` | With use_overlays&#x3D;1: create one variant per overlay instead of rotating the overlays across the files. | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **overlay** | `Array<Blob>` | Overlay PNGs (repeatable, also accepted as overlay[]). Order sets the rotation. | [Optional] |
| **overlaysZip** | `Array<Blob>` | ZIP archives of overlay PNGs (repeatable, also overlays_zip[]); entries are used in name order after the loose overlays. | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | {created: [{id, name, type, folder_id}], errors, folder_id}. |  -  |
| **400** | No files / invalid type / invalid form. |  -  |
| **409** | With skiperrors&#x3D;0: a file (or a ZIP entry) failed — body &#x60;{files: [{file, error}]}&#x60; names each one; nothing after it was stored. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

