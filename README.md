# Kontent.ai OpenAPI to Postman Converter

This application creates a Postman collection for the Kontent.ai APIs. It takes the OpenAPI specifications generated by the [Kontent.ai Learn API reference generator](https://github.com/Kontent-ai-Learn/kontent-ai-api-reference), converts them to Postman collections, tweaks the converted collections, and then merges them into a single collection.

## Overview

1. Fetches OpenAPI v3 specifications for the [Kontent.ai APIs](https://kontent.ai/learn/reference/kontent-apis-overview) from the specified URLs.
    * The URLs are specified using an environment variable.
    * The names of the JSON files are hardcoded.
2. Converts the downloaded OpenAPI specifications to Postman collections using the [openapi-to-postman](https://github.com/postmanlabs/openapi-to-postman) library.
3. For each converted Postman collection, the app makes the following changes:
    1. Uses a Postman variable named `environment_id` for the `:environment_id` path variable in every request that requires [environment ID](https://kontent.ai/learn/docs/environments#a-get-your-environment-id) in its path.
    2. Uses static base URLs for all requests instead of the `{{baseUrl}}` Postman variable.
    3. Removes extraneous Postman collection variables such as `{{baseUrl}}`.
4. Merges the processed Postman collections into a single collection.

## How to run locally

### Prerequisites

1. NodeJs v18 or higher
2. IDE such as Visual Studio Code

### Instructions

To run the app locally, provide environment variables in the `.env.local` config file.
https://github.com/Kontent-ai-Learn/kontent-ai-learn-oas-postman-converter/blob/8e4dac80ca94bb14728799ddbb68ec4a6897e15a/.env.local.template#L1-L7

By default, the variables are read from environment variables and can be set up in app hosting platforms. The OpenAPI files to use are specified in the `ApiReferenceFileNames` variable.

1. Open the `src\workerScript.ts`.
1. Create a `.env.local` file based on the `.env.local.template` and configure all required settings (e.g., AccessToken, Github user details)
1. In your terminal, run `npm install`.
1. In your terminal, run `npm run build`.
1. In your terminal, run `npm run start`.
1. Make a request to <http://localhost:3000/collection.json>.

## Import generated collection to Postman

To import the generated collection to your locally running Postman:

1. In Postman, choose your workspace.
1. Click **Import**.
1. In the input field, provide a URL to the collection.json file that the app returns.
   * If running locally, the URL is `http://localhost:3000/collection.json`.
   * If deployed publicly, the URL is `https://<domain>/collection.json`.
1. Press **Enter**.

## Adjust what goes in the Postman collection

If you need to adjust the logic behind processing the OpenAPI files and converting them to Postman collections, check the functions in `collectionProcessing.ts`.

In the `convertSpecToPostmanCollection` function, modify the parameters used for the conversion with [openapi-to-postman](https://github.com/postmanlabs/openapi-to-postman).
https://github.com/Kontent-ai-Learn/kontent-ai-learn-oas-postman-converter/blob/8e4dac80ca94bb14728799ddbb68ec4a6897e15a/src/collectionProcessing.ts#L340-L370

In the `processCollection` function, specify how the Postman collection JSON should be modified.
https://github.com/Kontent-ai-Learn/kontent-ai-learn-oas-postman-converter/blob/8e4dac80ca94bb14728799ddbb68ec4a6897e15a/src/collectionProcessing.ts#L293-L338

In the`mergeCollections` function, specify how the processed Postman collections should be merged. For example, this is where we're adding the manually created Postman collection for GraphQL API (see `GRAPHQL_API_COLLECTION`) because GraphQL cannot be described using OpenAPI.
https://github.com/Kontent-ai-Learn/kontent-ai-learn-oas-postman-converter/blob/8e4dac80ca94bb14728799ddbb68ec4a6897e15a/src/collectionProcessing.ts#L372-L385

The order of the API references in the Postman collection: Delivery GraphQL API is followed by the API references ordered as specified in the `ApiReferenceFileNames` env variable.

## How To Contribute

Feel free to open a new issue where you describe your proposed changes or even create a new pull request from your branch with proposed changes.

## Licence

All source code is published under the MIT licence.
