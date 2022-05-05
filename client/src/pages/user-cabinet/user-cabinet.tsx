import userCabinetStyles from "./user-cabinet.module.css";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { Context } from "../..";
import { routePaths } from "../../components/routes/paths";
import UserPageHeader from "../../components/user-components/user-page-header/user-page-header";

const UserCabinet = () => {
  const { userStore } = useContext(Context);

  return (
    <div className={userCabinetStyles["user-cabinet__wrapper"]}>
      <UserPageHeader userInfo={userStore.userData} isPersonalCabinet={true} />
      <nav className={userCabinetStyles["cabinet-navbar"]}>
        {
          userStore.isAdmin ?
            <Link to={routePaths.personalCabinet.adminPanel}>Admin panel</Link>
            :
            null
        }

        <Link to={routePaths.personalCabinet.main}>My Gallery</Link>
      </nav>
      <Outlet />
    </div>
  )
};
export default observer(UserCabinet);