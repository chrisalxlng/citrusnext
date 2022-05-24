import { AuthStates, Redirect } from '@citrus/core';
import { AccountPage } from '@citrus/pages';

export default function Account() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <AccountPage />
    </Redirect>
  );
}
