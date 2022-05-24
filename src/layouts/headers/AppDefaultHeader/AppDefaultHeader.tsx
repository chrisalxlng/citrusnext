import { HEADER_HEIGHT } from '@citrus/constants';
import { ColorSchemeToggle } from '@citrus/core';
import { LogoIcon, LogoVariants } from '@citrus/icons';
import {
  Burger,
  Group,
  Header,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

type AppDefaultHeaderProps = {
  largerThanBreakpoint: boolean;
  navbarOpened: boolean;
  setNavbarOpened: Dispatch<SetStateAction<boolean>>;
};

export const AppDefaultHeader = ({
  largerThanBreakpoint,
  navbarOpened,
  setNavbarOpened,
}: AppDefaultHeaderProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Header height={HEADER_HEIGHT} px="md">
      <Group position="apart" sx={{ height: '100%' }}>
        {!largerThanBreakpoint && (
          <Burger
            opened={navbarOpened}
            onClick={() => setNavbarOpened((opened: boolean) => !opened)}
            size="sm"
            color={theme.colors.gray[6]}
          />
        )}
        <UnstyledButton onClick={() => router.push('/')}>
          <LogoIcon variant={LogoVariants.WithTitle} />
        </UnstyledButton>
        <ColorSchemeToggle />
      </Group>
    </Header>
  );
};
