# Kontent.ai OpenAPI to Postman Converter

This application creates a Postman collection for the Kontent.ai APIs. It asks the Kontent.ai API reference build service to generate the OpenAPI specifications, converts them to Postman collections, tweaks the converted collections, and then merges them into a single collection.

## Overview

1. Builds an OpenAPI 3.1 specification for each of the [Kontent.ai APIs](https://kontent.ai/learn/reference/kontent-apis-overview) by calling the API reference build service, once per API reference, in parallel.
    * `POST {ApiReferenceServiceUrl}/{codename}?code={ApiReferenceServiceFunctionKey}` with a JSON body holding the Kontent.ai environment ID, Delivery API key, web link template, and the `isPreview` and `isDebug` flags.
    * The service builds the specification from the content in the given Kontent.ai environment and returns it as `data.openApiJson`.
    * Which API references to build is specified using the `ApiReferenceCodenames` environment variable. A codename is the codename of the API reference content item, for example `delivery_api`.
2. Converts the built OpenAPI specifications to Postman collections using the [openapi-to-postman](https://github.com/postmanlabs/openapi-to-postman) library.
3. For each converted Postman collection, the app makes the following changes:
    1. Uses a Postman variable named `environment_id` for the `:environment_id` path variable in every request that requires [environment ID](https://kontent.ai/learn/docs/environments#a-get-your-environment-id) in its path.
    2. Uses static base URLs for all requests instead of the `{{baseUrl}}` Postman variable.
    3. Removes extraneous Postman collection variables such as `{{baseUrl}}`.
4. Merges the processed Postman collections into a single collection.

## How to run locally

### Prerequisites

1. NodeJs v18 or higher
2. IDE such as Visual Studio Code
3. Access to the Kontent.ai API reference build service (its URL and function key) and to the Kontent.ai environment that holds the API reference content

> [!NOTE]
> `package.json` must keep an `engines.node` entry. Without it, Parcel builds the app for a browser target and replaces every named `process.env.*` read with its build-time value, which breaks configuration at runtime.

### Instructions

To run the app locally, provide environment variables in the `.env.local` config file. By default, the variables are read from environment variables and can be set up in app hosting platforms.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ApiReferenceServiceUrl` | yes | | Host and function path of the API reference build service, without the codename and without the function key. |
| `ApiReferenceServiceFunctionKey` | yes | | **Secret.** Azure Functions key sent as the `code` query string parameter. |
| `ApiReferenceCodenames` | yes | | Comma separated codenames of the API references to build. The order determines the order of the folders in the merged collection. |
| `ApiReferenceKontentEnvironmentId` | yes | | ID of the Kontent.ai environment that holds the API reference content. |
| `ApiReferenceKontentDeliveryApiKey` | yes | | **Secret.** Delivery API key for that environment. |
| `ApiReferenceWebLinkTemplate` | yes | | URL used for links to Kontent.ai Learn in the generated descriptions. |
| `ApiReferenceIsPreview` | no | `false` | Build from preview content instead of published content. |
| `ApiReferenceIsDebug` | no | `false` | Ask the build service for debug output. |
| `ApiReferenceServiceTimeoutMs` | no | `45000` | Timeout of a single build request, in milliseconds. |
| `ApiReferenceServiceRetryCount` | no | `1` | How many times to retry a build request that failed for a transient reason. |
| `PORT` | no | `3000` | Port the Express server listens on. |

1. Create a `.env.local` file based on the `.env.local.template` and fill in the service URL, the function key, the Kontent.ai environment ID and the Delivery API key.
1. In your terminal, run `npm install`.
1. In your terminal, run `npm run build`.
1. In your terminal, run `npm run start`.
1. Make a request to <http://localhost:3000/collection.json>. Building all API references takes roughly 20 seconds.

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

The order of the API references in the Postman collection: Delivery GraphQL API is followed by the API references ordered as specified in the `ApiReferenceCodenames` env variable.

## How To Contribute

Feel free to open a new issue where you describe your proposed changes or even create a new pull request from your branch with proposed changes.

## Licence

All source code is published under the MIT licence.
