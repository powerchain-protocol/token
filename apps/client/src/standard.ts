import { PPAY_001, PTK_001, type StandardId } from "@powerchain/standards";

export interface PowerChainStandardSummary {
  readonly id: StandardId;
  readonly version: string;
  readonly status: string;
  readonly documentationUrl: string;
}

export function listPowerChainStandards(): readonly PowerChainStandardSummary[] {
  return Object.freeze([
    Object.freeze({ id: PTK_001.id, version: PTK_001.version, status: PTK_001.status, documentationUrl: PTK_001.links.standard }),
    Object.freeze({ id: PPAY_001.id, version: PPAY_001.version, status: PPAY_001.status, documentationUrl: PPAY_001.domains.documentation }),
  ]);
}

export function getPowerChainStandard(id: StandardId) {
  return id === "PTK-001" ? PTK_001 : PPAY_001;
}
