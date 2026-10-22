
# ApiV1AdspacesIdCodeGet200ResponseCtv

Video (4) and audio (43) zones: the ad server\'s player URLs. [MACROS] are IAB VAST 4.1 macros the player fills (app bundle, store URL, advertising id, limit-ad-tracking, CCPA string); the app bundle becomes the request\'s domain for targeting, blocklists and stats, and goes to DSPs as app.bundle. ssai=1 with the viewer\'s ip and user agent is honoured only on zones with player_settings.ssai (else 403). 

## Properties

Name | Type
------------ | -------------
`vast` | string
`pod` | string
`vmap` | string
`pause` | string
`pauseVast` | string
`ssai` | string

## Example

```typescript
import type { ApiV1AdspacesIdCodeGet200ResponseCtv } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "vast": null,
  "pod": null,
  "vmap": null,
  "pause": null,
  "pauseVast": null,
  "ssai": null,
} satisfies ApiV1AdspacesIdCodeGet200ResponseCtv

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AdspacesIdCodeGet200ResponseCtv
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


