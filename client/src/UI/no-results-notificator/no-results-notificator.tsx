import { ComponentProps } from "react";

import notificatorStyles from "./no-results-notificator.module.css";

interface notificatorProps extends ComponentProps<"div"> {
  text?: string
}

const NoResultsNotificator = ({ text = "No results", className, ...restProps }: notificatorProps) => {
  const notificatorClass = `${notificatorStyles["notificator-container"]} ${className ? className : ""}`;

  return <div className={notificatorClass} {...restProps}>{text}</div>
};

export default NoResultsNotificator;