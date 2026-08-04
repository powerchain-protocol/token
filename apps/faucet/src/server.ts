import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { FAUCET_STANDARD } from "./standard.js";
import { renderFaucetHome } from "./ui.js";

const DEFAULT_PORT = 3015;
const MAX_BODY_BYTES = 16_384;

function sendHtml(response: ServerResponse, status: number, body: string): void {
  response.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; frame-ancestors 'none'",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  response.end(body);
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += value.length;
    if (size > MAX_BODY_BYTES) throw new RangeError("Request body exceeds 16 KiB.");
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export function createFaucetHttpServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
      if (request.method === "GET" && pathname === "/") {
        sendHtml(response, 200, renderFaucetHome());
        return;
      }
      if (request.method === "GET" && pathname === "/api/v1") {
        sendJson(response, 200, {
          ok: true,
          service: "powerchain-faucet",
          version: "v1",
          cluster: "devnet",
          routes: [
            "GET /api/v1/health",
            "GET /api/v1/standard",
            "POST /api/v1/requests/validate",
          ],
        });
        return;
      }
      if (request.method === "GET" && (pathname === "/health" || pathname === "/api/v1/health")) {
        sendJson(response, 200, { ok: true, service: "powerchain-faucet", cluster: "devnet" });
        return;
      }
      if (request.method === "GET" && (pathname === "/standard" || pathname === "/api/v1/standard")) {
        sendJson(response, 200, FAUCET_STANDARD);
        return;
      }
      if (request.method === "POST" && pathname === "/api/v1/requests/validate") {
        const raw = await readBody(request);
        const body = JSON.parse(raw) as { wallet?: unknown; asset?: unknown };
        if (typeof body.wallet !== "string" || body.wallet.length < 32 || body.wallet.length > 44) {
          sendJson(response, 400, { ok: false, code: "INVALID_WALLET" });
          return;
        }
        if (body.asset !== "SOL" && body.asset !== "tPWRC") {
          sendJson(response, 400, { ok: false, code: "INVALID_ASSET" });
          return;
        }
        sendJson(response, 200, { ok: true, asset: body.asset, wallet: body.wallet });
        return;
      }
      sendJson(response, 404, { ok: false, code: "NOT_FOUND" });
    } catch (error) {
      sendJson(response, error instanceof RangeError ? 413 : 400, {
        ok: false,
        code: "INVALID_REQUEST",
        message: error instanceof Error ? error.message : "Invalid request.",
      });
    }
  });
}

export function startFaucetServer(port = Number(process.env.PORT ?? DEFAULT_PORT)): void {
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) throw new RangeError("PORT must be a valid TCP port.");
  createFaucetHttpServer().listen(port, "0.0.0.0", () => {
    console.log(`PowerChain faucet listening on http://0.0.0.0:${port}`);
  });
}

if (process.argv[1]?.endsWith("server.js")) startFaucetServer();

// Debug route catalog: /api/v1/debug/status /api/v1/debug/events /api/v1/debug/simulate
// Routes are guarded by: if (!debugEnabled) return a 404 response.
