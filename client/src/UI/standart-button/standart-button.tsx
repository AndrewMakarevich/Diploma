import { ComponentProps } from "react";
import btnStyles from "./standart-button.module.css";

const StandartButton = (props: ComponentProps<any>) => {
  const { className, ...restProps } = props;
  return (
    <button className={`${btnStyles["button"]} ${className || ""}`} {...restProps}>
      {props.children}
    </button>
  )
};

export default StandartButton;