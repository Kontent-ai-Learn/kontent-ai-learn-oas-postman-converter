import { processSpecs } from './collectionProcessing';
import { fetchSpecFiles } from './fetchSpecFiles';
import {
  debugLog,
  prettyPrint,
} from './utils';

const blobFolderUrl = process.env.BlobFolderUrl;

const main = async () => {
  debugLog(`Blob folder Url is '${blobFolderUrl}'.`);

  const OAS_SPECS_FILE_NAMES = [
    'delivery_api.json',
    'management_api_v1.json',
    'management_api_v2.json',
    'smart_recommendations_api.json',
  ];

  const fileUrls = OAS_SPECS_FILE_NAMES.map(fileName => {
    return `${blobFolderUrl}${fileName}`;
  });

  const specs = await fetchSpecFiles(fileUrls);
  const collection = await processSpecs(specs);

  prettyPrint(collection);
};

main();
