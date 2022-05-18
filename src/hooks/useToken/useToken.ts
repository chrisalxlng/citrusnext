import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import { isExpired } from 'react-jwt';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN_ROUTE = process.env.NEXT_PUBLIC_API_TOKEN_ROUTE;

export const useTokenRequest = () => {
  const [cookies, setCookie] = useCookies(['access-token', 'refresh-token']);

  const refreshTokens = async (refreshToken: string): Promise<Tokens> => {
    try {
      const response: AxiosResponse<Tokens> = await axios.get(
        API_URL + API_TOKEN_ROUTE,
        {
          headers: { Authorization: 'Bearer ' + refreshToken },
        }
      );
      const data: Tokens = response.data;
      setCookie('access-token', data.accessToken);
      setCookie('refresh-token', data.refreshToken);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getInstance = async (tokens?: Tokens) => {
    const refreshToken: string =
      tokens.refreshToken ?? cookies['refresh-token'];

    if (!refreshToken) {
      console.error('No refresh token in storage.');
      return;
    }

    if (isExpired(refreshToken)) {
      console.error('Refresh token expired.');
      return;
    }

    try {
      let accessToken: string = tokens.accessToken ?? cookies['access-token'];

      if (!accessToken || isExpired(accessToken)) {
        accessToken = (await refreshTokens(refreshToken)).accessToken;
      }

      const instance: AxiosInstance = axios.create({
        baseURL: API_URL,
        timeout: 1000,
        headers: { Authorization: 'Bearer ' + accessToken },
      });

      return instance;
    } catch (error) {
      console.error(error);
    }
  };

  return { getInstance };
};
