#!/usr/bin/env node

'use strict';

const path = require('path');
const { execSync } = require('child_process');
const { remove, move } = require('fs-extra');
const { s3Prefix, s3Bucket, s3Client } = require('./s3-utils');

const rootDir = path.join(__dirname, '..');
const cacheDir = path.join(rootDir, '.cache');
const publicDir = path.join(rootDir, 'public');

function run(command) {
  execSync(command, {
    stdio: ['pipe', process.stdout, process.stderr]
  });
}

function syncCall(method, ...args) {
  return new Promise((resolve, reject) => {
    const synchroniser = s3Client[method](...args);
    synchroniser.on('error', reject);
    synchroniser.on('end', resolve);
  });
}

async function prefixIsEmpty(prefix) {
  try {
    await s3Client.s3
      .headObject({
        Bucket: s3Bucket,
        Prefix: prefix + '/index.html'
      })
      .promise();
    return false;
  } catch (e) {
    return true;
  }
}

async function downloadFromS3(prefix) {
  try {
    console.log(`downloading public/ from s3://${s3Bucket}/${prefix}`);
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
  console.log(`Uploading public/ to s3://${s3Bucket}/${s3Prefix}`);
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
  const emptyPrefix = await prefixIsEmpty(s3Prefix);
  // TODO if the prefix is empty, we can have S3 copy everything
  // from prod/ to the new prefix to warm things up, while we wait
  // for gatsby build.

  // First build of a PR is slow because it can't reuse cache.
  // But we can download from prod to warm cache up.
  const cacheWarmPrefix = emptyPrefix ? 'prod' : s3Prefix;

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
  await move(path.join(publicDir, '404.html'), path.join(rootDir, '404.html'), {
    overwrite: true
  });
  await uploadToS3();
  await remove(publicDir);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
