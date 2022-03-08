import { useContext } from "react";
import { Context } from "../../..";

const LoginBtn = ({ email, password, stylesById }: { email: string, password: string, stylesById?: string }) => {
  const { userStore } = useContext(Context);
  return (
    <button id={stylesById} onClick={() => userStore.login(email, password)}>Authentificate</button>
  )
};
export default LoginBtn;