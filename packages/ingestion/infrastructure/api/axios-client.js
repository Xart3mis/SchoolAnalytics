import axios from "axios";
import { IHttpClient } from "../../domain/interfaces/http-client.interface.js";
import fs from "node:fs/promises";
import path from "node:path";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getToddleMinRequestIntervalMs() {
  const raw = Number(process.env.TODDLE_API_MIN_INTERVAL_MS ?? 700);
  return Number.isFinite(raw) && raw > 0 ? Math.ceil(raw) : 700;
}

function getToddleMaxRetries() {
  const raw = Number(process.env.TODDLE_API_MAX_RETRIES ?? 3);
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 3;
}

function getToddleRetryBaseDelayMs() {
  const raw = Number(process.env.TODDLE_API_RETRY_BASE_MS ?? 1000);
  return Number.isFinite(raw) && raw > 0 ? Math.ceil(raw) : 1000;
}

function isRetryableAxiosError(error) {
  const status = Number(error?.response?.status);
  return [429, 500, 502, 503, 504].includes(status);
}

function formatRetryError(error) {
  const status = error?.response?.status;
  const message = error?.message ?? String(error);
  return status ? `status=${status} ${message}` : message;
}

function getFilePathForUrl(url) {
  const filename = `${url.split("/").at(-1)}.json`;
  return path.resolve(process.cwd(), "saved_responses", filename);
}

function isContinuationRequest(params = {}) {
  if (!params || typeof params !== "object") return false;

  if (params.cursor || params.after) {
    return true;
  }

  const pageNumber = Number(params.pageNumber);
  return Number.isFinite(pageNumber) && pageNumber > 1;
}

function hasPaginationRequestShape(params = {}) {
  if (!params || typeof params !== "object") return false;

  return (
    Object.prototype.hasOwnProperty.call(params, "cursor") ||
    Object.prototype.hasOwnProperty.call(params, "after") ||
    Object.prototype.hasOwnProperty.call(params, "pageNumber") ||
    Object.prototype.hasOwnProperty.call(params, "pageSize")
  );
}

function hasPaginatedResponseShape(data) {
  if (!data || typeof data !== "object") return false;

  return Boolean(
    data?.pageInfo ||
    data?.response?.pageInfo ||
    data?.data?.pageInfo ||
    data?.meta?.pageInfo ||
    data?.pagination,
  );
}

async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    console.warn(
      "[ingestion] failed reading existing saved response JSON:",
      error,
    );
    return null;
  }
}

function toPaginatedArchive(existing, { url, params }) {
  if (
    existing &&
    typeof existing === "object" &&
    Array.isArray(existing.pages) &&
    existing.__format === "paginated-response-archive"
  ) {
    return existing;
  }

  const archive = {
    __format: "paginated-response-archive",
    endpoint: url,
    startedAt: new Date().toISOString(),
    request: {
      initialParams: { ...(params ?? {}) },
    },
    pages: [],
    latest: null,
  };

  if (existing !== null) {
    archive.pages.push({
      pageNumber: 0,
      savedAt: new Date().toISOString(),
      requestParams: null,
      response: existing,
      migratedFromLegacyFile: true,
    });
    archive.latest = existing;
  }

  return archive;
}

async function saveResponseJson({ url, params, data }) {
  const filePath = getFilePathForUrl(url);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const paginated =
    hasPaginatedResponseShape(data) || hasPaginationRequestShape(params);
  if (!paginated) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`JSON data is saved successfully! endpoint=${url} pages=1`);
    return;
  }

  const continuation = isContinuationRequest(params);
  const existing = continuation ? await readJson(filePath) : null;
  const archive = toPaginatedArchive(existing, { url, params });

  archive.latest = data;
  archive.updatedAt = new Date().toISOString();
  archive.pages.push({
    pageNumber: archive.pages.length + 1,
    savedAt: new Date().toISOString(),
    requestParams: { ...(params ?? {}) },
    response: data,
  });

  await fs.writeFile(filePath, JSON.stringify(archive, null, 2));
  console.log(
    `JSON data is saved successfully! endpoint=${url} pages=${archive.pages.length}`,
  );
}

export class AxiosHttpClient extends IHttpClient {
  static rateLimitChain = Promise.resolve();

  static nextRequestAtMs = 0;

  static rateLimitConfigLogged = false;

  constructor(apiURL, token) {
    super();
    this.minRequestIntervalMs = getToddleMinRequestIntervalMs();
    this.maxRetries = getToddleMaxRetries();
    this.retryBaseDelayMs = getToddleRetryBaseDelayMs();
    this.instance = axios.create({
      baseURL: `${apiURL}/public`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!AxiosHttpClient.rateLimitConfigLogged) {
      AxiosHttpClient.rateLimitConfigLogged = true;
      console.log("[ingestion] Toddle API rate limit", {
        minRequestIntervalMs: this.minRequestIntervalMs,
        maxRetries: this.maxRetries,
        retryBaseDelayMs: this.retryBaseDelayMs,
      });
    }
  }

  async get(url, options = {}) {
    const normalizedOptions =
      options &&
      typeof options === "object" &&
      (Object.prototype.hasOwnProperty.call(options, "headers") ||
        Object.prototype.hasOwnProperty.call(options, "params"))
        ? {
            headers: options.headers ?? {},
            params: options.params ?? {},
          }
        : {
            headers: {},
            params: options ?? {},
          };

    const response = await this.requestWithRetry(url, normalizedOptions);

    // try {
    //   await saveResponseJson({
    //     url,
    //     params: normalizedOptions.params,
    //     data: response.data,
    //   });
    // } catch (error) {
    //   console.error("Error writing file:", error);
    // }

    return response.data;
  }

  async enqueueRateLimitedGet(url, normalizedOptions) {
    const scheduledRequest = AxiosHttpClient.rateLimitChain.then(async () => {
      const now = Date.now();
      const waitMs = Math.max(0, AxiosHttpClient.nextRequestAtMs - now);
      if (waitMs > 0) {
        await sleep(waitMs);
      }

      const startedAt = Date.now();
      AxiosHttpClient.nextRequestAtMs = startedAt + this.minRequestIntervalMs;
      return this.instance.get(url, normalizedOptions);
    });

    // Keep the chain alive even if a request fails so later requests can proceed.
    AxiosHttpClient.rateLimitChain = scheduledRequest.then(
      () => undefined,
      () => undefined,
    );

    return scheduledRequest;
  }

  async requestWithRetry(url, normalizedOptions) {
    let attempt = 0;

    while (true) {
      try {
        return await this.enqueueRateLimitedGet(url, normalizedOptions);
      } catch (error) {
        if (!isRetryableAxiosError(error) || attempt >= this.maxRetries) {
          throw error;
        }

        attempt += 1;
        const backoffMs = this.retryBaseDelayMs * 2 ** (attempt - 1);
        console.warn(
          `[ingestion] retrying Toddle request endpoint=${url} attempt=${attempt}/${this.maxRetries} backoffMs=${backoffMs} error=${formatRetryError(error)}`,
        );
        await sleep(backoffMs);
      }
    }
  }
}
