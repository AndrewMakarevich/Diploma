import axios, { AxiosRequestConfig } from "axios";
import { refreshTokensSuccessObj } from '../interfaces/http/response/authInterfaces';
import AuthService from "../services/auth-service";

export const $authHost = axios.create({
  baseURL: process.env.REACT_APP_BACK_LINK,
  withCredentials: true
});
export const $host = axios.create({
  baseURL: process.env.REACT_APP_BACK_LINK,
  withCredentials: true
});


function tokenInterceptor(config: AxiosRequestConfig) {
  config.headers!.authorization = `Bearer ${localStorage.getItem('access-token')}` || '';

  return config;
}

$authHost.interceptors.request.use(tokenInterceptor);
$authHost.interceptors.response.use(
  (config) => { return config },
  async (error) => {
    const originalReq = error.config;

    if (error.response.status === 401 && error.config && !originalReq._isRetry) {
      originalReq._isRetry = true;
      const tokens = await AuthService.refreshTokens();
      localStorage.setItem("access-token", tokens.data.accessToken);

      return $authHost.request(originalReq);
    }
    throw error;
  }
);

