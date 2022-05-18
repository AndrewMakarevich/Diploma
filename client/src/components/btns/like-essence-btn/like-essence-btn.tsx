import { ComponentProps, useContext } from "react";
import { Context } from "../../..";
import useFetching from "../../../hooks/useFetching";
import LikeButton from "../../../UI/like-button/like-button";

interface ILikePictureBtnProps<T> extends ComponentProps<"button"> {
  sendLikeRequest: () => Promise<T>;
  actualizeInfoAfterLike: Function;
  iconClassName?: string,
  active: boolean
}

const LikeEssenceBtn = <T,>({ sendLikeRequest, actualizeInfoAfterLike, active, onClick, ...restProps }: ILikePictureBtnProps<T>) => {
  const { userStore } = useContext(Context);
  const { executeCallback: sendRequestForLike, isLoading } =
    useFetching(sendLikeRequest);

  return (
    <LikeButton
      disabled={isLoading}
      onClick={async (e) => {
        if (!userStore.isAuth) {
          alert("Authorize to have ability to like");
          return;
        }

        if (!userStore.userData.role?.addLike) {
          alert("You have no access to like pictures");
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