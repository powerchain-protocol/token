import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("web app declares and isolates Web3 Icons", () => {
  const pkg = JSON.parse(read("apps/web/package.json"));
  assert.match(pkg.dependencies["@web3icons/react"], /^\^4\./);
  const wrapper = read("apps/web/components/web3-icon.tsx");
  assert.match(wrapper, /@web3icons\/react\/dynamic/);
  assert.match(wrapper, /fallback/);
});

test("brand lockup and mobile layout remain canonical", () => {
  const logo = read("apps/web/components/logo.tsx");
  const hero = read("apps/web/components/hero.tsx");
  const css = read("apps/web/app/globals.css");
  assert.match(logo, /<span>Power<\/span><b>Chain<\/b>/);
  assert.doesNotMatch(hero, /<Logo/);
  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /@media\(max-width:620px\)/);
});
