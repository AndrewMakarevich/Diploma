import userCabinetStyles from "./user-cabinet.module.css";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Context } from "../..";
import LogoutBtn from "../../components/btns/logout-btn/logout-btn";
import LocationIcon from "../../assets/img/icons/location-icon/location-icon";
import EditUserModal from "../../components/modal-window/edit-user-modal/edit-user-modal";
import EditIcon from "../../assets/img/icons/edit-icon/edit-icon";
import { routePaths } from "../../components/routes/paths";

const UserCabinet = () => {
  const { userStore } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={userCabinetStyles["user-cabinet__wrapper"]}>
      <article className={userCabinetStyles["user-cabinet__main-info"]}>

        <p>{userStore.userData.isBanned ? "Account banned" : ""}</p>

        <button title="Edit info about myself" className={userCabinetStyles["edit-user__btn"]} onClick={() => setIsOpen(true)}>
          <EditIcon id={userCabinetStyles["edit-icon"]} />
        </button>

        <img title="Your avatar" className={userCabinetStyles["user-cabinet__profile-avatar"]}
          alt="Profile avatar"
          src={`${process.env.REACT_APP_BACK_LINK}/img/avatar/${userStore.userData.avatar}`} />
        <img className={userCabinetStyles["user-cabinet__profile-background"]}
          alt="Profile background"
          src={`${process.env.REACT_APP_BACK_LINK}/img/profile-background/${userStore.userData.profileBackground}`} />
        <span className={userCabinetStyles["user-cabinet__profile-background_fogging"]}></span>

        <p title="Your nickname" className={userCabinetStyles["user-cabinet__user-nickname"]}>
          {userStore.userData.nickname}</p>
        <p title="Your full name" className={userCabinetStyles["user-cabinet__user-fullname"]}>
          {`${userStore.userData.firstName || ''} ${userStore.userData.surname || ''}`}</p>
        <p title="Your location" className={userCabinetStyles["user-cabinet__user-location"]}>
          {userStore.userData.country && userStore.userData.city ?
            <>
              <LocationIcon />{`${userStore.userData.country}, ${userStore.userData.city}`}
            </>
            :
            null
          }
        </p>
        <p title="Account's date of creation" className={userCabinetStyles["user-cabinet__user-creation-date"]}>
          {new Date(userStore.userData.createdAt).toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </article>
      <EditUserModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <Link to={routePaths.personalCabinet.adminPanel}>Admin panel</Link>
      <Link to={routePaths.personalCabinet.myGallery}>My Gallery</Link>
      <Outlet />
    </div>
  )
};
export default observer(UserCabinet);