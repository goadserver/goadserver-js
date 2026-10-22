# BidRulesetsApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1BidRulesetsGet**](BidRulesetsApi.md#apiv1bidrulesetsget) | **GET** /api/v1/bid-rulesets | List the caller\&#39;s bid rulesets (lightweight rows). |
| [**apiV1BidRulesetsIdClonePost**](BidRulesetsApi.md#apiv1bidrulesetsidclonepostoperation) | **POST** /api/v1/bid-rulesets/{id}/clone | Clone a ruleset with all its rules. |
| [**apiV1BidRulesetsIdDelete**](BidRulesetsApi.md#apiv1bidrulesetsiddelete) | **DELETE** /api/v1/bid-rulesets/{id} | Soft-delete a ruleset. |
| [**apiV1BidRulesetsIdGet**](BidRulesetsApi.md#apiv1bidrulesetsidget) | **GET** /api/v1/bid-rulesets/{id} | Show one ruleset, including all rules. |
| [**apiV1BidRulesetsIdPatch**](BidRulesetsApi.md#apiv1bidrulesetsidpatchoperation) | **PATCH** /api/v1/bid-rulesets/{id} | Update a ruleset\&#39;s metadata and/or replace its rules. |
| [**apiV1BidRulesetsPost**](BidRulesetsApi.md#apiv1bidrulesetspostoperation) | **POST** /api/v1/bid-rulesets | Create a new bid ruleset (with rules in one shot). |



## apiV1BidRulesetsGet

> ApiV1BidRulesetsGet200Response apiV1BidRulesetsGet(paytype, includeDeleted)

List the caller\&#39;s bid rulesets (lightweight rows).

Returns every non-deleted ruleset of the authenticated user, optionally filtered by paytype. Not paginated: &#x60;page&#x60; is always 1 and &#x60;per_page&#x60; / &#x60;total_rows&#x60; equal the number of rows returned (users typically hold fewer than 50 rulesets). Each row carries identity + summary counts (&#x60;rule_count&#x60;, &#x60;campaign_count&#x60;) but **not** the rule rows themselves — fetch the full record via &#x60;GET /api/v1/bid-rulesets/{id}&#x60; when you need the conditions JSON for editing.  Use this endpoint to populate ruleset-picker UIs (e.g. the campaign-edit \&quot;Use bid rules\&quot; picker) and library views.  Default sort is &#x60;updated DESC&#x60;. Soft-deleted rulesets are excluded.  Reference: [&#x60;docs/BID_RULES.md&#x60;](BID_RULES.md). 

### Example

```ts
import {
  Configuration,
  BidRulesetsApi,
} from 'goadserver-sdk';
import type { ApiV1BidRulesetsGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BidRulesetsApi(config);

  const body = {
    // 'cpc' | 'cpm' | 'other' | Filter to rulesets of one paytype. (optional)
    paytype: paytype_example,
    // boolean | Also return soft-deleted rulesets (`is_deleted: true`). (optional)
    includeDeleted: true,
  } satisfies ApiV1BidRulesetsGetRequest;

  try {
    const data = await api.apiV1BidRulesetsGet(body);
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
| **paytype** | `cpc`, `cpm`, `other` | Filter to rulesets of one paytype. | [Optional] [Defaults to `undefined`] [Enum: cpc, cpm, other] |
| **includeDeleted** | `boolean` | Also return soft-deleted rulesets (&#x60;is_deleted: true&#x60;). | [Optional] [Defaults to `false`] |

### Return type

[**ApiV1BidRulesetsGet200Response**](ApiV1BidRulesetsGet200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ruleset list (all rows in one page). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1BidRulesetsIdClonePost

> BidRuleset apiV1BidRulesetsIdClonePost(id, apiV1BidRulesetsIdClonePostRequest)

Clone a ruleset with all its rules.

Duplicates the ruleset row and every non-deleted rule on it. New ruleset name defaults to &#x60;&lt;original&gt; (copy)&#x60; — override via the body. Same &#x60;paytype&#x60; and &#x60;default_tz&#x60; as the source. Ad / campaign attachments are **not** copied — the clone starts unattached (&#x60;campaign_count: 0&#x60;).  Use this to fork a working ruleset for an experiment without affecting the live campaigns that reference the original.  Reference: [&#x60;docs/BID_RULES.md&#x60;](BID_RULES.md). 

### Example

```ts
import {
  Configuration,
  BidRulesetsApi,
} from 'goadserver-sdk';
import type { ApiV1BidRulesetsIdClonePostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BidRulesetsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1BidRulesetsIdClonePostRequest (optional)
    apiV1BidRulesetsIdClonePostRequest: ...,
  } satisfies ApiV1BidRulesetsIdClonePostOperationRequest;

  try {
    const data = await api.apiV1BidRulesetsIdClonePost(body);
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
| **apiV1BidRulesetsIdClonePostRequest** | [ApiV1BidRulesetsIdClonePostRequest](ApiV1BidRulesetsIdClonePostRequest.md) |  | [Optional] |

### Return type

[**BidRuleset**](BidRuleset.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Ruleset cloned. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Source ruleset not found or not owned by caller. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1BidRulesetsIdDelete

> ApiV1BidRulesetsIdDelete200Response apiV1BidRulesetsIdDelete(id)

Soft-delete a ruleset.

Sets &#x60;isdeleted&#x3D;1&#x60; on the ruleset (rule rows stay in place for audit; goadserver simply stops loading them on next refresh). Idempotent.  **Hard-blocked while attached to a non-deleted campaign** — the response is a 422 whose message gives the number of attached campaigns (&#x60;ruleset is attached to N active campaign(s); detach first&#x60;). Find them with &#x60;GET /api/v1/campaigns&#x60; and detach each one (set &#x60;bidruleset_id&#x3D;0&#x60; via &#x60;PATCH /api/v1/campaigns/{type}/{id}&#x60;) first. The list endpoint\&#39;s &#x60;campaign_count&#x60; flags this ahead of time.  Reference: [&#x60;docs/BID_RULES.md&#x60;](BID_RULES.md). 

### Example

```ts
import {
  Configuration,
  BidRulesetsApi,
} from 'goadserver-sdk';
import type { ApiV1BidRulesetsIdDeleteRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BidRulesetsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1BidRulesetsIdDeleteRequest;

  try {
    const data = await api.apiV1BidRulesetsIdDelete(body);
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

[**ApiV1BidRulesetsIdDelete200Response**](ApiV1BidRulesetsIdDelete200Response.md)

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
| **404** | Ruleset not found or already deleted. |  -  |
| **422** | Ruleset is still attached to one or more non-deleted campaigns. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1BidRulesetsIdGet

> BidRuleset apiV1BidRulesetsIdGet(id)

Show one ruleset, including all rules.

Returns the full ruleset record with the rule rows in priority order — this is what an editor UI loads to render the rule list and condition pickers.  Reference: [&#x60;docs/BID_RULES.md&#x60;](BID_RULES.md). 

### Example

```ts
import {
  Configuration,
  BidRulesetsApi,
} from 'goadserver-sdk';
import type { ApiV1BidRulesetsIdGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BidRulesetsApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ApiV1BidRulesetsIdGetRequest;

  try {
    const data = await api.apiV1BidRulesetsIdGet(body);
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

[**BidRuleset**](BidRuleset.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ruleset detail (with rules pre-sorted by priority). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ruleset not found or not owned by caller. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1BidRulesetsIdPatch

> BidRuleset apiV1BidRulesetsIdPatch(id, apiV1BidRulesetsIdPatchRequest)

Update a ruleset\&#39;s metadata and/or replace its rules.

Fields you leave out keep their stored value:  - &#x60;name&#x60;, &#x60;paytype&#x60;, &#x60;default_tz&#x60; omitted → unchanged. - &#x60;rules&#x60; omitted → the current rules are kept. - &#x60;rules&#x60; present → the array **replaces** the whole rule list   in one transaction; &#x60;rules: []&#x60; clears it.  Every save rewrites the rule rows: the previous rows are soft-deleted and the resulting list is inserted with **new** rule ids (stats already attributed to an old rule id stay on the old row). Rule &#x60;id&#x60;s in the body are ignored.  &#x60;paytype&#x60; can be changed, as in the panel editor — make sure the attached campaigns use the same paytype.  You can send back a record fetched with &#x60;GET&#x60; unchanged: the read-only fields (&#x60;id&#x60;, &#x60;userid&#x60;, &#x60;is_deleted&#x60;, &#x60;created&#x60;, &#x60;updated&#x60;, &#x60;campaign_count&#x60;, &#x60;rule_count&#x60;) are accepted and ignored, also in strict mode.  Reorder by changing &#x60;priority&#x60; values — rules walk in ascending priority at serve time.  Editing a ruleset that\&#39;s attached to multiple campaigns affects all of them — no per-campaign override exists. The list endpoint surfaces &#x60;campaign_count&#x60; so a UI can warn before save.  Reference: [&#x60;docs/BID_RULES.md&#x60;](BID_RULES.md). 

### Example

```ts
import {
  Configuration,
  BidRulesetsApi,
} from 'goadserver-sdk';
import type { ApiV1BidRulesetsIdPatchOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BidRulesetsApi(config);

  const body = {
    // number
    id: 56,
    // ApiV1BidRulesetsIdPatchRequest
    apiV1BidRulesetsIdPatchRequest: {"name":"RTB CPC playbook v2"},
  } satisfies ApiV1BidRulesetsIdPatchOperationRequest;

  try {
    const data = await api.apiV1BidRulesetsIdPatch(body);
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
| **apiV1BidRulesetsIdPatchRequest** | [ApiV1BidRulesetsIdPatchRequest](ApiV1BidRulesetsIdPatchRequest.md) |  | |

### Return type

[**BidRuleset**](BidRuleset.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated. Body is the freshly-updated ruleset. |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **404** | Ruleset not found or not owned by caller. |  -  |
| **422** | Validation error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1BidRulesetsPost

> BidRuleset apiV1BidRulesetsPost(apiV1BidRulesetsPostRequest)

Create a new bid ruleset (with rules in one shot).

Creates a ruleset and the full rule list in a single transaction. Rules without an &#x60;id&#x60; are inserted; the supplied &#x60;priority&#x60; is honored — sort the array client-side or just set &#x60;priority&#x60; to the desired walk order.  &#x60;paytype&#x60; must match the paytype of the campaigns you attach the ruleset to. &#x60;default_tz&#x60; defaults to &#x60;UTC&#x60; when omitted. Rule &#x60;bid&#x60; values are whole cents.  Reference: [&#x60;docs/BID_RULES.md&#x60;](BID_RULES.md). 

### Example

```ts
import {
  Configuration,
  BidRulesetsApi,
} from 'goadserver-sdk';
import type { ApiV1BidRulesetsPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BidRulesetsApi(config);

  const body = {
    // ApiV1BidRulesetsPostRequest
    apiV1BidRulesetsPostRequest: {"name":"RTB CPC playbook","paytype":"cpc","default_tz":"UTC"},
  } satisfies ApiV1BidRulesetsPostOperationRequest;

  try {
    const data = await api.apiV1BidRulesetsPost(body);
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
| **apiV1BidRulesetsPostRequest** | [ApiV1BidRulesetsPostRequest](ApiV1BidRulesetsPostRequest.md) |  | |

### Return type

[**BidRuleset**](BidRuleset.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created. Body is the freshly-created ruleset (&#x60;BidRuleset&#x60; shape, with &#x60;rules&#x60; populated and a fresh &#x60;id&#x60; per rule). |  -  |
| **401** | Missing or invalid API key. |  -  |
| **403** | Key lacks the required scope, or IP not in allowlist, or account suspended. |  -  |
| **422** | Validation error (missing name/paytype, bad enum, malformed conditions, …). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

