"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomModule from "@/constants/CustomModule.json";
import { useSigner } from "wagmi";
import SafeApiKit from "@safe-global/api-kit";
import Safe, {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";
import { Contract, ContractFactory, Signer, ethers } from "ethers";
import { getUserSafe, initializeSafeAPI } from "@/services/safe";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [address, setAddress] = useState("");
  const [expiryLength, setExpiryLength] = useState(30);
  const { data: signer } = useSigner();
  const [stage, setStage] = useState(0);
  const router = useRouter();

  const deploySafe = async () => {
    // 1. Deploy safe with Safe Core SDK
    const safeOwner = signer!;

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    let safeAddress = await getUserSafe(safeOwner);
    if (safeAddress) {
      console.log("Safe already deployed!", safeAddress);
      return Safe.create({ ethAdapter, safeAddress });
    }

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [await safeOwner.getAddress()],
      threshold: 1,
    };

    console.log("Deploying safe...");
    let safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    console.log("Safe deployed!");

    return safeSdk;
  };

  const deployInheritance = async (safeOwner: Signer) => {
    // 2. Deploy Module somehow
    const contractFactory = new ethers.ContractFactory(
      new ethers.utils.Interface(CustomModule.abi),
      CustomModule.bytecode,
      safeOwner
    );

    console.log("Deploying module...");
    const moduleContract = await contractFactory.deploy();
    console.log("Module deployed!");
    return moduleContract;
  };

  const initInheritance = async (safeSdk: Safe, moduleContract: Contract) => {
    // 3. Init module with Safe Address, beneficiary address and expiration
    console.log("Initializing module...");
    const tx = await moduleContract.init(
      await safeSdk.getAddress(),
      address,
      ethers.BigNumber.from(expiryLength * 24 * 60 * 60)
    );
    await tx.wait();
    console.log("Module initialized!");
  };

  const bindSafeToInheritance = async (
    safeOwner: Signer,
    safeSdk: Safe,
    safeService: SafeApiKit,
    moduleContract: Contract
  ) => {
    // 4. Add module to safe with safe core sdk
    console.log("Adding module to safe...");
    const enableModuleTx = await safeSdk.createEnableModuleTx(
      moduleContract.address
    );
    const safeTxHash = await safeSdk.getTransactionHash(enableModuleTx);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    await safeService.proposeTransaction({
      safeAddress: await safeSdk.getAddress(),
      safeTransactionData: enableModuleTx.data,
      safeTxHash,
      senderAddress: await safeOwner.getAddress(),
      senderSignature: senderSignature.data,
      origin,
    });
    const enableModuleTxResponse = await safeSdk.executeTransaction(
      enableModuleTx
    );
    await enableModuleTxResponse.transactionResponse?.wait();
    console.log("Module added to safe!");
  };

  const handleSafeDeployment = async () => {
    router.push("/dashboard");
    return;
  };

  return (
    <div className=" items-center px-5 py-12 lg:px-20">
      <div className="grid grid-cols-5">
        <div className="col-span-1 h-screen bg-slate-100">
          <ul className="menu p-6 text-base-content steps steps-vertical">
            <li className={`step ${stage >= 0 && "step-primary"}`}>
              Create Safe
            </li>
            <li className={`step ${stage >= 1 && "step-primary"}`}>
              Add Inheritance
            </li>
            <li className={`step ${stage >= 2 && "step-primary"}`}>
              Confirm Inheritance
            </li>
            <li className={`step ${stage >= 3 && "step-primary"}`}>Finish</li>
          </ul>
        </div>
        <div className="col-span-4 h-screen">
          <div className="flex flex-col w-full max-w-3xl p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-white rounded-lg md:mt-0">
            <article className="prose">
              <h1>Vault Creation Process</h1>
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
                  <span className="label-text">Beneficiary Address</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Renewal Period</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={expiryLength}
                  onChange={(event) =>
                    setExpiryLength(Number(event.target.value))
                  }
                >
                  <option disabled selected>
                    Renewal Period
                  </option>
                  <option value={30}>Monthly</option>
                  <option value={90}>Quarterly</option>
                  <option value={180}>Half-Year</option>
                  <option value={365}>Yearly</option>
                </select>
              </div>
              <div className="form-control">
                <button
                  disabled={!address || !expiryLength}
                  type="submit"
                  onClick={async (event) => {
                    event.preventDefault();
                    handleSafeDeployment();
                  }}
                  className="btn btn-primary"
                >
                  Create Create Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
