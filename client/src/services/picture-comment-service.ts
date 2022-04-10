import { AxiosResponse } from "axios";
import { $host } from "../http";
import { IGetPictureCommentsResponseObj } from "../interfaces/http/response/pictureCommentInterfaces";

class PictureCommentService {
  static async getPictureComments(pictureId: number, commentId: number): Promise<AxiosResponse<IGetPictureCommentsResponseObj[]>> {
    const response = $host.get<IGetPictureCommentsResponseObj[]>("/api/picture-comment/get-many", { params: { pictureId, commentId } });

    return response;
  };
};

export default PictureCommentService;