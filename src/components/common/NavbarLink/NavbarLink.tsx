import { Text, UnstyledButton } from '@mantine/core';
import { Tooltip } from '@citrus/core';
import { Dispatch, SetStateAction } from 'react';
import { Icon } from 'tabler-icons-react';
import Link from 'next/link';

type NavbarLinkProps = {
  icon: Icon;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  largerThanBreakpoint: boolean;
  setNavbarOpened: Dispatch<SetStateAction<boolean>>;
};

export const NavbarLink = ({
  icon: Icon,
  label,
  active = false,
  href = null,
  onClick,
  largerThanBreakpoint,
  setNavbarOpened,
}: NavbarLinkProps) => {
  const desktopButton: JSX.Element = (
    <Tooltip label={label} position="right" withArrow>
      <UnstyledButton
        onClick={onClick}
        sx={(theme) => ({
          width: 50,
          height: 50,
          borderRadius: theme.radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[0]
              : theme.colors.gray[7],

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
          },

          '&, &:hover': active && {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                : theme.colors[theme.primaryColor][0],
            color:
              theme.colors[theme.primaryColor][
                theme.colorScheme === 'dark' ? 4 : 7
              ],
          },
        })}
      >
        <Icon />
      </UnstyledButton>
    </Tooltip>
  );

  const mobileButton: JSX.Element = (
    <UnstyledButton
      onClick={() => {
        onClick();
        setNavbarOpened(false);
      }}
      sx={(theme) => ({
        width: '100%',
        height: 50,
        borderRadius: theme.radius.md,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        color:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[0]
            : theme.colors.gray[7],

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
        },

        '&, &:hover': active && {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
              : theme.colors[theme.primaryColor][0],
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === 'dark' ? 4 : 7
            ],
        },
      })}
    >
      <Icon />
      <Text weight={500}>{label}</Text>
    </UnstyledButton>
  );

  if (href) {
    return largerThanBreakpoint ? (
      <Link href={href}>
        <div>{desktopButton}</div>
      </Link>
    ) : (
      <Link href={href}>
        <div>{mobileButton}</div>
      </Link>
    );
  } else {
    return largerThanBreakpoint ? desktopButton : mobileButton;
  }
};
