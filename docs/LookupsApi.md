# LookupsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1LookupsAdspaceTypesGet**](LookupsApi.md#apiv1lookupsadspacetypesget) | **GET** /api/v1/lookups/adspace-types | Adspace types the caller can publish on this tenant. |
| [**apiV1LookupsAdzoneLocationsGet**](LookupsApi.md#apiv1lookupsadzonelocationsget) | **GET** /api/v1/lookups/adzone-locations | Adzone locations for the tenant. |
| [**apiV1LookupsAdzonesGet**](LookupsApi.md#apiv1lookupsadzonesget) | **GET** /api/v1/lookups/adzones | Find adzone ids (for adzone filters). |
| [**apiV1LookupsBannerSizesGet**](LookupsApi.md#apiv1lookupsbannersizesget) | **GET** /api/v1/lookups/banner-sizes | Banner sizes for banner-flavored adspaces. |
| [**apiV1LookupsBrowsersGet**](LookupsApi.md#apiv1lookupsbrowsersget) | **GET** /api/v1/lookups/browsers | Browser ids (optionally scoped by device type). |
| [**apiV1LookupsCarriersGet**](LookupsApi.md#apiv1lookupscarriersget) | **GET** /api/v1/lookups/carriers | Mobile carriers (ids for carrier targeting). |
| [**apiV1LookupsCategoriesGet**](LookupsApi.md#apiv1lookupscategoriesget) | **GET** /api/v1/lookups/categories | Active sub-categories (optionally scoped to a main). |
| [**apiV1LookupsDeviceTypesGet**](LookupsApi.md#apiv1lookupsdevicetypesget) | **GET** /api/v1/lookups/device-types | Active device types for this tenant. |
| [**apiV1LookupsDomainsGet**](LookupsApi.md#apiv1lookupsdomainsget) | **GET** /api/v1/lookups/domains | Resolve domains to the ids domain filters store. |
| [**apiV1LookupsIspsGet**](LookupsApi.md#apiv1lookupsispsget) | **GET** /api/v1/lookups/isps | Find ISP ids (for ISP filters). |
| [**apiV1LookupsLinkTypesGet**](LookupsApi.md#apiv1lookupslinktypesget) | **GET** /api/v1/lookups/link-types | Active link types for the tenant. |
| [**apiV1LookupsMainCategoriesGet**](LookupsApi.md#apiv1lookupsmaincategoriesget) | **GET** /api/v1/lookups/main-categories | Active main categories for the tenant. |
| [**apiV1LookupsOperatingSystemsGet**](LookupsApi.md#apiv1lookupsoperatingsystemsget) | **GET** /api/v1/lookups/operating-systems | Operating-system ids (optionally scoped by device type). |
| [**apiV1LookupsPublishersGet**](LookupsApi.md#apiv1lookupspublishersget) | **GET** /api/v1/lookups/publishers | Find publisher ids (for publisher_excl filters). |
| [**apiV1LookupsRatingsGet**](LookupsApi.md#apiv1lookupsratingsget) | **GET** /api/v1/lookups/ratings | Active content ratings for the tenant. |
| [**apiV1LookupsReelTypesGet**](LookupsApi.md#apiv1lookupsreeltypesget) | **GET** /api/v1/lookups/reel-types | Active reel types for the tenant. |
| [**apiV1LookupsRegionsGet**](LookupsApi.md#apiv1lookupsregionsget) | **GET** /api/v1/lookups/regions | Walk the geo region tree (one level per call). |
| [**apiV1LookupsWebsiteLanguagesGet**](LookupsApi.md#apiv1lookupswebsitelanguagesget) | **GET** /api/v1/lookups/website-languages | Supported website languages (ISO codes). |
| [**apiV1LookupsWebsiteTypesGet**](LookupsApi.md#apiv1lookupswebsitetypesget) | **GET** /api/v1/lookups/website-types | Active website types for the tenant. |



## apiV1LookupsAdspaceTypesGet

> ApiV1LookupsAdspaceTypesGet200Response apiV1LookupsAdspaceTypesGet()

Adspace types the caller can publish on this tenant.

Returns the adspace types exposable via the public API for the current tenant + caller. Filters applied (same as the panel adspace-create page):  - &#x60;is_active &#x3D; true&#x60; — tenant has enabled the type - &#x60;in_api &#x3D; true&#x60; — type is exposable via the public API - &#x60;mod_enabled&#x60; chain enabled for the user - &#x60;need_rights&#x60; gate satisfied (when set)  Each entry carries the metadata needed to drive a create form:  - &#x60;id&#x60; / &#x60;key&#x60; / &#x60;name&#x60; / &#x60;adtype_id&#x60; - &#x60;settings_key&#x60; — the body key for the type-specific block   on &#x60;POST /api/v1/adspaces/{type}&#x60; (e.g. &#x60;banner_settings&#x60;,   &#x60;pop_settings&#x60;, &#x60;native_settings&#x60;). Empty string means the   type takes no nested settings block. - &#x60;selling_types&#x60; — &#x60;[\&quot;ron\&quot;]&#x60;, &#x60;[\&quot;ron\&quot;,\&quot;cpm\&quot;]&#x60;, etc. - &#x60;use_min_price&#x60; / &#x60;use_smartzone&#x60; / &#x60;has_own_ads&#x60; / &#x60;has_preview&#x60; - &#x60;options&#x60; — config-driven flag bag (boolean toggles, banner-size   selects, country exclude lists, …) that map to top-level body   fields on create. The same &#x60;options&#x60; shape is mirrored on   &#x60;GET /api/v1/adspaces/{type}/_schema&#x60;.  Use the &#x60;key&#x60; value as the &#x60;{type}&#x60; path parameter on &#x60;GET /api/v1/adspaces/{type}/_schema&#x60; and &#x60;POST /api/v1/adspaces/{type}&#x60;. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsAdspaceTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsAdspaceTypesGet();
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

[**ApiV1LookupsAdspaceTypesGet200Response**](ApiV1LookupsAdspaceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Adspace types available for create on this tenant. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsAdzoneLocationsGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsAdzoneLocationsGet()

Adzone locations for the tenant.

Returns the configured adzone locations for the tenant. Use &#x60;id&#x60; to fill &#x60;locationid&#x60; on adspace create, and in &#x60;location_ids&#x60; on a banner campaign (ad type 2) — required on campaign create when this list is non-empty (a campaign may not target every placement at the floor price). Only meaningful when &#x60;modules.global.adzone_locations&#x60; is enabled — empty list otherwise. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsAdzoneLocationsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsAdzoneLocationsGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Adzone locations. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsAdzonesGet

> apiV1LookupsAdzonesGet(term, bulk)

Find adzone ids (for adzone filters).

The panel\&#39;s adzone picker. Two modes:  * &#x60;term&#x60; (≥ 2 characters) — up to 50 zones whose name or site URL   contains it, or whose id equals it. Answer: a bare array   &#x60;[{id, label}]&#x60; (label &#x3D; &#x60;zone name (site url)&#x60;). * &#x60;bulk&#x60; — newline-separated adzone ids; answer   &#x60;{data: [{id, label}], not_found: [...]}&#x60;.  Labels follow the panel\&#39;s source-name rule: an account without the \&quot;see source names\&quot; right gets the id as the label, and &#x60;term&#x60; then matches exact ids only. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsAdzonesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // string (optional)
    term: term_example,
    // string | Newline-separated adzone ids; wins over term. (optional)
    bulk: bulk_example,
  } satisfies ApiV1LookupsAdzonesGetRequest;

  try {
    const data = await api.apiV1LookupsAdzonesGet(body);
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
| **term** | `string` |  | [Optional] [Defaults to `undefined`] |
| **bulk** | `string` | Newline-separated adzone ids; wins over term. | [Optional] [Defaults to `undefined`] |

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
| **200** | &#x60;term&#x60;: array of {id, label}; &#x60;bulk&#x60;: {data, not_found}. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsBannerSizesGet

> ApiV1LookupsBannerSizesGet200Response apiV1LookupsBannerSizesGet()

Banner sizes for banner-flavored adspaces.

Returns the active banner sizes for the tenant. Use the &#x60;id&#x60; value as &#x60;adsizeid&#x60; (or &#x60;banner_settings.sizeid&#x60;) when creating a banner-flavored adspace (&#x60;bannerads&#x60;, &#x60;fixim_banner&#x60;, &#x60;impopup&#x60;, &#x60;interstitialads&#x60;, &#x60;interstitial_banner&#x60;, &#x60;invideo_banner&#x60;).  Sizes are sorted with common IAB formats first (300x250 → 728x90 → 160x600 → …). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsBannerSizesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsBannerSizesGet();
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

[**ApiV1LookupsBannerSizesGet200Response**](ApiV1LookupsBannerSizesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active banner sizes. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsBrowsersGet

> ApiV1LookupsBrowsersGet200Response apiV1LookupsBrowsersGet(deviceTypeIds)

Browser ids (optionally scoped by device type).

Returns &#x60;{id, name}&#x60; pairs for browsers known to the platform. Browsers are stored **per device type**, so callers that already know which devices their campaign targets should pass &#x60;?device_type_ids&#x3D;&lt;csv&gt;&#x60; to scope the listing — e.g. &#x60;?device_type_ids&#x3D;1,2&#x60; for desktop + mobile.  Without the filter, returns the tenant-active set across all device types (some entries may not actually serve on every device). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsBrowsersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // string | Comma-separated device-type ids from `GET /api/v1/lookups/device-types`. Empty = all. (optional)
    deviceTypeIds: 1,2,
  } satisfies ApiV1LookupsBrowsersGetRequest;

  try {
    const data = await api.apiV1LookupsBrowsersGet(body);
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
| **deviceTypeIds** | `string` | Comma-separated device-type ids from &#x60;GET /api/v1/lookups/device-types&#x60;. Empty &#x3D; all. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1LookupsBrowsersGet200Response**](ApiV1LookupsBrowsersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Browsers matching the filter. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsCarriersGet

> ApiV1LookupsCarriersGet200Response apiV1LookupsCarriersGet()

Mobile carriers (ids for carrier targeting).

Every mobile carrier the ad server can target, with its country. Use &#x60;id&#x60; for campaign carrier targeting (&#x60;carrier_id&#x60;) and for &#x60;carrier_id&#x60; conditions in bid rulesets. Same cached list as the panel\&#39;s carrier dropdown (~1,150 rows, refreshed every 5 minutes). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsCarriersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsCarriersGet();
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

[**ApiV1LookupsCarriersGet200Response**](ApiV1LookupsCarriersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Carriers. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsCategoriesGet

> ApiV1LookupsCategoriesGet200Response apiV1LookupsCategoriesGet(mainCatid)

Active sub-categories (optionally scoped to a main).

Returns active categories. Pass &#x60;?main_catid&#x3D;N&#x60; to limit the result to categories belonging to that main category — the legacy &#x60;main_categories&#x60; column on each row is a CSV of main-id memberships, so a category can belong to several mains.  Use &#x60;id&#x60; to fill &#x60;catid&#x60; on adspace create or populate the &#x60;categories&#x60; array on site create.  **Cross-resource lookup** — accessible to keys with any of &#x60;sites.read&#x60;, &#x60;adspaces.read&#x60;, &#x60;tracking.read&#x60;, or &#x60;campaigns.read&#x60;. (Any scope that legitimately needs category ids opens it.) 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsCategoriesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // number | Filter to categories under this main. (optional)
    mainCatid: 56,
  } satisfies ApiV1LookupsCategoriesGetRequest;

  try {
    const data = await api.apiV1LookupsCategoriesGet(body);
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
| **mainCatid** | `number` | Filter to categories under this main. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1LookupsCategoriesGet200Response**](ApiV1LookupsCategoriesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active categories matching the filter. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsDeviceTypesGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsDeviceTypesGet()

Active device types for this tenant.

Returns &#x60;{id, name}&#x60; pairs for the device types active on this tenant (typically Desktop, Mobile, Tablet, …). Use these ids:   - in the &#x60;device_type_ids&#x60; field on campaign create / update,   - and as the &#x60;device_type_ids&#x60; query filter for     &#x60;/api/v1/lookups/browsers&#x60; and     &#x60;/api/v1/lookups/operating-systems&#x60; (browsers + OSes are     stored per device type). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsDeviceTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsDeviceTypesGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active device types. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsDomainsGet

> apiV1LookupsDomainsGet(bulk)

Resolve domains to the ids domain filters store.

The panel\&#39;s bulk domain picker. &#x60;bulk&#x60; is a newline-separated list of domains, URLs (protocol, path and &#x60;www.&#x60; are stripped) or domain ids; each known one comes back as &#x60;{id, label}&#x60; and the rest are listed in &#x60;not_found&#x60;. Domain filters accept hostnames directly too (&#x60;items&#x60; on POST /api/v1/filters), so this is mostly for showing what an id means. Without &#x60;bulk&#x60; the answer is an empty array &#x60;[]&#x60;. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsDomainsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // string
    bulk: example.com
https://www.spam.test/x
123,
  } satisfies ApiV1LookupsDomainsGetRequest;

  try {
    const data = await api.apiV1LookupsDomainsGet(body);
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
| **bulk** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Matches. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsIspsGet

> apiV1LookupsIspsGet(term, bulk)

Find ISP ids (for ISP filters).

The panel\&#39;s ISP picker. &#x60;term&#x60; (≥ 2 characters) returns up to 50 ISPs whose name contains it as a bare array &#x60;[{id, label}]&#x60; (label &#x3D; &#x60;name (country) (connection type)&#x60;). &#x60;bulk&#x60; takes newline-separated name fragments and returns every matching ISP (one organisation can span many ASNs) as &#x60;{data, not_found, truncated, limit}&#x60; — capped at &#x60;limit&#x60; (1000) rows, with &#x60;truncated: true&#x60; when the cap clipped it (then &#x60;not_found&#x60; is not computed). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsIspsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // string (optional)
    term: term_example,
    // string | Newline-separated name fragments; wins over term. (optional)
    bulk: bulk_example,
  } satisfies ApiV1LookupsIspsGetRequest;

  try {
    const data = await api.apiV1LookupsIspsGet(body);
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
| **term** | `string` |  | [Optional] [Defaults to `undefined`] |
| **bulk** | `string` | Newline-separated name fragments; wins over term. | [Optional] [Defaults to `undefined`] |

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
| **200** | &#x60;term&#x60;: array of {id, label}; &#x60;bulk&#x60;: {data, not_found, truncated, limit}. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsLinkTypesGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsLinkTypesGet()

Active link types for the tenant.

The tenant\&#39;s link types. Use &#x60;id&#x60; in &#x60;location_ids&#x60; on a link campaign (ad type 6); required on create when this list is non-empty. Empty unless &#x60;modules.global.link_types&#x60; is active. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsLinkTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsLinkTypesGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The active types (empty when the module is off). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsMainCategoriesGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsMainCategoriesGet()

Active main categories for the tenant.

Returns active main categories. Use &#x60;id&#x60; to fill &#x60;main_catid&#x60; on site create or adspace create, or as an input to &#x60;/api/v1/lookups/categories?main_catid&#x3D;N&#x60; for the sub-categories.  **Cross-resource lookup** — accessible to keys with any of &#x60;sites.read&#x60;, &#x60;adspaces.read&#x60;, &#x60;tracking.read&#x60;, or &#x60;campaigns.read&#x60;. (Any scope that legitimately needs category ids opens it.) 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsMainCategoriesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsMainCategoriesGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active main categories. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsOperatingSystemsGet

> ApiV1LookupsBrowsersGet200Response apiV1LookupsOperatingSystemsGet(deviceTypeIds)

Operating-system ids (optionally scoped by device type).

Returns &#x60;{id, name}&#x60; pairs for operating systems active on this tenant. OS visibility is **per device type** — pass &#x60;?device_type_ids&#x3D;&lt;csv&gt;&#x60; to scope the listing to OSes valid on those devices (e.g. iOS / Android only show under mobile).  Without the filter, returns the tenant-active union across all device types (Mobile OSes will appear even when you\&#39;re targeting Desktop, etc.). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsOperatingSystemsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // string | Comma-separated device-type ids from `GET /api/v1/lookups/device-types`. Empty = all. (optional)
    deviceTypeIds: 2,
  } satisfies ApiV1LookupsOperatingSystemsGetRequest;

  try {
    const data = await api.apiV1LookupsOperatingSystemsGet(body);
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
| **deviceTypeIds** | `string` | Comma-separated device-type ids from &#x60;GET /api/v1/lookups/device-types&#x60;. Empty &#x3D; all. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1LookupsBrowsersGet200Response**](ApiV1LookupsBrowsersGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Operating systems matching the filter. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsPublishersGet

> apiV1LookupsPublishersGet(term, bulk)

Find publisher ids (for publisher_excl filters).

The panel\&#39;s publisher picker for the &#x60;publisher_excl&#x60; filter — only publishers on your own network. &#x60;term&#x60; is either a publisher id (exact match, &#x60;#&#x60; prefix allowed) or a name fragment (≥ 2 characters, company or contact name, up to 50 hits), answered as a bare array &#x60;[{id, label}]&#x60; with label &#x3D; company or contact name. &#x60;bulk&#x60; takes newline-separated ids and returns &#x60;{data, not_found}&#x60;. Where the network hides traffic-source names from advertisers, the label is the bare id and only exact-id lookups match. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsPublishersGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // string (optional)
    term: term_example,
    // string | Newline-separated publisher ids; wins over term. (optional)
    bulk: bulk_example,
  } satisfies ApiV1LookupsPublishersGetRequest;

  try {
    const data = await api.apiV1LookupsPublishersGet(body);
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
| **term** | `string` |  | [Optional] [Defaults to `undefined`] |
| **bulk** | `string` | Newline-separated publisher ids; wins over term. | [Optional] [Defaults to `undefined`] |

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
| **200** | &#x60;term&#x60;: array of {id, label}; &#x60;bulk&#x60;: {data, not_found}. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsRatingsGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsRatingsGet()

Active content ratings for the tenant.

Returns active content ratings. Use &#x60;id&#x60; to fill &#x60;ratingid&#x60; on adspace create. Only enforced when &#x60;modules.global.rating&#x60; is active — empty list otherwise. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsRatingsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsRatingsGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active ratings. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsReelTypesGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsReelTypesGet()

Active reel types for the tenant.

The tenant\&#39;s reel types. Use &#x60;id&#x60; in &#x60;location_ids&#x60; on a reel campaign (ad type 20); required on create when this list is non-empty. Empty unless &#x60;modules.global.reel_types&#x60; is active. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsReelTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsReelTypesGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The active types (empty when the module is off). |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsRegionsGet

> ApiV1LookupsRegionsGet200Response apiV1LookupsRegionsGet(parentId, ids)

Walk the geo region tree (one level per call).

Hierarchical drill-down browser for geo region targeting. Returns only the direct children of &#x60;parent_id&#x60; per call so callers walk the tree top-down, one level at a time:  &#x60;&#x60;&#x60; parent_id absent / 0  → continents (level 0) parent_id &#x3D; &lt;continent id&gt;  → countries on that continent (level 1) parent_id &#x3D; &lt;country id&gt;    → states / provinces in that country (level 2) parent_id &#x3D; &lt;state id&gt;      → cities / sub-regions (level 3, if any) parent_id &#x3D; &lt;city id&gt;       → leaf items (level 4, if any) &#x60;&#x60;&#x60;  Each item carries &#x60;level&#x60; so the caller can stop drilling once they\&#39;ve hit the granularity they want. Campaigns most commonly target countries (level 1) or states / provinces (level 2), but deeper levels are valid too.  **The id you collect from this endpoint is what you send back to &#x60;regions&#x60; on a campaign create / update.** Always send the most specific (leaf) id you actually want — see the &#x60;regions&#x60; field notes on &#x60;POST /api/v1/campaigns/{type}&#x60; and &#x60;PATCH /api/v1/campaigns/{type}/{id}&#x60; for why.  **Performance:** the geo tree is preloaded into memory at server startup (~158k rows), so every call is a map lookup, not a DB query. A response is capped at 2000 children per call (no single legitimate parent has more than that). 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsRegionsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  const body = {
    // number | Parent region id to list children of. 0 (default) returns continents. (optional)
    parentId: 56,
    // string | Comma-separated region ids to look up directly instead of walking the tree (e.g. the ids in a campaign\'s `regions` field), up to 500; unknown ids are left out. The answer then carries `ids: true` and no `parent_id`. (optional)
    ids: 2300660,2635167,
  } satisfies ApiV1LookupsRegionsGetRequest;

  try {
    const data = await api.apiV1LookupsRegionsGet(body);
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
| **parentId** | `number` | Parent region id to list children of. 0 (default) returns continents. | [Optional] [Defaults to `0`] |
| **ids** | `string` | Comma-separated region ids to look up directly instead of walking the tree (e.g. the ids in a campaign\&#39;s &#x60;regions&#x60; field), up to 500; unknown ids are left out. The answer then carries &#x60;ids: true&#x60; and no &#x60;parent_id&#x60;. | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiV1LookupsRegionsGet200Response**](ApiV1LookupsRegionsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Children of the requested parent. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsWebsiteLanguagesGet

> ApiV1LookupsWebsiteLanguagesGet200Response apiV1LookupsWebsiteLanguagesGet()

Supported website languages (ISO codes).

Returns the supported website languages from the &#x60;adlanguages&#x60; table. Pass the &#x60;code&#x60; values in the &#x60;sitelanguages&#x60; array on site create. Required when &#x60;modules.global.website_languages&#x60; is active. Non-trusted publishers may select only one. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsWebsiteLanguagesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsWebsiteLanguagesGet();
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

[**ApiV1LookupsWebsiteLanguagesGet200Response**](ApiV1LookupsWebsiteLanguagesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Website languages. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1LookupsWebsiteTypesGet

> ApiV1LookupsDeviceTypesGet200Response apiV1LookupsWebsiteTypesGet()

Active website types for the tenant.

Returns the configured website types. Use &#x60;id&#x60; to fill &#x60;typeid&#x60; on site create. Only meaningful when &#x60;modules.global.website_types&#x60; is enabled — empty list otherwise. 

### Example

```ts
import {
  Configuration,
  LookupsApi,
} from 'goadserver-sdk';
import type { ApiV1LookupsWebsiteTypesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LookupsApi(config);

  try {
    const data = await api.apiV1LookupsWebsiteTypesGet();
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

[**ApiV1LookupsDeviceTypesGet200Response**](ApiV1LookupsDeviceTypesGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Website types. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

