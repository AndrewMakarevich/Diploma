import { AxiosResponse } from "axios";
import { ComponentProps } from "react";
import useFetching from "../../../hooks/useFetching";
import { IPictureLikeResponseObj } from "../../../interfaces/http/response/pictureLikeInterfaces";
import PictureLikeService from "../../../services/picture-like-service";
import LikeButton from "../../../UI/like-button/like-button";

interface ILikePictureBtnProps extends ComponentProps<"button"> {
  pictureId: number;
  actualizePictureLikes: Function;
  active: boolean
}

const LikePictureBtn = ({ pictureId, actualizePictureLikes, active, onClick, ...restProps }: ILikePictureBtnProps) => {
  const { executeCallback: interractWithPicture, isLoading } =
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

        await interractWithPicture();
        await actualizePictureLikes();
      }}
      active={active}
      {...restProps}>

    </LikeButton>
  )

};

export default LikePictureBtn;