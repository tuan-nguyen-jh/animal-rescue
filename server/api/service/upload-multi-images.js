require('dotenv').config();

const parallel = require('async/parallel');

const {
  handleError,
  serialize,
} = require('../../api-util/sdk');

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

// Create rate limit handler for queries.
// NB! If you are using the script in production environment,
// you will need to use sharetribeIntegrationSdk.util.prodQueryLimiterConfig
const queryLimiter = sharetribeIntegrationSdk.util.createRateLimiter(
  sharetribeIntegrationSdk.util.devQueryLimiterConfig
);

// Create rate limit handler for commands.
// NB! If you are using the script in production environment,
// you will need to use sharetribeIntegrationSdk.util.prodCommandLimiterConfig
const commandLimiter = sharetribeIntegrationSdk.util.createRateLimiter(
  sharetribeIntegrationSdk.util.devCommandLimiterConfig
);

const integrationSdk = sharetribeIntegrationSdk.createInstance({
  // These two env vars need to be set in the `.env` file.
  clientId: process.env.FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.FLEX_INTEGRATION_CLIENT_SECRET,

  // Pass rate limit handlers
  queryLimiter: queryLimiter,
  commandLimiter: commandLimiter,
});

module.exports = async (req, res) => {
  const { bodyParams, queryParams } = req.body;
  const { imagePaths } = bodyParams;

  const upload = (image) => async () => {
    return await integrationSdk.images.upload({ image }, queryParams)
  }

  try {
    const results = await parallel(imagePaths.map((img) => upload(img)));
    const imageIds = results.map((apiResponse) => {
      return apiResponse.data.data.id;
    });
    res
      .status(200)
      .set('Content-Type', 'application/transit+json')
      .send(
        serialize({
          status: 200,
          statusText: 'OK',
          data: imageIds,
        })
      )
      .end();
  }
  catch (err) {
    handleError(err)
  }

};
