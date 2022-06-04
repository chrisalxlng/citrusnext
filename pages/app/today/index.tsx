import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { TodayPage } from '@citrus/pages';

export default function Today() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <TodayPage />
    </Redirect>
  );
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
