import { MacroNutrientBadge } from '@citrus/core';
import { ModalObject } from '@citrus/hooks';
import { FoodIcon } from '@citrus/icons';
import { Ingredient } from '@citrus/types';
import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Space,
  Text,
} from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

export type IngredientModalType = 'add' | 'update';

type IngredientModalProps = {
  modal: ModalObject;
  type: IngredientModalType;
  ingredient: Ingredient;
  onSubmit: (ingredient: Ingredient) => void;
};

const MAX_MACRO_NUTRIENT_BADGES = 2;

export const IngredientModal = ({
  modal,
  type,
  ingredient,
  onSubmit,
}: IngredientModalProps) => {
  const { t } = useTranslation();
  const { opened, close } = modal;
  const [quantity, setQuantity] = useState<number>(ingredient.quantity);

  useEffect(() => setQuantity(ingredient.quantity), [opened]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={
        <Text weight={500}>
          {type === 'add'
            ? t('modals.ingredient.actions.add')
            : t('modals.ingredient.actions.update')}
        </Text>
      }
    >
      <form
        onSubmit={() => {
          onSubmit({ ...ingredient, quantity });
          close();
        }}
      >
        <Space h={10} />
        <Group position="apart" px={10}>
          <Group>
            <FoodIcon size={24} id={ingredient.grocery.iconId} />
            <Group direction="column" spacing={5} align="flex-start">
              <Text size="sm" weight={500}>
                {ingredient.grocery.title}
              </Text>
              <Group spacing={10} noWrap>
                {ingredient.grocery.macroNutrientTags
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
          <Button
            onClick={() => {
              onSubmit({ ...ingredient, quantity });
              close();
            }}
          >
            {type === 'add'
              ? t('modals.ingredient.actions.add')
              : t('modals.ingredient.actions.update')}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
