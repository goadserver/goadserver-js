
# ApiKeyDetails


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`prefix` | string
`scopes` | Array&lt;string&gt;
`ipAllowlist` | string
`rateLimitRpm` | number
`expiresAt` | Date
`lastUsedAt` | Date
`lastUsedIp` | string
`callCount` | number
`revokedAt` | Date
`createdAt` | Date

## Example

```typescript
import type { ApiKeyDetails } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "prefix": gas_live_abc1,
  "scopes": null,
  "ipAllowlist": null,
  "rateLimitRpm": null,
  "expiresAt": null,
  "lastUsedAt": null,
  "lastUsedIp": null,
  "callCount": null,
  "revokedAt": null,
  "createdAt": null,
} satisfies ApiKeyDetails

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiKeyDetails
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


