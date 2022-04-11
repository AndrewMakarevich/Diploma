import { ComponentProps, useContext, useState } from "react";
import { Context } from "../../..";
import StandartButton from "../../../UI/standart-button/standart-button";
import UserValidator from "../../../validator/userValidator";
import btnStyles from "./registration-btn.module.css";

interface IRegBtnProps extends ComponentProps<"button"> {
  email: string;
  nickname: string;
  password: string;
  repPassword: string;
}

const RegistrationBtn = ({
  email,
  nickname,
  password,
  repPassword,
  className,
  onClick,
  children,
  ...restProps
}: IRegBtnProps) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StandartButton
      className={`${btnStyles["reg-btn"]} ${className || ""}`}
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }

        if (password !== repPassword) {
          alert("Passwords aren't equal to each other");
          return;
        }

        if (
          UserValidator.validateEmail(email) &&
          UserValidator.validateNickname(nickname) &&
          UserValidator.validatePassword(password)
        ) {
          setIsLoading(true);
          userStore
            .registration(email, nickname, password)
            .then(() => setIsLoading(false));
        }
      }}
      {...restProps}
    >
      {children || "Registrate"}
    </StandartButton>
  );
};
export default RegistrationBtn;
