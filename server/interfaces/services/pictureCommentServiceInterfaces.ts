export interface IGetCommentsCursor {
  key: string,
  value: string | number,
  id: number,
  order: "ASC" | "DESC"
}