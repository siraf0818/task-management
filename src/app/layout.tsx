'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "./theme";
import createEmotionCache from "./createEmotionCache";
import AppProvider from "@/context";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps {
  emotionCache?: EmotionCache;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

// export const metadata: Metadata = {
//   title: "Task Management",
//   description: "Generated by our Team",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>, props: MyAppProps) {
  const {
    emotionCache = clientSideEmotionCache,
  } = props;

  if (process.env.NODE_ENV === "production") {
    console.log = () => { };
    console.error = () => { };
    console.debug = () => { };
  }
  return (
    <html lang="en">
      <title>Task Management</title>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <body>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <CookiesProvider>
              <CacheProvider value={emotionCache}>
                <AppProvider>
                  {children}
                </AppProvider>
              </CacheProvider>
            </CookiesProvider>
            <ReactQueryDevtools
              initialIsOpen={false}
              position="bottom-right"
            />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
