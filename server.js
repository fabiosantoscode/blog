'use strict';

const express = require('express');
const app = express();

const api = require('./api');

app.use(
  express.static('public/', {
    trailing: false // Don't do a pesky trailing slash redirect
  })
);
app.use(api);

app.listen(3001);
