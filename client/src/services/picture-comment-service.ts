import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreateCommentResponseObj, IDeleteCommentResponseObj, IEditCommentResponseObj, IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../interfaces/http/response/pictureCommentInterfaces";

class PictureCommentService {
  static async getPictureComment(commentId: string | number): Promise<AxiosResponse<IGetCommentByIdResponseObj>> {
    return $host.get<IGetCommentByIdResponseObj>(`/api/picture-comment/get/${commentId}`);
  };

  static async getPictureComments(
    pictureId: number,
    key: string,
    id: number,
    value: string | number,
    order: "ASC" | "DESC",
    commentId?: number | null,
    limit?: number): Promise<AxiosResponse<IGetCommentsResponseObj>> {
    return $host.get<IGetCommentsResponseObj>("/api/picture-comment/get-many",
      {
        params:
          { pictureId, commentId, cursor: { key, id, value, order }, limit }
      });
  };

  static async addComment(pictureId: string | number, text: string, commentId?: number | null): Promise<AxiosResponse<ICreateCommentResponseObj>> {
    return $authHost.post<ICreateCommentResponseObj>(
      "/api/picture-comment/add",
      { pictureId, text, commentId: commentId || null }
    );
  }

  static async editComment(commentId: string | number, text: string): Promise<AxiosResponse<IEditCommentResponseObj>> {
    return $authHost.put<IEditCommentResponseObj>("/api/picture-comment/edit", { commentId, text });
  };

  static async deleteComment(commentId: string | number): Promise<AxiosResponse<IDeleteCommentResponseObj>> {
    return $authHost.delete<IDeleteCommentResponseObj>(`/api/picture-comment/delete/${commentId}`);
  };
};

export default PictureCommentService;