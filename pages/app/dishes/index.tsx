import { AuthStates, Redirect } from '@citrus/core';
import { DishesPage } from '@citrus/pages';

export default function Dishes() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <DishesPage />
    </Redirect>
  );
}
