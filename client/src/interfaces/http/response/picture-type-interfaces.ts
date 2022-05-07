export interface pictureTypeObj {
  id: number,
  name: string,
  userId: number
}

export interface IGetPictureTypesResponseObj {
  count: number,
  rows: pictureTypeObj[]
}