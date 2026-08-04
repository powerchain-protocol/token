export const PTK_001 = Object.freeze({
  id: "PTK-001",
  version: "1.0.0-rc.0",
  status: "release-candidate",
  asset: Object.freeze({
    name: "PowerChain",
    symbol: "PWRC",
    mint: "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc",
    decimals: 9,
    genesisSupplyTokens: "18446000000",
    genesisSupplyBaseUnits: "18446000000000000000",
    postGenesisMint: false,
  }),
  solana: Object.freeze({
    cluster: "mainnet-beta",
    tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    requiredExtensions: Object.freeze(["TransferFeeConfig", "MetadataPointer", "TokenMetadata"]),
    transferFeeBasisPoints: 250,
    maximumTransferFeeTokens: "1000000",
  }),
  links: Object.freeze({
    documentation: "https://docs.powerchain.energy",
    standard: "https://docs.powerchain.energy/standards/ptk-001",
    explorer: "https://solscan.io/token/PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc",
  }),
} as const);

export type Ptk001Profile = typeof PTK_001;
