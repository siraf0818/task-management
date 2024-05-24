import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import AppProvider from "@/context";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/styles.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
        },
    },
});

export default function MyApp(props: MyAppProps) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    // replace console.* for disable log on production
    if (process.env.NODE_ENV === "production") {
        console.log = () => { };
        console.error = () => { };
        console.debug = () => { };
    }

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <QueryClientProvider client={queryClient}>
                <CookiesProvider>
                    <CacheProvider value={emotionCache}>
                        <AppProvider>
                            <ThemeProvider theme={theme}>
                                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                                <CssBaseline />
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </AppProvider>
                    </CacheProvider>
                </CookiesProvider>
                <ReactQueryDevtools
                    initialIsOpen={false}
                    position="bottom-right"
                />
            </QueryClientProvider>
        </>
    );
}
