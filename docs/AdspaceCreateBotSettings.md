
# AdspaceCreateBotSettings

Messenger / bot zones (bot_ads, adzone type 46): native ads a Telegram, Discord or WhatsApp bot posts as a sponsored message. Image orientation in native_settings. Server to server: GET https://<ad domain>/botad.go?spaceid=<zone>&chat=<chat id>[&q=<topic or last message>][&n=1-3][&subid=][&ip=<user ip>&agent=<user agent>] → {ads:[{title, description, text, url, button_text, display_url, image, impression_url}], label}. Post text (title + description) with a button button_text → url (the tracked click) and fire impression_url when the message is sent. A chat over cap_per_hour gets {ads:[], label, reason: \"capped\", retry_after: <seconds>}. q is matched against campaign keyword targeting; subid goes to the stats (don\'t send the chat id there). Messengers don\'t give bots the user\'s IP, so without ip geo targeting sees the bot\'s server. The code (GET /adspaces/{id}/code) returns the request URL as `alternative` and Python / Node examples as `ad_tag`. 

## Properties

Name | Type
------------ | -------------
`capPerHour` | number
`label` | string
`buttonText` | string

## Example

```typescript
import type { AdspaceCreateBotSettings } from 'goadserver-sdk'

// TODO: Update the object below with actual values
const example = {
  "capPerHour": null,
  "label": null,
  "buttonText": null,
} satisfies AdspaceCreateBotSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdspaceCreateBotSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


