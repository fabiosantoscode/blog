#!/usr/bin/env node

'use strict';

const path = require('path');
const { execSync } = require('child_process');
const { remove, move } = require('fs-extra');
const s3 = require('s3-client');

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

const rootDir = path.join(__dirname, '..');
const cacheDir = path.join(rootDir, '.cache');
const publicDir = path.join(rootDir, 'public');
const s3Prefix = HEROKU_PR_NUMBER ? `pulls/${HEROKU_PR_NUMBER}` : 'prod';

const s3Bucket = 'fabio-blog-dvc-us';

console.log({
  AWS_REGION,
  HEROKU_PR_NUMBER,
  s3Bucket,
  s3Prefix,
  hasCreds: Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY)
});

const syncCall = (method, ...args) =>
  new Promise((resolve, reject) => {
    const synchroniser = s3Client[method](...args);
    synchroniser.on('error', reject);
    synchroniser.on('end', resolve);
  });

async function prefixIsEmpty(prefix) {
  try {
    await s3.headObject({
      Bucket: s3Bucket,
      Prefix: prefix + '/index.html'
    });
  } catch (e) {
    return true;
  }
  return false;
}

async function downloadFromS3(prefix) {
  // Removing mostly for local testing of this script:
  // heroku won't have public/ lying around.
  // await remove(publicDir);
  try {
    console.time('download from s3');
    await syncCall('downloadDir', {
      localDir: publicDir,
      s3Params: {
        Bucket: s3Bucket,
        Prefix: prefix
      }
    });
    console.timeEnd('download from s3');
  } catch (e) {
    console.error('Error downloading initial data');
    console.error(e);
    // Don't propagate. It's just a cache warming step
  }
}

async function uploadToS3() {
  console.time('upload to s3');
  await syncCall('uploadDir', {
    localDir: publicDir,
    s3Params: {
      Bucket: s3Bucket,
      Prefix: s3Prefix
    }
  });
  console.timeEnd('upload to s3');
}

async function main() {
  // First build of a PR is slow because it can't reuse cache.
  // But we can download from prod to warm cache up.
  const cacheWarmPrefix = (await prefixIsEmpty(s3Prefix)) ? 'prod' : s3Prefix;

  await downloadFromS3(cacheWarmPrefix);
  try {
    run('yarn build');
  } catch (buildError) {
    console.error('------------------------\n\n');
    console.error(buildError);
    console.error('\nAssuming bad cache and retrying:\n');
    // Sometimes gatsby build fails because of bad cache.
    // Clear it and try again.
    await remove(cacheDir);
    await remove(publicDir);
    run('yarn build');
  }
  await move(path.join(publicDir, '404.html'), path.join(rootDir, '404.html'));
  await uploadToS3();
  await remove(publicDir);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
