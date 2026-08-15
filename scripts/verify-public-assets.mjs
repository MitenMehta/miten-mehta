import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const sitemap = readFileSync("public/sitemap.xml", "utf8");
const headers = readFileSync("public/_headers", "utf8");
const trackingHook = readFileSync("src/hooks/use-tracking-codes.tsx", "utf8");

for (const asset of [
  "public/favicon.svg",
  "public/miten-mehta-photo.jpeg",
  "public/og-miten-mehta.png",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/.well-known/security.txt",
]) {
  assert.ok(existsSync(asset), `missing public asset: ${asset}`);
}

const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(jsonLdMatch, "missing JSON-LD");
JSON.parse(jsonLdMatch[1]);

const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.ok(locations.length > 0, "sitemap has no URLs");
assert.ok(locations.every((location) => location.startsWith("https://mitenmehta.com/")), "sitemap contains another host");

const png = readFileSync("public/og-miten-mehta.png");
assert.equal(png.readUInt32BE(16), 1200, "Open Graph image width must be 1200");
assert.equal(png.readUInt32BE(20), 630, "Open Graph image height must be 630");

for (const forbidden of ["unsafe-eval", "placeholder-supabase", "99.999%", "237 OS Layers verified"]) {
  assert.ok(!html.includes(forbidden), `index contains unsupported value: ${forbidden}`);
  assert.ok(!headers.includes(forbidden), `headers contain unsupported value: ${forbidden}`);
}

assert.ok(!trackingHook.includes("innerHTML"), "tracking hook may not inject HTML");
assert.ok(!trackingHook.includes("createElement('script')"), "tracking hook may not execute database scripts");
assert.ok(!headers.includes("agents.orchestraios.com"), "browser CSP must use the same-origin agent gateway");

console.log(`public asset verification passed (${locations.length} sitemap URLs)`);
