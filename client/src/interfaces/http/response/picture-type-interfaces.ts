export interface pictureTypeObj {
  [key: string]: string | number,
  id: number,
  name: string,
  userId: number,
  createdAt: string,
  updatedAt: string,
  picturesAmount: number
}

export interface IGetPictureTypesResponseObj {
  count: number,
  rows: pictureTypeObj[]
}

export interface ICreatePictureTypeResponseObj {
  message: string,
  pictureType: pictureTypeObj
}

export interface IDeletePictureTypeResponseObj {
  message: string
}

export interface IEditPictureTypeResponseObj {
  message: string
}