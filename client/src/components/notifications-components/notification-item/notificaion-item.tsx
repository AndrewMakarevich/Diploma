import { IRecievedNotificationObj, IRecievedSenderObj } from "../../../interfaces/websockets/notifications";
import itemStyles from "./notification-item.module.css";

interface IItemProps {
  notification: IRecievedNotificationObj,
}

const NotificationItem = ({ notification }: IItemProps) => {
  return (
    <li className={itemStyles["notification-item"]}>
      {
        notification.sender ? <p>{notification.sender.nickname}</p> : null
      }
      {notification.message}
    </li>
  )
};

export default NotificationItem;