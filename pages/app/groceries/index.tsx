import { AuthStates, Redirect } from '@citrus/core';
import { GroceriesPage } from '@citrus/pages';

export default function Groceries() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <GroceriesPage />
    </Redirect>
  );
}
