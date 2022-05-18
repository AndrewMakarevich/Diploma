import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { ILikePictureCommentResponseObj } from "../interfaces/http/response/picture-comment-like-interfaces";

class PictureCommentLikeService {
  static async likePictureComment(commentId: string | number): Promise<AxiosResponse<ILikePictureCommentResponseObj>> {
    return $authHost.post<ILikePictureCommentResponseObj>('/api/picture-comment-like/like', { commentId });
  }
};

export default PictureCommentLikeService;