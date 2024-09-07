import "../styles/globals.css";
import PropTypes from "prop-types";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "next/app";

import { Inter } from "next/font/google";
import Link from "next/link";
import { QueryClientProvider } from "react-query";
import queryClient from "@/query-client";
const inter = Inter({ subsets: ["latin"] });

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const theme = {
    primaryColor: "grape",
    colorScheme: "dark",
  };
  return (
    <>
     <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={"dark"}>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
          <Notifications position="top-right" />
          <div className="p-4 sm:px-10 border-b flex justify-end  transition-all gap-6">
            <Link className="hover:text-white" href="/">Home</Link>
            <Link className="hover:text-white" href="/competition">Competition</Link>
          </div>
          <div className={`${inter.className} p-4 sm:px-10 pt-0 mt-4`}>
            <Component {...pageProps} />
          </div>
        </MantineProvider>
      </ColorSchemeProvider>
      </QueryClientProvider>
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
