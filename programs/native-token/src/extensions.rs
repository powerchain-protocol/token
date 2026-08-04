//! Canonical Token-2022 extension policy for the PTK-001 Solana profile.

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ExtensionStage {
    Required,
    Optional,
    Planned,
    Prohibited,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct TokenExtensionPolicy {
    pub name: &'static str,
    pub stage: ExtensionStage,
    pub rationale: &'static str,
}

pub const TOKEN_2022_EXTENSIONS: &[TokenExtensionPolicy] = &[
    TokenExtensionPolicy { name: "MetadataPointer", stage: ExtensionStage::Required, rationale: "Points to canonical on-chain Token-2022 metadata." },
    TokenExtensionPolicy { name: "TokenMetadata", stage: ExtensionStage::Required, rationale: "Stores canonical name, symbol, URI, and PTK-001 fields." },
    TokenExtensionPolicy { name: "TransferFeeConfig", stage: ExtensionStage::Required, rationale: "Canonical PWRC transfers charge 250 basis points (2.50%) with a governance-configured maximum fee." },
    TokenExtensionPolicy { name: "PermanentDelegate", stage: ExtensionStage::Optional, rationale: "May support governance-authorized burns only under audited policy." },
    TokenExtensionPolicy { name: "MintCloseAuthority", stage: ExtensionStage::Optional, rationale: "Allows closure only after mint authority revocation and supply verification." },
    TokenExtensionPolicy { name: "GroupPointer", stage: ExtensionStage::Optional, rationale: "Associates PWRC with the PowerChain asset group." },
    TokenExtensionPolicy { name: "GroupMemberPointer", stage: ExtensionStage::Optional, rationale: "Provides group membership compatibility where required." },
    TokenExtensionPolicy { name: "TransferHook", stage: ExtensionStage::Planned, rationale: "Requires a separately audited hook program and explicit governance activation." },
    TokenExtensionPolicy { name: "ConfidentialTransferMint", stage: ExtensionStage::Planned, rationale: "Requires a privacy and compliance profile before activation." },
    TokenExtensionPolicy { name: "InterestBearingConfig", stage: ExtensionStage::Prohibited, rationale: "PWRC uses fixed units and does not encode rebasing or interest in the mint." },
    TokenExtensionPolicy { name: "NonTransferable", stage: ExtensionStage::Prohibited, rationale: "PWRC is a transferable protocol currency." },
];

pub fn extension_policy(name: &str) -> Option<&'static TokenExtensionPolicy> {
    TOKEN_2022_EXTENSIONS.iter().find(|policy| policy.name == name)
}
