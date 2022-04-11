import { ComponentProps, useContext, useState } from "react";
import { Context } from "../../..";
import StandartButton from "../../../UI/standart-button/standart-button";
import UserValidator from "../../../validator/userValidator";
import btnStyles from "./login-btn.module.css";

interface ILoginButtonProps extends ComponentProps<"button"> {
  email: string;
  password: string;
  stylesById?: string;
}

const LoginBtn = ({
  email,
  password,
  stylesById,
  children,
  onClick,
  ...restProps
}: ILoginButtonProps) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StandartButton
      className={btnStyles["log-btn"]}
      disabled={isLoading}
      id={stylesById}
      onClick={(e: React.MouseEvent<any>) => {
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }

        if (
          UserValidator.validateEmail(email) &&
          UserValidator.validatePassword(password)
        ) {
          setIsLoading(true);
          userStore.login(email, password).then(() => setIsLoading(false));
        }
      }}
      {...restProps}
    >
      {children || "Authentificate"}
    </StandartButton>
  );
};
export default LoginBtn;
