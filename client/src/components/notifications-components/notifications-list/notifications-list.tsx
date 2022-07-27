import { useCallback, useEffect, useRef, useState } from "react";
import useDelayFetching from "../../../hooks/useDelayFetching";
import { ICursor } from "../../../interfaces/pagination";
import NotificationService from "../../../interfaces/services/notificationServer";
import { basicReturnedMessage } from "../../../interfaces/websockets";
import { IGetRecievedNotificationsData, IRecievedNotificationObj, IRecievedSenderObj } from "../../../interfaces/websockets/notifications";
import NoResultsNotificator from "../../../UI/no-results-notificator/no-results-notificator";
import websocket from "../../../websockets";
import { ErrorRoutes, NotificationRoutes } from "../../../websockets/consts";
import InfiniteScroll from "../../infinite-scroll/infinite-scroll";
import LoadingNotificator from "../../lodaing-notificator/loading-notificator";
import NotificationItem from "../notification-item/notificaion-item";
import NotificationSearchPanel from "../notification-search-panel/notification-search-panel";

import listStyles from "./notifications-list.module.css";

const NotificationsList = () => {
  const [rewrite, setRewrite] = useState(false);
  const rewriteRef = useRef(false);
  const waitingForRequest = useRef(false);
  const [recievedNotifications, setRecievedNotifications] = useState<IRecievedNotificationObj[]>([]);
  const [autoRecievedNotificationsIds, setAutoRecievedNotificationsIds] = useState<number[]>([]);
  const autoRecievedNotificationsIdsRef = useRef<number[]>([]);
  const [cursorState, setCursorState] = useState<ICursor>({
    id: 0,
    key: "createdAt",
    value: 0,
    order: "ASC"
  });
  const [queryString, setQueryString] = useState("");
  const [notificationTypeId, setNotificationTypeId] = useState<number | null | undefined>(undefined);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access-token"));
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [allNotificationsRecieved, setAllNotificationsRecieved] = useState(false);

  const setRewriteStateTo = useCallback((value: boolean) => async () => { setRewrite(value); rewriteRef.current = value }, []);

  const { executeCallback: setRewriteDelayedTrue } = useDelayFetching(setRewriteStateTo(true), 300);

  const setAutoRecievedNotificationsIdsTo = useCallback((value: number[]) => {
    setAutoRecievedNotificationsIds(value);
    autoRecievedNotificationsIdsRef.current = value;
  }, []);

  const getWebsocketMessage = useCallback((
    token: string | null = accessToken,
    cursor: ICursor = cursorState,
    queryStr = queryString,
    notificationTypeIdVal = notificationTypeId) => {
    return {
      event: NotificationRoutes.getRecievedNotifications,
      payload: {
        token,
        cursor,
        queryString: queryStr,
        notificationTypeId: notificationTypeIdVal
      },
    }
  }, [cursorState, accessToken, queryString, notificationTypeId]);

  const getNotifications = useCallback(async (rewrite: boolean, unmountFlag: React.MutableRefObject<boolean>) => {
    if ((allNotificationsRecieved || waitingForRequest.current) && !rewrite) {
      return;
    }

    let currentCursorState = cursorState;

    if (rewrite) {
      currentCursorState.id = 0;
      setCursorState(currentCursorState);
    }

    setAllNotificationsRecieved(true);
    setNotificationsLoading(true);
    NotificationService.getRecievedNotifications(getWebsocketMessage(undefined, currentCursorState))
  }, [allNotificationsRecieved, getWebsocketMessage, cursorState]);

  const onMessage = useCallback((message: MessageEvent<any>) => {
    const parsedMessage: basicReturnedMessage<any> = JSON.parse(message.data);

    switch (parsedMessage.event) {
      case NotificationRoutes.getRecievedNotifications:
        const notifications: IRecievedNotificationObj | IRecievedNotificationObj[] = parsedMessage.data;
        //If returned data type isn't array in context of this event, 
        //it means that api returned notification which was created right when user is active and automatically sent to the raleted users
        const newNotificationsPortion = Array.isArray(notifications) ?
          notifications.filter((data: IRecievedNotificationObj) => !autoRecievedNotificationsIdsRef.current.some(notif => notif === data.id))
          :
          [notifications];

        if (rewriteRef.current) {
          setRewriteStateTo(false)();
          setRecievedNotifications([...newNotificationsPortion]);
        } else {
          setRecievedNotifications((prevRecNotif) => [...prevRecNotif, ...newNotificationsPortion]);
        }

        if (!Array.isArray(notifications)) {
          setAutoRecievedNotificationsIdsTo([...autoRecievedNotificationsIdsRef.current, notifications.id]);
          return;
        }

        if (newNotificationsPortion.length) {
          const lastElem = newNotificationsPortion[newNotificationsPortion.length - 1];

          setCursorState((prevCursorState) => {
            return { ...prevCursorState, id: lastElem["id"], value: lastElem[prevCursorState.key] }
          });

          setAllNotificationsRecieved(false);
        };

        setNotificationsLoading(false);
        break;
      case NotificationRoutes.deleteNotification:
        setRecievedNotifications((prevRecievedNotif) => prevRecievedNotif.filter(notification => notification.id !== parsedMessage.data));
        break;
      case ErrorRoutes.standartError:
        break;
      default:
        break;
    }
  }, [setRewriteStateTo, setAutoRecievedNotificationsIdsTo]);

  const onOpen = useCallback(() => {
    websocket.addEventListener("message", onMessage)
  }, [onMessage]);

  const onQueryStringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
    setRewriteDelayedTrue()
  }, [setRewriteDelayedTrue]);

  const onOrderSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderParam = JSON.parse(e.target.value);
    setCursorState({ ...cursorState, key: orderParam[0], order: orderParam[1] });
    setRewriteStateTo(true)();
  }, [cursorState, setRewriteStateTo]);

  const onNotificationTypeSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '"undefined"') {
      setNotificationTypeId(undefined);
    } else if (e.target.value === "null") {
      setNotificationTypeId(null);
    } else {
      setNotificationTypeId(+e.target.value);
    }

    setRewriteStateTo(true)();
  }, [setRewriteStateTo]);

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
    <article className={listStyles["content-container"]}>
      <NotificationSearchPanel
        onQueryStringChange={onQueryStringChange}
        onOrderSelectChange={onOrderSelectChange}
        onNotificationTypeSelectChange={onNotificationTypeSelectChange}
        isLoading={notificationsLoading} />
      {
        Boolean(!notificationsLoading && !recievedNotifications.length) && <NoResultsNotificator />
      }
      <InfiniteScroll stopValue={allNotificationsRecieved} callback={getNotifications} rewrite={rewrite} maxHeight={"340px"}>
        <ul>
          {
            recievedNotifications.map(notification => (
              <NotificationItem notification={notification} />
            ))
          }
        </ul>
      </InfiniteScroll>
      <LoadingNotificator isLoading={notificationsLoading} />
    </article>
  )
};

export default NotificationsList;