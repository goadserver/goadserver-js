
# AdspaceCreateBannerSettings

Banner-flavored zones (bannerads, fixim_banner, impopup, interstitialads, interstitial_banner, invideo_banner). bannerads inline (display_type 0) also takes `interscroller` (boolean): the banner shows fixed behind a window in the content that the page scrolls over, and GET /api/v1/adspaces/{id}/code switches to goCtrl\'s interscroller plugin; a non-boolean is refused with 422 `banner_settings.interscroller`. `inimage` (boolean): in-image ads — the banner shows in a closeable strip over the bottom of the publisher\'s own article images (goCtrl inimage plugin; fn_params container, min_width 400, max_images 3, label), each requested when its image scrolls into view with the image\'s alt text as keywords; interscroller and inimage together are refused with 422 `banner_settings.inimage`. Full field list: GET /api/v1/adspaces/bannerads/_schema.

## Properties

Name | Type
------------ | -------------
`sizeid` | number
`displaytype` | number
`width` | number
`height` | number

## Example

```typescript
import type { AdspaceCreateBannerSettings } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "sizeid": null,
  "displaytype": null,
  "width": null,
  "height": null,
} satisfies AdspaceCreateBannerSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceCreateBannerSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


