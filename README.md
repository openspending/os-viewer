# OS Viewer

[![Gitter](https://img.shields.io/gitter/room/openspending/chat.svg)](https://gitter.im/openspending/chat)
[![Build Status](https://travis-ci.org/openspending/os-viewer.svg?branch=master)](https://travis-ci.org/openspending/os-viewer)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/openspending/openspending/issues)
[![Docs](https://img.shields.io/badge/docs-latest-blue.svg)](http://docs.openspending.org/en/latest/developers/viewer/)

An app to view data packages loaded to OpenSpending. Provides access to raw data, access to an API for the data, and a suite of views to visualise the data.

## Quick start

Clone the repo, install dependencies from npm, and run the server:

```
npm install
npm run build
npm start
```

For development, environmental variables can be added to a `.env` file in the root directory, and the following values can be configured:

```ini
# Required settings
# Base URL for the application, e.g. 'http://localhost' or 'https://openspending.org'
OS_BASE_URL=

# Optional settings
# base path defaults to 'viewer/'. Use '/' for development.
OS_VIEWER_BASE_PATH=
OS_SNIPPETS_GA=
OS_SNIPPETS_RAVEN=
SENTRY_DSN=

# Cosmopolitan API url (defaults to '//cosmopolitan.openspending.org/v1/')
OS_VIEWER_API_COSMO_HOST=
# URL for the associated Redash instance
OS_VIEWER_DATAMINE_HOST=

# Each service below will use OS_BASE_URL unless overridden here:
OS_API_URL=
OS_EXPLORER_URL=
OS_CONDUCTOR_URL=
OS_SEARCH_URL=
```

See the [docs](http://docs.openspending.org/en/latest/developers/viewer/) for more information.
