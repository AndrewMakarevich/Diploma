import { ComponentProps, useEffect } from "react";
import LikeIcon from "../../assets/img/icons/like-icon/like-icon";
import buttonStyle from "./like-button.module.css";

interface ILikeButtonProps extends ComponentProps<"button"> {
  iconClassName?: string,
  active: boolean;
}

const LikeButton = ({ iconClassName, className, active, ...restProps }: ILikeButtonProps) => {
  // useEffect(() => {
  //   console.log(active);
  // }, [active]);
  return (
    <button className={`${buttonStyle["like-button"]} ${className || ""}`} {...restProps}>
      <LikeIcon className={`${buttonStyle["like-icon"]} ${iconClassName || ""}`} active={active || false} />
    </button>
  );
};
export default LikeButton;
