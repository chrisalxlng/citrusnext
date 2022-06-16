import { Box, Divider, Group, Kbd, Text } from '@mantine/core';
import { OS, useOs } from '@mantine/hooks';
import { useTranslation } from 'next-i18next';

export type KbdElement = {
  label: string;
  keys: string[];
};

type FooterLayoutProps = {
  kbds?: KbdElement[];
};

export const FooterLayout = ({ kbds = [] }: FooterLayoutProps) => {
  const { t } = useTranslation();
  const os: OS = useOs();
  const currentYear = new Date().getFullYear();

  const COLOR_SCHEME_KBD_ELEMENT: KbdElement = {
    label: t('footer.actions.change_color_scheme'),
    keys: ['mod', '.'],
  };

  const getModKey = () => (os === 'macos' ? '⌘' : 'ctrl');

  const KbdElement = (kbd: KbdElement) => {
    const keys = kbd.keys.map((key) => (key === 'mod' ? getModKey() : key));

    return (
      <Group>
        <Group spacing={5}>
          {keys.map((key, index) => (
            <>
              {index > 0 ? <Text size="xs">+</Text> : null}
              <Kbd py={0} sx={{ fontSize: 12 }}>
                {key}
              </Kbd>
            </>
          ))}
        </Group>
        <Text size="xs">{kbd.label}</Text>
      </Group>
    );
  };

  return (
    <Box px={20}>
      <Divider />
      <Group p="xl" position="apart">
        <Group spacing={50}>
          {['macos', 'windows', 'linux'].includes(os) &&
            [COLOR_SCHEME_KBD_ELEMENT, ...kbds].map((kbd) => (
              <KbdElement label={kbd.label} keys={kbd.keys} />
            ))}
        </Group>
        <Text size="xs">&copy; {currentYear} Christopher Lang</Text>
      </Group>
    </Box>
  );
};
