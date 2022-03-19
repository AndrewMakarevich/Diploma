import { useContext, useState } from "react";
import { Context } from "../../..";
import UserValidator from "../../../validator/userValidator";
import btnStyles from './registration-btn.module.css';

const RegistrationBtn = (
  { email, nickname, password, repPassword, stylesById }:
    { email: string, nickname: string, password: string, repPassword: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={btnStyles['reg-btn']}
      disabled={isLoading}
      id={stylesById}
      onClick={(e) => {
        e.preventDefault();
        if (password !== repPassword) {
          alert('Passwords aren\'t equal to each other');
          return;
        }
        if (UserValidator.validateEmail(email) &&
          UserValidator.validateNickname(nickname) &&
          UserValidator.validatePassword(password)) {
          setIsLoading(true);
          userStore.registration(email, nickname, password).then(() => setIsLoading(false));
        }
      }}>
      Registrate
    </button>
  )
};
export default RegistrationBtn;