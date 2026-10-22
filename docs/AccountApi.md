# AccountApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1AccountFeaturesGet**](AccountApi.md#apiv1accountfeaturesget) | **GET** /api/v1/account/features | Self-service features and their state. |
| [**apiV1AccountGet**](AccountApi.md#apiv1accountget) | **GET** /api/v1/account | Identity check — returns the authenticated user + scopes of the calling key. |
| [**apiV1AccountMembershipsGet**](AccountApi.md#apiv1accountmembershipsget) | **GET** /api/v1/account/memberships | Accounts this login can act on. |
| [**apiV1AccountNoticesGet**](AccountApi.md#apiv1accountnoticesget) | **GET** /api/v1/account/notices | Account notices. |
| [**apiV1AccountPendingChangesGet**](AccountApi.md#apiv1accountpendingchangesget) | **GET** /api/v1/account/pending-changes | Profile changes awaiting verification. |
| [**apiV1AccountPreferencesGet**](AccountApi.md#apiv1accountpreferencesget) | **GET** /api/v1/account/preferences | Per-member preferences. |
| [**apiV1AccountPreferencesKeyPut**](AccountApi.md#apiv1accountpreferenceskeyputoperation) | **PUT** /api/v1/account/preferences/{key} | Set one preference. |
| [**apiV1AccountProfileGet**](AccountApi.md#apiv1accountprofileget) | **GET** /api/v1/account/profile | The account\&#39;s contact and company details. |
| [**apiV1AccountSalesReferralsGet**](AccountApi.md#apiv1accountsalesreferralsget) | **GET** /api/v1/account/sales-referrals | Your sales referrals — clients assigned to you, their deposits and your commission. |
| [**apiV1AccountSettingsGet**](AccountApi.md#apiv1accountsettingsget) | **GET** /api/v1/account/settings | Account settings. |
| [**apiV1AccountUiLayoutsGet**](AccountApi.md#apiv1accountuilayoutsget) | **GET** /api/v1/account/ui-layouts | Saved menu layouts. |
| [**apiV1AccountUiLayoutsScopeDelete**](AccountApi.md#apiv1accountuilayoutsscopedelete) | **DELETE** /api/v1/account/ui-layouts/{scope} | Reset a menu layout. |
| [**apiV1AccountUiLayoutsScopePut**](AccountApi.md#apiv1accountuilayoutsscopeputoperation) | **PUT** /api/v1/account/ui-layouts/{scope} | Save a menu layout. |
| [**apiV1AccountUsageGet**](AccountApi.md#apiv1accountusageget) | **GET** /api/v1/account/usage | Metered usage for a period. |
| [**apiV1AccountUsageSummaryGet**](AccountApi.md#apiv1accountusagesummaryget) | **GET** /api/v1/account/usage-summary | Inventory counts at a glance. |



## apiV1AccountFeaturesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountFeaturesGet()

Self-service features and their state.

Which optional features the account has switched on. Read-only: turning one on changes what the account is billed for, so activation stays in the panel. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountFeaturesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountFeaturesGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountGet

> ApiV1AccountGet200Response apiV1AccountGet()

Identity check — returns the authenticated user + scopes of the calling key.

Minimal identity payload. Use this to verify a key is alive, discover which user it belongs to, and inspect what scopes the key was granted. No PII beyond name/email/company.  Key management (create/list/revoke) is **not** exposed via the public API — it requires a browser session. Visit MyAccount → API access in the panel. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountGet();
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

[**ApiV1AccountGet200Response**](ApiV1AccountGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Current user identity (and key context if authenticated by API key) |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountMembershipsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountMembershipsGet()

Accounts this login can act on.

Every account the authenticated user is an owner or member of, which of them is active, and the scopes the membership grants. An API key is pinned to one account, so this reports rather than switches — the panel\&#39;s account switch is not on the public API. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountMembershipsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountMembershipsGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountNoticesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountNoticesGet()

Account notices.

Standing notices about the account — verification still outstanding, a field awaiting review, a credential that needs attention. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountNoticesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountNoticesGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountPendingChangesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountPendingChangesGet()

Profile changes awaiting verification.

Changes submitted in the panel that are waiting on an emailed code. Read-only, and account-admin only — the same gate the panel applies. Cancelling or completing one is part of the verification flow and is not exposed here. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountPendingChangesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountPendingChangesGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **403** | The key\&#39;s account role may not read pending changes. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountPreferencesGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountPreferencesGet()

Per-member preferences.

The key-value preferences this membership has set — the default dashboard and similar per-person choices. Scoped to the member, not the account. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountPreferencesGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountPreferencesGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountPreferencesKeyPut

> ApiV1WebhooksIdDelete200Response apiV1AccountPreferencesKeyPut(key, apiV1AccountPreferencesKeyPutRequest)

Set one preference.

Upserts a single key. Values are opaque to the API. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountPreferencesKeyPutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // string | Preference key.
    key: key_example,
    // ApiV1AccountPreferencesKeyPutRequest
    apiV1AccountPreferencesKeyPutRequest: ...,
  } satisfies ApiV1AccountPreferencesKeyPutOperationRequest;

  try {
    const data = await api.apiV1AccountPreferencesKeyPut(body);
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
| **key** | `string` | Preference key. | [Defaults to `undefined`] |
| **apiV1AccountPreferencesKeyPutRequest** | [ApiV1AccountPreferencesKeyPutRequest](ApiV1AccountPreferencesKeyPutRequest.md) |  | |

### Return type

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountProfileGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountProfileGet()

The account\&#39;s contact and company details.

Name, company, address, language and contact fields. Read-only here — changing them goes through the panel\&#39;s verification flow, which the public API deliberately does not expose. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountProfileGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountProfileGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountSalesReferralsGet

> apiV1AccountSalesReferralsGet()

Your sales referrals — clients assigned to you, their deposits and your commission.

For an account the network marked as a sales man (sales-referral module). &#x60;data.is_active: false&#x60; when it is not. Otherwise &#x60;data&#x60; carries &#x60;pct&#x60; (your commission %), &#x60;referral_url&#x60; (your signup link: an account registered through it is assigned to you automatically), &#x60;clients[]&#x60; (&#x60;userid&#x60;, &#x60;name&#x60;, &#x60;company&#x60;, &#x60;assigned_at&#x60;, &#x60;deposits&#x60;, &#x60;commission&#x60;, &#x60;currency&#x60;), &#x60;commissions[]&#x60; (one per paid deposit: &#x60;deposit_id&#x60;, &#x60;client_id&#x60;, &#x60;name&#x60;, &#x60;company&#x60;, &#x60;paid_date&#x60;, &#x60;deposit&#x60;, &#x60;pct&#x60;, &#x60;commission&#x60;, &#x60;currency&#x60;) and &#x60;totals[]&#x60; per currency (&#x60;commission&#x60;, &#x60;commission_month&#x60;, &#x60;deposits&#x60;). Read-only; the network pays commission out itself. Same handler as the panel\&#39;s Referrals tab. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountSalesReferralsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountSalesReferralsGet();
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
| **200** | OK |  -  |
| **401** | Missing or invalid API key. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountSettingsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountSettingsGet()

Account settings.

Currency, payout preferences, email opt-ins and the account\&#39;s default tracking parameters. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountSettingsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountSettingsGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountUiLayoutsGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountUiLayoutsGet()

Saved menu layouts.

Returns the tenant\&#39;s layout, this member\&#39;s own overrides, and whether the caller may edit the tenant-wide one. See docs/UI_LAYOUT.md. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountUiLayoutsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountUiLayoutsGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountUiLayoutsScopeDelete

> ApiV1WebhooksIdDelete200Response apiV1AccountUiLayoutsScopeDelete(scope)

Reset a menu layout.

Drops the override so the scope falls back to the tenant default. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountUiLayoutsScopeDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // string | Layout scope. `nav.user` — the only scope this API accepts.
    scope: scope_example,
  } satisfies ApiV1AccountUiLayoutsScopeDeleteRequest;

  try {
    const data = await api.apiV1AccountUiLayoutsScopeDelete(body);
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
| **scope** | `string` | Layout scope. &#x60;nav.user&#x60; — the only scope this API accepts. | [Defaults to `undefined`] |

### Return type

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountUiLayoutsScopePut

> ApiV1WebhooksIdDelete200Response apiV1AccountUiLayoutsScopePut(scope, apiV1AccountUiLayoutsScopePutRequest)

Save a menu layout.

Writes the layout for one scope. Saving the tenant-wide layout needs the right the panel checks — &#x60;can_edit_tenant&#x60; in the read tells you whether this call will be accepted.  &#x60;scope&#x60; is a registry value, not free text: &#x60;nav.user&#x60; is the only one this API accepts. &#x60;nav.admin&#x60; exists in the same table but belongs to the admin panel, and the account API refuses it (400 &#x60;invalid_scope&#x60;) so a member cannot reach into the admin menu. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountUiLayoutsScopePutOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // string | Layout scope, e.g. the panel area the menu belongs to.
    scope: scope_example,
    // ApiV1AccountUiLayoutsScopePutRequest
    apiV1AccountUiLayoutsScopePutRequest: ...,
  } satisfies ApiV1AccountUiLayoutsScopePutOperationRequest;

  try {
    const data = await api.apiV1AccountUiLayoutsScopePut(body);
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
| **scope** | `string` | Layout scope, e.g. the panel area the menu belongs to. | [Defaults to `undefined`] |
| **apiV1AccountUiLayoutsScopePutRequest** | [ApiV1AccountUiLayoutsScopePutRequest](ApiV1AccountUiLayoutsScopePutRequest.md) |  | |

### Return type

[**ApiV1WebhooksIdDelete200Response**](ApiV1WebhooksIdDelete200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | invalid_scope — unknown scope, or one that belongs to the admin panel. |  -  |
| **422** | invalid_layout — the patch list is malformed; the message names the offending patch. |  -  |
| **403** | Not allowed to write this scope. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountUsageGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountUsageGet(datestart, dateend, dateGroup)

Metered usage for a period.

What the account has consumed of the metered features it is billed for. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountUsageGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  const body = {
    // Date | First day (YYYY-MM-DD). Default: 6 days ago. (optional)
    datestart: 2013-10-20,
    // Date | Last day (YYYY-MM-DD). Default: today. (optional)
    dateend: 2013-10-20,
    // 'day' | 'month' | 'year' | 'sum' | One row per day / month / year, or one total row for the whole range. (optional)
    dateGroup: dateGroup_example,
  } satisfies ApiV1AccountUsageGetRequest;

  try {
    const data = await api.apiV1AccountUsageGet(body);
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
| **datestart** | `Date` | First day (YYYY-MM-DD). Default: 6 days ago. | [Optional] [Defaults to `undefined`] |
| **dateend** | `Date` | Last day (YYYY-MM-DD). Default: today. | [Optional] [Defaults to `undefined`] |
| **dateGroup** | `day`, `month`, `year`, `sum` | One row per day / month / year, or one total row for the whole range. | [Optional] [Defaults to `&#39;day&#39;`] [Enum: day, month, year, sum] |

### Return type

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1AccountUsageSummaryGet

> ApiV1TrackerTrackingLinksIdZoneCostsGet200Response apiV1AccountUsageSummaryGet()

Inventory counts at a glance.

Campaign, website and ad-zone counts plus which roles the account holds — the cheapest way to size an account before pulling its listings. 

### Example

```ts
import {
  Configuration,
  AccountApi,
} from 'goadserver-sdk';
import type { ApiV1AccountUsageSummaryGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AccountApi(config);

  try {
    const data = await api.apiV1AccountUsageSummaryGet();
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

[**ApiV1TrackerTrackingLinksIdZoneCostsGet200Response**](ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

