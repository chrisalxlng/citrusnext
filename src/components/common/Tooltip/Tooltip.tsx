import { useMediaQuery } from '@mantine/hooks';
import {
  Tooltip as MantineTooltip,
  TooltipProps as MantineTooltipProps,
} from '@mantine/core';
import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode | ReactNode[];
};

export const Tooltip = ({
  children,
  ...rest
}: TooltipProps & MantineTooltipProps) => {
  const isTouchDevice = useMediaQuery('(hover: none)');

  return isTouchDevice ? (
    <>{children}</>
  ) : (
    <MantineTooltip {...rest}>{children}</MantineTooltip>
  );
};
