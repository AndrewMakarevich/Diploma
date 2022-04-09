import { ComponentProps } from "react";
import StandartButton from "../standart-button/standart-button";
import btnStyles from "./delete-button.module.css"

const DeleteButton = (props: ComponentProps<any>) => {
  const { className, ...restProps } = props;
  return (
    <StandartButton className={`${btnStyles["delete-button"]} ${className || ""}`} {...restProps}>
      {props.children}
    </StandartButton>
  )
};

export default DeleteButton;