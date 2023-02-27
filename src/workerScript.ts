import { processSpecs } from "./collectionProcessing";
import { debugLog, prettify } from "./utils";
import * as dotenv from "dotenv";
import { GithubService } from "./githubService";

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

  const fetchedApiReferences: string[] = [];

  for (const file of processFiles) {
    debugLog(`Fetching file '${file}'`);

    const apiReferenceCode = await githubService.getApiReferenceCode({
      filePath: `${file}`,
    });

    if (apiReferenceCode) {
      fetchedApiReferences.push(apiReferenceCode);
    } else {
      debugLog(`File '${file}' is empty or invalid`);
    }

    debugLog(`Successfully fetched '${file}'`);
  }

  const collection = await processSpecs(fetchedApiReferences);

  return prettify(collection);
};
