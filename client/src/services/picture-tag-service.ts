import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IDeletePictureTagConnectionResponseObj, ITagsByTextResponseObj } from "../interfaces/http/response/pictureTagInterfaces";

class PictureTagService {
  static async getTagByTagText(tagText: string): Promise<AxiosResponse<ITagsByTextResponseObj[]>> {
    const response = await $host.get<ITagsByTextResponseObj[]>(`/api/picture-tag/get-by-text${tagText ? `?tagText=${tagText}` : ''}`);

    return response;
  }

  static async deletePictureTagConnection(pictureId: number, tagId: number): Promise<AxiosResponse<IDeletePictureTagConnectionResponseObj>> {
    const response = await $authHost.delete<IDeletePictureTagConnectionResponseObj>("/api/picture-tag/delete-connection", {
      params: {
        pictureId,
        tagId
      }
    });

    return response;
  }
}

export default PictureTagService;