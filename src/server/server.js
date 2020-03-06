/* eslint-env node */

/*
 * Production server.
 *
 * NOTE: This file doesn't go through babel or webpack. Make sure the syntax and
 * sources this file requires are compatible with the current node version you
 * are running.
 */

const fs = require('fs');
const crypto = require('crypto');
const url = require('url');
const path = require('path');
const fetch = require('node-fetch');
const express = require('express');
const mime = require('mime-types');
const Wreck = require('@hapi/wreck');

const app = express();

const { HEROKU_PR_NUMBER, PORT = 9000, NODE_ENV } = process.env;

const s3Prefix =
  'https://fabio-blog-dvc-us.s3.us-west-1.amazonaws.com/' +
  (HEROKU_PR_NUMBER ? `pulls/${HEROKU_PR_NUMBER}` : 'prod');
const cacheControl = 'public, max-age=0, s-maxage=999999';
const wreckOptions = {
  redirects: 2,
  timeout: 5000
};
const htmlType = 'text/html; charset=utf-8';

let notFoundPage;
try {
  // in production there's no public folder
  notFoundPage = fs.readFileSync(path.join(__dirname, '../../404.html'));
} catch (e) {
  notFoundPage = fs.readFileSync(path.join(__dirname, '../../public/404.html'));
}

async function serveFile(pathname, res) {
  const target = s3Prefix + pathname;

  const proxyRes = await Wreck.request('GET', target, wreckOptions);

  const { statusCode, headers: { etag } = {} } = proxyRes;

  if (statusCode !== 200) {
    throw new Error('Response not successful: ' + statusCode);
  }

  res.writeHead(200, {
    'cache-control': cacheControl,
    'content-type': mime.lookup(pathname) || htmlType,
    etag
  });

  proxyRes.pipe(res);
}

const get = pathname =>
  Wreck.get(s3Prefix + pathname, {
    redirects: 2,
    timeout: 3000
  });

app.use(async (req, res) => {
  const { pathname } = url.parse(req.url);

  try {
    await serveFile(pathname, res);
  } catch (e) {
    try {
      const indexFile = (pathname + '/index.html').replace(/\/+/, '/');
      await serveFile(indexFile, res);
    } catch (e) {
      res
        .writeHead(404, {
          'cache-control': cacheControl,
          'content-type': htmlType
        })
        .end(notFoundPage);
    }
  }
});

app.listen(PORT, e => {
  /* tslint:disable-next-line:no-console */
  console.log(`Listening on http://0.0.0.0:${PORT}/`);
});
