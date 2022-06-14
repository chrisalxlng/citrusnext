import { HEADER_HEIGHT } from '@citrus/constants';
import { Spotlight } from '@citrus/core';
import { FooterLayout } from '@citrus/layouts';
import { AppDefaultNavbar } from '@citrus/layouts';
import { AppDefaultHeader } from '@citrus/layouts';
import { AppShell, Box, Group, useMantineColorScheme } from '@mantine/core';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';
import Head from 'next/head';
import { ReactNode, useState } from 'react';

type PageLayoutProps = {
  children?: ReactNode | ReactNode[];
  title?: string;
  header?: JSX.Element;
  navbar?: JSX.Element;
  noHeader?: boolean;
  noNavbar?: boolean;
  noFooter?: boolean;
  disableSpotlightMainActions?: boolean;
};

export const PageLayout = ({
  children = null,
  title = null,
  header = null,
  navbar = null,
  noHeader = false,
  noNavbar = false,
  noFooter = false,
  disableSpotlightMainActions = false,
}: PageLayoutProps) => {
  const largerThanBreakpoint = useMediaQuery(`(min-width: 500px)`);
  const [navbarOpened, setNavbarOpened] = useState<boolean>(false);
  const { toggleColorScheme } = useMantineColorScheme();
  const titleTemplate = `${title} • citrus`;

  useHotkeys([['mod+.', () => toggleColorScheme()]]);

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
    <Spotlight disableMainActions={disableSpotlightMainActions}>
      <Head>
        <title>{title ? titleTemplate : 'citrus'}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AppShell
        header={header ?? (!noHeader && defaultHeader)}
        navbar={navbar ?? (!noNavbar && defaultNavbar)}
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
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            })}
          >
            <Box p={largerThanBreakpoint ? 30 : 20}>{children}</Box>
            {!noFooter && <FooterLayout />}
          </Group>
        )}
      </AppShell>
    </Spotlight>
  );
};
