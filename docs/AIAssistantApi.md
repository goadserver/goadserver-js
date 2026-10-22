# AIAssistantApi

All URIs are relative to *https://up.go-adserver.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1McpPost**](AIAssistantApi.md#apiv1mcppostoperation) | **POST** /api/v1/mcp | MCP endpoint — connect an AI assistant to this account. |



## apiV1McpPost

> ApiV1McpPost200Response apiV1McpPost(apiV1McpPostRequest)

MCP endpoint — connect an AI assistant to this account.

Model Context Protocol server (JSON-RPC 2.0 over HTTP). Point an MCP client at this URL with &#x60;Authorization: Bearer gas_live_…&#x60; and the assistant can use the account through a curated set of tools.  The key must be marked **\&quot;Allow this key to connect an AI assistant\&quot;** in MyAccount → API access; keys minted before that option existed are not agent-capable. The tools an assistant sees are filtered by the key\&#39;s scopes, so a read-only key is never shown a write tool.  Methods: &#x60;initialize&#x60;, &#x60;ping&#x60;, &#x60;tools/list&#x60;, &#x60;tools/call&#x60;. One JSON-RPC request per POST — batching is not accepted. Tool calls are rate limited separately from the REST API (default 240/min per key); &#x60;initialize&#x60;, &#x60;ping&#x60; and &#x60;tools/list&#x60; are free. 

### Example

```ts
import {
  Configuration,
  AIAssistantApi,
} from 'goadserver-sdk';
import type { ApiV1McpPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AIAssistantApi(config);

  const body = {
    // ApiV1McpPostRequest
    apiV1McpPostRequest: ...,
  } satisfies ApiV1McpPostOperationRequest;

  try {
    const data = await api.apiV1McpPost(body);
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
| **apiV1McpPostRequest** | [ApiV1McpPostRequest](ApiV1McpPostRequest.md) |  | |

### Return type

[**ApiV1McpPost200Response**](ApiV1McpPost200Response.md)

### Authorization

[apiKey](../README.md#apiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JSON-RPC response. |  -  |
| **202** | Notification accepted (no response body). |  -  |
| **404** | MCP is not available on this instance or for this network. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

