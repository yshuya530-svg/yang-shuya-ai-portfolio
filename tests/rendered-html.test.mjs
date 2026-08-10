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
  assert.match(html, /虚拟手机/);
  assert.match(html, /电商用户购买意图识别与转化预测研究/);
  assert.match(html, /\/assets\/profile\/profile-02\.jpg/);
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
  assert.equal(mediaFiles.length, 43);
  assert.match(page, /前端虚拟模拟/);
  assert.match(page, /lxyg0228/);
  assert.match(page, /github\.com\/yshuya530-svg\/EcomLens-AI/);
  assert.doesNotMatch(page, /yang-shuya-resume\.pdf|保密项目/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /privacy-soft/);
  assert.match(layout, /Shay｜FDE、AI 应用交付与前端 UI 作品集/);
});
