import fetch from 'node-fetch';
import { Spec } from './types';
import { debugLog } from './utils';

const fetchSpecFile = async(fileUrl: string): Promise<Spec> => {
  debugLog(`Fetching '${fileUrl}'.`);
  const request = fetch(fileUrl);
  const specContent = await(await request).text();

  return specContent;
}

export const fetchSpecFiles = async(fileUrls: ReadonlyArray<string>): Promise<ReadonlyArray<Spec>> => {
  return await Promise.all(fileUrls.map(fetchSpecFile));
}
