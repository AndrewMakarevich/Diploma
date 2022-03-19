import { useContext, useState } from "react";
import { Context } from "../../..";
import UserValidator from "../../../validator/userValidator";
import btnStyles from './login-btn.module.css'

const LoginBtn = ({ email, password, stylesById }: { email: string, password: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={btnStyles['log-btn']}
      disabled={isLoading}
      id={stylesById}
      onClick={(e) => {
        e.preventDefault();

        if (UserValidator.validateEmail(email) && UserValidator.validatePassword(password)) {
          setIsLoading(true);
          userStore.login(email, password).then(() => setIsLoading(false));
        }
      }
      }>
      Authentificate
    </button>
  )
};
export default LoginBtn;