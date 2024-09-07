import "../styles/globals.css";
import PropTypes from "prop-types";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "next/app";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const theme = {
    primaryColor: "grape",
    colorScheme: "dark",
  };
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
      <link
        href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600&display=swap"
        rel="stylesheet"
      />
      <ColorSchemeProvider colorScheme={"dark"}>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
          <Notifications position="top-right" />
          <div className={`${inter.className}`}>
            <Component {...pageProps} />
          </div>
        </MantineProvider>
      </ColorSchemeProvider>
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
