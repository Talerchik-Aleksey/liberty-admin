import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider>
        <Header />
        <div className="main">
          <Component {...pageProps} />
        </div>
        <Footer />
      </SessionProvider>
    </>
  );
}
