import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IShortPictureObj } from "../interfaces/http/response/pictureInterfaces";

class PictureService {
  static async getPictures(userId: number, queryString: string, sort: string[], page: number, limit: number): Promise<AxiosResponse<IShortPictureObj[]>> {
    const response =
      await $host.get<IShortPictureObj[]>(`api/picture/get-many?userId=${userId || ""}&queryString=${queryString || ""}&sort=${sort}&page=${page || ""}&limit=${limit || ""}`);

    return response;
  };

  static async createPicture(pictureInfo: FormData) {
    const response = await $authHost.post('api/picture/create', pictureInfo);
    return response;
  };
}

export default PictureService;