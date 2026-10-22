
# ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`description` | string
`destinationurl` | string
`displayurl` | string
`previewurl` | string
`bid` | number
`isactive` | number
`sortWeight` | number
`position` | number
`displaytype` | string
`properties` | string
`urlPoolid` | number
`creativeId` | number
`iconId` | number
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
`creatives` | object
`bannerType` | string
`bannerUrl` | string
`bannerIframeUrl` | string
`bannerHtml` | string
`bannerPoolId` | number
`imageType` | string
`imageUrl` | string
`imagePoolId` | number
`videoType` | string
`videoUrl` | string
`companionUrl` | string
`companionWidth` | number
`companionHeight` | number
`videoPoolId` | number
`htmlCode` | string
`htmlTotalItems` | number
`iconType` | string

## Example

```typescript
import type { ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "description": null,
  "destinationurl": null,
  "displayurl": null,
  "previewurl": null,
  "bid": 0.05,
  "isactive": null,
  "sortWeight": null,
  "position": null,
  "displaytype": null,
  "properties": null,
  "urlPoolid": null,
  "creativeId": null,
  "iconId": null,
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
  "creatives": null,
  "bannerType": null,
  "bannerUrl": null,
  "bannerIframeUrl": null,
  "bannerHtml": null,
  "bannerPoolId": null,
  "imageType": null,
  "imageUrl": null,
  "imagePoolId": null,
  "videoType": null,
  "videoUrl": null,
  "companionUrl": null,
  "companionWidth": null,
  "companionHeight": null,
  "videoPoolId": null,
  "htmlCode": null,
  "htmlTotalItems": null,
  "iconType": null,
} satisfies ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


