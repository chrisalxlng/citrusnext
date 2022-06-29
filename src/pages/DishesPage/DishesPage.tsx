import {
  CardGroup,
  FoodCard,
  FoodSkeleton,
  OnboardingDialog,
} from '@citrus/core';
import { useDish, useGrocery, useModal } from '@citrus/hooks';
import { EntityPageLayout } from '@citrus/layouts';
import { createArray } from '@citrus/util';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';

export const DishesPage = () => {
  const { t } = useTranslation('common');
  const { groceries } = useGrocery();
  const { dishes } = useDish();
  const { count, data, isLoading } = dishes;
  const [dialog, openDialog] = useModal();
  const groceriesAvailable = useMemo(
    () => groceries.data?.length > 0 ?? false,
    [groceries.data]
  );

  useEffect(() => openDialog({}), []);

  return (
    <>
      <OnboardingDialog
        dialog={dialog}
        visible={!groceriesAvailable}
        title={t('onboarding.groceries.title')}
        description={t('onboarding.groceries.description')}
        button={{
          label: t('onboarding.groceries.button_label'),
          href: '/app/groceries/new',
        }}
      />
      <EntityPageLayout title={t('pages.dishes.title')}>
        <EntityPageLayout.Loading
          loading={isLoading}
          title={t('pages.dishes.title')}
          button={{
            label: t('pages.dishes.new'),
            href: '/app/dishes/new',
            disabled: !groceriesAvailable,
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
            empty: data?.length === 0,
            title: t('pages.dishes.empty.title'),
            subtitle: t('pages.dishes.empty.subtitle'),
          }}
          title={t('pages.dishes.title')}
          button={{
            label: t('pages.dishes.new'),
            href: '/app/dishes/new',
            disabled: !groceriesAvailable,
          }}
        >
          <CardGroup cardMinWidth={270}>
            {data?.map((dish) => (
              <FoodCard
                key={dish.id}
                href={`/app/dishes/${dish.id}`}
                data={{
                  id: dish.id,
                  title: dish.title,
                  iconId: dish.iconId,
                  calories: dish.calories,
                  portionSize: dish.portionSize,
                  unit: dish.unit,
                  macroNutrientTags: dish.macroNutrientTags,
                }}
              />
            ))}
          </CardGroup>
        </EntityPageLayout.Body>
      </EntityPageLayout>
    </>
  );
};
