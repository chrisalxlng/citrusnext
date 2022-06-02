import { Box } from '@mantine/core';
import { ReactNode } from 'react';

type CardGroupProps = {
  children: ReactNode | ReactNode[];
  cardMinWidth: number;
};

export const CardGroup = ({ children, cardMinWidth }: CardGroupProps) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,
        gap: theme.spacing.md,
        justifyItems: 'center',
      })}
    >
      {children}
    </Box>
  );
};
