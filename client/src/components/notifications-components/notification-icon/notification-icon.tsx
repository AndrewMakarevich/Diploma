import { useEffect, useState } from "react";
import BellIcon from "../../../assets/img/icons/bell-icon/bell-icon";
import { IErrorMessage, IGetNotifAmountData } from "../../../interfaces/websockets";
import InvisibleButton from "../../../UI/invisible-button/invisible-button";
import websocket from "../../../websockets";
import { ErrorRoutes, NotificationRoutes } from "../../../websockets/consts";
import SidePopup from "../../side-popup/side-popup";
import RecievedNotificationsPopup from "../recieved-notifications-popup/recieved-notifications-popup";

import iconStyles from "./notification-icon.module.css";

const NotificationIcon = () => {
  const [unreadNotifAmount, setUnreadNotifAmount] = useState(0);
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const OnIconClick = () => {
    setPopupIsOpen((prevPopupState) => !prevPopupState)
  }

  const OnPopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  useEffect(() => {
    const onMessage = (message: MessageEvent<any>) => {
      const parsedMessage = JSON.parse(message.data);
      switch (parsedMessage.event) {
        case NotificationRoutes.getRecievedNotificationsAmount:
          {
            const payload: IGetNotifAmountData["count"] = parsedMessage.data;

            if (payload === "plus") {
              setUnreadNotifAmount((prevVal) => prevVal + 1)
            } else {
              setUnreadNotifAmount(payload);
            }

            break;
          }
        case ErrorRoutes.standartError:
          const payload: IErrorMessage = parsedMessage;
          alert(payload.error)
      }
    };

    const onOpen = () => {
      websocket.send(JSON.stringify({ event: NotificationRoutes.getRecievedNotificationsAmount, payload: { token: localStorage.getItem("access-token") } }));
      websocket.addEventListener("message", onMessage);
    };

    if (websocket.readyState === 0) {
      websocket.addEventListener("open", onOpen);
    } else if (websocket.readyState === 1) {
      onOpen();
    }

    return () => {
      websocket.removeEventListener("message", onMessage);
      websocket.removeEventListener("open", onOpen)
    };
  }, []);

  return (
    <div className={iconStyles["notif-icon"]} onClick={OnIconClick}>
      <span className={iconStyles["notif-amount-span"]}>
        <p>{unreadNotifAmount}</p>
      </span>
      <InvisibleButton>
        <BellIcon />
      </InvisibleButton>
      <RecievedNotificationsPopup onClick={OnPopupClick} isOpen={popupIsOpen} setIsOpen={setPopupIsOpen} />
    </div>
  )
};

export default NotificationIcon;