import { AuthStates, Redirect } from '@citrus/core';
import { DashboardPage } from '@citrus/pages';

export default function Dashboard() {
  return (
    <Redirect to="/sign-in" when={AuthStates.Unauthenticatd}>
      <DashboardPage />
    </Redirect>
  );
}
