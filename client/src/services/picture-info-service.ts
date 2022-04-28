import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { IDeletPictureInfoResponseeObj } from "../interfaces/http/response/picture-info-interfaces";

class PictureInfoService {
  static async deletePictureInfo(pictureId: number, pictureInfoId: number): Promise<AxiosResponse<IDeletPictureInfoResponseeObj>> {
    const response = await $authHost.delete<IDeletPictureInfoResponseeObj>("/api/picture-info/delete",
      {
        params: {
          pictureId,
          pictureInfoId
        }
      }
    );

    return response;
  }
};

export default PictureInfoService;