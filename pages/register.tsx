import { AuthStates, Redirect } from '@citrus/core';
import { AuthenticationPage, PageState } from '@citrus/pages';

export default function RegisterPage() {
  return (
    <Redirect to="/app" when={AuthStates.Authenticated}>
      <AuthenticationPage pageState={PageState.register} />
    </Redirect>
  );
}
