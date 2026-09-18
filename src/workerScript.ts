import { processSpecs } from "./collectionProcessing";
import { debugLog, prettify } from "./utils";
import * as dotenv from "dotenv";
import {
  ApiReferenceService,
  IApiReferenceServiceConfig,
} from "./apiReferenceService";

// needed to load .env environment to current process when run via package.json script
dotenv.config({
  path: "./.env.local",
});

// The slowest measured build (management_api_v2) takes about 16 seconds.
const DEFAULT_REQUEST_TIMEOUT_MS = 45000;
const DEFAULT_RETRY_COUNT = 1;

interface IWorkerConfig {
  readonly service: IApiReferenceServiceConfig;
  readonly codenames: ReadonlyArray<string>;
}

const getRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw Error(
      `Invalid API reference config: environment variable '${name}' is not set.`
    );
  }

  return value;
};

const getBooleanEnv = (name: string, fallback: boolean): boolean => {
  const value = process.env[name]?.trim().toLowerCase();

  if (!value) {
    return fallback;
  }

  return value === "true" || value === "1";
};

const getNumberEnv = (name: string, fallback: number): number => {
  const value = Number(process.env[name]?.trim());

  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const createConfig = (): IWorkerConfig => {
  const codenames = getRequiredEnv("ApiReferenceCodenames")
    .split(",")
    .map((codename) => codename.trim())
    .filter((codename) => codename.length > 0);

  if (codenames.length === 0) {
    throw Error(
      `Invalid API reference config: 'ApiReferenceCodenames' must be a comma separated list of API reference codenames.`
    );
  }

  return {
    codenames: codenames,
    service: {
      serviceUrl: getRequiredEnv("ApiReferenceServiceUrl"),
      functionKey: getRequiredEnv("ApiReferenceServiceFunctionKey"),
      kontentAiEnvironmentId: getRequiredEnv("ApiReferenceKontentEnvironmentId"),
      kontentAiDeliveryApiKey: getRequiredEnv(
        "ApiReferenceKontentDeliveryApiKey"
      ),
      webLinkTemplate: getRequiredEnv("ApiReferenceWebLinkTemplate"),
      isPreview: getBooleanEnv("ApiReferenceIsPreview", false),
      isDebug: getBooleanEnv("ApiReferenceIsDebug", false),
      requestTimeoutMs: getNumberEnv(
        "ApiReferenceServiceTimeoutMs",
        DEFAULT_REQUEST_TIMEOUT_MS
      ),
      retryCount: getNumberEnv(
        "ApiReferenceServiceRetryCount",
        DEFAULT_RETRY_COUNT
      ),
    },
  };
};

// Validated lazily so a misconfiguration surfaces as a request error instead of
// killing the process while this module is being imported.
let cachedConfig: IWorkerConfig | null = null;

const getConfig = (): IWorkerConfig => {
  if (!cachedConfig) {
    cachedConfig = createConfig();
  }

  return cachedConfig;
};

export const work = async (): Promise<string> => {
  const { service: serviceConfig, codenames } = getConfig();
  const apiReferenceService = new ApiReferenceService(serviceConfig);

  debugLog(
    `Building API references [${codenames.join(", ")}] via '${serviceConfig.serviceUrl}' for environment '${serviceConfig.kontentAiEnvironmentId}'.`
  );

  const specs = await Promise.all(
    codenames.map((codename) =>
      apiReferenceService.getApiReferenceSpec({ codename: codename })
    )
  );

  const collection = await processSpecs(specs);

  return prettify(collection);
};
