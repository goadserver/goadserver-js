
# ApiV1CampaignsTypeIdBudgetPatchRequest


## Properties

Name | Type
------------ | -------------
`campaignBudget` | number
`useCampaignBudget` | boolean
`maxDayBudget` | number
`useDayBudget` | boolean

## Example

```typescript
import type { ApiV1CampaignsTypeIdBudgetPatchRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "campaignBudget": null,
  "useCampaignBudget": null,
  "maxDayBudget": null,
  "useDayBudget": null,
} satisfies ApiV1CampaignsTypeIdBudgetPatchRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1CampaignsTypeIdBudgetPatchRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


