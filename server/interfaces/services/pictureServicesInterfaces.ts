interface mainPictureObjectProps {
  id: number,
  img: string,
  mainTitle: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  pictureTypeId: number | null,

}

export interface IShortPictureObj extends mainPictureObjectProps {
  user: {
    nickname: string
  },
  likesAmount: number,
  commentsAmount: number
}

export interface ICreatePictureService {
  message: string,
  picture: IShortPictureObj
}