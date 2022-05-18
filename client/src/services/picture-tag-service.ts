import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IDeletePictureTagConnectionResponseObj, ITagsByTextResponseObj } from "../interfaces/http/response/pictureTagInterfaces";

class PictureTagService {
  static async getTagByTagText(tagText: string): Promise<AxiosResponse<ITagsByTextResponseObj[]>> {
    return $host.get<ITagsByTextResponseObj[]>(`/api/picture-tag/get-by-text${tagText ? `?tagText=${tagText}` : ''}`);
  }

  static async deletePictureTagConnection(pictureId: number, tagIdValueOrArray: number | number[]): Promise<AxiosResponse<IDeletePictureTagConnectionResponseObj>> {
    return $authHost.delete<IDeletePictureTagConnectionResponseObj>("/api/picture-tag/delete-connection", {
      params: {
        pictureId,
        tagIdValueOrArray
      }
    });
  }
}

export default PictureTagService;