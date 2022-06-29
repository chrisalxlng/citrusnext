import { NutritionInfoCard } from '@citrus/components/cards/NutritionInfoCard/NutritionInfoCard';
import {
  CardGroup,
  DateControl,
  FoodCard,
  FoodQuantityModal,
  FoodQuantityModalType,
  FoodSkeleton,
  MealSelect,
} from '@citrus/core';
import { useAuth, useMealDiaryEntry, useModal } from '@citrus/hooks';
import { EntityPageLayout } from '@citrus/layouts';
import { MealResponse } from '@citrus/types';
import { createArray } from '@citrus/util';
import { Space, Text } from '@mantine/core';
import { toggleSpotlight } from '@mantine/spotlight';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export const TodayPage = () => {
  const { t } = useTranslation('common');
  const { pathname, push, query } = useRouter();
  const [modal, openModal, foodData, type] = useModal<
    FoodQuantityModalType,
    MealResponse
  >();
  const { currentUser } = useAuth();
  const { mealDiaryEntries, add, update, remove } = useMealDiaryEntry();
  const { count, data, isLoading } = mealDiaryEntries;
  const [date, setDate] = useState<Date>(null);
  const [availableDishes, setAvailableDishes] = useState<boolean>(false);
  const entriesAtCurrentDate: MealResponse[] = useMemo(() => {
    return (
      data?.find((entry) => dayjs(date).isSame(entry.date, 'day'))?.meals ?? []
    );
  }, [date, mealDiaryEntries.data]);

  useEffect(() => {
    if (!!date) {
      push(`${pathname}?date=${dayjs(date).format('DD-MM-YYYY')}`);
      return;
    }
    const initialQuery: string =
      (query.date as string) ?? window?.location.search.split('=').pop();
    if (initialQuery.length) {
      const [day, month, year]: number[] = initialQuery
        .split('-')
        .map((entity) => parseInt(entity));
      const initialDate: dayjs.Dayjs = dayjs()
        .set('date', day)
        .set('month', month - 1)
        .set('year', year);
      const formattedInitialDate: Date = new Date(
        initialDate.format('MM/DD/YYYY')
      );
      const dateToSet: Date = date ?? formattedInitialDate ?? new Date();
      setDate(dateToSet);
    } else {
      setDate(new Date());
    }
  }, [date]);

  const getNutritionInfoValue = (
    key: 'calories' | 'carbohydrates' | 'fats' | 'proteins'
  ): number => {
    const meals = data?.find((entry) =>
      dayjs(date).isSame(entry.date, 'day')
    )?.meals;

    if (!meals) return null;

    if (key === 'calories') {
      return meals
        .map(
          (meal) => (meal.dish.calories / meal.dish.portionSize) * meal.quantity
        )
        .reduce((a, b) => a + b);
    }

    return meals
      .map(
        (meal) => (meal.dish.macroNutrientsPer100[key] * meal.quantity) / 100
      )
      .reduce((a, b) => a + b);
  };

  return (
    <>
      {foodData && (
        <FoodQuantityModal<MealResponse>
          modal={modal}
          type={type}
          labels={{
            add: t('modals.meal.actions.add'),
            update: t('modals.meal.actions.update'),
            delete: t('modals.meal.actions.delete'),
          }}
          food={foodData}
          onSubmit={(meal: MealResponse) => {
            const existingMeals = mealDiaryEntries.data.find((entry) =>
              dayjs(entry.date).isSame(date, 'date')
            )?.meals;
            if (!existingMeals) {
              add.mutate({
                date,
                meals: [meal].map((meal) => ({
                  dishId: meal.dish.id,
                  quantity: meal.quantity,
                })),
                userId: currentUser.id,
              });
            } else {
              update.mutate({
                ...mealDiaryEntries.data.find((entry) =>
                  dayjs(entry.date).isSame(date, 'date')
                ),
                meals: [
                  ...mealDiaryEntries.data
                    .find((entry) => dayjs(entry.date).isSame(date, 'date'))
                    .meals.filter((m) => meal.dish.id !== m.dish.id),
                  meal,
                ].map((meal) => ({
                  dishId: meal.dish.id,
                  quantity: meal.quantity,
                })),
              });
            }
          }}
          onDelete={(id) => {
            const currentEntry = mealDiaryEntries.data.find((entry) =>
              dayjs(entry.date).isSame(date, 'date')
            );
            if (currentEntry.meals?.length === 1) {
              remove.mutate(currentEntry.id);
            } else {
              update.mutate({
                ...currentEntry,
                meals: [
                  ...currentEntry.meals.filter((m) => id !== m.dish.id),
                ].map((meal) => ({
                  dishId: meal.dish.id,
                  quantity: meal.quantity,
                })),
              });
            }
          }}
        />
      )}
      <EntityPageLayout
        title={t('pages.today.title')}
        disableSpotlightMainActions
        footerKbds={[
          { label: t('modals.meal.actions.add'), keys: ['mod', 'K'] },
        ]}
      >
        <MealSelect
          meals={entriesAtCurrentDate}
          date={date}
          openModal={openModal}
          setAvailableDishes={setAvailableDishes}
        />
        <EntityPageLayout.Loading
          loading={isLoading}
          title={t('pages.today.meal_diary.title')}
          button={{
            label: t('pages.today.meal_diary.new'),
            onClick: toggleSpotlight,
            disabled: !availableDishes,
          }}
        >
          <CardGroup cardMinWidth={270}>
            {createArray(count).map((index) => (
              <FoodSkeleton key={index} />
            ))}
          </CardGroup>
        </EntityPageLayout.Loading>
        <EntityPageLayout.Body
          loading={isLoading}
          emptyState={{
            empty: !data?.find((entry) =>
              dayjs(date).isSame(entry.date, 'day')
            ),
            title: t('pages.today.meal_diary.empty.title'),
            subtitle: t('pages.today.meal_diary.empty.subtitle'),
            showBodyTitle: true,
          }}
          title={<DateControl date={date} setDate={setDate} />}
          button={{
            label: t('pages.today.meal_diary.new'),
            onClick: toggleSpotlight,
            disabled: !availableDishes,
          }}
        >
          <CardGroup cardMinWidth={130}>
            {[
              {
                label: {
                  value: t('pages.dish.form.calories.label'),
                  color: 'orange',
                },
                value: {
                  value: getNutritionInfoValue('calories'),
                  unit: t('common.units.kcal_short'),
                },
              },
              {
                label: {
                  value: t('pages.dish.form.carbs.label'),
                  color: 'lime',
                },
                value: {
                  value: getNutritionInfoValue('carbohydrates'),
                  unit: t('common.units.g_short'),
                  includeDecimals: true,
                },
              },
              {
                label: {
                  value: t('pages.dish.form.fats.label'),
                  color: 'cyan',
                },
                value: {
                  value: getNutritionInfoValue('fats'),
                  unit: t('common.units.g_short'),
                  includeDecimals: true,
                },
              },
              {
                label: {
                  value: t('pages.dish.form.proteins.label'),
                  color: 'grape',
                },
                value: {
                  value: getNutritionInfoValue('proteins'),
                  unit: t('common.units.g_short'),
                  includeDecimals: true,
                },
              },
            ].map((nutrInfo, index) => (
              <NutritionInfoCard
                key={index}
                label={nutrInfo.label}
                value={nutrInfo.value}
              />
            ))}
          </CardGroup>
          <Space h={50} />
          <Text weight={500} mb={10}>
            {t('pages.today.meal_diary.title')}
          </Text>
          <CardGroup cardMinWidth={270}>
            {data
              ?.find((entry) => dayjs(date).isSame(entry.date, 'day'))
              ?.meals.map((meal) => (
                <FoodCard
                  key={meal.dish.id}
                  onClick={() => openModal({ data: meal, type: 'update' })}
                  data={{
                    id: meal.dish?.id,
                    title: meal.dish.title,
                    iconId: meal.dish.iconId,
                    calories:
                      (meal.dish.calories / meal.dish.portionSize) *
                      meal.quantity,
                    portionSize: meal.quantity,
                    unit: meal.dish.unit,
                    macroNutrientTags: meal.dish.macroNutrientTags,
                  }}
                />
              ))}
          </CardGroup>
        </EntityPageLayout.Body>
      </EntityPageLayout>
    </>
  );
};
