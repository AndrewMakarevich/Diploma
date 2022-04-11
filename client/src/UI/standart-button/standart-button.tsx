import { ComponentProps } from "react";
import btnStyles from "./standart-button.module.css";

const StandartButton = ({ className, children, ...restProps }: ComponentProps<"button">) => {
  return (
    <button className={`${btnStyles["button"]} ${className || ""}`} {...restProps}>
      {children}
    </button>
  )
};

export default StandartButton;