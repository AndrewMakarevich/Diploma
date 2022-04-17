import { AxiosResponse } from "axios";
import { $authHost } from "../http";
import { ILikePictureCommentResponseObj } from "../interfaces/http/response/picture-comment-like-interfaces";

class PictureCommentLikeService {
  static async likePictureComment(commentId: string | number): Promise<AxiosResponse<ILikePictureCommentResponseObj>> {
    const response = await $authHost.post<ILikePictureCommentResponseObj>('/api/picture-comment-like/like', { commentId });

    return response;
  }
};

export default PictureCommentLikeService;