// @ts-ignore
import Converter from 'openapi-to-postmanv2';
import {
  MergedCollection,
  PostmanCollection,
  ProcessedPostmanCollection,
  Spec,
} from './types';
import { debugLog } from './utils';

const NEW_COLLECTION_TEMPLATE = {
  info: {
    name: 'Kontent.ai APIs',
    description: '[Kontent.ai](https://kontent.ai/) is a headless CMS that delivers content via API. This lets developers choose how websites and applications should be built, using any frameworks, languages, or libraries they prefer.\n\nBased on your project settings, some APIs might require that you provide an API key in the `Authorization` header.\n\nFind full [API references at Kontent.ai Learn](https://kontent.ai/learn/reference/).',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [],
  variable: [
    {
      key: 'environment_id',
      value: '<Use your environment ID>'
    },
    {
      key: 'managementApiKey',
      value: '<Use your Management API key>'
    },
    {
      key: 'subscriptionApiKey',
      value: '<Use your Subscription API key>'
    },
    {
      key: 'previewApiKey',
      value: '<Use your Delivery Preview API key>'
    },
    {
      key: 'deliveryApiKey',
      value: '<Use your Delivery API key>'
    }
  ],
} as const;

const GRAPHQL_API_COLLECTION = {
  "name": "Delivery GraphQL API",
  "item": [
    {
      "name": "Get published content",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "graphql",
          "graphql": {
            "query": "",
            "variables": ""
          }
        },
        "url": {
          "raw": "https://graphql.kontent.ai/:environment_id",
          "protocol": "https",
          "host": [
            "graphql",
            "kontent",
            "ai"
          ],
          "path": [
            ":environment_id"
          ],
          "variable": [
            {
              "key": "environment_id",
              "value": "{{environment_id}}"
            }
          ]
        },
        "description": "1.  Add your project ID to the Postman environment variable `environment_id` .\n2.  If you're using [secure access](https://kontent.ai/learn/tutorials/develop-apps/build-strong-foundation/restrict-public-access/), add your API key on the Auth tab.\n3.  Switch to the Body tab and [fetch the schema](https://learning.postman.com/docs/sending-requests/supported-api-frameworks/graphql/#introspection-and-importing-graphql-schemas) for your project.\n4.  Start sending [queries](https://kontent.ai/learn/reference/delivery-graphql-api/#a-query-content)."
      },
      "response": [
        {
          "name": "Get a content item",
          "originalRequest": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "graphql"
            },
            "url": {
              "raw": "https://graphql.kontent.ai/:environment_id",
              "protocol": "https",
              "host": [
                "graphql",
                "kontent",
                "ai"
              ],
              "path": [
                ":environment_id"
              ],
              "variable": [
                {
                  "key": "environment_id",
                  "value": "<Use your environment ID>"
                }
              ]
            }
          },
          "_postman_previewlanguage": "Text",
          "header": [],
          "cookie": [],
          "body": ""
        },
        {
          "name": "List content items",
          "originalRequest": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "graphql"
            },
            "url": {
              "raw": "https://graphql.kontent.ai/:environment_id",
              "protocol": "https",
              "host": [
                "graphql",
                "kontent",
                "ai"
              ],
              "path": [
                ":environment_id"
              ],
              "variable": [
                {
                  "key": "environment_id",
                  "value": "{{environment_id}}"
                }
              ]
            }
          },
          "_postman_previewlanguage": "Text",
          "header": [],
          "cookie": [],
          "body": ""
        }
      ]
    },
    {
      "name": "Preview latest content",
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [
            {
              "key": "token",
              "value": "{{previewApiKey}}",
              "type": "string"
            },
            {
              "key": "password",
              "value": "{{secureApiKey}}",
              "type": "string"
            }
          ]
        },
        "method": "POST",
        "header": [],
        "body": {
          "mode": "graphql",
          "graphql": {
            "query": "",
            "variables": ""
          }
        },
        "url": {
          "raw": "https://preview-graphql.kontent.ai/:environment_id",
          "protocol": "https",
          "host": [
            "preview-graphql",
            "kontent",
            "ai"
          ],
          "path": [
            ":environment_id"
          ],
          "variable": [
            {
              "key": "environment_id",
              "value": "{{environment_id}}"
            }
          ]
        },
        "description": "1.  Add your project ID and Preview API key to the Postman environment variables `environment_id` and `previewApiKey`.\n2.  Switch to the Body tab and [fetch the schema](https://learning.postman.com/docs/sending-requests/supported-api-frameworks/graphql/#introspection-and-importing-graphql-schemas) for your project's environment.\n3.  Start sending [queries](https://kontent.ai/learn/reference/delivery-graphql-api/#a-query-content)."
      },
      "response": [
        {
          "name": "Get a content item",
          "originalRequest": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "graphql"
            },
            "url": {
              "raw": "https://preview-graphql.kontent.ai/:environment_id",
              "protocol": "https",
              "host": [
                "preview-graphql",
                "kontent",
                "ai"
              ],
              "path": [
                ":environment_id"
              ],
              "variable": [
                {
                  "key": "environment_id",
                  "value": "{{environment_id}}"
                }
              ]
            }
          },
          "_postman_previewlanguage": "Text",
          "header": [],
          "cookie": [],
          "body": ""
        },
        {
          "name": "List content items",
          "originalRequest": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "graphql"
            },
            "url": {
              "raw": "https://preview-graphql.kontent.ai/:environment_id",
              "protocol": "https",
              "host": [
                "preview-graphql",
                "kontent",
                "ai"
              ],
              "path": [
                ":environment_id"
              ],
              "variable": [
                {
                  "key": "environment_id",
                  "value": "{{environment_id}}"
                }
              ]
            }
          },
          "_postman_previewlanguage": "Text",
          "header": [],
          "cookie": [],
          "body": ""
        }
      ]
    }
  ],
  "description": "For guidance on using the Delivery GraphQL API and in-depth explanation of its features, check the full [Delivery GraphQL API reference at Kontent.ai Learn](https://kontent.ai/learn/reference/delivery-graphql-api/)."
} as const;

