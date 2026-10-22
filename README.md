# goadserver-sdk@1.1.0

> Official JavaScript/TypeScript client for the REST API of [GoAdserver](https://www.goadserver.com), the hosted ad server. API documentation and how to create an API key: [GoAdserver API docs](https://www.goadserver.com/docs/api-keys/).

A TypeScript SDK client for the up.go-adserver.com API.

## Usage

First, install the SDK from npm.

```bash
npm install goadserver-sdk --save
```

Next, try it out.


```ts
import {
  Configuration,
  AIAssistantApi,
} from 'goadserver-sdk';
import type { ApiV1McpPostOperationRequest } from 'goadserver-sdk';

async function example() {
  console.log("🚀 Testing goadserver-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AIAssistantApi(config);

  const body = {
    // ApiV1McpPostRequest
    apiV1McpPostRequest: ...,
  } satisfies ApiV1McpPostOperationRequest;

  try {
    const data = await api.apiV1McpPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```


## Documentation

### API Endpoints

All URIs are relative to *https://up.go-adserver.com*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*AIAssistantApi* | [**apiV1McpPost**](docs/AIAssistantApi.md#apiv1mcppostoperation) | **POST** /api/v1/mcp | MCP endpoint — connect an AI assistant to this account.
*AccountApi* | [**apiV1AccountFeaturesGet**](docs/AccountApi.md#apiv1accountfeaturesget) | **GET** /api/v1/account/features | Self-service features and their state.
*AccountApi* | [**apiV1AccountGet**](docs/AccountApi.md#apiv1accountget) | **GET** /api/v1/account | Identity check — returns the authenticated user + scopes of the calling key.
*AccountApi* | [**apiV1AccountMembershipsGet**](docs/AccountApi.md#apiv1accountmembershipsget) | **GET** /api/v1/account/memberships | Accounts this login can act on.
*AccountApi* | [**apiV1AccountNoticesGet**](docs/AccountApi.md#apiv1accountnoticesget) | **GET** /api/v1/account/notices | Account notices.
*AccountApi* | [**apiV1AccountPendingChangesGet**](docs/AccountApi.md#apiv1accountpendingchangesget) | **GET** /api/v1/account/pending-changes | Profile changes awaiting verification.
*AccountApi* | [**apiV1AccountPreferencesGet**](docs/AccountApi.md#apiv1accountpreferencesget) | **GET** /api/v1/account/preferences | Per-member preferences.
*AccountApi* | [**apiV1AccountPreferencesKeyPut**](docs/AccountApi.md#apiv1accountpreferenceskeyputoperation) | **PUT** /api/v1/account/preferences/{key} | Set one preference.
*AccountApi* | [**apiV1AccountProfileGet**](docs/AccountApi.md#apiv1accountprofileget) | **GET** /api/v1/account/profile | The account\&#39;s contact and company details.
*AccountApi* | [**apiV1AccountSalesReferralsGet**](docs/AccountApi.md#apiv1accountsalesreferralsget) | **GET** /api/v1/account/sales-referrals | Your sales referrals — clients assigned to you, their deposits and your commission.
*AccountApi* | [**apiV1AccountSettingsGet**](docs/AccountApi.md#apiv1accountsettingsget) | **GET** /api/v1/account/settings | Account settings.
*AccountApi* | [**apiV1AccountUiLayoutsGet**](docs/AccountApi.md#apiv1accountuilayoutsget) | **GET** /api/v1/account/ui-layouts | Saved menu layouts.
*AccountApi* | [**apiV1AccountUiLayoutsScopeDelete**](docs/AccountApi.md#apiv1accountuilayoutsscopedelete) | **DELETE** /api/v1/account/ui-layouts/{scope} | Reset a menu layout.
*AccountApi* | [**apiV1AccountUiLayoutsScopePut**](docs/AccountApi.md#apiv1accountuilayoutsscopeputoperation) | **PUT** /api/v1/account/ui-layouts/{scope} | Save a menu layout.
*AccountApi* | [**apiV1AccountUsageGet**](docs/AccountApi.md#apiv1accountusageget) | **GET** /api/v1/account/usage | Metered usage for a period.
*AccountApi* | [**apiV1AccountUsageSummaryGet**](docs/AccountApi.md#apiv1accountusagesummaryget) | **GET** /api/v1/account/usage-summary | Inventory counts at a glance.
*AccountBillingApi* | [**apiV1AccountBillingAffiliatedPaymentsGet**](docs/AccountBillingApi.md#apiv1accountbillingaffiliatedpaymentsget) | **GET** /api/v1/account/billing/affiliated-payments | Payments made to affiliated accounts.
*AccountBillingApi* | [**apiV1AccountBillingAveragesGet**](docs/AccountBillingApi.md#apiv1accountbillingaveragesget) | **GET** /api/v1/account/billing/averages | Average costs and overcharges.
*AccountBillingApi* | [**apiV1AccountBillingInvoicesGet**](docs/AccountBillingApi.md#apiv1accountbillinginvoicesget) | **GET** /api/v1/account/billing/invoices | List invoices.
*AccountBillingApi* | [**apiV1AccountBillingInvoicesIdPdfGet**](docs/AccountBillingApi.md#apiv1accountbillinginvoicesidpdfget) | **GET** /api/v1/account/billing/invoices/{id}/pdf | Download an invoice PDF.
*AccountBillingApi* | [**apiV1AccountBillingSettingsGet**](docs/AccountBillingApi.md#apiv1accountbillingsettingsget) | **GET** /api/v1/account/billing/settings | The account\&#39;s billing plan.
*AccountNotificationsApi* | [**apiV1AccountNotificationDestinationsGet**](docs/AccountNotificationsApi.md#apiv1accountnotificationdestinationsget) | **GET** /api/v1/account/notification-destinations | The account\&#39;s notification destinations.
*AccountNotificationsApi* | [**apiV1AccountNotificationDestinationsIdDelete**](docs/AccountNotificationsApi.md#apiv1accountnotificationdestinationsiddelete) | **DELETE** /api/v1/account/notification-destinations/{id} | Delete a notification destination.
*AccountNotificationsApi* | [**apiV1AccountNotificationDestinationsIdStatusGet**](docs/AccountNotificationsApi.md#apiv1accountnotificationdestinationsidstatusget) | **GET** /api/v1/account/notification-destinations/{id}/status | Whether a destination is linked.
*AccountNotificationsApi* | [**apiV1AccountNotificationDestinationsIdTestPost**](docs/AccountNotificationsApi.md#apiv1accountnotificationdestinationsidtestpost) | **POST** /api/v1/account/notification-destinations/{id}/test | Send a test message to a destination.
*AccountNotificationsApi* | [**apiV1AccountNotificationDestinationsPost**](docs/AccountNotificationsApi.md#apiv1accountnotificationdestinationspostoperation) | **POST** /api/v1/account/notification-destinations | Add a notification destination.
*AccountNotificationsApi* | [**apiV1AccountNotificationPreferencesGet**](docs/AccountNotificationsApi.md#apiv1accountnotificationpreferencesget) | **GET** /api/v1/account/notification-preferences | Per-event channel preferences.
*AccountNotificationsApi* | [**apiV1AccountNotificationPreferencesPut**](docs/AccountNotificationsApi.md#apiv1accountnotificationpreferencesputoperation) | **PUT** /api/v1/account/notification-preferences | Save channel preferences.
*AccountNotificationsApi* | [**apiV1AccountNotificationsGet**](docs/AccountNotificationsApi.md#apiv1accountnotificationsget) | **GET** /api/v1/account/notifications | The in-app notification feed.
*AccountNotificationsApi* | [**apiV1AccountNotificationsReadPost**](docs/AccountNotificationsApi.md#apiv1accountnotificationsreadpostoperation) | **POST** /api/v1/account/notifications/read | Mark notifications read.
*AccountNotificationsApi* | [**apiV1AccountNotificationsUnreadCountGet**](docs/AccountNotificationsApi.md#apiv1accountnotificationsunreadcountget) | **GET** /api/v1/account/notifications/unread-count | Unread notification count.
*AdScannerApi* | [**apiV1AdScannerGet**](docs/AdScannerApi.md#apiv1adscannerget) | **GET** /api/v1/ad-scanner | List scan tasks.
*AdScannerApi* | [**apiV1AdScannerIdDelete**](docs/AdScannerApi.md#apiv1adscanneriddelete) | **DELETE** /api/v1/ad-scanner/{id} | Delete a scan task.
*AdScannerApi* | [**apiV1AdScannerIdIgnoreDomainPut**](docs/AdScannerApi.md#apiv1adscanneridignoredomainputoperation) | **PUT** /api/v1/ad-scanner/{id}/ignore-domain | Ignore (or un-ignore) a flagged domain on a task.
*AdScannerApi* | [**apiV1AdScannerIdManualItemsGet**](docs/AdScannerApi.md#apiv1adscanneridmanualitemsget) | **GET** /api/v1/ad-scanner/{id}/manual-items | List a manual task\&#39;s items.
*AdScannerApi* | [**apiV1AdScannerIdManualItemsItemIdStatePut**](docs/AdScannerApi.md#apiv1adscanneridmanualitemsitemidstateputoperation) | **PUT** /api/v1/ad-scanner/{id}/manual-items/{itemId}/state | Pause, resume or delete a manual item.
*AdScannerApi* | [**apiV1AdScannerIdManualItemsPost**](docs/AdScannerApi.md#apiv1adscanneridmanualitemspostoperation) | **POST** /api/v1/ad-scanner/{id}/manual-items | Add or edit a manual item.
*AdScannerApi* | [**apiV1AdScannerIdPut**](docs/AdScannerApi.md#apiv1adscanneridputoperation) | **PUT** /api/v1/ad-scanner/{id} | Replace a task\&#39;s name, tags and config.
*AdScannerApi* | [**apiV1AdScannerIdToggleActivePut**](docs/AdScannerApi.md#apiv1adscanneridtoggleactiveputoperation) | **PUT** /api/v1/ad-scanner/{id}/toggle-active | Start or stop a scan task.
*AdScannerApi* | [**apiV1AdScannerPost**](docs/AdScannerApi.md#apiv1adscannerpostoperation) | **POST** /api/v1/ad-scanner | Create a scan task.
*AdScannerApi* | [**apiV1AdScannerReportHashGet**](docs/AdScannerApi.md#apiv1adscannerreporthashget) | **GET** /api/v1/ad-scanner/report/{hash} | One scan\&#39;s full report.
*AdScannerApi* | [**apiV1AdScannerReportsGet**](docs/AdScannerApi.md#apiv1adscannerreportsget) | **GET** /api/v1/ad-scanner/reports | List scan results.
*AdScannerApi* | [**apiV1AdScannerStatsGet**](docs/AdScannerApi.md#apiv1adscannerstatsget) | **GET** /api/v1/ad-scanner/stats | Scan volume and proxy bandwidth.
*AdScannerApi* | [**apiV1AdScannerTagsGet**](docs/AdScannerApi.md#apiv1adscannertagsget) | **GET** /api/v1/ad-scanner/tags | Tags used on the account\&#39;s scan tasks.
*AdShopApi* | [**apiV1AdShopCartGet**](docs/AdShopApi.md#apiv1adshopcartget) | **GET** /api/v1/ad-shop/cart | Read the draft cart.
*AdShopApi* | [**apiV1AdShopCartPost**](docs/AdShopApi.md#apiv1adshopcartpostoperation) | **POST** /api/v1/ad-shop/cart | Replace the draft cart.
*AdShopApi* | [**apiV1AdShopConfirmPost**](docs/AdShopApi.md#apiv1adshopconfirmpostoperation) | **POST** /api/v1/ad-shop/confirm | Check out the cart — creates the campaigns.
*AdShopApi* | [**apiV1AdShopFilterOptionsGet**](docs/AdShopApi.md#apiv1adshopfilteroptionsget) | **GET** /api/v1/ad-shop/filter-options | Filter values present in the current snapshot.
*AdShopApi* | [**apiV1AdShopGroupSummaryPost**](docs/AdShopApi.md#apiv1adshopgroupsummarypostoperation) | **POST** /api/v1/ad-shop/group-summary | Group the catalog by targeting dimensions.
*AdShopApi* | [**apiV1AdShopOpportunitiesGet**](docs/AdShopApi.md#apiv1adshopopportunitiesget) | **GET** /api/v1/ad-shop/opportunities | Browse Ad Shop opportunities.
*AdShopApi* | [**apiV1AdShopPlanGet**](docs/AdShopApi.md#apiv1adshopplanget) | **GET** /api/v1/ad-shop/plan | Preview how the cart becomes campaigns.
*AdsApi* | [**apiV1CampaignsTypeCampaignIdAdsMassUndeletePost**](docs/AdsApi.md#apiv1campaignstypecampaignidadsmassundeletepostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/mass-undelete | Restore archived ads of a campaign.
*AdspacesApi* | [**apiV1AdspacesAddMultiplePost**](docs/AdspacesApi.md#apiv1adspacesaddmultiplepostoperation) | **POST** /api/v1/adspaces/add-multiple | Create several ad zones of one type on one site.
*AdspacesApi* | [**apiV1AdspacesExportCodesGet**](docs/AdspacesApi.md#apiv1adspacesexportcodesget) | **GET** /api/v1/adspaces/export-codes | Embed codes for many ad zones at once, grouped by site.
*AdspacesApi* | [**apiV1AdspacesGet**](docs/AdspacesApi.md#apiv1adspacesget) | **GET** /api/v1/adspaces | List ad zones owned by the caller.
*AdspacesApi* | [**apiV1AdspacesIdBlockedAdvertisersGet**](docs/AdspacesApi.md#apiv1adspacesidblockedadvertisersget) | **GET** /api/v1/adspaces/{id}/blocked-advertisers | Advertiser block filters that exclude this ad zone.
*AdspacesApi* | [**apiV1AdspacesIdChildrenGet**](docs/AdspacesApi.md#apiv1adspacesidchildrenget) | **GET** /api/v1/adspaces/{id}/children | List an ad zone\&#39;s child zones.
*AdspacesApi* | [**apiV1AdspacesIdClonePost**](docs/AdspacesApi.md#apiv1adspacesidclonepostoperation) | **POST** /api/v1/adspaces/{id}/clone | Duplicate an ad zone.
*AdspacesApi* | [**apiV1AdspacesIdCodeGet**](docs/AdspacesApi.md#apiv1adspacesidcodeget) | **GET** /api/v1/adspaces/{id}/code | Embed-code snippets for an adspace.
*AdspacesApi* | [**apiV1AdspacesIdDelete**](docs/AdspacesApi.md#apiv1adspacesiddelete) | **DELETE** /api/v1/adspaces/{id} | Soft-delete an adspace.
*AdspacesApi* | [**apiV1AdspacesIdGet**](docs/AdspacesApi.md#apiv1adspacesidget) | **GET** /api/v1/adspaces/{id} | Get a single adspace.
*AdspacesApi* | [**apiV1AdspacesIdNetworkBindingDelete**](docs/AdspacesApi.md#apiv1adspacesidnetworkbindingdelete) | **DELETE** /api/v1/adspaces/{id}/network-binding | Remove the zone\&#39;s network binding.
*AdspacesApi* | [**apiV1AdspacesIdNetworkBindingPut**](docs/AdspacesApi.md#apiv1adspacesidnetworkbindingputoperation) | **PUT** /api/v1/adspaces/{id}/network-binding | Bind the zone to a campaign on an external ad network (the Source tab).
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsAdIdDelete**](docs/AdspacesApi.md#apiv1adspacesidownadsadiddelete) | **DELETE** /api/v1/adspaces/{id}/own-ads/{adId} | Delete an own ad.
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsAdIdGet**](docs/AdspacesApi.md#apiv1adspacesidownadsadidget) | **GET** /api/v1/adspaces/{id}/own-ads/{adId} | Get one own ad.
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsAdIdPut**](docs/AdspacesApi.md#apiv1adspacesidownadsadidput) | **PUT** /api/v1/adspaces/{id}/own-ads/{adId} | Update an own ad.
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsAdIdTogglePut**](docs/AdspacesApi.md#apiv1adspacesidownadsadidtoggleput) | **PUT** /api/v1/adspaces/{id}/own-ads/{adId}/toggle | Switch an own ad on/off.
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsGet**](docs/AdspacesApi.md#apiv1adspacesidownadsget) | **GET** /api/v1/adspaces/{id}/own-ads | List the zone\&#39;s own (house / fallback) ads.
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsMassActionPost**](docs/AdspacesApi.md#apiv1adspacesidownadsmassactionpostoperation) | **POST** /api/v1/adspaces/{id}/own-ads/mass-action | Activate, deactivate or delete several own ads.
*AdspacesApi* | [**apiV1AdspacesIdOwnAdsPost**](docs/AdspacesApi.md#apiv1adspacesidownadspost) | **POST** /api/v1/adspaces/{id}/own-ads | Add an own ad.
*AdspacesApi* | [**apiV1AdspacesIdPatch**](docs/AdspacesApi.md#apiv1adspacesidpatch) | **PATCH** /api/v1/adspaces/{id} | Update an existing adspace.
*AdspacesApi* | [**apiV1AdspacesIdPricesTypeGet**](docs/AdspacesApi.md#apiv1adspacesidpricestypeget) | **GET** /api/v1/adspaces/{id}/prices/{type} | Minimum (floor) prices per country for one device type.
*AdspacesApi* | [**apiV1AdspacesIdPricesTypePost**](docs/AdspacesApi.md#apiv1adspacesidpricestypepostoperation) | **POST** /api/v1/adspaces/{id}/prices/{type} | Replace the floor prices for one device type.
*AdspacesApi* | [**apiV1AdspacesIdRecoverPost**](docs/AdspacesApi.md#apiv1adspacesidrecoverpost) | **POST** /api/v1/adspaces/{id}/recover | Reverse a soft-delete on an adspace.
*AdspacesApi* | [**apiV1AdspacesIdWlCampaignsGet**](docs/AdspacesApi.md#apiv1adspacesidwlcampaignsget) | **GET** /api/v1/adspaces/{id}/wl-campaigns | Campaigns that can be whitelisted on this zone, and the current whitelist.
*AdspacesApi* | [**apiV1AdspacesIdWlCampaignsPut**](docs/AdspacesApi.md#apiv1adspacesidwlcampaignsputoperation) | **PUT** /api/v1/adspaces/{id}/wl-campaigns | Replace the zone\&#39;s whitelisted campaigns.
*AdspacesApi* | [**apiV1AdspacesMassDeletePost**](docs/AdspacesApi.md#apiv1adspacesmassdeletepostoperation) | **POST** /api/v1/adspaces/mass-delete | Soft-delete several ad zones.
*AdspacesApi* | [**apiV1AdspacesMassRecoverPost**](docs/AdspacesApi.md#apiv1adspacesmassrecoverpostoperation) | **POST** /api/v1/adspaces/mass-recover | Recover several soft-deleted ad zones.
*AdspacesApi* | [**apiV1AdspacesTemplatesGet**](docs/AdspacesApi.md#apiv1adspacestemplatesget) | **GET** /api/v1/adspaces/templates | List your saved ad zone templates.
*AdspacesApi* | [**apiV1AdspacesTemplatesIdDelete**](docs/AdspacesApi.md#apiv1adspacestemplatesiddelete) | **DELETE** /api/v1/adspaces/templates/{id} | Delete a template.
*AdspacesApi* | [**apiV1AdspacesTemplatesIdPut**](docs/AdspacesApi.md#apiv1adspacestemplatesidputoperation) | **PUT** /api/v1/adspaces/templates/{id} | Replace a template\&#39;s data.
*AdspacesApi* | [**apiV1AdspacesTemplatesPost**](docs/AdspacesApi.md#apiv1adspacestemplatespostoperation) | **POST** /api/v1/adspaces/templates | Save an ad zone template.
*AdspacesApi* | [**apiV1AdspacesTypePost**](docs/AdspacesApi.md#apiv1adspacestypepost) | **POST** /api/v1/adspaces/{type} | Create a new adspace.
*AdspacesApi* | [**apiV1AdspacesTypeSchemaGet**](docs/AdspacesApi.md#apiv1adspacestypeschemaget) | **GET** /api/v1/adspaces/{type}/_schema | Field metadata for create/update of one adspace type.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingActionsActionIdDecidePost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingactionsactioniddecidepostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/actions/{actionId}/decide | Approve or reject a proposal.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingActionsGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingactionsget) | **GET** /api/v1/adspaces/{id}/media-buying/actions | Activity log: every block, bid, budget and other change, and open proposals.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingAgentRunPost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingagentrunpost) | **POST** /api/v1/adspaces/{id}/media-buying/agent/run | Run the buying agent now.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingAgentRunsGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingagentrunsget) | **GET** /api/v1/adspaces/{id}/media-buying/agent/runs | The buying agent\&#39;s recent runs with their summaries and proposals.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingBlockPost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingblockpostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/block | Block or unblock one source zone at the network.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingCompareGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingcompareget) | **GET** /api/v1/adspaces/{id}/media-buying/compare | Compare with another buy (A/B, e.g. against a control left to the network\&#39;s own optimiser).
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingget) | **GET** /api/v1/adspaces/{id}/media-buying | Overview: the connected network, what it supports, the policy and open proposals.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingIpsGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingipsget) | **GET** /api/v1/adspaces/{id}/media-buying/ips | The IP preblock list: ranges on the network\&#39;s exclusion list and proposals.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingIpsPost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingipspostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/ips | Change the IP preblock list.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingLaunchGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyinglaunchget) | **GET** /api/v1/adspaces/{id}/media-buying/launch | What a new campaign can be launched with (unconnected ad zones).
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingLaunchPost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyinglaunchpostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/launch | Launch a new campaign at the network for this ad zone.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingLaunchTemplatesGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyinglaunchtemplatesget) | **GET** /api/v1/adspaces/{id}/media-buying/launch/templates | Existing campaigns that can be cloned for a launch.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingNetworkBudgetGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingnetworkbudgetget) | **GET** /api/v1/adspaces/{id}/media-buying/network-budget | The campaign\&#39;s daily budget at the network.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingPolicyPut**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingpolicyput) | **PUT** /api/v1/adspaces/{id}/media-buying/policy | Save the buying policy (any subset of its fields).
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingPolicySuggestGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingpolicysuggestget) | **GET** /api/v1/adspaces/{id}/media-buying/policy/suggest | Suggested policy from the zone\&#39;s own traffic, with a reason per field.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingReportPost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingreportpostoperation) | **POST** /api/v1/adspaces/{id}/media-buying/report | Send the media buying report now.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingSegmentsGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsegmentsget) | **GET** /api/v1/adspaces/{id}/media-buying/segments | Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingSourceBidGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsourcebidget) | **GET** /api/v1/adspaces/{id}/media-buying/source/bid | The campaign\&#39;s current bid at the network.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingSourceBidPut**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsourcebidputoperation) | **PUT** /api/v1/adspaces/{id}/media-buying/source/bid | Set the campaign\&#39;s bid at the network.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingSourceRetryPost**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingsourceretrypost) | **POST** /api/v1/adspaces/{id}/media-buying/source/retry | Retry the connection to the source campaign.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingTargetingGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtargetingget) | **GET** /api/v1/adspaces/{id}/media-buying/targeting | The campaign\&#39;s placement targeting (all, or an allow-list).
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingTargetingPut**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtargetingputoperation) | **PUT** /api/v1/adspaces/{id}/media-buying/targeting | Switch to / edit the allow-list, or back to all placements.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingTargetingSuggestGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtargetingsuggestget) | **GET** /api/v1/adspaces/{id}/media-buying/targeting/suggest | Suggested allow-list: the profitable placements of the policy window.
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingTrackRecordGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingtrackrecordget) | **GET** /api/v1/adspaces/{id}/media-buying/track-record | Track record: did each change do what it was meant to?
*AgenticMediaBuyingApi* | [**apiV1AdspacesIdMediaBuyingZonesGet**](docs/AgenticMediaBuyingApi.md#apiv1adspacesidmediabuyingzonesget) | **GET** /api/v1/adspaces/{id}/media-buying/zones | Source-zone report: revenue against cost per placement.
*AgenticMediaBuyingApi* | [**apiV1MediaBuyingPortfolioGet**](docs/AgenticMediaBuyingApi.md#apiv1mediabuyingportfolioget) | **GET** /api/v1/media-buying/portfolio | Every buy side by side: margin against target, spend, proposals, the agent\&#39;s latest summary.
*AgenticMediaBuyingApi* | [**apiV1TrackerMediaBuyingPortfolioGet**](docs/AgenticMediaBuyingApi.md#apiv1trackermediabuyingportfolioget) | **GET** /api/v1/tracker/media-buying/portfolio | Every buy side by side (tracker accounts — the same overview): margin against target, spend, proposals, the agent\&#39;s latest summary.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePost**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingactionsactioniddecidepostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/actions/{actionId}/decide | Approve or reject a proposal.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingActionsGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingactionsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/actions | Activity log: every block, bid, budget and other change, and open proposals.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingAgentRunPost**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingagentrunpost) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/agent/run | Run the buying agent now.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingAgentRunsGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingagentrunsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/agent/runs | The buying agent\&#39;s recent runs with their summaries and proposals.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingBlockPost**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingblockpostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/block | Block or unblock one source zone at the network.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingCompareGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingcompareget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/compare | Compare with another buy (A/B, e.g. against a control left to the network\&#39;s own optimiser).
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying | Overview: the connected network, what it supports, the policy and open proposals.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingIpsGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingipsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/ips | The IP preblock list: ranges on the network\&#39;s exclusion list and proposals.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingIpsPost**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingipspostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/ips | Change the IP preblock list.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingNetworkBudgetGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingnetworkbudgetget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/network-budget | The campaign\&#39;s daily budget at the network.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingPolicyPut**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingpolicyput) | **PUT** /api/v1/tracker/tracking-links/{id}/media-buying/policy | Save the buying policy (any subset of its fields).
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingPolicySuggestGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingpolicysuggestget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/policy/suggest | Suggested policy from the zone\&#39;s own traffic, with a reason per field.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingReportPost**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingreportpostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/report | Send the media buying report now.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingSegmentsGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsegmentsget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/segments | Cost and revenue per segment: country, OS, hour, day of week, browser, region, carrier, language.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingSourceBidGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsourcebidget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/source/bid | The campaign\&#39;s current bid at the network.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingSourceBidPut**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsourcebidputoperation) | **PUT** /api/v1/tracker/tracking-links/{id}/media-buying/source/bid | Set the campaign\&#39;s bid at the network.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingSourceRetryPost**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingsourceretrypost) | **POST** /api/v1/tracker/tracking-links/{id}/media-buying/source/retry | Retry the connection to the source campaign.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingTargetingGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtargetingget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/targeting | The campaign\&#39;s placement targeting (all, or an allow-list).
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingTargetingPut**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtargetingputoperation) | **PUT** /api/v1/tracker/tracking-links/{id}/media-buying/targeting | Switch to / edit the allow-list, or back to all placements.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingTargetingSuggestGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtargetingsuggestget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/targeting/suggest | Suggested allow-list: the profitable placements of the policy window.
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingTrackRecordGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingtrackrecordget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/track-record | Track record: did each change do what it was meant to?
*AgenticMediaBuyingApi* | [**apiV1TrackerTrackingLinksIdMediaBuyingZonesGet**](docs/AgenticMediaBuyingApi.md#apiv1trackertrackinglinksidmediabuyingzonesget) | **GET** /api/v1/tracker/tracking-links/{id}/media-buying/zones | Source-zone report: revenue against cost per placement.
*BidRulesetsApi* | [**apiV1BidRulesetsGet**](docs/BidRulesetsApi.md#apiv1bidrulesetsget) | **GET** /api/v1/bid-rulesets | List the caller\&#39;s bid rulesets (lightweight rows).
*BidRulesetsApi* | [**apiV1BidRulesetsIdClonePost**](docs/BidRulesetsApi.md#apiv1bidrulesetsidclonepostoperation) | **POST** /api/v1/bid-rulesets/{id}/clone | Clone a ruleset with all its rules.
*BidRulesetsApi* | [**apiV1BidRulesetsIdDelete**](docs/BidRulesetsApi.md#apiv1bidrulesetsiddelete) | **DELETE** /api/v1/bid-rulesets/{id} | Soft-delete a ruleset.
*BidRulesetsApi* | [**apiV1BidRulesetsIdGet**](docs/BidRulesetsApi.md#apiv1bidrulesetsidget) | **GET** /api/v1/bid-rulesets/{id} | Show one ruleset, including all rules.
*BidRulesetsApi* | [**apiV1BidRulesetsIdPatch**](docs/BidRulesetsApi.md#apiv1bidrulesetsidpatchoperation) | **PATCH** /api/v1/bid-rulesets/{id} | Update a ruleset\&#39;s metadata and/or replace its rules.
*BidRulesetsApi* | [**apiV1BidRulesetsPost**](docs/BidRulesetsApi.md#apiv1bidrulesetspostoperation) | **POST** /api/v1/bid-rulesets | Create a new bid ruleset (with rules in one shot).
*CampaignsApi* | [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdDelete**](docs/CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceiddelete) | **DELETE** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId} | Remove an ad zone from a CPM campaign.
*CampaignsApi* | [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdPost**](docs/CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceidpostoperation) | **POST** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId} | Add an ad zone to a CPM campaign (or re-price it).
*CampaignsApi* | [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdPut**](docs/CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceidput) | **PUT** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId} | Switch a CPM campaign\&#39;s zone spot on or off.
*CampaignsApi* | [**apiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePut**](docs/CampaignsApi.md#apiv1campaignscpmcampaignidspotsspaceidtypeputoperation) | **PUT** /api/v1/campaigns/cpm/{campaignId}/spots/{spaceId}/{type} | Set a CPM zone spot\&#39;s bid or state.
*CampaignsApi* | [**apiV1CampaignsGet**](docs/CampaignsApi.md#apiv1campaignsget) | **GET** /api/v1/campaigns | List the caller\&#39;s campaigns across all types (or one type).
*CampaignsApi* | [**apiV1CampaignsMassDeletePost**](docs/CampaignsApi.md#apiv1campaignsmassdeletepostoperation) | **POST** /api/v1/campaigns/mass-delete | Soft-delete many campaigns.
*CampaignsApi* | [**apiV1CampaignsMassTogglePut**](docs/CampaignsApi.md#apiv1campaignsmasstoggleputoperation) | **PUT** /api/v1/campaigns/mass-toggle | Pause or resume many campaigns at once.
*CampaignsApi* | [**apiV1CampaignsMassUndeletePost**](docs/CampaignsApi.md#apiv1campaignsmassundeletepost) | **POST** /api/v1/campaigns/mass-undelete | Restore soft-deleted campaigns.
*CampaignsApi* | [**apiV1CampaignsPurgePost**](docs/CampaignsApi.md#apiv1campaignspurgepost) | **POST** /api/v1/campaigns/purge | Permanently delete soft-deleted campaigns and their ads.
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsget) | **GET** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | List per-zone bid overrides for a RON ad.
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidsputoperation) | **PUT** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids | Replace the per-zone bid overrides on a RON ad.
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidszoneiddelete) | **DELETE** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/{zoneId} | Clear a single per-zone bid override.
*CampaignsApi* | [**apiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPut**](docs/CampaignsApi.md#apiv1campaignsroncampaignidadsadidzonebidszonesonlyputoperation) | **PUT** /api/v1/campaigns/ron/{campaignId}/ads/{adId}/zone-bids/zones-only | Switch \&quot;only these zones\&quot; mode for a RON ad\&#39;s per-zone bids.
*CampaignsApi* | [**apiV1CampaignsRonIdSiteListGet**](docs/CampaignsApi.md#apiv1campaignsronidsitelistget) | **GET** /api/v1/campaigns/ron/{id}/site-list | The Premium-sites box of a RON campaign.
*CampaignsApi* | [**apiV1CampaignsRonIdSiteListSiteIdPut**](docs/CampaignsApi.md#apiv1campaignsronidsitelistsiteidputoperation) | **PUT** /api/v1/campaigns/ron/{id}/site-list/{siteId} | Set one site of the Premium-sites box active or blocked.
*CampaignsApi* | [**apiV1CampaignsRonIdZonesGet**](docs/CampaignsApi.md#apiv1campaignsronidzonesget) | **GET** /api/v1/campaigns/ron/{id}/zones | List the zones a RON campaign is linked to.
*CampaignsApi* | [**apiV1CampaignsRtbIdTestRtbGet**](docs/CampaignsApi.md#apiv1campaignsrtbidtestrtbget) | **GET** /api/v1/campaigns/rtb/{id}/test-rtb | Context for testing an RTB campaign\&#39;s endpoint.
*CampaignsApi* | [**apiV1CampaignsRtbIdTestRtbPost**](docs/CampaignsApi.md#apiv1campaignsrtbidtestrtbpost) | **POST** /api/v1/campaigns/rtb/{id}/test-rtb | Fire a test bid request at an RTB campaign\&#39;s endpoint.
*CampaignsApi* | [**apiV1CampaignsSaveCategoriesPut**](docs/CampaignsApi.md#apiv1campaignssavecategoriesputoperation) | **PUT** /api/v1/campaigns/save-categories | Assign categories to many campaigns.
*CampaignsApi* | [**apiV1CampaignsSaveTagsPut**](docs/CampaignsApi.md#apiv1campaignssavetagsputoperation) | **PUT** /api/v1/campaigns/save-tags | Assign tags (campaign groups) to many campaigns.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdActivePatch**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidactivepatch) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/active | Pause or unpause a single ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdBidPatch**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidbidpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bid | Set a single ad\&#39;s bid.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidbidspergeoputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/bids-per-geo | Set per-country bids for a RON ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdClonePost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidclonepost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/clone | Clone a single ad within a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdCountriesPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidcountriesputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/countries | Set per-ad country targeting for a RON ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdDelete**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadiddelete) | **DELETE** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Soft-delete an ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Show one ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdOverlayStatsGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidoverlaystatsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/overlay-stats | Shoppable video — shown and clicks per overlay.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId} | Update an ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsAdIdRestorePut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsadidrestoreput) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/{adId}/restore | Restore a deleted RON ad.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsCopyTargetsGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadscopytargetsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads/copy-targets | Campaigns this campaign\&#39;s ads can be copied into.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsCsvImportPost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadscsvimportpost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/csv-import | Import native ads from a CSV — one ad per row, or one ad per group.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsFromPoolPost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsfrompoolpostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/from-pool | Create ads from a creative pool.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/ads | List ads on a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsMassClonePost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsmassclonepostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/mass-clone | Copy many ads of a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsMassDeletePost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsmassdeletepostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/mass-delete | Soft-delete many ads of a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsMassTogglePut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsmasstoggleputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/mass-toggle | Activate or pause many ads of a campaign at once.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsMultiUploadPost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsmultiuploadpost) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads/multi-upload | Bulk-upload ads — one ad per creative file.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsPost**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadspostoperation) | **POST** /api/v1/campaigns/{type}/{campaignId}/ads | Create an ad on a campaign (smart-default).
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsUpdatePoolPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsupdatepoolputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-pool | Point many ads at a different creative pool.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsupdateurlpoolputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-url-pool | Point many ads at a URL pool, or detach it.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsUpdateUrlPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsupdateurlputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-url | Rewrite the destination URL of many ads at once.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdAdsUpdateWeightPut**](docs/CampaignsApi.md#apiv1campaignstypecampaignidadsupdateweightputoperation) | **PUT** /api/v1/campaigns/{type}/{campaignId}/ads/update-weight | Set the rotation weight of one or more RON ads.
*CampaignsApi* | [**apiV1CampaignsTypeCampaignIdSchemaAdsGet**](docs/CampaignsApi.md#apiv1campaignstypecampaignidschemaadsget) | **GET** /api/v1/campaigns/{type}/{campaignId}/_schema/ads | Field metadata for ad creation, scoped to a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdActivePatch**](docs/CampaignsApi.md#apiv1campaignstypeidactivepatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/active | Pause or unpause a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdAvailableZonesGet**](docs/CampaignsApi.md#apiv1campaignstypeidavailablezonesget) | **GET** /api/v1/campaigns/{type}/{id}/available-zones | List your ad zones that can be attached to a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdBidsPatch**](docs/CampaignsApi.md#apiv1campaignstypeidbidspatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/bids | Mass update bids on every ad in a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdBudgetPatch**](docs/CampaignsApi.md#apiv1campaignstypeidbudgetpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id}/budget | Update a campaign\&#39;s total and/or daily budget.
*CampaignsApi* | [**apiV1CampaignsTypeIdClonePost**](docs/CampaignsApi.md#apiv1campaignstypeidclonepostoperation) | **POST** /api/v1/campaigns/{type}/{id}/clone | Clone a campaign — everything, or the parts you pick.
*CampaignsApi* | [**apiV1CampaignsTypeIdDelete**](docs/CampaignsApi.md#apiv1campaignstypeiddelete) | **DELETE** /api/v1/campaigns/{type}/{id} | Soft-delete a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdFiltersFilterTypeFilterIdDelete**](docs/CampaignsApi.md#apiv1campaignstypeidfiltersfiltertypefilteriddelete) | **DELETE** /api/v1/campaigns/{type}/{id}/filters/{filter_type}/{filter_id} | Detach a filter from this campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdFiltersGet**](docs/CampaignsApi.md#apiv1campaignstypeidfiltersget) | **GET** /api/v1/campaigns/{type}/{id}/filters | List filters attached to this campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdFiltersPost**](docs/CampaignsApi.md#apiv1campaignstypeidfilterspostoperation) | **POST** /api/v1/campaigns/{type}/{id}/filters | Attach a filter to this campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdGet**](docs/CampaignsApi.md#apiv1campaignstypeidget) | **GET** /api/v1/campaigns/{type}/{id} | Get a single campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdMinBidGet**](docs/CampaignsApi.md#apiv1campaignstypeidminbidget) | **GET** /api/v1/campaigns/{type}/{id}/min-bid | Get the campaign\&#39;s minimum acceptable CPC bid.
*CampaignsApi* | [**apiV1CampaignsTypeIdPatch**](docs/CampaignsApi.md#apiv1campaignstypeidpatchoperation) | **PATCH** /api/v1/campaigns/{type}/{id} | Partially update a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdResetMaxBudgetPut**](docs/CampaignsApi.md#apiv1campaignstypeidresetmaxbudgetput) | **PUT** /api/v1/campaigns/{type}/{id}/reset-max-budget | Reset a campaign\&#39;s lifetime-budget spend.
*CampaignsApi* | [**apiV1CampaignsTypeIdSitesGet**](docs/CampaignsApi.md#apiv1campaignstypeidsitesget) | **GET** /api/v1/campaigns/{type}/{id}/sites | Your sites that have zones attachable to a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdWhitelistZonesGet**](docs/CampaignsApi.md#apiv1campaignstypeidwhitelistzonesget) | **GET** /api/v1/campaigns/{type}/{id}/whitelist-zones | List the ad zones attached to a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdZonesPost**](docs/CampaignsApi.md#apiv1campaignstypeidzonespostoperation) | **POST** /api/v1/campaigns/{type}/{id}/zones | Attach ad zones to a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdZonesZoneIdDelete**](docs/CampaignsApi.md#apiv1campaignstypeidzoneszoneiddelete) | **DELETE** /api/v1/campaigns/{type}/{id}/zones/{zoneId} | Detach an ad zone from a campaign.
*CampaignsApi* | [**apiV1CampaignsTypeIdZonesZoneIdWeightPut**](docs/CampaignsApi.md#apiv1campaignstypeidzoneszoneidweightputoperation) | **PUT** /api/v1/campaigns/{type}/{id}/zones/{zoneId}/weight | Set an attached zone\&#39;s weight for this campaign.
*CampaignsApi* | [**apiV1CampaignsTypePost**](docs/CampaignsApi.md#apiv1campaignstypepostoperation) | **POST** /api/v1/campaigns/{type} | Create a new campaign (smart-default).
*CampaignsApi* | [**apiV1CampaignsTypeSchemaAdsGet**](docs/CampaignsApi.md#apiv1campaignstypeschemaadsget) | **GET** /api/v1/campaigns/{type}/_schema/ads | Field metadata for ad creation.
*CampaignsApi* | [**apiV1CampaignsTypeSchemaGet**](docs/CampaignsApi.md#apiv1campaignstypeschemaget) | **GET** /api/v1/campaigns/{type}/_schema | Field metadata for create/update.
*CampaignsApi* | [**apiV1RtbTestRtbContextGet**](docs/CampaignsApi.md#apiv1rtbtestrtbcontextget) | **GET** /api/v1/rtb/test-rtb/context | Context for testing an endpoint before the campaign exists.
*CampaignsApi* | [**apiV1RtbTestRtbPost**](docs/CampaignsApi.md#apiv1rtbtestrtbpostoperation) | **POST** /api/v1/rtb/test-rtb | Fire a test bid request at any endpoint URL.
*CampaignsApi* | [**apiV1ToolsReplaceDomainPut**](docs/CampaignsApi.md#apiv1toolsreplacedomainputoperation) | **PUT** /api/v1/tools/replace-domain | Replace the landing domain across your RON ads.
*CleanupApi* | [**apiV1CleanupAdvertiserArchivedGet**](docs/CleanupApi.md#apiv1cleanupadvertiserarchivedget) | **GET** /api/v1/cleanup/advertiser/archived | Archived advertiser items that can be purged.
*CleanupApi* | [**apiV1CleanupAdvertiserExportGet**](docs/CleanupApi.md#apiv1cleanupadvertiserexportget) | **GET** /api/v1/cleanup/advertiser/export | Download the advertiser cleanup candidates.
*CleanupApi* | [**apiV1CleanupAdvertiserGet**](docs/CleanupApi.md#apiv1cleanupadvertiserget) | **GET** /api/v1/cleanup/advertiser | List advertiser items that no longer serve.
*CleanupApi* | [**apiV1CleanupAdvertiserLinkedGet**](docs/CleanupApi.md#apiv1cleanupadvertiserlinkedget) | **GET** /api/v1/cleanup/advertiser/linked | What still uses advertiser cleanup rows.
*CleanupApi* | [**apiV1CleanupAdvertiserPurgePost**](docs/CleanupApi.md#apiv1cleanupadvertiserpurgepost) | **POST** /api/v1/cleanup/advertiser/purge | Purge archived advertiser items for good.
*CleanupApi* | [**apiV1CleanupAdvertiserRunsGet**](docs/CleanupApi.md#apiv1cleanupadvertiserrunsget) | **GET** /api/v1/cleanup/advertiser/runs | Recent advertiser cleanup runs.
*CleanupApi* | [**apiV1CleanupAdvertiserRunsIdGet**](docs/CleanupApi.md#apiv1cleanupadvertiserrunsidget) | **GET** /api/v1/cleanup/advertiser/runs/{id} | One advertiser cleanup run with its items.
*CleanupApi* | [**apiV1CleanupAdvertiserRunsIdUndonePost**](docs/CleanupApi.md#apiv1cleanupadvertiserrunsidundonepost) | **POST** /api/v1/cleanup/advertiser/runs/{id}/undone | Mark a advertiser cleanup run as undone.
*CleanupApi* | [**apiV1CleanupAdvertiserRunsPost**](docs/CleanupApi.md#apiv1cleanupadvertiserrunspost) | **POST** /api/v1/cleanup/advertiser/runs | Record a advertiser cleanup run.
*CleanupApi* | [**apiV1CleanupAdvertiserSummaryGet**](docs/CleanupApi.md#apiv1cleanupadvertisersummaryget) | **GET** /api/v1/cleanup/advertiser/summary | Count the advertiser cleanup candidates per kind.
*CleanupApi* | [**apiV1CleanupPublisherArchivedGet**](docs/CleanupApi.md#apiv1cleanuppublisherarchivedget) | **GET** /api/v1/cleanup/publisher/archived | Archived publisher items that can be purged.
*CleanupApi* | [**apiV1CleanupPublisherExportGet**](docs/CleanupApi.md#apiv1cleanuppublisherexportget) | **GET** /api/v1/cleanup/publisher/export | Download the publisher cleanup candidates.
*CleanupApi* | [**apiV1CleanupPublisherGet**](docs/CleanupApi.md#apiv1cleanuppublisherget) | **GET** /api/v1/cleanup/publisher | List publisher items that no longer serve.
*CleanupApi* | [**apiV1CleanupPublisherLinkedGet**](docs/CleanupApi.md#apiv1cleanuppublisherlinkedget) | **GET** /api/v1/cleanup/publisher/linked | What still uses publisher cleanup rows.
*CleanupApi* | [**apiV1CleanupPublisherPurgePost**](docs/CleanupApi.md#apiv1cleanuppublisherpurgepost) | **POST** /api/v1/cleanup/publisher/purge | Purge archived publisher items for good.
*CleanupApi* | [**apiV1CleanupPublisherRunsGet**](docs/CleanupApi.md#apiv1cleanuppublisherrunsget) | **GET** /api/v1/cleanup/publisher/runs | Recent publisher cleanup runs.
*CleanupApi* | [**apiV1CleanupPublisherRunsIdGet**](docs/CleanupApi.md#apiv1cleanuppublisherrunsidget) | **GET** /api/v1/cleanup/publisher/runs/{id} | One publisher cleanup run with its items.
*CleanupApi* | [**apiV1CleanupPublisherRunsIdUndonePost**](docs/CleanupApi.md#apiv1cleanuppublisherrunsidundonepost) | **POST** /api/v1/cleanup/publisher/runs/{id}/undone | Mark a publisher cleanup run as undone.
*CleanupApi* | [**apiV1CleanupPublisherRunsPost**](docs/CleanupApi.md#apiv1cleanuppublisherrunspost) | **POST** /api/v1/cleanup/publisher/runs | Record a publisher cleanup run.
*CleanupApi* | [**apiV1CleanupPublisherSummaryGet**](docs/CleanupApi.md#apiv1cleanuppublishersummaryget) | **GET** /api/v1/cleanup/publisher/summary | Count the publisher cleanup candidates per kind.
*CouponsApi* | [**apiV1CouponsSetsGet**](docs/CouponsApi.md#apiv1couponssetsget) | **GET** /api/v1/coupons/sets | List coupon sets.
*CouponsApi* | [**apiV1CouponsSetsIdDelete**](docs/CouponsApi.md#apiv1couponssetsiddelete) | **DELETE** /api/v1/coupons/sets/{id} | Delete a set and all its codes.
*CouponsApi* | [**apiV1CouponsSetsIdExportGet**](docs/CouponsApi.md#apiv1couponssetsidexportget) | **GET** /api/v1/coupons/sets/{id}/export | Export a set\&#39;s codes as CSV.
*CouponsApi* | [**apiV1CouponsSetsIdGeneratePost**](docs/CouponsApi.md#apiv1couponssetsidgeneratepostoperation) | **POST** /api/v1/coupons/sets/{id}/generate | Generate codes in a set.
*CouponsApi* | [**apiV1CouponsSetsIdPut**](docs/CouponsApi.md#apiv1couponssetsidputoperation) | **PUT** /api/v1/coupons/sets/{id} | Rename a set or move its end date.
*CouponsApi* | [**apiV1CouponsSetsPost**](docs/CouponsApi.md#apiv1couponssetspostoperation) | **POST** /api/v1/coupons/sets | Create a coupon set.
*CouponsApi* | [**apiV1CouponsSetsSetIdCouponsGet**](docs/CouponsApi.md#apiv1couponssetssetidcouponsget) | **GET** /api/v1/coupons/sets/{setId}/coupons | List the codes in a set.
*CreativePoolsApi* | [**apiV1CreativePoolsGet**](docs/CreativePoolsApi.md#apiv1creativepoolsget) | **GET** /api/v1/creative-pools | List creative pools.
*CreativePoolsApi* | [**apiV1CreativePoolsIdAddCreativesPost**](docs/CreativePoolsApi.md#apiv1creativepoolsidaddcreativespostoperation) | **POST** /api/v1/creative-pools/{id}/add-creatives | Add media-bank creatives to a pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdAddUrlsPost**](docs/CreativePoolsApi.md#apiv1creativepoolsidaddurlspostoperation) | **POST** /api/v1/creative-pools/{id}/add-urls | Add hotlinked image / video / HTML URLs to a pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdClonePost**](docs/CreativePoolsApi.md#apiv1creativepoolsidclonepost) | **POST** /api/v1/creative-pools/{id}/clone | Clone a creative pool with all its items.
*CreativePoolsApi* | [**apiV1CreativePoolsIdDelete**](docs/CreativePoolsApi.md#apiv1creativepoolsiddelete) | **DELETE** /api/v1/creative-pools/{id} | Soft-delete a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdGet**](docs/CreativePoolsApi.md#apiv1creativepoolsidget) | **GET** /api/v1/creative-pools/{id} | Show a single creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsExportGet**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsexportget) | **GET** /api/v1/creative-pools/{id}/items/export | Download pool items\&#39; creative files as a ZIP.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsGet**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsget) | **GET** /api/v1/creative-pools/{id}/items | List items in a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsItemIdDelete**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsitemiddelete) | **DELETE** /api/v1/creative-pools/{id}/items/{itemId} | Soft-delete a single pool item.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsItemIdPut**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsitemidputoperation) | **PUT** /api/v1/creative-pools/{id}/items/{itemId} | Update a single pool item.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsItemIdTogglePut**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsitemidtoggleput) | **PUT** /api/v1/creative-pools/{id}/items/{itemId}/toggle | Toggle a pool item on / off.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsMassActionPut**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsmassactionputoperation) | **PUT** /api/v1/creative-pools/{id}/items/mass-action | Bulk-change items of a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsPost**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemspostoperation) | **POST** /api/v1/creative-pools/{id}/items | Add an item to a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdItemsRecoverPost**](docs/CreativePoolsApi.md#apiv1creativepoolsiditemsrecoverpostoperation) | **POST** /api/v1/creative-pools/{id}/items/recover | Put removed items back into a creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdPut**](docs/CreativePoolsApi.md#apiv1creativepoolsidputoperation) | **PUT** /api/v1/creative-pools/{id} | Update creative pool meta.
*CreativePoolsApi* | [**apiV1CreativePoolsIdRecoverPost**](docs/CreativePoolsApi.md#apiv1creativepoolsidrecoverpost) | **POST** /api/v1/creative-pools/{id}/recover | Restore an archived creative pool.
*CreativePoolsApi* | [**apiV1CreativePoolsIdUsedInGet**](docs/CreativePoolsApi.md#apiv1creativepoolsidusedinget) | **GET** /api/v1/creative-pools/{id}/used-in | List campaigns / ads that reference this pool.
*CreativePoolsApi* | [**apiV1CreativePoolsPost**](docs/CreativePoolsApi.md#apiv1creativepoolspostoperation) | **POST** /api/v1/creative-pools | Create a creative pool.
*CreativePoolsApi* | [**apiV1CreativesBulkDeletePost**](docs/CreativePoolsApi.md#apiv1creativesbulkdeletepostoperation) | **POST** /api/v1/creatives/bulk-delete | Soft-delete many media-bank creatives.
*CreativePoolsApi* | [**apiV1CreativesBulkUndeletePost**](docs/CreativePoolsApi.md#apiv1creativesbulkundeletepostoperation) | **POST** /api/v1/creatives/bulk-undelete | Restore many deleted creatives.
*CreativePoolsApi* | [**apiV1CreativesIdUndeletePut**](docs/CreativePoolsApi.md#apiv1creativesidundeleteput) | **PUT** /api/v1/creatives/{id}/undelete | Restore one deleted creative.
*CreativesApi* | [**apiV1CreativeFoldersGet**](docs/CreativesApi.md#apiv1creativefoldersget) | **GET** /api/v1/creative-folders | List media-bank folders.
*CreativesApi* | [**apiV1CreativeFoldersIdDelete**](docs/CreativesApi.md#apiv1creativefoldersiddelete) | **DELETE** /api/v1/creative-folders/{id} | Delete a folder.
*CreativesApi* | [**apiV1CreativeFoldersIdPut**](docs/CreativesApi.md#apiv1creativefoldersidputoperation) | **PUT** /api/v1/creative-folders/{id} | Rename or move a folder.
*CreativesApi* | [**apiV1CreativeFoldersPost**](docs/CreativesApi.md#apiv1creativefolderspostoperation) | **POST** /api/v1/creative-folders | Create a folder.
*CreativesApi* | [**apiV1CreativesBulkMovePost**](docs/CreativesApi.md#apiv1creativesbulkmovepostoperation) | **POST** /api/v1/creatives/bulk-move | File creatives into a folder.
*CreativesApi* | [**apiV1CreativesGet**](docs/CreativesApi.md#apiv1creativesget) | **GET** /api/v1/creatives | List the creative library.
*CreativesApi* | [**apiV1CreativesIdDelete**](docs/CreativesApi.md#apiv1creativesiddelete) | **DELETE** /api/v1/creatives/{id} | Delete a creative.
*CreativesApi* | [**apiV1CreativesIdGet**](docs/CreativesApi.md#apiv1creativesidget) | **GET** /api/v1/creatives/{id} | Show one creative.
*CreativesApi* | [**apiV1CreativesIdNamePut**](docs/CreativesApi.md#apiv1creativesidnameputoperation) | **PUT** /api/v1/creatives/{id}/name | Rename a creative (panel inline edit).
*CreativesApi* | [**apiV1CreativesIdPut**](docs/CreativesApi.md#apiv1creativesidputoperation) | **PUT** /api/v1/creatives/{id} | Rename and/or re-tag a creative.
*CreativesApi* | [**apiV1CreativesIdTagsPut**](docs/CreativesApi.md#apiv1creativesidtagsputoperation) | **PUT** /api/v1/creatives/{id}/tags | Replace a creative\&#39;s tags (panel inline edit).
*CreativesApi* | [**apiV1CreativesIdUsedInGet**](docs/CreativesApi.md#apiv1creativesidusedinget) | **GET** /api/v1/creatives/{id}/used-in | List ads / pools referencing this creative.
*CreativesApi* | [**apiV1CreativesUploadPost**](docs/CreativesApi.md#apiv1creativesuploadpost) | **POST** /api/v1/creatives/upload | Upload creative files.
*DirectDealsApi* | [**apiV1CampaignsDirectdealIdCancelPut**](docs/DirectDealsApi.md#apiv1campaignsdirectdealidcancelput) | **PUT** /api/v1/campaigns/directdeal/{id}/cancel | Cancel a direct deal.
*DirectDealsApi* | [**apiV1DirectDealsAdzonesGet**](docs/DirectDealsApi.md#apiv1directdealsadzonesget) | **GET** /api/v1/direct-deals/adzones | Ad zones a direct deal can be booked on.
*DirectDealsApi* | [**apiV1DirectDealsGet**](docs/DirectDealsApi.md#apiv1directdealsget) | **GET** /api/v1/direct-deals | List direct deals with their derived status.
*EventLogApi* | [**apiV1EventLogExportsGet**](docs/EventLogApi.md#apiv1eventlogexportsget) | **GET** /api/v1/event-log/exports | Your event log exports, newest first.
*EventLogApi* | [**apiV1EventLogExportsIdDownloadGet**](docs/EventLogApi.md#apiv1eventlogexportsiddownloadget) | **GET** /api/v1/event-log/exports/{id}/download | Download a finished export (.csv.gz).
*EventLogApi* | [**apiV1EventLogExportsPost**](docs/EventLogApi.md#apiv1eventlogexportspostoperation) | **POST** /api/v1/event-log/exports | Queue a CSV export of your events.
*EventLogApi* | [**apiV1EventLogGet**](docs/EventLogApi.md#apiv1eventlogget) | **GET** /api/v1/event-log | Your raw events — impressions and clicks with IP and user agent (90 days).
*FiltersApi* | [**apiV1FiltersGet**](docs/FiltersApi.md#apiv1filtersget) | **GET** /api/v1/filters | List all filters across types.
*FiltersApi* | [**apiV1FiltersIpIdRangesRangeIdDelete**](docs/FiltersApi.md#apiv1filtersipidrangesrangeiddelete) | **DELETE** /api/v1/filters/ip/{id}/ranges/{rangeId} | Delete one range from an IP pool.
*FiltersApi* | [**apiV1FiltersIpIdRangesRangeIdTogglePut**](docs/FiltersApi.md#apiv1filtersipidrangesrangeidtoggleput) | **PUT** /api/v1/filters/ip/{id}/ranges/{rangeId}/toggle | Pause / resume one range of an IP pool.
*FiltersApi* | [**apiV1FiltersMassActionPost**](docs/FiltersApi.md#apiv1filtersmassactionpostoperation) | **POST** /api/v1/filters/mass-action | Activate, deactivate or delete many filters.
*FiltersApi* | [**apiV1FiltersPost**](docs/FiltersApi.md#apiv1filterspostoperation) | **POST** /api/v1/filters | Create a filter and populate it with items.
*FiltersApi* | [**apiV1FiltersTypeIdActivePatch**](docs/FiltersApi.md#apiv1filterstypeidactivepatch) | **PATCH** /api/v1/filters/{type}/{id}/active | Activate or deactivate a filter (exclusion types only).
*FiltersApi* | [**apiV1FiltersTypeIdDelete**](docs/FiltersApi.md#apiv1filterstypeiddelete) | **DELETE** /api/v1/filters/{type}/{id} | Delete a filter (and its items, for IP pools).
*FiltersApi* | [**apiV1FiltersTypeIdGet**](docs/FiltersApi.md#apiv1filterstypeidget) | **GET** /api/v1/filters/{type}/{id} | Get a single filter with its items.
*FiltersApi* | [**apiV1FiltersTypeIdItemsItemDelete**](docs/FiltersApi.md#apiv1filterstypeiditemsitemdelete) | **DELETE** /api/v1/filters/{type}/{id}/items/{item} | Remove a single item from a filter.
*FiltersApi* | [**apiV1FiltersTypeIdItemsPost**](docs/FiltersApi.md#apiv1filterstypeiditemspostoperation) | **POST** /api/v1/filters/{type}/{id}/items | Add items to an existing filter.
*FiltersApi* | [**apiV1FiltersTypeIdPut**](docs/FiltersApi.md#apiv1filterstypeidputoperation) | **PUT** /api/v1/filters/{type}/{id} | Edit a filter (rename, replace items, change scope).
*FundsApi* | [**apiV1FundsBalanceSettingsPut**](docs/FundsApi.md#apiv1fundsbalancesettingsputoperation) | **PUT** /api/v1/funds/balance-settings | Set the low-balance warning.
*FundsApi* | [**apiV1FundsDepositTypeFidGet**](docs/FundsApi.md#apiv1fundsdeposittypefidget) | **GET** /api/v1/funds/deposit/{type}/{fid} | Checkout data for an open deposit — or its paid state.
*FundsApi* | [**apiV1FundsDepositTypePost**](docs/FundsApi.md#apiv1fundsdeposittypepostoperation) | **POST** /api/v1/funds/deposit/{type} | Open a deposit (or redeem a bonus / coupon code).
*FundsApi* | [**apiV1FundsDepositsIdDelete**](docs/FundsApi.md#apiv1fundsdepositsiddelete) | **DELETE** /api/v1/funds/deposits/{id} | Cancel an unpaid deposit.
*FundsApi* | [**apiV1FundsDepositsIdProofGet**](docs/FundsApi.md#apiv1fundsdepositsidproofget) | **GET** /api/v1/funds/deposits/{id}/proof | Download the proof of payment you uploaded on a deposit.
*FundsApi* | [**apiV1FundsDepositsIdProofPost**](docs/FundsApi.md#apiv1fundsdepositsidproofpost) | **POST** /api/v1/funds/deposits/{id}/proof | Upload the proof of payment of an open bank or Wise deposit.
*FundsApi* | [**apiV1FundsDepositsIdTxnHashPost**](docs/FundsApi.md#apiv1fundsdepositsidtxnhashpostoperation) | **POST** /api/v1/funds/deposits/{id}/txn-hash | Attach the transaction hash of a manual crypto deposit, or the transaction ID of a Payoneer deposit.
*FundsApi* | [**apiV1FundsGet**](docs/FundsApi.md#apiv1fundsget) | **GET** /api/v1/funds | Current advertiser balance + pending deposits.
*FundsApi* | [**apiV1FundsPayTypesGet**](docs/FundsApi.md#apiv1fundspaytypesget) | **GET** /api/v1/funds/pay-types | Payment methods this account can deposit with.
*FundsApi* | [**apiV1FundsTransactionsGet**](docs/FundsApi.md#apiv1fundstransactionsget) | **GET** /api/v1/funds/transactions | Funds ledger — deposits, bonuses, transfers, refunds.
*FundsApi* | [**apiV1FundsTransferPost**](docs/FundsApi.md#apiv1fundstransferpostoperation) | **POST** /api/v1/funds/transfer | Move balance to a connected advertiser account.
*LookupsApi* | [**apiV1LookupsAdspaceTypesGet**](docs/LookupsApi.md#apiv1lookupsadspacetypesget) | **GET** /api/v1/lookups/adspace-types | Adspace types the caller can publish on this tenant.
*LookupsApi* | [**apiV1LookupsAdzoneLocationsGet**](docs/LookupsApi.md#apiv1lookupsadzonelocationsget) | **GET** /api/v1/lookups/adzone-locations | Adzone locations for the tenant.
*LookupsApi* | [**apiV1LookupsAdzonesGet**](docs/LookupsApi.md#apiv1lookupsadzonesget) | **GET** /api/v1/lookups/adzones | Find adzone ids (for adzone filters).
*LookupsApi* | [**apiV1LookupsBannerSizesGet**](docs/LookupsApi.md#apiv1lookupsbannersizesget) | **GET** /api/v1/lookups/banner-sizes | Banner sizes for banner-flavored adspaces.
*LookupsApi* | [**apiV1LookupsBrowsersGet**](docs/LookupsApi.md#apiv1lookupsbrowsersget) | **GET** /api/v1/lookups/browsers | Browser ids (optionally scoped by device type).
*LookupsApi* | [**apiV1LookupsCarriersGet**](docs/LookupsApi.md#apiv1lookupscarriersget) | **GET** /api/v1/lookups/carriers | Mobile carriers (ids for carrier targeting).
*LookupsApi* | [**apiV1LookupsCategoriesGet**](docs/LookupsApi.md#apiv1lookupscategoriesget) | **GET** /api/v1/lookups/categories | Active sub-categories (optionally scoped to a main).
*LookupsApi* | [**apiV1LookupsDeviceTypesGet**](docs/LookupsApi.md#apiv1lookupsdevicetypesget) | **GET** /api/v1/lookups/device-types | Active device types for this tenant.
*LookupsApi* | [**apiV1LookupsDomainsGet**](docs/LookupsApi.md#apiv1lookupsdomainsget) | **GET** /api/v1/lookups/domains | Resolve domains to the ids domain filters store.
*LookupsApi* | [**apiV1LookupsIspsGet**](docs/LookupsApi.md#apiv1lookupsispsget) | **GET** /api/v1/lookups/isps | Find ISP ids (for ISP filters).
*LookupsApi* | [**apiV1LookupsLinkTypesGet**](docs/LookupsApi.md#apiv1lookupslinktypesget) | **GET** /api/v1/lookups/link-types | Active link types for the tenant.
*LookupsApi* | [**apiV1LookupsMainCategoriesGet**](docs/LookupsApi.md#apiv1lookupsmaincategoriesget) | **GET** /api/v1/lookups/main-categories | Active main categories for the tenant.
*LookupsApi* | [**apiV1LookupsOperatingSystemsGet**](docs/LookupsApi.md#apiv1lookupsoperatingsystemsget) | **GET** /api/v1/lookups/operating-systems | Operating-system ids (optionally scoped by device type).
*LookupsApi* | [**apiV1LookupsPublishersGet**](docs/LookupsApi.md#apiv1lookupspublishersget) | **GET** /api/v1/lookups/publishers | Find publisher ids (for publisher_excl filters).
*LookupsApi* | [**apiV1LookupsRatingsGet**](docs/LookupsApi.md#apiv1lookupsratingsget) | **GET** /api/v1/lookups/ratings | Active content ratings for the tenant.
*LookupsApi* | [**apiV1LookupsReelTypesGet**](docs/LookupsApi.md#apiv1lookupsreeltypesget) | **GET** /api/v1/lookups/reel-types | Active reel types for the tenant.
*LookupsApi* | [**apiV1LookupsRegionsGet**](docs/LookupsApi.md#apiv1lookupsregionsget) | **GET** /api/v1/lookups/regions | Walk the geo region tree (one level per call).
*LookupsApi* | [**apiV1LookupsWebsiteLanguagesGet**](docs/LookupsApi.md#apiv1lookupswebsitelanguagesget) | **GET** /api/v1/lookups/website-languages | Supported website languages (ISO codes).
*LookupsApi* | [**apiV1LookupsWebsiteTypesGet**](docs/LookupsApi.md#apiv1lookupswebsitetypesget) | **GET** /api/v1/lookups/website-types | Active website types for the tenant.
*MarketDataApi* | [**apiV1PricingFiltersGet**](docs/MarketDataApi.md#apiv1pricingfiltersget) | **GET** /api/v1/pricing/filters | Labels for the pricing table\&#39;s ids.
*MarketDataApi* | [**apiV1PricingGet**](docs/MarketDataApi.md#apiv1pricingget) | **GET** /api/v1/pricing | Network floor prices (minimum bids).
*MarketDataApi* | [**apiV1SmartNetworksGet**](docs/MarketDataApi.md#apiv1smartnetworksget) | **GET** /api/v1/smart-networks | List the network\&#39;s active smart networks.
*MarketDataApi* | [**apiV1SmartNetworksIdGet**](docs/MarketDataApi.md#apiv1smartnetworksidget) | **GET** /api/v1/smart-networks/{id} | One smart network.
*MarketDataApi* | [**apiV1VolumesFiltersGet**](docs/MarketDataApi.md#apiv1volumesfiltersget) | **GET** /api/v1/volumes/filters | Option lists for the volume query.
*MarketDataApi* | [**apiV1VolumesGet**](docs/MarketDataApi.md#apiv1volumesget) | **GET** /api/v1/volumes | Available traffic volume per country (traffic estimate).
*MarketplaceApi* | [**apiV1MarketplaceFiltersGet**](docs/MarketplaceApi.md#apiv1marketplacefiltersget) | **GET** /api/v1/marketplace/filters | Filter vocabulary for the marketplace.
*MarketplaceApi* | [**apiV1MarketplaceFlatRequestsGet**](docs/MarketplaceApi.md#apiv1marketplaceflatrequestsget) | **GET** /api/v1/marketplace/flat-requests | List my flat-deal requests.
*MarketplaceApi* | [**apiV1MarketplaceFlatRequestsIdCancelPost**](docs/MarketplaceApi.md#apiv1marketplaceflatrequestsidcancelpost) | **POST** /api/v1/marketplace/flat-requests/{id}/cancel | Withdraw a pending flat-deal request.
*MarketplaceApi* | [**apiV1MarketplaceFlatRequestsRenewPost**](docs/MarketplaceApi.md#apiv1marketplaceflatrequestsrenewpostoperation) | **POST** /api/v1/marketplace/flat-requests/renew | Propose one more flat deal on a live flat campaign.
*MarketplaceApi* | [**apiV1MarketplaceGet**](docs/MarketplaceApi.md#apiv1marketplaceget) | **GET** /api/v1/marketplace | List marketplace sites.
*MarketplaceApi* | [**apiV1MarketplaceIdGet**](docs/MarketplaceApi.md#apiv1marketplaceidget) | **GET** /api/v1/marketplace/{id} | Ad zones of one marketplace site, with starting prices.
*OAuthApi* | [**apiPublicIntegrationsHooksTokenPost**](docs/OAuthApi.md#apipublicintegrationshookstokenpost) | **POST** /api/public/integrations/hooks/{token} | Incoming webhook — create a lead, contact or task from JSON.
*OAuthApi* | [**apiPublicOauthIntrospectPost**](docs/OAuthApi.md#apipublicoauthintrospectpost) | **POST** /api/public/oauth/introspect | Introspect one of the calling app\&#39;s tokens (RFC 7662).
*OAuthApi* | [**apiPublicOauthMetadataGet**](docs/OAuthApi.md#apipublicoauthmetadataget) | **GET** /api/public/oauth/metadata | Authorization server metadata (RFC 8414) for this host.
*OAuthApi* | [**apiPublicOauthRevokePost**](docs/OAuthApi.md#apipublicoauthrevokepost) | **POST** /api/public/oauth/revoke | Revoke an access or refresh token (RFC 7009).
*OAuthApi* | [**apiPublicOauthTokenPost**](docs/OAuthApi.md#apipublicoauthtokenpost) | **POST** /api/public/oauth/token | Exchange an authorization code, or rotate a refresh token.
*OffersApi* | [**apiV1OffersGet**](docs/OffersApi.md#apiv1offersget) | **GET** /api/v1/offers | List available offers.
*PayoutsApi* | [**apiV1PublisherFinanceEarningsGet**](docs/PayoutsApi.md#apiv1publisherfinanceearningsget) | **GET** /api/v1/publisher/finance/earnings | Earnings per day, week or month.
*PayoutsApi* | [**apiV1PublisherFinanceGet**](docs/PayoutsApi.md#apiv1publisherfinanceget) | **GET** /api/v1/publisher/finance | Publisher balance and payout rules.
*PayoutsApi* | [**apiV1PublisherFinanceMonthEarningsGet**](docs/PayoutsApi.md#apiv1publisherfinancemonthearningsget) | **GET** /api/v1/publisher/finance/month-earnings | Monthly earnings statements.
*PayoutsApi* | [**apiV1PublisherFinancePayoutRequestPost**](docs/PayoutsApi.md#apiv1publisherfinancepayoutrequestpostoperation) | **POST** /api/v1/publisher/finance/payout-request | Request a payout of the balance.
*PayoutsApi* | [**apiV1PublisherFinancePayoutTypesGet**](docs/PayoutsApi.md#apiv1publisherfinancepayouttypesget) | **GET** /api/v1/publisher/finance/payout-types | Payout methods this account may choose.
*PayoutsApi* | [**apiV1PublisherFinancePayoutsGet**](docs/PayoutsApi.md#apiv1publisherfinancepayoutsget) | **GET** /api/v1/publisher/finance/payouts | List payout requests and payouts.
*PayoutsApi* | [**apiV1PublisherFinanceSettingsGet**](docs/PayoutsApi.md#apiv1publisherfinancesettingsget) | **GET** /api/v1/publisher/finance/settings | Payout method and payment details.
*PayoutsApi* | [**apiV1PublisherFinanceSettingsPut**](docs/PayoutsApi.md#apiv1publisherfinancesettingsputoperation) | **PUT** /api/v1/publisher/finance/settings | Change the payout method or payment details.
*PayoutsApi* | [**apiV1PublisherFinanceTransactionsGet**](docs/PayoutsApi.md#apiv1publisherfinancetransactionsget) | **GET** /api/v1/publisher/finance/transactions | List payout transactions (with USD totals).
*PayoutsApi* | [**apiV1PublisherFinanceTransactionsIdGet**](docs/PayoutsApi.md#apiv1publisherfinancetransactionsidget) | **GET** /api/v1/publisher/finance/transactions/{id} | One payout transaction.
*PayoutsApi* | [**apiV1PublisherFinanceTransactionsIdInvoicePdfGet**](docs/PayoutsApi.md#apiv1publisherfinancetransactionsidinvoicepdfget) | **GET** /api/v1/publisher/finance/transactions/{id}/invoice-pdf | Download the self-billing invoice PDF of a paid payout.
*PayoutsApi* | [**apiV1PublisherFinanceTransferToAdvertiserPost**](docs/PayoutsApi.md#apiv1publisherfinancetransfertoadvertiserpostoperation) | **POST** /api/v1/publisher/finance/transfer-to-advertiser | Move publisher balance to the advertiser budget.
*ProductFeedsApi* | [**apiV1ProductFeedsGet**](docs/ProductFeedsApi.md#apiv1productfeedsget) | **GET** /api/v1/product-feeds | List product feeds.
*ProductFeedsApi* | [**apiV1ProductFeedsIdDelete**](docs/ProductFeedsApi.md#apiv1productfeedsiddelete) | **DELETE** /api/v1/product-feeds/{id} | Delete a product feed.
*ProductFeedsApi* | [**apiV1ProductFeedsIdGet**](docs/ProductFeedsApi.md#apiv1productfeedsidget) | **GET** /api/v1/product-feeds/{id} | Show a product feed.
*ProductFeedsApi* | [**apiV1ProductFeedsIdItemsGet**](docs/ProductFeedsApi.md#apiv1productfeedsiditemsget) | **GET** /api/v1/product-feeds/{id}/items | The feed\&#39;s products and their ads.
*ProductFeedsApi* | [**apiV1ProductFeedsIdPatch**](docs/ProductFeedsApi.md#apiv1productfeedsidpatch) | **PATCH** /api/v1/product-feeds/{id} | Change a product feed.
*ProductFeedsApi* | [**apiV1ProductFeedsIdSyncPost**](docs/ProductFeedsApi.md#apiv1productfeedsidsyncpost) | **POST** /api/v1/product-feeds/{id}/sync | Sync a product feed now.
*ProductFeedsApi* | [**apiV1ProductFeedsPost**](docs/ProductFeedsApi.md#apiv1productfeedspostoperation) | **POST** /api/v1/product-feeds | Add a product feed.
*ProductFeedsApi* | [**apiV1ProductFeedsPreviewPost**](docs/ProductFeedsApi.md#apiv1productfeedspreviewpostoperation) | **POST** /api/v1/product-feeds/preview | Preview a dynamic banner.
*PublicApi* | [**apiPublicDemoGet**](docs/PublicApi.md#apipublicdemoget) | **GET** /api/public/demo | The network\&#39;s ad format demo pages.
*PublicApi* | [**apiPublicDemoSlugGet**](docs/PublicApi.md#apipublicdemoslugget) | **GET** /api/public/demo/{slug} | One ad format demo page (HTML).
*PublicApi* | [**apiPublicOfferwallIdGet**](docs/PublicApi.md#apipublicofferwallidget) | **GET** /api/public/offerwall/{id} | Offerwall list of an offer zone.
*PublicApi* | [**apiPublicOpenapiJsonGet**](docs/PublicApi.md#apipublicopenapijsonget) | **GET** /api/public/openapi.json | OpenAPI spec as JSON.
*PublicApi* | [**apiPublicOpenapiYamlGet**](docs/PublicApi.md#apipublicopenapiyamlget) | **GET** /api/public/openapi.yaml | Raw OpenAPI spec (this document).
*PublicApi* | [**apiPublicRoutesTxtGet**](docs/PublicApi.md#apipublicroutestxtget) | **GET** /api/public/routes.txt | Flat list of public routes — agent-friendly.
*PublisherFiltersApi* | [**apiV1PublisherFiltersGet**](docs/PublisherFiltersApi.md#apiv1publisherfiltersget) | **GET** /api/v1/publisher/filters | List the publisher\&#39;s URL block list.
*PublisherFiltersApi* | [**apiV1PublisherFiltersUrlsDelete**](docs/PublisherFiltersApi.md#apiv1publisherfiltersurlsdeleteoperation) | **DELETE** /api/v1/publisher/filters/urls | Remove one or more URLs from the block list.
*PublisherFiltersApi* | [**apiV1PublisherFiltersUrlsPost**](docs/PublisherFiltersApi.md#apiv1publisherfiltersurlspostoperation) | **POST** /api/v1/publisher/filters/urls | Add one or more URLs to the block list.
*PushAudienceApi* | [**apiV1PublisherPushDeliveryRulesGet**](docs/PushAudienceApi.md#apiv1publisherpushdeliveryrulesget) | **GET** /api/v1/publisher/push-delivery-rules | List standing delivery rules.
*PushAudienceApi* | [**apiV1PublisherPushDeliveryRulesIdDelete**](docs/PushAudienceApi.md#apiv1publisherpushdeliveryrulesiddelete) | **DELETE** /api/v1/publisher/push-delivery-rules/{id} | Delete a delivery rule.
*PushAudienceApi* | [**apiV1PublisherPushDeliveryRulesIdPut**](docs/PushAudienceApi.md#apiv1publisherpushdeliveryrulesidputoperation) | **PUT** /api/v1/publisher/push-delivery-rules/{id} | Update a delivery rule.
*PushAudienceApi* | [**apiV1PublisherPushDeliveryRulesPost**](docs/PushAudienceApi.md#apiv1publisherpushdeliveryrulespostoperation) | **POST** /api/v1/publisher/push-delivery-rules | Create a delivery rule.
*PushAudienceApi* | [**apiV1PublisherPushSegmentsGet**](docs/PushAudienceApi.md#apiv1publisherpushsegmentsget) | **GET** /api/v1/publisher/push-segments | List saved audience segments.
*PushAudienceApi* | [**apiV1PublisherPushSegmentsIdDelete**](docs/PushAudienceApi.md#apiv1publisherpushsegmentsiddelete) | **DELETE** /api/v1/publisher/push-segments/{id} | Delete an audience segment.
*PushAudienceApi* | [**apiV1PublisherPushSegmentsIdPut**](docs/PushAudienceApi.md#apiv1publisherpushsegmentsidputoperation) | **PUT** /api/v1/publisher/push-segments/{id} | Update an audience segment.
*PushAudienceApi* | [**apiV1PublisherPushSegmentsPost**](docs/PushAudienceApi.md#apiv1publisherpushsegmentspostoperation) | **POST** /api/v1/publisher/push-segments | Create an audience segment.
*PushAudienceApi* | [**apiV1PublisherPushSetupGet**](docs/PushAudienceApi.md#apiv1publisherpushsetupget) | **GET** /api/v1/publisher/push-setup | Collector setup facts for the opt-in script.
*PushAudienceApi* | [**apiV1PublisherPushStatsGet**](docs/PushAudienceApi.md#apiv1publisherpushstatsget) | **GET** /api/v1/publisher/push-stats | Push delivery performance.
*PushAudienceApi* | [**apiV1PublisherPushSubscribersActionPost**](docs/PushAudienceApi.md#apiv1publisherpushsubscribersactionpostoperation) | **POST** /api/v1/publisher/push-subscribers/action | Activate, deactivate or delete subscribers in bulk.
*PushAudienceApi* | [**apiV1PublisherPushSubscribersGet**](docs/PushAudienceApi.md#apiv1publisherpushsubscribersget) | **GET** /api/v1/publisher/push-subscribers | List captured push subscribers.
*PushCampaignsApi* | [**apiV1PublisherPushCampaignsGet**](docs/PushCampaignsApi.md#apiv1publisherpushcampaignsget) | **GET** /api/v1/publisher/push-campaigns | List the caller\&#39;s push campaigns.
*PushCampaignsApi* | [**apiV1PublisherPushCampaignsIdDelete**](docs/PushCampaignsApi.md#apiv1publisherpushcampaignsiddelete) | **DELETE** /api/v1/publisher/push-campaigns/{id} | Delete a push campaign.
*PushCampaignsApi* | [**apiV1PublisherPushCampaignsIdPut**](docs/PushCampaignsApi.md#apiv1publisherpushcampaignsidput) | **PUT** /api/v1/publisher/push-campaigns/{id} | Update a push campaign\&#39;s notification content.
*PushCampaignsApi* | [**apiV1PublisherPushCampaignsIdSendPost**](docs/PushCampaignsApi.md#apiv1publisherpushcampaignsidsendpost) | **POST** /api/v1/publisher/push-campaigns/{id}/send | Queue a push campaign for delivery.
*PushCampaignsApi* | [**apiV1PublisherPushCampaignsPost**](docs/PushCampaignsApi.md#apiv1publisherpushcampaignspostoperation) | **POST** /api/v1/publisher/push-campaigns | Create a push campaign.
*RetargetingApi* | [**apiV1RetargetingPixelsGet**](docs/RetargetingApi.md#apiv1retargetingpixelsget) | **GET** /api/v1/retargeting/pixels | List the caller\&#39;s retargeting pixels.
*RetargetingApi* | [**apiV1RetargetingPixelsIdActivePatch**](docs/RetargetingApi.md#apiv1retargetingpixelsidactivepatch) | **PATCH** /api/v1/retargeting/pixels/{id}/active | Activate or deactivate a retargeting pixel.
*RetargetingApi* | [**apiV1RetargetingPixelsIdDelete**](docs/RetargetingApi.md#apiv1retargetingpixelsiddelete) | **DELETE** /api/v1/retargeting/pixels/{id} | Soft-delete a retargeting pixel and clear its captured visitors.
*RetargetingApi* | [**apiV1RetargetingPixelsIdGet**](docs/RetargetingApi.md#apiv1retargetingpixelsidget) | **GET** /api/v1/retargeting/pixels/{id} | Get one retargeting pixel.
*RetargetingApi* | [**apiV1RetargetingPixelsIdPut**](docs/RetargetingApi.md#apiv1retargetingpixelsidput) | **PUT** /api/v1/retargeting/pixels/{id} | Update a retargeting pixel (name and visitor windows).
*RetargetingApi* | [**apiV1RetargetingPixelsPost**](docs/RetargetingApi.md#apiv1retargetingpixelspost) | **POST** /api/v1/retargeting/pixels | Create a retargeting pixel.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsGet**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsget) | **GET** /api/v1/publisher/ssp/campaigns | List SSP campaigns (feeds).
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdClonePost**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidclonepost) | **POST** /api/v1/publisher/ssp/campaigns/{id}/clone | Clone an SSP campaign.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdGet**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidget) | **GET** /api/v1/publisher/ssp/campaigns/{id} | Get one SSP campaign.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdPut**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidput) | **PUT** /api/v1/publisher/ssp/campaigns/{id} | Update an SSP campaign.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdTestRtbGet**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidtestrtbget) | **GET** /api/v1/publisher/ssp/campaigns/{id}/test-rtb | Context for an RTB test request.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdTestRtbPost**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidtestrtbpostoperation) | **POST** /api/v1/publisher/ssp/campaigns/{id}/test-rtb | Send one test bid request to the feed\&#39;s endpoint.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdToggleDeletePut**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidtoggledeleteputoperation) | **PUT** /api/v1/publisher/ssp/campaigns/{id}/toggle-delete | Delete or restore an SSP campaign.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdTogglePausePut**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidtogglepauseputoperation) | **PUT** /api/v1/publisher/ssp/campaigns/{id}/toggle-pause | Pause or resume an SSP campaign.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsIdWlRonCampaignsGet**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignsidwlroncampaignsget) | **GET** /api/v1/publisher/ssp/campaigns/{id}/wl-ron-campaigns | RON campaigns that can be whitelisted on a feed.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsPost**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignspost) | **POST** /api/v1/publisher/ssp/campaigns | Create an SSP campaign.
*SSPCampaignsApi* | [**apiV1PublisherSspCampaignsSetupDataGet**](docs/SSPCampaignsApi.md#apiv1publishersspcampaignssetupdataget) | **GET** /api/v1/publisher/ssp/campaigns/setup-data | Lookups for the SSP campaign form.
*SSPCampaignsApi* | [**apiV1PublisherSspFiltersGet**](docs/SSPCampaignsApi.md#apiv1publishersspfiltersget) | **GET** /api/v1/publisher/ssp/filters | Filter values for the SSP campaign list.
*SSPCampaignsApi* | [**apiV1PublisherSspNetworksGet**](docs/SSPCampaignsApi.md#apiv1publishersspnetworksget) | **GET** /api/v1/publisher/ssp/networks | RTB networks your SSP campaigns use.
*SSPCampaignsApi* | [**apiV1PublisherSspSellerDisclosurePut**](docs/SSPCampaignsApi.md#apiv1publishersspsellerdisclosureputoperation) | **PUT** /api/v1/publisher/ssp/seller-disclosure | Publish or hide your name in sellers.json.
*SSPCampaignsApi* | [**apiV1PublisherSspSitesIdAdsTxtCheckPost**](docs/SSPCampaignsApi.md#apiv1publishersspsitesidadstxtcheckpost) | **POST** /api/v1/publisher/ssp/sites/{id}/ads-txt-check | Re-check a site\&#39;s ads.txt now.
*SSPCampaignsApi* | [**apiV1PublisherSspSitesIdAdsTxtStatusGet**](docs/SSPCampaignsApi.md#apiv1publishersspsitesidadstxtstatusget) | **GET** /api/v1/publisher/ssp/sites/{id}/ads-txt-status | Last stored ads.txt check for a site.
*SharedReportsApi* | [**apiV1SharedReportsGet**](docs/SharedReportsApi.md#apiv1sharedreportsget) | **GET** /api/v1/shared-reports | List shared reports.
*SharedReportsApi* | [**apiV1SharedReportsIdDelete**](docs/SharedReportsApi.md#apiv1sharedreportsiddelete) | **DELETE** /api/v1/shared-reports/{id} | Delete a shared report.
*SharedReportsApi* | [**apiV1SharedReportsIdGet**](docs/SharedReportsApi.md#apiv1sharedreportsidget) | **GET** /api/v1/shared-reports/{id} | Show a shared report.
*SharedReportsApi* | [**apiV1SharedReportsIdPut**](docs/SharedReportsApi.md#apiv1sharedreportsidputoperation) | **PUT** /api/v1/shared-reports/{id} | Update a shared report.
*SharedReportsApi* | [**apiV1SharedReportsIdToggleActivePut**](docs/SharedReportsApi.md#apiv1sharedreportsidtoggleactiveput) | **PUT** /api/v1/shared-reports/{id}/toggle-active | Switch a report\&#39;s link on or off.
*SharedReportsApi* | [**apiV1SharedReportsPost**](docs/SharedReportsApi.md#apiv1sharedreportspost) | **POST** /api/v1/shared-reports | Create a shared report.
*SharedReportsApi* | [**apiV1SharedReportsSetupDataGet**](docs/SharedReportsApi.md#apiv1sharedreportssetupdataget) | **GET** /api/v1/shared-reports/setup-data | Campaigns and sites a report can cover.
*SitesApi* | [**apiV1DomainsGet**](docs/SitesApi.md#apiv1domainsget) | **GET** /api/v1/domains | List your custom domains (Domain Manager).
*SitesApi* | [**apiV1DomainsIdDelete**](docs/SitesApi.md#apiv1domainsiddelete) | **DELETE** /api/v1/domains/{id} | Delete a custom domain.
*SitesApi* | [**apiV1DomainsIdGet**](docs/SitesApi.md#apiv1domainsidget) | **GET** /api/v1/domains/{id} | Show one custom domain.
*SitesApi* | [**apiV1DomainsIdNotesPut**](docs/SitesApi.md#apiv1domainsidnotesputoperation) | **PUT** /api/v1/domains/{id}/notes | Set your notes on a domain.
*SitesApi* | [**apiV1DomainsIdRedoPost**](docs/SitesApi.md#apiv1domainsidredopost) | **POST** /api/v1/domains/{id}/redo | Retry setting up a domain (DNS / certificate check again).
*SitesApi* | [**apiV1DomainsIdToggleActivePost**](docs/SitesApi.md#apiv1domainsidtoggleactivepost) | **POST** /api/v1/domains/{id}/toggle-active | Switch a custom domain on or off.
*SitesApi* | [**apiV1DomainsPost**](docs/SitesApi.md#apiv1domainspostoperation) | **POST** /api/v1/domains | Add a custom domain.
*SitesApi* | [**apiV1SitesGet**](docs/SitesApi.md#apiv1sitesget) | **GET** /api/v1/sites | List the caller\&#39;s websites.
*SitesApi* | [**apiV1SitesIdClonePost**](docs/SitesApi.md#apiv1sitesidclonepostoperation) | **POST** /api/v1/sites/{id}/clone | Duplicate a site under a new name and URL, with its ad zones.
*SitesApi* | [**apiV1SitesIdDelete**](docs/SitesApi.md#apiv1sitesiddelete) | **DELETE** /api/v1/sites/{id} | Soft-delete a site.
*SitesApi* | [**apiV1SitesIdGet**](docs/SitesApi.md#apiv1sitesidget) | **GET** /api/v1/sites/{id} | Get a single site.
*SitesApi* | [**apiV1SitesIdPatch**](docs/SitesApi.md#apiv1sitesidpatch) | **PATCH** /api/v1/sites/{id} | Update a site.
*SitesApi* | [**apiV1SitesIdRecoverPost**](docs/SitesApi.md#apiv1sitesidrecoverpost) | **POST** /api/v1/sites/{id}/recover | Reverse a soft-delete on a site.
*SitesApi* | [**apiV1SitesIdSnippetsGet**](docs/SitesApi.md#apiv1sitesidsnippetsget) | **GET** /api/v1/sites/{id}/snippets | List the site\&#39;s HTML snippets.
*SitesApi* | [**apiV1SitesIdSnippetsPost**](docs/SitesApi.md#apiv1sitesidsnippetspost) | **POST** /api/v1/sites/{id}/snippets | Add an HTML snippet.
*SitesApi* | [**apiV1SitesIdSnippetsSnippetIdDelete**](docs/SitesApi.md#apiv1sitesidsnippetssnippetiddelete) | **DELETE** /api/v1/sites/{id}/snippets/{snippetId} | Delete an HTML snippet.
*SitesApi* | [**apiV1SitesIdSnippetsSnippetIdPut**](docs/SitesApi.md#apiv1sitesidsnippetssnippetidput) | **PUT** /api/v1/sites/{id}/snippets/{snippetId} | Replace an HTML snippet.
*SitesApi* | [**apiV1SitesIdVerifyPost**](docs/SitesApi.md#apiv1sitesidverifypost) | **POST** /api/v1/sites/{id}/verify | Trigger HTTP re-check of the site verification meta tag.
*SitesApi* | [**apiV1SitesPost**](docs/SitesApi.md#apiv1sitespost) | **POST** /api/v1/sites | Create a new website.
*SitesApi* | [**apiV1SitesSchemaGet**](docs/SitesApi.md#apiv1sitesschemaget) | **GET** /api/v1/sites/_schema | Field metadata for site create/update.
*SmartZonesApi* | [**apiV1PublisherSmartzonesDistributionAdspacesIdGet**](docs/SmartZonesApi.md#apiv1publishersmartzonesdistributionadspacesidget) | **GET** /api/v1/publisher/smartzones/distribution/adspaces/{id} | Network split for one ad zone.
*SmartZonesApi* | [**apiV1PublisherSmartzonesDistributionPerSiteGet**](docs/SmartZonesApi.md#apiv1publishersmartzonesdistributionpersiteget) | **GET** /api/v1/publisher/smartzones/distribution/per-site | Traffic and earnings split across networks for one site.
*SmartZonesApi* | [**apiV1PublisherSmartzonesDistributionSitesGet**](docs/SmartZonesApi.md#apiv1publishersmartzonesdistributionsitesget) | **GET** /api/v1/publisher/smartzones/distribution/sites | Sites that carry smart zones.
*SmartZonesApi* | [**apiV1PublisherSmartzonesGet**](docs/SmartZonesApi.md#apiv1publishersmartzonesget) | **GET** /api/v1/publisher/smartzones | List smart zones.
*SmartZonesApi* | [**apiV1PublisherSmartzonesIdDelete**](docs/SmartZonesApi.md#apiv1publishersmartzonesiddelete) | **DELETE** /api/v1/publisher/smartzones/{id} | Delete a smart zone.
*SmartZonesApi* | [**apiV1PublisherSmartzonesIdGet**](docs/SmartZonesApi.md#apiv1publishersmartzonesidget) | **GET** /api/v1/publisher/smartzones/{id} | Get one smart zone.
*SmartZonesApi* | [**apiV1PublisherSmartzonesIdPut**](docs/SmartZonesApi.md#apiv1publishersmartzonesidputoperation) | **PUT** /api/v1/publisher/smartzones/{id} | Update a smart zone.
*SmartZonesApi* | [**apiV1PublisherSmartzonesImportPost**](docs/SmartZonesApi.md#apiv1publishersmartzonesimportpostoperation) | **POST** /api/v1/publisher/smartzones/import | Bulk import smart zones.
*SmartZonesApi* | [**apiV1PublisherSmartzonesNetworksGet**](docs/SmartZonesApi.md#apiv1publishersmartzonesnetworksget) | **GET** /api/v1/publisher/smartzones/networks | List your smart network accounts.
*SmartZonesApi* | [**apiV1PublisherSmartzonesNetworksIdDelete**](docs/SmartZonesApi.md#apiv1publishersmartzonesnetworksiddelete) | **DELETE** /api/v1/publisher/smartzones/networks/{id} | Remove a smart network account.
*SmartZonesApi* | [**apiV1PublisherSmartzonesNetworksPost**](docs/SmartZonesApi.md#apiv1publishersmartzonesnetworkspostoperation) | **POST** /api/v1/publisher/smartzones/networks | Add or update a smart network account.
*SmartZonesApi* | [**apiV1PublisherSmartzonesPost**](docs/SmartZonesApi.md#apiv1publishersmartzonespostoperation) | **POST** /api/v1/publisher/smartzones | Create a smart zone.
*SmartZonesApi* | [**apiV1PublisherSmartzonesSetupDataGet**](docs/SmartZonesApi.md#apiv1publishersmartzonessetupdataget) | **GET** /api/v1/publisher/smartzones/setup-data | Lookups for the smart-zone form.
*SmartZonesApi* | [**apiV1PublisherSmartzonesSspCampaignsGet**](docs/SmartZonesApi.md#apiv1publishersmartzonessspcampaignsget) | **GET** /api/v1/publisher/smartzones/ssp-campaigns | SSP campaigns usable as a smart zone\&#39;s RTB feed.
*SourceOptimizersApi* | [**apiV1CpaOptimizersGet**](docs/SourceOptimizersApi.md#apiv1cpaoptimizersget) | **GET** /api/v1/cpa-optimizers | List CPA optimizers.
*SourceOptimizersApi* | [**apiV1CpaOptimizersIdDelete**](docs/SourceOptimizersApi.md#apiv1cpaoptimizersiddelete) | **DELETE** /api/v1/cpa-optimizers/{id} | Delete a CPA optimizer.
*SourceOptimizersApi* | [**apiV1CpaOptimizersIdGet**](docs/SourceOptimizersApi.md#apiv1cpaoptimizersidget) | **GET** /api/v1/cpa-optimizers/{id} | Show a CPA optimizer.
*SourceOptimizersApi* | [**apiV1CpaOptimizersIdPut**](docs/SourceOptimizersApi.md#apiv1cpaoptimizersidput) | **PUT** /api/v1/cpa-optimizers/{id} | Replace a CPA optimizer.
*SourceOptimizersApi* | [**apiV1CpaOptimizersPost**](docs/SourceOptimizersApi.md#apiv1cpaoptimizerspost) | **POST** /api/v1/cpa-optimizers | Create a CPA optimizer.
*SourceOptimizersApi* | [**apiV1CpmOptimizersActiveGet**](docs/SourceOptimizersApi.md#apiv1cpmoptimizersactiveget) | **GET** /api/v1/cpm-optimizers/active | Does the account have any CPM optimizer?
*SourceOptimizersApi* | [**apiV1CpmOptimizersGet**](docs/SourceOptimizersApi.md#apiv1cpmoptimizersget) | **GET** /api/v1/cpm-optimizers | List CPM optimizers.
*SourceOptimizersApi* | [**apiV1CpmOptimizersIdDelete**](docs/SourceOptimizersApi.md#apiv1cpmoptimizersiddelete) | **DELETE** /api/v1/cpm-optimizers/{id} | Delete a CPM optimizer.
*SourceOptimizersApi* | [**apiV1CpmOptimizersIdGet**](docs/SourceOptimizersApi.md#apiv1cpmoptimizersidget) | **GET** /api/v1/cpm-optimizers/{id} | Show a CPM optimizer.
*SourceOptimizersApi* | [**apiV1CpmOptimizersIdPut**](docs/SourceOptimizersApi.md#apiv1cpmoptimizersidput) | **PUT** /api/v1/cpm-optimizers/{id} | Replace a CPM optimizer.
*SourceOptimizersApi* | [**apiV1CpmOptimizersPost**](docs/SourceOptimizersApi.md#apiv1cpmoptimizerspost) | **POST** /api/v1/cpm-optimizers | Create a CPM optimizer.
*SourceOptimizersApi* | [**apiV1SourceOptimizerConfigGet**](docs/SourceOptimizersApi.md#apiv1sourceoptimizerconfigget) | **GET** /api/v1/source-optimizer/config | Option values for the optimizer forms.
*StatsAdvertiserApi* | [**apiV1AdvertiserStatsGet**](docs/StatsAdvertiserApi.md#apiv1advertiserstatsget) | **GET** /api/v1/advertiser/stats | Display, native and CPM/RON campaign stats.
*StatsAdvertiserOffersApi* | [**apiV1AdvertiserOffersStatsGet**](docs/StatsAdvertiserOffersApi.md#apiv1advertiseroffersstatsget) | **GET** /api/v1/advertiser/offers/stats | CPA / affiliate offer performance — advertiser side.
*StatsAdvertiserRTBApi* | [**apiV1AdvertiserRtbStatsGet**](docs/StatsAdvertiserRTBApi.md#apiv1advertiserrtbstatsget) | **GET** /api/v1/advertiser/rtb/stats | DSP / RTB-side stats.
*StatsAffiliateApi* | [**apiV1PublisherOffersPostbackLogGet**](docs/StatsAffiliateApi.md#apiv1publisherofferspostbacklogget) | **GET** /api/v1/publisher/offers/postback-log | Postback log — the conversion postbacks fired to your URLs.
*StatsAffiliateApi* | [**apiV1PublisherOffersStatsGet**](docs/StatsAffiliateApi.md#apiv1publisheroffersstatsget) | **GET** /api/v1/publisher/offers/stats | Affiliate / smartlink offer performance — publisher side.
*StatsPublisherApi* | [**apiV1PublisherStatsGet**](docs/StatsPublisherApi.md#apiv1publisherstatsget) | **GET** /api/v1/publisher/stats | Publisher earnings (sites / adzones).
*StatsPublisherSSPApi* | [**apiV1PublisherSspStatsDetailsGet**](docs/StatsPublisherSSPApi.md#apiv1publishersspstatsdetailsget) | **GET** /api/v1/publisher/ssp/stats/details | SSP report broken down by one dimension.
*StatsPublisherSSPApi* | [**apiV1PublisherSspStatsFiltersGet**](docs/StatsPublisherSSPApi.md#apiv1publishersspstatsfiltersget) | **GET** /api/v1/publisher/ssp/stats/filters | Filter values for the SSP reports.
*StatsPublisherSSPApi* | [**apiV1PublisherSspStatsFlatGet**](docs/StatsPublisherSSPApi.md#apiv1publishersspstatsflatget) | **GET** /api/v1/publisher/ssp/stats/flat | SSP report grouped by several dimensions.
*StatsPublisherSSPApi* | [**apiV1PublisherSspStatsGet**](docs/StatsPublisherSSPApi.md#apiv1publishersspstatsget) | **GET** /api/v1/publisher/ssp/stats | SSP / smart-campaign earnings.
*StatsPublisherSmartZonesApi* | [**apiV1PublisherSmartzonesStatsFiltersGet**](docs/StatsPublisherSmartZonesApi.md#apiv1publishersmartzonesstatsfiltersget) | **GET** /api/v1/publisher/smartzones/stats/filters | Filter values for smart-zone stats.
*StatsPublisherSmartZonesApi* | [**apiV1PublisherSmartzonesStatsGet**](docs/StatsPublisherSmartZonesApi.md#apiv1publishersmartzonesstatsget) | **GET** /api/v1/publisher/smartzones/stats | SmartZone (waterfall) earnings.
*TagsApi* | [**apiV1TagsGet**](docs/TagsApi.md#apiv1tagsget) | **GET** /api/v1/tags | List tags.
*TagsApi* | [**apiV1TagsIdDelete**](docs/TagsApi.md#apiv1tagsiddelete) | **DELETE** /api/v1/tags/{id} | Delete a tag.
*TagsApi* | [**apiV1TagsIdGet**](docs/TagsApi.md#apiv1tagsidget) | **GET** /api/v1/tags/{id} | Show a tag.
*TagsApi* | [**apiV1TagsIdPut**](docs/TagsApi.md#apiv1tagsidputoperation) | **PUT** /api/v1/tags/{id} | Rename or move a tag.
*TagsApi* | [**apiV1TagsMassDeletePost**](docs/TagsApi.md#apiv1tagsmassdeletepostoperation) | **POST** /api/v1/tags/mass-delete | Delete several tags.
*TagsApi* | [**apiV1TagsPost**](docs/TagsApi.md#apiv1tagspostoperation) | **POST** /api/v1/tags | Create a tag.
*TrackerAutomationApi* | [**apiV1TrackerExportTypeGet**](docs/TrackerAutomationApi.md#apiv1trackerexporttypeget) | **GET** /api/v1/tracker/export/{type} | Export tracker entities as CSV.
*TrackerAutomationApi* | [**apiV1TrackerImportTypePost**](docs/TrackerAutomationApi.md#apiv1trackerimporttypepost) | **POST** /api/v1/tracker/import/{type} | Bulk-import offers from CSV.
*TrackerAutomationApi* | [**apiV1TrackerReportSchedulesGet**](docs/TrackerAutomationApi.md#apiv1trackerreportschedulesget) | **GET** /api/v1/tracker/report-schedules | List scheduled report deliveries.
*TrackerAutomationApi* | [**apiV1TrackerReportSchedulesIdDelete**](docs/TrackerAutomationApi.md#apiv1trackerreportschedulesiddelete) | **DELETE** /api/v1/tracker/report-schedules/{id} | Delete a report schedule.
*TrackerAutomationApi* | [**apiV1TrackerReportSchedulesIdGet**](docs/TrackerAutomationApi.md#apiv1trackerreportschedulesidget) | **GET** /api/v1/tracker/report-schedules/{id} | Get one report schedule.
*TrackerAutomationApi* | [**apiV1TrackerReportSchedulesIdPut**](docs/TrackerAutomationApi.md#apiv1trackerreportschedulesidputoperation) | **PUT** /api/v1/tracker/report-schedules/{id} | Update a report schedule.
*TrackerAutomationApi* | [**apiV1TrackerReportSchedulesPost**](docs/TrackerAutomationApi.md#apiv1trackerreportschedulespostoperation) | **POST** /api/v1/tracker/report-schedules | Schedule a recurring report.
*TrackerAutomationApi* | [**apiV1TrackerRulesGet**](docs/TrackerAutomationApi.md#apiv1trackerrulesget) | **GET** /api/v1/tracker/rules | List automation rules.
*TrackerAutomationApi* | [**apiV1TrackerRulesIdDelete**](docs/TrackerAutomationApi.md#apiv1trackerrulesiddelete) | **DELETE** /api/v1/tracker/rules/{id} | Delete a rule.
*TrackerAutomationApi* | [**apiV1TrackerRulesIdExecutionsGet**](docs/TrackerAutomationApi.md#apiv1trackerrulesidexecutionsget) | **GET** /api/v1/tracker/rules/{id}/executions | Execution history for one rule.
*TrackerAutomationApi* | [**apiV1TrackerRulesIdGet**](docs/TrackerAutomationApi.md#apiv1trackerrulesidget) | **GET** /api/v1/tracker/rules/{id} | Get one rule.
*TrackerAutomationApi* | [**apiV1TrackerRulesIdPut**](docs/TrackerAutomationApi.md#apiv1trackerrulesidputoperation) | **PUT** /api/v1/tracker/rules/{id} | Update a rule.
*TrackerAutomationApi* | [**apiV1TrackerRulesIdRunPost**](docs/TrackerAutomationApi.md#apiv1trackerrulesidrunpost) | **POST** /api/v1/tracker/rules/{id}/run | Run a rule now.
*TrackerAutomationApi* | [**apiV1TrackerRulesPost**](docs/TrackerAutomationApi.md#apiv1trackerrulespostoperation) | **POST** /api/v1/tracker/rules | Create an automation rule.
*TrackerConversionsApi* | [**apiV1TrackerConversionLoggingGet**](docs/TrackerConversionsApi.md#apiv1trackerconversionloggingget) | **GET** /api/v1/tracker/conversion-logging | Get conversion-logging settings.
*TrackerConversionsApi* | [**apiV1TrackerConversionLoggingPut**](docs/TrackerConversionsApi.md#apiv1trackerconversionloggingputoperation) | **PUT** /api/v1/tracker/conversion-logging | Change conversion-logging settings.
*TrackerConversionsApi* | [**apiV1TrackerConversionTypesGet**](docs/TrackerConversionsApi.md#apiv1trackerconversiontypesget) | **GET** /api/v1/tracker/conversion-types | Get the conversion-type labels.
*TrackerConversionsApi* | [**apiV1TrackerConversionTypesPut**](docs/TrackerConversionsApi.md#apiv1trackerconversiontypesputoperation) | **PUT** /api/v1/tracker/conversion-types | Rename the conversion types.
*TrackerConversionsApi* | [**apiV1TrackerConversionsClickidPostbacksGet**](docs/TrackerConversionsApi.md#apiv1trackerconversionsclickidpostbacksget) | **GET** /api/v1/tracker/conversions/{clickid}/postbacks | Outbound postbacks fired for one conversion.
*TrackerConversionsApi* | [**apiV1TrackerConversionsGet**](docs/TrackerConversionsApi.md#apiv1trackerconversionsget) | **GET** /api/v1/tracker/conversions | List incoming conversions.
*TrackerConversionsApi* | [**apiV1TrackerConversionsIdStatePut**](docs/TrackerConversionsApi.md#apiv1trackerconversionsidstateputoperation) | **PUT** /api/v1/tracker/conversions/{id}/state | Approve or reject one conversion.
*TrackerConversionsApi* | [**apiV1TrackerConversionsRejectedGet**](docs/TrackerConversionsApi.md#apiv1trackerconversionsrejectedget) | **GET** /api/v1/tracker/conversions/rejected | List refused inbound postbacks.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksDeleteReportsPut**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksdeletereportsputoperation) | **PUT** /api/v1/tracker/ad-networks/delete-reports | Delete pulled spend reports.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksGet**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksget) | **GET** /api/v1/tracker/ad-networks | List ad networks.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksIdCampaignsGet**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksidcampaignsget) | **GET** /api/v1/tracker/ad-networks/{id}/campaigns | Campaigns known on one ad network.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksIdDelete**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksiddelete) | **DELETE** /api/v1/tracker/ad-networks/{id} | Delete an ad network.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksIdGet**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksidget) | **GET** /api/v1/tracker/ad-networks/{id} | Get one ad network.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksIdPut**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksidputoperation) | **PUT** /api/v1/tracker/ad-networks/{id} | Update an ad network.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksPost**](docs/TrackerNetworksApi.md#apiv1trackeradnetworkspostoperation) | **POST** /api/v1/tracker/ad-networks | Create an ad network.
*TrackerNetworksApi* | [**apiV1TrackerAdNetworksReportsGet**](docs/TrackerNetworksApi.md#apiv1trackeradnetworksreportsget) | **GET** /api/v1/tracker/ad-networks/reports | Spend reports pulled from the ad networks.
*TrackerNetworksApi* | [**apiV1TrackerAffiliateNetworkTemplatesGet**](docs/TrackerNetworksApi.md#apiv1trackeraffiliatenetworktemplatesget) | **GET** /api/v1/tracker/affiliate-network-templates | List affiliate-network templates.
*TrackerNetworksApi* | [**apiV1TrackerAffiliateNetworksGet**](docs/TrackerNetworksApi.md#apiv1trackeraffiliatenetworksget) | **GET** /api/v1/tracker/affiliate-networks | List affiliate networks.
*TrackerNetworksApi* | [**apiV1TrackerAffiliateNetworksIdDelete**](docs/TrackerNetworksApi.md#apiv1trackeraffiliatenetworksiddelete) | **DELETE** /api/v1/tracker/affiliate-networks/{id} | Delete an affiliate network.
*TrackerNetworksApi* | [**apiV1TrackerAffiliateNetworksIdPut**](docs/TrackerNetworksApi.md#apiv1trackeraffiliatenetworksidputoperation) | **PUT** /api/v1/tracker/affiliate-networks/{id} | Update an affiliate network.
*TrackerNetworksApi* | [**apiV1TrackerAffiliateNetworksPost**](docs/TrackerNetworksApi.md#apiv1trackeraffiliatenetworkspostoperation) | **POST** /api/v1/tracker/affiliate-networks | Create an affiliate network.
*TrackerOffersApi* | [**apiV1TrackerOffersBulkPost**](docs/TrackerOffersApi.md#apiv1trackeroffersbulkpostoperation) | **POST** /api/v1/tracker/offers/bulk | Pause, activate or delete many offers.
*TrackerOffersApi* | [**apiV1TrackerOffersGet**](docs/TrackerOffersApi.md#apiv1trackeroffersget) | **GET** /api/v1/tracker/offers | List tracker offers.
*TrackerOffersApi* | [**apiV1TrackerOffersIdDelete**](docs/TrackerOffersApi.md#apiv1trackeroffersiddelete) | **DELETE** /api/v1/tracker/offers/{id} | Delete an offer.
*TrackerOffersApi* | [**apiV1TrackerOffersIdGet**](docs/TrackerOffersApi.md#apiv1trackeroffersidget) | **GET** /api/v1/tracker/offers/{id} | Get one offer.
*TrackerOffersApi* | [**apiV1TrackerOffersIdPut**](docs/TrackerOffersApi.md#apiv1trackeroffersidputoperation) | **PUT** /api/v1/tracker/offers/{id} | Update an offer.
*TrackerOffersApi* | [**apiV1TrackerOffersIdUrlsPost**](docs/TrackerOffersApi.md#apiv1trackeroffersidurlspostoperation) | **POST** /api/v1/tracker/offers/{id}/urls | Add a landing URL to an offer.
*TrackerOffersApi* | [**apiV1TrackerOffersIdUrlsUrlIdDelete**](docs/TrackerOffersApi.md#apiv1trackeroffersidurlsurliddelete) | **DELETE** /api/v1/tracker/offers/{id}/urls/{urlId} | Delete one landing URL.
*TrackerOffersApi* | [**apiV1TrackerOffersIdUrlsUrlIdPut**](docs/TrackerOffersApi.md#apiv1trackeroffersidurlsurlidputoperation) | **PUT** /api/v1/tracker/offers/{id}/urls/{urlId} | Update one landing URL.
*TrackerOffersApi* | [**apiV1TrackerOffersPost**](docs/TrackerOffersApi.md#apiv1trackerofferspostoperation) | **POST** /api/v1/tracker/offers | Create an offer.
*TrackerReportsApi* | [**apiV1TrackerCostSummaryGet**](docs/TrackerReportsApi.md#apiv1trackercostsummaryget) | **GET** /api/v1/tracker/cost-summary | Spend against revenue.
*TrackerReportsApi* | [**apiV1TrackerDailyStatsGet**](docs/TrackerReportsApi.md#apiv1trackerdailystatsget) | **GET** /api/v1/tracker/daily-stats | Daily performance, filtered.
*TrackerReportsApi* | [**apiV1TrackerInlineStatsGet**](docs/TrackerReportsApi.md#apiv1trackerinlinestatsget) | **GET** /api/v1/tracker/inline-stats | Per-row performance for a listing.
*TrackerReportsApi* | [**apiV1TrackerPlayerLtvGet**](docs/TrackerReportsApi.md#apiv1trackerplayerltvget) | **GET** /api/v1/tracker/player-ltv | Lifetime value by cohort.
*TrackerReportsApi* | [**apiV1TrackerPostbacksStatsGet**](docs/TrackerReportsApi.md#apiv1trackerpostbacksstatsget) | **GET** /api/v1/tracker/postbacks/stats | Outbound postback firing log.
*TrackerReportsApi* | [**apiV1TrackerRecentClicksGet**](docs/TrackerReportsApi.md#apiv1trackerrecentclicksget) | **GET** /api/v1/tracker/recent-clicks | The most recent clicks.
*TrackerSettingsApi* | [**apiV1TrackerCountriesGet**](docs/TrackerSettingsApi.md#apiv1trackercountriesget) | **GET** /api/v1/tracker/countries | List countries seen in the caller\&#39;s traffic.
*TrackerSettingsApi* | [**apiV1TrackerCustomParamsGet**](docs/TrackerSettingsApi.md#apiv1trackercustomparamsget) | **GET** /api/v1/tracker/custom-params | Get the custom-parameter slots.
*TrackerSettingsApi* | [**apiV1TrackerCustomParamsPut**](docs/TrackerSettingsApi.md#apiv1trackercustomparamsputoperation) | **PUT** /api/v1/tracker/custom-params | Name the custom-parameter slots.
*TrackerSettingsApi* | [**apiV1TrackerSettingsGet**](docs/TrackerSettingsApi.md#apiv1trackersettingsget) | **GET** /api/v1/tracker/settings | Tracker settings for this account.
*TrackerSettingsApi* | [**apiV1TrackerSourceTemplatesGet**](docs/TrackerSettingsApi.md#apiv1trackersourcetemplatesget) | **GET** /api/v1/tracker/source-templates | List traffic-source templates.
*TrackerSettingsApi* | [**apiV1TrackerTokensGet**](docs/TrackerSettingsApi.md#apiv1trackertokensget) | **GET** /api/v1/tracker/tokens | List the macro tokens.
*TrackerSourcesApi* | [**apiV1TrackerCostDriversGet**](docs/TrackerSourcesApi.md#apiv1trackercostdriversget) | **GET** /api/v1/tracker/cost-drivers | List available cost drivers.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsGet**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountsget) | **GET** /api/v1/tracker/source-accounts | List connected ad accounts.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsIdCampaignsGet**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountsidcampaignsget) | **GET** /api/v1/tracker/source-accounts/{id}/campaigns | Campaigns visible in a connected ad account.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsIdDelete**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountsiddelete) | **DELETE** /api/v1/tracker/source-accounts/{id} | Disconnect an ad account.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsIdGet**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountsidget) | **GET** /api/v1/tracker/source-accounts/{id} | Get one connected ad account.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsIdPut**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountsidputoperation) | **PUT** /api/v1/tracker/source-accounts/{id} | Update a connected ad account.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsIdSyncPost**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountsidsyncpost) | **POST** /api/v1/tracker/source-accounts/{id}/sync | Pull spend from a connected ad account now.
*TrackerSourcesApi* | [**apiV1TrackerSourceAccountsPost**](docs/TrackerSourcesApi.md#apiv1trackersourceaccountspostoperation) | **POST** /api/v1/tracker/source-accounts | Connect an ad account.
*TrackerSourcesApi* | [**apiV1TrackerSourcesGet**](docs/TrackerSourcesApi.md#apiv1trackersourcesget) | **GET** /api/v1/tracker/sources | List traffic sources.
*TrackerSourcesApi* | [**apiV1TrackerSourcesIdDelete**](docs/TrackerSourcesApi.md#apiv1trackersourcesiddelete) | **DELETE** /api/v1/tracker/sources/{id} | Delete a traffic source.
*TrackerSourcesApi* | [**apiV1TrackerSourcesIdPut**](docs/TrackerSourcesApi.md#apiv1trackersourcesidputoperation) | **PUT** /api/v1/tracker/sources/{id} | Update a traffic source.
*TrackerSourcesApi* | [**apiV1TrackerSourcesPost**](docs/TrackerSourcesApi.md#apiv1trackersourcespostoperation) | **POST** /api/v1/tracker/sources | Create a traffic source.
*TrackerSourcesApi* | [**apiV1TrackerSourcesSiteidCampaignsGet**](docs/TrackerSourcesApi.md#apiv1trackersourcessiteidcampaignsget) | **GET** /api/v1/tracker/sources/{siteid}/campaigns | Campaigns reported by a source\&#39;s connected ad account.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksBulkPost**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksbulkpostoperation) | **POST** /api/v1/tracker/tracking-links/bulk | Delete many tracking links.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksGet**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksget) | **GET** /api/v1/tracker/tracking-links | List tracking links.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdBlocklistGet**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidblocklistget) | **GET** /api/v1/tracker/tracking-links/{id}/blocklist | List zones blocked on one link.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdBlocklistPost**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidblocklistpostoperation) | **POST** /api/v1/tracker/tracking-links/{id}/blocklist | Block a zone on one link.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdBlocklistZoneIdDelete**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidblocklistzoneiddelete) | **DELETE** /api/v1/tracker/tracking-links/{id}/blocklist/{zoneId} | Unblock a zone on one link.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdDelete**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksiddelete) | **DELETE** /api/v1/tracker/tracking-links/{id} | Delete a tracking link.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdNetworkBindingDelete**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidnetworkbindingdelete) | **DELETE** /api/v1/tracker/tracking-links/{id}/network-binding | Unbind a tracking link from its ad-network campaign.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdNetworkBindingPut**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidnetworkbindingputoperation) | **PUT** /api/v1/tracker/tracking-links/{id}/network-binding | Bind a tracking link to an ad-network campaign.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdPut**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidputoperation) | **PUT** /api/v1/tracker/tracking-links/{id} | Update a tracking link.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdToggleActivePost**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidtoggleactivepost) | **POST** /api/v1/tracker/tracking-links/{id}/toggle-active | Pause or resume the bound network campaign.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksIdZoneCostsGet**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinksidzonecostsget) | **GET** /api/v1/tracker/tracking-links/{id}/zone-costs | Per-zone cost and performance for one link.
*TrackerTrackingLinksApi* | [**apiV1TrackerTrackingLinksPost**](docs/TrackerTrackingLinksApi.md#apiv1trackertrackinglinkspostoperation) | **POST** /api/v1/tracker/tracking-links | Create a tracking link.
*TrackingApi* | [**apiV1TrackingConversionTypesGet**](docs/TrackingApi.md#apiv1trackingconversiontypesget) | **GET** /api/v1/tracking/conversion-types | Available conversion types for the caller\&#39;s account.
*TrackingApi* | [**apiV1TrackingConversionTypesPut**](docs/TrackingApi.md#apiv1trackingconversiontypesputoperation) | **PUT** /api/v1/tracking/conversion-types | Name conversion-type slots and set the click-id dedup opt-outs.
*TrackingApi* | [**apiV1TrackingPixelsGet**](docs/TrackingApi.md#apiv1trackingpixelsget) | **GET** /api/v1/tracking/pixels | Deprecated: List the caller\&#39;s conversion-tracking pixels.
*TrackingApi* | [**apiV1TrackingPixelsIdDelete**](docs/TrackingApi.md#apiv1trackingpixelsiddelete) | **DELETE** /api/v1/tracking/pixels/{id} | Deprecated: Delete a pixel.
*TrackingApi* | [**apiV1TrackingPixelsIdGet**](docs/TrackingApi.md#apiv1trackingpixelsidget) | **GET** /api/v1/tracking/pixels/{id} | Deprecated: Get one pixel.
*TrackingApi* | [**apiV1TrackingPixelsIdPut**](docs/TrackingApi.md#apiv1trackingpixelsidputoperation) | **PUT** /api/v1/tracking/pixels/{id} | Deprecated: Update a pixel\&#39;s name or conversion type.
*TrackingApi* | [**apiV1TrackingPixelsPost**](docs/TrackingApi.md#apiv1trackingpixelspostoperation) | **POST** /api/v1/tracking/pixels | Deprecated: Create a new tracking pixel.
*URLPoolsApi* | [**apiV1UrlPoolsGet**](docs/URLPoolsApi.md#apiv1urlpoolsget) | **GET** /api/v1/url-pools | List URL pools.
*URLPoolsApi* | [**apiV1UrlPoolsIdClonePost**](docs/URLPoolsApi.md#apiv1urlpoolsidclonepost) | **POST** /api/v1/url-pools/{id}/clone | Clone a URL pool with all its URLs.
*URLPoolsApi* | [**apiV1UrlPoolsIdDelete**](docs/URLPoolsApi.md#apiv1urlpoolsiddelete) | **DELETE** /api/v1/url-pools/{id} | Soft-delete a URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdGet**](docs/URLPoolsApi.md#apiv1urlpoolsidget) | **GET** /api/v1/url-pools/{id} | Show one URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdPut**](docs/URLPoolsApi.md#apiv1urlpoolsidputoperation) | **PUT** /api/v1/url-pools/{id} | Update URL pool meta.
*URLPoolsApi* | [**apiV1UrlPoolsIdRecoverPost**](docs/URLPoolsApi.md#apiv1urlpoolsidrecoverpost) | **POST** /api/v1/url-pools/{id}/recover | Restore an archived url pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsGet**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsget) | **GET** /api/v1/url-pools/{id}/urls | List URLs in a pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsPost**](docs/URLPoolsApi.md#apiv1urlpoolsidurlspostoperation) | **POST** /api/v1/url-pools/{id}/urls | Add a URL to a pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdClonePost**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidclonepost) | **POST** /api/v1/url-pools/{id}/urls/{urlId}/clone | Clone a single URL within the same pool.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdDelete**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurliddelete) | **DELETE** /api/v1/url-pools/{id}/urls/{urlId} | Soft-delete a single URL.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdGet**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidget) | **GET** /api/v1/url-pools/{id}/urls/{urlId} | Show a single URL.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdPut**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidputoperation) | **PUT** /api/v1/url-pools/{id}/urls/{urlId} | Update a single URL.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdTogglePut**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidtoggleput) | **PUT** /api/v1/url-pools/{id}/urls/{urlId}/toggle | Toggle a URL on / off.
*URLPoolsApi* | [**apiV1UrlPoolsIdUrlsUrlIdWeightPut**](docs/URLPoolsApi.md#apiv1urlpoolsidurlsurlidweightputoperation) | **PUT** /api/v1/url-pools/{id}/urls/{urlId}/weight | Set a URL\&#39;s rotation weight.
*URLPoolsApi* | [**apiV1UrlPoolsIdUsedInGet**](docs/URLPoolsApi.md#apiv1urlpoolsidusedinget) | **GET** /api/v1/url-pools/{id}/used-in | List campaigns / ads that reference this URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsPost**](docs/URLPoolsApi.md#apiv1urlpoolspostoperation) | **POST** /api/v1/url-pools | Create a URL pool.
*URLPoolsApi* | [**apiV1UrlPoolsReplaceUrlPut**](docs/URLPoolsApi.md#apiv1urlpoolsreplaceurlputoperation) | **PUT** /api/v1/url-pools/replace-url | Search &amp; replace text across your URL-pool URLs.
*WebhooksEventsApi* | [**apiV1EventsGet**](docs/WebhooksEventsApi.md#apiv1eventsget) | **GET** /api/v1/events | Read the account\&#39;s event feed.
*WebhooksEventsApi* | [**apiV1WebhooksGet**](docs/WebhooksEventsApi.md#apiv1webhooksget) | **GET** /api/v1/webhooks | List webhooks.
*WebhooksEventsApi* | [**apiV1WebhooksIdDelete**](docs/WebhooksEventsApi.md#apiv1webhooksiddelete) | **DELETE** /api/v1/webhooks/{id} | Remove a webhook.
*WebhooksEventsApi* | [**apiV1WebhooksIdDeliveriesDeliveryRedeliverPost**](docs/WebhooksEventsApi.md#apiv1webhooksiddeliveriesdeliveryredeliverpost) | **POST** /api/v1/webhooks/{id}/deliveries/{delivery}/redeliver | Send a delivery again.
*WebhooksEventsApi* | [**apiV1WebhooksIdDeliveriesGet**](docs/WebhooksEventsApi.md#apiv1webhooksiddeliveriesget) | **GET** /api/v1/webhooks/{id}/deliveries | List a webhook\&#39;s deliveries.
*WebhooksEventsApi* | [**apiV1WebhooksIdGet**](docs/WebhooksEventsApi.md#apiv1webhooksidget) | **GET** /api/v1/webhooks/{id} | Get one webhook.
*WebhooksEventsApi* | [**apiV1WebhooksIdPatch**](docs/WebhooksEventsApi.md#apiv1webhooksidpatchoperation) | **PATCH** /api/v1/webhooks/{id} | Edit, pause or resume a webhook.
*WebhooksEventsApi* | [**apiV1WebhooksIdRotateSecretPost**](docs/WebhooksEventsApi.md#apiv1webhooksidrotatesecretpostoperation) | **POST** /api/v1/webhooks/{id}/rotate-secret | Issue a new signing secret.
*WebhooksEventsApi* | [**apiV1WebhooksIdTestPost**](docs/WebhooksEventsApi.md#apiv1webhooksidtestpost) | **POST** /api/v1/webhooks/{id}/test | Send a test ping.
*WebhooksEventsApi* | [**apiV1WebhooksPost**](docs/WebhooksEventsApi.md#apiv1webhookspostoperation) | **POST** /api/v1/webhooks | Create a webhook.
*XMLFeedsApi* | [**apiV1XmlFeedsGet**](docs/XMLFeedsApi.md#apiv1xmlfeedsget) | **GET** /api/v1/xml-feeds | List XML feeds.
*XMLFeedsApi* | [**apiV1XmlFeedsIdClonePost**](docs/XMLFeedsApi.md#apiv1xmlfeedsidclonepost) | **POST** /api/v1/xml-feeds/{id}/clone | Clone an XML feed.
*XMLFeedsApi* | [**apiV1XmlFeedsIdDelete**](docs/XMLFeedsApi.md#apiv1xmlfeedsiddelete) | **DELETE** /api/v1/xml-feeds/{id} | Delete an XML feed.
*XMLFeedsApi* | [**apiV1XmlFeedsIdGet**](docs/XMLFeedsApi.md#apiv1xmlfeedsidget) | **GET** /api/v1/xml-feeds/{id} | Show an XML feed.
*XMLFeedsApi* | [**apiV1XmlFeedsIdPut**](docs/XMLFeedsApi.md#apiv1xmlfeedsidputoperation) | **PUT** /api/v1/xml-feeds/{id} | Update an XML feed.
*XMLFeedsApi* | [**apiV1XmlFeedsIdTogglePut**](docs/XMLFeedsApi.md#apiv1xmlfeedsidtoggleput) | **PUT** /api/v1/xml-feeds/{id}/toggle | Flip an XML feed active / paused.
*XMLFeedsApi* | [**apiV1XmlFeedsPost**](docs/XMLFeedsApi.md#apiv1xmlfeedspostoperation) | **POST** /api/v1/xml-feeds | Create an XML feed.


### Models

- [Adspace](docs/Adspace.md)
- [AdspaceCreate](docs/AdspaceCreate.md)
- [AdspaceCreateBannerSettings](docs/AdspaceCreateBannerSettings.md)
- [AdspaceCreateBotSettings](docs/AdspaceCreateBotSettings.md)
- [AdspaceCreateEmailSettings](docs/AdspaceCreateEmailSettings.md)
- [AdspaceCreateScreenSettings](docs/AdspaceCreateScreenSettings.md)
- [AdspaceCreateSearchSettings](docs/AdspaceCreateSearchSettings.md)
- [AdspaceCreateSearchSettingsBlockedTerms](docs/AdspaceCreateSearchSettingsBlockedTerms.md)
- [AdspaceFieldMeta](docs/AdspaceFieldMeta.md)
- [AdspaceNetworkBinding](docs/AdspaceNetworkBinding.md)
- [AdspaceSchema](docs/AdspaceSchema.md)
- [AdspaceSettingsBlock](docs/AdspaceSettingsBlock.md)
- [AdspaceSite](docs/AdspaceSite.md)
- [AdspaceTypeItem](docs/AdspaceTypeItem.md)
- [AdspaceTypeOption](docs/AdspaceTypeOption.md)
- [ApiKeyDetails](docs/ApiKeyDetails.md)
- [ApiKeyDetailsCreated](docs/ApiKeyDetailsCreated.md)
- [ApiPublicDemoGet200Response](docs/ApiPublicDemoGet200Response.md)
- [ApiPublicDemoGet200ResponseDataInner](docs/ApiPublicDemoGet200ResponseDataInner.md)
- [ApiPublicIntegrationsHooksTokenPost200Response](docs/ApiPublicIntegrationsHooksTokenPost200Response.md)
- [ApiPublicOauthIntrospectPost200Response](docs/ApiPublicOauthIntrospectPost200Response.md)
- [ApiPublicOauthTokenPost200Response](docs/ApiPublicOauthTokenPost200Response.md)
- [ApiPublicOfferwallIdGet200Response](docs/ApiPublicOfferwallIdGet200Response.md)
- [ApiPublicOfferwallIdGet200ResponseOffersInner](docs/ApiPublicOfferwallIdGet200ResponseOffersInner.md)
- [ApiV1AccountBillingAveragesGet200Response](docs/ApiV1AccountBillingAveragesGet200Response.md)
- [ApiV1AccountBillingAveragesGet200ResponseModulesInner](docs/ApiV1AccountBillingAveragesGet200ResponseModulesInner.md)
- [ApiV1AccountBillingAveragesGet200ResponseOverchargesValue](docs/ApiV1AccountBillingAveragesGet200ResponseOverchargesValue.md)
- [ApiV1AccountBillingInvoicesGet200Response](docs/ApiV1AccountBillingInvoicesGet200Response.md)
- [ApiV1AccountBillingInvoicesGet200ResponseResultsInner](docs/ApiV1AccountBillingInvoicesGet200ResponseResultsInner.md)
- [ApiV1AccountGet200Response](docs/ApiV1AccountGet200Response.md)
- [ApiV1AccountGet200ResponseApiKey](docs/ApiV1AccountGet200ResponseApiKey.md)
- [ApiV1AccountNotificationDestinationsPostRequest](docs/ApiV1AccountNotificationDestinationsPostRequest.md)
- [ApiV1AccountNotificationPreferencesPutRequest](docs/ApiV1AccountNotificationPreferencesPutRequest.md)
- [ApiV1AccountNotificationsReadPostRequest](docs/ApiV1AccountNotificationsReadPostRequest.md)
- [ApiV1AccountPreferencesKeyPutRequest](docs/ApiV1AccountPreferencesKeyPutRequest.md)
- [ApiV1AccountUiLayoutsScopePutRequest](docs/ApiV1AccountUiLayoutsScopePutRequest.md)
- [ApiV1AccountUiLayoutsScopePutRequestData](docs/ApiV1AccountUiLayoutsScopePutRequestData.md)
- [ApiV1AccountUiLayoutsScopePutRequestDataPatchesInner](docs/ApiV1AccountUiLayoutsScopePutRequestDataPatchesInner.md)
- [ApiV1AdScannerIdIgnoreDomainPutRequest](docs/ApiV1AdScannerIdIgnoreDomainPutRequest.md)
- [ApiV1AdScannerIdManualItemsItemIdStatePutRequest](docs/ApiV1AdScannerIdManualItemsItemIdStatePutRequest.md)
- [ApiV1AdScannerIdManualItemsPostRequest](docs/ApiV1AdScannerIdManualItemsPostRequest.md)
- [ApiV1AdScannerIdPutRequest](docs/ApiV1AdScannerIdPutRequest.md)
- [ApiV1AdScannerIdToggleActivePutRequest](docs/ApiV1AdScannerIdToggleActivePutRequest.md)
- [ApiV1AdScannerPostRequest](docs/ApiV1AdScannerPostRequest.md)
- [ApiV1AdScannerPostRequestTags](docs/ApiV1AdScannerPostRequestTags.md)
- [ApiV1AdShopCartPostRequest](docs/ApiV1AdShopCartPostRequest.md)
- [ApiV1AdShopConfirmPostRequest](docs/ApiV1AdShopConfirmPostRequest.md)
- [ApiV1AdShopGroupSummaryPostRequest](docs/ApiV1AdShopGroupSummaryPostRequest.md)
- [ApiV1AdShopGroupSummaryPostRequestFilters](docs/ApiV1AdShopGroupSummaryPostRequestFilters.md)
- [ApiV1AdspacesAddMultiplePostRequest](docs/ApiV1AdspacesAddMultiplePostRequest.md)
- [ApiV1AdspacesExportCodesGet200ResponseInner](docs/ApiV1AdspacesExportCodesGet200ResponseInner.md)
- [ApiV1AdspacesExportCodesGet200ResponseInnerCodesInner](docs/ApiV1AdspacesExportCodesGet200ResponseInnerCodesInner.md)
- [ApiV1AdspacesGet200Response](docs/ApiV1AdspacesGet200Response.md)
- [ApiV1AdspacesGet200ResponseDataInner](docs/ApiV1AdspacesGet200ResponseDataInner.md)
- [ApiV1AdspacesIdClonePostRequest](docs/ApiV1AdspacesIdClonePostRequest.md)
- [ApiV1AdspacesIdCodeGet200Response](docs/ApiV1AdspacesIdCodeGet200Response.md)
- [ApiV1AdspacesIdCodeGet200ResponseAmp](docs/ApiV1AdspacesIdCodeGet200ResponseAmp.md)
- [ApiV1AdspacesIdCodeGet200ResponseCtv](docs/ApiV1AdspacesIdCodeGet200ResponseCtv.md)
- [ApiV1AdspacesIdCodeGet200ResponseLayoutsInner](docs/ApiV1AdspacesIdCodeGet200ResponseLayoutsInner.md)
- [ApiV1AdspacesIdCodeGet200ResponseScreen](docs/ApiV1AdspacesIdCodeGet200ResponseScreen.md)
- [ApiV1AdspacesIdCodeGet200ResponseSite](docs/ApiV1AdspacesIdCodeGet200ResponseSite.md)
- [ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest](docs/ApiV1AdspacesIdMediaBuyingActionsActionIdDecidePostRequest.md)
- [ApiV1AdspacesIdMediaBuyingBlockPostRequest](docs/ApiV1AdspacesIdMediaBuyingBlockPostRequest.md)
- [ApiV1AdspacesIdMediaBuyingIpsPostRequest](docs/ApiV1AdspacesIdMediaBuyingIpsPostRequest.md)
- [ApiV1AdspacesIdMediaBuyingLaunchPostRequest](docs/ApiV1AdspacesIdMediaBuyingLaunchPostRequest.md)
- [ApiV1AdspacesIdMediaBuyingReportPostRequest](docs/ApiV1AdspacesIdMediaBuyingReportPostRequest.md)
- [ApiV1AdspacesIdMediaBuyingSourceBidPutRequest](docs/ApiV1AdspacesIdMediaBuyingSourceBidPutRequest.md)
- [ApiV1AdspacesIdMediaBuyingTargetingPutRequest](docs/ApiV1AdspacesIdMediaBuyingTargetingPutRequest.md)
- [ApiV1AdspacesIdMediaBuyingTargetingPutRequestZonesInner](docs/ApiV1AdspacesIdMediaBuyingTargetingPutRequestZonesInner.md)
- [ApiV1AdspacesIdNetworkBindingPutRequest](docs/ApiV1AdspacesIdNetworkBindingPutRequest.md)
- [ApiV1AdspacesIdOwnAdsMassActionPostRequest](docs/ApiV1AdspacesIdOwnAdsMassActionPostRequest.md)
- [ApiV1AdspacesIdPatch200Response](docs/ApiV1AdspacesIdPatch200Response.md)
- [ApiV1AdspacesIdPricesTypePostRequest](docs/ApiV1AdspacesIdPricesTypePostRequest.md)
- [ApiV1AdspacesIdPricesTypePostRequestCpmPriceInner](docs/ApiV1AdspacesIdPricesTypePostRequestCpmPriceInner.md)
- [ApiV1AdspacesIdWlCampaignsPutRequest](docs/ApiV1AdspacesIdWlCampaignsPutRequest.md)
- [ApiV1AdspacesIdWlCampaignsPutRequestCampaignsInner](docs/ApiV1AdspacesIdWlCampaignsPutRequestCampaignsInner.md)
- [ApiV1AdspacesMassDeletePostRequest](docs/ApiV1AdspacesMassDeletePostRequest.md)
- [ApiV1AdspacesMassRecoverPostRequest](docs/ApiV1AdspacesMassRecoverPostRequest.md)
- [ApiV1AdspacesTemplatesGet200ResponseInner](docs/ApiV1AdspacesTemplatesGet200ResponseInner.md)
- [ApiV1AdspacesTemplatesIdPutRequest](docs/ApiV1AdspacesTemplatesIdPutRequest.md)
- [ApiV1AdspacesTemplatesPostRequest](docs/ApiV1AdspacesTemplatesPostRequest.md)
- [ApiV1BidRulesetsGet200Response](docs/ApiV1BidRulesetsGet200Response.md)
- [ApiV1BidRulesetsIdClonePostRequest](docs/ApiV1BidRulesetsIdClonePostRequest.md)
- [ApiV1BidRulesetsIdDelete200Response](docs/ApiV1BidRulesetsIdDelete200Response.md)
- [ApiV1BidRulesetsIdDelete422Response](docs/ApiV1BidRulesetsIdDelete422Response.md)
- [ApiV1BidRulesetsIdPatchRequest](docs/ApiV1BidRulesetsIdPatchRequest.md)
- [ApiV1BidRulesetsPostRequest](docs/ApiV1BidRulesetsPostRequest.md)
- [ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest](docs/ApiV1CampaignsCpmCampaignIdSpotsSpaceIdPostRequest.md)
- [ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest](docs/ApiV1CampaignsCpmCampaignIdSpotsSpaceIdTypePutRequest.md)
- [ApiV1CampaignsGet200Response](docs/ApiV1CampaignsGet200Response.md)
- [ApiV1CampaignsGet200ResponseDataInner](docs/ApiV1CampaignsGet200ResponseDataInner.md)
- [ApiV1CampaignsMassDeletePostRequest](docs/ApiV1CampaignsMassDeletePostRequest.md)
- [ApiV1CampaignsMassTogglePutRequest](docs/ApiV1CampaignsMassTogglePutRequest.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200Response.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseZoneBidsInner](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsGet200ResponseZoneBidsInner.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPut200Response.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequest.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestZoneBidsInner](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsPutRequestZoneBidsInner.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZoneIdDelete200Response.md)
- [ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest](docs/ApiV1CampaignsRonCampaignIdAdsAdIdZoneBidsZonesOnlyPutRequest.md)
- [ApiV1CampaignsRonIdSiteListSiteIdPutRequest](docs/ApiV1CampaignsRonIdSiteListSiteIdPutRequest.md)
- [ApiV1CampaignsRonIdZonesGet200Response](docs/ApiV1CampaignsRonIdZonesGet200Response.md)
- [ApiV1CampaignsRonIdZonesGet200ResponseDataInner](docs/ApiV1CampaignsRonIdZonesGet200ResponseDataInner.md)
- [ApiV1CampaignsSaveCategoriesPutRequest](docs/ApiV1CampaignsSaveCategoriesPutRequest.md)
- [ApiV1CampaignsSaveTagsPutRequest](docs/ApiV1CampaignsSaveTagsPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdActivePatch200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatch200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdBidPatchRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestGeoBidsInner](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdBidsPerGeoPutRequestGeoBidsInner.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdClonePost200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdCountriesPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsAdIdPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response](docs/ApiV1CampaignsTypeCampaignIdAdsCsvImportPost200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest](docs/ApiV1CampaignsTypeCampaignIdAdsFromPoolPostRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsGet200Response](docs/ApiV1CampaignsTypeCampaignIdAdsGet200Response.md)
- [ApiV1CampaignsTypeCampaignIdAdsGet200ResponseMeta](docs/ApiV1CampaignsTypeCampaignIdAdsGet200ResponseMeta.md)
- [ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest](docs/ApiV1CampaignsTypeCampaignIdAdsMassClonePostRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest](docs/ApiV1CampaignsTypeCampaignIdAdsMassDeletePostRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsMassTogglePutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest](docs/ApiV1CampaignsTypeCampaignIdAdsMassUndeletePostRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsPostRequest](docs/ApiV1CampaignsTypeCampaignIdAdsPostRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner](docs/ApiV1CampaignsTypeCampaignIdAdsPostRequestVideoOverlaysInner.md)
- [ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsUpdatePoolPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPoolPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsUpdateUrlPutRequest.md)
- [ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest](docs/ApiV1CampaignsTypeCampaignIdAdsUpdateWeightPutRequest.md)
- [ApiV1CampaignsTypeIdActivePatch200Response](docs/ApiV1CampaignsTypeIdActivePatch200Response.md)
- [ApiV1CampaignsTypeIdActivePatchRequest](docs/ApiV1CampaignsTypeIdActivePatchRequest.md)
- [ApiV1CampaignsTypeIdBidsPatch200Response](docs/ApiV1CampaignsTypeIdBidsPatch200Response.md)
- [ApiV1CampaignsTypeIdBidsPatchRequest](docs/ApiV1CampaignsTypeIdBidsPatchRequest.md)
- [ApiV1CampaignsTypeIdBudgetPatch200Response](docs/ApiV1CampaignsTypeIdBudgetPatch200Response.md)
- [ApiV1CampaignsTypeIdBudgetPatchRequest](docs/ApiV1CampaignsTypeIdBudgetPatchRequest.md)
- [ApiV1CampaignsTypeIdClonePost201Response](docs/ApiV1CampaignsTypeIdClonePost201Response.md)
- [ApiV1CampaignsTypeIdClonePost201ResponseCopied](docs/ApiV1CampaignsTypeIdClonePost201ResponseCopied.md)
- [ApiV1CampaignsTypeIdClonePostRequest](docs/ApiV1CampaignsTypeIdClonePostRequest.md)
- [ApiV1CampaignsTypeIdDelete200Response](docs/ApiV1CampaignsTypeIdDelete200Response.md)
- [ApiV1CampaignsTypeIdFiltersGet200Response](docs/ApiV1CampaignsTypeIdFiltersGet200Response.md)
- [ApiV1CampaignsTypeIdFiltersGet200ResponseFiltersInner](docs/ApiV1CampaignsTypeIdFiltersGet200ResponseFiltersInner.md)
- [ApiV1CampaignsTypeIdFiltersPost200Response](docs/ApiV1CampaignsTypeIdFiltersPost200Response.md)
- [ApiV1CampaignsTypeIdFiltersPostRequest](docs/ApiV1CampaignsTypeIdFiltersPostRequest.md)
- [ApiV1CampaignsTypeIdMinBidGet200Response](docs/ApiV1CampaignsTypeIdMinBidGet200Response.md)
- [ApiV1CampaignsTypeIdPatchRequest](docs/ApiV1CampaignsTypeIdPatchRequest.md)
- [ApiV1CampaignsTypeIdPatchRequestAllOfBannerSizeIds](docs/ApiV1CampaignsTypeIdPatchRequestAllOfBannerSizeIds.md)
- [ApiV1CampaignsTypeIdZonesPostRequest](docs/ApiV1CampaignsTypeIdZonesPostRequest.md)
- [ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest](docs/ApiV1CampaignsTypeIdZonesZoneIdWeightPutRequest.md)
- [ApiV1CampaignsTypePostRequest](docs/ApiV1CampaignsTypePostRequest.md)
- [ApiV1CampaignsTypePostRequestAllOfBannerSizeIds](docs/ApiV1CampaignsTypePostRequestAllOfBannerSizeIds.md)
- [ApiV1CampaignsTypePostRequestAllOfPriority](docs/ApiV1CampaignsTypePostRequestAllOfPriority.md)
- [ApiV1CampaignsTypeSchemaAdsGet200Response](docs/ApiV1CampaignsTypeSchemaAdsGet200Response.md)
- [ApiV1CampaignsTypeSchemaGet200Response](docs/ApiV1CampaignsTypeSchemaGet200Response.md)
- [ApiV1CampaignsTypeSchemaGet200ResponseFieldsInner](docs/ApiV1CampaignsTypeSchemaGet200ResponseFieldsInner.md)
- [ApiV1CouponsSetsIdGeneratePostRequest](docs/ApiV1CouponsSetsIdGeneratePostRequest.md)
- [ApiV1CouponsSetsIdPutRequest](docs/ApiV1CouponsSetsIdPutRequest.md)
- [ApiV1CouponsSetsPostRequest](docs/ApiV1CouponsSetsPostRequest.md)
- [ApiV1CreativeFoldersIdPutRequest](docs/ApiV1CreativeFoldersIdPutRequest.md)
- [ApiV1CreativeFoldersPostRequest](docs/ApiV1CreativeFoldersPostRequest.md)
- [ApiV1CreativePoolsGet200Response](docs/ApiV1CreativePoolsGet200Response.md)
- [ApiV1CreativePoolsGet200ResponseDataInner](docs/ApiV1CreativePoolsGet200ResponseDataInner.md)
- [ApiV1CreativePoolsGetPerPageParameter](docs/ApiV1CreativePoolsGetPerPageParameter.md)
- [ApiV1CreativePoolsIdAddCreativesPostRequest](docs/ApiV1CreativePoolsIdAddCreativesPostRequest.md)
- [ApiV1CreativePoolsIdAddUrlsPostRequest](docs/ApiV1CreativePoolsIdAddUrlsPostRequest.md)
- [ApiV1CreativePoolsIdClonePost201Response](docs/ApiV1CreativePoolsIdClonePost201Response.md)
- [ApiV1CreativePoolsIdDelete200Response](docs/ApiV1CreativePoolsIdDelete200Response.md)
- [ApiV1CreativePoolsIdDelete409Response](docs/ApiV1CreativePoolsIdDelete409Response.md)
- [ApiV1CreativePoolsIdGet200Response](docs/ApiV1CreativePoolsIdGet200Response.md)
- [ApiV1CreativePoolsIdItemsItemIdPut409Response](docs/ApiV1CreativePoolsIdItemsItemIdPut409Response.md)
- [ApiV1CreativePoolsIdItemsItemIdPutRequest](docs/ApiV1CreativePoolsIdItemsItemIdPutRequest.md)
- [ApiV1CreativePoolsIdItemsItemIdPutRequestEndAt](docs/ApiV1CreativePoolsIdItemsItemIdPutRequestEndAt.md)
- [ApiV1CreativePoolsIdItemsItemIdPutRequestStartAt](docs/ApiV1CreativePoolsIdItemsItemIdPutRequestStartAt.md)
- [ApiV1CreativePoolsIdItemsMassActionPutRequest](docs/ApiV1CreativePoolsIdItemsMassActionPutRequest.md)
- [ApiV1CreativePoolsIdItemsPostRequest](docs/ApiV1CreativePoolsIdItemsPostRequest.md)
- [ApiV1CreativePoolsIdItemsRecoverPostRequest](docs/ApiV1CreativePoolsIdItemsRecoverPostRequest.md)
- [ApiV1CreativePoolsIdPutRequest](docs/ApiV1CreativePoolsIdPutRequest.md)
- [ApiV1CreativePoolsIdUsedInGet200Response](docs/ApiV1CreativePoolsIdUsedInGet200Response.md)
- [ApiV1CreativePoolsPostRequest](docs/ApiV1CreativePoolsPostRequest.md)
- [ApiV1CreativesBulkDeletePostRequest](docs/ApiV1CreativesBulkDeletePostRequest.md)
- [ApiV1CreativesBulkMovePostRequest](docs/ApiV1CreativesBulkMovePostRequest.md)
- [ApiV1CreativesBulkUndeletePostRequest](docs/ApiV1CreativesBulkUndeletePostRequest.md)
- [ApiV1CreativesGet200Response](docs/ApiV1CreativesGet200Response.md)
- [ApiV1CreativesGetPerPageParameter](docs/ApiV1CreativesGetPerPageParameter.md)
- [ApiV1CreativesIdNamePutRequest](docs/ApiV1CreativesIdNamePutRequest.md)
- [ApiV1CreativesIdPutRequest](docs/ApiV1CreativesIdPutRequest.md)
- [ApiV1CreativesIdPutRequestTags](docs/ApiV1CreativesIdPutRequestTags.md)
- [ApiV1CreativesIdTagsPutRequest](docs/ApiV1CreativesIdTagsPutRequest.md)
- [ApiV1DomainsIdNotesPutRequest](docs/ApiV1DomainsIdNotesPutRequest.md)
- [ApiV1DomainsPostRequest](docs/ApiV1DomainsPostRequest.md)
- [ApiV1EventLogExportsPostRequest](docs/ApiV1EventLogExportsPostRequest.md)
- [ApiV1EventsGet200Response](docs/ApiV1EventsGet200Response.md)
- [ApiV1FiltersGet200Response](docs/ApiV1FiltersGet200Response.md)
- [ApiV1FiltersMassActionPostRequest](docs/ApiV1FiltersMassActionPostRequest.md)
- [ApiV1FiltersMassActionPostRequestFiltersInner](docs/ApiV1FiltersMassActionPostRequestFiltersInner.md)
- [ApiV1FiltersPostRequest](docs/ApiV1FiltersPostRequest.md)
- [ApiV1FiltersTypeIdActivePatch200Response](docs/ApiV1FiltersTypeIdActivePatch200Response.md)
- [ApiV1FiltersTypeIdItemsItemDelete200Response](docs/ApiV1FiltersTypeIdItemsItemDelete200Response.md)
- [ApiV1FiltersTypeIdItemsPost200Response](docs/ApiV1FiltersTypeIdItemsPost200Response.md)
- [ApiV1FiltersTypeIdItemsPostRequest](docs/ApiV1FiltersTypeIdItemsPostRequest.md)
- [ApiV1FiltersTypeIdPutRequest](docs/ApiV1FiltersTypeIdPutRequest.md)
- [ApiV1FundsBalanceSettingsPutRequest](docs/ApiV1FundsBalanceSettingsPutRequest.md)
- [ApiV1FundsDepositTypeFidGet200Response](docs/ApiV1FundsDepositTypeFidGet200Response.md)
- [ApiV1FundsDepositTypePost200Response](docs/ApiV1FundsDepositTypePost200Response.md)
- [ApiV1FundsDepositTypePostRequest](docs/ApiV1FundsDepositTypePostRequest.md)
- [ApiV1FundsDepositsIdProofPost200Response](docs/ApiV1FundsDepositsIdProofPost200Response.md)
- [ApiV1FundsDepositsIdTxnHashPost200Response](docs/ApiV1FundsDepositsIdTxnHashPost200Response.md)
- [ApiV1FundsDepositsIdTxnHashPostRequest](docs/ApiV1FundsDepositsIdTxnHashPostRequest.md)
- [ApiV1FundsGet200Response](docs/ApiV1FundsGet200Response.md)
- [ApiV1FundsPayTypesGet200Response](docs/ApiV1FundsPayTypesGet200Response.md)
- [ApiV1FundsPayTypesGet200ResponsePayTypesInner](docs/ApiV1FundsPayTypesGet200ResponsePayTypesInner.md)
- [ApiV1FundsTransactionsGet200Response](docs/ApiV1FundsTransactionsGet200Response.md)
- [ApiV1FundsTransactionsGet200ResponseDataInner](docs/ApiV1FundsTransactionsGet200ResponseDataInner.md)
- [ApiV1FundsTransferPostRequest](docs/ApiV1FundsTransferPostRequest.md)
- [ApiV1LookupsAdspaceTypesGet200Response](docs/ApiV1LookupsAdspaceTypesGet200Response.md)
- [ApiV1LookupsBannerSizesGet200Response](docs/ApiV1LookupsBannerSizesGet200Response.md)
- [ApiV1LookupsBannerSizesGet200ResponseItemsInner](docs/ApiV1LookupsBannerSizesGet200ResponseItemsInner.md)
- [ApiV1LookupsBrowsersGet200Response](docs/ApiV1LookupsBrowsersGet200Response.md)
- [ApiV1LookupsCarriersGet200Response](docs/ApiV1LookupsCarriersGet200Response.md)
- [ApiV1LookupsCarriersGet200ResponseDataInner](docs/ApiV1LookupsCarriersGet200ResponseDataInner.md)
- [ApiV1LookupsCategoriesGet200Response](docs/ApiV1LookupsCategoriesGet200Response.md)
- [ApiV1LookupsCategoriesGet200ResponseItemsInner](docs/ApiV1LookupsCategoriesGet200ResponseItemsInner.md)
- [ApiV1LookupsDeviceTypesGet200Response](docs/ApiV1LookupsDeviceTypesGet200Response.md)
- [ApiV1LookupsRegionsGet200Response](docs/ApiV1LookupsRegionsGet200Response.md)
- [ApiV1LookupsRegionsGet200ResponseRegionsInner](docs/ApiV1LookupsRegionsGet200ResponseRegionsInner.md)
- [ApiV1LookupsWebsiteLanguagesGet200Response](docs/ApiV1LookupsWebsiteLanguagesGet200Response.md)
- [ApiV1LookupsWebsiteLanguagesGet200ResponseItemsInner](docs/ApiV1LookupsWebsiteLanguagesGet200ResponseItemsInner.md)
- [ApiV1MarketplaceFlatRequestsRenewPostRequest](docs/ApiV1MarketplaceFlatRequestsRenewPostRequest.md)
- [ApiV1McpPost200Response](docs/ApiV1McpPost200Response.md)
- [ApiV1McpPost200ResponseError](docs/ApiV1McpPost200ResponseError.md)
- [ApiV1McpPost200ResponseId](docs/ApiV1McpPost200ResponseId.md)
- [ApiV1McpPostRequest](docs/ApiV1McpPostRequest.md)
- [ApiV1McpPostRequestId](docs/ApiV1McpPostRequestId.md)
- [ApiV1OffersGet200Response](docs/ApiV1OffersGet200Response.md)
- [ApiV1OffersGet200ResponseDataInner](docs/ApiV1OffersGet200ResponseDataInner.md)
- [ApiV1ProductFeedsPostRequest](docs/ApiV1ProductFeedsPostRequest.md)
- [ApiV1ProductFeedsPreviewPostRequest](docs/ApiV1ProductFeedsPreviewPostRequest.md)
- [ApiV1ProductFeedsPreviewPostRequestProduct](docs/ApiV1ProductFeedsPreviewPostRequestProduct.md)
- [ApiV1PublisherFiltersGet200Response](docs/ApiV1PublisherFiltersGet200Response.md)
- [ApiV1PublisherFiltersGet200ResponseCategoriesInner](docs/ApiV1PublisherFiltersGet200ResponseCategoriesInner.md)
- [ApiV1PublisherFiltersGet200ResponseUrlsInner](docs/ApiV1PublisherFiltersGet200ResponseUrlsInner.md)
- [ApiV1PublisherFiltersUrlsDelete200Response](docs/ApiV1PublisherFiltersUrlsDelete200Response.md)
- [ApiV1PublisherFiltersUrlsDeleteRequest](docs/ApiV1PublisherFiltersUrlsDeleteRequest.md)
- [ApiV1PublisherFiltersUrlsPost201Response](docs/ApiV1PublisherFiltersUrlsPost201Response.md)
- [ApiV1PublisherFiltersUrlsPostRequest](docs/ApiV1PublisherFiltersUrlsPostRequest.md)
- [ApiV1PublisherFinanceEarningsGet200Response](docs/ApiV1PublisherFinanceEarningsGet200Response.md)
- [ApiV1PublisherFinanceEarningsGet200ResponseEarningsInner](docs/ApiV1PublisherFinanceEarningsGet200ResponseEarningsInner.md)
- [ApiV1PublisherFinanceEarningsGet200ResponsePeriod](docs/ApiV1PublisherFinanceEarningsGet200ResponsePeriod.md)
- [ApiV1PublisherFinanceEarningsGet200ResponseSummary](docs/ApiV1PublisherFinanceEarningsGet200ResponseSummary.md)
- [ApiV1PublisherFinanceGet200Response](docs/ApiV1PublisherFinanceGet200Response.md)
- [ApiV1PublisherFinanceGet200ResponseBalance](docs/ApiV1PublisherFinanceGet200ResponseBalance.md)
- [ApiV1PublisherFinanceMonthEarningsGet200ResponseInner](docs/ApiV1PublisherFinanceMonthEarningsGet200ResponseInner.md)
- [ApiV1PublisherFinancePayoutRequestPost201Response](docs/ApiV1PublisherFinancePayoutRequestPost201Response.md)
- [ApiV1PublisherFinancePayoutRequestPost201ResponsePayout](docs/ApiV1PublisherFinancePayoutRequestPost201ResponsePayout.md)
- [ApiV1PublisherFinancePayoutRequestPostRequest](docs/ApiV1PublisherFinancePayoutRequestPostRequest.md)
- [ApiV1PublisherFinancePayoutTypesGet200ResponseInner](docs/ApiV1PublisherFinancePayoutTypesGet200ResponseInner.md)
- [ApiV1PublisherFinancePayoutsGet200Response](docs/ApiV1PublisherFinancePayoutsGet200Response.md)
- [ApiV1PublisherFinancePayoutsGet200ResponseDataInner](docs/ApiV1PublisherFinancePayoutsGet200ResponseDataInner.md)
- [ApiV1PublisherFinancePayoutsGet200ResponseMeta](docs/ApiV1PublisherFinancePayoutsGet200ResponseMeta.md)
- [ApiV1PublisherFinanceSettingsGet200Response](docs/ApiV1PublisherFinanceSettingsGet200Response.md)
- [ApiV1PublisherFinanceSettingsGet200ResponseData](docs/ApiV1PublisherFinanceSettingsGet200ResponseData.md)
- [ApiV1PublisherFinanceSettingsPutRequest](docs/ApiV1PublisherFinanceSettingsPutRequest.md)
- [ApiV1PublisherFinanceTransactionsGet200Response](docs/ApiV1PublisherFinanceTransactionsGet200Response.md)
- [ApiV1PublisherFinanceTransactionsGet200ResponseDataInner](docs/ApiV1PublisherFinanceTransactionsGet200ResponseDataInner.md)
- [ApiV1PublisherFinanceTransactionsIdGet200Response](docs/ApiV1PublisherFinanceTransactionsIdGet200Response.md)
- [ApiV1PublisherFinanceTransferToAdvertiserPost200Response](docs/ApiV1PublisherFinanceTransferToAdvertiserPost200Response.md)
- [ApiV1PublisherFinanceTransferToAdvertiserPostRequest](docs/ApiV1PublisherFinanceTransferToAdvertiserPostRequest.md)
- [ApiV1PublisherOffersPostbackLogGet200Response](docs/ApiV1PublisherOffersPostbackLogGet200Response.md)
- [ApiV1PublisherOffersPostbackLogGet200ResponseDataInner](docs/ApiV1PublisherOffersPostbackLogGet200ResponseDataInner.md)
- [ApiV1PublisherPushCampaignsGet200Response](docs/ApiV1PublisherPushCampaignsGet200Response.md)
- [ApiV1PublisherPushCampaignsIdDelete200Response](docs/ApiV1PublisherPushCampaignsIdDelete200Response.md)
- [ApiV1PublisherPushCampaignsIdDelete200ResponseData](docs/ApiV1PublisherPushCampaignsIdDelete200ResponseData.md)
- [ApiV1PublisherPushCampaignsIdSendPost200Response](docs/ApiV1PublisherPushCampaignsIdSendPost200Response.md)
- [ApiV1PublisherPushCampaignsIdSendPost200ResponseData](docs/ApiV1PublisherPushCampaignsIdSendPost200ResponseData.md)
- [ApiV1PublisherPushCampaignsPost200Response](docs/ApiV1PublisherPushCampaignsPost200Response.md)
- [ApiV1PublisherPushCampaignsPostRequest](docs/ApiV1PublisherPushCampaignsPostRequest.md)
- [ApiV1PublisherPushDeliveryRulesGet200Response](docs/ApiV1PublisherPushDeliveryRulesGet200Response.md)
- [ApiV1PublisherPushDeliveryRulesIdPutRequest](docs/ApiV1PublisherPushDeliveryRulesIdPutRequest.md)
- [ApiV1PublisherPushDeliveryRulesPostRequest](docs/ApiV1PublisherPushDeliveryRulesPostRequest.md)
- [ApiV1PublisherPushSegmentsGet200Response](docs/ApiV1PublisherPushSegmentsGet200Response.md)
- [ApiV1PublisherPushSegmentsIdPutRequest](docs/ApiV1PublisherPushSegmentsIdPutRequest.md)
- [ApiV1PublisherPushSegmentsPostRequest](docs/ApiV1PublisherPushSegmentsPostRequest.md)
- [ApiV1PublisherPushSetupGet200Response](docs/ApiV1PublisherPushSetupGet200Response.md)
- [ApiV1PublisherPushSetupGet200ResponseData](docs/ApiV1PublisherPushSetupGet200ResponseData.md)
- [ApiV1PublisherPushSetupGet200ResponseDataAdzonesInner](docs/ApiV1PublisherPushSetupGet200ResponseDataAdzonesInner.md)
- [ApiV1PublisherPushStatsGet200Response](docs/ApiV1PublisherPushStatsGet200Response.md)
- [ApiV1PublisherPushStatsGet200ResponseData](docs/ApiV1PublisherPushStatsGet200ResponseData.md)
- [ApiV1PublisherPushStatsGet200ResponseDataDailyInner](docs/ApiV1PublisherPushStatsGet200ResponseDataDailyInner.md)
- [ApiV1PublisherPushStatsGet200ResponseDataGrowthInner](docs/ApiV1PublisherPushStatsGet200ResponseDataGrowthInner.md)
- [ApiV1PublisherPushStatsGet200ResponseDataSummary](docs/ApiV1PublisherPushStatsGet200ResponseDataSummary.md)
- [ApiV1PublisherPushSubscribersActionPost200Response](docs/ApiV1PublisherPushSubscribersActionPost200Response.md)
- [ApiV1PublisherPushSubscribersActionPost200ResponseData](docs/ApiV1PublisherPushSubscribersActionPost200ResponseData.md)
- [ApiV1PublisherPushSubscribersActionPostRequest](docs/ApiV1PublisherPushSubscribersActionPostRequest.md)
- [ApiV1PublisherPushSubscribersGet200Response](docs/ApiV1PublisherPushSubscribersGet200Response.md)
- [ApiV1PublisherPushSubscribersGet200ResponseData](docs/ApiV1PublisherPushSubscribersGet200ResponseData.md)
- [ApiV1PublisherSmartzonesIdPutRequest](docs/ApiV1PublisherSmartzonesIdPutRequest.md)
- [ApiV1PublisherSmartzonesIdPutRequestIsActive](docs/ApiV1PublisherSmartzonesIdPutRequestIsActive.md)
- [ApiV1PublisherSmartzonesIdPutRequestUniqueOnly](docs/ApiV1PublisherSmartzonesIdPutRequestUniqueOnly.md)
- [ApiV1PublisherSmartzonesImportPostRequest](docs/ApiV1PublisherSmartzonesImportPostRequest.md)
- [ApiV1PublisherSmartzonesImportPostRequestZonesInner](docs/ApiV1PublisherSmartzonesImportPostRequestZonesInner.md)
- [ApiV1PublisherSmartzonesNetworksPostRequest](docs/ApiV1PublisherSmartzonesNetworksPostRequest.md)
- [ApiV1PublisherSmartzonesPostRequest](docs/ApiV1PublisherSmartzonesPostRequest.md)
- [ApiV1PublisherSspCampaignsIdTestRtbPostRequest](docs/ApiV1PublisherSspCampaignsIdTestRtbPostRequest.md)
- [ApiV1PublisherSspCampaignsIdToggleDeletePutRequest](docs/ApiV1PublisherSspCampaignsIdToggleDeletePutRequest.md)
- [ApiV1PublisherSspCampaignsIdTogglePausePutRequest](docs/ApiV1PublisherSspCampaignsIdTogglePausePutRequest.md)
- [ApiV1PublisherSspSellerDisclosurePutRequest](docs/ApiV1PublisherSspSellerDisclosurePutRequest.md)
- [ApiV1RetargetingPixelsGet200Response](docs/ApiV1RetargetingPixelsGet200Response.md)
- [ApiV1RetargetingPixelsIdActivePatch200Response](docs/ApiV1RetargetingPixelsIdActivePatch200Response.md)
- [ApiV1RetargetingPixelsIdDelete200Response](docs/ApiV1RetargetingPixelsIdDelete200Response.md)
- [ApiV1RtbTestRtbPostRequest](docs/ApiV1RtbTestRtbPostRequest.md)
- [ApiV1SharedReportsIdPutRequest](docs/ApiV1SharedReportsIdPutRequest.md)
- [ApiV1SharedReportsIdPutRequestCampaignsInner](docs/ApiV1SharedReportsIdPutRequestCampaignsInner.md)
- [ApiV1SharedReportsIdPutRequestSitesInner](docs/ApiV1SharedReportsIdPutRequestSitesInner.md)
- [ApiV1SitesGet200Response](docs/ApiV1SitesGet200Response.md)
- [ApiV1SitesGet200ResponseDataInner](docs/ApiV1SitesGet200ResponseDataInner.md)
- [ApiV1SitesIdClonePostRequest](docs/ApiV1SitesIdClonePostRequest.md)
- [ApiV1SitesSchemaGet200Response](docs/ApiV1SitesSchemaGet200Response.md)
- [ApiV1SitesSchemaGet200ResponseFieldsInner](docs/ApiV1SitesSchemaGet200ResponseFieldsInner.md)
- [ApiV1TagsIdPutRequest](docs/ApiV1TagsIdPutRequest.md)
- [ApiV1TagsMassDeletePostRequest](docs/ApiV1TagsMassDeletePostRequest.md)
- [ApiV1TagsPostRequest](docs/ApiV1TagsPostRequest.md)
- [ApiV1ToolsReplaceDomainPutRequest](docs/ApiV1ToolsReplaceDomainPutRequest.md)
- [ApiV1TrackerAdNetworksDeleteReportsPutRequest](docs/ApiV1TrackerAdNetworksDeleteReportsPutRequest.md)
- [ApiV1TrackerAdNetworksIdPutRequest](docs/ApiV1TrackerAdNetworksIdPutRequest.md)
- [ApiV1TrackerAdNetworksPostRequest](docs/ApiV1TrackerAdNetworksPostRequest.md)
- [ApiV1TrackerAffiliateNetworksGet200Response](docs/ApiV1TrackerAffiliateNetworksGet200Response.md)
- [ApiV1TrackerAffiliateNetworksIdPutRequest](docs/ApiV1TrackerAffiliateNetworksIdPutRequest.md)
- [ApiV1TrackerAffiliateNetworksPostRequest](docs/ApiV1TrackerAffiliateNetworksPostRequest.md)
- [ApiV1TrackerConversionLoggingPutRequest](docs/ApiV1TrackerConversionLoggingPutRequest.md)
- [ApiV1TrackerConversionTypesPutRequest](docs/ApiV1TrackerConversionTypesPutRequest.md)
- [ApiV1TrackerConversionsGet200Response](docs/ApiV1TrackerConversionsGet200Response.md)
- [ApiV1TrackerConversionsGet200ResponseSummary](docs/ApiV1TrackerConversionsGet200ResponseSummary.md)
- [ApiV1TrackerConversionsIdStatePutRequest](docs/ApiV1TrackerConversionsIdStatePutRequest.md)
- [ApiV1TrackerCustomParamsPutRequest](docs/ApiV1TrackerCustomParamsPutRequest.md)
- [ApiV1TrackerCustomParamsPutRequestSlotsInner](docs/ApiV1TrackerCustomParamsPutRequestSlotsInner.md)
- [ApiV1TrackerOffersBulkPostRequest](docs/ApiV1TrackerOffersBulkPostRequest.md)
- [ApiV1TrackerOffersGet200Response](docs/ApiV1TrackerOffersGet200Response.md)
- [ApiV1TrackerOffersIdGet200Response](docs/ApiV1TrackerOffersIdGet200Response.md)
- [ApiV1TrackerOffersIdPutRequest](docs/ApiV1TrackerOffersIdPutRequest.md)
- [ApiV1TrackerOffersIdUrlsPostRequest](docs/ApiV1TrackerOffersIdUrlsPostRequest.md)
- [ApiV1TrackerOffersIdUrlsUrlIdPutRequest](docs/ApiV1TrackerOffersIdUrlsUrlIdPutRequest.md)
- [ApiV1TrackerOffersPostRequest](docs/ApiV1TrackerOffersPostRequest.md)
- [ApiV1TrackerOffersPostRequestUrlsInner](docs/ApiV1TrackerOffersPostRequestUrlsInner.md)
- [ApiV1TrackerReportSchedulesGet200Response](docs/ApiV1TrackerReportSchedulesGet200Response.md)
- [ApiV1TrackerReportSchedulesIdGet200Response](docs/ApiV1TrackerReportSchedulesIdGet200Response.md)
- [ApiV1TrackerReportSchedulesIdPutRequest](docs/ApiV1TrackerReportSchedulesIdPutRequest.md)
- [ApiV1TrackerReportSchedulesPostRequest](docs/ApiV1TrackerReportSchedulesPostRequest.md)
- [ApiV1TrackerRulesGet200Response](docs/ApiV1TrackerRulesGet200Response.md)
- [ApiV1TrackerRulesIdGet200Response](docs/ApiV1TrackerRulesIdGet200Response.md)
- [ApiV1TrackerRulesIdPutRequest](docs/ApiV1TrackerRulesIdPutRequest.md)
- [ApiV1TrackerRulesPostRequest](docs/ApiV1TrackerRulesPostRequest.md)
- [ApiV1TrackerSourceAccountsGet200Response](docs/ApiV1TrackerSourceAccountsGet200Response.md)
- [ApiV1TrackerSourceAccountsIdGet200Response](docs/ApiV1TrackerSourceAccountsIdGet200Response.md)
- [ApiV1TrackerSourceAccountsIdPutRequest](docs/ApiV1TrackerSourceAccountsIdPutRequest.md)
- [ApiV1TrackerSourceAccountsPostRequest](docs/ApiV1TrackerSourceAccountsPostRequest.md)
- [ApiV1TrackerSourcesGet200Response](docs/ApiV1TrackerSourcesGet200Response.md)
- [ApiV1TrackerSourcesIdPutRequest](docs/ApiV1TrackerSourcesIdPutRequest.md)
- [ApiV1TrackerSourcesPostRequest](docs/ApiV1TrackerSourcesPostRequest.md)
- [ApiV1TrackerTrackingLinksBulkPostRequest](docs/ApiV1TrackerTrackingLinksBulkPostRequest.md)
- [ApiV1TrackerTrackingLinksGet200Response](docs/ApiV1TrackerTrackingLinksGet200Response.md)
- [ApiV1TrackerTrackingLinksIdBlocklistPostRequest](docs/ApiV1TrackerTrackingLinksIdBlocklistPostRequest.md)
- [ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest](docs/ApiV1TrackerTrackingLinksIdMediaBuyingActionsActionIdDecidePostRequest.md)
- [ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest](docs/ApiV1TrackerTrackingLinksIdMediaBuyingBlockPostRequest.md)
- [ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest](docs/ApiV1TrackerTrackingLinksIdMediaBuyingIpsPostRequest.md)
- [ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest](docs/ApiV1TrackerTrackingLinksIdMediaBuyingReportPostRequest.md)
- [ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest](docs/ApiV1TrackerTrackingLinksIdMediaBuyingSourceBidPutRequest.md)
- [ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest](docs/ApiV1TrackerTrackingLinksIdMediaBuyingTargetingPutRequest.md)
- [ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest](docs/ApiV1TrackerTrackingLinksIdNetworkBindingPutRequest.md)
- [ApiV1TrackerTrackingLinksIdPutRequest](docs/ApiV1TrackerTrackingLinksIdPutRequest.md)
- [ApiV1TrackerTrackingLinksIdToggleActivePost200Response](docs/ApiV1TrackerTrackingLinksIdToggleActivePost200Response.md)
- [ApiV1TrackerTrackingLinksIdToggleActivePost200ResponseData](docs/ApiV1TrackerTrackingLinksIdToggleActivePost200ResponseData.md)
- [ApiV1TrackerTrackingLinksIdZoneCostsGet200Response](docs/ApiV1TrackerTrackingLinksIdZoneCostsGet200Response.md)
- [ApiV1TrackerTrackingLinksPostRequest](docs/ApiV1TrackerTrackingLinksPostRequest.md)
- [ApiV1TrackingConversionTypesGet200Response](docs/ApiV1TrackingConversionTypesGet200Response.md)
- [ApiV1TrackingConversionTypesGet200ResponseConversionTypesInner](docs/ApiV1TrackingConversionTypesGet200ResponseConversionTypesInner.md)
- [ApiV1TrackingConversionTypesPut200Response](docs/ApiV1TrackingConversionTypesPut200Response.md)
- [ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner](docs/ApiV1TrackingConversionTypesPut200ResponseConversionTypesInner.md)
- [ApiV1TrackingConversionTypesPutRequest](docs/ApiV1TrackingConversionTypesPutRequest.md)
- [ApiV1TrackingConversionTypesPutRequestTypesInner](docs/ApiV1TrackingConversionTypesPutRequestTypesInner.md)
- [ApiV1TrackingPixelsGet200Response](docs/ApiV1TrackingPixelsGet200Response.md)
- [ApiV1TrackingPixelsIdPutRequest](docs/ApiV1TrackingPixelsIdPutRequest.md)
- [ApiV1TrackingPixelsPostRequest](docs/ApiV1TrackingPixelsPostRequest.md)
- [ApiV1UrlPoolsIdPutRequest](docs/ApiV1UrlPoolsIdPutRequest.md)
- [ApiV1UrlPoolsIdUrlsPostRequest](docs/ApiV1UrlPoolsIdUrlsPostRequest.md)
- [ApiV1UrlPoolsIdUrlsUrlIdPutRequest](docs/ApiV1UrlPoolsIdUrlsUrlIdPutRequest.md)
- [ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest](docs/ApiV1UrlPoolsIdUrlsUrlIdWeightPutRequest.md)
- [ApiV1UrlPoolsPostRequest](docs/ApiV1UrlPoolsPostRequest.md)
- [ApiV1UrlPoolsReplaceUrlPutRequest](docs/ApiV1UrlPoolsReplaceUrlPutRequest.md)
- [ApiV1WebhooksGet200Response](docs/ApiV1WebhooksGet200Response.md)
- [ApiV1WebhooksIdDelete200Response](docs/ApiV1WebhooksIdDelete200Response.md)
- [ApiV1WebhooksIdDeliveriesGet200Response](docs/ApiV1WebhooksIdDeliveriesGet200Response.md)
- [ApiV1WebhooksIdDeliveriesGet200ResponseDataInner](docs/ApiV1WebhooksIdDeliveriesGet200ResponseDataInner.md)
- [ApiV1WebhooksIdPatchRequest](docs/ApiV1WebhooksIdPatchRequest.md)
- [ApiV1WebhooksIdRotateSecretPostRequest](docs/ApiV1WebhooksIdRotateSecretPostRequest.md)
- [ApiV1WebhooksIdTestPost200Response](docs/ApiV1WebhooksIdTestPost200Response.md)
- [ApiV1WebhooksIdTestPost200ResponseData](docs/ApiV1WebhooksIdTestPost200ResponseData.md)
- [ApiV1WebhooksPost201Response](docs/ApiV1WebhooksPost201Response.md)
- [ApiV1WebhooksPostRequest](docs/ApiV1WebhooksPostRequest.md)
- [ApiV1XmlFeedsIdPutRequest](docs/ApiV1XmlFeedsIdPutRequest.md)
- [ApiV1XmlFeedsPostRequest](docs/ApiV1XmlFeedsPostRequest.md)
- [BidRule](docs/BidRule.md)
- [BidRuleConditions](docs/BidRuleConditions.md)
- [BidRuleset](docs/BidRuleset.md)
- [BidRulesetListItem](docs/BidRulesetListItem.md)
- [CampaignPanelFields](docs/CampaignPanelFields.md)
- [CampaignPanelFieldsAboutSettings](docs/CampaignPanelFieldsAboutSettings.md)
- [CampaignPanelFieldsAvCheck](docs/CampaignPanelFieldsAvCheck.md)
- [CampaignPanelFieldsBoosterSettings](docs/CampaignPanelFieldsBoosterSettings.md)
- [CampaignPanelFieldsConversionCapping](docs/CampaignPanelFieldsConversionCapping.md)
- [CampaignPanelFieldsDayParting](docs/CampaignPanelFieldsDayParting.md)
- [CampaignPanelFieldsDomainMask](docs/CampaignPanelFieldsDomainMask.md)
- [CampaignPanelFieldsFeedSettings](docs/CampaignPanelFieldsFeedSettings.md)
- [CampaignPanelFieldsPriority](docs/CampaignPanelFieldsPriority.md)
- [CampaignPanelFieldsScreens](docs/CampaignPanelFieldsScreens.md)
- [CampaignPanelFieldsSuggestions](docs/CampaignPanelFieldsSuggestions.md)
- [CpaOptimizerBody](docs/CpaOptimizerBody.md)
- [CpmOptimizerBody](docs/CpmOptimizerBody.md)
- [FilterDetail](docs/FilterDetail.md)
- [FilterDetailAllOfRanges](docs/FilterDetailAllOfRanges.md)
- [FilterSummary](docs/FilterSummary.md)
- [FilterType](docs/FilterType.md)
- [FundsDepositProof](docs/FundsDepositProof.md)
- [FundsTxnClaim](docs/FundsTxnClaim.md)
- [ListMeta](docs/ListMeta.md)
- [MediaBuyingPolicy](docs/MediaBuyingPolicy.md)
- [MediaBuyingPolicyTestPhase](docs/MediaBuyingPolicyTestPhase.md)
- [ModelError](docs/ModelError.md)
- [OwnAdWrite](docs/OwnAdWrite.md)
- [PushCampaign](docs/PushCampaign.md)
- [PushDeliveryRule](docs/PushDeliveryRule.md)
- [PushSegment](docs/PushSegment.md)
- [PushSubscriber](docs/PushSubscriber.md)
- [ResourceFilter](docs/ResourceFilter.md)
- [RetargetingPixel](docs/RetargetingPixel.md)
- [RetargetingPixelWrite](docs/RetargetingPixelWrite.md)
- [RtbTestRequest](docs/RtbTestRequest.md)
- [RtbTestResult](docs/RtbTestResult.md)
- [SharedReportAdjust](docs/SharedReportAdjust.md)
- [SharedReportBody](docs/SharedReportBody.md)
- [SharedReportBodyCampaignsInner](docs/SharedReportBodyCampaignsInner.md)
- [SharedReportBodyOptions](docs/SharedReportBodyOptions.md)
- [SharedReportBodySettings](docs/SharedReportBodySettings.md)
- [Site](docs/Site.md)
- [SiteCreate](docs/SiteCreate.md)
- [SiteSnippetWrite](docs/SiteSnippetWrite.md)
- [SiteSnippetWriteConditions](docs/SiteSnippetWriteConditions.md)
- [SspCampaignWrite](docs/SspCampaignWrite.md)
- [SspCampaignWriteSlotsInner](docs/SspCampaignWriteSlotsInner.md)
- [SspCampaignWriteZoneurlsInner](docs/SspCampaignWriteZoneurlsInner.md)
- [StatsResponse](docs/StatsResponse.md)
- [TrackerAffiliateNetwork](docs/TrackerAffiliateNetwork.md)
- [TrackerConversion](docs/TrackerConversion.md)
- [TrackerOffer](docs/TrackerOffer.md)
- [TrackerReportSchedule](docs/TrackerReportSchedule.md)
- [TrackerRule](docs/TrackerRule.md)
- [TrackerSource](docs/TrackerSource.md)
- [TrackerSourceAccount](docs/TrackerSourceAccount.md)
- [TrackingLink](docs/TrackingLink.md)
- [TrackingPixel](docs/TrackingPixel.md)
- [UserEvent](docs/UserEvent.md)
- [UserEventType](docs/UserEventType.md)
- [UserWebhook](docs/UserWebhook.md)

### Authorization


Authentication schemes defined for the API:
<a id="apiKey"></a>
#### apiKey


- **Type**: HTTP Bearer Token authentication (gas_live_<32 chars>)
<a id="oauth2-accessCode"></a>
#### oauth2 accessCode


- **Type**: OAuth
- **Flow**: accessCode
- **Authorization URL**: /oauth/authorize
- **Scopes**: 
  - `campaigns.read`: View campaigns
  - `campaigns.write`: View and change campaigns
  - `stats.read`: View stats
  - `sites.read`: View sites
  - `adspaces.read`: View adspaces
  - `payouts.read`: View publisher earnings and payouts
  - `billing.read`: View billing
  - `webhooks.read`: View webhooks and the event feed
  - `webhooks.write`: Manage webhooks

## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0`
- Package version: `1.1.0`
- Generator version: `7.21.0`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system


## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

### Publishing

Once you've built the package, you can publish it to npm:

```bash
npm publish
```

## License

[]()
