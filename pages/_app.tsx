import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AuthProvider } from '@citrus/contexts';
import { Favicon, FullWidthHeightLoader } from '@citrus/core';
import { CookiesProvider, useCookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function App({ Component, pageProps }: AppProps) {
  const [cookies, setCookie] = useCookies(['mantine-color-scheme']);

  const [loading, setLoading] = useState<boolean>(true);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    cookies['mantine-color-scheme']
  );
  const queryClient = new QueryClient();

  useEffect(() => setLoading(false), []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      path: '/',
    });
  };

  return (
    <>
      <Head>
        <title>citrus</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <Favicon />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            colorScheme,
            primaryColor: 'yellow',
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider position="top-right">
            {loading ? (
              <FullWidthHeightLoader />
            ) : (
              <CookiesProvider>
                <AuthProvider>
                  <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                  </QueryClientProvider>
                </AuthProvider>
              </CookiesProvider>
            )}
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
