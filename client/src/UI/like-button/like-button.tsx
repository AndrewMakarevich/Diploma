import { ComponentProps, useEffect } from "react";
import LikeIcon from "../../assets/img/icons/like-icon/like-icon";
import buttonStyle from "./like-button.module.css";

interface ILikeButtonProps extends ComponentProps<"button"> {
  active: boolean;
}

const LikeButton = ({ className, active, ...restProps }: ILikeButtonProps) => {
  // useEffect(() => {
  //   console.log(active);
  // }, [active]);
  return (
    <button className={`${buttonStyle["like-button"]}`} {...restProps}>
      <LikeIcon className={buttonStyle["like-icon"]} active={active || false} />
    </button>
  );
};
export default LikeButton;
