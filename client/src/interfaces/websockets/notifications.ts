export interface IRecievedSenderObj {
  id: number,
  nickname: string,
  avatar: string
}

export interface IGetNotifAmountData {
  count: number | "plus" | "minus"
}

export interface IRecievedNotificationObj {
  [key: string]: any,
  id: number,
  message: string,
  checked: boolean,
  createdAt: string,
  updatedAt: string,
  senderId: number,
  sender?: IRecievedSenderObj
}

export interface IGetRecievedNotificationsData {
  notifications: IRecievedNotificationObj[] | IRecievedNotificationObj
}