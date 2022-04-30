import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { IDeletPictureInfoResponseeObj } from "../interfaces/http/response/picture-info-interfaces";

class PictureInfoService {
  static async deletePictureInfo(pictureId: number, pictureInfoIdValueOrArray: number | number[]): Promise<AxiosResponse<IDeletPictureInfoResponseeObj>> {
    console.log(pictureInfoIdValueOrArray);
    const response = await $authHost.delete<IDeletPictureInfoResponseeObj>("/api/picture-info/delete",
      {
        params: {
          pictureId,
          pictureInfoIdValueOrArray
        }
      }
    );

    return response;
  }
};

export default PictureInfoService;