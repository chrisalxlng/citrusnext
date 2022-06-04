import { CardGroup, GroceryCard } from '@citrus/core';
import { useGrocery } from '@citrus/hooks';
import { EntityPageLayout } from '@citrus/layouts';
import { useTranslation } from 'next-i18next';

export const createArray = (count: number) => Array.from(Array(count).keys());

export const GroceriesPage = () => {
  const { t } = useTranslation('common');
  const { groceries } = useGrocery();
  const { count, data, isLoading } = groceries;

  return (
    <EntityPageLayout
      title={t('pages.groceries.title')}
      button={{ label: t('pages.groceries.new'), href: '/app/groceries/new' }}
    >
      {isLoading ? (
        <CardGroup cardMinWidth={270}>
          {createArray(count).map((index) => (
            <GroceryCard key={index} isLoading={true} data={null} />
          ))}
        </CardGroup>
      ) : (
        <CardGroup cardMinWidth={270}>
          {data.map((grocery) => (
            <GroceryCard
              key={grocery.id}
              isLoading={false}
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
      )}
    </EntityPageLayout>
  );
};
