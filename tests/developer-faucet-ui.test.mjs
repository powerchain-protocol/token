import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("developer page uses Radix icons and a featured dark-green card", () => {
  const page = read("apps/web/app/developers/page.tsx");
  const pkg = JSON.parse(read("apps/web/package.json"));
  assert.equal(pkg.dependencies["@radix-ui/react-icons"], "^1.3.2");
  assert.match(page, /@radix-ui\/react-icons/);
  assert.match(page, /developer-card--featured/);
  assert.match(page, /developer-mini-hero/);
});

test("faucet cards align their actions and hero preserves the desktop coin ceiling", () => {
  const faucet = read("apps/web/components/faucet-interface.tsx");
  const css = read("apps/web/app/globals.css");
  assert.match(faucet, /faucet-card-content/);
  assert.match(faucet, /faucet-card-action/);
  assert.match(css, /\.faucet-card-action\{margin-top:auto/);
  assert.match(css, /width:clamp\(210px,20vw,250px\)/);
});
