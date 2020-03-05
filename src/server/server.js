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

const app = express();

const { HEROKU_APP_NAME, PORT = 9000, NODE_ENV } = process.env;

const s3Prefix =
  'https://fabio-blog-dvc.s3.eu-west-3.amazonaws.com/' + HEROKU_APP_NAME;
const cacheControl = 'public, max-age=0, s-maxage=999999';

async function serveFile(pathname, req, res) {
  const target = s3Prefix + pathname;

  const proxyRes = await fetch(target, {
    method: 'GET',
    redirect: 'follow'
  });

  if (!proxyRes.ok) {
    throw new Error('Response not successful: ' + proxyRes.status);
  }

  const resBlob = Buffer.from(await proxyRes.arrayBuffer());

  const etag = crypto
    .createHash('md4')
    .update(resBlob)
    .digest('hex');

  res
    .writeHead(200, {
      'cache-control': cacheControl,
      'content-type': mime.lookup(pathname) || 'text/html; charset=utf-8',
      etag
    })
    .end(resBlob);
}

app.use(async (req, res) => {
  const { host } = req.headers;

  const { pathname } = url.parse(req.url);

  try {
    await serveFile(pathname, req, res);
  } catch (e) {
    try {
      const indexFile = (pathname + '/index.html').replace(/\/+/, '/');
      await serveFile(indexFile, req, res);
    } catch (e) {
      try {
        await serveFile('/404.html', req, res);
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
