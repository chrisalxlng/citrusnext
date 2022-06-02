import { CardGroup, GroceryCard } from '@citrus/core';
import { useGrocery } from '@citrus/hooks';
import { EntityPageLayout } from '@citrus/layouts';

export const createArray = (count: number) => Array.from(Array(count).keys());

export const GroceriesPage = () => {
  const { groceries } = useGrocery();
  const { count, data, isLoading } = groceries;

  return (
    <EntityPageLayout
      title="Groceries"
      button={{ label: 'New Grocery', href: '/app/groceries/new' }}
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
