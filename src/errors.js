export class XPayrError extends Error {
  constructor(message, { status = 0, code = "xpayr_error", details = null, cause } = {}) {
    super(message, { cause });
    this.name = "XPayrError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
