import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Redirect } from '@citrus/core';
import { AuthenticationPage, PageState } from '@citrus/pages';

export default function SignInPage() {
  return (
    <Redirect to="/app" when={AuthStates.Authenticated}>
      <AuthenticationPage pageState={PageState.signIn} />
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
