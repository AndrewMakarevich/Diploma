import { IGetCommentByIdResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";


export interface ICommentListProps {
  userId: string | number,
  pictureId: string | number,
  pictureAuthorId: string | number,
  commentId?: string | number,
  commentsAmount?: string | number | null,
}

export interface ICommentItemProps {
  comment: IGetCommentByIdResponseObj,
  pictureAuthorId: string | number,
  userId: string | number,
  actualizeCommentListAfterDeleting: (commentId: string | number) => void;
}