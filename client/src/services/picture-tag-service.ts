import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreateTagResponse, IDeletePictureTagConnectionResponseObj, IDeleteTagResponse, IEditTagResponse, IGetTagsResponse, ITagsByTextResponseObj } from "../interfaces/http/response/pictureTagInterfaces";
import { IGetPictureTagsCursor } from "../interfaces/services/pictureTagsInterfaces";

class PictureTagService {
  static async getTagByTagText(tagText: string): Promise<AxiosResponse<ITagsByTextResponseObj[]>> {
    return $host.get<ITagsByTextResponseObj[]>(`/api/picture-tag/get-by-text${tagText ? `?tagText=${tagText}` : ''}`);
  };

  static async getTags(queryString: string = "", cursor: IGetPictureTagsCursor, limit = 5): Promise<AxiosResponse<IGetTagsResponse>> {
    return $host.get<IGetTagsResponse>("/api/picture-tag/get-tags", {
      params: {
        queryString,
        cursor,
        limit
      }
    });
  };

  static async createTag(tagText: string): Promise<AxiosResponse<ICreateTagResponse>> {
    return $authHost.post<ICreateTagResponse>("/api/picture-tag/create", { text: tagText });
  };

  static async editTag(id: number, tagText: string): Promise<AxiosResponse<IEditTagResponse>> {
    return $authHost.put<IEditTagResponse>("/api/picture-tag/edit", { id, text: tagText });
  };

  static async deletePictureTagConnection(pictureId: number, tagIdValueOrArray: number | number[]): Promise<AxiosResponse<IDeletePictureTagConnectionResponseObj>> {
    return $authHost.delete<IDeletePictureTagConnectionResponseObj>("/api/picture-tag/delete-connection", {
      params: {
        pictureId,
        tagIdValueOrArray
      }
    });
  };

  static async deleteTag(id: number): Promise<AxiosResponse<IDeleteTagResponse>> {
    return $authHost.delete<IDeleteTagResponse>(`/api/picture-tag/delete/${id}`);
  };
}

export default PictureTagService;