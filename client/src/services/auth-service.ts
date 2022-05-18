import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { loginSuccessObj, logoutSuccessObj, refreshTokensSuccessObj, registrationSuccessObj } from "../interfaces/http/response/authInterfaces";
const mainUserApiPath = 'api/user';

export default class AuthService {
  static async registrate(email: string, nickname: string, password: string): Promise<AxiosResponse<registrationSuccessObj>> {
    return $host.post<registrationSuccessObj>(`${mainUserApiPath}/registration`, { email, nickname, password });
  };

  static async login(email: string, password: string): Promise<AxiosResponse<loginSuccessObj>> {
    return $host.post<loginSuccessObj>(`${mainUserApiPath}/login`, { email, password });
  };

  static async logout(): Promise<AxiosResponse<logoutSuccessObj>> {
    const response = await $authHost.delete<logoutSuccessObj>(`${mainUserApiPath}/logout`);
    localStorage.removeItem('access-token');

    return response;
  };

  static async refreshTokens(): Promise<AxiosResponse<refreshTokensSuccessObj>> {
    return $host.put<refreshTokensSuccessObj>(`${mainUserApiPath}/refresh`);
  };
} 