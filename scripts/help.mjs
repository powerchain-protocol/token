const groups = {
  Development: [
    ["pnpm build", "Build every workspace package"],
    ["pnpm typecheck", "Type-check every workspace package"],
    ["pnpm test", "Run Node and package tests"],
    ["pnpm check:quick", "Run fast policy and workspace validation"],
    ["pnpm check:all", "Run the complete local quality gate"],
  ],
  Validation: [
    ["pnpm validate:workspace", "Run all deterministic workspace validators"],
    ["pnpm validate:devnet", "Validate the devnet environment"],
    ["pnpm validate:production", "Validate the production environment"],
    ["pnpm validate:evidence", "Validate release evidence and attestations"],
  ],
  Program: [
    ["pnpm test:program:rust", "Run native-token Rust tests"],
    ["pnpm build:program:sbf", "Build the Pinocchio SBF program"],
    ["pnpm verify:onchain:devnet", "Verify the devnet Token-2022 mint"],
  ],
  Faucet: [
    ["pnpm validate:faucet", "Validate tPWRC faucet policy"],
    ["pnpm check:faucets", "Type-check and test the faucet package"],
  ],
  Release: [
    ["pnpm prepare:release", "Generate release checksums"],
    ["pnpm release:status", "Generate a non-strict release report"],
    ["pnpm release:gate", "Run the production release gate"],
  ],
};

for (const [group, commands] of Object.entries(groups)) {
  console.log(`\n${group}`);
  for (const [command, description] of commands) console.log(`  ${command.padEnd(34)} ${description}`);
}
