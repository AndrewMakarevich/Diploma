import { Component, useContext, useState } from "react";
import { Context } from "../../..";
import StandartButton from "../../../UI/standart-button/standart-button";
import UserValidator from "../../../validator/userValidator";
import btnStyles from './login-btn.module.css'

const LoginBtn = ({ email, password, stylesById }: { email: string, password: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StandartButton
      className={btnStyles['log-btn']}
      disabled={isLoading}
      id={stylesById}
      onClick={(e: React.ChangeEvent<any>) => {
        e.preventDefault();

        if (UserValidator.validateEmail(email) && UserValidator.validatePassword(password)) {
          setIsLoading(true);
          userStore.login(email, password).then(() => setIsLoading(false));
        }
      }
      }>
      Authentificate
    </StandartButton>
  )
};
export default LoginBtn;