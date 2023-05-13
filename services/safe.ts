import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";

const intializeSafeAPI = (signer: ethers.Signer) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSAPIService = new SafeApiKit({
    txServiceUrl: "https://safe-transaction-goerli.safe.global",
    ethAdapter,
  });

  return safeSAPIService;
};

export const getUserSafe = async (signer: ethers.Signer) => {
  const userAddress = await signer.getAddress();

  const safeService = intializeSafeAPI(signer);

  const safes = await safeService.getSafesByOwner(userAddress);

  const safeAddress = safes.safes[0];

  return safeAddress;
};

export const enableModule = async (safeSdk: Safe, moduleAddress: string) => {
  const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress);
  const txResponse = await safeSdk.executeTransaction(safeTransaction);
  await txResponse.transactionResponse?.wait();

  console.log(txResponse);
  return txResponse;
};
