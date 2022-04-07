export interface IShortPictureObj {
  id: number,
  img: string,
  mainTitle: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  user: {
    nickname: string
  }
  pictureTypeId: number | null,
  likesAmount: number,
  commentsAmount: number
}

export interface IGetPicturesResponse {
  count: number,
  rows: IShortPictureObj[]
}