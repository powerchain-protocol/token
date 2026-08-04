"use client";

import { getMint } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import {
  APPROVED_PWRC_MINT,
  APPROVED_PWRC_MINT_ADDRESS,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "../lib/constants";
import { Card } from "./ui/card";

export function MintAccount() {
  const { connection } = useConnection();
  const [status, setStatus] = useState<"checking" | "verified" | "error">("checking");
  const [detail, setDetail] = useState("Verifying canonical mint account…");

  const verify = useCallback(async () => {
    setStatus("checking");
    try {
      const account = await connection.getAccountInfo(APPROVED_PWRC_MINT, "confirmed");
      if (!account) throw new Error("The approved PWRC mint account was not found.");
      if (account.owner.toBase58() !== TOKEN_2022_PROGRAM_ADDRESS) {
        throw new Error("The approved mint is not owned by SPL Token-2022.");
      }
      const mint = await getMint(connection, APPROVED_PWRC_MINT, "confirmed", account.owner);
      if (mint.decimals !== 9) throw new Error(`Unexpected mint decimals: ${mint.decimals}.`);
      setStatus("verified");
      setDetail(`Verified at confirmed commitment · Supply ${mint.supply.toString()} base units`);
    } catch (error) {
      setStatus("error");
      setDetail(error instanceof Error ? error.message : "Mint verification failed.");
    }
  }, [connection]);

  useEffect(() => { void verify(); }, [verify]);

  return (
    <Card className="mint-account-card">
      <div>
        <span className="eyebrow">Mainnet mint account</span>
        <h3>Canonical PWRC</h3>
        <code>{APPROVED_PWRC_MINT_ADDRESS}</code>
      </div>
      <div className="mint-account-status">
        <span className={`status-pill ${status === "verified" ? "verified" : "pending"}`}>{status}</span>
        <p>{detail}</p>
        <button className="secondary-button" type="button" onClick={() => void verify()}>Verify again</button>
      </div>
    </Card>
  );
}
