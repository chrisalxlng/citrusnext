import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { GroceryPage } from '@citrus/pages';

export default function NewGrocery() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <GroceryPage />
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
