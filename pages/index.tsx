import { AuthStates, Redirect } from '@citrus/core';
import { LandingPage } from '@citrus/pages';

export default function HomePage() {
  return (
    <Redirect to="/app" when={AuthStates.Authenticated}>
      <LandingPage />
    </Redirect>
  );
}
