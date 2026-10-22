# SourceOptimizersApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CpaOptimizersGet**](SourceOptimizersApi.md#apiv1cpaoptimizersget) | **GET** /api/v1/cpa-optimizers | List CPA optimizers. |
| [**apiV1CpaOptimizersIdDelete**](SourceOptimizersApi.md#apiv1cpaoptimizersiddelete) | **DELETE** /api/v1/cpa-optimizers/{id} | Delete a CPA optimizer. |
| [**apiV1CpaOptimizersIdGet**](SourceOptimizersApi.md#apiv1cpaoptimizersidget) | **GET** /api/v1/cpa-optimizers/{id} | Show a CPA optimizer. |
| [**apiV1CpaOptimizersIdPut**](SourceOptimizersApi.md#apiv1cpaoptimizersidput) | **PUT** /api/v1/cpa-optimizers/{id} | Replace a CPA optimizer. |
| [**apiV1CpaOptimizersPost**](SourceOptimizersApi.md#apiv1cpaoptimizerspost) | **POST** /api/v1/cpa-optimizers | Create a CPA optimizer. |
| [**apiV1CpmOptimizersActiveGet**](SourceOptimizersApi.md#apiv1cpmoptimizersactiveget) | **GET** /api/v1/cpm-optimizers/active | Does the account have any CPM optimizer? |
| [**apiV1CpmOptimizersGet**](SourceOptimizersApi.md#apiv1cpmoptimizersget) | **GET** /api/v1/cpm-optimizers | List CPM optimizers. |
| [**apiV1CpmOptimizersIdDelete**](SourceOptimizersApi.md#apiv1cpmoptimizersiddelete) | **DELETE** /api/v1/cpm-optimizers/{id} | Delete a CPM optimizer. |
| [**apiV1CpmOptimizersIdGet**](SourceOptimizersApi.md#apiv1cpmoptimizersidget) | **GET** /api/v1/cpm-optimizers/{id} | Show a CPM optimizer. |
| [**apiV1CpmOptimizersIdPut**](SourceOptimizersApi.md#apiv1cpmoptimizersidput) | **PUT** /api/v1/cpm-optimizers/{id} | Replace a CPM optimizer. |
| [**apiV1CpmOptimizersPost**](SourceOptimizersApi.md#apiv1cpmoptimizerspost) | **POST** /api/v1/cpm-optimizers | Create a CPM optimizer. |
| [**apiV1SourceOptimizerConfigGet**](SourceOptimizersApi.md#apiv1sourceoptimizerconfigget) | **GET** /api/v1/source-optimizer/config | Option values for the optimizer forms. |



## apiV1CpaOptimizersGet

> apiV1CpaOptimizersGet()

List CPA optimizers.

A bare array. Money (&#x60;max_cpa&#x60;, the &#x60;target_cpa&#x60; values) is in the account currency — stored ×100 as cents and divided back here. &#x60;target_cpa&#x60; / &#x60;min_margin&#x60; are keyed by conversion-type id (see GET /api/v1/tracking/conversion-types); &#x60;min_margin&#x60; is a percent. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpaOptimizersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  try {
    const data = await api.apiV1CpaOptimizersGet();
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
| **200** | Optimizers. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpaOptimizersIdDelete

> apiV1CpaOptimizersIdDelete(id)

Delete a CPA optimizer.

Soft delete. Returns 202 with &#x60;true&#x60; when a row was deleted, &#x60;false&#x60; when none matched. Refused for a campaign-pinned key.

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpaOptimizersIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CpaOptimizersIdDeleteRequest;

  try {
    const data = await api.apiV1CpaOptimizersIdDelete(body);
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
| **202** | Bare boolean. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpaOptimizersIdGet

> apiV1CpaOptimizersIdGet(id)

Show a CPA optimizer.

&#x60;targets&#x60; is a one-element array (empty when the id is not the caller\&#39;s — no 404); &#x60;conversion_types&#x60; are the account\&#39;s conversion-type slots the &#x60;target_cpa&#x60; keys refer to. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpaOptimizersIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CpaOptimizersIdGetRequest;

  try {
    const data = await api.apiV1CpaOptimizersIdGet(body);
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
| **200** | The optimizer + conversion types. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpaOptimizersIdPut

> apiV1CpaOptimizersIdPut(id, cpaOptimizerBody)

Replace a CPA optimizer.

Full replace with the create validation; fields left out reset to their zero value (&#x60;start_date&#x60; left out keeps the stored date). Refused for a campaign-pinned key. Returns the id. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpaOptimizersIdPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // number
    id: 56,
    // CpaOptimizerBody
    cpaOptimizerBody: ...,
  } satisfies ApiV1CpaOptimizersIdPutRequest;

  try {
    const data = await api.apiV1CpaOptimizersIdPut(body);
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
| **cpaOptimizerBody** | [CpaOptimizerBody](CpaOptimizerBody.md) |  | |

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
| **200** | Saved; the id. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Optimizer not found. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpaOptimizersPost

> apiV1CpaOptimizersPost(cpaOptimizerBody)

Create a CPA optimizer.

&#x60;title&#x60; (non-alphanumerics become &#x60;_&#x60;) and a non-zero &#x60;max_cpa&#x60; are required (422 &#x60;NO_TITLE&#x60; / &#x60;NO_PRICE_GIVEN&#x60;); a malformed &#x60;start_date&#x60; → 422 &#x60;NO_VALID_DATE&#x60;. Money in account currency (stored as cents). &#x60;bounce_max_perc&#x60; outside 0–100 and a &#x60;min_margin&#x60; outside 0–100 are stored as 0. Returns the new id as a bare number. &#x60;id&#x60; / &#x60;type&#x60; are accepted and ignored; any other unknown key → 422 &#x60;unknown_fields&#x60;. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpaOptimizersPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // CpaOptimizerBody
    cpaOptimizerBody: {"title":"CPA 2 EUR","filter_type":"spaceid","max_cpa":20,"max_days":14,"start_date":"2026-10-01","target_cpa":{"1":2.5},"min_margin":{"1":10},"cpa_action":"block","bounce_id":-1,"bounce_check_type":"auto"},
  } satisfies ApiV1CpaOptimizersPostRequest;

  try {
    const data = await api.apiV1CpaOptimizersPost(body);
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
| **cpaOptimizerBody** | [CpaOptimizerBody](CpaOptimizerBody.md) |  | |

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
| **201** | New optimizer id. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpmOptimizersActiveGet

> apiV1CpmOptimizersActiveGet()

Does the account have any CPM optimizer?

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpmOptimizersActiveGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  try {
    const data = await api.apiV1CpmOptimizersActiveGet();
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
| **200** | Bare boolean. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpmOptimizersGet

> apiV1CpmOptimizersGet()

List CPM optimizers.

A bare array (no envelope), ordered by title. Each item is the stored settings merged with &#x60;id&#x60;, &#x60;userid&#x60;, &#x60;title&#x60; and &#x60;type: \&quot;cpm\&quot;&#x60;. Money fields (&#x60;min_spendings&#x60;, &#x60;max_cpa&#x60;) are in the account currency, as entered. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpmOptimizersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  try {
    const data = await api.apiV1CpmOptimizersGet();
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
| **200** | Optimizers. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpmOptimizersIdDelete

> apiV1CpmOptimizersIdDelete(id)

Delete a CPM optimizer.

Soft delete. Refused for a campaign-pinned key.

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpmOptimizersIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CpmOptimizersIdDeleteRequest;

  try {
    const data = await api.apiV1CpmOptimizersIdDelete(body);
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
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Optimizer not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpmOptimizersIdGet

> apiV1CpmOptimizersIdGet(id)

Show a CPM optimizer.

Returns a one-element array (panel shape).

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpmOptimizersIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1CpmOptimizersIdGetRequest;

  try {
    const data = await api.apiV1CpmOptimizersIdGet(body);
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
| **200** | The optimizer. |  -  |
| **404** | Optimizer not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpmOptimizersIdPut

> apiV1CpmOptimizersIdPut(id, cpmOptimizerBody)

Replace a CPM optimizer.

Full replace — the settings become exactly the body (fields left out are cleared). Same validation as create. Every campaign using the optimizer follows the change, so a campaign-pinned key gets 403 &#x60;forbidden_resource&#x60;. Returns the id. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpmOptimizersIdPutRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // number
    id: 56,
    // CpmOptimizerBody
    cpmOptimizerBody: ...,
  } satisfies ApiV1CpmOptimizersIdPutRequest;

  try {
    const data = await api.apiV1CpmOptimizersIdPut(body);
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
| **cpmOptimizerBody** | [CpmOptimizerBody](CpmOptimizerBody.md) |  | |

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
| **200** | Saved; the id. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Optimizer not found. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CpmOptimizersPost

> apiV1CpmOptimizersPost(cpmOptimizerBody)

Create a CPM optimizer.

&#x60;title&#x60; and a non-zero &#x60;min_spendings&#x60; are required (422 &#x60;NO_TITLE_GIVEN&#x60; / &#x60;NO_PRICE_GIVEN&#x60;). Every other listed field is stored as sent. &#x60;id&#x60;, &#x60;type&#x60; and &#x60;userid&#x60; are accepted (and ignored) so a fetched optimizer can be sent back; any other key → 422 &#x60;unknown_fields&#x60;. Returns the new id as a bare number. 

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1CpmOptimizersPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  const body = {
    // CpmOptimizerBody
    cpmOptimizerBody: {"title":"Zone cleaner","opt_type":"0","min_spendings":5,"max_days":30,"start_date":"2026-10-01","conv_type":"1","optimise_with":"conv_count","max_cpa":2,"use_bidoptimiser":0},
  } satisfies ApiV1CpmOptimizersPostRequest;

  try {
    const data = await api.apiV1CpmOptimizersPost(body);
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
| **cpmOptimizerBody** | [CpmOptimizerBody](CpmOptimizerBody.md) |  | |

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
| **200** | New optimizer id. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60; or &#x60;unknown_fields&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1SourceOptimizerConfigGet

> apiV1SourceOptimizerConfigGet()

Option values for the optimizer forms.

The values &#x60;filter_type&#x60;, &#x60;cpa_action&#x60; and &#x60;bounce_check_type&#x60; accept.

### Example

```ts
import {
  Configuration,
  SourceOptimizersApi,
} from 'goadserver-sdk';
import type { ApiV1SourceOptimizerConfigGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SourceOptimizersApi(config);

  try {
    const data = await api.apiV1SourceOptimizerConfigGet();
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
| **200** | Static option lists. |  -  |
| **404** | The tenant has this feature\&#39;s module switched off, or the account lacks the per-user right it needs. Deliberately &#x60;404&#x60; and not &#x60;403&#x60; so an ungranted caller cannot map which routes exist. The same endpoints are hidden from this tenant\&#39;s rendered docs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

