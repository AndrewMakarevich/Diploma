import websocket from "../../websockets";
import { basicMessageToSend } from "../websockets";

class NotificationService {
  static getRecievedNotifications(message: basicMessageToSend): void {
    return websocket.send(JSON.stringify(message));
  }
};

export default NotificationService;