import { AuthStates, Redirect } from '@citrus/core';
import { TodayPage } from '@citrus/pages';

export default function Today() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <TodayPage />
    </Redirect>
  );
}
