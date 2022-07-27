import selectStyles from "./my-select.module.css";
import { ComponentProps } from "react";

export interface MySelectOptionField {
  value: string | number | string[] | number[] | null | undefined,
  name: string
}

export interface MySelectOptGroupField {
  name: string,
  orderByKey: string
}

interface IMySelectProps extends ComponentProps<"select"> {
  fields: MySelectOptGroupField[] | MySelectOptionField[]
}

const MySelect = ({ className, fields, ...restProps }: IMySelectProps) => {
  const isOptGroupField = (field: any): field is MySelectOptGroupField => {
    return Boolean(field.orderByKey);
  }

  return (
    <select className={`${selectStyles["select"]} ${className}`} {...restProps}>
      {
        fields.map(field => (
          isOptGroupField(field) ?
            <optgroup key={field.name} label={field.name}>
              {
                ["ASC", "DESC"].map(option => (
                  <option
                    key={option}
                    value={JSON.stringify([field.orderByKey, option])}
                    label={option === "ASC" ? "Ascending" : "Descending"}></option>
                ))
              }
            </optgroup>
            :
            <option key={field.name} value={JSON.stringify(field.value)} label={field.name}></option>
        ))
      }
    </select>
  )
};

export default MySelect;