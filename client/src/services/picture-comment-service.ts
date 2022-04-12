import { AxiosResponse } from "axios";
import { $host } from "../http";
import { IGetCommentsResponseObj } from "../interfaces/http/response/pictureCommentInterfaces";

class PictureCommentService {
  static async getPictureComments(pictureId: number, commentId?: number): Promise<AxiosResponse<IGetCommentsResponseObj[]>> {
    const response = $host.get<IGetCommentsResponseObj[]>("/api/picture-comment/get-many", { params: { pictureId, commentId } });

    return response;
  };
};

export default PictureCommentService;