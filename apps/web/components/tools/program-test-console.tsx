"use client";

import { CheckCircledIcon, CodeIcon, CubeIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const PROGRAMS = [
  {
    name: "PWRC Native Token",
    standard: "PTK-001",
    path: "programs/native-token",
    network: "Solana · Token-2022",
    status: "Source profile validated",
    commands: ["pnpm test:program:rust", "pnpm build:program:sbf", "pnpm verify:onchain:devnet"],
    checks: ["Frozen monetary constants", "Authority and signer validation", "Token-2022 CPI boundaries", "Replay and lifecycle protection"],
    boundaries: ["Program ID: deployment-specific", "Mint identity: canonical PWRC", "Upgrade authority: governance controlled"],
  },
  {
    name: "PowerPay",
    standard: "PPAY-001",
    path: "programs/powerpay",
    network: "Solana · Payment settlement",
    status: "Source profile validated",
    commands: ["pnpm validate:powerpay", "pnpm test:powerpay", "pnpm build:powerpay"],
    checks: ["SOL, USDC, and PWRC decimals", "Payer and merchant role enforcement", "Checked service-fee accounting", "Settlement and refund state machine"],
    boundaries: ["Program ID: TBA", "Execution: wallet signed", "Production authority: multisig + timelock"],
  },
] as const;

export function ProgramTestConsole() {
  const [selected, setSelected] = useState(0);
  const program = PROGRAMS[selected] ?? PROGRAMS[0];

  return (
    <section className="program-console">
      <div className="program-tabs" role="tablist" aria-label="Program selection">
        {PROGRAMS.map((item, index) => (
          <button key={item.standard} type="button" role="tab" aria-selected={selected === index} onClick={() => setSelected(index)}>
            <span>{item.standard}</span>
            <strong>{item.name}</strong>
            <small>{item.network}</small>
          </button>
        ))}
      </div>

      <article className="program-panel">
        <header>
          <div>
            <span className="eyebrow">{program.standard}</span>
            <h2>{program.name}</h2>
            <p>{program.network}</p>
          </div>
          <code>{program.path}</code>
        </header>

        <div className="program-summary-strip">
          <span><CheckCircledIcon /> {program.status}</span>
          <span><LockClosedIcon /> Fail-closed production gates</span>
          <span><CubeIcon /> Root Cargo workspace</span>
        </div>

        <div className="program-panel-grid">
          <div>
            <h3><LockClosedIcon /> Security and conformance</h3>
            <ul>{program.checks.map((check) => <li key={check}>{check}</li>)}</ul>
          </div>
          <div>
            <h3><CodeIcon /> Test and build commands</h3>
            <div className="program-command-list">{program.commands.map((command) => <code key={command}>$ {command}</code>)}</div>
          </div>
        </div>

        <div className="program-boundaries">
          {program.boundaries.map((boundary) => <span key={boundary}>{boundary}</span>)}
        </div>

        <footer>
          <span className="status-pill verified">Source validated</span>
          <p>Deployment remains evidence-driven. Source checks do not imply a mainnet deployment, audit completion, or production readiness.</p>
        </footer>
      </article>
    </section>
  );
}
