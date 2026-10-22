
# ApiV1PublisherFinanceSettingsGet200ResponseData


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
`noiban` | number
`routingnumber` | string
`bicCountryid` | number
`vatnumber` | string
`payinfo` | string
`invCompany` | string
`invAdress` | string
`invPostalcode` | string
`invCity` | string
`invCountryid` | number
`useaccountadress` | number
`isvalidcompany` | number
`isvalidbanking` | number
`lastTimeValidated` | string
`allowweeklypayments` | boolean

## Example

```typescript
import type { ApiV1PublisherFinanceSettingsGet200ResponseData } from 'goadserver-sdk'

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
  "noiban": null,
  "routingnumber": null,
  "bicCountryid": null,
  "vatnumber": null,
  "payinfo": null,
  "invCompany": null,
  "invAdress": null,
  "invPostalcode": null,
  "invCity": null,
  "invCountryid": null,
  "useaccountadress": null,
  "isvalidcompany": null,
  "isvalidbanking": null,
  "lastTimeValidated": null,
  "allowweeklypayments": null,
} satisfies ApiV1PublisherFinanceSettingsGet200ResponseData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1PublisherFinanceSettingsGet200ResponseData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


