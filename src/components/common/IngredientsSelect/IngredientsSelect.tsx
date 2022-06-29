import { FoodQuantityModal, FoodQuantityModalType } from '@citrus/core';
import { useGrocery, useModal } from '@citrus/hooks';
import { FoodIcon } from '@citrus/icons';
import { IngredientResponse, Unit } from '@citrus/types';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Space,
  Table,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { SpotlightAction, useSpotlight } from '@mantine/spotlight';
import { useEffect, MouseEvent, useState } from 'react';
import { Plus, Trash } from 'tabler-icons-react';
import { EmptyState } from '@citrus/core';
import { useTranslation } from 'next-i18next';
import { getFormattedNumber } from '@citrus/util';

type IngredientsSelectProps = {
  ingredients: IngredientResponse[];
  onChange?: (ingredients: IngredientResponse[]) => void;
};

export const IngredientsSelect = ({
  ingredients,
  onChange = null,
}: IngredientsSelectProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const { opened, toggleSpotlight, registerActions } = useSpotlight();
  const { groceries } = useGrocery();
  const [modal, openModal, data, type] = useModal<
    FoodQuantityModalType,
    IngredientResponse
  >();
  const [groceriesAvailable, setGroceriesAvailable] = useState<boolean>(false);
  const isDarkTheme = colorScheme === 'dark';

  const getCalorieLabel = (amount: string) =>
    t('common.units.amount.kcal', { amount });

  const getQuantityLabel = (unit: Unit, amount: string) =>
    t(`common.units.amount.${unit}`, {
      amount,
    });

  useEffect(() => {
    if (!groceries.data) return;
    const availableGroceries = groceries.data?.filter(
      (grocery) =>
        !ingredients.map((ing) => ing.grocery.id).includes(grocery.id)
    );
    const ingredientActions: SpotlightAction[] = availableGroceries.map(
      (grocery) => ({
        id: grocery.id,
        title: grocery.title,
        description: `${grocery.portionSize} ${grocery.unit} • ${grocery.calories} kcal`,
        onTrigger: () => {
          openModal({
            data: { grocery, quantity: grocery.portionSize },
            type: 'add',
          });
        },
        icon: <FoodIcon id={grocery.iconId} size={18} />,
      })
    );
    setTimeout(() => registerActions(ingredientActions), 100);
  }, [groceries.isFetched, opened]);

  useEffect(() => {
    setGroceriesAvailable(
      !!groceries.data?.filter(
        (grocery) =>
          !ingredients.map((ing) => ing.grocery.id).includes(grocery.id)
      ).length
    );
  }, [ingredients]);

  const AddIngredientButton = (
    <Button
      variant="outline"
      leftIcon={<Plus size={16} />}
      fullWidth
      onClick={toggleSpotlight}
      disabled={!groceriesAvailable}
    >
      {t('pages.dish.form.add_ingredient')}
    </Button>
  );

  const rows = ingredients.map((ingredient, index) => (
    <tr key={ingredient.grocery.id}>
      <td
        style={{
          paddingTop: index === 0 && 0,
          paddingBottom: index === ingredients.length - 1 && 0,
        }}
      >
        <UnstyledButton
          onClick={() => openModal({ data: ingredient, type: 'update' })}
          sx={(theme) => ({
            width: '100%',
            borderRadius: theme.radius.md,
            padding: 7,
            color:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7],

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group noWrap>
            <Group noWrap align="center" sx={{ flexGrow: 1 }}>
              <FoodIcon id={ingredient.grocery.iconId} size={24} />
              <Group
                direction="column"
                noWrap
                spacing={0}
                sx={{ maxWidth: '150px' }}
              >
                <Text
                  size="sm"
                  weight={500}
                  lineClamp={1}
                  sx={{
                    overflow: 'clip',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {ingredient.grocery.title}
                </Text>
                <Text
                  size="xs"
                  color="dimmed"
                  lineClamp={1}
                  sx={{ overflow: 'clip', textOverflow: 'ellipsis' }}
                >
                  {`${getQuantityLabel(
                    ingredient.grocery.unit,
                    getFormattedNumber(ingredient.quantity)
                  )} • ${getCalorieLabel(
                    getFormattedNumber(ingredient.grocery.calories)
                  )}`}
                </Text>
              </Group>
            </Group>
            <ActionIcon
              size={36}
              color="red"
              onClick={(event: MouseEvent<HTMLElement>) => {
                event.stopPropagation();
                onChange(
                  ingredients.filter(
                    (ing) => ing.grocery.id !== ingredient.grocery.id
                  )
                );
              }}
              sx={(theme) => ({
                '&:hover': {
                  backgroundColor: isDarkTheme
                    ? theme.colors.red[8]
                    : theme.colors.red[1],
                },
              })}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        </UnstyledButton>
      </td>
    </tr>
  ));

  return (
    <>
      {data && (
        <FoodQuantityModal<IngredientResponse>
          modal={modal}
          type={type}
          labels={{
            add: t('modals.ingredient.actions.add'),
            update: t('modals.ingredient.actions.update'),
          }}
          food={data}
          onSubmit={(ingredient) => {
            const isNewIngredient = ingredients.some(
              (ing) => ing.grocery.id === ingredient.grocery.id
            );
            const updatedIngredients = ingredients.map((ing) =>
              ing.grocery.id === ingredient.grocery.id ? ingredient : ing
            );
            onChange(
              isNewIngredient
                ? updatedIngredients
                : [...ingredients, ingredient]
            );
          }}
        />
      )}
      {!ingredients.length ? (
        <EmptyState
          order={3}
          title={t('pages.dish.form.empty.title')}
          subtitle={t('pages.dish.form.empty.subtitle')}
          button={AddIngredientButton}
        />
      ) : (
        <>
          <Box
            sx={{
              maxHeight: '250px',
              overflow: 'auto',
              marginRight: -18,
            }}
          >
            <Box sx={{ paddingRight: 18 }}>
              <Table verticalSpacing="xs" horizontalSpacing={0}>
                <tbody>{rows}</tbody>
              </Table>
            </Box>
          </Box>
          <Space h={20} />
          {AddIngredientButton}
        </>
      )}
    </>
  );
};
