import { processSpecs } from "./collectionProcessing";
import { debugLog, prettify } from "./utils";
import * as dotenv from "dotenv";
import { GithubService } from "./githubService";

interface IApiReferenceFetchResult {
  code: string;
  apiReferenceFile: string;
}

// needed to load .env environment to current process when run via package.json script
dotenv.config({
  path: "./.env.local",
});

const accessToken = process.env.ApiReferenceGhAccessToken;
const branch = process.env.ApiReferenceGhBranch;
const email = process.env.ApiReferenceGhEmail;
const owner = process.env.ApiReferenceGhOwner;
const repository = process.env.ApiReferenceGhRepository;
const username = process.env.ApiReferenceGhUsername;

if (!accessToken) {
  throw Error(`Invalid GH config: access token`);
}

if (!branch) {
  throw Error(`Invalid GH config: branch`);
}

if (!email) {
  throw Error(`Invalid GH config: email`);
}

if (!owner) {
  throw Error(`Invalid GH config: owner`);
}
if (!repository) {
  throw Error(`Invalid GH config: repository`);
}

if (!username) {
  throw Error(`Invalid GH config: username`);
}

const githubService = new GithubService({
  accessToken: accessToken,
  branch: branch,
  email: email,
  owner: owner,
  repository: repository,
  username: username,
});

const apiReferenceFileNames = process.env.ApiReferenceFileNames;
if (!apiReferenceFileNames) {
  throw Error(
    `Invalid API reference file names. Expected comma separated string with names of API reference files.`
  );
}

const processFiles: string[] = apiReferenceFileNames
  .split(",")
  .map((m) => m.trim());

export const work = async () => {
  debugLog(
    `Accessing GitHub: '${owner}/${repository}@${branch}' with user '${username}(${email})'`
  );

  const fetchedApiReferences: IApiReferenceFetchResult[] = [];

  const fetchPromises: Promise<void>[] = [];
  for (const file of processFiles) {
    debugLog(`Fetching file '${file}'`);

    fetchPromises.push(
      githubService
        .getApiReferenceCode({
          filePath: `${file}`,
        })
        .then((apiReferenceCode) => {
          if (apiReferenceCode) {
            fetchedApiReferences.push({
              code: apiReferenceCode,
              apiReferenceFile: file,
            });
          } else {
            debugLog(`File '${file}' is empty or invalid`);
          }

          debugLog(`Successfully fetched '${file}'`);
        })
    );
  }

  await Promise.all(fetchPromises);

  const orderedApiReferences: IApiReferenceFetchResult[] = [];

  for (const filename of processFiles) {
    const fetchedReference = fetchedApiReferences.find(
      (m) =>
        m.apiReferenceFile.toLowerCase().trim() ===
        filename.toLowerCase().trim()
    );

    if (fetchedReference) {
      orderedApiReferences.push(fetchedReference);
    }
  }

  const collection = await processSpecs(
    orderedApiReferences.map((m) => m.code)
  );

  return prettify(collection);
};