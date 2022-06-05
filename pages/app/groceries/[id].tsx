import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Loader, Redirect } from '@citrus/core';
import { useGrocery } from '@citrus/hooks';
import { GroceryPage } from '@citrus/pages';
import { useRouter } from 'next/router';

export default function EditGrocery() {
  const router = useRouter();
  const { id } = router.query;

  const { groceries } = useGrocery();
  const { data, isLoading } = groceries;

  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <GroceryPage grocery={data.find((grocery) => grocery.id === id)} />
      )}
    </Redirect>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
