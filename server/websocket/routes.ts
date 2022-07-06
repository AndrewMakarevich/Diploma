import { WebSocket } from "ws";
import NotificationController from "./controllers/notificationController";
import { IOnMessageData, ISocketQueryParams } from "../interfaces/webSocket/message";
import socketMiddleware from "./middlewares";
import authSocketMiddleware from "./middlewares/authSocketMiddleware";
import roleSocketMiddleware from "./middlewares/roleSocketMiddleware";
import { rolePermissions } from "../enums/roles";

async function messageRoutes(ws: WebSocket, queryParams: ISocketQueryParams, message: string) {
  const data: IOnMessageData = JSON.parse(message)
  switch (data.event) {
    case "get-notifications":
      await socketMiddleware(ws, data, queryParams, authSocketMiddleware, NotificationController.getRecievedNotifications);
      break;
    case "add-notifications":
      await socketMiddleware(ws, data, queryParams, authSocketMiddleware, roleSocketMiddleware(rolePermissions.moderateNotifications), NotificationController.createNotification);
      break;
    default:
      break;
  }
};

export default messageRoutes;
