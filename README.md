# Gridsome Source for Google Sheets

This plugin is based on [spenwall/gridsome-source-google-sheets](https://github.com/spenwall/gridsome-source-google-sheets) which doesn't seem to be actively maintained.

Source plugin for fetching data from Google Sheets. Supports multiple tabs per sheet and  image downloads.

## Requirements

Gridsome: >0.7.0

## Install

```js
yarn add gridsome-source-googlesheets
```
npm
```js
npm install gridsome-source-googlesheets
```

## How to use

You will need to generate a google api key [here](https://console.developers.google.com/apis/credentials). The sheetId
can be found on the sheets url. It is the large hash number near the end. You will also need to make your spreadsheet viewable to the public to use the api credentials.

```js
module.exports = {
  siteName: 'Gridsome',
  plugins: [
    {
      use: 'gridsome-source-google-sheets',
      options: {
        sheetId: 'GOOGLE_SHEET_ID',
        apiKey: 'GOOGLE_API_KEY',
        tab: 'TAB_NAME' // Optional - must match the name of the tab in the Google Sheet.
        type: 'TYPE_NAME', // Optional - default is googleSheet. Used for graphql queries.
        imageFields: ['COLUMN_NAME','COLUMN_NAME'] // Optional - must be an array of column names. Columns must contain direct to URLs to image files that publicly accessible
      }
    },
    {
      use: 'gridsome-source-google-sheets', // To use more than one tab "use" the plugin again
      options: {
        sheetId: 'GOOGLE_SHEET_ID',
        apiKey: 'GOOGLE_API_KEY',
        tab: 'SECOND_TAB_NAME' // Optional - must match the name of the tab in the Google Sheet.
        type: 'SECOND_TYPE_NAME', // Optional - default is googleSheet. Used for graphql queries.
        imageFields: ['COLUMN_NAME','COLUMN_NAME'] // Optional - must be an array of column names. Columns must contain direct to URLs to image files that publicly accessible
      }
    }
  ]
}
```

### Example query on page template

```js
<page-query>
  query MyData {
    allGoogleSheet {
      edges {
        node {
          id
          title
        }
      }
    }
  }
</page-query>
```

### To use data in page

```js
<template>
  <div>
    {{ $page.allGoogleSheet.node.id }}
  </div>
  <div>
    {{ $page.allGoogleSheet.node.title }}
  </div>
</template>
```

### Using Templates

To use this in a template first setup the template route in gridsome.config.js

```js
module.exports = {
  siteName: 'Gridsome',
  plugins: [
    {
      use: 'gridsome-source-google-sheets',
      options: {
        sheetId: 'GOOGLE_SHEET_ID',
        apiKey: 'GOOGLE_API_KEY',
        // type: 'TYPE_NAME', //Optional - default is googleSheet. Used for graphql queries.
      }
    }
  ],
  templates: {
    googleSheet: [
      {
        path: '/:id',
        component: './src/templates/googleSheet.vue'
      }
    ]
  }
}

```

### Example template in src/template/googleSheet.vue

```js
<template>
  <layout>
    <div>{{$page.googleSheet.title}}</div>
    <div>{{$page.googleSheet.body}}</div>
  </layout>
</template>

<page-query>
query Post ($path: String!) {
  googleSheet (path: $path) {
    title
    body
  }
}
</page-query>
```
