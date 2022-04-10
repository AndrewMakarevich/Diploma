import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IGetPictureLikesResponseObj, IPictureLikeResponseObj } from "../interfaces/http/response/pictureLikeInterfaces";

class PictureLikeService{
  static async likePicture(pictureId:number):Promise<AxiosResponse<IPictureLikeResponseObj>>{
    const response = await $authHost.post<IPictureLikeResponseObj>("/api/picture-like/like", {pictureId});

    return response;
  };

  static async getPictureLikes(pictureId:number):Promise<AxiosResponse<IGetPictureLikesResponseObj[]>>{
    const response = await $host.get<IGetPictureLikesResponseObj[]>(`/api/picture-like/get/${pictureId}`);

    return response;
  }
};

export default PictureLikeService;