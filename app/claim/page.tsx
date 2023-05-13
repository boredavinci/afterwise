"use client";
import Safe, {
  EthersAdapter,
  SwapOwnerTxParams,
} from "@safe-global/protocol-kit";
import { Contract, ethers } from "ethers";
import { useSigner } from "wagmi";
import CustomModule from "@/constants/CustomModule.json";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Dashboard() {
  const { data: signer } = useSigner();
  const [safeToClaim, setSafeToClaim] = useState<string>("");

  const handleClaimSafe = async () => {
    // 1. Generate the data to change owner
    const beneficiary = signer;

    if (!beneficiary) {
      return;
    }

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: beneficiary,
    });

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeToClaim,
    });

    const ownerAddresses = await safeSdk.getOwners();

    const params: SwapOwnerTxParams = {
      oldOwnerAddress: ownerAddresses[0],
      newOwnerAddress: await beneficiary.getAddress(),
    };
    const changeOwnerTx = await safeSdk.createSwapOwnerTx(params);

    // 2. Call module.claimSafe with the data
    const moduleAddresses = await safeSdk.getModules();

    const moduleContract = new Contract(
      moduleAddresses[0],
      CustomModule.abi,
      beneficiary
    );

    console.log("Claiming safe...");
    const tx = await moduleContract.claimSafe(changeOwnerTx.data.data);
    await tx.wait();
    console.log("Claimed safe!");
  };

  return (
    <div className=" items-center px-5 py-12 lg:px-20">
      <div className="flex flex-col w-full max-w-3xl p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-white rounded-lg md:mt-0">
        <article className="prose">
          <h1 className="mb-2 align-center">Claim</h1>
        </article>
        <form className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Vault Owner</span>
            </label>
            <ConnectButton />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Safe Address</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={safeToClaim}
              onChange={(event) => setSafeToClaim(event.target.value)}
            />
          </div>
          <div className="form-control">
            <button
              disabled={!safeToClaim}
              type="submit"
              onClick={async (event) => {
                event.preventDefault();
                handleClaimSafe();
              }}
              className="btn btn-primary"
            >
              Claim Safe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
