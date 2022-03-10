import { useContext, useState } from "react";
import { Context } from "../../..";
import btnStyles from "./logout-btn.module.css";

const LogoutBtn = ({ stylesById }: { stylesById?: string }) => {
  const { userStore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className={btnStyles["logout-btn"]}
      disabled={isLoading}
      id={stylesById}
      onClick={() => {
        setIsLoading(true);
        userStore.logout().then(() => setIsLoading(false));
      }}>
      LogOut
    </button>
  )
}
export default LogoutBtn;