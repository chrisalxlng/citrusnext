import { Skeleton } from '@mantine/core';
import Image from 'next/image';
import { memo, useState } from 'react';

type FoodIconProps = {
  id: number;
  size?: number;
};

const UnmemoizedFoodIcon = ({ id, size = 12 }: FoodIconProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <Skeleton visible={loading} width={size} height={size}>
      <Image
        width={size}
        height={size}
        onLoadingComplete={() => setLoading(false)}
        src={`/food-icons/food-${id}.svg`}
      />
    </Skeleton>
  );
};

export const FoodIcon = memo(UnmemoizedFoodIcon);
