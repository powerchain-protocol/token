import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("developer terminal is catalog-only and never executes arbitrary input", () => {
  const terminal = read("apps/web/components/tools/developer-terminal.tsx");
  const route = read("apps/web/app/api/v1/tools/terminal/route.ts");
  assert.match(terminal, /never executes arbitrary shell input/i);
  assert.match(route, /executionEnabled:\s*false/);
  assert.doesNotMatch(route, /child_process|exec\(|spawn\(/);
});

test("program testing UI covers native-token and PowerPay", () => {
  const consoleSource = read("apps/web/components/tools/program-test-console.tsx");
  assert.match(consoleSource, /programs\/native-token/);
  assert.match(consoleSource, /programs\/powerpay/);
  assert.match(consoleSource, /test:program:rust/);
  assert.match(consoleSource, /test:powerpay/);
});

test("standalone faucet is under apps and uses canonical port", () => {
  assert.equal(fs.existsSync(path.join(root, "apps/faucet")), true);
  assert.equal(fs.existsSync(path.join(root, "faucets")), false);
  const server = read("apps/faucet/src/server.ts");
  assert.match(server, /DEFAULT_PORT = 3015/);
  assert.match(server, /renderFaucetHome/);
});
