import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookies } from 'cookies-next';
import Head from 'next/head';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AuthProvider } from '@citrus/contexts';
import { Favicon, FullWidthHeightLoader } from '@citrus/core';
import { CookiesProvider } from 'react-cookie';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  useEffect(() => setLoading(false), []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
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
                  <Component {...pageProps} />
                </AuthProvider>
              </CookiesProvider>
            )}
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
