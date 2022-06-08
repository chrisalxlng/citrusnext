import { Card, IconSelect, SplitButton } from '@citrus/core';
import { useAuth, useDish } from '@citrus/hooks';
import { Dish, DishForm, Unit } from '@citrus/types';
import { FoodIcon } from '@citrus/icons';
import { AppCloseHeader, PageLayout } from '@citrus/layouts';
import {
  Container,
  Group,
  InputWrapper,
  NumberInput,
  SegmentedControl,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { useFocusTrap, useForm } from '@mantine/hooks';
import { useTranslation } from 'next-i18next';
import { Trash } from 'tabler-icons-react';
import { createArray } from '@citrus/util';
import { IngredientsSelect } from '@citrus/core';

type DishPageProps = {
  dish?: Dish;
};

export const DishPage = ({ dish }: DishPageProps) => {
  const { t } = useTranslation('common');
  const isCreatePage: boolean = !dish;

  const title: string = isCreatePage ? 'New Dish' : 'Update Dish';
  const { currentUser } = useAuth();
  const { add, update, remove } = useDish();
  const focusTrapRef = useFocusTrap();

  const form = useForm<DishForm>({
    initialValues: {
      id: dish?.id,
      title: dish?.title ?? '',
      iconId: dish?.iconId ?? 1,
      portionSize: dish?.portionSize ?? 100,
      unit: dish?.unit ?? Unit.Grams,
      ingredients: dish?.ingredients ?? [],
      userId: currentUser.id,
    },

    validationRules: {
      title: (val) => val.length >= 1,
      iconId: (val) => val >= 1,
      portionSize: (val) => val > 0,
      unit: (val) => val === Unit.Grams || val === Unit.Mililiters,
      ingredients: (val) => val.length > 0,
      userId: (val) => !!val,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        isCreatePage
          ? add.mutate({
              ...values,
              ingredients: values.ingredients.map((ing) => ({
                groceryId: ing.grocery.id,
                quantity: ing.quantity,
              })),
            })
          : update.mutate({
              id: dish.id,
              ...values,
              ingredients: values.ingredients.map((ing) => ({
                groceryId: ing.grocery.id,
                quantity: ing.quantity,
              })),
            })
      )}
    >
      <PageLayout
        title={title}
        header={
          <AppCloseHeader
            title={title}
            submitButton={
              <SplitButton
                options={
                  !isCreatePage && [
                    {
                      label: t('pages.dish.actions.delete'),
                      color: 'red',
                      icon: <Trash size={14} />,
                      onClick: () => remove.mutate(dish.id),
                    },
                  ]
                }
                type="submit"
              >
                {isCreatePage
                  ? t('pages.dish.actions.add')
                  : t('pages.dish.actions.update')}
              </SplitButton>
            }
          />
        }
        noNavbar
      >
        <Container size={700} ref={focusTrapRef}>
          <Group direction="column" spacing={50} pb="xl">
            <Group
              position="apart"
              direction="row"
              align="flex-start"
              spacing="xl"
              sx={{ width: '100%' }}
            >
              <Group
                direction="column"
                py="md"
                sx={{ flex: '1 1', minWidth: 230 }}
              >
                <Text weight={500} size="lg">
                  {t('pages.dish.helper.general.title')}
                </Text>
                <Text color="dimmed" size="sm">
                  {t('pages.dish.helper.general.text')}
                </Text>
              </Group>
              <Card p="xl" sx={{ flex: '1 1', minWidth: 305 }}>
                <Group grow>
                  <TextInput
                    data-autofocus
                    required
                    label={t('pages.dish.form.title.label')}
                    variant="filled"
                    placeholder={t('pages.dish.form.title.placeholder')}
                    value={form.values.title}
                    onChange={(event) =>
                      form.setFieldValue('title', event.currentTarget.value)
                    }
                    sx={{ maxWidth: 'none' }}
                  />
                  <IconSelect<number>
                    required
                    label={t('pages.dish.form.icon.label')}
                    variant="filled"
                    data={createArray(163).map((index) => ({
                      icon: <FoodIcon id={index + 1} size={24} />,
                      value: index + 1,
                    }))}
                    value={form.values.iconId}
                    onChange={(value) => form.setFieldValue('iconId', value)}
                  />
                </Group>
                <Space h="xl" />
                <Group align="flex-end" noWrap>
                  <NumberInput
                    required
                    label={t('pages.dish.form.potion_size.label')}
                    variant="filled"
                    value={form.values.portionSize}
                    onBlur={(event) =>
                      form.setFieldValue(
                        'portionSize',
                        parseInt(event.target.value)
                      )
                    }
                    min={1}
                    max={99999}
                    step={1}
                    stepHoldDelay={200}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 2.5)}
                    sx={{ width: '100%' }}
                  />
                  <InputWrapper
                    label={t('pages.dish.form.unit.label')}
                    required
                  >
                    <SegmentedControl
                      value={form.values.unit}
                      onChange={(value) =>
                        form.setFieldValue(
                          'unit',
                          value === Unit.Grams ? Unit.Grams : Unit.Mililiters
                        )
                      }
                      data={[
                        { label: t('common.units.g'), value: 'g' },
                        { label: t('common.units.ml'), value: 'ml' },
                      ]}
                      sx={{ overflow: 'visible' }}
                      styles={{
                        root: { height: 36 },
                        controlActive: { height: 28 },
                        label: { padding: '3px 10px' },
                      }}
                    />
                  </InputWrapper>
                </Group>
              </Card>
            </Group>

            <Group
              position="apart"
              direction="row"
              align="flex-start"
              spacing="xl"
              sx={{ width: '100%' }}
            >
              <Group
                direction="column"
                py="md"
                sx={{ flex: '1 1', minWidth: 230 }}
              >
                <Text weight={500} size="lg">
                  {t('pages.dish.helper.ingredients.title')}
                </Text>
                <Text color="dimmed" size="sm">
                  {t('pages.dish.helper.ingredients.text')}
                </Text>
              </Group>
              <Card p="xl" sx={{ flex: '1 1', minWidth: 305 }}>
                <IngredientsSelect ingredients={form.values.ingredients} />
              </Card>
            </Group>
          </Group>
        </Container>
      </PageLayout>
    </form>
  );
};
