import { useEffect, useState } from "react";

import notificatorStyles from "./loading-notificator.module.css";
import commonStyles from "../../styles/common-styles.module.css";

interface INotificatorProps {
  isLoading: boolean,
  text?: string
};

const LoadingNotificator = ({ isLoading, text = "Loading" }: INotificatorProps) => {
  const [loadingState, setLoadingState] = useState(isLoading);
  function setLoadingStateToFalse() {
    setLoadingState(false);
  }
  const notificatorClass = `
  ${notificatorStyles["notificator-container"]} 
  ${loadingState ? commonStyles["smooth-appeared"] : commonStyles["smooth-disappeared"]} 
  `

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isLoading) {
      timeout = setTimeout(setLoadingStateToFalse, 300);
      return;
    }

    setLoadingState(true);

    return () => {
      clearTimeout(timeout)
    }
  }, [isLoading]);

  return <div className={notificatorClass}>
    {text}
  </div>
};

export default LoadingNotificator;