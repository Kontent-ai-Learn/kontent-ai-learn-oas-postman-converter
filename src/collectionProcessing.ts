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
    _postman_id: 'af018e01-c760-4264-8e6e-8e8fd1875760',
    name: 'Kontent REST APIs',
    description: 'The [Kontent REST APIs](https://docs.kontent.ai/reference) are designed so you can retrieve and manage content for any application. They\'re built around the REST principle and return content in JSON. [Kontent by Kentico](https://kontent.ai/) is a cloud-first headless CMS that allows you to use Content as a Service to distribute content to any channel and device.\n\nCertain APIs require that you include the `authorization` header.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [],
  variable: [
    {
      key: 'project_id',
      value: '<insert your Kontent project ID>',
      type: 'string',
    },
    {
      key: 'managementApiKey',
      value: '<insert your Management API key>',
      type: 'string',
    },
  ],
} as const;

const MAPI_AUTH = {
  type: 'bearer',
  bearer: [
    {
      key: 'token',
      value: '{{managementApiKey}}',
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
          requestDefinition.url.variable[0].key === 'project_id') {
          requestInfo.request.url.variable[0].value = '{{project_id}}';
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
        folderStrategy: 'Tags',
        includeAuthInfoInExample: true,
        disableOptionalParameters: true,
        requestParametersResolution: 'Schema',
        exampleParametersResolution: 'Example',
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
    auth: collection.info.name.includes('Management API') ? MAPI_AUTH : NO_AUTH,
    event: [],
  }));
  const mergedCollection = Object.assign({}, NEW_COLLECTION_TEMPLATE, { item: folders });
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
