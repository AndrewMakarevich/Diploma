import { IGetCommentByIdResponseObj } from "../../../../interfaces/http/response/pictureCommentInterfaces";


export interface ICommentListProps {
  pictureId: number,
  pictureAuthorId: number,
  commentId?: number | null,
  commentsAmount: number,
}

export interface ICommentItemProps {
  comment: IGetCommentByIdResponseObj,
  pictureAuthorId: string | number,
  actualizeCommentListAfterDeleting: (commentId: number) => void;
}