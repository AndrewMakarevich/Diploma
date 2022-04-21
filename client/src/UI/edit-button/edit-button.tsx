import { ComponentProps } from "react";
import buttonStyles from "./edit-button.module.css";
import EditIcon from "../../assets/img/icons/edit-icon/edit-icon";
import GoBackIcon from "../../assets/img/icons/go-back-icon/go-back-icon";

interface IEditButtonProps extends ComponentProps<"button"> {
  active: boolean;
}

const EditButton = ({ active, ...restProps }: IEditButtonProps) => {
  return <button className={buttonStyles["edit-button"]} {...restProps}>{active ? <GoBackIcon /> : <EditIcon />}</button>
};

export default EditButton;