const ManagementAPI_AUTH = {
  type: 'bearer',
  bearer: [
    {
      key: 'token',
      value: '{{managementApiKey}}',
      type: 'string',
    },
  ],
} as const;

const SubscriptionAPI_AUTH = {
  type: 'bearer',
  bearer: [
    {
      key: 'token',
      value: '{{subscriptionApiKey}}',
      type: 'string',
    },
  ],
} as const;

const NO_AUTH = {
  type: 'noauth',
} as const;

const getBaseUrlFromCollection = (collection: PostmanCollection): string => {
  const variables = collection.variable;
  return (variables.length > 0) && (variables[0].key === 'baseUrl') ? variables[0].value : '';
};

const processCollection = (collection: PostmanCollection): ProcessedPostmanCollection => {
  let processedCollection = Object.assign({}, collection);
  let variables = collection.variable;
  const folders = collection.item;
  const baseUrl = getBaseUrlFromCollection(collection);

  if (variables.length > 0 && variables[0].key === 'baseUrl') {
    processedCollection.variable = [];
  }

  const foldersWithRequests: ReadonlyArray<any> = folders.map((folder: any) => {
    let requests = folder.item;
    if (requests.length > 0) {
      requests.forEach((requestInfo: any) => {
        let requestDefinition = requestInfo.request;
        let responses = requestInfo.response;

        // Use a variable for project ID
        if (requestDefinition.url.variable.length > 0 &&
          requestDefinition.url.variable[0].key === 'environment_id') {
          requestInfo.request.url.variable[0].value = '{{environment_id}}';
        }

        // Use a hardcoded base URL for requests
        if ((requestDefinition.url.host.length > 0) &&
          (requestDefinition.url.host[0] === '{{baseUrl}}')) {
          requestInfo.request.url.host[0] = baseUrl;
        }

        // Use a hardcoded base URL for responses
        responses.forEach((response: any, responseIndex: number) => {
          if ((response.originalRequest.url.host.length > 0) &&
            (response.originalRequest.url.host[0] === '{{baseUrl}}')) {
            requestInfo.response[responseIndex].originalRequest.url.host[0] = baseUrl;
          }
        });
      });
      return folder;
    }
    return null;
  }).filter(Boolean);

  processedCollection.item = foldersWithRequests;
  debugLog('Processed collection for ' + collection.info.name);
  return processedCollection;
};

const convertSpecToPostmanCollection = async (spec: Spec): Promise<PostmanCollection> => {
  return new Promise((resolve, reject) => {
    Converter.convert(
      {
        type: 'string',
        data: spec,
      },
      {
        disableOptionalParameters: true,
        exampleParametersResolution: 'Example',
        folderStrategy: 'Tags',
        includeAuthInfoInExample: true,
        includeDeprecated: false,
        optimizeConversion: false,
        stackLimit: 50,
        requestParametersResolution: 'Schema',
      },
      (err: Error, conversionResult: PostmanCollection) => {
        if (conversionResult.result) {
          const result = conversionResult.output[0].data;
          debugLog(`Converted '${result.info.name}' spec to collection.`);
          resolve(result);
        }
        else {
          debugLog(`Could not convert due to '${conversionResult.reason}'.`);
          reject(err);
        }
      },
    );
  });
};

const mergeCollections = (collections: ReadonlyArray<ProcessedPostmanCollection>): MergedCollection => {
  const folders = collections.map(collection => ({
    name: collection.info.name,
    item: collection.item,
    description: collection.info.description.content,
    auth: collection.info.name.includes('Management API') ? ManagementAPI_AUTH
        : collection.info.name.includes('Subscription API') ? SubscriptionAPI_AUTH
        : NO_AUTH,
    event: [],
  }));
  const mergedCollection = Object.assign({}, NEW_COLLECTION_TEMPLATE, { item: [GRAPHQL_API_COLLECTION, ...folders] });
  debugLog('Merged processed collections');
  return mergedCollection;
};

export const processSpecs = async (specs: ReadonlyArray<Spec>): Promise<MergedCollection> => {
  // 1. Convert OAS specs to Postman collections
  const convertedCollections = await Promise.all(specs.map(convertSpecToPostmanCollection));

  // 2. Process Postman collections
  const processedCollections = convertedCollections.map(processCollection);

  // 3. Merge Postman collections
  const mergedCollection = mergeCollections(processedCollections);

  return mergedCollection;
};
