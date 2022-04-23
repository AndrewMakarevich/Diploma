import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { editUserSuccesObj, resetPassSuccesObj, userResObject } from "../interfaces/http/response/userInterfaces";

export default class UserService {
  static async getInfoAboutMyself(): Promise<AxiosResponse<userResObject>> {
    const response = await $authHost.get<userResObject>('/api/user/myself');

    return response;
  };

  static async getUserInfo(userId: number): Promise<AxiosResponse<userResObject>> {
    const response = await $host.get<userResObject>(`/api/user/get/${userId}`);

    return response;
  }

  static async editInfoAboutMyself(infoToEdit: FormData): Promise<AxiosResponse<editUserSuccesObj>> {
    const response = await $authHost.put<editUserSuccesObj>('/api/user/edit', infoToEdit);
    return response;
  };

  static async resetAccountPassword(newPassword: string): Promise<AxiosResponse<resetPassSuccesObj>> {
    const response = await $authHost.put<resetPassSuccesObj>('/api/user/resetPass', { newPassword });
    return response;
  }
}