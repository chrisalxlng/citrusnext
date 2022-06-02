import { MacroNutrientTag } from '@citrus/hooks';
import { Badge } from '@mantine/core';

type MacroNutrientBadgeProps = {
  tag: MacroNutrientTag;
};

export const MacroNutrientBadge = ({ tag }: MacroNutrientBadgeProps) => {
  const tags = {
    [MacroNutrientTag.HIGH_CARBOHYDRATE]: {
      color: 'lime',
      title: 'High Carb',
    },
    [MacroNutrientTag.LOW_CARBOHYDRATE]: {
      color: 'lime',
      title: 'Low Carb',
    },
    [MacroNutrientTag.HIGH_FAT]: {
      color: 'cyan',
      title: 'High Fat',
    },
    [MacroNutrientTag.LOW_FAT]: {
      color: 'cyan',
      title: 'Low Fat',
    },
    [MacroNutrientTag.HIGH_PROTEIN]: {
      color: 'grape',
      title: 'High Protein',
    },
    [MacroNutrientTag.LOW_PROTEIN]: {
      color: 'grape',
      title: 'Low Protein',
    },
    [MacroNutrientTag.BALANCED_MACROS]: {
      color: 'gray',
      title: 'Balanced Macros',
    },
  };

  return (
    <Badge size="xs" color={tags[tag].color} sx={{ cursor: 'pointer' }}>
      {tags[tag].title}
    </Badge>
  );
};
