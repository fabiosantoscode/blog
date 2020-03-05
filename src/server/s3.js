'use strict';

const { AWS_REGION, S3_BUCKET, HEROKU_APP_NAME } = process.env;

const s3Prefix = HEROKU_APP_NAME ? `pulls/${HEROKU_APP_NAME}` : 'prod';
const s3Bucket = S3_BUCKET;
const s3Url = `https://${s3Bucket}.s3-website-${AWS_REGION}.amazonaws.com/${s3Prefix}`;

module.exports = { s3Prefix, s3Bucket, s3Url };
