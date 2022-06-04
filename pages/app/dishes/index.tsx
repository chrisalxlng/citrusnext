import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { DishesPage } from '@citrus/pages';

export default function Dishes() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <DishesPage />
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
