import { AxiosResponse } from "axios";
import { ComponentProps } from "react";
import useFetching from "../../../hooks/useFetching";
import { IPictureLikeResponseObj } from "../../../interfaces/http/response/pictureLikeInterfaces";
import PictureLikeService from "../../../services/picture-like-service";
import LikeButton from "../../../UI/like-button/like-button";

interface ILikePictureBtnProps extends ComponentProps<"button"> {
  pictureId: number;
  actualizeInfoAfterLike: Function;
  active: boolean
}

const LikeEssenceBtn = ({ pictureId, actualizeInfoAfterLike, active, onClick, ...restProps }: ILikePictureBtnProps) => {
  const { executeCallback: sendRequestForLike, isLoading } =
    useFetching<AxiosResponse<IPictureLikeResponseObj>>(async () => {
      await PictureLikeService.likePicture(pictureId)
    });

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
      active={active}
      {...restProps}>

    </LikeButton>
  )

};

export default LikeEssenceBtn;