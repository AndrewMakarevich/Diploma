interface mainPictureObjectProps {
  [key: string]: any,
  id: number,
  img: string,
  mainTitle: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  pictureTypeId: string | null,

}

export interface IShortPictureObj extends mainPictureObjectProps {
  user: {
    nickname: string
  },
  likesAmount: number,
  commentsAmount: number
}

export interface IExtendedPictureObj extends mainPictureObjectProps {
  rootCommentsAmount: number,
  user: {
    id: string | number,
    nickname: string,
    firstName: string,
    surname: string,
    avatar: string
  },
  pictureInfos: {
    id: number,
    title: string,
    description: string,
    createdAt: string,
    updatedAt: string
  }[],
  tags: {
    id: number,
    text: string
  }[],
}

export interface ICreatePictureResponse {
  errors: string[],
  picture: IShortPictureObj
}

export interface IGetPicturesResponse {
  rows: IShortPictureObj[]
}

export interface IEditPictureResponse {
  errors: string[],
  picture: IExtendedPictureObj
}

export interface IDeletePictureResponse {
  message: string;
}