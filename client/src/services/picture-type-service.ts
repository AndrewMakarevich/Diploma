import { AxiosResponse } from "axios";
import { $host } from "../http";
import { pictureTypeObj } from "../interfaces/http/response/pictureTypeInrefaces";

class PictureTypeService {
  static async getPicturesTypes(): Promise<AxiosResponse<pictureTypeObj[]>> {
    const response = await $host.get<pictureTypeObj[]>('/api/picture-type/get-all');

    return response;
  }
}

export default PictureTypeService;