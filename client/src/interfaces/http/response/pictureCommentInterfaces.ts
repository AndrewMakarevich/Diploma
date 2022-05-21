// export interface IGetCommentsResponseObj {
//   id: string | number,
//   childCommentsAmount: string | number,
//   commentLikesAmount: string | number
// };

export interface IGetCommentBaseResponseObject {
  [key: string]: any,
  id: number,
  text: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  commentId: number | null,
  pictureId: number,
}

export interface IGetCommentByIdResponseObj extends IGetCommentBaseResponseObject {
  childCommentsAmount: number,
  commentLikes:
  {
    userId: number
  }[],
  user: {
    avatar: string,
    nickname: string
  }
}

export interface IGetCommentsResponseObj {
  count: number,
  rows: IGetCommentByIdResponseObj[]
}

export interface ICreateCommentResponseObj {
  message: string,
  comment: IGetCommentBaseResponseObject
};

export interface IEditCommentResponseObj {
  message: string,
}

export interface IDeleteCommentResponseObj {
  message: string,
}