import { Spec } from "./types";
import { debugLog } from "./utils";

export interface IApiReferenceServiceConfig {
  /** Host and function path, without the codename and without the function key. */
  readonly serviceUrl: string;
  readonly functionKey: string;
  readonly kontentAiEnvironmentId: string;
  readonly kontentAiDeliveryApiKey: string;
  readonly webLinkTemplate: string;
  readonly isPreview: boolean;
  readonly isDebug: boolean;
  readonly requestTimeoutMs: number;
  readonly retryCount: number;
}

interface IBuildApiReferenceResponse {
  readonly data?: {
    readonly root?: string;
    readonly executionTime?: string;
    readonly warnings?: ReadonlyArray<unknown>;
    readonly openApiJson?: unknown;
  };
  readonly error?: string;
}

// A plain 500 is what the service returns for a missing content item, which retrying won't fix.
const TRANSIENT_STATUS_CODES: ReadonlyArray<number> = [408, 429, 502, 503, 504];
const MAX_ERROR_BODY_LENGTH = 500;

export class ApiReferenceServiceError extends Error {
  constructor(message: string, public readonly isTransient: boolean) {
    super(message);
    this.name = "ApiReferenceServiceError";
  }
}

export class ApiReferenceService {
  constructor(public config: IApiReferenceServiceConfig) {}

  /** Returns the built OpenAPI document as a JSON string, ready for processSpecs. */
  async getApiReferenceSpec(data: { codename: string }): Promise<Spec> {
    const { codename } = data;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.retryCount; attempt++) {
      if (attempt > 0) {
        debugLog(`Retrying '${codename}' (attempt ${attempt + 1}).`);
      }

      try {
        return await this.buildApiReference(codename);
      } catch (error) {
        lastError = error;

        const isTransient =
          error instanceof ApiReferenceServiceError && error.isTransient;

        if (!isTransient || attempt === this.config.retryCount) {
          throw error;
        }

        await delay(1000 * (attempt + 1));
      }
    }

    // Unreachable, the loop either returns or throws.
    throw lastError;
  }

  private async buildApiReference(codename: string): Promise<Spec> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.requestTimeoutMs
    );
    const startedAt = Date.now();

    let response: Response;
    try {
      response = await fetch(this.getRequestUrl(codename), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kontentAiEnvironmentId: this.config.kontentAiEnvironmentId,
          kontentAiDeliveryApiKey: this.config.kontentAiDeliveryApiKey,
          webLinkTemplate: this.config.webLinkTemplate,
          isPreview: this.config.isPreview,
          isDebug: this.config.isDebug,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      const reason = controller.signal.aborted
        ? `timed out after ${this.config.requestTimeoutMs} ms`
        : `failed: ${describeFetchError(error)}`;

      throw new ApiReferenceServiceError(
        `Building the API reference '${codename}' ${reason}.`,
        true
      );
    } finally {
      clearTimeout(timeoutId);
    }

    const rawBody = await response.text();

    if (!response.ok) {
      throw new ApiReferenceServiceError(
        `Building the API reference '${codename}' failed with HTTP ${response.status} ${response.statusText}. Reason: ${extractServiceErrorReason(rawBody)}`,
        TRANSIENT_STATUS_CODES.includes(response.status)
      );
    }

    let parsedBody: IBuildApiReferenceResponse;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      throw new ApiReferenceServiceError(
        `Building the API reference '${codename}' returned a non-JSON response: ${truncate(rawBody)}`,
        false
      );
    }

    const openApiJson = parsedBody.data?.openApiJson;

    if (!openApiJson || typeof openApiJson !== "object") {
      throw new ApiReferenceServiceError(
        `Building the API reference '${codename}' returned no 'data.openApiJson'. Response: ${truncate(rawBody)}`,
        false
      );
    }

    const warnings = parsedBody.data?.warnings ?? [];
    if (warnings.length > 0) {
      debugLog(
        `API reference '${codename}' built with ${warnings.length} warning(s): ${truncate(JSON.stringify(warnings))}`
      );
    }

    debugLog(
      `Built '${codename}' ('${parsedBody.data?.root}') in ${Date.now() - startedAt} ms (service time ${parsedBody.data?.executionTime}).`
    );

    // processSpecs expects a string, openapi-to-postmanv2 only parses strings.
    return JSON.stringify(openApiJson);
  }

  private getRequestUrl(codename: string): string {
    const serviceUrl = this.config.serviceUrl.replace(/\/+$/, "");

    return `${serviceUrl}/${encodeURIComponent(codename)}?code=${encodeURIComponent(this.config.functionKey)}`;
  }
}

/** Node wraps network failures as 'fetch failed', the real reason is in the cause. */
const describeFetchError = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = (error as { cause?: unknown }).cause;

  return cause instanceof Error
    ? `${error.message} (${cause.message})`
    : error.message;
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const truncate = (value: string): string =>
  value.length > MAX_ERROR_BODY_LENGTH
    ? `${value.slice(0, MAX_ERROR_BODY_LENGTH)}...`
    : value;

/** The service reports failures as {"error": "..."}, fall back to the raw body. */
const extractServiceErrorReason = (rawBody: string): string => {
  try {
    const parsedBody = JSON.parse(rawBody) as IBuildApiReferenceResponse;

    return parsedBody.error ?? truncate(rawBody);
  } catch {
    return truncate(rawBody) || "no response body";
  }
};
