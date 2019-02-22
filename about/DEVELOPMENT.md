<a href="https://github.com/matteoveronesi/stage2019/blob/master/README.md" style="font-size:16px">Home</a> > <a href="https://github.com/matteoveronesi/stage2019/blob/master/about/README.md" style="font-size:16px">About</a> > Development

# Development

A detailed list with all the step-by-step development guides You need.
Some info before reading:

- **[MUST NOT CHANGE]** Means that you shouldn't change those things unless you know how to do it correctly.
- **[DO NOT CHANGE]** Means that if you change them, the app won't work. 

## About .gitignored files

- **node_modules:** Contains the NodeJs files, created with the `npm install` command.
- **token.json** Contains the Salesforce connection tokens, created the first time you run the application.
- **conf.js** Contains your Salesforce data, do **NOT** share them, created by following the guide below.

## Create the conf.js file

Browse the `release/auth` folder, then create a file named `conf.js` structured as following:

```js
module.exports = {
    cid: '...',
    cs: '...',
    cb: 'http://localhost:3000/auth',
    loginUrl: 'https://login.salesforce.com',
    urlauth: 'https://login.salesforce.com/services/oauth2/authorize',
    urltoken: 'https://login.salesforce.com/services/oauth2/token'
}
```

### Variables Explanation

- `cid` Configuration String that contains the Consumer Key of your Salesforce App [**[Screenshot]**](img/screen01.png)
- `cs` Configuration String that contains the Consumer Secret of your Salesforce App [**[Screenshot]**](img/screen01.png)
- `cb` Application route url that manage the auth response from Salesforce **[MUST NOT CHANGE]**
- `loginUrl` Salesforce login url, used when crating the connection **[DO NOT CHANGE]**
- `urlauth` Salesforce auth url, used when requesting the connection code **[DO NOT CHANGE]** 
- `urltoken` Salesforce token url, used when requesting the connection token **[DO NOT CHANGE]** 

## Adapting the Salesforce Database

For optimal usage, this Portal use some custom fields. **[MUST NOT CHANGE]**

### [Case Obejct]

#### Working Start Date

Used as start date of a Case, note that this is **not** the `CreatedDate` Field.
- Field Name:  `WorkingStartDate__c` 
- Field Label: `Working Start Date` 
- Data Type:   `Date`

#### Forecasted Working Ending Date

Used as end date of a Case, note that this is **not** the `ClosedDate` Field.
- Field Name:  `ForecastedEndingDate__c` 
- Field Label: `Forecasted Working Ending Date` 
- Data Type:   `Date`

#### Visible On Portal

Used to filter which Cases are visible on the portal, this field won't be shown.
Also when creating a new Case on the portal, it will be auto-added as `true`.
- Field Name:  `IsVisibleOnPortal__c` 
- Field Label: `Visible On Portal` 
- Data Type:   `Checkbox`

### [Contact Object]

#### Username On Portal

Used to access into the portal **[DO NOT SHARE THEM]**.
- Field Name:  `PortalUsername__c` 
- Field Label: `Username On Portal` 
- Data Type:   `Text(255)`

#### Password On Portal

Used to access into the portal **[DO NOT SHARE THEM]**.
- Field Name:  `PortalPassword__c` 
- Field Label: `Password On Portal` 
- Data Type:   `Text(255)`