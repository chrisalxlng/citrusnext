import { HEADER_HEIGHT } from '@citrus/constants';
import { ColorSchemeToggle } from '@citrus/core';
import { LogoIcon, LogoVariants } from '@citrus/icons';
import { Group, Header, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';

export const DefaultHeader = () => {
  const router = useRouter();

  return (
    <Header height={HEADER_HEIGHT} px="md">
      <Group position="apart" sx={{ height: '100%' }}>
        <UnstyledButton onClick={() => router.push('/')}>
          <LogoIcon variant={LogoVariants.WithTitle} />
        </UnstyledButton>
        <ColorSchemeToggle />
      </Group>
    </Header>
  );
};
