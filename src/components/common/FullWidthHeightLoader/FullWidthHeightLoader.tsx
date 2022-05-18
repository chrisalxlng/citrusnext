import { Group, Loader } from '@mantine/core';

export const FullWidthHeightLoader = () => {
  return (
    <Group
      grow
      align="center"
      direction="column"
      sx={{ width: '100vw', height: '100vh' }}
    >
      <Loader />
    </Group>
  );
};
