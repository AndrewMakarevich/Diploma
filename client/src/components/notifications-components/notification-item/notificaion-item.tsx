import { IRecievedNotificationObj } from "../../../interfaces/websockets";
import itemStyles from "./notification-item.module.css";

interface IItemProps {
  notification: IRecievedNotificationObj
}

const NotificationItem = ({ notification }: IItemProps) => {
  return (
    <li className={itemStyles["notification-item"]}>
      <p>{notification.checked}</p>
      {notification.message}
    </li>
  )
};

export default NotificationItem;