"use client";
import Navbar from "@/components/Navbar";
import { Raleway } from "next/font/google";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, goerli, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/dist/providers/public";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider } = configureChains([goerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "9acc3b1344a5bc37ae1273e5c1d1c0dd",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const raleway = Raleway({ subsets: ["latin"] });

export const metadata = {
  title: "Afterwise",
  description: "Trustless end of life digital legacy management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Navbar />
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
