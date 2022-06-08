import { CardGroup, FoodCard, FoodSkeleton } from '@citrus/core';
import { useDish } from '@citrus/hooks';
import { EntityPageLayout } from '@citrus/layouts';
import { createArray } from '@citrus/util';
import { useTranslation } from 'next-i18next';

export const DishesPage = () => {
  const { t } = useTranslation('common');
  const { dishes } = useDish();
  const { count, data, isLoading } = dishes;

  return (
    <EntityPageLayout title={t('pages.dishes.title')}>
      <EntityPageLayout.Loading
        loading={isLoading}
        title={t('pages.dishes.title')}
        button={{ label: t('pages.dishes.new'), href: '/app/dishes/new' }}
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
        button={{ label: t('pages.dishes.new'), href: '/app/dishes/new' }}
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
  );
};
