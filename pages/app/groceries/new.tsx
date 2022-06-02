import { AuthStates, Redirect } from '@citrus/core';
import { GroceryPage } from '@citrus/pages';

export default function NewGrocery() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <GroceryPage />
    </Redirect>
  );
}
