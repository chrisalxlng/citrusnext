import { AuthContext } from '@citrus/contexts';
import { useContext } from 'react';

export const useAuth = () => {
  return useContext(AuthContext);
};
