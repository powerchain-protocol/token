const groups = {
  Development: [
    ["pnpm install:repair", "Repair the workspace and reinstall dependencies"],
    ["pnpm preflight", "Validate source, runtime, dependencies, and ports"],
    ["pnpm dev:web", "Start the Next.js web app on port 3005"],
    ["pnpm dev:faucet", "Start the standalone faucet on port 3015"],
    ["pnpm dev:faucet:debug", "Start the faucet with development-only debug routes"],
    ["pnpm dev:reset", "Clear generated output and repair the workspace"],
    ["pnpm workspace:status", "Show runtime, apps, ports, environments, and dependency state"],
  ],
  Quality: [
    ["pnpm typecheck", "Type-check every TypeScript workspace package"],
    ["pnpm build", "Build every TypeScript workspace package and web app"],
    ["pnpm test", "Run root policy tests and package tests"],
    ["pnpm check:quick", "Run deterministic workspace validation and root tests"],
    ["pnpm check:all", "Run the complete local quality and security gate"],
  ],
  Validation: [
    ["pnpm validate:workspace", "Run all deterministic workspace validators"],
    ["pnpm validate:layout", "Validate canonical apps, packages, programs, and target layout"],
    ["pnpm validate:routing", "Validate application routes, APIs, redirects, and metadata routes"],
    ["pnpm validate:workspace-manifest", "Validate canonical apps, packages, ports, domains, and runtime versions"],
    ["pnpm validate:devnet", "Validate the devnet environment profile"],
    ["pnpm validate:production", "Validate the production environment profile"],
  ],
  Programs: [
    ["pnpm programs:doctor", "Check Rust availability without running tests"],
    ["pnpm test:program:rust", "Run native-token Rust tests"],
    ["pnpm build:program:sbf", "Build the native-token Solana SBF program"],
    ["pnpm test:powerpay", "Run PowerPay Rust tests"],
    ["pnpm build:powerpay", "Build the PowerPay Solana SBF program"],
  ],
  Devnet: [
    ["pnpm env:bootstrap:devnet", "Create the root devnet profile from the committed template"],
    ["pnpm check:devnet-token", "Validate the devnet and tPWRC profile"],
    ["pnpm verify:onchain:devnet", "Verify the configured devnet Token-2022 mint"],
    ["pnpm attest:supply:devnet", "Write a finalized devnet supply attestation"],
  ],
  Release: [
    ["pnpm metadata:check", "Generate and validate token metadata"],
    ["pnpm prepare:release", "Generate release checksums"],
    ["pnpm release:status", "Generate a non-strict release report"],
    ["pnpm release:gate", "Run the evidence-driven production release gate"],
  ],
};

for (const [group, commands] of Object.entries(groups)) {
  console.log(`\n${group}`);
  for (const [command, description] of commands) console.log(`  ${command.padEnd(38)} ${description}`);
}
