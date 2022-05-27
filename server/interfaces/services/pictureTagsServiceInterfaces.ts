export interface IGetTagsCursor {
  key: string,
  id: number,
  value: string | number,
  order: "ASC" | "DESC"
}