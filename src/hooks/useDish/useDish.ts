import { API_URL, DISHES_ROUTE, DISH_ROUTE } from '@citrus/constants';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { useNotification, useTokenRequest } from '@citrus/hooks';
import { NotificationTypes } from '../useNotification/useNotification';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { CreateDish, DishResponse, UpdateDish } from '@citrus/types';

export const useDish = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { getInstance } = useTokenRequest();
  const [cookies, setCookie] = useCookies(['dish-count']);
  const [count, setCount] = useState<number>(
    parseInt(cookies['dish-count'] ?? 5)
  );
  const showNotification = useNotification();
  const router = useRouter();

  const dishes: UseQueryResult<DishResponse[]> = useQuery(
    'dishes',
    async () => {
      const instance: AxiosInstance = await getInstance();
      const { data }: AxiosResponse<DishResponse[]> = await instance.get(
        `${API_URL}${DISHES_ROUTE}`
      );
      setCookie('dish-count', data.length || 1), { path: '/app' };
      setCount(data.length);
      return data;
    },
    { keepPreviousData: true }
  );

  const add: UseMutationResult<any, unknown, CreateDish, unknown> = useMutation(
    async (dish: CreateDish) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.post(`${API_URL}${DISH_ROUTE}`, dish);
      return data;
    },
    {
      onSuccess: (addedDish: DishResponse) => {
        queryClient.setQueryData('dishes', (currentDishes: DishResponse[]) => [
          ...currentDishes,
          addedDish,
        ]);
        setCount(count + 1);
        showNotification({
          title: t('notifications.success.dish_addition.title'),
          message: t('notifications.success.dish_addition.message', {
            dish: addedDish.title,
          }),
          type: NotificationTypes.Success,
        });
        router.push('/app/dishes');
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.dish_addition.title'),
          message: t('notifications.error.dish_addition.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  const update: UseMutationResult = useMutation(
    async (dish: UpdateDish) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.put(
        `${API_URL}${DISH_ROUTE}/${dish.id}`,
        dish
      );
      return data;
    },
    {
      onSuccess: (updatedDish: DishResponse) => {
        queryClient.setQueryData('dishes', (currentDishes: DishResponse[]) =>
          currentDishes.map((dish: DishResponse) =>
            dish.id === updatedDish.id ? updatedDish : dish
          )
        );
        showNotification({
          title: t('notifications.success.dish_update.title'),
          message: t('notifications.success.dish_update.message', {
            dish: updatedDish.title,
          }),
          type: NotificationTypes.Success,
        });
        router.push('/app/dishes');
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.dish_update.title'),
          message: t('notifications.error.dish_update.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  const remove = useMutation(
    async (id: string) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.delete(`${API_URL}${DISH_ROUTE}/${id}`);
      return data;
    },
    {
      onSuccess: (dish: DishResponse) => {
        queryClient.setQueryData('dishes', (currentDishes: DishResponse[]) =>
          currentDishes.filter((d: DishResponse) => d.id !== dish.id)
        );
        setCount(count - 1);
        showNotification({
          title: t('notifications.success.dish_deletion.title'),
          message: t('notifications.success.dish_deletion.message'),
          type: NotificationTypes.Success,
        });
        router.push('/app/dishes');
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.dish_deletion.title'),
          message: t('notifications.error.dish_deletion.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  return {
    dishes: { ...dishes, count },
    add,
    update,
    remove,
  };
};
