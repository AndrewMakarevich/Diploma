import { useContext } from "react";
import { Context } from "../../..";

const LogoutBtn = ({ stylesById }: { stylesById?: string }) => {
  const { userStore } = useContext(Context);
  return (
    <button id={stylesById} onClick={() => userStore.logout()}>LogOut</button>
  )
}
export default LogoutBtn;