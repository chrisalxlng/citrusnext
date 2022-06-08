import { CardGroup, FoodCard, FoodSkeleton } from '@citrus/core';
import { useGrocery } from '@citrus/hooks';
import { EntityPageLayout } from '@citrus/layouts';
import { createArray } from '@citrus/util';
import { useTranslation } from 'next-i18next';

export const GroceriesPage = () => {
  const { t } = useTranslation('common');
  const { groceries } = useGrocery();
  const { count, data, isLoading } = groceries;

  return (
    <EntityPageLayout title={t('pages.groceries.title')}>
      <EntityPageLayout.Loading
        loading={isLoading}
        title={t('pages.groceries.title')}
        button={{ label: t('pages.groceries.new'), href: '/app/groceries/new' }}
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
          title: t('pages.groceries.empty.title'),
          subtitle: t('pages.groceries.empty.subtitle'),
        }}
        title={t('pages.groceries.title')}
        button={{ label: t('pages.groceries.new'), href: '/app/groceries/new' }}
      >
        <CardGroup cardMinWidth={270}>
          {data?.map((grocery) => (
            <FoodCard
              key={grocery.id}
              href={`/app/groceries/${grocery.id}`}
              data={{
                id: grocery.id,
                title: grocery.title,
                iconId: grocery.iconId,
                calories: grocery.calories,
                portionSize: grocery.portionSize,
                unit: grocery.unit,
                macroNutrientTags: grocery.macroNutrientTags,
              }}
            />
          ))}
        </CardGroup>
      </EntityPageLayout.Body>
    </EntityPageLayout>
  );
};
