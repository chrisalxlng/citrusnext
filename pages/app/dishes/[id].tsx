import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AuthStates, Loader, Redirect } from '@citrus/core';
import { useDish } from '@citrus/hooks';
import { DishPage } from '@citrus/pages';
import { useRouter } from 'next/router';

export default function EditDish() {
  const router = useRouter();
  const { id } = router.query;

  const { dishes } = useDish();
  const { data, isLoading } = dishes;

  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <DishPage dish={data.find((dish) => dish.id === id)} />
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
