import { useDish } from '@citrus/hooks';
import { FoodIcon } from '@citrus/icons';
import { MealDiaryEntryResponse } from '@citrus/types';
import { SpotlightAction, useSpotlight } from '@mantine/spotlight';
import dayjs from 'dayjs';
import { useEffect } from 'react';

type MealSelectProps = {
  mealDiaryEntries: MealDiaryEntryResponse[];
  date: Date;
  openModal: (any) => void;
};

export const MealSelect = ({
  mealDiaryEntries,
  date,
  openModal,
}: MealSelectProps) => {
  const { opened, registerActions } = useSpotlight();
  const { dishes } = useDish();

  useEffect(() => {
    if (!mealDiaryEntries) return;
    const mealActions: SpotlightAction[] = dishes.data
      ?.filter(
        (dish) =>
          !mealDiaryEntries
            .find((entry) => dayjs(entry.date).isSame(date, 'date'))
            ?.meals.map((meal) => meal.dish.id)
            .includes(dish.id)
      )
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

  return null;
};
