import { useDish } from '@citrus/hooks';
import { FoodIcon } from '@citrus/icons';
import { MealResponse } from '@citrus/types';
import { SpotlightAction, useSpotlight } from '@mantine/spotlight';
import { Dispatch, SetStateAction, useEffect } from 'react';

type MealSelectProps = {
  meals: MealResponse[];
  date: Date;
  openModal: (any) => void;
  dishesAvailable: boolean;
  setDishesAvailable: Dispatch<SetStateAction<boolean>>;
};

export const MealSelect = ({
  meals,
  date,
  openModal,
  dishesAvailable,
  setDishesAvailable,
}: MealSelectProps) => {
  const { opened, registerActions } = useSpotlight();
  const { dishes } = useDish();

  useEffect(() => {
    if (!dishesAvailable) return;
    const mealActions: SpotlightAction[] = dishes.data
      ?.filter((dish) => !meals.map((meal) => meal.dish.id).includes(dish.id))
      .map((dish) => ({
        id: dish.id,
        title: dish.title,
        description: `${dish.portionSize} ${dish.unit} • ${dish.calories} kcal`,
        onTrigger: () => {
          openModal({
            data: { dish, quantity: dish.portionSize },
            type: 'add',
          });
        },
        icon: <FoodIcon id={dish.iconId} size={18} />,
      }));
    setTimeout(() => registerActions(mealActions), 100);
  }, [dishes.isFetched, opened]);

  useEffect(() => {
    setDishesAvailable(
      !!dishes.data?.filter(
        (dish) => !meals.map((meal) => meal.dish.id).includes(dish.id)
      ).length
    );
  }, [meals, date]);

  return null;
};
