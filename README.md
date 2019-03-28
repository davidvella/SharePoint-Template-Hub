## share-point-document-template-hub-extension

This is where you include your WebPart documentation.

Need NodeJS https://nodejs.org/en/blog/release/v8.9.4/
Typescript 2.4.2

### Building the code

```bash
git clone https://github.com/davidvella/SharePoint-Template-Hub.git
cd SharePoint-Template-Hub/
npm i
npm run build
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

