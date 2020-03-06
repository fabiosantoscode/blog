'use strict';

const s3 = require('s3-client');

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  HEROKU_APP_NAME
} = process.env;

const s3Prefix = HEROKU_APP_NAME ? `pulls/${HEROKU_APP_NAME}` : 'prod';
const s3Bucket = 'fabio-blog-dvc-us';

const s3Client = s3.createClient({
  maxAsyncS3: 50,
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

console.log({
  AWS_REGION,
  HEROKU_APP_NAME,
  s3Bucket,
  s3Prefix,
  hasCreds: Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY)
});

module.exports = {
  s3Bucket,
  s3Prefix,
  s3Client
};
