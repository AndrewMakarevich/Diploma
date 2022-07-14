import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ICursor } from "../../../interfaces/pagination";
import { IRecievedNotificationObj } from "../../../interfaces/websockets";
import websocket from "../../../websockets";
import { ErrorRoutes, NotificationRoutes } from "../../../websockets/consts";
import InfiniteScroll from "../../infinite-scroll/infinite-scroll";
import NotificationItem from "../notification-item/notificaion-item";

interface IListProps {
  notifications: IRecievedNotificationObj[]
}

const NotificationsList = () => {
  const rewriteFlag = useRef(false);
  const waitingForRequest = useRef(false);
  const [recievedNotifications, setRecievedNotifications] = useState<IRecievedNotificationObj[]>([]);
  const [cursorState, setCursorState] = useState<ICursor>({
    id: 0,
    key: "createdAt",
    value: 0,
    order: "ASC"
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access-token"));
  const [allNotificationsRecieved, setAllNotificationsRecieved] = useState(false);

  const websocketMessage = useMemo(() => {
    return {
      event: NotificationRoutes.getRecievedNotifications,
      payload: {
        token: accessToken,
        cursor: cursorState
      }
    }
  }, [cursorState, accessToken]);

  const getNotifications = async (rewrite: boolean, unmountFlag: React.MutableRefObject<boolean>) => {
    if (allNotificationsRecieved || waitingForRequest.current) {
      return;
    }
    setAllNotificationsRecieved(true)
    websocket.send(JSON.stringify(websocketMessage));
  };

  const onMessage = useCallback((message: MessageEvent<any>) => {
    const parsedMessage = JSON.parse(message.data);

    switch (parsedMessage.event) {
      case NotificationRoutes.getRecievedNotifications:
        if (parsedMessage.data.length) {
          const lastElem = parsedMessage.data[parsedMessage.data.length - 1];
          setCursorState({ ...cursorState, id: lastElem["id"], value: lastElem[cursorState.key] })
          setRecievedNotifications((prevNotifState) => [...prevNotifState, ...parsedMessage.data]);
          setAllNotificationsRecieved(false);
        } else {
          setAllNotificationsRecieved(true);
        }
        break;
      case ErrorRoutes.standartError:
        break;
      default:
        break;
    }
  }, []);

  const onOpen = useCallback(() => {
    websocket.addEventListener("message", onMessage)
  }, [onMessage]);

  useEffect(() => {
    if (websocket.readyState === 0) {
      websocket.addEventListener("open", onOpen)
    } else {
      onOpen();
    }

    window.addEventListener("storage", (event) => {
      if (event.key === "access-token") {
        setAccessToken(event.newValue);
      }
    });

    return () => {
      websocket.removeEventListener("open", onOpen);
      websocket.removeEventListener("message", onMessage);
    }
  }, []);
  return (
    <InfiniteScroll stopValue={allNotificationsRecieved} callback={getNotifications} rewrite={rewriteFlag.current} maxHeight={"340px"}>
      <ul>
        {
          recievedNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        }
      </ul>
    </InfiniteScroll>
  )
};

export default NotificationsList;