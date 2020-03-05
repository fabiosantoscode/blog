#!/usr/bin/env node

'use strict';

const { execSync } = require('child_process');
const s3 = require('s3-client');
const { remove } = require('fs-extra');

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  HEROKU_PR_NUMBER
} = process.env;

const s3Client = s3.createClient({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const run = command =>
  execSync(command, {
    stdio: ['pipe', process.stdout, process.stderr]
  });

const cacheDir = __dirname + '/../.cache';
const publicDir = __dirname + '/../public';
const prefix = HEROKU_PR_NUMBER ? `pulls/${HEROKU_PR_NUMBER}` : 'prod';

const syncParams = {
  localDir: publicDir,

  s3Params: {
    Bucket: 'fabio-blog-dvc-us',
    Prefix: prefix
  }
};

const syncCall = (method, ...args) =>
  new Promise((resolve, reject) => {
    const synchroniser = s3Client[method](...args);
    synchroniser.on('error', reject);
    synchroniser.on('end', resolve);
  });

async function main() {
  // Removing mostly for local testing of this script:
  // heroku won't have public/ lying around.
  await remove(publicDir);
  try {
    console.time('download from s3');
    await syncCall('downloadDir', syncParams);
    console.timeEnd('download from s3');
  } catch (e) {
    console.error('Error downloading initial data');
    console.error(e);
    // Don't propagate. It's just a cache warming step
  }
  try {
    run('yarn build');
  } catch (e) {
    console.error('------------------------\n\n');
    console.error('\n\n');
    // Sometimes gatsby build fails because of a bad cache folder
    // Clear it and try again
    await remove(cacheDir);
    run('yarn build');
  }
  console.time('upload to s3');
  await syncCall('uploadDir', syncParams);
  console.timeEnd('upload to s3');
  await remove(publicDir);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
