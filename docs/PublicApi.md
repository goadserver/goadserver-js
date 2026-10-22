# PublicApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiPublicDemoGet**](PublicApi.md#apipublicdemoget) | **GET** /api/public/demo | The network\&#39;s ad format demo pages. |
| [**apiPublicDemoSlugGet**](PublicApi.md#apipublicdemoslugget) | **GET** /api/public/demo/{slug} | One ad format demo page (HTML). |
| [**apiPublicOfferwallIdGet**](PublicApi.md#apipublicofferwallidget) | **GET** /api/public/offerwall/{id} | Offerwall list of an offer zone. |
| [**apiPublicOpenapiJsonGet**](PublicApi.md#apipublicopenapijsonget) | **GET** /api/public/openapi.json | OpenAPI spec as JSON. |
| [**apiPublicOpenapiYamlGet**](PublicApi.md#apipublicopenapiyamlget) | **GET** /api/public/openapi.yaml | Raw OpenAPI spec (this document). |
| [**apiPublicRoutesTxtGet**](PublicApi.md#apipublicroutestxtget) | **GET** /api/public/routes.txt | Flat list of public routes — agent-friendly. |



## apiPublicDemoGet

> ApiPublicDemoGet200Response apiPublicDemoGet()

The network\&#39;s ad format demo pages.

White-label live demos of the ad formats this network offers, shown in the panel at /demo (optional per tenant; the admin setting &#x60;panel_settings.options.pages.options.show_demo_pages&#x60;, off by default). Lists only pages with at least one demo whose zone types the network has active. No authentication; 404 while the setting is off. 

### Example

```ts
import {
  Configuration,
  PublicApi,
} from 'goadserver-sdk';
import type { ApiPublicDemoGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new PublicApi();

  try {
    const data = await api.apiPublicDemoGet();
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

[**ApiPublicDemoGet200Response**](ApiPublicDemoGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The demo pages, in hub order. |  -  |
| **404** | Demo pages are switched off for this network. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicDemoSlugGet

> string apiPublicDemoSlugGet(slug)

One ad format demo page (HTML).

The page itself, under the network\&#39;s name, cut down to the demos whose zone types the network offers and renumbered. The panel shows it in an iframe at /demo/{slug}. Served sandboxed (&#x60;Content-Security-Policy: sandbox allow-scripts allow-popups …&#x60;, no &#x60;allow-same-origin&#x60;), so its ad scripts get an opaque origin and cannot reach the panel\&#39;s session. The demo zones run on a demo account; the advertisers are made up. 

### Example

```ts
import {
  Configuration,
  PublicApi,
} from 'goadserver-sdk';
import type { ApiPublicDemoSlugGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new PublicApi();

  const body = {
    // string
    slug: native,
  } satisfies ApiPublicDemoSlugGetRequest;

  try {
    const data = await api.apiPublicDemoSlugGet(body);
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
| **slug** | `string` |  | [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/html`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The demo page. |  -  |
| **404** | Switched off, unknown page, or none of its formats offered. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicOfferwallIdGet

> ApiPublicOfferwallIdGet200Response apiPublicOfferwallIdGet(id)

Offerwall list of an offer zone.

The offers of an offer zone (adzone type 32, its &#x60;offerids&#x60;) as goCtrl\&#39;s &#x60;offerwall&#x60; plugin shows them: title, description, thumbnail, the publisher\&#39;s payout per conversion (in &#x60;currency&#x60;) and the countries the offer converts in (empty &#x3D; all). No authentication; cached 5 minutes, CORS open. GET /api/v1/adspaces/{id}/code of an offer zone returns the offerwall snippet pointing here. The visitor\&#39;s id rides the offer click as &#x60;subid1&#x60;; the publisher\&#39;s conversion postback gets it back with &#x60;{subid1}&#x60;, &#x60;{payout}&#x60; and &#x60;{offerid}&#x60;. 

### Example

```ts
import {
  Configuration,
  PublicApi,
} from 'goadserver-sdk';
import type { ApiPublicOfferwallIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new PublicApi();

  const body = {
    // number
    id: 56,
  } satisfies ApiPublicOfferwallIdGetRequest;

  try {
    const data = await api.apiPublicOfferwallIdGet(body);
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

[**ApiPublicOfferwallIdGet200Response**](ApiPublicOfferwallIdGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The zone\&#39;s offers. |  -  |
| **400** | Not an offer zone, or no offers selected. |  -  |
| **404** | Unknown zone. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


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

