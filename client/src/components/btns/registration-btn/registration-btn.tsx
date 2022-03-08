import { useContext } from "react";
import { Context } from "../../..";

const RegistrationBtn = (
  { email, nickname, password, stylesById }:
    { email: string, nickname: string, password: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  return (
    <button id={stylesById} onClick={() => userStore.registration(email, nickname, password)}>Registrate</button>
  )
};
export default RegistrationBtn;