import { PageLayout } from '@citrus/layouts';
import { useTranslation } from 'next-i18next';

export const DishesPage = () => {
  const { t } = useTranslation('common');
  return (
    <PageLayout title={t('pages.dishes.title')}>
      {t('pages.dishes.title')}
    </PageLayout>
  );
};
