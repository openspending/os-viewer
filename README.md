# OS Viewer

[![Gitter](https://img.shields.io/gitter/room/openspending/chat.svg)](https://gitter.im/openspending/chat)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/openspending/openspending/issues)
[![Docs](https://img.shields.io/badge/docs-latest-blue.svg)](http://docs.openspending.org/en/latest/developers/viewer/)

An app to view data packages loaded to OpenSpending. Provides access to raw data, access to an API for the data, and a suite of views to visualise the data.

## Quick start

Clone the repo, install dependencies from npm, and run the server:

```
npm install -g napa
napa eligrey/FileSaver.js:file-saver
napa d3/d3-plugins:d3-plugins
npm install
npm run build
```

See the [docs](http://docs.openspending.org/en/latest/developers/viewer/) for more information.
