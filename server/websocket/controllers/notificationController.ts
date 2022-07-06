import { WebSocket } from "ws";
import { IOnMessageData, ISocketQueryParams } from "../../interfaces/webSocket/message";
import NotificationService from "../../services/notificationService";
import { IRejectObj } from "../middlewares";

class NotificationController {
  static async getRecievedNotifications(ws: WebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    try {
      const { recieverId } = data.payload;
      const response = await NotificationService.getRecievedNotifications(recieverId);
      ws.send(JSON.stringify(response));
      return;
    } catch (e: any) {
      return e as IRejectObj;
    }
  };

  static async createNotification(ws: WebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    try {
      const { message, senderId, recieversIds } = data.payload;
      const response = await NotificationService.createNotification(message, senderId, recieversIds);
      ws.send(JSON.stringify(response));
      return;
    } catch (e) {
      return e as IRejectObj;
    }
  };
};

export default NotificationController;