import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { userResObject } from "../interfaces/http/resposne/userInterfaces";

export default class UserService {
  static async getInfoAboutMyself(): Promise<AxiosResponse<userResObject>> {
    const response = await $authHost.get<userResObject>('/api/user/myself');
    return response;
  }
}