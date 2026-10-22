
# ApiV1PublisherFinanceSettingsPutRequest


## Properties

Name | Type
------------ | -------------
`payouttype` | number
`minimumPayout` | number
`pCurrency` | string
`directpayout` | number
`payoutmethod` | number
`paypaladress` | string
`epaymentsadress` | string
`paxumadress` | string
`payoneeradress` | string
`paymentdata` | string
`bankaccountnumber` | string
`bankaccountname` | string
`biccode` | string
`ibancode` | string
`routingnumber` | string
`bicCountryid` | number
`noiban` | boolean
`vatnumber` | string
`payinfo` | string

## Example

```typescript
import type { ApiV1PublisherFinanceSettingsPutRequest } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "payouttype": null,
  "minimumPayout": null,
  "pCurrency": null,
  "directpayout": null,
  "payoutmethod": null,
  "paypaladress": null,
  "epaymentsadress": null,
  "paxumadress": null,
  "payoneeradress": null,
  "paymentdata": null,
  "bankaccountnumber": null,
  "bankaccountname": null,
  "biccode": null,
  "ibancode": null,
  "routingnumber": null,
  "bicCountryid": null,
  "noiban": null,
  "vatnumber": null,
  "payinfo": null,
} satisfies ApiV1PublisherFinanceSettingsPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFinanceSettingsPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


