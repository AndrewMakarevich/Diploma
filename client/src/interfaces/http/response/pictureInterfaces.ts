interface mainPictureObjectProps {
  id: number,
  img: string,
  mainTitle: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  userId: number,
  pictureTypeId: number | null,
  likesAmount: number,
}

export interface IShortPictureObj extends mainPictureObjectProps {
  user: {
    nickname: string
  }
  commentsAmount: number
}

export interface IExtendedPictureObj extends mainPictureObjectProps {
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
  comments: {
    id: number,
    text: string,
    createdAt: string,
    updatedAt: string,
    userId: number,
    commentId: number | null,
  }
}

export interface IGetPicturesResponse {
  count: number,
  rows: IShortPictureObj[]
}