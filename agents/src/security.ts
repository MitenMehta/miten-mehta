import type { Env } from "./edge_gateway";

export type Principal = { subject: string; scopes: Set<string>; tokenId?: string; consent: Set<string> };
type Claims = { sub?: string; iss?: string; aud?: string | string[]; exp?: number; nbf?: number; scope?: string; scp?: string[]; consent?: string[]; jti?: string };

const decode = (value: string) => Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")), c => c.charCodeAt(0));

export async function authenticate(request: Request, env: Env): Promise<Principal> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new Error("missing bearer token");
  const [encodedHeader, encodedClaims, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedClaims || !encodedSignature) throw new Error("malformed token");
  const header = JSON.parse(new TextDecoder().decode(decode(encodedHeader))) as { alg?: string; kid?: string };
  const claims = JSON.parse(new TextDecoder().decode(decode(encodedClaims))) as Claims;
  if (header.alg !== "RS256" || !header.kid) throw new Error("unsupported token algorithm");
  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!claims.sub || claims.iss !== env.OIDC_ISSUER || !audiences.includes(env.OIDC_AUDIENCE) || !claims.exp || claims.exp <= now || (claims.nbf && claims.nbf > now)) throw new Error("invalid token claims");
  if (claims.jti && await env.AUTH_CACHE.get(`revoked:${claims.jti}`)) throw new Error("revoked token");
  const jwksUrl = env.OIDC_JWKS_URL || `${env.OIDC_ISSUER.replace(/\/$/, "")}/.well-known/jwks.json`;
  const cacheKey = `jwk:${header.kid}`;
  let jwkText = await env.AUTH_CACHE.get(cacheKey);
  if (!jwkText) {
    const response = await fetch(jwksUrl); if (!response.ok) throw new Error("jwks unavailable");
    const body = await response.json() as { keys: Array<JsonWebKey & { kid?: string }> };
    const jwk = body.keys.find(key => key.kid === header.kid); if (!jwk) throw new Error("unknown signing key");
    jwkText = JSON.stringify(jwk); await env.AUTH_CACHE.put(cacheKey, jwkText, { expirationTtl: 300 });
  }
  const key = await crypto.subtle.importKey("jwk", JSON.parse(jwkText), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decode(encodedSignature), new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`));
  if (!valid) throw new Error("invalid signature");
  return { subject: claims.sub, scopes: new Set([...(claims.scope || "").split(/\s+/), ...(claims.scp || [])].filter(Boolean)), consent: new Set(claims.consent || []), tokenId: claims.jti };
}

export function authorize(principal: Principal, scope: string, consent?: string) {
  if (!principal.scopes.has(scope)) throw new Response(JSON.stringify({ code: "FORBIDDEN", message: `Missing scope ${scope}` }), { status: 403, headers: { "content-type": "application/json" } });
  if (consent && !principal.consent.has(consent)) throw new Response(JSON.stringify({ code: "CONSENT_REQUIRED", message: `Consent required for ${consent}` }), { status: 403, headers: { "content-type": "application/json" } });
}
