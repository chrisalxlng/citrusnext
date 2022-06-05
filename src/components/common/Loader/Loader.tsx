import { Group, Loader as MantineLoader } from '@mantine/core';

type LoaderProps = {
  fullScreen?: boolean;
};

export const Loader = ({ fullScreen = false }: LoaderProps) => {
  return fullScreen ? (
    <Group
      grow
      align="center"
      direction="column"
      sx={{ width: '100vw', height: '100vh' }}
    >
      <MantineLoader />
    </Group>
  ) : (
    <Group grow align="center" direction="column" sx={{ height: '100%' }}>
      <MantineLoader />
    </Group>
  );
};
