import { ComponentProps } from "react";
import MySelect, { MySelectOptGroupField } from "../../../UI/my-select/my-select";

interface ISortSelectProps extends ComponentProps<"select"> {
  selectOptions: MySelectOptGroupField[]
}

const SortSelect = ({ selectOptions, ...restProps }: ISortSelectProps) => {
  return (
    <MySelect fields={selectOptions} {...restProps}></MySelect>
  )
};

export default SortSelect;