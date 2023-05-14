"use client";
import { useChainId, useSigner } from "wagmi";
import { ethers } from "ethers";
import { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import { getUserSafe } from "@/services/safe";
import SafeApiKit from "@safe-global/api-kit";
import { useEffect, useState } from "react";

export default function Home() {
  const chainId = useChainId();
  const { data: signer } = useSigner();
  const [safeAddress, setSafeAddress] = useState("");

  useEffect(() => {
    const checkSafeAddress = async () => {
      const safeAddress = await getUserSafe(signer!);
      if (safeAddress) {
        setSafeAddress(safeAddress);
      }
    };

    if (signer) checkSafeAddress();
  }, [signer]);

  const createSafeWallet = async () => {
    if (!signer) {
      console.log("SignIn/ SignUp");
      return;
    }
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeFactory = await SafeFactory.create({
      ethAdapter: ethAdapter,
    });

    const safeService = new SafeApiKit({
      txServiceUrl: "https://safe-transaction-goerli.safe.global",
      ethAdapter,
    });

    const owners = [`${await signer.getAddress()}`];
    const threshold = 1;

    const safeAddress = await getUserSafe(signer);
    console.log(safeAddress);

    const safeAccountConfig = {
      owners,
      threshold,
    };
    console.log(safeAccountConfig);
    // / Will it have gas fees to deploy this safe tx
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

    console.log("Creating and deploying the new safe");

    // / wait for the deployement to be completed
    const newSafeAddress = await safeSdk.getAddress();

    console.log(newSafeAddress);
  };

  return (
    <div
      className="hero min-h-screen"
      style={{ backgroundImage: `url("/bg.jpg")` }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-2xl">
          <p className="mb-6 text-5xl">Trustless Inheritance Vaults</p>
          {safeAddress ? (
            <p>{safeAddress}</p>
          ) : (
            <button className="btn" onClick={createSafeWallet}>
              Create Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
