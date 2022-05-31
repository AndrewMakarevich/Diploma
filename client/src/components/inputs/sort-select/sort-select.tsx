import { ComponentProps } from "react";
import MySelect from "../../../UI/my-select/my-select";

interface optionObj {
  value: string | number | string[],
  name: string
}

interface IOptGroupObj {
  name: string,
  options: optionObj[]
}

interface ISortSelectProps extends ComponentProps<"select"> {
  selectOptions: IOptGroupObj[]
}

const SortSelect = ({ selectOptions, ...restProps }: ISortSelectProps) => {
  return (
    <MySelect {...restProps}>
      {
        selectOptions.map(optGroup =>
          <optgroup key={optGroup.name} label={optGroup.name}>
            {
              optGroup.options.map(option =>
                <option key={option.name} label={option.name} value={JSON.stringify(option.value)}></option>
              )
            }
          </optgroup>
        )
      }
    </MySelect>
  )
};

export default SortSelect;