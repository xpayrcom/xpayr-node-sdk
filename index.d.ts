export interface XPayrClientOptions {
  secretKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: typeof globalThis.fetch;
}

export interface PaymentSession {
  id: string;
  invoice_id?: number | string;
  amount: string;
  currency: string;
  network: string;
  status: string;
  payment_url: string;
  expires_at?: string;
  livemode?: boolean;
  [key: string]: unknown;
}

export class XPayrError extends Error {
  status: number | null;
  code: string;
  details: unknown;
}

export class XPayrClient {
  constructor(options: XPayrClientOptions);
  health(): Promise<Record<string, unknown>>;
  createPayment(payload: Record<string, unknown>): Promise<PaymentSession>;
  listPayments(query?: Record<string, string | number | undefined>): Promise<Record<string, unknown>>;
  getPayment(id: string): Promise<PaymentSession>;
  completePayment(id: string, payload: Record<string, unknown>): Promise<PaymentSession>;
  getMerchant(): Promise<Record<string, unknown>>;
  getBalance(): Promise<Record<string, unknown>>;
  listNetworks(): Promise<Record<string, unknown>>;
  registerWebhook(url: string): Promise<Record<string, unknown>>;
  getWebhook(): Promise<Record<string, unknown>>;
  testWebhook(): Promise<Record<string, unknown>>;
  deleteWebhook(): Promise<Record<string, unknown> | null>;
}

export function verifyWebhookSignature(rawBody: string | Buffer, signatureHeader: string, secret: string): boolean;
export function constructWebhookEvent(rawBody: string | Buffer, signatureHeader: string, secret: string): Record<string, unknown>;
