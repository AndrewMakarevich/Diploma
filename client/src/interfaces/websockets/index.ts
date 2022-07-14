export interface IGetNotifAmountData {
  count: number | "plus"
}

export interface IRecievedNotificationObj {
  id: number,
  message: string,
  checked: boolean,
  createdAt: string,
  updatedAt: string,
  senderId: number
}

export interface IErrorMessage {
  event: string,
  code: number | string,
  error: string
}