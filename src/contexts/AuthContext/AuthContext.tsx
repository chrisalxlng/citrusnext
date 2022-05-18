import { FullWidthHeightLoader } from '@citrus/core';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import { Tokens, useTokenRequest } from '@citrus/hooks';

type AuthProviderProps = {
  children: ReactNode | ReactNode[];
};

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthProviderValue = {
  currentUser: User;
  register: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateUser: (name: string) => Promise<void>;
  signOut: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_AUTHENTICATION_ROUTE =
  process.env.NEXT_PUBLIC_API_AUTHENTICATION_ROUTE;
const API_USER_ROUTE = process.env.NEXT_PUBLIC_API_USER_ROUTE;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies([
    'access-token',
    'refresh-token',
    'user-id',
  ]);
  const { getInstance } = useTokenRequest();

  const [currentUser, setCurrentUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const removeCookies = () => {
    removeCookie('access-token');
    removeCookie('refresh-token');
    removeCookie('user-id');
  };

  const fetchUser = async (userId: string, tokens: Tokens): Promise<User> => {
    const instance: AxiosInstance = await getInstance(tokens);

    try {
      const response: AxiosResponse = await instance.get(
        `${API_URL}${API_USER_ROUTE}/${userId}`
      );
      const fetchedUser: User = response.data;
      return fetchedUser;
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    const response: AxiosResponse<{
      user: User;
      tokens: Tokens;
    }> = await axios.post(API_URL + API_USER_ROUTE, {
      name,
      email,
      password,
    });
    const {
      user,
      tokens,
    }: {
      user: User;
      tokens: Tokens;
    } = response.data;
    setCookie('access-token', tokens.accessToken);
    setCookie('refresh-token', tokens.refreshToken);
    setCookie('user-id', user.id);
    setCurrentUser(user);
    setLoading(false);
    router.push('/app');
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    const response: AxiosResponse<{
      userId: string;
      tokens: Tokens;
    }> = await axios.post(API_URL + API_AUTHENTICATION_ROUTE, null, {
      params: { email, password },
    });
    const {
      userId,
      tokens,
    }: {
      userId: string;
      tokens: Tokens;
    } = response.data;
    setCookie('access-token', tokens.accessToken);
    setCookie('refresh-token', tokens.refreshToken);
    setCookie('user-id', userId);
    const user: User = await fetchUser(userId, tokens);
    setCurrentUser(user);
    setLoading(false);
    router.push('/app');
  };

  const updateUser = async (name: string) => {
    return null;
  };

  const signOut = async () => {
    setLoading(true);
    setCurrentUser(null);
    removeCookies();
    setLoading(false);
  };

  useEffect(() => {
    const userId: string = cookies['user-id'];
    const accessToken: string = cookies['access-token'];
    const refreshToken: string = cookies['refresh-token'];

    const refetchUser = async () => {
      const user: User = await fetchUser(userId, { accessToken, refreshToken });
      setCurrentUser(user);
      setLoading(false);
      router.replace('/app');
    };

    if (!currentUser && userId && accessToken && refreshToken) {
      refetchUser();
    } else setLoading(false);
  }, []);

  const value: AuthProviderValue = useMemo(
    () => ({
      currentUser,
      register,
      signIn,
      updateUser,
      signOut,
    }),
    [currentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullWidthHeightLoader /> : children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext<AuthProviderValue | undefined>(
  undefined
);
