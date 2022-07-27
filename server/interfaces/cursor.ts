export interface ICursor {
  key: string,
  value: string | number,
  id: number,
  order: "ASC" | "DESC"
}