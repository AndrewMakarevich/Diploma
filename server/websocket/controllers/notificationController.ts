import { Server } from "ws";
import UserDto from "../../dtos/userDto";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";
import NotificationService from "../../services/notificationService";
import { IRejectObj } from "../middlewares";
import { NotificationRoutes } from "../routes/consts";

class NotificationController {
  static async getRecievedNotificationsAmount(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    try {
      const { id: recieverId } = data.user;
      const response = await NotificationService.getRecievedNotificationsAmount(recieverId);

      ws.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotificationsAmount, count: response }));
    } catch (e: any) {
      return e as IRejectObj;
    }
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
          if (client.userId === recieverId) {
            if (client.isNotificationBarOpened) {
              client.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotifications, data: [response.notification] }));
            };

            client.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotificationsAmount, data: "plus" }))
            break;
          }
        }
      });

      ws.send(JSON.stringify({ event: NotificationRoutes.addNotifications, data: response.errors, forSender: true }));

      return;
    } catch (e) {
      return e as IRejectObj;
    }
  };

  static async editNotification(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    try {
      const { notificationId, message, recieversIdsToDisconnect, recieversIdsToConnect } = data.payload;
      const response = await NotificationService.editNotification(notificationId, message, recieversIdsToDisconnect, recieversIdsToConnect);

      response.newRecieversIdsToNotify.forEach(recieverId => {
        wss.clients.forEach(client => {
          if (client.userId == recieverId) {
            client.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotificationsAmount, data: "plus" }));

            if (client.isNotificationBarOpened) {
              client.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotifications, data: [response.notification] }))
            };
          };
        });
      });

      response.oldRecieversIdsToNotify.forEach(recieverId => {
        wss.clients.forEach(client => {
          if (client.userId == recieverId && client.isNotificationBarOpened) {
            client.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotifications, data: [response.notification] }))
          };
        });
      });

      response.disconnectedRecieversToNotify.forEach(recieverId => {
        wss.clients.forEach(client => {
          if (client.userId == recieverId && client.isNotificationBarOpened) {
            client.send(JSON.stringify({ event: NotificationRoutes.deleteNotification, data: notificationId }))
          };
        });
      });

      ws.send(JSON.stringify({ event: NotificationRoutes.editNotification, data: response.errors, forSender: true }))
    } catch (e) {
      return e as IRejectObj;
    }
  };

  static async deleteNotification(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj> {
    const { notificationId } = data.payload;
    const response = await NotificationService.deleteNotification(notificationId);

    response.deletedNotification.users?.forEach(user => {
      wss.clients.forEach(client => {
        if (client.userId === user.id && client.isNotificationBarOpened) {
          client.send(JSON.stringify({ event: NotificationRoutes.deleteNotification, data: response.deletedNotification.id }))
        }
      })
    });

    ws.send(JSON.stringify({ event: NotificationRoutes.deleteNotification, data: "Notification deleted successfully", forSender: true }))
  };
};

export default NotificationController;