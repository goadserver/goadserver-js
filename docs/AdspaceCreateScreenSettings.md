
# AdspaceCreateScreenSettings

DOOH screens (screens, adzone type 45): a digital-signage screen. The zone also needs its banner size (adsizeid / banner_settings.sizeid, e.g. 1920x1080). The screen\'s player pulls a playlist: GET https://<ad domain>/screen.go?spaceid=<zone>&key=<screen_key>[&n=1-20][&format=vast] → {screen:{spaceid, width, height, orientation, venue_type}, open, refresh_seconds, ads:[{id, type: image|video|iframe|html, url, html, width, height, duration, title, proof_url}]} (format=vast: VAST 4 with one Ad per item in play order, Impression = proof_url; iframe/html items are left out). Fire proof_url when an ad has really played — proof of play, counted once per play and only within 3 hours of the pull; it books one impression whose cost is the CPM bid × audience_per_play. Outside opening_hours the playlist is empty (open: false). act=player&spaceid=&key= is a ready full-screen web player for any browser in kiosk mode. Screens play only banner campaigns with options.screens.on (campaign field `screens`). screen_key is generated on create and returned read-only (also in GET /adspaces/{id}/code → screen); rotate_key: true issues a new one. 

## Properties

Name | Type
------------ | -------------
`venueType` | string
`lat` | number
`lon` | number
`address` | string
`width` | number
`height` | number
`orientation` | string
`audiencePerPlay` | number
`openingHours` | string
`timezone` | string
`slotSeconds` | number
`playlistSize` | number
`screenKey` | string
`rotateKey` | boolean

## Example

```typescript
import type { AdspaceCreateScreenSettings } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "venueType": null,
  "lat": null,
  "lon": null,
  "address": null,
  "width": null,
  "height": null,
  "orientation": null,
  "audiencePerPlay": null,
  "openingHours": 08:00-22:00,
  "timezone": Europe/Amsterdam,
  "slotSeconds": null,
  "playlistSize": null,
  "screenKey": null,
  "rotateKey": null,
} satisfies AdspaceCreateScreenSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceCreateScreenSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


