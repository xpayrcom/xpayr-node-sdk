<div align="center">
  <a href="https://xpayr.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://xpayr.com/public/images/xpayr-logo-white.png" />
      <source media="(prefers-color-scheme: light)" srcset="https://xpayr.com/public/images/xpayr-logo-black.png" />
      <img src="https://xpayr.com/public/images/xpayr-logo-white.png" alt="XPayr Official Logo" width="220" />
    </picture>
  </a>
  <p>
    <a href="https://xpayr.com"><img src="https://xpayr.com/partner-badge.php?type=powered_by&theme=dark" alt="Powered by XPayr" height="28" /></a>
    <a href="https://mcp.xpayr.com"><img src="https://img.shields.io/badge/MCP_Portal-mcp.xpayr.com-029bfd?style=for-the-badge" alt="XPayr MCP Portal" height="28" /></a>
    <a href="https://docs.xpayr.com"><img src="https://img.shields.io/badge/Docs-docs.xpayr.com-10b981?style=for-the-badge" alt="XPayr Docs" height="28" /></a>
    <a href="https://www.npmjs.com/package/@xpayr/mcp-server"><img src="https://img.shields.io/npm/v/@xpayr/mcp-server?style=for-the-badge&color=cb3837&label=MCP%20NPM" alt="NPM @xpayr/mcp-server" height="28" /></a>
  </p>
  <p>
    <a href="https://xpayr.com"><b>Official Website</b></a> •
    <a href="https://mcp.xpayr.com"><b>AI &amp; MCP Portal (21 Tools)</b></a> •
    <a href="https://docs.xpayr.com"><b>Developer Docs</b></a> •
    <a href="https://xpayr.com/developers"><b>Developer Hub</b></a> •
    <a href="https://xpayr.com/tools/crypto-payment-fee-calculator"><b>0.5% Fee Calculator</b></a>
  </p>
</div>

---

# XPayr Node.js SDK

[![CI](https://github.com/xpayrcom/xpayr-node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/xpayrcom/xpayr-node-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](LICENSE)

Official Node.js SDK for creating XPayr payment sessions, verifying webhooks, and integrating direct-to-wallet crypto checkout.

> **Status:** Public beta · v0.1.0

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

## Compatibility

- Runtime requirement: Node.js 18 or newer (`package.json` enforces `>=18`)
- Verified in CI on Node.js 18, 20, and 22
- Package ships ESM entry points with bundled TypeScript declarations

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
