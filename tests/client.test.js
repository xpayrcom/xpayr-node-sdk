import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { XPayrClient, XPayrError, constructWebhookEvent, verifyWebhookSignature } from "../src/index.js";

test("createPayment sends bearer auth and canonical path", async () => {
  let captured;
  const client = new XPayrClient({
    secretKey: "sk_test_example",
    fetch: async (url, options) => {
      captured = { url, options };
      return new Response(JSON.stringify({ id: "ps_test", payment_url: "https://xpayr.com/pay/ps_test" }), { status: 200 });
    },
  });
  const result = await client.createPayment({ amount: "9.99", currency: "USDC", network: "bsc-testnet" });
  assert.equal(captured.url, "https://xpayr.com/api/v1/payments");
  assert.equal(captured.options.headers.Authorization, "Bearer sk_test_example");
  assert.equal(result.id, "ps_test");
});

test("API errors preserve status and code", async () => {
  const client = new XPayrClient({ secretKey: "sk_test_example", fetch: async () => new Response(JSON.stringify({ error: { code: "validation_error", message: "Bad amount" } }), { status: 422 }) });
  await assert.rejects(() => client.createPayment({}), (error) => error instanceof XPayrError && error.status === 422 && error.code === "validation_error");
});

test("webhook helper verifies raw body with constant-time comparison", () => {
  const body = Buffer.from('{"event":"payment.completed","id":"evt_1"}');
  const signature = crypto.createHmac("sha256", "whsec").update(body).digest("hex");
  assert.equal(verifyWebhookSignature(body, `sha256=${signature}`, "whsec"), true);
  assert.deepEqual(constructWebhookEvent(body, signature, "whsec"), { event: "payment.completed", id: "evt_1" });
  assert.equal(verifyWebhookSignature(body, signature, "different"), false);
});
