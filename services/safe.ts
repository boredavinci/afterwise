/**
 * @title logic for initializing the SDK
 * @dev this script will run one time
 * @notice this follows the "integrating the safe core SDK" guiden
 * @author Nicolas Arnedo
 */

import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { SafeFactory } from "@safe-global/protocol-kit";

async function initializeWallet(): Promise<void> {
  // 1.- Instantiating the ethAdapter

  // this piece code could possibly be very wrong
  const web3Provider = (window as any).ethereum;
  if (!web3Provider) {
    // Handle the case when the 'ethereum' property is not available
    console.error("MetaMask (ethereum) provider not found");
    return;
  }

  web3Provider.chainId = "0x13881"; // Polygon Testnet (Mumbai)
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const safeOwner = provider.getSigner(0);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  });

  // 2.- Initializing the Safe API kit

  const txServiceUrl = "https://safe-transaction-mainnet.safe.global";
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

  // 3.- Initialize the Protocol Kit

  // im not sure but safeAddress should refer to GnosisSafeL2.sol contract address which is the appropriate one to use according to the docs
  const safeFactory = await SafeFactory.create({ ethAdapter });
  // from the factory we can create multiple safes, so maybe later on this part of the code should be modularized into another script
  const safeSdk = await Safe.create({ ethAdapter, safeAddress });
}
/**
 * @title logic for creating safe
 * @dev this script will be added to a button on the frontend
 * @notice this follows the "integrating the safe core SDK" guide, additionally we will have to add more calls to this script for doing the full creation
 * @author Nicolas Arnedo
 */

import { SafeAccountConfig } from "@safe-global/protocol-kit";

// 4.- Deploying a New Safe

// in this step we should also add the module that yussef is creating and maybe an auxilary smart contract that yussef was told should be created

const safeAccountConfig: SafeAccountConfig = {
  owners: ["0x...", "0x..."], // these addresses should be the msg.sender (person clicking the button) and the alt account he wants in case he DIES
  threshold: 2, //number of required signatures
};
const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
