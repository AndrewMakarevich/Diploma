import { ICursor } from "../pagination";

export interface IGetCommentsCursorInterface extends ICursor {
}

export interface IGetCommentsPagParams extends IGetCommentsCursorInterface {
  limit: number
}