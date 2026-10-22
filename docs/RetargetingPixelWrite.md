
# RetargetingPixelWrite

Retargeting list write body. Takes the panel\'s request keys (`rmdays`, `skipdays`, `skiphours`, `skipvisits`) or the stored names the reads return (`purge_days_after`, `skip_days_after`, `skip_before_hours`, `skip_visits_after`) — so a fetched record can be sent back unchanged. Both names of one window with different values is a 422. `id`, `is_active` and `visitors` are accepted and ignored. Windows are whole numbers >= 0 (0 = off). The name has HTML tags stripped and is 1–255 characters. Unknown keys are a 422. 

## Properties

Name | Type
------------ | -------------
`name` | string
`rmdays` | number
`skipdays` | number
`skiphours` | number
`skipvisits` | number
`purgeDaysAfter` | number
`skipDaysAfter` | number
`skipBeforeHours` | number
`skipVisitsAfter` | number
`id` | number
`isActive` | boolean
`visitors` | number

## Example

```typescript
import type { RetargetingPixelWrite } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Cart abandoners,
  "rmdays": 30,
  "skipdays": 0,
  "skiphours": 1,
  "skipvisits": 0,
  "purgeDaysAfter": null,
  "skipDaysAfter": null,
  "skipBeforeHours": null,
  "skipVisitsAfter": null,
  "id": null,
  "isActive": null,
  "visitors": null,
} satisfies RetargetingPixelWrite

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RetargetingPixelWrite
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


