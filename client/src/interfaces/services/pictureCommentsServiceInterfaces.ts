export interface IGetCommentsCursorInterface {
  key: string,
  value: string | number,
  id: number,
  order: "ASC" | "DESC"
}

export interface IGetCommentsPagParams extends IGetCommentsCursorInterface {
  limit: number
}