export interface IGetCommentsResponseObj {
  id: string | number,
  childCommentsAmount: string | number,
  commentLikesAmount: string | number
};

export interface IGetCommentByIdResponseObj {
  id: string | number,
  text: string,
  createdAt: string,
  updatedAt: string,
  userId: string | number,
  commentId: string | number | null,
  pictureId: string | number,
  childCommentsAmount: string | number,
  commentLikes:
  {
    userId: string | number
  }[],
  user: {
    avatar: string,
    nickname: string
  }
}

export interface ICreateCommentResponseObj {
  message: string,
  comment: IGetCommentsResponseObj
};

export interface IEditCommentResponseObj {
  message: string,
}

export interface IDeleteCommentResponseObj {
  message: string,
}