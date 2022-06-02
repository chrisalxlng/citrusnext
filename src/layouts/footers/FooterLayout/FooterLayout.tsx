import { Box, Divider, Group, Kbd, Text } from '@mantine/core';
import { OS, useOs } from '@mantine/hooks';

export const FooterLayout = () => {
  const os: OS = useOs();
  const currentYear = new Date().getFullYear();

  const Kbds: JSX.Element = (
    <Group>
      <Group>
        <Group spacing={5}>
          <Kbd py={0} sx={{ fontSize: 12 }}>
            {os === 'macos' ? '⌘' : 'ctrl'}
          </Kbd>
          <Text size="xs">+</Text>
          <Kbd py={0} sx={{ fontSize: 12 }}>
            .
          </Kbd>
        </Group>
        <Text size="xs">Change Color Scheme</Text>
      </Group>
    </Group>
  );

  return (
    <Box px={20}>
      <Divider />
      <Group p="xl" position="apart">
        {['macos', 'windows', 'linux'].includes(os) && Kbds}
        <Text size="xs">&copy; {currentYear} Christopher Lang</Text>
      </Group>
    </Box>
  );
};
