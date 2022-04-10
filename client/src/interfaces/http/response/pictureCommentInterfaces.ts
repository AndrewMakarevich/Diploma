export interface IGetPictureCommentsResponseObj {
  id: number,
  text: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  commentId: number | null,
  pictureId: number,
  commentLikes:
  {
    userId: number
  }[]
};