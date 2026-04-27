
# ApiV1CampaignsTypePostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`adType` | number
`dailyBudget` | number
`totalBudget` | number
`useCampaignBudget` | boolean
`countries` | string
`languages` | string
`categories` | string
`mainCatid` | number
`deviceTypeIds` | string
`browserIds` | string
`osIds` | string
`ispIds` | string
`siteTypes` | string
`regions` | string
`displayTimes` | string
`displayDays` | string
`useCapping` | boolean
`cappingHours` | number
`cappingMinutes` | number
`domainFilterId` | number
`whitelistId` | number
`rtIncludeId` | number
`rtExcludeId` | number
`ipPoolId` | number
`fxMinprice` | number
`isPaused` | boolean

## Example

```typescript
import type { ApiV1CampaignsTypePostRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Auto-optimised RON #1,
  "adType": 2,
  "dailyBudget": 25,
  "totalBudget": 1000,
  "useCampaignBudget": null,
  "countries": US,GB,DE,
  "languages": 0,
  "categories": 0,
  "mainCatid": 0,
  "deviceTypeIds": 1,2,
  "browserIds": null,
  "osIds": null,
  "ispIds": null,
  "siteTypes": null,
  "regions": null,
  "displayTimes": 08:00-12:00|14:00-22:00,
  "displayDays": 0,1,2,3,4,
  "useCapping": null,
  "cappingHours": 12,
  "cappingMinutes": 0,
  "domainFilterId": null,
  "whitelistId": null,
  "rtIncludeId": null,
  "rtExcludeId": null,
  "ipPoolId": null,
  "fxMinprice": null,
  "isPaused": null,
} satisfies ApiV1CampaignsTypePostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypePostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


