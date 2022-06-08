import { Group, Skeleton, Space } from '@mantine/core';
import { Card } from '@citrus/core';

export const FoodSkeleton = () => {
  return (
    <Card sx={{ width: '100%', maxWidth: 370 }}>
      <Group align="center" noWrap>
        <Skeleton height={40} width={40} radius="md" />
        <Group direction="column" spacing={4.29} sx={{ flexGrow: 1 }}>
          <Skeleton height={18} />
          <Skeleton height={18} />
        </Group>
      </Group>
      <Space h={20} />
      <Skeleton height={16} />
    </Card>
  );
};
