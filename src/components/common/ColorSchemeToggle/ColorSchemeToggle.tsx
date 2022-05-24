import {
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Sun, MoonStars } from 'tabler-icons-react';
import { Tooltip } from '@citrus/core';

export const ColorSchemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Tooltip
      label={theme.colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
      withArrow
    >
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        sx={(theme) => ({
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {colorScheme === 'dark' ? <Sun size={20} /> : <MoonStars size={20} />}
      </ActionIcon>
    </Tooltip>
  );
};
