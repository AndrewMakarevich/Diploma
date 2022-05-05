import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicGallery from "../../components/public-gallery/public-gallery";
import UserPageHeader from "../../components/user-components/user-page-header/user-page-header";
import { userResObject } from "../../interfaces/http/response/userInterfaces";
import UserService from "../../services/user-service";

const UserPage = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState<userResObject>({
    id: 0,
    roleId: 0,
    role: null,
    nickname: "",
    email: "",
    firstName: "",
    surname: "",
    avatar: "",
    profileBackground: "",
    country: "",
    city: "",
    isActivated: true,
    isBanned: false,
    createdAt: "",
    updatedAt: ""
  });

  useEffect(() => {
    UserService.getUserInfo(Number(userId)).then(({ data }) => setUserInfo(data))
  }, []);
  return (
    <>
      <UserPageHeader userInfo={userInfo} isPersonalCabinet={false} />
      <PublicGallery userId={Number(userId)} />
    </>

  )
};
export default UserPage;