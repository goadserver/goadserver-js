
# ListMeta

Pagination block of the `{data, meta}` list envelope. Lists take `page` + `per_page` (capped per endpoint) or `offset` + `limit`; `per_page=all` returns the whole set in one page. 

## Properties

Name | Type
------------ | -------------
`total` | number
`perPage` | number
`currentPage` | number
`lastPage` | number
`limit` | number
`offset` | number

## Example

```typescript
import type { ListMeta } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "total": null,
  "perPage": null,
  "currentPage": null,
  "lastPage": null,
  "limit": null,
  "offset": null,
} satisfies ListMeta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListMeta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


