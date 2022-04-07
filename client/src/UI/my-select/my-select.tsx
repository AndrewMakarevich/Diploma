import selectStyles from "./my-select.module.css";
import { ComponentProps } from "react";

const MySelect = (props: ComponentProps<any>) => {
  const { className, children, ...restProps } = props;
  return (
    <select className={`${selectStyles["select"]} ${className}`} {...restProps}>
      {children}
    </select>
  )
};

export default MySelect;