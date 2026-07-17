import crypto from "node:crypto";

export function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  if (!secret) throw new TypeError("webhook secret is required");
  const received = String(signatureHeader ?? "").replace(/^sha256=/i, "").trim();
  if (!/^[a-f0-9]{64}$/i.test(received)) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(received, "hex"), Buffer.from(expected, "hex"));
}

export function constructWebhookEvent(rawBody, signatureHeader, secret) {
  if (!verifyWebhookSignature(rawBody, signatureHeader, secret)) {
    throw new Error("Invalid XPayr webhook signature");
  }
  return JSON.parse(Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody));
}
