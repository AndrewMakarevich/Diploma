import axios, { AxiosRequestConfig } from "axios";
import { refreshTokensSuccessObj } from '../interfaces/http/resposne/authInterfaces';

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
    if (error.response.status === 401) {
      const tokens = await $host.get<refreshTokensSuccessObj>('/api/user/refresh');
      localStorage.setItem("access-token", tokens.data.accessToken);
    }
    return $authHost.request(originalReq);
  }
);

