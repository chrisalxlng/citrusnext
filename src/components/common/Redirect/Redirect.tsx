import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@citrus/hooks';
import { FullWidthHeightLoader } from '@citrus/core';

export enum AuthStates {
  Authenticated,
  Unauthenticatd,
}

type RedirectProps = {
  children: ReactNode | ReactNode[];
  to: string;
  when: AuthStates;
};

export const Redirect = ({ children, to, when }: RedirectProps) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      (currentUser && when === AuthStates.Authenticated) ||
      (!currentUser && when === AuthStates.Unauthenticatd)
    ) {
      router.replace(to);
    } else setLoading(false);
  }, [currentUser]);

  return <>{loading ? <FullWidthHeightLoader /> : children}</>;
};
