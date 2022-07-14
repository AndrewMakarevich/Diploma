import { ComponentProps } from "react";

import btnStyles from "./invisible-button.module.css";

interface InvisibleBtnProps extends ComponentProps<"button"> { }

const InvisibleButton = ({ className, ...restProps }: InvisibleBtnProps) => {
  const invBtnClassName = `${className || ""} ${btnStyles["invinsible-btn-standart"]}`
  return (
    <button className={invBtnClassName} {...restProps}></button>
  )
};

export default InvisibleButton;