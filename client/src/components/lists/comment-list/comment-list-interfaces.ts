

export interface ICommentListProps {
  userId: string | number,
  pictureId: string | number,
  pictureAuthorId: string | number,
  commentId?: string | number,
  commentsAmount?: string | number | null,
}

export interface ICommentItemProps {
  commentId: string | number,
  pictureAuthorId: string | number,
  userId: string | number,
  actualizeCommentListAfterDeleting: (commentId: string | number) => void;
}