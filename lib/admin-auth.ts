import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_AGE_SECONDS = 60 * 60 * 24;

function getSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

export function createAdminToken() {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidAdminToken(token: string | undefined) {
  if (!token || !getSecret()) return false;
  const [issuedAt, signature] = token.split(".");
  const issued = Number(issuedAt);
  if (!issued || Date.now() / 1000 - issued > MAX_AGE_SECONDS || Date.now() / 1000 - issued < 0) return false;
  const expected = sign(issuedAt);
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}
