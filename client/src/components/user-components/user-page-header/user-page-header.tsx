import { useState } from "react";
import headerStyles from "./user-page-header.module.css";
import EditIcon from "../../../assets/img/icons/edit-icon/edit-icon";
import LocationIcon from "../../../assets/img/icons/location-icon/location-icon";
import { userResObject } from "../../../interfaces/http/response/userInterfaces";
import returnUserAvatar from "../../../utils/img-utils/return-user-avatar";
import EditUserModal from "../modals/edit-user-modal/edit-user-modal";

interface IUserPageHeaderProps {
  userInfo: userResObject,
  isPersonalCabinet: boolean
}

const UserPageHeader = ({ userInfo, isPersonalCabinet }: IUserPageHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <article className={headerStyles["user-cabinet__main-info"]}>

        <p>{userInfo.isBanned ? "Account banned" : ""}</p>

        <button title="Edit info about myself" className={headerStyles["edit-user__btn"]} onClick={() => setIsOpen(true)}>
          {
            isPersonalCabinet ?
              <EditIcon id={headerStyles["edit-icon"]} />
              :
              null
          }

        </button>

        <img title="Your avatar" className={headerStyles["user-cabinet__profile-avatar"]}
          alt="Profile avatar"
          src={returnUserAvatar(userInfo.avatar)} />
        <img className={headerStyles["user-cabinet__profile-background"]}
          alt="Profile background"
          src={`${process.env.REACT_APP_BACK_LINK}/img/profile-background/${userInfo.profileBackground}`} />
        <span className={headerStyles["user-cabinet__profile-background_fogging"]}></span>

        <p title="Your nickname" className={headerStyles["user-cabinet__user-nickname"]}>
          {userInfo.nickname}</p>
        <p title="Your full name" className={headerStyles["user-cabinet__user-fullname"]}>
          {`${userInfo.firstName || ''} ${userInfo.surname || ''}`}</p>
        <p title="Your location" className={headerStyles["user-cabinet__user-location"]}>
          {userInfo.country && userInfo.city ?
            <>
              <LocationIcon />{`${userInfo.country}, ${userInfo.city}`}
            </>
            :
            null
          }
        </p>
        <p title="Account's date of creation" className={headerStyles["user-cabinet__user-creation-date"]}>
          {new Date(userInfo.createdAt).toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </article>
      {
        isPersonalCabinet ?
          <EditUserModal isOpen={isOpen} setIsOpen={setIsOpen} />
          :
          null
      }

    </>
  )
}

export default UserPageHeader;