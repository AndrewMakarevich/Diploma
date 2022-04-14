import { AxiosResponse } from "axios";
import { ComponentProps } from "react";
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

const LikeEssenceBtn = ({ sendLikeRequest, actualizeInfoAfterLike, onClick, ...restProps }: ILikePictureBtnProps) => {
  const { executeCallback: sendRequestForLike, isLoading } =
    useFetching<AxiosResponse<IPictureLikeResponseObj>>(sendLikeRequest);

  return (
    <LikeButton
      disabled={isLoading}
      onClick={async (e) => {
        if (onClick) {
          onClick(e);
        }

        await sendRequestForLike();
        await actualizeInfoAfterLike();
      }}
      {...restProps}>

    </LikeButton>
  )

};

export default LikeEssenceBtn;