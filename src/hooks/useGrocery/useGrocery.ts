import { API_URL, GROCERIES_ROUTE, GROCERY_ROUTE } from '@citrus/constants';
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
import { CreateGrocery, GroceryResponse, UpdateGrocery } from '@citrus/types';

export const useGrocery = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { getInstance } = useTokenRequest();
  const [cookies, setCookie] = useCookies(['grocery-count']);
  const [count, setCount] = useState<number>(
    parseInt(cookies['grocery-count'] ?? 5)
  );
  const showNotification = useNotification();
  const router = useRouter();

  const groceries: UseQueryResult<GroceryResponse[]> = useQuery(
    'groceries',
    async () => {
      const instance: AxiosInstance = await getInstance();
      const { data }: AxiosResponse<GroceryResponse[]> = await instance.get(
        `${API_URL}${GROCERIES_ROUTE}`
      );
      setCookie('grocery-count', data.length || 1), { path: '/app' };
      setCount(data.length);
      return data;
    },
    { keepPreviousData: true }
  );

  const add: UseMutationResult<any, unknown, CreateGrocery, unknown> =
    useMutation(
      async (grocery: CreateGrocery) => {
        const instance: AxiosInstance = await getInstance();
        const { data } = await instance.post(
          `${API_URL}${GROCERY_ROUTE}`,
          grocery
        );
        return data;
      },
      {
        onSuccess: (addedGrocery: GroceryResponse) => {
          queryClient.setQueryData(
            'groceries',
            (currentGroceries: GroceryResponse[]) => [
              ...currentGroceries,
              addedGrocery,
            ]
          );
          setCount(count + 1);
          showNotification({
            title: t('notifications.success.grocery_addition.title'),
            message: t('notifications.success.grocery_addition.message', {
              grocery: addedGrocery.title,
            }),
            type: NotificationTypes.Success,
          });
          router.push('/app/groceries');
        },
        onError: () => {
          showNotification({
            title: t('notifications.error.grocery_addition.title'),
            message: t('notifications.error.grocery_addition.message'),
            type: NotificationTypes.Error,
          });
        },
      }
    );

  const update: UseMutationResult = useMutation(
    async (grocery: UpdateGrocery) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.put(
        `${API_URL}${GROCERY_ROUTE}/${grocery.id}`,
        grocery
      );
      return data;
    },
    {
      onSuccess: (updatedGrocery: GroceryResponse) => {
        queryClient.setQueryData(
          'groceries',
          (currentGroceries: GroceryResponse[]) =>
            currentGroceries.map((grocery: GroceryResponse) =>
              grocery.id === updatedGrocery.id ? updatedGrocery : grocery
            )
        );
        showNotification({
          title: t('notifications.success.grocery_update.title'),
          message: t('notifications.success.grocery_update.message', {
            grocery: updatedGrocery.title,
          }),
          type: NotificationTypes.Success,
        });
        router.push('/app/groceries');
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.grocery_update.title'),
          message: t('notifications.error.grocery_update.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  const remove = useMutation(
    async (id: string) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.delete(
        `${API_URL}${GROCERY_ROUTE}/${id}`
      );
      return data;
    },
    {
      onSuccess: (grocery: GroceryResponse) => {
        queryClient.setQueryData(
          'groceries',
          (currentGroceries: GroceryResponse[]) =>
            currentGroceries.filter((g: GroceryResponse) => g.id !== grocery.id)
        );
        setCount(count - 1);
        showNotification({
          title: t('notifications.success.grocery_deletion.title'),
          message: t('notifications.success.grocery_deletion.message'),
          type: NotificationTypes.Success,
        });
        router.push('/app/groceries');
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.grocery_deletion.title'),
          message: t('notifications.error.grocery_deletion.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  return {
    groceries: { ...groceries, count },
    add,
    update,
    remove,
  };
};
