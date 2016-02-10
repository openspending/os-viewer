# Fiscal Data Packager
App to make Fiscal Data Packages from a CSV of Fiscal Data.

# Getting started

Fiscal Data Packager is a Node.js app, based on Express v4 framework.

Get a local server setup with the following steps:

1. Ensure you are running the supported version of Node.js, which is declared in the `package.json`.
2. Create a local directory called `fiscal-data-packager` and move into it with `cd fiscal-data-packager`.
3. Clone the code with `git clone https://github.com/openspending/fiscal-data-packager.git .`.
4. Install the dependencies with `npm install`.
5. Create a `settings.json` file with these contents, changing any values as required:
```
{
  "app": {
    "port": 5000
  }
}
```

Now we should be ready to run the server:

1. Run the app with `npm start`
2. Visit the site: `http://localhost:5000/`

# Other useful commands:

1. `npm test` - run tests.
2. `npm run review` - run jscs over the code.
2. `npm run develop` - build sources and then start server.