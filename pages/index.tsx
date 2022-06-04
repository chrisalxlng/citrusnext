import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { LandingPage } from '@citrus/pages';

export default function HomePage() {
  return (
    <Redirect to="/app" when={AuthStates.Authenticated}>
      <LandingPage />
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
