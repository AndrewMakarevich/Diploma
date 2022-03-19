import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { editUserSuccesObj, userResObject } from "../interfaces/http/resposne/userInterfaces";

export default class UserService {
  static async getInfoAboutMyself(): Promise<AxiosResponse<userResObject>> {
    const response = await $authHost.get<userResObject>('/api/user/myself');

    return response;
  };

  static async editInfoAboutMyself(infoToEdit: FormData) {
    const response = await $authHost.put<editUserSuccesObj>('/api/user/edit', infoToEdit);

    return response;
  };
}