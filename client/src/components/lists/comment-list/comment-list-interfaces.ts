export interface ICommentListProps {
  userId: string | number,
  pictureId: string | number,
  commentId?: string | number,
  commentsAmount?: string | number | null,
}

export interface ICommentItemProps {
  commentId: string | number,
  userId: string | number,
}