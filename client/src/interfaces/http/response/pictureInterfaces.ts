interface mainPictureObjectProps {
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
  // comments: {
  //   id: number,
  //   text: string,
  //   createdAt: string,
  //   updatedAt: string,
  //   userId: number,
  //   commentId: number | null,
  //   pictureId: string
  // }[]
}

export interface IGetPicturesResponse {
  count: number,
  rows: IShortPictureObj[]
}