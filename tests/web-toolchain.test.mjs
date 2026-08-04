import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

test("web package freezes React, Next, Solana and JSX typings", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "apps/web/package.json"), "utf8"));
  const tsconfig = JSON.parse(fs.readFileSync(path.join(root, "apps/web/tsconfig.json"), "utf8"));
  for (const dep of ["next", "react", "react-dom", "@solana/web3.js", "@solana/wallet-adapter-react", "tweetnacl"]) {
    assert.ok(pkg.dependencies[dep], dep);
  }
  for (const dep of ["@types/node", "@types/react", "@types/react-dom"]) assert.ok(pkg.devDependencies[dep], dep);
  assert.deepEqual(tsconfig.compilerOptions.types, ["node", "react", "react-dom"]);
});

test("web uses only the plain ESM Next config", () => {
  assert.equal(fs.existsSync(path.join(root, "apps/web/next.config.ts")), false);
  assert.equal(fs.existsSync(path.join(root, "apps/web/next.config.mjs")), true);
});
