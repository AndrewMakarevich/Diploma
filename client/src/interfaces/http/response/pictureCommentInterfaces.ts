export interface IGetCommentsResponseObj {
  id: number,
  text: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  commentId: number | null,
  pictureId: number,
  childCommentsAmount: number,
  commentLikes:
  {
    userId: number
  }[],
  user: {
    avatar: string,
    nickname: string
  }
};