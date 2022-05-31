export interface ITagResponseObj {
  [key: string]: string | number,
  id: number,
  text: string,
  createdAt: string,
  updatedAt: string
}

export interface ITagsByTextResponseObj {
  id: number,
  text: string,
  attachedPicturesAmount: string
}

export interface IGetTagsResponse {
  rows: ITagResponseObj[]
}

export interface ICreateTagResponse {
  message: string,
  tag: ITagResponseObj
}

export interface IEditTagResponse {
  message: string
}

export interface IDeleteTagResponse {
  message: string
}

export interface IDeletePictureTagConnectionResponseObj {
  errors: object[]
}