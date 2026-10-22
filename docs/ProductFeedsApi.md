# ProductFeedsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1ProductFeedsGet**](ProductFeedsApi.md#apiv1productfeedsget) | **GET** /api/v1/product-feeds | List product feeds. |
| [**apiV1ProductFeedsIdDelete**](ProductFeedsApi.md#apiv1productfeedsiddelete) | **DELETE** /api/v1/product-feeds/{id} | Delete a product feed. |
| [**apiV1ProductFeedsIdGet**](ProductFeedsApi.md#apiv1productfeedsidget) | **GET** /api/v1/product-feeds/{id} | Show a product feed. |
| [**apiV1ProductFeedsIdItemsGet**](ProductFeedsApi.md#apiv1productfeedsiditemsget) | **GET** /api/v1/product-feeds/{id}/items | The feed\&#39;s products and their ads. |
| [**apiV1ProductFeedsIdPatch**](ProductFeedsApi.md#apiv1productfeedsidpatch) | **PATCH** /api/v1/product-feeds/{id} | Change a product feed. |
| [**apiV1ProductFeedsIdSyncPost**](ProductFeedsApi.md#apiv1productfeedsidsyncpost) | **POST** /api/v1/product-feeds/{id}/sync | Sync a product feed now. |
| [**apiV1ProductFeedsPost**](ProductFeedsApi.md#apiv1productfeedspostoperation) | **POST** /api/v1/product-feeds | Add a product feed. |
| [**apiV1ProductFeedsPreviewPost**](ProductFeedsApi.md#apiv1productfeedspreviewpostoperation) | **POST** /api/v1/product-feeds/preview | Preview a dynamic banner. |



## apiV1ProductFeedsGet

> apiV1ProductFeedsGet()

List product feeds.

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  try {
    const data = await api.apiV1ProductFeedsGet();
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
| **200** | &#x60;data&#x60; &#x3D; the feeds, newest first; &#x60;banner_sizes&#x60; &#x3D; the tenant\&#39;s banner sizes {id, name, width, height} for &#x60;bansizeid&#x60;; &#x60;templates&#x60; &#x3D; the built-in layouts. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsIdDelete

> apiV1ProductFeedsIdDelete(id)

Delete a product feed.

The feed goes; its ads stay in the campaign, paused, so their stats remain.

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProductFeedsIdDeleteRequest;

  try {
    const data = await api.apiV1ProductFeedsIdDelete(body);
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
| **200** | &#x60;data&#x60; &#x3D; &#x60;{id, deleted: true}&#x60;. |  -  |
| **404** | Feed not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsIdGet

> apiV1ProductFeedsIdGet(id)

Show a product feed.

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProductFeedsIdGetRequest;

  try {
    const data = await api.apiV1ProductFeedsIdGet(body);
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
| **200** | The feed with its last run. |  -  |
| **404** | Feed not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsIdItemsGet

> apiV1ProductFeedsIdItemsGet(id)

The feed\&#39;s products and their ads.

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsIdItemsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProductFeedsIdItemsGetRequest;

  try {
    const data = await api.apiV1ProductFeedsIdItemsGet(body);
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
| **200** | &#x60;data&#x60; &#x3D; products (at most 5000): &#x60;external_id&#x60;, &#x60;ad_id&#x60;, &#x60;title&#x60;, &#x60;price&#x60;, &#x60;in_stock&#x60;, &#x60;seen_at&#x60;. |  -  |
| **404** | Feed not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsIdPatch

> apiV1ProductFeedsIdPatch(id)

Change a product feed.

Any of the POST fields, plus &#x60;is_active&#x60; (false stops scheduled syncs; existing ads stay as they are).

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsIdPatchRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProductFeedsIdPatchRequest;

  try {
    const data = await api.apiV1ProductFeedsIdPatch(body);
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
| **200** | &#x60;data&#x60; &#x3D; the feed. |  -  |
| **404** | Feed not found. |  -  |
| **422** | &#x60;validation_error&#x60;. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsIdSyncPost

> apiV1ProductFeedsIdSyncPost(id)

Sync a product feed now.

Starts a run in the background (one at a time per feed); poll GET /product-feeds/{id} for the result. A run creates at most 1000 new ads.

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsIdSyncPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1ProductFeedsIdSyncPostRequest;

  try {
    const data = await api.apiV1ProductFeedsIdSyncPost(body);
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
| **202** | &#x60;data&#x60; &#x3D; &#x60;{id, running: true}&#x60;. |  -  |
| **404** | Feed not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsPost

> apiV1ProductFeedsPost(apiV1ProductFeedsPostRequest)

Add a product feed.

Saved, then synced once in the background (watch &#x60;running&#x60;, &#x60;last_status&#x60;, &#x60;last_message&#x60;). Body: &#x60;campaign_id&#x60; (required — one of your RON campaigns with ad type native 3 or Search Ads 42), &#x60;url&#x60; (required, http(s), public host, at most 20 MB), &#x60;name&#x60;, &#x60;format&#x60; (&#x60;auto&#x60; | &#x60;xml&#x60; | &#x60;csv&#x60;, default auto), &#x60;refresh_hours&#x60; (0 &#x3D; manual, 1, 6, 12 or 24), &#x60;max_items&#x60; (1-5000), &#x60;price_in_title&#x60; (bool, the price is appended to the ad title), &#x60;bid&#x60; (the new ads\&#39; bid; 0 &#x3D; the bid of the campaign\&#39;s newest ad). Each product needs &#x60;id&#x60;, &#x60;title&#x60;, an http(s) &#x60;link&#x60; and &#x60;image_link&#x60;; &#x60;sale_price&#x60; wins over &#x60;price&#x60;; availability &#x60;out_of_stock&#x60; / &#x60;discontinued&#x60; pauses its ad.  Dynamic banners (banner campaigns, ad type 2 — required there, refused on native ones): &#x60;template&#x60; (&#x60;card&#x60; | &#x60;overlay&#x60; | &#x60;minimal&#x60; | &#x60;custom&#x60;), &#x60;bansizeid&#x60; (one of &#x60;banner_sizes&#x60;), &#x60;cta&#x60; (button text, ≤ 30, default \&quot;Shop now\&quot;), &#x60;accent&#x60; (#rrggbb button / price colour), &#x60;template_html&#x60; (custom only, ≤ 20000 bytes; slots {{title}} {{price}} {{image}} {{description}} {{display}} {{cta}} {{accent}}, values HTML-escaped; link to {click_url} — without it the whole banner is wrapped in the click link). Preview with POST /product-feeds/preview. &#x60;retarget&#x60; (bool): every product ad carries ad_options.feed {pk, rt}; put &#x60;pid&#x3D;&lt;product id&gt;[,&lt;id&gt;…]&#x60; on your retargeting pixel (&#x60;/rtpixel.go?id&#x3D;&lt;pixel&gt;&amp;pid&#x3D;SKU-1&#x60;) on product pages and a visitor who viewed products of this feed sees those first (30 days). 

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // ApiV1ProductFeedsPostRequest
    apiV1ProductFeedsPostRequest: {"campaign_id":454450,"url":"https://shop.example.com/feed.xml","name":"Shop catalogue","refresh_hours":6,"max_items":500,"price_in_title":true},
  } satisfies ApiV1ProductFeedsPostOperationRequest;

  try {
    const data = await api.apiV1ProductFeedsPost(body);
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
| **apiV1ProductFeedsPostRequest** | [ApiV1ProductFeedsPostRequest](ApiV1ProductFeedsPostRequest.md) |  | |

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
| **201** | &#x60;data&#x60; &#x3D; the new feed. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | &#x60;validation_error&#x60;: campaign_id, url, format, refresh_hours, max_items, bid, template, bansizeid, accent, template_html — or the 20-feed limit. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1ProductFeedsPreviewPost

> apiV1ProductFeedsPreviewPost(apiV1ProductFeedsPreviewPostRequest)

Preview a dynamic banner.

Renders one product into a banner template without saving anything: body &#x60;{template, template_html, cta, accent, bansizeid, product?}&#x60; (&#x60;product&#x60; &#x3D; {title, price, image_link, link, description}; a sample product without it). Answers &#x60;{html, width, height}&#x60;; the html holds the &#x60;{click_url}&#x60; placeholder the ad server fills when it serves. 

### Example

```ts
import {
  Configuration,
  ProductFeedsApi,
} from 'goadserver-sdk';
import type { ApiV1ProductFeedsPreviewPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductFeedsApi(config);

  const body = {
    // ApiV1ProductFeedsPreviewPostRequest
    apiV1ProductFeedsPreviewPostRequest: {"template":"card","bansizeid":3,"cta":"Shop now","accent":"#0b7a4b"},
  } satisfies ApiV1ProductFeedsPreviewPostOperationRequest;

  try {
    const data = await api.apiV1ProductFeedsPreviewPost(body);
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
| **apiV1ProductFeedsPreviewPostRequest** | [ApiV1ProductFeedsPreviewPostRequest](ApiV1ProductFeedsPreviewPostRequest.md) |  | |

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
| **200** | The rendered banner. |  -  |
| **422** | &#x60;validation_error&#x60; (template, accent, template_html). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

