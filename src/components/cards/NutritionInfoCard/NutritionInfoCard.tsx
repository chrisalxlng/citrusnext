import { Group, Space, Text } from '@mantine/core';
import { Card } from '@citrus/core';
import { getFormattedNumber } from '@citrus/util';

type NutritionInfoCardProps = {
  label: {
    value: string;
    color: string;
  };
  value: {
    value: number;
    unit: string;
    includeDecimals?: boolean;
  };
};

export const NutritionInfoCard = ({ label, value }: NutritionInfoCardProps) => {
  return (
    <Card sx={{ width: '100%', maxWidth: 185 }}>
      <Text size="sm" weight={500} color={label.color} sx={{ lineHeight: 1 }}>
        {label.value}
      </Text>
      <Group spacing={5} align="flex-end">
        <Text size="lg" weight={500} sx={{ lineHeight: 1 }}>
          {value.includeDecimals
            ? getFormattedNumber(value.value, true)
            : getFormattedNumber(value.value)}
        </Text>
        <Space h={30} />
        <Text size="sm" weight={500} color="dimmed" sx={{ lineHeight: 1 }}>
          {value.unit}
        </Text>
      </Group>
    </Card>
  );
};
