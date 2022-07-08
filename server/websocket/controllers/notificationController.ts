import { Server } from "ws";
import UserDto from "../../dtos/userDto";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";
import NotificationService from "../../services/notificationService";
import { IRejectObj } from "../middlewares";
import { NotificationRoutes } from "../routes/consts";

class NotificationController {
  static async getRecievedNotificationsAmount(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {

  };

  static async getRecievedNotifications(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    try {
      const { id: recieverId } = data.user;
      const { cursor, limit } = data.payload;
      const response = await NotificationService.getRecievedNotifications(recieverId, cursor, limit);

      ws.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotifications, notifications: response }));
      ws.isNotificationBarOpened = true;

      return;
    } catch (e: any) {
      return e as IRejectObj;
    }
  };

  static async createNotification(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    try {
      const { id: senderId } = data.user as UserDto;
      const { message, recieversIds } = data.payload;
      const response = await NotificationService.createNotification(message, senderId, recieversIds);

      response.correctRecieverIds.forEach(recieverId => {
        for (let client of wss.clients) {
          if (client.userId === recieverId && client.isNotificationBarOpened) {
            client.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotifications, notifications: response.notification }));
            break;
          }
        }
      });

      ws.send(JSON.stringify({ event: NotificationRoutes.addNotifications, notification: response.notification, errors: response.errors }));

      return;
    } catch (e) {
      return e as IRejectObj;
    }
  };
};

export default NotificationController;