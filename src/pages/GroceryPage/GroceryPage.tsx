import { Card, IconSelect, SplitButton } from '@citrus/core';
import { useAuth, useDish, useGrocery } from '@citrus/hooks';
import { Unit, UpdateGrocery } from '@citrus/types';
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
import { useMemo } from 'react';

const CALORIES_CARBOHYDRATES_FACTOR = 4;
const CALORIES_FATS_FACTOR = 9;
const CALORIES_PROTEINS_FACTOR = 4;

type GroceryPageProps = {
  grocery?: UpdateGrocery;
};

export const GroceryPage = ({ grocery }: GroceryPageProps) => {
  const { t } = useTranslation('common');
  const isCreatePage: boolean = !grocery;

  const title: string = isCreatePage
    ? t('pages.grocery.title.new')
    : t('pages.grocery.title.update');
  const { currentUser } = useAuth();
  const { add, update, remove } = useGrocery();
  const { dishes } = useDish();
  const focusTrapRef = useFocusTrap();
  const isDependency = useMemo(() => {
    if (isCreatePage || !dishes.data) return true;
    return dishes.data.some((dish) =>
      dish.ingredients.map((ing) => ing.grocery.id).includes(grocery.id)
    );
  }, [dishes.data]);

  const form = useForm({
    initialValues: {
      title: grocery?.title ?? '',
      iconId: grocery?.iconId ?? 1,
      portionSize: grocery?.portionSize ?? 100,
      unit: grocery?.unit ?? Unit.Grams,
      macroNutrientsPer100: {
        carbohydrates: grocery?.macroNutrientsPer100.carbohydrates ?? 0,
        fats: grocery?.macroNutrientsPer100.fats ?? 0,
        proteins: grocery?.macroNutrientsPer100.proteins ?? 0,
      },
      userId: currentUser.id,
    },

    validationRules: {
      title: (val) => val.length >= 1,
      iconId: (val) => val >= 1,
      portionSize: (val) => val > 0,
      unit: (val) => val === Unit.Grams || val === Unit.Mililiters,
      macroNutrientsPer100: (val) =>
        val.carbohydrates >= 0 && val.fats >= 0 && val.proteins >= 0,
      userId: (val) => !!val,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        isCreatePage
          ? add.mutate(values)
          : update.mutate({ id: grocery.id, ...values })
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
                  !isCreatePage &&
                  !isDependency && [
                    {
                      label: t('pages.grocery.actions.delete'),
                      color: 'red',
                      icon: <Trash size={14} />,
                      onClick: () => remove.mutate(grocery.id),
                    },
                  ]
                }
                type="submit"
              >
                {isCreatePage
                  ? t('pages.grocery.actions.add')
                  : t('pages.grocery.actions.update')}
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
                  {t('pages.grocery.helper.general.title')}
                </Text>
                <Text color="dimmed" size="sm">
                  {t('pages.grocery.helper.general.text')}
                </Text>
              </Group>
              <Card p="xl" sx={{ flex: '1 1', minWidth: 305 }}>
                <Group grow>
                  <TextInput
                    data-autofocus
                    required
                    label={t('pages.grocery.form.title.label')}
                    variant="filled"
                    placeholder={t('pages.grocery.form.title.placeholder')}
                    value={form.values.title}
                    onChange={(event) =>
                      form.setFieldValue('title', event.currentTarget.value)
                    }
                    sx={{ maxWidth: 'none' }}
                  />
                  <IconSelect<number>
                    required
                    label={t('pages.grocery.form.icon.label')}
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
                    label={t('pages.grocery.form.potion_size.label')}
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
                    label={t('pages.grocery.form.unit.label')}
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
                  {t('pages.grocery.helper.macros.title')}
                </Text>
                <Text color="dimmed" size="sm">
                  {t('pages.grocery.helper.macros.text')}
                </Text>
              </Group>
              <Card p="xl" sx={{ flex: '1 1', minWidth: 305 }}>
                <Group align="flex-end" noWrap>
                  <NumberInput
                    required
                    label={t('pages.grocery.form.carbs.label')}
                    variant="filled"
                    value={form.values.macroNutrientsPer100.carbohydrates}
                    onBlur={(event) =>
                      form.setFieldValue('macroNutrientsPer100', {
                        ...form.values.macroNutrientsPer100,
                        carbohydrates: parseFloat(event.target.value),
                      })
                    }
                    min={0}
                    max={99999}
                    precision={1}
                    step={0.1}
                    stepHoldDelay={200}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 2.5)}
                    sx={{ width: '100%' }}
                  />
                  <NumberInput
                    required
                    label={t('pages.grocery.form.fats.label')}
                    variant="filled"
                    value={form.values.macroNutrientsPer100.fats}
                    onBlur={(event) =>
                      form.setFieldValue('macroNutrientsPer100', {
                        ...form.values.macroNutrientsPer100,
                        fats: parseFloat(event.target.value),
                      })
                    }
                    min={0}
                    max={99999}
                    precision={1}
                    step={0.1}
                    stepHoldDelay={200}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 2.5)}
                    sx={{ width: '100%' }}
                  />
                </Group>
                <Space h="xl" />
                <Group align="flex-end" noWrap>
                  <NumberInput
                    required
                    label={t('pages.grocery.form.proteins.label')}
                    variant="filled"
                    value={form.values.macroNutrientsPer100.proteins}
                    onBlur={(event) =>
                      form.setFieldValue('macroNutrientsPer100', {
                        ...form.values.macroNutrientsPer100,
                        proteins: parseFloat(event.target.value),
                      })
                    }
                    min={0}
                    max={99999}
                    precision={1}
                    step={0.1}
                    stepHoldDelay={200}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 2.5)}
                    sx={{ width: '100%' }}
                  />
                  <NumberInput
                    disabled
                    label={t('pages.grocery.form.calories.label')}
                    variant="filled"
                    value={
                      ((form.values.macroNutrientsPer100.carbohydrates *
                        CALORIES_CARBOHYDRATES_FACTOR +
                        form.values.macroNutrientsPer100.fats *
                          CALORIES_FATS_FACTOR +
                        form.values.macroNutrientsPer100.proteins *
                          CALORIES_PROTEINS_FACTOR) *
                        form.values.portionSize) /
                      100
                    }
                    min={0}
                    max={99999}
                    sx={{ width: '100%' }}
                  />
                </Group>
              </Card>
            </Group>
          </Group>
        </Container>
      </PageLayout>
    </form>
  );
};
