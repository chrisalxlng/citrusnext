import { HEADER_HEIGHT } from '@citrus/constants';
import { DefaultHeader, FooterLayout } from '@citrus/layouts';
import { AppShell, Box, Group, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

export const UnauthenticatedPageLayout = ({ children }) => {
  const { toggleColorScheme } = useMantineColorScheme();

  useHotkeys([['mod+.', () => toggleColorScheme()]]);

  return (
    <AppShell header={<DefaultHeader />} padding={0}>
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
        <Box p={20}>{children}</Box>
        <FooterLayout />
      </Group>
    </AppShell>
  );
};
