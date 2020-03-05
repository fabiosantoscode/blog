/* eslint-env node */

/*
 * Production server.
 *
 * NOTE: This file doesn't go through babel or webpack. Make sure the syntax and
 * sources this file requires are compatible with the current node version you
 * are running.
 */

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

async function serveFile(pathname, incomingEtag, res) {
  const target = s3Prefix + pathname;

  const proxyRes = await Wreck.request('GET', target, wreckOptions);

  const { statusCode, headers: { etag } = {} } = proxyRes;

  if (statusCode !== 200) {
    throw new Error('Response not successful: ' + statusCode);
  }

  if (incomingEtag && incomingEtag === etag) {
    return res.writeHead(304, { 'cache-control': cacheControl }).end();
  }

  res.writeHead(200, {
    'cache-control': cacheControl,
    'content-type': mime.lookup(pathname) || 'text/html; charset=utf-8',
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
  const { host, 'if-none-match': incomingEtag } = req.headers;

  const { pathname } = url.parse(req.url);

  try {
    await serveFile(pathname, incomingEtag, res);
  } catch (e) {
    try {
      const indexFile = (pathname + '/index.html').replace(/\/+/, '/');
      await serveFile(indexFile, incomingEtag, res);
    } catch (e) {
      try {
        await serveFile('/404.html', incomingEtag, res);
      } catch (e) {
        res
          .status(500)
          .end(NODE_ENV === 'production' ? 'Internal server error' : e.stack);
      }
    }
  }
});

app.listen(PORT, e => {
  /* tslint:disable-next-line:no-console */
  console.log(`Listening on http://0.0.0.0:${PORT}/`);
});
