import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { AccountPage } from '@citrus/pages';

export default function Account() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <AccountPage />
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
