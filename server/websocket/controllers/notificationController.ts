import { Server } from "ws";
import UserDto from "../../dtos/userDto";
import { INotificationInstance } from "../../interfaces/modelInterfaces";
import { IOnMessageData, IReturnedMessageObj, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";
import NotificationService from "../../services/notificationService";
import { IRejectObj } from "../middlewares";
import { NotificationRoutes } from "../routes/consts";

class NotificationController {
  private static sendMessageToClient<T>(client: IUnifiedWebSocket, message: IReturnedMessageObj<T>) {
    console.log((message.data as any)[0].dataValues);
    client.send(JSON.stringify(message));
  };

  static async getRecievedNotificationsAmount(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData): Promise<void | IRejectObj> {
    try {
      const { id: recieverId } = data.user;
      const response = await NotificationService.getRecievedNotificationsAmount(recieverId);
      NotificationController.sendMessageToClient<number>(ws, { event: NotificationRoutes.getRecievedNotificationsAmount, data: response })
    } catch (e: any) {
      return e as IRejectObj;
    }
  };

  static async getRecievedNotifications(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData): Promise<void | IRejectObj> {
    try {
      const { id: recieverId } = data.user;
      const { senderId, cursor, limit, queryString, notificationTypeId } = data.payload;
      const response = await NotificationService.getRecievedNotifications(recieverId, senderId, cursor, limit, queryString, notificationTypeId);

      NotificationController.sendMessageToClient(ws, { event: NotificationRoutes.getRecievedNotifications, data: response })
      ws.isNotificationBarOpened = true;

      return;
    } catch (e: any) {
      return e as IRejectObj;
    }
  };

  static async createNotification(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData): Promise<void | IRejectObj> {
    try {
      const { id: senderId } = data.user as UserDto;
      const { message, recieversIds, notificationTypeId } = data.payload;
      const { correctRecieverIds, errors, notification } = await NotificationService.createNotification(message, notificationTypeId, senderId, recieversIds);

      correctRecieverIds.forEach(recieverId => {
        for (let client of wss.clients) {
          if (client.userId === recieverId) {

            if (client.isNotificationBarOpened) {
              NotificationController.sendMessageToClient(
                client,
                { event: NotificationRoutes.getRecievedNotifications, data: notification })
            };

            NotificationController.sendMessageToClient(client, { event: NotificationRoutes.getRecievedNotificationsAmount, data: "plus" })
          }
        }
      });

      NotificationController.sendMessageToClient(ws, { event: NotificationRoutes.addNotifications, data: errors, forSender: true })
      return;
    } catch (e) {
      return e as IRejectObj;
    }
  };

  static async editNotification(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData): Promise<void | IRejectObj> {
    try {
      const { notificationId, message, recieversIdsToDisconnect, recieversIdsToConnect } = data.payload;
      const response = await NotificationService.editNotification(notificationId, message, recieversIdsToDisconnect, recieversIdsToConnect);

      response.newRecieversIdsToNotify.forEach(recieverId => {
        wss.clients.forEach(client => {
          if (client.userId == recieverId) {
            NotificationController.sendMessageToClient(client, { event: NotificationRoutes.getRecievedNotificationsAmount, data: "plus" })

            if (client.isNotificationBarOpened) {
              NotificationController.sendMessageToClient(
                client,
                { event: NotificationRoutes.getRecievedNotifications, data: response.notification })
            };
          };
        });
      });

      response.oldRecieversIdsToNotify.forEach(recieverId => {
        wss.clients.forEach(client => {
          if (client.userId == recieverId && client.isNotificationBarOpened) {
            NotificationController.sendMessageToClient(client, { event: NotificationRoutes.editNotification, data: [response.notification] })
          };
        });
      });

      response.disconnectedRecieversToNotify.forEach(reciever => {
        wss.clients.forEach(client => {
          if (client.userId == reciever.id) {
            if (client.isNotificationBarOpened) {
              NotificationController.sendMessageToClient(client, { event: NotificationRoutes.deleteNotification, data: notificationId })
            }

            if (!reciever.checked) {
              NotificationController.sendMessageToClient(client, { event: NotificationRoutes.getRecievedNotificationsAmount, data: "minus" })
            }
          };
        });
      });

      NotificationController.sendMessageToClient(ws, { event: NotificationRoutes.editNotification, data: response.errors, forSender: true })
    } catch (e) {
      return e as IRejectObj;
    }
  };

  static async deleteNotification(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData): Promise<void | IRejectObj> {
    const { notificationId } = data.payload;
    const response = await NotificationService.deleteNotification(notificationId);

    response.deletedNotification.users?.forEach(user => {
      wss.clients.forEach(client => {
        if (client.userId === user.id) {
          if (!user.usersNotifications.checked) {
            this.sendMessageToClient(client, { event: NotificationRoutes.getRecievedNotificationsAmount, data: "minus" })
          }

          if (client.isNotificationBarOpened) {
            this.sendMessageToClient(client, { event: NotificationRoutes.deleteNotification, data: response.deletedNotification.id })
          }
        }
      })
    });

    this.sendMessageToClient(ws, { event: NotificationRoutes.deleteNotification, data: "Notification deleted successfully", forSender: true })
  };
};

export default NotificationController;