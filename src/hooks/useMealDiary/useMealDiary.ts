import { API_URL, DIARY_ROUTE } from '@citrus/constants';
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
import { useTranslation } from 'next-i18next';
import {
  CreateMealDiaryEntry,
  MealDiaryEntryResponse,
  UpdateMealDiaryEntry,
} from '@citrus/types';

export const useMealDiaryEntry = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { getInstance } = useTokenRequest();
  const [cookies, setCookie] = useCookies(['meal-diary-count']);
  const [count, setCount] = useState<number>(
    parseInt(cookies['meal-diary-count'] ?? 5)
  );
  const showNotification = useNotification();

  const mealDiaryEntries: UseQueryResult<MealDiaryEntryResponse[]> = useQuery(
    'mealDiaryEntries',
    async () => {
      const instance: AxiosInstance = await getInstance();
      const { data }: AxiosResponse<MealDiaryEntryResponse[]> =
        await instance.get(`${API_URL}${DIARY_ROUTE}`);
      setCookie('meal-diary-count', data.length || 1), { path: '/app' };
      setCount(data.length);
      return data;
    },
    { keepPreviousData: true }
  );

  const add: UseMutationResult<any, unknown, CreateMealDiaryEntry, unknown> =
    useMutation(
      async (mealDiaryEntry: CreateMealDiaryEntry) => {
        const instance: AxiosInstance = await getInstance();
        const { data } = await instance.post(
          `${API_URL}${DIARY_ROUTE}`,
          mealDiaryEntry
        );
        return data;
      },
      {
        onSuccess: (addedMealDiaryEntry: MealDiaryEntryResponse) => {
          queryClient.setQueryData(
            'mealDiaryEntries',
            (currentMealDiaryEntries: MealDiaryEntryResponse[]) => [
              ...currentMealDiaryEntries,
              addedMealDiaryEntry,
            ]
          );
          setCount(count + 1);
          showNotification({
            title: t('notifications.success.diary_entry_addition.title'),
            message: t('notifications.success.diary_entry_addition.message'),
            type: NotificationTypes.Success,
          });
        },
        onError: () => {
          showNotification({
            title: t('notifications.error.diary_entry_addition.title'),
            message: t('notifications.error.diary_entry_addition.message'),
            type: NotificationTypes.Error,
          });
        },
      }
    );

  const update: UseMutationResult = useMutation(
    async (mealDiaryEntry: UpdateMealDiaryEntry) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.put(
        `${API_URL}${DIARY_ROUTE}/${mealDiaryEntry.id}`,
        mealDiaryEntry
      );
      return data;
    },
    {
      onSuccess: (updatedMealDiaryEntry: MealDiaryEntryResponse) => {
        queryClient.setQueryData(
          'mealDiaryEntries',
          (currentMealDiaryEntries: MealDiaryEntryResponse[]) =>
            currentMealDiaryEntries.map(
              (mealDiaryEntry: MealDiaryEntryResponse) =>
                mealDiaryEntry.id === updatedMealDiaryEntry.id
                  ? updatedMealDiaryEntry
                  : mealDiaryEntry
            )
        );
        showNotification({
          title: t('notifications.success.diary_entry_update.title'),
          message: t('notifications.success.diary_entry_update.message'),
          type: NotificationTypes.Success,
        });
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.diary_entry_update.title'),
          message: t('notifications.error.diary_entry_update.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  const remove = useMutation(
    async (id: string) => {
      const instance: AxiosInstance = await getInstance();
      const { data } = await instance.delete(`${API_URL}${DIARY_ROUTE}/${id}`);
      return data;
    },
    {
      onSuccess: (mealDiaryEntry: MealDiaryEntryResponse) => {
        queryClient.setQueryData(
          'mealDiaryEntries',
          (currentMealDiaryEntries: MealDiaryEntryResponse[]) =>
            currentMealDiaryEntries.filter(
              (mde: MealDiaryEntryResponse) => mde.id !== mealDiaryEntry.id
            )
        );
        setCount(count - 1);
        showNotification({
          title: t('notifications.success.diary_entry_deletion.title'),
          message: t('notifications.success.diary_entry_deletion.message'),
          type: NotificationTypes.Success,
        });
      },
      onError: () => {
        showNotification({
          title: t('notifications.error.diary_entry_deletion.title'),
          message: t('notifications.error.diary_entry_deletion.message'),
          type: NotificationTypes.Error,
        });
      },
    }
  );

  return {
    mealDiaryEntries: { ...mealDiaryEntries, count },
    add,
    update,
    remove,
  };
};
