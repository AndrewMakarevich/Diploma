import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IGetPictureLikesResponseObj, IPictureLikeResponseObj } from "../interfaces/http/response/pictureLikeInterfaces";

class PictureLikeService {
  static async likePicture(pictureId: number): Promise<AxiosResponse<IPictureLikeResponseObj>> {
    return $authHost.post<IPictureLikeResponseObj>("/api/picture-like/like", { pictureId });
  };

  static async getPictureLikes(pictureId: number): Promise<AxiosResponse<IGetPictureLikesResponseObj[]>> {
    return $host.get<IGetPictureLikesResponseObj[]>(`/api/picture-like/get/${pictureId}`);
  }
};

export default PictureLikeService;