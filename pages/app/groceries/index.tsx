import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { GroceriesPage } from '@citrus/pages';

export default function Groceries() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <GroceriesPage />
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
