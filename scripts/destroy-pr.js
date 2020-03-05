#!/usr/bin/env node

'use strict';

const { s3Prefix, s3Bucket, s3Client } = require('./s3-utils');

async function main() {
  console.log(`Deleting s3://${s3Bucket}/${s3Prefix}...`);
  await new Promise((resolve, reject) => {
    const destroyer = s3Client.deleteDir({
      Bucket: s3Bucket,
      Prefix: s3Prefix
    });

    destroyer.on('end', resolve);
    destroyer.on('error', reject);
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
