const express = require('express');

const api = express.Router();

api.get('/api/example-function', (req, res) => {
  res.json({
    amAPI: true
  });
});

module.exports = api;
