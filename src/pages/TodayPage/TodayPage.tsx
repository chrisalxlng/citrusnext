import { PageLayout } from '@citrus/layouts';
import { useTranslation } from 'next-i18next';

export const TodayPage = () => {
  const { t } = useTranslation('common');

  return (
    <PageLayout title={t('pages.today.title')}>
      {t('pages.today.title')}
    </PageLayout>
  );
};
