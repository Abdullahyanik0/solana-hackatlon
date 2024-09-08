import "../styles/globals.css";
import PropTypes from "prop-types";
import { ColorSchemeProvider, MantineProvider, Text } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "next/app";
import { Inter } from "next/font/google";
import Link from "next/link";
import { QueryClientProvider } from "react-query";
import queryClient from "@/query-client";
import { useMemo } from "react";
import dynamic from "next/dynamic";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter, LedgerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import Head from "next/head";

const WalletMultiButtonDynamic = dynamic(async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton, { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const network = clusterApiUrl("testnet");
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter(), new LedgerWalletAdapter()],
    [network]
  );

  const theme = { primaryColor: "grape", colorScheme: "dark" };
  return (
    <>
      <Head>
        <title>Meme Master</title>
      </Head>
      <ConnectionProvider endpoint={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <QueryClientProvider client={queryClient}>
              <ColorSchemeProvider colorScheme={"dark"}>
                <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
                  <Notifications position="top-right" />
                  <div className="sticky top-0  bg-black/40 backdrop-blur-sm z-50 p-4 sm:px-10 border-b flex justify-between sm:items-center  transition-all gap-6 flex-col sm:flex-row">
                    <div className="flex gap-4 items-center">
                      <Link className="hover:text-white" href="/">
                        <Text className="sm:text-lg" fw={600}>
                          Competitions 🏁
                        </Text>
                      </Link>
                      <Link className="hover:text-white" href="/feed">
                        <Text className="sm:text-lg" fw={600}>
                          Feed 📚
                        </Text>
                      </Link>

                      <Link className="hover:text-white" href="/create">
                        <Text className="sm:text-lg" fw={600}>
                          Create meme 👽
                        </Text>
                      </Link>
                      <Link className="hover:text-white" href="/generate">
                        <Text variant="gradient" gradient={{ from: "indigo", to: "pink", deg: 45 }} className="sm:text-lg" fw={600}>
                          Generate ai meme
                        </Text>
                      </Link>
                    </div>
                    <div className="flex justify-end">
                      <WalletMultiButtonDynamic />
                    </div>
                  </div>
                  <div className={`${inter.className} p-4 sm:px-10 pt-0 mt-4`}>
                    <Component {...pageProps} />
                  </div>
                </MantineProvider>
              </ColorSchemeProvider>
            </QueryClientProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
