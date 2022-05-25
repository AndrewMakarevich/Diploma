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

  const loginClickHandler = (e: React.MouseEvent<any>) => {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    try {
      UserValidator.validateEmail(email);
      UserValidator.validatePassword(password);
    } catch (e) {
      alert(e);
      return;
    }

    setIsLoading(true);
    userStore.login(email, password).then(() => setIsLoading(false));
  };

  return (
    <StandartButton
      className={btnStyles["log-btn"]}
      disabled={isLoading}
      id={stylesById}
      onClick={loginClickHandler}
      {...restProps}
    >
      {children || "Authentificate"}
    </StandartButton>
  );
};
export default LoginBtn;
