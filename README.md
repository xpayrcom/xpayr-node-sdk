# XPayr Node.js SDK

[![CI](https://github.com/xpayrcom/xpayr-node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/xpayrcom/xpayr-node-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](LICENSE)

Official Node.js SDK for creating XPayr payment sessions, verifying webhooks, and integrating direct-to-wallet crypto checkout.

> **Status:** Developer preview · v0.1

## Purpose

A small, dependency-light Node.js client for XPayr Merchant API v1 with typed declarations and secure webhook helpers.

## Included

- Payment, merchant, network, and webhook API methods
- Typed errors and configurable request timeouts
- Constant-time HMAC-SHA256 webhook verification

## Quick start

```bash
npm install @xpayr/node-sdk
```

For repository development:

```bash
npm ci
npm test
```

Use an XPayr test key before live credentials. Never expose `sk_test_*`, `sk_live_*`, agent keys, webhook secrets, or wallet private keys in browser code or commits.

## Usage

```js
import { XPayrClient, constructWebhookEvent } from "@xpayr/node-sdk";

const xpayr = new XPayrClient({ secretKey: process.env.XPAYR_SECRET_KEY });
const session = await xpayr.createPayment({
  amount: "49.90",
  currency: "USDC",
  network: "bsc-testnet",
  order_id: "ORDER-1001",
});

console.log(session.payment_url);

// In your webhook route, pass the untouched raw request body.
const event = constructWebhookEvent(rawBody, signatureHeader, process.env.XPAYR_WEBHOOK_SECRET);
```

## Documentation

- [Developer Hub](https://xpayr.com/developers)
- [Merchant API documentation](https://xpayr.com/doc-api)
- [Testnet checkout guide](https://xpayr.com/developers/testnet-checkout-api)
- [Webhook signature guide](https://xpayr.com/developers/webhook-signature-guide)

## Security

Read [SECURITY.md](SECURITY.md) before reporting a vulnerability. Payment completion must be based on verified XPayr webhook/API state and canonical on-chain evidence, not browser callbacks alone.

## License

MIT. See [LICENSE](LICENSE).
