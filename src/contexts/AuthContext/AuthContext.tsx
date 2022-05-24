import { FullWidthHeightLoader } from '@citrus/core';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import {
  NotificationTypes,
  Tokens,
  useNotification,
  useTokenRequest,
} from '@citrus/hooks';

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
  updateUser: (name: string, email: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  signOut: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_AUTHENTICATION_ROUTE =
  process.env.NEXT_PUBLIC_API_AUTHENTICATION_ROUTE;
const API_USER_ROUTE = process.env.NEXT_PUBLIC_API_USER_ROUTE;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'access-token',
    'refresh-token',
    'user-id',
  ]);
  const { getInstance } = useTokenRequest();
  const showNotification = useNotification();

  const [currentUser, setCurrentUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getCookies = (): Tokens & { userId: string } => ({
    accessToken: String(cookies['access-token']),
    refreshToken: String(cookies['refresh-token']),
    userId: String(cookies['user-id']),
  });

  const setCookies = (cookies: Tokens & { userId: string }): void => {
    setCookie('access-token', cookies.accessToken, { path: '/' });
    setCookie('refresh-token', cookies.refreshToken, { path: '/' });
    setCookie('user-id', cookies.userId, { path: '/' });
  };

  const removeCookies = () => {
    removeCookie('access-token', { path: '/' });
    removeCookie('refresh-token', { path: '/' });
    removeCookie('user-id', { path: '/' });
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
      showNotification({
        title: 'User Fetch Error',
        message: 'Something went wrong.',
        type: NotificationTypes.Error,
      });
      console.error(error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
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
      const { accessToken, refreshToken } = tokens;
      setCookies({ accessToken, refreshToken, userId: user.id });
      setCurrentUser(user);
    } catch (error) {
      showNotification({
        title: 'Register Error',
        message: 'Something went wrong.',
        type: NotificationTypes.Error,
      });
      console.error(error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
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
      const { accessToken, refreshToken } = tokens;
      setCookies({ accessToken, refreshToken, userId });
      const user: User = await fetchUser(userId, tokens);
      setCurrentUser(user);
    } catch (error) {
      showNotification({
        title: 'Sign-In Error',
        message: 'Something went wrong.',
        type: NotificationTypes.Error,
      });
      console.error(error);
      setLoading(false);
    }
  };

  const updateUser = async (name: string, email: string) => {
    const { accessToken, refreshToken, userId } = getCookies();
    const instance: AxiosInstance = await getInstance({
      accessToken,
      refreshToken,
    });

    try {
      const response: AxiosResponse = await instance.put(
        `${API_URL}${API_USER_ROUTE}/${userId}`,
        {
          name,
          email,
        }
      );
      const updatedUser: User = response.data;
      setCurrentUser(updatedUser);
      showNotification({
        message: 'User updated successfully',
        type: NotificationTypes.Success,
      });
    } catch (error) {
      showNotification({
        title: 'User Update Error',
        message: 'Something went wrong.',
        type: NotificationTypes.Error,
      });
      console.error(error);
    }
  };

  const deleteUser = async () => {
    const { accessToken, refreshToken, userId } = getCookies();
    const instance: AxiosInstance = await getInstance({
      accessToken,
      refreshToken,
    });

    try {
      await instance.delete(`${API_URL}${API_USER_ROUTE}/${userId}`);
      signOut();
      showNotification({
        message: 'User deleted successfully',
        type: NotificationTypes.Success,
      });
    } catch (error) {
      showNotification({
        title: 'User Deletion Error',
        message: 'Something went wrong.',
        type: NotificationTypes.Error,
      });
      console.error(error);
    }
  };

  const signOut = () => {
    setLoading(true);
    removeCookies();
    setCurrentUser(null);
    setLoading(false);
  };

  useEffect(() => {
    if (!!currentUser) {
      setLoading(false);
      return;
    }

    const userId: string = cookies['user-id'];
    const accessToken: string = cookies['access-token'];
    const refreshToken: string = cookies['refresh-token'];

    const refetchUser = async () => {
      const user: User = await fetchUser(userId, { accessToken, refreshToken });
      setCurrentUser(user);
      setLoading(false);
    };

    if (userId && accessToken && refreshToken) {
      refetchUser();
    } else signOut();
  }, [currentUser]);

  const value: AuthProviderValue = useMemo(
    () => ({
      currentUser,
      register,
      signIn,
      updateUser,
      deleteUser,
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
