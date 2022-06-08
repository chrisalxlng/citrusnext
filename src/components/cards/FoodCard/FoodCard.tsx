import { Card, MacroNutrientBadge } from '@citrus/core';
import { MacroNutrientTag, Unit } from '@citrus/types';
import { FoodIcon } from '@citrus/icons';
import {
  Group,
  Space,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { BrandTinder, ScaleOutline } from 'tabler-icons-react';

type FoodCardProps = {
  href: string;
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

export const FoodCard = ({ data, href }: FoodCardProps) => {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const getFormattedNumber = (number: number): string => {
    if (number > 9999) {
      const formattedNumber: string = new Intl.NumberFormat('de-DE', {
        maximumSignificantDigits: 4,
      }).format(9999);
      return `${formattedNumber}+`;
    }
    return new Intl.NumberFormat('de-DE', {
      maximumSignificantDigits: 4,
    }).format(number);
  };

  return (
    !!data && (
      <Card href={href} sx={{ width: '100%', maxWidth: 370 }}>
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
    )
  );
};
