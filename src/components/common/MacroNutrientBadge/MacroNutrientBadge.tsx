import { MacroNutrientTag } from '@citrus/hooks';
import { Badge } from '@mantine/core';
import { useTranslation } from 'next-i18next';

type MacroNutrientBadgeProps = {
  tag: MacroNutrientTag;
};

export const MacroNutrientBadge = ({ tag }: MacroNutrientBadgeProps) => {
  const { t } = useTranslation('common');

  const tags = {
    [MacroNutrientTag.HIGH_CARBOHYDRATE]: {
      color: 'lime',
      title: t('common.macro_tags.high_carb'),
    },
    [MacroNutrientTag.LOW_CARBOHYDRATE]: {
      color: 'lime',
      title: t('common.macro_tags.low_carb'),
    },
    [MacroNutrientTag.HIGH_FAT]: {
      color: 'cyan',
      title: t('common.macro_tags.high_fat'),
    },
    [MacroNutrientTag.LOW_FAT]: {
      color: 'cyan',
      title: t('common.macro_tags.low_fat'),
    },
    [MacroNutrientTag.HIGH_PROTEIN]: {
      color: 'grape',
      title: t('common.macro_tags.high_protein'),
    },
    [MacroNutrientTag.LOW_PROTEIN]: {
      color: 'grape',
      title: t('common.macro_tags.low_protein'),
    },
    [MacroNutrientTag.BALANCED_MACROS]: {
      color: 'gray',
      title: t('common.macro_tags.balanced'),
    },
  };

  return (
    <Badge size="xs" color={tags[tag].color} sx={{ cursor: 'pointer' }}>
      {tags[tag].title}
    </Badge>
  );
};
