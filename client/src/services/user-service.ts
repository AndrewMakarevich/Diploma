import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { editUserSuccesObj, resetPassSuccesObj, userResObject } from "../interfaces/http/response/userInterfaces";

export default class UserService {
  static async getInfoAboutMyself(): Promise<AxiosResponse<userResObject>> {
    return $authHost.get<userResObject>('/api/user/myself');
  };

  static async getUserInfo(userId: number): Promise<AxiosResponse<userResObject>> {
    return $host.get<userResObject>(`/api/user/get/${userId}`);
  }

  static async editInfoAboutMyself(infoToEdit: FormData): Promise<AxiosResponse<editUserSuccesObj>> {
    return $authHost.put<editUserSuccesObj>('/api/user/edit', infoToEdit)
  };

  static async resetAccountPassword(newPassword: string): Promise<AxiosResponse<resetPassSuccesObj>> {
    return $authHost.put<resetPassSuccesObj>('/api/user/resetPass', { newPassword })
  }
}