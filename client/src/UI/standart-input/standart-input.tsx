import { ComponentProps } from "react";

import inputStyles from "./standart-input.module.css";

const StandartInput = ({ className, ...restProps }: ComponentProps<"input">) => {
  return <input className={`${inputStyles["input"]} ${className ? className : ""}`} {...restProps}>
  </input>
};

export default StandartInput;