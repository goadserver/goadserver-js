# SitesApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1DomainsGet**](SitesApi.md#apiv1domainsget) | **GET** /api/v1/domains | List your custom domains (Domain Manager). |
| [**apiV1DomainsIdDelete**](SitesApi.md#apiv1domainsiddelete) | **DELETE** /api/v1/domains/{id} | Delete a custom domain. |
| [**apiV1DomainsIdGet**](SitesApi.md#apiv1domainsidget) | **GET** /api/v1/domains/{id} | Show one custom domain. |
| [**apiV1DomainsIdNotesPut**](SitesApi.md#apiv1domainsidnotesputoperation) | **PUT** /api/v1/domains/{id}/notes | Set your notes on a domain. |
| [**apiV1DomainsIdRedoPost**](SitesApi.md#apiv1domainsidredopost) | **POST** /api/v1/domains/{id}/redo | Retry setting up a domain (DNS / certificate check again). |
| [**apiV1DomainsIdToggleActivePost**](SitesApi.md#apiv1domainsidtoggleactivepost) | **POST** /api/v1/domains/{id}/toggle-active | Switch a custom domain on or off. |
| [**apiV1DomainsPost**](SitesApi.md#apiv1domainspostoperation) | **POST** /api/v1/domains | Add a custom domain. |
| [**apiV1SitesGet**](SitesApi.md#apiv1sitesget) | **GET** /api/v1/sites | List the caller\&#39;s websites. |
| [**apiV1SitesIdClonePost**](SitesApi.md#apiv1sitesidclonepostoperation) | **POST** /api/v1/sites/{id}/clone | Duplicate a site under a new name and URL, with its ad zones. |
| [**apiV1SitesIdDelete**](SitesApi.md#apiv1sitesiddelete) | **DELETE** /api/v1/sites/{id} | Soft-delete a site. |
| [**apiV1SitesIdGet**](SitesApi.md#apiv1sitesidget) | **GET** /api/v1/sites/{id} | Get a single site. |
| [**apiV1SitesIdPatch**](SitesApi.md#apiv1sitesidpatch) | **PATCH** /api/v1/sites/{id} | Update a site. |
| [**apiV1SitesIdRecoverPost**](SitesApi.md#apiv1sitesidrecoverpost) | **POST** /api/v1/sites/{id}/recover | Reverse a soft-delete on a site. |
| [**apiV1SitesIdSnippetsGet**](SitesApi.md#apiv1sitesidsnippetsget) | **GET** /api/v1/sites/{id}/snippets | List the site\&#39;s HTML snippets. |
| [**apiV1SitesIdSnippetsPost**](SitesApi.md#apiv1sitesidsnippetspost) | **POST** /api/v1/sites/{id}/snippets | Add an HTML snippet. |
| [**apiV1SitesIdSnippetsSnippetIdDelete**](SitesApi.md#apiv1sitesidsnippetssnippetiddelete) | **DELETE** /api/v1/sites/{id}/snippets/{snippetId} | Delete an HTML snippet. |
| [**apiV1SitesIdSnippetsSnippetIdPut**](SitesApi.md#apiv1sitesidsnippetssnippetidput) | **PUT** /api/v1/sites/{id}/snippets/{snippetId} | Replace an HTML snippet. |
| [**apiV1SitesIdVerifyPost**](SitesApi.md#apiv1sitesidverifypost) | **POST** /api/v1/sites/{id}/verify | Trigger HTTP re-check of the site verification meta tag. |
| [**apiV1SitesPost**](SitesApi.md#apiv1sitespost) | **POST** /api/v1/sites | Create a new website. |
| [**apiV1SitesSchemaGet**](SitesApi.md#apiv1sitesschemaget) | **GET** /api/v1/sites/_schema | Field metadata for site create/update. |



## apiV1DomainsGet

> apiV1DomainsGet(type, state, isactive, page, perPage)

List your custom domains (Domain Manager).

The domains you serve ads (&#x60;ads&#x60;), static files (&#x60;static&#x60;) or your branded panel (&#x60;up&#x60;) from. &#x60;dns_target&#x60; is the host an &#x60;ads&#x60;/&#x60;static&#x60; domain must CNAME to (your network\&#39;s ad domain); &#x60;dns_target_up&#x60; the host an &#x60;up&#x60; domain must CNAME to. Paginated like every list (&#x60;page&#x60;, &#x60;per_page&#x60; ≤ 100); filters: &#x60;type&#x60;, &#x60;state&#x60;, &#x60;isactive&#x60;, &#x60;domain&#x60; (LIKE). 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // 'ads' | 'static' | 'up' (optional)
    type: type_example,
    // number (optional)
    state: 56,
    // 0 | 1 (optional)
    isactive: 56,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1DomainsGetRequest;

  try {
    const data = await api.apiV1DomainsGet(body);
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
| **type** | `ads`, `static`, `up` |  | [Optional] [Defaults to `undefined`] [Enum: ads, static, up] |
| **state** | `number` |  | [Optional] [Defaults to `undefined`] |
| **isactive** | `0`, `1` |  | [Optional] [Defaults to `undefined`] [Enum: 0, 1] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` |  | [Optional] [Defaults to `undefined`] |

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
| **200** | Domains plus the CNAME targets. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DomainsIdDelete

> apiV1DomainsIdDelete(id)

Delete a custom domain.

Refused with 409 &#x60;brand_in_use&#x60; while the domain is your branded panel domain.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DomainsIdDeleteRequest;

  try {
    const data = await api.apiV1DomainsIdDelete(body);
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
| **404** | domain_not_found |  -  |
| **409** | brand_in_use |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DomainsIdGet

> apiV1DomainsIdGet(id)

Show one custom domain.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DomainsIdGetRequest;

  try {
    const data = await api.apiV1DomainsIdGet(body);
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
| **200** | The domain. |  -  |
| **404** | domain_not_found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DomainsIdNotesPut

> apiV1DomainsIdNotesPut(id, apiV1DomainsIdNotesPutRequest)

Set your notes on a domain.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsIdNotesPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1DomainsIdNotesPutRequest
    apiV1DomainsIdNotesPutRequest: ...,
  } satisfies ApiV1DomainsIdNotesPutOperationRequest;

  try {
    const data = await api.apiV1DomainsIdNotesPut(body);
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
| **apiV1DomainsIdNotesPutRequest** | [ApiV1DomainsIdNotesPutRequest](ApiV1DomainsIdNotesPutRequest.md) |  | |

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
| **200** | Saved. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DomainsIdRedoPost

> apiV1DomainsIdRedoPost(id)

Retry setting up a domain (DNS / certificate check again).

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsIdRedoPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DomainsIdRedoPostRequest;

  try {
    const data = await api.apiV1DomainsIdRedoPost(body);
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
| **200** | Queued for another attempt. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DomainsIdToggleActivePost

> apiV1DomainsIdToggleActivePost(id)

Switch a custom domain on or off.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsIdToggleActivePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1DomainsIdToggleActivePostRequest;

  try {
    const data = await api.apiV1DomainsIdToggleActivePost(body);
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
| **200** | Toggled. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1DomainsPost

> apiV1DomainsPost(apiV1DomainsPostRequest)

Add a custom domain.

Create the CNAME first (see &#x60;dns_target&#x60; on GET /api/v1/domains), then add the domain. The server checks that it resolves and that it really reaches our servers before it is accepted; the certificate is then issued automatically and &#x60;state&#x60; moves on as it goes live. Errors (409): &#x60;invalid_domain&#x60;, &#x60;invalid_dns&#x60; (does not resolve), &#x60;invalid_dns_point&#x60; (resolves, but not to us yet — DNS can take a few hours), &#x60;domain_exists&#x60;. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1DomainsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // ApiV1DomainsPostRequest
    apiV1DomainsPostRequest: ...,
  } satisfies ApiV1DomainsPostOperationRequest;

  try {
    const data = await api.apiV1DomainsPost(body);
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
| **apiV1DomainsPostRequest** | [ApiV1DomainsPostRequest](ApiV1DomainsPostRequest.md) |  | |

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
| **201** | Domain added. |  -  |
| **409** | invalid_domain / invalid_dns / invalid_dns_point / domain_exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesGet

> ApiV1SitesGet200Response apiV1SitesGet(state, sitestate, search, page, perPage)

List the caller\&#39;s websites.

Paged list (sorted by name). &#x60;state&#x3D;deleted&#x60; lists soft-deleted sites so &#x60;POST /api/v1/sites/{id}/recover&#x60; has ids to work with. Per-site period stats (the panel\&#39;s Websites listing stats columns) come from &#x60;GET /api/v1/publisher/stats?group_by&#x3D;website&amp;from&#x3D;&amp;to&#x3D;&#x60;, keyed by site id; per-zone ones from &#x60;group_by&#x3D;adzone&#x60;. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // 'live' | 'deleted' | 'all' (optional)
    state: state_example,
    // -1 | 0 | 1 | Review state: 1 validated, 0 pending, -1 rejected. (optional)
    sitestate: 56,
    // string | Substring of name or URL. (optional)
    search: search_example,
    // number (optional)
    page: 56,
    // number (optional)
    perPage: 56,
  } satisfies ApiV1SitesGetRequest;

  try {
    const data = await api.apiV1SitesGet(body);
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
| **state** | `live`, `deleted`, `all` |  | [Optional] [Defaults to `&#39;live&#39;`] [Enum: live, deleted, all] |
| **sitestate** | `-1`, `0`, `1` | Review state: 1 validated, 0 pending, -1 rejected. | [Optional] [Defaults to `undefined`] [Enum: -1, 0, 1] |
| **search** | `string` | Substring of name or URL. | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **perPage** | `number` |  | [Optional] [Defaults to `500`] |

### Return type

[**ApiV1SitesGet200Response**](ApiV1SitesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Site list (filtered by &#x60;resource_filter.site_ids&#x60; when set). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdClonePost

> apiV1SitesIdClonePost(id, apiV1SitesIdClonePostRequest)

Duplicate a site under a new name and URL, with its ad zones.

Creates a new site from this one (same settings) and copies its live ad zones onto it. The new URL goes through the same domain checks as &#x60;POST /api/v1/sites&#x60;. Keys pinned to &#x60;site_ids&#x60; / &#x60;adzone_ids&#x60; are refused (the copy could never be on the pin). 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdClonePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1SitesIdClonePostRequest
    apiV1SitesIdClonePostRequest: {"name":"My Blog (DE)","url":"https://de.example.com"},
  } satisfies ApiV1SitesIdClonePostOperationRequest;

  try {
    const data = await api.apiV1SitesIdClonePost(body);
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
| **apiV1SitesIdClonePostRequest** | [ApiV1SitesIdClonePostRequest](ApiV1SitesIdClonePostRequest.md) |  | |

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
| **201** | Cloned. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Site not found. |  -  |
| **422** | &#x60;validation_error&#x60; (name/url required, name taken, URL invalid or blocked) or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdDelete

> apiV1SitesIdDelete(id)

Soft-delete a site.

Sets &#x60;isdeleted &#x3D; 1&#x60;. Refused with **422 &#x60;has_adzones&#x60;** while the site still has live ad zones — delete or move them first (&#x60;POST /api/v1/adspaces/mass-delete&#x60;). Undo with &#x60;POST /api/v1/sites/{id}/recover&#x60;. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SitesIdDeleteRequest;

  try {
    const data = await api.apiV1SitesIdDelete(body);
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
| **422** | &#x60;has_adzones&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdGet

> Site apiV1SitesIdGet(id)

Get a single site.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SitesIdGetRequest;

  try {
    const data = await api.apiV1SitesIdGet(body);
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

[**Site**](Site.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Site. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdPatch

> apiV1SitesIdPatch(id, requestBody)

Update a site.

Update fields on an existing site. Send only the keys you want to change — omitted fields keep their current value. The &#x60;url&#x60; domain is re-validated when changed. A change of &#x60;url&#x60;, &#x60;categories&#x60; or &#x60;sitelanguages&#x60; puts a validated site back to pending review where the tenant reviews sites. &#x60;tags&#x60; (site groups) replaces the list; &#x60;[]&#x60; clears it. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdPatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
    // { [key: string]: any; }
    requestBody: {"description":"Updated description","categories":[12,47,99]},
  } satisfies ApiV1SitesIdPatchRequest;

  try {
    const data = await api.apiV1SitesIdPatch(body);
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
| **400** | &#x60;no_fields&#x60; — the body changed nothing. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |
| **422** | &#x60;validation_error&#x60; (same rules as create). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdRecoverPost

> apiV1SitesIdRecoverPost(id)

Reverse a soft-delete on a site.

Sets &#x60;isdeleted &#x3D; 0&#x60; so the site appears in listings again (the panel\&#39;s Restore in the websites list\&#39;s Deleted view). Returns 404 if the site doesn\&#39;t exist, isn\&#39;t currently soft-deleted, or was purged. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdRecoverPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SitesIdRecoverPostRequest;

  try {
    const data = await api.apiV1SitesIdRecoverPost(body);
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


## apiV1SitesIdSnippetsGet

> apiV1SitesIdSnippetsGet(id)

List the site\&#39;s HTML snippets.

Managed &#x60;&lt;meta&gt;&#x60; / &#x60;&lt;script&gt;&#x60; / &#x60;&lt;link&gt;&#x60; / &#x60;&lt;style&gt;&#x60; tags injected through the site\&#39;s one container tag (the panel\&#39;s HTML snippets panel). Up to 100 per site. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdSnippetsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SitesIdSnippetsGetRequest;

  try {
    const data = await api.apiV1SitesIdSnippetsGet(body);
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
| **200** | Snippets. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Site not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdSnippetsPost

> apiV1SitesIdSnippetsPost(id, siteSnippetWrite)

Add an HTML snippet.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdSnippetsPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
    // SiteSnippetWrite
    siteSnippetWrite: {"snippet_key":"google-verify","tag_type":"meta","position":"head","enabled":true,"attrs":{"name":"google-site-verification","content":"abc123"}},
  } satisfies ApiV1SitesIdSnippetsPostRequest;

  try {
    const data = await api.apiV1SitesIdSnippetsPost(body);
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
| **siteSnippetWrite** | [SiteSnippetWrite](SiteSnippetWrite.md) |  | |

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
| **200** | Created. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Site not found. |  -  |
| **422** | &#x60;validation_error&#x60; (tag type, position, attribute not allowed for the tag, non-http URL, limits, 100-snippet cap) or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdSnippetsSnippetIdDelete

> apiV1SitesIdSnippetsSnippetIdDelete(id, snippetId)

Delete an HTML snippet.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdSnippetsSnippetIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
    // number
    snippetId: 56,
  } satisfies ApiV1SitesIdSnippetsSnippetIdDeleteRequest;

  try {
    const data = await api.apiV1SitesIdSnippetsSnippetIdDelete(body);
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
| **snippetId** | `number` |  | [Defaults to `undefined`] |

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


## apiV1SitesIdSnippetsSnippetIdPut

> apiV1SitesIdSnippetsSnippetIdPut(id, snippetId, siteSnippetWrite)

Replace an HTML snippet.

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdSnippetsSnippetIdPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
    // number
    snippetId: 56,
    // SiteSnippetWrite
    siteSnippetWrite: ...,
  } satisfies ApiV1SitesIdSnippetsSnippetIdPutRequest;

  try {
    const data = await api.apiV1SitesIdSnippetsSnippetIdPut(body);
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
| **snippetId** | `number` |  | [Defaults to `undefined`] |
| **siteSnippetWrite** | [SiteSnippetWrite](SiteSnippetWrite.md) |  | |

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
| **200** | Updated; body &#x60;{snippet}&#x60;. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60; (API keys). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesIdVerifyPost

> apiV1SitesIdVerifyPost(id)

Trigger HTTP re-check of the site verification meta tag.

Tells the server to fetch the site URL and look for the verify meta tag the publisher embedded. On success the site flips to &#x60;is_verified&#x3D;true&#x60; and can start serving ads.  The verify code + tag prefix are exposed on &#x60;GET /api/v1/sites/{id}&#x60; (&#x60;verify_code&#x60;, &#x60;verify_tag_prefix&#x60;, &#x60;verify_meta_tag&#x60;) — the publisher pastes the meta tag on the site root, then POSTs here.  Only meaningful when &#x60;modules.publisher.websites.options.need_verification&#x60; is on (otherwise the site is auto-verified at create time). 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesIdVerifyPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1SitesIdVerifyPostRequest;

  try {
    const data = await api.apiV1SitesIdVerifyPost(body);
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
| **200** | Verified. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Not found |  -  |
| **422** | Verification failed (meta tag not found) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesPost

> apiV1SitesPost(siteCreate)

Create a new website.

Create a website (publisher_sites row). Required: &#x60;name&#x60; + &#x60;url&#x60;. The domain in &#x60;url&#x60; is checked against the publisher-domain blocklist; subdomain duplicates of an existing site are rejected.  Module-gated fields become required when their module is active on the tenant — see &#x60;GET /api/v1/sites/_schema&#x60; for the exact field list applicable to this tenant.  On create, the server resolves the domain to a &#x60;domainid&#x60;. If &#x60;modules.publisher.websites.options.need_verification&#x60; is on, the new site starts at &#x60;is_verified&#x3D;false&#x60; — the publisher must complete the dashboard verification flow before the site can serve ads.  API keys with &#x60;resource_filter.site_ids&#x60; set cannot create new sites — pinning to a fixed list is incompatible with adding new ones (returns 403). 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  const body = {
    // SiteCreate
    siteCreate: {"name":"My Blog","url":"https://www.example.com","description":"Personal blog about hiking","main_catid":12,"categories":[12,47],"sitelanguages":["en"]},
  } satisfies ApiV1SitesPostRequest;

  try {
    const data = await api.apiV1SitesPost(body);
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
| **siteCreate** | [SiteCreate](SiteCreate.md) |  | |

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
| **201** | Created. Fetch the record with &#x60;GET /api/v1/sites/{id}&#x60;. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; — &#x60;errors&#x60; maps each field to its messages (name taken, URL invalid or blocked, categories/languages required, …). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SitesSchemaGet

> ApiV1SitesSchemaGet200Response apiV1SitesSchemaGet()

Field metadata for site create/update.

Returns the canonical field list for &#x60;POST /api/v1/sites&#x60; and &#x60;PATCH /api/v1/sites/{id}&#x60;. Module-gated fields (&#x60;typeid&#x60;, &#x60;categories&#x60;, &#x60;sitelanguages&#x60;, &#x60;postbacks&#x60;) only appear when the relevant module is active on the calling tenant. 

### Example

```ts
import {
  Configuration,
  SitesApi,
} from 'goadserver-sdk';
import type { ApiV1SitesSchemaGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SitesApi(config);

  try {
    const data = await api.apiV1SitesSchemaGet();
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

[**ApiV1SitesSchemaGet200Response**](ApiV1SitesSchemaGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Site schema. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

