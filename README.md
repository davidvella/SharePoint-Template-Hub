## share-point-document-template-hub-extension

This is where you include your WebPart documentation.

Need NodeJS https://nodejs.org/en/blog/release/v8.9.4/
Typescript 2.4.2

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
