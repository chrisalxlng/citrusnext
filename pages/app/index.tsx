import { AuthStates, Redirect } from '@citrus/core';

export default function Dashboard() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <Redirect to="/app/today" when={AuthStates.Authenticated} />
    </Redirect>
  );
}
