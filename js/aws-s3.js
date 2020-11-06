//
// Data constructs and initialization.
//

// **DO THIS**:
//   Replace BUCKET_NAME with the bucket name.
//
var albumBucketName = 'gpx-psc2'; // arn:aws:s3:eu-west-1:053049725529:accesspoint/gpx-1km';

// **DO THIS**:
//   Replace this block of code with the sample code located at:
//   Cognito -- Manage Identity Pools -- [identity_pool_name] -- Sample Code -- JavaScript
//
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-west-1:19f8e560-a2d9-4918-96ec-7b025725fa54',
});

// Create a new service object
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

function awsGistGpxFiles() {
  return new Promise(function (resolve, reject) {
    s3.listObjects({Delimiter: '/'}, function (err, data) {
      console.log('list ', {err, data});
      if (err) {
        reject(err);
      }

      const href = this.request.httpRequest.endpoint.href;
      const bucketUrl = href + albumBucketName + '/';

      const files = data.Contents.map(function (file) {
        const photoKey = file.Key;
        return bucketUrl + encodeURIComponent(photoKey)
      });
      resolve(files);
    });
  });
}
