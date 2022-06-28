import { MacroNutrientBadge, SplitButton } from '@citrus/core';
import { ModalObject } from '@citrus/hooks';
import { FoodIcon } from '@citrus/icons';
import { IngredientResponse, MealResponse } from '@citrus/types';
import { Box, Group, Modal, NumberInput, Space, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Trash } from 'tabler-icons-react';

export type FoodQuantityModalType = 'add' | 'update';

type FoodType = IngredientResponse | MealResponse;

type FoodQuantityModalProps<Food extends FoodType> = {
  modal: ModalObject;
  type: FoodQuantityModalType;
  labels: {
    add: string;
    update: string;
    delete?: string;
  };
  food: Food;
  onSubmit: (food: Food) => void;
  onDelete?: (id: string) => void;
};

const MAX_MACRO_NUTRIENT_BADGES = 2;

export const FoodQuantityModal = <Food extends FoodType>({
  modal,
  type,
  labels,
  food,
  onSubmit,
  onDelete = null,
}: FoodQuantityModalProps<Food>) => {
  const { t } = useTranslation();
  const { opened, close } = modal;
  const [quantity, setQuantity] = useState<number>(food.quantity);
  const { id, iconId, macroNutrientTags, title } =
    'grocery' in food ? food?.grocery : food?.dish;

  useEffect(() => setQuantity(food.quantity), [opened]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={
        <Text weight={500}>{type === 'add' ? labels.add : labels.update}</Text>
      }
    >
      <form
        onSubmit={() => {
          onSubmit({ ...food, quantity });
          close();
        }}
      >
        <Space h={10} />
        <Group position="apart" px={10}>
          <Group>
            <FoodIcon size={24} id={iconId} />
            <Group direction="column" spacing={5} align="flex-start">
              <Text size="sm" weight={500}>
                {title}
              </Text>
              <Group spacing={10} noWrap>
                {macroNutrientTags
                  ?.slice(0, MAX_MACRO_NUTRIENT_BADGES)
                  .map((tag) => (
                    <MacroNutrientBadge key={tag} tag={tag} />
                  ))}
              </Group>
            </Group>
          </Group>
          <Box sx={{ width: 100 }}>
            <NumberInput
              data-autofocus
              required
              label={t('modals.ingredient.form.quantity')}
              variant="filled"
              value={quantity}
              onBlur={(event) => setQuantity(parseInt(event.target.value))}
              min={1}
              max={99999}
              step={1}
              stepHoldDelay={200}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 2.5)}
              sx={{ width: '100%' }}
            />
          </Box>
        </Group>
        <Space h={50} />
        <Group position="right">
          <SplitButton
            onClick={() => {
              onSubmit({ ...food, quantity });
              close();
            }}
            options={
              labels.delete &&
              onDelete &&
              type === 'update' && [
                {
                  label: labels.delete,
                  color: 'red',
                  icon: <Trash size={14} />,
                  onClick: () => {
                    onDelete(id);
                    close();
                  },
                },
              ]
            }
          >
            {type === 'add' ? labels.add : labels.update}
          </SplitButton>
        </Group>
      </form>
    </Modal>
  );
};
