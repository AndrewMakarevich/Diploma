import { useContext, useState } from "react";
import { Context } from "../../..";
import btnStyles from './login-btn.module.css'

const LoginBtn = ({ email, password, stylesById }: { email: string, password: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className={btnStyles['log-btn']}
      disabled={isLoading}
      id={stylesById}
      onClick={() => {
        setIsLoading(true);
        userStore.login(email, password).then(() => setIsLoading(false));
      }
      }>
      Authentificate
    </button>
  )
};
export default LoginBtn;