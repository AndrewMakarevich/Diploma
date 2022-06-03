import selectStyles from "./my-select.module.css";
import { ComponentProps } from "react";

export interface MySelectOptionField {
  value: string | number | string[] | number[],
  name: string
}

export interface MySelectOptGroupField {
  name: string,
  options: MySelectOptionField[]
}

interface IMySelectProps extends ComponentProps<"select"> {
  fields: MySelectOptGroupField[] | MySelectOptionField[]
}

const MySelect = ({ className, fields, ...restProps }: IMySelectProps) => {
  const isOptGroupField = (field: any): field is MySelectOptGroupField => {
    return Boolean(field.options);
  }
  const optionValue = (option: MySelectOptionField) => {
    return Array.isArray(option.value) ? JSON.stringify(option.value) : option.value
  }

  return (
    <select className={`${selectStyles["select"]} ${className}`} {...restProps}>
      {
        fields.map(field => (
          isOptGroupField(field) ?
            <optgroup key={field.name} label={field.name}>
              {
                field.options.map(option => (
                  <option
                    key={option.name}
                    value={optionValue(option)}
                    label={option.name}></option>
                ))
              }
            </optgroup>
            :
            <option key={field.name} value={optionValue(field)} label={field.name}></option>
        ))
      }
    </select>
  )
};

export default MySelect;