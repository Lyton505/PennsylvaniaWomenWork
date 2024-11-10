require('dotenv').config();
const AWS = require('aws-sdk');
const express = require('express');
const app = express();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Route to list all files in the S3 bucket
app.get('/files', (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
  };

  s3.listObjectsV2(params, (error, data) => {
    if (error) {
      return res.status(500).send(error);
    }

    // Map each file to its URL and return the list
    const fileUrls = data.Contents.map((file) => {
      return {
        key: file.Key,
        url: s3.getSignedUrl('getObject', {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file.Key,
          Expires: 60 * 60, // Link expires in 1 hour
        }),
      };
    });

    res.status(200).json(fileUrls);
  });
});

// Start server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
