import { useContext, useState } from "react";
import { Context } from "../../..";
import StandartButton from "../../../UI/standart-button/standart-button";
import UserValidator from "../../../validator/userValidator";
import btnStyles from './registration-btn.module.css';

interface IRegBtnProps {
  email: string,
  nickname: string,
  password: string,
  repPassword: string,
  stylesById?: string
}

const RegistrationBtn = (
  { email, nickname, password, repPassword, stylesById }: IRegBtnProps) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StandartButton
      className={btnStyles['reg-btn']}
      disabled={isLoading}
      id={stylesById}
      onClick={(e: React.ChangeEvent<any>) => {
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
    </StandartButton>
  )
};
export default RegistrationBtn;