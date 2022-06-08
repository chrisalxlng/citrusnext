import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { DishPage } from '@citrus/pages';

export default function NewDish() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <DishPage />
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
