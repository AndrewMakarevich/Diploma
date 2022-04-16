import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { IGetCommentsResponseObj } from "../interfaces/http/response/pictureCommentInterfaces";

class PictureCommentService {
  static async getPictureComments(pictureId: number, commentId?: number): Promise<AxiosResponse<IGetCommentsResponseObj[]>> {
    const response = $host.get<IGetCommentsResponseObj[]>("/api/picture-comment/get-many", { params: { pictureId, commentId } });

    return response;
  };

  static async editComment(commentId: number, text: string) {
    const response = $authHost.put("/api/picture-comment/edit", { commentId, text });

    return response;
  }
};

export default PictureCommentService;