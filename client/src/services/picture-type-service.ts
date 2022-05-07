import { AxiosResponse } from "axios";
import { $host } from "../http";
import { IGetPictureTypesResponseObj } from "../interfaces/http/response/picture-type-interfaces";

class PictureTypeService {
  static async getPicturesTypes(queryString?: string, page?: number, limit?: number): Promise<AxiosResponse<IGetPictureTypesResponseObj>> {
    const response = await $host.get<IGetPictureTypesResponseObj>('/api/picture-type/get-all', {
      params: {
        queryString,
        page,
        limit
      }
    });

    return response;
  }
}

export default PictureTypeService;