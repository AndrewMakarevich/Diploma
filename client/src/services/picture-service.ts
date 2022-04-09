import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IExtendedPictureObj, IShortPictureObj } from "../interfaces/http/response/pictureInterfaces";

class PictureService {
  static async getPicture(id: number): Promise<AxiosResponse<IExtendedPictureObj>> {
    const response = await $host.get<IExtendedPictureObj>(`api/picture/get/${id}`);

    return response;
  };

  static async getPictures(userId?: number, queryString?: string, sort?: string[], page?: number, limit?: number): Promise<AxiosResponse<IShortPictureObj[]>> {
    const response =
      await $host.get<IShortPictureObj[]>('api/picture/get-many',
        {
          params: {
            userId: userId || '',
            queryString: queryString || '',
            sort: sort || '',
            page: page || 1,
            limit: limit || 5
          }
        });

    return response;
  };

  static async createPicture(pictureInfo: FormData) {
    const response = await $authHost.post('api/picture/create', pictureInfo);
    return response;
  };
}

export default PictureService;