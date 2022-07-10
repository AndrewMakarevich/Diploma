import { Server, WebSocket } from "ws";
import NotificationController from "../controllers/notificationController";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";
import socketMiddleware from "../middlewares";
import authSocketMiddleware from "../middlewares/authSocketMiddleware";
import roleSocketMiddleware from "../middlewares/roleSocketMiddleware";
import { rolePermissions } from "../../enums/roles";
import { NotificationRoutes } from "./consts";

async function messageRoutes(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, queryParams: ISocketQueryParams, message: string) {
  const data: IOnMessageData = JSON.parse(message);
  switch (data.event) {
    case NotificationRoutes.getRecievedNotifications:
      await socketMiddleware(wss, ws, data, queryParams, authSocketMiddleware, NotificationController.getRecievedNotifications);
      break;
    case NotificationRoutes.getRecievedNotificationsAmount:
      await socketMiddleware(wss, ws, data, queryParams, authSocketMiddleware, NotificationController.getRecievedNotificationsAmount);
      break;
    case NotificationRoutes.addNotifications:
      await socketMiddleware(wss, ws, data, queryParams, authSocketMiddleware, roleSocketMiddleware(rolePermissions.moderateNotifications), NotificationController.createNotification);
      break;
    case NotificationRoutes.editNotification:
      await socketMiddleware(wss, ws, data, queryParams, authSocketMiddleware, NotificationController.editNotification);
    default:
      break;
  }
};

export default messageRoutes;
