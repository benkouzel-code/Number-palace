import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Number Palace shell and social metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Number Palace - Build scenes\. Recall digits\.<\/title>/i);
  assert.match(html, /Lighting the palace lamps/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships the requested game modes and removes the starter preview", async () => {
  const [game, packageJson] = await Promise.all([
    readFile(new URL("../app/NumberPalaceGame.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(game, /number-palace-v1/);
  assert.match(
    game,
    /const ROLE_PATTERN: WordRole\[\] = \["noun", "adjective", "verb"\]/,
  );
  assert.match(game, /Hercules/);
  assert.match(game, /Cthulhu/);
  assert.match(game, /Robin Hood/);
  assert.match(game, /Number by number/);
  assert.match(game, /Whole sequence/);
  assert.match(game, /Tier 1/);
  assert.match(game, /Tier 2/);
  assert.match(game, /Tier 3/);
  assert.match(game, /Sequence names must be unique/);
  assert.match(game, /How would you like to recall it\?/);
  assert.doesNotMatch(game, /How do you want to walk it\?/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("../app/_sites-preview", import.meta.url)),
  );
});
