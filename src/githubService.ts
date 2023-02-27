import { Octokit } from "octokit";
import { RequestError } from "@octokit/request-error";

export interface IGithubServiceConfig {
  username: string;
  email: string;
  accessToken: string;
  owner: string;
  repository: string;
  branch: string;
}

export class GithubService {
  constructor(public config: IGithubServiceConfig) {}

  async getApiReferenceCode(data: {
    filePath: string;
  }): Promise<string | undefined> {
    const octokit = new Octokit({
      auth: this.config.accessToken,
    });

    try {
      const existingFileResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: this.config.owner,
          repo: this.config.repository,
          path: data.filePath,
          ref: this.config.branch,
        }
      );

      const responseData = existingFileResponse.data as any;

      if (responseData.content) {
        let existingContent = responseData.content;

        // remove line ending
        if (existingContent && existingContent.endsWith("\n")) {
          existingContent = existingContent.substring(
            0,
            existingContent.length - 1
          );
        }

        const existingContentDecoded = Buffer.from(
          existingContent ?? "",
          "base64"
        ).toString();

        return existingContentDecoded;
      }

      return undefined;
    } catch (err) {
      if (err instanceof RequestError && err.status === 404) {
        // file does not yet exists, that's fine
        throw Error(`API reference on path '${data.filePath}' does not exist. Original message: ${err.message}`);
      }

      throw err;
    }
  }
}
