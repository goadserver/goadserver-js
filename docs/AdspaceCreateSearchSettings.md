
# AdspaceCreateSearchSettings

Search Ads zones (search_ads, adzone type 42): native-style ads shown for what visitors type into the publisher\'s own search box, through the goCtrl `search` plugin. They serve only Search Ads campaigns (ad type 42, `searchads` — a copy of native bought as its own campaign type), never regular natives. The query is matched against campaign keyword targeting; campaigns without keywords serve on any query. Queries on the built-in blocked-term list (minors, non-consent, violence, …) never get an ad and leave no stats row; `blocked_terms` adds the zone\'s own list. These values are written into the generated embed code (GET /api/v1/adspaces/{id}/code). 

## Properties

Name | Type
------------ | -------------
`mode` | string
`inputSelector` | string
`panelSelector` | string
`containerSelector` | string
`maxLinks` | number
`chatContainer` | string
`chatAnswer` | string
`chatPrompt` | string
`chatEvery` | number
`chatStyle` | string
`chatProducts` | number
`chatFollowups` | number
`chatInput` | string
`chatSend` | string
`results` | number
`recent` | number
`minChars` | number
`theme` | string
`label` | string
`layout` | string
`placeholder` | string
`submitUrl` | string
`queryParam` | string
`adPosition` | string
`onOpen` | boolean
`recentPick` | string
`showDescription` | boolean
`showUrl` | boolean
`blockedTerms` | [AdspaceCreateSearchSettingsBlockedTerms](AdspaceCreateSearchSettingsBlockedTerms.md)
`runtime` | { [key: string]: any; }

## Example

```typescript
import type { AdspaceCreateSearchSettings } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "mode": null,
  "inputSelector": #header-search,
  "panelSelector": #search-suggestions,
  "containerSelector": article .post-body,
  "maxLinks": null,
  "chatContainer": #chat-messages,
  "chatAnswer": .message.assistant,
  "chatPrompt": .message.user,
  "chatEvery": null,
  "chatStyle": null,
  "chatProducts": null,
  "chatFollowups": null,
  "chatInput": #chat-input,
  "chatSend": #chat-send,
  "results": null,
  "recent": null,
  "minChars": null,
  "theme": null,
  "label": null,
  "layout": null,
  "placeholder": null,
  "submitUrl": https://example.com/search?q={q},
  "queryParam": search,
  "adPosition": null,
  "onOpen": null,
  "recentPick": null,
  "showDescription": null,
  "showUrl": null,
  "blockedTerms": null,
  "runtime": null,
} satisfies AdspaceCreateSearchSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceCreateSearchSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


