
# AdspaceCreateEmailSettings

Email display zones (email_display, adzone type 44): image banners in a newsletter, picked when the email is opened. The zone also needs its banner size (adsizeid / banner_settings.sizeid). The code (GET /adspaces/{id}/code → ad_tag) is HTML for the newsletter template: per slot a linked image, https://<ad domain>/mailad.go?spaceid=<zone>&slot=<n>&rid=<merge tag>&act=img inside a link with act=click. The first image fetch per (zone, slot, recipient) picks a banner (image creatives only: html, iframe and video banners are skipped), counts the impression and keeps the choice for ttl_days; a re-open gets the same creative uncounted and the link goes to the ad that was shown. A click with no kept choice (images off) picks an ad then. No ad: the image is a transparent pixel, the link goes to fallback_link (or answers 204). Image proxies (Gmail, Apple Mail Privacy Protection) fetch from their own network: geo targeting sees the proxy, and Apple prefetches. 

## Properties

Name | Type
------------ | -------------
`slots` | number
`mergeTag` | string
`label` | string
`ttlDays` | number
`fallbackLink` | string

## Example

```typescript
import type { AdspaceCreateEmailSettings } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "slots": null,
  "mergeTag": *|UNIQID|*,
  "label": null,
  "ttlDays": null,
  "fallbackLink": null,
} satisfies AdspaceCreateEmailSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceCreateEmailSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


