
# ApiV1CampaignsTypeCampaignIdAdsPostRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`bid` | number
`destinationUrl` | string
`description` | string
`displayUrl` | string
`previewUrl` | string
`isActive` | boolean
`sortWeight` | number
`bannerPoolId` | number
`videoPoolId` | number
`urlPoolId` | number
`creativeId` | number
`bannerUrl` | string
`bannerHtml` | string
`nativeImageUrl` | string
`bannerIframeUrl` | string
`videoUrl` | string
`videoType` | string
`companionUrl` | string
`companionWidth` | number
`companionHeight` | number
`imagePoolId` | number
`htmlCode` | string
`htmlTotalItems` | number
`iconId` | number
`iconType` | string
`useImptracking` | boolean
`imptrackingurl` | string
`usekeywords` | boolean
`keywords` | string
`adOptions` | object
`smartNetworkId` | number
`chatFollowup` | string
`chatPrice` | string
`keywordMode` | string
`videoOverlays` | [Array&lt;ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner&gt;](ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner.md)
`position` | number
`displaytype` | string
`properties` | string
`bansizeid` | number

## Example

```typescript
import type { ApiV1CampaignsTypeCampaignIdAdsPostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": Promo Q3 banner,
  "bid": 0.05,
  "destinationUrl": https://example.com/lander?src={subid},
  "description": null,
  "displayUrl": null,
  "previewUrl": null,
  "isActive": null,
  "sortWeight": null,
  "bannerPoolId": null,
  "videoPoolId": null,
  "urlPoolId": null,
  "creativeId": null,
  "bannerUrl": null,
  "bannerHtml": null,
  "nativeImageUrl": null,
  "bannerIframeUrl": null,
  "videoUrl": null,
  "videoType": null,
  "companionUrl": null,
  "companionWidth": null,
  "companionHeight": null,
  "imagePoolId": null,
  "htmlCode": null,
  "htmlTotalItems": null,
  "iconId": null,
  "iconType": null,
  "useImptracking": null,
  "imptrackingurl": null,
  "usekeywords": null,
  "keywords": null,
  "adOptions": null,
  "smartNetworkId": null,
  "chatFollowup": null,
  "chatPrice": null,
  "keywordMode": null,
  "videoOverlays": null,
  "position": null,
  "displaytype": 1,4,
  "properties": null,
  "bansizeid": null,
} satisfies ApiV1CampaignsTypeCampaignIdAdsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeCampaignIdAdsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


