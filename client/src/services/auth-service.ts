import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { loginSuccessObj, logoutSuccessObj, refreshTokensSuccessObj, registrationSuccessObj } from "../interfaces/http/resposne/authInterfaces";
const mainUserApiPath = 'api/user';

export default class AuthService {
  static async registrate(email: string, nickname: string, password: string): Promise<AxiosResponse<registrationSuccessObj>> {
    const response = await $host.post<registrationSuccessObj>(`${mainUserApiPath}/registration`, { email, nickname, password });

    return response;
  };

  static async login(email: string, password: string): Promise<AxiosResponse<loginSuccessObj>> {
    const response = await $host.post<loginSuccessObj>(`${mainUserApiPath}/login`, { email, password });

    return response;
  };

  static async logout(): Promise<AxiosResponse<logoutSuccessObj>> {
    const response = $authHost.delete<logoutSuccessObj>(`${mainUserApiPath}/logout`);
    localStorage.removeItem('access-token');

    return response;
  };

  static async refreshTokens(): Promise<AxiosResponse<refreshTokensSuccessObj>> {
    const response = await $host.put<refreshTokensSuccessObj>(`${mainUserApiPath}/refresh`);

    return response;
  };
} 