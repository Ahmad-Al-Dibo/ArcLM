import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiClientError, createApiClient } from "./client";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ArcLM API client", () => {
  it("reads health successfully", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        status: "ok",
        service: "arclm-web-api",
        version: "0.6.1"
      })
    );
    const client = createApiClient({ fetcher });

    const health = await client.getHealth();

    expect(health.service).toBe("arclm-web-api");
    expect(fetcher).toHaveBeenCalledWith(
      "http://127.0.0.1:8765/api/health",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("binds the default browser fetch to the global object", async () => {
    const fetcher = vi.fn(function (this: typeof globalThis) {
      expect(this).toBe(globalThis);
      return Promise.resolve(
        jsonResponse({
          status: "ok",
          service: "arclm-web-api",
          version: "0.6.1"
        })
      );
    }) as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetcher);
    const client = createApiClient();

    const health = await client.getHealth();

    expect(health.status).toBe("ok");
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("uses backend error messages without fake fallback data", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "internal_error",
            message: "An unexpected server error occurred."
          }
        },
        { status: 500 }
      )
    );
    const client = createApiClient({ fetcher });

    await expect(client.getHealth()).rejects.toMatchObject({
      code: "internal_error",
      message: "An unexpected server error occurred.",
      status: 500
    });
  });

  it("reports disconnected backend", async () => {
    const client = createApiClient({
      fetcher: vi.fn().mockRejectedValue(new TypeError("network failed"))
    });

    await expect(client.getHealth()).rejects.toMatchObject({
      code: "disconnected"
    });
  });

  it("reports timeout", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>((_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });
    });
    const client = createApiClient({ fetcher, timeoutMs: 10 });

    const request = expect(client.getHealth()).rejects.toMatchObject({ code: "timeout" });
    await vi.advanceTimersByTimeAsync(10);

    await request;
  });

  it("reports invalid JSON", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response("not-json", {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );
    const client = createApiClient({ fetcher });

    await expect(client.getHealth()).rejects.toMatchObject({
      code: "invalid_json"
    });
  });

  it("parses environment and capabilities responses", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          arclm_version: "0.6.1",
          python_version: "3.12.10",
          platform: "Windows",
          pytorch_version: "2.5.1+cu121",
          cuda_available: true,
          cuda_runtime: "12.1",
          device_count: 1,
          available_devices: ["cpu", "cuda:0"],
          preferred_device: "cuda:0",
          gpus: [],
          bf16_supported: false
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          training: { single_device: { status: "available", note: "Ready" } },
          evaluation: {},
          inference: {},
          web: { dashboard: { status: "planned", note: "Later" } }
        })
      );
    const client = createApiClient({ fetcher });

    const environment = await client.getEnvironment();
    const capabilities = await client.getCapabilities();

    expect(environment.preferred_device).toBe("cuda:0");
    expect(capabilities.web.dashboard.status).toBe("planned");
  });

  it("supports a custom base URL", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        status: "ok",
        service: "arclm-web-api",
        version: "0.6.1"
      })
    );
    const client = createApiClient({ baseUrl: "http://localhost:9999/", fetcher });

    await client.getHealth();

    expect(fetcher).toHaveBeenCalledWith(
      "http://localhost:9999/api/health",
      expect.any(Object)
    );
  });

  it("exposes a typed client error", () => {
    const error = new ApiClientError("Disconnected", "disconnected");

    expect(error.name).toBe("ApiClientError");
    expect(error.code).toBe("disconnected");
  });

  it("reads a dataset list successfully", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        datasets: [
          {
            dataset_id: "dataset_abc123",
            name: "sample.jsonl",
            format: "jsonl",
            size_bytes: 128
          }
        ],
        count: 1
      })
    );
    const client = createApiClient({ fetcher });

    const response = await client.getDatasets();

    expect(response.datasets[0].name).toBe("sample.jsonl");
    expect(fetcher).toHaveBeenCalledWith(
      "http://127.0.0.1:8765/api/datasets",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("reads an empty dataset list", async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({ datasets: [], count: 0 }));
    const client = createApiClient({ fetcher });

    await expect(client.getDatasets()).resolves.toEqual({ datasets: [], count: 0 });
  });

  it("rejects an invalid dataset list response", async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({ datasets: [{ name: "missing-id" }], count: 1 }));
    const client = createApiClient({ fetcher });

    await expect(client.getDatasets()).rejects.toMatchObject({ code: "invalid_response" });
  });

  it("reads a dataset inspection successfully", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        dataset_id: "dataset_abc123",
        name: "sample.jsonl",
        format: "jsonl",
        size_bytes: 128,
        encoding: "utf-8",
        fields: [
          {
            name: "text",
            type: "string",
            nullable: false,
            observed_in_rows: 1,
            missing_count: 0,
            empty_count: 0
          }
        ],
        preview_rows: [{ row_id: "0", values: { text: "hello" } }],
        statistics: {
          rows_scanned: 1,
          row_count: 1,
          row_count_scope: "exact",
          field_count: 1,
          field_count_scope: "sample",
          invalid_row_count: 0,
          duplicate_count: 0,
          duplicate_scope: "bounded_scan",
          text_lengths: { min: 5, max: 5, average: 5 }
        },
        metadata: {
          scanned_rows: 1,
          preview_rows: 1,
          scan_limit: 10000,
          preview_limit: 20,
          max_field_length: 2000,
          max_fields: 200,
          truncated: false,
          complete: true,
          schema_source: "sample"
        },
        warnings: []
      })
    );
    const client = createApiClient({ fetcher });

    const response = await client.getDatasetInspection("dataset_abc123");

    expect(response.fields[0].name).toBe("text");
    expect(fetcher).toHaveBeenCalledWith(
      "http://127.0.0.1:8765/api/datasets/dataset_abc123/inspection",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("encodes dataset IDs instead of building path requests", async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({ error: { code: "dataset_not_found", message: "Dataset not found." } }, { status: 404 }));
    const client = createApiClient({ fetcher });

    await expect(client.getDatasetInspection("../secret file")).rejects.toMatchObject({ code: "dataset_not_found" });

    expect(fetcher).toHaveBeenCalledWith(
      "http://127.0.0.1:8765/api/datasets/..%2Fsecret%20file/inspection",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("rejects invalid inspection responses", async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({ dataset_id: "dataset_abc123" }));
    const client = createApiClient({ fetcher });

    await expect(client.getDatasetInspection("dataset_abc123")).rejects.toMatchObject({ code: "invalid_response" });
  });
});
