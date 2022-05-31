export interface IGetPictureTagsCursor {
  [key: string]: string | number,
  key: string,
  id: number,
  value: string | number,
  order: "ASC" | "DESC"
}