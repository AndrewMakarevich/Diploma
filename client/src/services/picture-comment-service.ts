import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICreateCommentResponseObj, IDeleteCommentResponseObj, IEditCommentResponseObj, IGetCommentByIdResponseObj, IGetCommentsResponseObj } from "../interfaces/http/response/pictureCommentInterfaces";

class PictureCommentService {
  static async getPictureComment(commentId: string | number): Promise<AxiosResponse<IGetCommentByIdResponseObj>> {
    const response = await $host.get<IGetCommentByIdResponseObj>(`/api/picture-comment/get/${commentId}`);

    return response;
  };

  static async getPictureComments(pictureId: string | number, commentId?: string | number): Promise<AxiosResponse<IGetCommentsResponseObj[]>> {
    const response = await $host.get<IGetCommentsResponseObj[]>("/api/picture-comment/get-many", { params: { pictureId, commentId } });

    return response;
  };

  static async addComment(pictureId: string | number, text: string, commentId?: string | number): Promise<AxiosResponse<ICreateCommentResponseObj>> {
    const response = await $authHost.post<ICreateCommentResponseObj>(
      "/api/picture-comment/add",
      { pictureId, text, commentId: commentId || null }
    );

    return response;
  }

  static async editComment(commentId: string | number, text: string): Promise<AxiosResponse<IEditCommentResponseObj>> {
    const response = await $authHost.put<IEditCommentResponseObj>("/api/picture-comment/edit", { commentId, text });

    return response;
  };

  static async deleteComment(commentId: string | number): Promise<AxiosResponse<IDeleteCommentResponseObj>> {
    const response = await $authHost.delete<IDeleteCommentResponseObj>(`/api/picture-comment/delete/${commentId}`);
    console.log(response);
    return response;
  };
};

export default PictureCommentService;