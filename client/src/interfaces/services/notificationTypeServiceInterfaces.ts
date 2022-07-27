export interface INotificationTypeObj {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string
};

export interface IGetNotificationTypesResponse {
  notificationTypes: INotificationTypeObj[]
};

export interface ICreateNotificationTypeResponse {
  notification: INotificationTypeObj
};

export interface IEditNotificationTypeResponse {
  message: string
};

export interface IDeleteNotificationTypeResponse {
  message: string
}