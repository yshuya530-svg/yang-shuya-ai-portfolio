import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Shay portfolio content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<strong>Shay<\/strong>/);
  assert.match(html, /ECOMLENS AI/);
  assert.match(html, /AI 交付负责角色设定/);
  assert.match(html, /原平台 \+ 内容账号累计关注/);
  assert.match(html, /哪些购买前行为/);
  assert.match(html, /\/assets\/profile\/profile-01\.jpg/);
  assert.match(html, /\/assets\/ecomlens\/ecomlens-demo\.mp4/);
  assert.doesNotMatch(html, /yang-shuya-resume\.pdf|保密项目/);
});

test("keeps all approved portfolio assets and public boundaries", async () => {
  const [page, css, layout, assetFiles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readdir(new URL("../public/assets/", import.meta.url), { recursive: true }),
  ]);

  const mediaFiles = assetFiles.filter((file) => /\.(?:jpg|png|mp4)$/i.test(file));
  const referencedAssets = new Set(page.match(/\/assets\/[^"]+/g) ?? []);
  assert.equal(mediaFiles.length, 49);
  assert.equal(referencedAssets.size, 45);
  assert.doesNotMatch(page, /agent-06-world-alt\.jpg|agent-07-player-alt\.jpg|agent-09-transfer-alt\.jpg/);
  assert.match(page, /school-16-shay-shooting\.jpg/);
  assert.match(page, /FoldText/);
  assert.match(page, /界面模拟/);
  assert.match(page, /lxyg0228/);
  assert.match(page, /github\.com\/yshuya530-svg\/EcomLens-AI/);
  assert.doesNotMatch(page, /yang-shuya-resume\.pdf|保密项目/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(page, /school-08\.jpg|sensitive|模糊|柔化/);
  assert.match(layout, /Shay｜个人简历网站/);
});
