import selectStyles from "./my-select.module.css";
import { ComponentProps } from "react";

const MySelect = ({ className, children, ...restProps }: ComponentProps<"select">) => {
  return (
    <select className={`${selectStyles["select"]} ${className}`} {...restProps}>
      {children}
    </select>
  )
};

export default MySelect;