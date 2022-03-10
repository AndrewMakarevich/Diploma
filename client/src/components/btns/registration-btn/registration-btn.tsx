import { useContext, useState } from "react";
import { Context } from "../../..";
import btnStyles from './registration-btn.module.css';

const RegistrationBtn = (
  { email, nickname, password, stylesById }:
    { email: string, nickname: string, password: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className={btnStyles['reg-btn']}
      disabled={isLoading}
      id={stylesById}
      onClick={() => {
        setIsLoading(true);
        userStore.registration(email, nickname, password).then(() => setIsLoading(false));
      }}>
      Registrate
    </button>
  )
};
export default RegistrationBtn;