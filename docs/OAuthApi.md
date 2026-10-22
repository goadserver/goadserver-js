# OAuthApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiPublicIntegrationsHooksTokenPost**](OAuthApi.md#apipublicintegrationshookstokenpost) | **POST** /api/public/integrations/hooks/{token} | Incoming webhook — create a lead, contact or task from JSON. |
| [**apiPublicOauthIntrospectPost**](OAuthApi.md#apipublicoauthintrospectpost) | **POST** /api/public/oauth/introspect | Introspect one of the calling app\&#39;s tokens (RFC 7662). |
| [**apiPublicOauthMetadataGet**](OAuthApi.md#apipublicoauthmetadataget) | **GET** /api/public/oauth/metadata | Authorization server metadata (RFC 8414) for this host. |
| [**apiPublicOauthRevokePost**](OAuthApi.md#apipublicoauthrevokepost) | **POST** /api/public/oauth/revoke | Revoke an access or refresh token (RFC 7009). |
| [**apiPublicOauthTokenPost**](OAuthApi.md#apipublicoauthtokenpost) | **POST** /api/public/oauth/token | Exchange an authorization code, or rotate a refresh token. |



## apiPublicIntegrationsHooksTokenPost

> ApiPublicIntegrationsHooksTokenPost200Response apiPublicIntegrationsHooksTokenPost(token, requestBody)

Incoming webhook — create a lead, contact or task from JSON.

The URL of an *Incoming webhook* connector (Admin → Integrations). The path token is the credential; a connector can additionally require &#x60;X-Integration-Signature: t&#x3D;&lt;unix&gt;,v1&#x3D;&lt;hex HMAC-SHA256(secret, \&quot;&lt;t&gt;.&lt;body&gt;\&quot;)&gt;&#x60;. What the body becomes is the connector\&#39;s field mapping. Max 64 KB. 

### Example

```ts
import {
  Configuration,
  OAuthApi,
} from 'goadserver-sdk';
import type { ApiPublicIntegrationsHooksTokenPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new OAuthApi();

  const body = {
    // string | whin_… from the connector.
    token: token_example,
    // { [key: string]: any; }
    requestBody: Object,
  } satisfies ApiPublicIntegrationsHooksTokenPostRequest;

  try {
    const data = await api.apiPublicIntegrationsHooksTokenPost(body);
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
| **token** | `string` | whin_… from the connector. | [Defaults to `undefined`] |
| **requestBody** | `{ [key: string]: any; }` |  | |

### Return type

[**ApiPublicIntegrationsHooksTokenPost200Response**](ApiPublicIntegrationsHooksTokenPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Created. |  -  |
| **401** | Signature required and missing or wrong. |  -  |
| **404** | Unknown webhook. |  -  |
| **422** | The mapped fields did not make a valid record. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicOauthIntrospectPost

> ApiPublicOauthIntrospectPost200Response apiPublicOauthIntrospectPost(token, clientId, clientSecret)

Introspect one of the calling app\&#39;s tokens (RFC 7662).

### Example

```ts
import {
  Configuration,
  OAuthApi,
} from 'goadserver-sdk';
import type { ApiPublicOauthIntrospectPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new OAuthApi();

  const body = {
    // string
    token: token_example,
    // string (optional)
    clientId: clientId_example,
    // string (optional)
    clientSecret: clientSecret_example,
  } satisfies ApiPublicOauthIntrospectPostRequest;

  try {
    const data = await api.apiPublicOauthIntrospectPost(body);
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
| **token** | `string` |  | [Defaults to `undefined`] |
| **clientId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **clientSecret** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiPublicOauthIntrospectPost200Response**](ApiPublicOauthIntrospectPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/x-www-form-urlencoded`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | &#x60;{active: false}&#x60; for anything that is not a live token of this app. |  -  |
| **401** | invalid_client. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicOauthMetadataGet

> { [key: string]: any; } apiPublicOauthMetadataGet()

Authorization server metadata (RFC 8414) for this host.

### Example

```ts
import {
  Configuration,
  OAuthApi,
} from 'goadserver-sdk';
import type { ApiPublicOauthMetadataGetRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new OAuthApi();

  try {
    const data = await api.apiPublicOauthMetadataGet();
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

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Endpoints and supported flows. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicOauthRevokePost

> apiPublicOauthRevokePost(token, clientId, clientSecret)

Revoke an access or refresh token (RFC 7009).

Revoking a refresh token revokes every token of its authorization. Always 200 for an authenticated client.

### Example

```ts
import {
  Configuration,
  OAuthApi,
} from 'goadserver-sdk';
import type { ApiPublicOauthRevokePostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new OAuthApi();

  const body = {
    // string
    token: token_example,
    // string (optional)
    clientId: clientId_example,
    // string (optional)
    clientSecret: clientSecret_example,
  } satisfies ApiPublicOauthRevokePostRequest;

  try {
    const data = await api.apiPublicOauthRevokePost(body);
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
| **token** | `string` |  | [Defaults to `undefined`] |
| **clientId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **clientSecret** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/x-www-form-urlencoded`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Revoked (or unknown — indistinguishable by design). |  -  |
| **401** | invalid_client. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiPublicOauthTokenPost

> ApiPublicOauthTokenPost200Response apiPublicOauthTokenPost(grantType, code, redirectUri, codeVerifier, refreshToken, scope, clientId, clientSecret)

Exchange an authorization code, or rotate a refresh token.

&#x60;grant_type&#x3D;authorization_code&#x60; needs &#x60;code&#x60;, &#x60;redirect_uri&#x60; (exactly as sent to &#x60;/oauth/authorize&#x60;) and &#x60;code_verifier&#x60;. &#x60;grant_type&#x3D;refresh_token&#x60; needs &#x60;refresh_token&#x60; and may narrow with &#x60;scope&#x60;; the presented refresh token is spent and a new one returned — presenting a spent one again revokes every token of that authorization. Confidential apps authenticate with HTTP Basic (&#x60;client_id:client_secret&#x60;) or &#x60;client_id&#x60; + &#x60;client_secret&#x60; in the body; public apps send &#x60;client_id&#x60; only. 

### Example

```ts
import {
  Configuration,
  OAuthApi,
} from 'goadserver-sdk';
import type { ApiPublicOauthTokenPostRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const api = new OAuthApi();

  const body = {
    // string
    grantType: grantType_example,
    // string | oac_… (authorization_code) (optional)
    code: code_example,
    // string (optional)
    redirectUri: redirectUri_example,
    // string | 43–128 chars (optional)
    codeVerifier: codeVerifier_example,
    // string | ort_… (refresh_token) (optional)
    refreshToken: refreshToken_example,
    // string | Space-separated; refresh may only narrow. (optional)
    scope: scope_example,
    // string (optional)
    clientId: clientId_example,
    // string (optional)
    clientSecret: clientSecret_example,
  } satisfies ApiPublicOauthTokenPostRequest;

  try {
    const data = await api.apiPublicOauthTokenPost(body);
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
| **grantType** | `authorization_code`, `refresh_token` |  | [Defaults to `undefined`] [Enum: authorization_code, refresh_token] |
| **code** | `string` | oac_… (authorization_code) | [Optional] [Defaults to `undefined`] |
| **redirectUri** | `string` |  | [Optional] [Defaults to `undefined`] |
| **codeVerifier** | `string` | 43–128 chars | [Optional] [Defaults to `undefined`] |
| **refreshToken** | `string` | ort_… (refresh_token) | [Optional] [Defaults to `undefined`] |
| **scope** | `string` | Space-separated; refresh may only narrow. | [Optional] [Defaults to `undefined`] |
| **clientId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **clientSecret** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiPublicOauthTokenPost200Response**](ApiPublicOauthTokenPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/x-www-form-urlencoded`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Tokens. |  -  |
| **400** | invalid_request, invalid_grant, invalid_scope or unsupported_grant_type (RFC 6749 §5.2). |  -  |
| **401** | invalid_client. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

