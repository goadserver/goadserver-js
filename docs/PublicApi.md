# PublicApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiPublicOpenapiJsonGet**](PublicApi.md#apipublicopenapijsonget) | **GET** /api/public/openapi.json | OpenAPI spec as JSON. |
| [**apiPublicOpenapiYamlGet**](PublicApi.md#apipublicopenapiyamlget) | **GET** /api/public/openapi.yaml | Raw OpenAPI spec (this document). |
| [**apiPublicRoutesTxtGet**](PublicApi.md#apipublicroutestxtget) | **GET** /api/public/routes.txt | Flat list of public routes — agent-friendly. |



## apiPublicOpenapiJsonGet

> apiPublicOpenapiJsonGet()

OpenAPI spec as JSON.

### Example

```ts
import {
  Configuration,
  PublicApi,
} from 'goadserver-sdk';
import type { ApiPublicOpenapiJsonGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new PublicApi();

  try {
    const data = await api.apiPublicOpenapiJsonGet();
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

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JSON spec |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicOpenapiYamlGet

> apiPublicOpenapiYamlGet()

Raw OpenAPI spec (this document).

### Example

```ts
import {
  Configuration,
  PublicApi,
} from 'goadserver-sdk';
import type { ApiPublicOpenapiYamlGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new PublicApi();

  try {
    const data = await api.apiPublicOpenapiYamlGet();
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

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | YAML spec |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicRoutesTxtGet

> apiPublicRoutesTxtGet()

Flat list of public routes — agent-friendly.

### Example

```ts
import {
  Configuration,
  PublicApi,
} from 'goadserver-sdk';
import type { ApiPublicRoutesTxtGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new PublicApi();

  try {
    const data = await api.apiPublicRoutesTxtGet();
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

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | text/plain METHOD path  scope  description |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

