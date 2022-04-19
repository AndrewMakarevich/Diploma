import { IGetCommentByIdResponseObj } from "../../../interfaces/http/response/pictureCommentInterfaces";


export interface ICommentListProps {
  pictureId: string | number,
  pictureAuthorId: string | number,
  commentId?: string | number,
  commentsAmount?: string | number | null,
}

export interface ICommentItemProps {
  comment: IGetCommentByIdResponseObj,
  pictureAuthorId: string | number,
  actualizeCommentListAfterDeleting: (commentId: string | number) => void;
}