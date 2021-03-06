import inputStyles from "./search-input.module.css";
import SearchIcon from "../../assets/img/icons/search-icon/search-icon";
import { ComponentProps } from "react";

const SearchInput = ({ className, ...restProps }: ComponentProps<"input">) => {
  return (
    <label className={inputStyles["search-input__label"]}>
      <input className={`${inputStyles["search-input"]} ${className}`} placeholder="search" {...restProps}>

      </input>
      <span className={inputStyles["search-icon"]}><SearchIcon /></span>
    </label>
  )
};

export default SearchInput;