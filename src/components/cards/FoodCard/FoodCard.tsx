import { Card, MacroNutrientBadge } from '@citrus/core';
import { MacroNutrientTag, Unit } from '@citrus/types';
import { FoodIcon } from '@citrus/icons';
import {
  Group,
  Space,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { BrandTinder, ScaleOutline } from 'tabler-icons-react';
import { getFormattedNumber } from '@citrus/util';

type FoodCardProps = {
  href?: string;
  onClick?: () => void;
  data: {
    id: string;
    title: string;
    iconId: number;
    calories: number;
    portionSize: number;
    unit: Unit;
    macroNutrientTags: MacroNutrientTag[];
  };
};

const MAX_MACRO_NUTRIENT_BADGES = 3;

export const FoodCard = ({
  data,
  href = null,
  onClick = null,
}: FoodCardProps) => {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    !!data && (
      <UnstyledButton onClick={onClick} sx={{ width: '100%', maxWidth: 370 }}>
        <Card href={href}>
          <Group align="center" noWrap sx={{ overflow: 'hidden' }}>
            <ThemeIcon p={4} color="blue" variant="light" size="xl" radius="md">
              <FoodIcon id={data.iconId} size={24} />
            </ThemeIcon>
            <Group direction="column" spacing={0}>
              <Text size="sm" weight={500} lineClamp={1}>
                {data.title}
              </Text>
              <Group noWrap>
                <Group spacing={3} noWrap>
                  <BrandTinder
                    size={12}
                    color={
                      colorScheme === 'dark'
                        ? theme.colors.orange[5]
                        : theme.colors.orange[7]
                    }
                    style={{ strokeWidth: 2.5 }}
                  />
                  <Text
                    size="xs"
                    color={
                      colorScheme === 'dark'
                        ? theme.colors.gray[3]
                        : theme.colors.gray[5]
                    }
                    weight={500}
                  >
                    {t('common.units.amount.kcal', {
                      amount: getFormattedNumber(data.calories),
                    })}
                  </Text>
                </Group>
                <Group spacing={3} noWrap>
                  <ScaleOutline
                    size={12}
                    color={
                      colorScheme === 'dark'
                        ? theme.colors.indigo[2]
                        : theme.colors.indigo[3]
                    }
                    style={{ strokeWidth: 2.5 }}
                  />
                  <Text
                    size="xs"
                    color={
                      colorScheme === 'dark'
                        ? theme.colors.gray[3]
                        : theme.colors.gray[5]
                    }
                    weight={500}
                  >
                    {t(`common.units.amount.${data.unit}`, {
                      amount: getFormattedNumber(data.portionSize),
                    })}
                  </Text>
                </Group>
              </Group>
            </Group>
          </Group>
          <Space h={20} />
          <Group spacing={10} noWrap>
            {data.macroNutrientTags
              ?.slice(0, MAX_MACRO_NUTRIENT_BADGES)
              .map((tag) => (
                <MacroNutrientBadge key={tag} tag={tag} />
              ))}
          </Group>
        </Card>
      </UnstyledButton>
    )
  );
};
