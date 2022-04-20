import { AxiosResponse } from "axios";
import { ComponentProps, useContext } from "react";
import { Context } from "../../..";
import useFetching from "../../../hooks/useFetching";
import { IPictureLikeResponseObj } from "../../../interfaces/http/response/pictureLikeInterfaces";
import PictureLikeService from "../../../services/picture-like-service";
import LikeButton from "../../../UI/like-button/like-button";

interface ILikePictureBtnProps extends ComponentProps<"button"> {
  sendLikeRequest: Function;
  actualizeInfoAfterLike: Function;
  iconClassName?: string,
  active: boolean
}

const LikeEssenceBtn = ({ sendLikeRequest, actualizeInfoAfterLike, active, onClick, ...restProps }: ILikePictureBtnProps) => {
  const { userStore } = useContext(Context);
  const { executeCallback: sendRequestForLike, isLoading } =
    useFetching<AxiosResponse<IPictureLikeResponseObj>>(sendLikeRequest);

  return (
    <LikeButton
      disabled={isLoading}
      onClick={async (e) => {
        if (!userStore.isAuth) {
          alert("Authorize to have ability to like");
          return;
        }

        if (onClick) {
          onClick(e);
        }

        await sendRequestForLike();
        await actualizeInfoAfterLike();
      }}
      active={active}
      {...restProps}>

    </LikeButton>
  )

};

export default LikeEssenceBtn;