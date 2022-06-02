import {
  Box,
  Card as MantineCard,
  CardProps as MantineCardProps,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode | ReactNode[];
  href?: string;
};

export const Card = ({
  children,
  href = null,
  ...rest
}: CardProps & MantineCardProps<'div'>) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return href ? (
    <Box {...rest}>
      <Link href={href} passHref>
        <Box component="a" sx={{ textDecoration: 'none', color: 'black' }}>
          <MantineCard
            shadow="md"
            radius="md"
            style={
              isDarkTheme
                ? {
                    border: `1px solid ${theme.colors.dark[4]}`,
                    backgroundColor: theme.colors.dark[7],
                  }
                : null
            }
          >
            {children}
          </MantineCard>
        </Box>
      </Link>
    </Box>
  ) : (
    <MantineCard
      shadow="md"
      radius="md"
      style={
        isDarkTheme
          ? {
              border: `1px solid ${theme.colors.dark[4]}`,
              backgroundColor: theme.colors.dark[7],
            }
          : null
      }
      {...rest}
    >
      {children}
    </MantineCard>
  );
};
