import { AxiosResponse } from "axios";
import { $host } from "../http";
import { ITagsByTextResponseObj } from "../interfaces/http/response/pictureTagInterfaces";

class PictureTagService {
  static async getTagByTagText(tagText: string): Promise<AxiosResponse<ITagsByTextResponseObj[]>> {
    const response = await $host.get<ITagsByTextResponseObj[]>(`/api/picture-tag/get-by-text${tagText ? `?tagText=${tagText}` : ''}`);

    return response;
  }
}

export default PictureTagService;