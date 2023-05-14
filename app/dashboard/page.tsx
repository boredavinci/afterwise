/* eslint-disable @next/next/no-img-element */
"use client";
import { getUserSafe, initializeSafeAPI } from "@/services/safe";
import Safe, {
  EthersAdapter,
  SwapOwnerTxParams,
} from "@safe-global/protocol-kit";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { Contract, ethers } from "ethers";
import Link from "next/link";
import { useContract, useSigner } from "wagmi";
import CustomModule from "@/constants/CustomModule.json";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";

export default function Dashboard() {
  const { data: signer } = useSigner();
  const [expiration, setExpiration] = useState<Date>();
  const [expiryLength, setExpiryLength] = useState(30);
  const [modal, setModal] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const getSafeAddress = async () => {
    if (signer) {
      setSafeAddress(await getUserSafe(signer));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(safeAddress).then(
      function () {
        setCopied(true);
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  };

  useEffect(() => {
    getSafeAddress();
  }, [signer]);

  const [beneficiary, setBeneficiary] = useState<string>("");

  const getBeneficiary = useCallback(async () => {
    if (!signer) {
      return;
    }
    const safeOwner = signer;

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeToExtend = await getUserSafe(signer);

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeToExtend,
    });

    const moduleAddresses = await safeSdk.getModules();
    const moduleContract = new Contract(
      moduleAddresses[0],
      CustomModule.abi,
      safeOwner
    );

    const beneficiary = await moduleContract.beneficiary();

    setBeneficiary(beneficiary);

    return beneficiary;
  }, [signer]);

  useEffect(() => {
    getBeneficiary();
  }, [getBeneficiary, signer]);

  const getExpiration = useCallback(async () => {
    if (!signer) {
      return;
    }
    const safeOwner = signer;

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeToExtend = await getUserSafe(signer);

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeToExtend,
    });

    const moduleAddresses = await safeSdk.getModules();
    const moduleContract = new Contract(
      moduleAddresses[0],
      CustomModule.abi,
      safeOwner
    );

    const date = new Date(
      (await moduleContract.expiration()).toString() * 1000
    );

    setExpiration(date);

    return date;
  }, [signer]);

  useEffect(() => {
    getExpiration();
  }, [getExpiration, signer]);

  const handleExtendValidity = async () => {
    // 1. Generate the transaction data to extend validity
    const safeOwner = signer;

    if (!safeOwner) {
      return;
    }

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeService = initializeSafeAPI(signer);

    const safeToExtend = await getUserSafe(signer);

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeToExtend,
    });

    const moduleAddresses = await safeSdk.getModules();
    const moduleContract = new Contract(
      moduleAddresses[0],
      CustomModule.abi,
      safeOwner
    );

    const tx = (
      await moduleContract.populateTransaction.extendValidity(
        ethers.BigNumber.from(expiryLength * 60 * 60 * 24)
      )
    ).data;

    if (!tx) {
      return;
    }

    const safeTransactionData: SafeTransactionDataPartial = {
      to: moduleAddresses[0],
      data: tx,
      value: "0",
    };

    const changeOwnerTx = await safeSdk.createTransaction({
      safeTransactionData,
    });

    // 2. Sending the transaction to the Safe
    console.log("Extending validity...");
    const safeTxHash = await safeSdk.getTransactionHash(changeOwnerTx);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    await safeService.proposeTransaction({
      safeAddress: await safeSdk.getAddress(),
      safeTransactionData: changeOwnerTx.data,
      safeTxHash,
      senderAddress: await safeOwner.getAddress(),
      senderSignature: senderSignature.data,
      origin,
    });
    const enableModuleTxResponse = await safeSdk.executeTransaction(
      changeOwnerTx
    );
    await enableModuleTxResponse.transactionResponse?.wait();
    console.log("Validity extended!");

    await getExpiration();
  };

  const formatDateDiff = () => {
    var date1 = moment();
    var date2 = moment(expiration);
    var days = date2.diff(date1, "days");
    return days + " Days Left";
  };

  return (
    <article>
      <div className=" items-center px-5 py-12 lg:px-20">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-row justify-center items-center space-x-7">
            <article className="prose">
              <h1 className="text-5xl">{formatDateDiff()}</h1>
            </article>
            <label htmlFor="my-modal-3" className="btn">
              Renew
            </label>

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box relative space-y-3">
                <label
                  htmlFor="my-modal-3"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                ></label>
                <h3 className="text-lg font-bold">Prove I am not dead</h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Renew for another:</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={expiryLength}
                    onChange={(event) =>
                      setExpiryLength(Number(event.target.value))
                    }
                  >
                    <option disabled selected>
                      Period
                    </option>
                    <option value={30}>Month</option>
                    <option value={90}>Quarter</option>
                    <option value={180}>Half-Year</option>
                    <option value={365}>Year</option>
                  </select>
                </div>
                <div className="modal-action">
                  <button
                    className="btn"
                    onClick={() => handleExtendValidity()}
                  >
                    Renew
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row justify-center items-center space-x-7">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="text-slate-400">Amount to be collected</p>
                <h2 className="card-title text-3xl">$25 000</h2>
              </div>
            </div>

            <div className="form-control w-96 max-w-l">
              <label className="label">
                <span className="label-text">Beneficiary Address</span>
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Address"
                  className="input input-bordered w-full max-w-xs"
                  value={beneficiary}
                  onChange={(event) => setBeneficiary(event.target.value)}
                />
              </div>
            </div>
          </div>

          <button className="btn w-fit m-auto" onClick={() => setModal(!modal)}>
            {modal ? "Hide" : "Click to deposit assets"}
          </button>
          {modal && (
            <div className="card w-102 m-auto bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="text-slate-400">Your deposit address</p>
                <img
                  src={`https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${safeAddress}&choe=UTF-8`}
                  alt="new"
                />
              </div>
              <p
                onClick={handleCopy}
                className="p-2 text-center underline cursor-pointer"
              >
                {safeAddress}
              </p>
              {copied && <p className="py-1 text-center">Copied</p>}
            </div>
          )}

          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Token</th>
                <th>Address</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <td>USDC</td>
                <td>0x</td>
                <td>25000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
