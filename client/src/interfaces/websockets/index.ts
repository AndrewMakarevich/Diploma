
export interface IErrorMessage {
  event: string,
  code: number | string,
  error: string
}

export interface basicMessageToSend<T extends object = { [key: string]: any }> {
  event: string,
  payload: T
}

export interface basicReturnedMessage<T extends object = { [key: string]: any }> {
  event: string,
  data: T
}