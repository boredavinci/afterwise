"use client";
import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, useChainId, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { FusionSDK, PrivateKeyProviderConnector } from "@1inch/fusion-sdk";
import Web3 from "web3";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "9acc3b1344a5bc37ae1273e5c1d1c0dd",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const App = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <YourApp />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export const YourApp = () => {
  const chainId = useChainId();

  const swap = async () => {
    const blockchainProvider = new PrivateKeyProviderConnector(
      "f93f6611c662704d4f8ffe653797d1c0f73e8a7936cca02950f4dfda3752b03f",
      new Web3()
    );

    const sdk = new FusionSDK({
      url: "https://fusion.1inch.io",
      network: chainId,
      blockchainProvider,
    });

    return sdk
      .placeOrder({
        fromTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
        toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        amount: "50000000000000000", // 0.05 ETH
        walletAddress: "0x656dAE5454769e3374ca5F8ef78eC13c2282fD6E",
      })
      .then(console.log);
  };

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url("/bg.jpg")` }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <p className="mb-6 text-5xl">
              Trustless end of life digital legacy management{" "}
            </p>
            <ConnectButton />
            <button className="btn" onClick={swap}>
              Swap
            </button>
            <button className="btn btn-primary">Connect Wallet</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
