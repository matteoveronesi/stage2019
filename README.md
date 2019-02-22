<h1 align="center"><br>
  <a href="https://www.gnet.it"><img width="500px" src="/release/src/assets/logo.png"></a><br><br>
  Salesforce Project Viewer
</h1>

<h4 align="center">
  Simple application that visualize <a href="https://www.salesforce.com">Salesforce</a>'s selected Case.
</h4>

<p align="center">
  <a href="https://github.com/matteoveronesi/stage2019/releases/tag/v2.0.0"><img src="https://img.shields.io/badge/release-v2.0.0-brightgreen.svg"></a>
  <a href="#releases"><img src="https://img.shields.io/badge/status-alpha-brightgreen.svg"></a>
  <a href="https://paypal.me/dreadlord"><img src="https://img.shields.io/badge/donate-paypal-blue.svg"></a>
</p>

<h4 align="center"><b>
  <a href="#getting-started">Getting Started</a> |
  <a href="#documentation">Documentation</a> |
  <a href="#dependencies">Dependencies</a> |
  <a href="#contributing">Contributing</a> |
  <a href="#development">Development</a> |
  <a href="#versioning">Versioning</a> |
  <a href="#releases">Releases</a> |
  <a href="#authors">Authors</a> |
  <a href="#license">License</a>
</b></h4>

<hr>

## Getting Started

Exactly what you need to see it working.

### Prerequisites

[Node Js](https://nodejs.org/en/download/) v10.15.1 or higher installed.

### Installing 

- **NOTE:** You will have to create the `conf.js` file and adapting the Salesforce Database to use the application (except the [V0.1.0](#releases)). Refer to the [Development](#development) section for details.

After downloading the files, you only need the [release](/release) folder.

- **Windows:** Open the [release](/release) folder and with `shift + right click` open cmd (or PowerShell)

- **Windows/Linux/MacOS:** Open the terminal and browse to the [release](/release) folder

Then install the package
```
npm install
``` 
and start the server
```
node index.js
```

## Documentation

For anything project-related like Changelog, User Manual and Project Behavior, see the [About](/about/README.md) section.

## Dependencies

- [NodeJs](https://nodejs.org/) - Simple javascript runtime
- [Express](https://expressjs.com/) - Node framework for web apps
- [JSforce](https://jsforce.github.io/) - Salesforce API Library
- [Axios](https://www.npmjs.com/package/axios) - Promise based HTTP client
- [Passport](http://www.passportjs.org/) -  Authentication middleware for NodeJs
- [SLDS](https://lightningdesignsystem.com/) - Salesforce CSS library
- [Google Charts](https://developers.google.com/chart/) - Intuitive JS library for visualizing data into a Chart 

## Contributing

Not available yet, but feel free to ask. 
If You want to report a bug or anything security-related, do it from the dedicated [Issues](https://github.com/matteoveronesi/stage2019/issues) page, thanks.

## Development

For information about the development of the application, see the [Development](/about/DEVELOPMENT.md) file.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [Release](https://github.com/matteoveronesi/stage2019/releases) page.

## Releases

Latest release: [V2.0.0](https://github.com/matteoveronesi/stage2019/releases/tag/v2.0.0)

For all the Releases see the [Release](https://github.com/matteoveronesi/stage2019/releases) page.

If you want to use the application in "fake" mode without Salesforce, try the [V0.1.0](https://github.com/matteoveronesi/stage2019/releases/tag/v0.1.0) release.

## Authors

- [**Matteo Veronesi**](https://github.com/matteoveronesi)

- Huge thanks and 🖤 to the [GNet](https://www.gnet.it) Team for the constant help & support.

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.