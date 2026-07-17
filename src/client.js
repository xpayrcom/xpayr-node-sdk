import { XPayrError } from "./errors.js";

const DEFAULT_BASE_URL = "https://xpayr.com/api/v1";

function queryString(query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}

export class XPayrClient {
  constructor({ secretKey, baseUrl = DEFAULT_BASE_URL, timeoutMs = 20_000, fetch: fetchImpl = globalThis.fetch } = {}) {
    if (!secretKey || typeof secretKey !== "string") throw new TypeError("secretKey is required");
    if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required");
    this.secretKey = secretKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.timeoutMs = timeoutMs;
    this.fetch = fetchImpl;
  }

  async request(method, path, { body, query, headers = {}, authenticated = true } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const requestHeaders = { Accept: "application/json", ...headers };
    if (authenticated) requestHeaders.Authorization = `Bearer ${this.secretKey}`;
    if (body !== undefined) requestHeaders["Content-Type"] = "application/json";

    try {
      const response = await this.fetch(`${this.baseUrl}${path}${queryString(query)}`, {
        method,
        headers: requestHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await response.text();
      let payload = null;
      if (text) {
        try { payload = JSON.parse(text); } catch { payload = { raw: text }; }
      }
      if (!response.ok) {
        const apiError = payload?.error ?? {};
        throw new XPayrError(apiError.message || `XPayr API request failed with status ${response.status}`, {
          status: response.status,
          code: apiError.code || "api_error",
          details: payload,
        });
      }
      return payload;
    } catch (error) {
      if (error instanceof XPayrError) throw error;
      if (error?.name === "AbortError") {
        throw new XPayrError(`XPayr API request timed out after ${this.timeoutMs}ms`, { code: "request_timeout", cause: error });
      }
      throw new XPayrError("XPayr API request failed", { code: "network_error", cause: error });
    } finally {
      clearTimeout(timeout);
    }
  }

  health() { return this.request("GET", "/health", { authenticated: false }); }
  createPayment(payload) { return this.request("POST", "/payments", { body: payload }); }
  listPayments(query = {}) { return this.request("GET", "/payments", { query }); }
  getPayment(id) { return this.request("GET", `/payments/${encodeURIComponent(id)}`); }
  completePayment(id, payload) { return this.request("POST", `/payments/${encodeURIComponent(id)}/complete`, { body: payload }); }
  getMerchant() { return this.request("GET", "/me"); }
  getBalance() { return this.request("GET", "/me/balance"); }
  listNetworks() { return this.request("GET", "/me/networks"); }
  registerWebhook(url) { return this.request("POST", "/webhooks", { body: { url } }); }
  getWebhook() { return this.request("GET", "/webhooks"); }
  testWebhook() { return this.request("POST", "/webhooks/test", { body: {} }); }
  deleteWebhook() { return this.request("DELETE", "/webhooks"); }
}
