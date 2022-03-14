import userCabinetStyles from "./user-cabinet.module.css";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { Context } from "../..";
import LogoutBtn from "../../components/btns/logout-btn/logout-btn";
import LocationIcon from "../../assets/img/icons/location-icon/location-icon";

const UserCabinet = () => {
  const { userStore } = useContext(Context);
  return (
    <div className={userCabinetStyles["user-cabinet__wrapper"]}>
      <article className={userCabinetStyles["user-cabinet__main-info"]}>

        <p>{userStore.userData.isBanned ? "Account banned" : ""}</p>

        <img className={userCabinetStyles["user-cabinet__profile-avatar"]}
          alt="Profile avatar"
          src={`${process.env.REACT_APP_BACK_LINK}/img/avatar/${userStore.userData.avatar}`} />
        <img className={userCabinetStyles["user-cabinet__profile-background"]}
          alt="Profile background"
          src={`${process.env.REACT_APP_BACK_LINK}/img/profile-background/${userStore.userData.profileBackground}`} />
        <span className={userCabinetStyles["user-cabinet__profile-background_fogging"]}></span>

        <p className={userCabinetStyles["user-cabinet__user-nickname"]}>
          {userStore.userData.nickname}</p>
        <p className={userCabinetStyles["user-cabinet__user-fullname"]}>
          {`${userStore.userData.firstName || ''} ${userStore.userData.surname || ''}`}</p>
        <p className={userCabinetStyles["user-cabinet__user-location"]}>
          {userStore.userData.country && userStore.userData.city ?
            <>
              <LocationIcon />{`${userStore.userData.country}, ${userStore.userData.city}`}
            </>
            :
            null
          }
        </p>
        <p className={userCabinetStyles["user-cabinet__user-creation-date"]}>
          {new Date(userStore.userData.createdAt).toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </article>
      {/* User cabinet
            {
                Object.keys(userStore.userData).map(key => {
                    return <li>{`${key}: ${userStore.userData[key]}`}</li>
                })
            } */}
      <LogoutBtn stylesById="" />
      <Link to='adminPanel'>Test</Link>
      <Outlet />
    </div>
  )
};
export default observer(UserCabinet);