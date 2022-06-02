import {
  Button,
  Menu,
  Group,
  ActionIcon,
  useMantineTheme,
  ButtonProps,
  MantineColor,
} from '@mantine/core';
import { ReactNode } from 'react';
import { ChevronDown } from 'tabler-icons-react';

type SplitButtonProps = {
  children: ReactNode | ReactNode[];
  options?: {
    label: string;
    color?: MantineColor;
    icon: ReactNode;
    onClick: () => void;
  }[];
};

export const SplitButton = ({
  children,
  options = null,
  ...rest
}: SplitButtonProps & ButtonProps<'button'>) => {
  const theme = useMantineTheme();

  return !options ? (
    <Button {...rest}>{children}</Button>
  ) : (
    <Group noWrap spacing={0}>
      <Button
        sx={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        {...rest}
      >
        {children}
      </Button>
      <Menu
        control={
          <ActionIcon
            variant="filled"
            color={theme.primaryColor}
            size={36}
            sx={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              border: 0,
              borderLeft: `1px solid ${
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.white
              }`,
            }}
          >
            <ChevronDown size={16} />
          </ActionIcon>
        }
        transition="scale-y"
        placement="end"
      >
        {options.map((option, index) => (
          <Menu.Item
            key={index}
            color={option.color}
            icon={option.icon}
            onClick={option.onClick}
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu>
    </Group>
  );
};
