import { ComponentProps } from "react";
import StandartButton from "../standart-button/standart-button";
import btnStyles from "./delete-button.module.css"

const DeleteButton = ({ className, children, ...restProps }: ComponentProps<"button">) => {
  return (
    <StandartButton type="button" className={`${btnStyles["delete-button"]} ${className || ""}`} {...restProps}>
      {children}
    </StandartButton>
  )
};

export default DeleteButton;