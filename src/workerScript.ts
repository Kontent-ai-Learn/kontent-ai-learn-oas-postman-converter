import {processSpecs} from './collectionProcessing';
import {fetchSpecFiles} from './fetchSpecFiles';
import {debugLog, prettify,} from './utils';

const blobFolderUrl = process.env.BlobFolderUrl;

export const work = async () => {
  debugLog(`Blob folder Url is '${blobFolderUrl}'.`);

  const OAS_SPECS_FILE_NAMES = [
    'delivery_api.json',
    'management_api_v2.json',
    'subscription_api.json',
    'sync_api.json'
  ];

  const fileUrls = OAS_SPECS_FILE_NAMES.map(fileName => {
    return `${blobFolderUrl}${fileName}`;
  });

  try {
    const specs = await fetchSpecFiles(fileUrls);
    const collection = await processSpecs(specs);

    return prettify(collection);
  } catch (error) {
    return prettify(error);
  }
};
