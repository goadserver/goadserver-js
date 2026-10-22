
# StatsResponse


## Properties

Name | Type
------------ | -------------
`from` | Date
`to` | Date
`groupBy` | Array&lt;string&gt;
`totals` | { [key: string]: number | null; }
`rows` | Array&lt;{ [key: string]: any; }&gt;
`page` | number
`perPage` | number
`totalRows` | number
`timezone` | string
`ignoredMetrics` | Array&lt;string&gt;

## Example

```typescript
import type { StatsResponse } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "from": null,
  "to": null,
  "groupBy": null,
  "totals": null,
  "rows": null,
  "page": null,
  "perPage": null,
  "totalRows": null,
  "timezone": Europe/Amsterdam,
  "ignoredMetrics": null,
} satisfies StatsResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StatsResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


