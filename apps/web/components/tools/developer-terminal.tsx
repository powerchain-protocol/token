"use client";

import { useMemo, useState } from "react";

const COMMAND_GROUPS = [
  {
    name: "Workspace",
    commands: [
      { command: "pnpm install", description: "Install and link every workspace package from the repository root." },
      { command: "pnpm preflight", description: "Validate workspace structure, environment profiles, dependencies, and ports." },
      { command: "pnpm workspace:status", description: "Show applications, ports, environment sources, and dependency readiness." },
    ],
  },
  {
    name: "Applications",
    commands: [
      { command: "pnpm dev:web", description: "Start the PowerChain web application on port 3005." },
      { command: "pnpm start:faucet", description: "Start the standalone faucet service on port 3015." },
      { command: "pnpm build:web", description: "Create the production Next.js build." },
    ],
  },
  {
    name: "Programs",
    commands: [
      { command: "pnpm check:programs", description: "Validate PowerPay and run both Rust program test suites." },
      { command: "pnpm test:program:rust", description: "Run native-token Rust unit and adversarial tests." },
      { command: "pnpm test:powerpay", description: "Run the PowerPay payment-state and accounting tests." },
      { command: "pnpm build:program:sbf", description: "Build the native-token program for Solana SBF." },
    ],
  },
  {
    name: "Release",
    commands: [
      { command: "pnpm validate:workspace", description: "Run synchronized profile, route, package, faucet, and metadata validation." },
      { command: "pnpm prepare:release", description: "Regenerate SHA-256 release checksums." },
      { command: "pnpm release:status", description: "Print non-strict release readiness and missing evidence." },
    ],
  },
] as const;

export function DeveloperTerminal() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMMAND_GROUPS;
    return COMMAND_GROUPS.map((group) => ({
      ...group,
      commands: group.commands.filter((item) =>
        `${item.command} ${item.description}`.toLowerCase().includes(normalized),
      ),
    })).filter((group) => group.commands.length > 0);
  }, [query]);

  async function copy(command: string) {
    await navigator.clipboard.writeText(command);
    setCopied(command);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <section className="tool-terminal" aria-label="PowerChain command terminal">
      <div className="tool-terminal-bar">
        <div className="terminal-lights" aria-hidden="true"><i /><i /><i /></div>
        <strong>powerchain@workspace</strong>
        <span>safe command catalog</span>
      </div>
      <div className="tool-terminal-search">
        <label htmlFor="command-filter">Filter commands</label>
        <input
          id="command-filter"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="program, faucet, build, release…"
        />
      </div>
      <div className="command-groups">
        {groups.map((group) => (
          <section key={group.name} className="command-group">
            <h2>{group.name}</h2>
            {group.commands.map((item) => (
              <article key={item.command} className="command-row">
                <div>
                  <code>$ {item.command}</code>
                  <p>{item.description}</p>
                </div>
                <button type="button" onClick={() => copy(item.command)}>
                  {copied === item.command ? "Copied" : "Copy"}
                </button>
              </article>
            ))}
          </section>
        ))}
      </div>
      <p className="terminal-safety-note">
        This interface never executes arbitrary shell input in the browser. Commands are copied for execution in a trusted local terminal.
      </p>
    </section>
  );
}
