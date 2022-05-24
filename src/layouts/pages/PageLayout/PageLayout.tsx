import { HEADER_HEIGHT } from '@citrus/constants';
import { FooterLayout } from '@citrus/layouts';
import { AppDefaultNavbar } from '@citrus/layouts';
import { AppDefaultHeader } from '@citrus/layouts';
import { AppShell, Box, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Head from 'next/head';
import { ReactNode, useState } from 'react';

type PageLayoutProps = {
  children?: ReactNode | ReactNode[];
  title?: string;
  header?: JSX.Element;
  navbar?: JSX.Element;
};

export const PageLayout = ({
  children = null,
  title = null,
  header = null,
  navbar = null,
}: PageLayoutProps) => {
  const largerThanBreakpoint = useMediaQuery(`(min-width: 500px)`);
  const [navbarOpened, setNavbarOpened] = useState<boolean>(false);
  const titleTemplate = `${title} • citrus`;

  const defaultHeader = (
    <AppDefaultHeader
      largerThanBreakpoint={largerThanBreakpoint}
      navbarOpened={navbarOpened}
      setNavbarOpened={setNavbarOpened}
    />
  );

  const defaultNavbar = (
    <AppDefaultNavbar
      opened={navbarOpened}
      largerThanBreakpoint={largerThanBreakpoint}
      setNavbarOpened={setNavbarOpened}
    />
  );

  return (
    <>
      <Head>
        <title>{title ? titleTemplate : 'citrus'}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {/* <Favicon /> */}
      </Head>
      <AppShell
        header={header ?? defaultHeader}
        navbar={navbar ?? defaultNavbar}
        padding={0}
      >
        {((!largerThanBreakpoint && !navbarOpened) || largerThanBreakpoint) && (
          <Group
            direction="column"
            spacing={0}
            grow
            sx={(theme) => ({
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              flexWrap: 'nowrap',
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[9]
                  : theme.colors.gray[0],
            })}
          >
            <Box p={largerThanBreakpoint ? 30 : 20}>{children}</Box>
            <FooterLayout />
          </Group>
        )}
      </AppShell>
    </>
  );
};
