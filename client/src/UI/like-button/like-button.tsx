import { ComponentProps } from "react";
import LikeIcon from "../../assets/img/icons/like-icon/like-icon";
import buttonStyle from "./like-button.module.css";

const LikeButton = (props: ComponentProps<any>) =>{
  const {className,active, ...restProps} = props;
  console.log(active);
  return (
    <button className={`${buttonStyle["like-button"]}`} {...restProps}>
      <LikeIcon className={buttonStyle["like-icon"]} active={active || false}/>
    </button>
  )
};
export default LikeButton;