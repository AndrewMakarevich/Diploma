import { AxiosResponse } from "axios";
import { $authHost, $host } from "../http";
import { ICursor } from "../interfaces/pagination";
import { ICreateNotificationTypeResponse, IDeleteNotificationTypeResponse, IEditNotificationTypeResponse, IGetNotificationTypesResponse } from "../interfaces/services/notificationTypeServiceInterfaces";

class NotificationTypeService {
  static getNotificationTypes(queryString: string, cursor: ICursor, limit?: number): Promise<AxiosResponse<IGetNotificationTypesResponse>> {
    return $host.get("/api/notification-type/get", { params: { queryString, cursor, limit } })
  };

  static createNotificationType(name: string): Promise<AxiosResponse<ICreateNotificationTypeResponse>> {
    return $authHost.post("/api/notification-type/create", { name });
  };

  static editNotificationType(notificationTypeId: number, name: string): Promise<AxiosResponse<IEditNotificationTypeResponse>> {
    return $authHost.put("/api/notification-type/edit", { notificationTypeId, name });
  };

  static deleteNotificationType(notificationTypeId: number): Promise<AxiosResponse<IDeleteNotificationTypeResponse>> {
    return $authHost.delete("/api/notification-type/delete", { params: { notificationTypeId } });
  };
};

export default NotificationTypeService;