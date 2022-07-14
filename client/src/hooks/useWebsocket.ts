import { useEffect } from "react";

const useWebsocket = (
  websocket: WebSocket,
  onOpen: (ev?: Event) => void,
  onMessage: (ev: MessageEvent<any>) => void,
  onClose: (ev: CloseEvent) => void,
  onError: (ev: ErrorEvent) => void) => {

  useEffect(() => {
    if (websocket.readyState === 0) {
      websocket.addEventListener("open", onOpen);
    } else {
      onOpen();
    }
  }, [])
};

export default useWebsocket;