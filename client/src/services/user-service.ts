import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { editUserSuccesObj, resetPassSuccesObj, userResObject } from "../interfaces/http/resposne/userInterfaces";

export default class UserService {
  static async getInfoAboutMyself(): Promise<AxiosResponse<userResObject>> {
    const response = await $authHost.get<userResObject>('/api/user/myself');

    return response;
  };

  static async editInfoAboutMyself(infoToEdit: FormData) {
    const response = await $authHost.put<editUserSuccesObj>('/api/user/edit', infoToEdit);
    return response;
  };

  static async resetAccountPassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<resetPassSuccesObj>> {
    const response = await $authHost.put<resetPassSuccesObj>('/api/user/resetPass', { oldPassword, newPassword });
    return response;
  }
}